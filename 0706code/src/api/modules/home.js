/*
 *
 *  Copyright (c) 2018-2025, Pactera JinXin Software All rights reserved.
 *
 */

import request from '../request'
import requestUrl from '../requestUrl'

/**
 * 查询待办事项
 */
export function qryWorkNum(params, that) {
  // 调试 that
  // console.log(that.businessType)
  return request({
    url: requestUrl(`/platform/homepageMgr/qryWorkNum`),
    method: 'get',
    params: params
  })
}

/**
 * 客户参与活动情况列表
 */
export function qryActivityCustInfo(params) {
  return request({
    url: requestUrl(`/platform/homepageMgr/qryActivityCustInfo`),
    method: 'get',
    params: params
  })
}

/**
 * 查询活动看板信息
 */
export function qryActivityBoard(params) {
  return request({
    url: requestUrl(`/platform/homepageMgr/qryActivityBoard`),
    method: 'get',
    params: params
  })
}

/**
 * 积分权益审批列表
 */
export function qryCustList(params) {
  return request({
    url: requestUrl(`/platform/homepageMgr/getApproveListPage`),
    method: 'get',
    params: params
  })
}

/**
 * 申请审批接口
 */
export function approveOperation(params) {
  return request({
    url: requestUrl(`/platform/homepageMgr/approveOperation`),
    method: 'post',
    data: params
  })
}

/**
 * 撤回审批
 */
export function withdrawApply(params) {
  return request({
    url: requestUrl(`/platform/homepageMgr/withdrawApply`),
    method: 'post',
    data: params
  })
}

/**
 * 其他入口
 */

export function tokenLogin(params) {
  return request({
    url: requestUrl(`/sys/tokenLogin?token=${params}`),
    method: 'post'
  })
}
