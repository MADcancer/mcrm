import request from '../request'
import requestUrl from '../requestUrl'
import requestParam from '../requestParam'

// 获取用户列表
export function list (params) {
  return request({
    url: requestUrl('/sys/user/list'),
    method: 'get',
    params: requestParam(params, 'get')
  })
}

// 获取用户信息
export function info (id) {
  return request({
    url: requestUrl('/sys/user/info' + (id != null ? `/${id}` : '')),
    method: 'get',
    params: requestParam({}, 'get')
  })
}

// 修改密码
export function updatePassword (params) {
  return request({
    url: requestUrl('/sys/user/password'),
    method: 'post',
    data: requestParam(params)
  })
}

// 添加用户
export function add (params) {
  return request({
    url: requestUrl('/sys/user/save'),
    method: 'post',
    data: requestParam(params)
  })
}

// 修改用户
export function update (params) {
  return request({
    url: requestUrl('/sys/user/update'),
    method: 'post',
    data: requestParam(params)
  })
}

// 删除用户
export function del (params) {
  return request({
    url: requestUrl('/sys/user/delete'),
    method: 'post',
    data: requestParam(params, 'post', false)
  })
}

// 查供应商机构树
export function findAllTreeSupp (params) {
  return request({
    url: requestUrl('/sys/org/findAllTreeSupp'),
    method: 'post',
    data: requestParam(params, 'get')
  })
}

// 查机构树
export function findAllTree (params) {
  return request({
    url: requestUrl('/sys/org/findAllTree'),
    method: 'post',
    data: requestParam(params, 'get')
  })
}
