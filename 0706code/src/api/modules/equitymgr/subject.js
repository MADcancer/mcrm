/*
 *
 *  Copyright (c) 2018-2025, Pactera JinXin Software All rights reserved.
 *
 */

import request from '../../request'
import requestUrl from '../../requestUrl'
// import requestParam from '../../requestParam'

export function getSubInfoList(query) {
  return request({
    url: requestUrl('/equitymgr/subject/getSubInfoList'),
    method: 'get',
    params: query
  })
}

export function saveSubInfo(obj) {
  return request({
    url: requestUrl('/equitymgr/subject/saveSubInfo'),
    method: 'post',
    data: obj
  })
}

export function getSubInfo(query) {
  return request({
    url: requestUrl('/equitymgr/subject/getSubInfo'),
    method: 'get',
    params: query
  })
}

export function delSubInfo(obj) {
  return request({
    url: requestUrl('/equitymgr/subject/delSubInfo'),
    method: 'post',
    data: obj
  })
}
