import request from '../request'
import requestUrl from '../requestUrl'

/**
 * 获取优惠券类型列表
 */
export function selectAllYhmType (params) {
  return request({
    url: requestUrl(`/equitymgr/yhmType/selectAllYhmType`),
    method: 'get',
    params: params
  })
}

/**
 * 优惠券类型创建修改
 */
export function editYhmType (data) {
  return request({
    url: requestUrl(`/equitymgr/yhmType/editYhmType`),
    method: 'post',
    data: data
  })
}

/**
 * 获取优惠券类型
 */
export function getYhmTypeById(id) {
  return request({
    url: requestUrl(`/equitymgr/yhmType/getYhmTypeById/${id}`),
    method: 'get'
  })
}

/**
 * 删除优惠券类型
 */
export function delYhmTypeById(data) {
  return request({
    url: requestUrl(`/equitymgr/yhmType/delYhmTypeById`),
    method: 'post',
    data: data
  })
}

/**
 * 获取优惠券信息列表
 */
export function selectAllYhmInfo (params) {
  return request({
    url: requestUrl(`/equitymgr/yhmInfo/selectAllYhmInfo`),
    method: 'get',
    params: params
  })
}

/**
 * 创建优惠券
 */
export function editYhmInfo (data) {
  return request({
    url: requestUrl(`/equitymgr/yhmInfo/editYhmInfo`),
    method: 'post',
    data: data
  })
}

/**
 * 获取优惠券信息
 */
export function getYhmInfoById (id) {
  return request({
    url: requestUrl(`/equitymgr/yhmInfo/getYhmInfoById/${id}`),
    method: 'get'
  })
}

/**
 * 删除优惠券
 */
export function delYhmInfoById(data) {
  return request({
    url: requestUrl(`/equitymgr/yhmInfo/delYhmInfoById`),
    method: 'post',
    data: data
  })
}

/**
 * 优惠券作废
 */
export function delYhmCode(data) {
  return request({
    url: requestUrl(`/equitymgr/yhmInfo/delYhmCode`),
    method: 'post',
    data: data
  })
}

/**
 * 生成券码
 */
export function createYhmCode(data) {
  return request({
    url: requestUrl(`/equitymgr/yhmInfo/createYhmCode`),
    method: 'post',
    data: data
  })
}

/**
 * 获取优惠券券码列表
 */
export function selectAllYhmCodeInfo (param) {
  return request({
    url: requestUrl(`/equitymgr/yhmInfo/selectAllYhmCodeInfo`),
    method: 'get',
    params: param
  })
}

/**
 * 下载券码
 */
export function exportYhmCode (param) {
  return request({
    url: requestUrl(`/equitymgr/yhmInfo/exportYhmCode`),
    responseType: 'arraybuffer',
    method: 'get',
    params: param
  })
}
