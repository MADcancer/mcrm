import request from '../request'
import requestUrl from '../requestUrl'
import requestParam from '../requestParam'
// import isInteger from 'lodash/isInteger'

// 获取日志列表
export function list (params) {
  return request({
    url: requestUrl('/sys/dict/list'),
    method: 'get',
    params: requestParam(params, 'get')
  })
}

// 获取字典信息
export function info (id) {
  return request({
    url: requestUrl(`/sys/dict/info/${id}`),
    method: 'get',
    params: requestParam({}, 'get')
  })
}

// 删除字典
export function del (params) {
  return request({
    url: requestUrl('/sys/dict/delete'),
    method: 'post',
    data: requestParam(params, 'post', false)
  })
}

// 添加字典
export function add (params) {
  return request({
    url: requestUrl('/sys/dict/save'),
    method: 'post',
    data: requestParam(params)
  })
}

// 修改字典
export function update (params) {
  return request({
    url: requestUrl('/sys/dict/update'),
    method: 'post',
    data: requestParam(params)
  })
}

// 获取字典项列表
export function listItem (dictId) {
  return request({
    url: requestUrl(`/sys/dict/item/list/${dictId}`),
    method: 'get',
    params: requestParam({}, 'get')
  })
}

// 删除字典项
export function delItem (id) {
  return request({
    url: requestUrl(`/sys/dict/item/delete/${id}`),
    method: 'delete',
    data: requestParam({}, 'delete', false)
  })
}

// 添加字典项
export function addItem (params) {
  return request({
    url: requestUrl('/sys/dict/item/save'),
    method: 'post',
    data: requestParam(params)
  })
}

// 修改字典项
export function updateItem (params) {
  return request({
    url: requestUrl('/sys/dict/item/update'),
    method: 'post',
    data: requestParam(params)
  })
}
