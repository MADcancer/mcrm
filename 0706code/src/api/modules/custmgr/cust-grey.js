/*
 *
 *  Copyright (c) 2018-2025, Pactera JinXin Software All rights reserved.
 *
 */

import request from '../../request'
import requestUrl from '../../requestUrl'
// import requestParam from '../../requestParam'

// 灰度名单客户查询
export function getCustGreyListData(query) {
  return request({
    url: requestUrl('/equitymgr/gray/getCustGrayInfoList'),
    method: 'get',
    params: query
  })
}

export function saveCustGroup (params) {
  return request({
    url: requestUrl('/equitymgr/gray/saveCustGrayInfo'),
    method: 'post',
    data: params
  })
}

export function getCustGrayInfo(query) {
  return request({
    url: requestUrl('/equitymgr/gray/getCustGrayInfo'),
    method: 'get',
    params: query
  })
}

export function updateCustGrayInfo (params) {
  return request({
    url: requestUrl('/equitymgr/gray/updateCustGrayInfo'),
    method: 'post',
    data: params
  })
}

export function delCustGrayInfo(query) {
  return request({
    url: requestUrl('/equitymgr/gray/delCustGrayInfo'),
    method: 'post',
    params: query
  })
}
