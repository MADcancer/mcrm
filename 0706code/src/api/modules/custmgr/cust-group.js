/*
 *
 *  Copyright (c) 2018-2025, Pactera JinXin Software All rights reserved.
 *
 */

import request from '../../request'
import requestUrl from '../../requestUrl'
// import requestParam from '../../requestParam'

/**
 * 搜索
 */
export function getCustGroupPage (params) {
  return request({
    url: requestUrl('/custmgr/custGroup/getCustGroupPage'),
    method: 'get',
    params: params
  })
}

/**
 * 添加客户组
 */
export function saveCustGroup (params) {
  return request({
    url: requestUrl('/custmgr/custGroup/saveCustGroup'),
    method: 'post',
    data: params
  })
}

/**
 * 根据编号查询客户组
 */
export function getByGroupNo (groupNo) {
  return request({
    url: requestUrl(`/custmgr/custGroup/getByGroupNo/${groupNo}`),
    method: 'get'
  })
}

/**
 * 修改客户组
 */
export function updateCustGroup (params) {
  return request({
    url: requestUrl('/custmgr/custGroup/updateCustGroup'),
    method: 'post',
    data: params
  })
}

/**
 * 客户组添加客户（条件筛选）
 */
export function addGroupCust (formData) {
  return request({
    url: requestUrl(`/custmgr/custGroup/addGroupCust`),
    method: 'post',
    data: formData
  })
}

/**
 * 客户组导入客户
 */
export function addCustByExcel (formData, groupNo) {
  return request({
    url: requestUrl(`/custmgr/custGroup/addCustByExcel/${groupNo}`),
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  })
}

/**
 * 下载客户组导入模板
 */
export function downloadTemplate () {
  return request({
    url: requestUrl('/custmgr/custGroup/downloadTemplate'),
    responseType: 'arraybuffer',
    method: 'get'
  })
}

/**
 * 删除客户组
 */
export function removeByGroupNo (params) {
  return request({
    url: requestUrl(`/custmgr/custGroup/removeByGroupNo`),
    method: 'post',
    data: params
  })
}

/**
 * 保存客户组积分调整信息
 */
export function saveCustGroupAdjust (params) {
  return request({
    url: requestUrl('/custmgr/custGroup/saveCustGroupAdjust'),
    method: 'post',
    data: params
  })
}

/**
 * 保存客户组积分冻结信息
 */
export function saveCustGroupFrz (params) {
  return request({
    url: requestUrl('/custmgr/custGroup/saveCustGroupFrz'),
    method: 'post',
    data: params
  })
}

/**
 * 保存客户组黑名单调整信息
 */
export function saveCustGroupBlk (params) {
  return request({
    url: requestUrl('/custmgr/custGroup/saveCustGroupBlk'),
    method: 'post',
    data: params
  })
}

/**
 * 查询客户组组内客户列表
 */
export function qryCustList (params) {
  return request({
    url: requestUrl('/custmgr/custGroup/qryCustList'),
    method: 'get',
    params: params
  })
}

/**
 * 查询客户组申请未审批情况
 */
export function qryGroupApproveStatus (params) {
  return request({
    url: requestUrl('/custmgr/custGroup/qryGroupApproveStatus'),
    method: 'get',
    params: params
  })
}

/**
 * 审批列表-查看组内客户列表
 */
export function qryCustListByApproveId (params) {
  return request({
    url: requestUrl('/custmgr/custGroup/qryCustGroupApplyInfo'),
    method: 'get',
    params: params
  })
}
