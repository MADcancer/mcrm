import { Message } from 'element-ui'
/**
 * 邮箱
 * @param {*} s
 */
export function isEmail (s) {
  // return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(s)
  return /^[a-z0-9]+([._\\-]*[a-z0-9])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,}){1,})$/.test(s)
}

/**
 * 手机号码
 * @param {*} s
 */
export function isMobile (s) {
  return /^1[0-9]{10}$/.test(s)
}

/**
 * 电话号码
 * @param {*} s
 */
export function isPhone (s) {
  return /^([0-9]{3,4}-)?[0-9]{7,8}$/.test(s)
}

/**
 * URL地址
 * @param {*} s
 */
export function isURL (s) {
  return /^http[s]?:\/\/.*/.test(s)
}

/**
 * 图片大小不能大于2M
 */
export function imgSize (size) {
  // 图片大小
  if (size > 2 * 1024 * 1024) {
    Message.warning('上传文件大小不能超过 2MB!')
    return true
  }

  return false
}

/**
 * 判断图片是否是指定尺寸
 */
export function validateImg (file, width, height) {
  return new Promise((resolve, reject) => {
    let _URL = window.URL || window.webkitURL
    let img = new Image()
    img.onload = function () {
      let valid = img.width === width && (height === 0 || img.height === height)
      // eslint-disable-next-line prefer-promise-reject-errors
      valid ? resolve() : reject()
    }
    img.src = _URL.createObjectURL(file)
  })
}

/**
 * 校验图片大小以及图片格式
 */
export function imgFormat (file) {
  const type = file.name.split('.')[file.name.split('.').length - 1]
  // 图片格式
  if (!(type === 'png' || type === 'jpg' || type === 'jpeg')) {
    Message.warning('只支持上传.png, .jpg, .jpeg格式的图片！')
    return true
  }
  // 图片大小
  if (file.size > 2 * 1024 * 1024) {
    Message.warning('上传文件大小不能超过 2MB!')
    return true
  }

  return false
}

/**
 * 检验文件格式
 */
export function fileFormat (file) {
  const type = file.name.split('.')[file.name.split('.').length - 1]
  // 文件格式
  if (!(type === 'xlsx' || type === 'xls')) {
    Message.warning('只支持上传.xls, .xlsx格式的文件！')
    return true
  }

  return false
}

export function roleIdValidate (id) {
  return /^[a-zA-Z0-9]{4}$/.test(id)
}
