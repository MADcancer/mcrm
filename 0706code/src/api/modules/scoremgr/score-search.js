/*
 *
 *  Copyright (c) 2018-2025, Pactera JinXin Software All rights reserved.
 *
 */

import request from '../../request'
import requestUrl from '../../requestUrl'

/**
 * 综合积分查询
 */
export function getCustAccuPoints(params) {
  return request({
    url: requestUrl(`/scoremgr/custScore/getCustAccuPointsByParam`),
    method: 'get',
    params: params
  })
}

/**
 * 综合积分查询导出
 */
export function exportCustAccuPoints(params) {
  return request({
    url: requestUrl('/scoremgr/custScoreExport/exportCustAccuPointsByParam'),
    method: 'get',
    responseType: 'arraybuffer',
    params: params
  })
}

/**
 * 客户对账单
 */
export function getCustAccuPointsVerify(params) {
  return request({
    url: requestUrl(`/scoremgr/custScore/getCustAccuPointsVerifyByParam`),
    method: 'get',
    params: params
  })
}

/**
 * 客户对账单导出
 */
export function exportCustAccuPointsVerify(params) {
  return request({
    url: requestUrl('/scoremgr/custScoreExport/exportCustAccuPointsVerifyByParam'),
    method: 'get',
    responseType: 'arraybuffer',
    params: params
  })
}

/**
 * 客户积分兑换历史
 */
export function getCustPointsHis(params) {
  return request({
    url: requestUrl(`/scoremgr/custScore/getCustPointsExchangeHisByParam`),
    method: 'get',
    params: params
  })
}

/**
 * 客户积分兑换历史导出
 */
export function exportCustPointsHis(params) {
  return request({
    url: requestUrl('/scoremgr/custScoreExport/exportCustPointsExchangeHisByParam'),
    method: 'get',
    responseType: 'arraybuffer',
    params: params
  })
}

/**
 * 客户积分流水
 */
export function getCustPointsAccount(params) {
  return request({
    url: requestUrl(`/scoremgr/custScore/getCustPointsAccountByParam`),
    method: 'get',
    params: params
  })
}

/**
 * 客户积分流水导出
 */
export function exportCustPointsAccount(params) {
  return request({
    url: requestUrl('/scoremgr/custScoreExport/exportCustPointsAccountByParam'),
    method: 'get',
    responseType: 'arraybuffer',
    params: params
  })
}
