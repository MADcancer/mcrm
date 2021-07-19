/*
 *
 *  Copyright (c) 2018-2025, Pactera JinXin Software All rights reserved.
 *
 */

import request from '../../request'
import requestUrl from '../../requestUrl'

// 客户积分查询
export function getCustScore(query) {
  return request({
    url: requestUrl('/peakseason/getCustScore'),
    method: 'get',
    params: query
  })
}

/**
 * 客户积分明细
 */
export function getCustPointsL(params) {
  return request({
    url: requestUrl(`/peakseason/getCustPointsAccountByParam`),
    method: 'get',
    params: params
  })
}

/**
 * 单个客户兑换
 */
export function custExchange(params) {
  return request({
    url: requestUrl(`/peakseason/custExchange`),
    method: 'post',
    data: params
  })
}

/**
 * 批量客户模板
 */
export function downloadTemplate () {
  return request({
    url: requestUrl('/peakseason/uploadFlowFile'),
    responseType: 'arraybuffer',
    method: 'get'
  })
}

/**
 * 批量上传
 */
export function custExchangeL (formData) {
  return request({
    url: requestUrl(`/peakseason/custExchangeList`),
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  })
}

/**
 * 获取错误数据
 */
export function custErrExchangeL(params) {
  return request({
    url: requestUrl(`/peakseason/custErrExchangeList`),
    method: 'get',
    params: params
  })
}
