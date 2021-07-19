/*
 *
 *  Copyright (c) 2018-2025, Pactera JinXin Software All rights reserved.
 *
 */

import request from '../../request'
import requestUrl from '../../requestUrl'

/**
 * 接口列表
 */
export function qryInterfaceList(params) {
  return request({
    url: requestUrl(`/scoremgr/interfaceMgr/qryInterfaceList`),
    method: 'get',
    params: params
  })
}

/**
 * 删除接口
 */
export function delInterface(params) {
  return request({
    url: requestUrl(`/scoremgr/interfaceMgr/delInterface`),
    method: 'post',
    data: params
  })
}

/**
 * 编辑接口
 */
export function editInterface(params) {
  return request({
    url: requestUrl(`/scoremgr/interfaceMgr/editInterface`),
    method: 'post',
    data: params
  })
}

/**
 * 获取单条数据
 */
export function getInterfaceById(id) {
  return request({
    url: requestUrl(`/scoremgr/interfaceMgr/getInterfaceById/${id}`),
    method: 'get'
  })
}
