import request from '../request'
import requestUrl from '../requestUrl'
import requestParam from '../requestParam'

// 获取验证码
export function captcha (uuid) {
  return requestUrl(`/captcha.jpg?uuid=${uuid}`)
}

// 登录
export function login (params) {
  return request({
    url: requestUrl('/sys/login'),
    method: 'post',
    data: requestParam(params)
  })
}

// 退出
export function logout () {
  return request({
    url: requestUrl('/sys/logout'),
    method: 'post',
    data: requestParam()
  })
}

// 上传文件
export function upload (formData) {
  // let { onUploadProgress } = {
  //   onUploadProgress: function (progressEvent) {
  //     console.log(progressEvent.loaded / progressEvent.total * 100 | 0)
  //   }
  // }
  // console.log(onUploadProgress)
  return request({
    url: requestUrl('/sys/file/upload'),
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    // onUploadProgress: progressEvent => {
    //   // 对原生进度事件的处理
    //   console.log(111)
    //   console.log(progressEvent.loaded)
    // },
    data: formData
  })
}

// 文件下载
export function download (url) {
  return request({
    url: requestUrl('/sys/file/download'),
    method: 'get',
    params: url
  })
}

// 获取下拉菜单参数
export function getOptions (params) {
  return request({
    url: requestUrl('/sys/dict/item/getItemByType'),
    method: 'get',
    params: params
  })
}

// 获取字典
export function getAllDictItem (params) {
  return request({
    url: requestUrl('/sys/dict/item/getAllDictItem'),
    method: 'get'
  })
}
