const FtpDeploy = require('ftp-deploy');
const ftpDeploy = new FtpDeploy();
const cfg = require('./config')
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

ftpDeploy.deploy(config).then(res => {
  console.log('上传成功:', res)
})