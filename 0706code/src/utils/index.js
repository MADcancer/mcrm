/**
 * 是否有权限
 * @param {*} key
 */
export function isAuth (key) {
  return JSON.parse(sessionStorage.getItem('permissions') || '[]').indexOf(key) !== -1 || false
}

/**
 * 获取路由名称, 根据url地址
 * @param {*} url
 */
export function getRouteNameByUrl (url) {
  let val = /.*\/(.*)\.html/.exec(url)
  return val && val.length >= 1 ? val[1] : ''
}

/**
 * 树形数据转换
 * @param {*} data
 * @param {*} id
 * @param {*} pid
 */
export function treeDataTranslate (data, id = 'id', pid = 'parentId') {
  var res = []
  var temp = {}
  for (var i = 0; i < data.length; i++) {
    temp[data[i][id]] = data[i]
  }
  for (var k = 0; k < data.length; k++) {
    if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
      if (!temp[data[k][pid]]['children']) {
        temp[data[k][pid]]['children'] = []
      }
      if (!temp[data[k][pid]]['_level']) {
        temp[data[k][pid]]['_level'] = 1
      }
      data[k]['_level'] = temp[data[k][pid]]._level + 1
      temp[data[k][pid]]['children'].push(data[k])
    } else {
      res.push(data[k])
    }
  }
  return res
}

/**
 * 获取字符串字节长度
 * @param {*} s
 */
export function getStringLength (s) {
  return s.replace(/[\u4e00-\u9fa5\uff00-\uffff]/g, '**').length
}

/**
 * 获取uuid
 */
export function getUUID () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    return (c === 'x' ? (Math.random() * 16 | 0) : ('r&0x3' | '0x8')).toString(16)
  })
}

/**
 * 获取域名
 */
export function baseUrl () {
  if (!window.location.origin) {
    window.location.origin = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '')
  }
  // 本地测试 TODO
  if (window.location.origin.indexOf('http://localhost') !== -1) {
    return 'https://poiptt.szbank.net'
  }
  return window.location.origin
}

/**
 * 处理上传数据
 */
export function paramTrim (param) {
  for (const key in param) {
    if (param[key]) {
      param[key] = param[key].toString().trim()
    }
  }
  return param
}

/**
 * 获取url参数
 */
export function getUrlKey(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)')
    // eslint-disable-next-line no-sparse-arrays
    .exec(window.location.href) || [, ''])[1].replace(/\+/g, '%20')) || null
}

export function resetForm(name, that) {
  // 判断ie10以及以下
  let isIE10 = window.navigator.userAgent.indexOf('MSIE') >= 1
  let ele = that.$refs[name].$el.getElementsByTagName('input')[0]
  if (isIE10) {
    let form = document.createElement('form')
    let beforInput = ele.nextSibling
    let parentInput = ele.parentNode
    form.appendChild(ele)
    form.reset()
    parentInput.insertBefore(ele, beforInput)
  } else {
    ele.value = null
  }
}

export function isEmpty(value) {
  if (value === null || value === undefined || !value) return true
  if (Array.isArray(value) && !value.length) return true
  if (JSON.stringify(value) === '{}') return true
  return false
}

export function deepCopy(source) {
  if (!source) return
  let target
  if (typeof source === 'object') {
    // 根据source类型判断是新建一个数组还是对象
    target = Array.isArray(source) ? [] : {}
    // 遍历source，并且判断是source的属性才拷贝
    for (let key in source) {
      if (source.hasOwnProperty(key)) {
        if (typeof source[key] !== 'object') {
          target[key] = source[key]
        } else {
          // 如果内部属性存在复杂数据类型，使用递归实现深拷贝
          target[key] = deepCopy(source[key])
        }
      }
    }
  } else {
    target = source
  }
  return target
}

export function toNonExponential(num) {
  let m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/)
  return num.toFixed(Math.max(0, (m[1] || '').length - m[2]))
}
