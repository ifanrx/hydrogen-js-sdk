const axios = require('axios')
const constants = require('core-module/constants')
const HError = require('core-module/HError')
const utils = require('core-module/utils')
const { getUploadFileConfig } = require('core-module/upload')
const SparkMD5 = require('spark-md5')
require('regenerator-runtime/runtime')

const createFileChunks = file => {
  const chunkSize = 1 * 1024 * 1024 // 又拍云限制每次只能上传 1MB

  let current = 0
  let chunks = [] // 保存与返回所有切片的参数

  while (current < file.size) {
    // 文件进行切片
    const chunk = file.slice(current, current + chunkSize)
    chunks.push(chunk)
    current = current + chunkSize
  }
  return chunks
}

module.exports = function (BaaS) {
  /**
   * 上传文件。
   * @memberof BaaS
   * @param {FileParams} fileParams 文件参数
   * @param {FileMeta} metaData 文件元信息
   * @return {Promise<any>}
   */
  BaaS.uploadFile = function (fileParams, metaData) {
    let fileObj = fileParams.fileObj
    if (!fileObj || typeof fileObj !== 'object' || !fileObj.name) {
      throw new HError(605)
    }

    if (
      fileParams.fileName !== undefined &&
      typeof fileParams.fileName !== 'string'
    ) {
      throw new HError(605)
    }

    if (!metaData) {
      metaData = {}
    } else if (typeof metaData !== 'object') {
      throw new HError(605)
    }

    let config = {}
    let fileName = fileParams.fileName || fileObj.name
    return getUploadFileConfig(fileName, utils.replaceQueryParams(metaData))
      .then(res => {
        config = {
          id: res.data.id,
          fileName: fileName,
          policy: res.data.policy,
          authorization: res.data.authorization,
          uploadUrl: res.data.upload_url,
          filePath: fileObj.name,
          destLink: res.data.path,
        }

        let fd = new FormData()
        fd.append(constants.UPLOAD.UPLOAD_FILE_KEY, fileObj, fileName)
        fd.append('policy', config.policy)
        fd.append('authorization', config.authorization)

        return axios.post(config.uploadUrl, fd)
      })
      .then(res => {
        let result = {}
        let data = res.data
        result.status = 'ok'
        result.path = config.destLink
        result.file = {
          id: config.id,
          path: config.destLink,
          name: config.fileName,
          created_at: data.time,
          mime_type: data.mimetype,
          cdn_path: data.url,
          size: data.file_size,
        }
        res.data = result
        return res
      })
  }

  /**
   * 上传大文件（断点续传）。
   * @memberof BaaS
   * @param {FileParams} fileParams 文件参数
   * @param {FileMeta} metaData 文件元信息
   * @return {Promise<any>}
   */
  BaaS.multipartUploadFile = async function (fileParams, metaData) {
    const { fileObj } = fileParams
    if (!fileObj || typeof fileObj !== 'object' || !fileObj.name) {
      throw new HError(605)
    }

    if (
      fileParams.fileName !== undefined &&
      typeof fileParams.fileName !== 'string'
    ) {
      throw new HError(605)
    }

    if (!metaData) {
      metaData = {}
    } else if (typeof metaData !== 'object') {
      throw new HError(605)
    }

    // let uuid = ''
    // let authorization = ''
    // let date = ''
    // let uploadUrl = ''

    const initMultipartUpload = () => {
      return Promise.resolve({
        data: {
          authorization: '',
          path: '',
          upload_url: `https://v0.api.upyun.com/cloud-minapp-45042/${fileObj.name}`,
          created_at: '',
          id: '',
          cdn_path: '',
          name: '',
          date: '',
          multi_uuid: '',
          multi_part_id: '',
        },
      })
    }

    const multipartUpload = async data => {
      const chunks = createFileChunks(fileObj)
      const md5 = SparkMD5.ArrayBuffer.hash(chunks)
      // console.log('md5', md5)

      let uuid = data.multi_uuid
      let nextPartId = data.multi_part_id

      for (let chunk of chunks) {
        const res = await axios.put(data.upload_url, chunk, {
          headers: {
            Authorization: data.authorization,
            'x-date': data.date,
            'x-upyun-multi-stage': 'upload',
            'x-upyun-multi-uuid': uuid,
            'x-upyun-part-id': nextPartId,
          },
        })

        uuid = res.headers['x-upyun-multi-uuid']
        nextPartId = res.headers['x-upyun-next-part-id']

        // todo 存储 md5

        if (nextPartId === -1) break
      }

      return { file: data, multi_uuid: uuid, md5 }
    }

    const completeMultipartUpload = async data => {
      const getConfig = () => {
        return new Promise(resolve => {
          const status = 'success'
          resolve({ upload_status: status })
        })
      }

      return getConfig().then(res => {
        if (res.data.upload_status !== 'success') {
          throw new HError(605)
        }

        return data
      })
    }

    return initMultipartUpload()
      .then(res => multipartUpload(res.data))
      .then(res => completeMultipartUpload(res))
  }
}
