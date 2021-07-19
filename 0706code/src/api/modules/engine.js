import request from '../request'
import requestUrl from '../requestUrl'

/**
 * 模板下载
 */
export function downloadTemplate (type) {
  return request({
    url: requestUrl(`/droolsmgr/uploadDroolsFile/${type}`),
    responseType: 'arraybuffer',
    method: 'get'
  })
}

/**
 * 上传引擎文件
 */
export function updateDrools (formData) {
  return request({
    url: requestUrl(`/droolsmgr/updateDrools`),
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  })
}

/**
 * 发布
 */
export function publishDrools(params) {
  return request({
    url: requestUrl(`/droolsmgr/publishDrools?type=${params}`),
    method: 'post',
    data: params
  })
}

/**
 * 上传引擎文件
 */
export function updateDroolsTemplate (formData) {
  return request({
    url: requestUrl(`/droolsmgr/updateDroolsTemplate`),
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  })
}
