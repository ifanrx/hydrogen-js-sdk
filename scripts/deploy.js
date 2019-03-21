const FtpDeploy = require('ftp-deploy')
const ftpDeploy = new FtpDeploy();
const cfg = require('./config')
const GitHub = require('github-api')
const pkg = require('../package.json')
const jsonFormat = require('json-format')
const gh = new GitHub({
  token: cfg.githubToken
})

const targetBranch = 'master'  // 需要提交到的分支
const versionMapping = [
  ['latestVersionWechat', pkg.version],
  ['latestVersionAlipay', pkg.versions.alipay],
  ['latestVersionWeb', pkg.versions.web]
]
const config = {
  user: cfg.user,
  password: cfg.password,
  host: cfg.host,
  port: cfg.port,
  localRoot: cfg.localRoot,
  remoteRoot: cfg.remoteRoot,
  include: ['*web*.js', '*.zip'],
  exclude: ['dist/**/*.map'],
  deleteRemote: false,
  forcePasv: true
}

/**
 * 部署到 FTP
 * @return {*|PromiseLike<T | never>|Promise<T | never>}
 */
function uploadToFtp() {
  return ftpDeploy.deploy(config).then(res => {
    console.log('上传成功', res)
  })
}

/**
 * 修改多平台的版本号
 * @param data
 * @return {*}
 */
function modifyVersion(data) {
  let modified = false
  versionMapping.forEach(([name, version]) => {
    if (data.variables[name] !== version) {
      modified = true
      data.variables[name] = version
    }
  })

  return modified ? data : false
}

/**
 * 更新文档版本号
 * @return {Promise<void>}
 */
async function updateDocVersion() {
  let repo = gh.getRepo('ifanrx', 'hydrogen-js-sdk-doc')
  let res = await repo.getContents(targetBranch, 'book.json', true)
  let content = modifyVersion(res.data)

  if (content === false) return

  await repo.writeFile(targetBranch,
    'book.json',
    jsonFormat(content, {
      type: 'space',
      size: 2
    }),
    'UPADTE VERSION',
    {
      author: {
        name: 'ifanrx',
        email: 'ifanrx@ifanr.com'
      }
    })
}

async function run() {
  await uploadToFtp()
  await updateDocVersion()
}

try {
  run()
} catch (e) {
  console.log(e)
}
