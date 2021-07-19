/*
 *
 *  Copyright (c) 2018-2025, Pactera JinXin Software All rights reserved.
 *
 */

import request from '../../request'
import requestUrl from '../../requestUrl'

/**
 * 列表获取
 */
export function getBusiUserList(params) {
  return request({
    url: requestUrl(`/suppliermgr/busiUser/getBusiUserList`),
    method: 'get',
    params: params
  })
}

/**
 * 创建及修改
 */
export function saveBusiUser(params) {
  return request({
    url: requestUrl('/suppliermgr/busiUser/saveBusiUser'),
    method: 'post',
    data: params
  })
}

/**
 * 详情
 */
export function getBusiUser(id) {
  return request({
    url: requestUrl(`/suppliermgr/busiUser/getBusiUser`),
    method: 'get',
    params: {id: id}
  })
}

/**
 * 删除
 */
export function delBusiUser(params) {
  return request({
    url: requestUrl('/suppliermgr/busiUser/delBusiUser'),
    method: 'post',
    data: params
  })
}
