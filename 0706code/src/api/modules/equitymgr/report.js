/*
 *
 *  Copyright (c) 2018-2025, Pactera JinXin Software All rights reserved.
 *
 */

import request from '../../request'
import requestUrl from '../../requestUrl'
// import requestParam from '../../requestParam'

// 权益发放记录
export function getEquityRelaseRecord(query) {
  return request({
    url: requestUrl('/report/getEquityRelaseRecord'),
    method: 'get',
    params: query
  })
}

/**
 * 权益发放记录导出
 */
export function exportRecord(query) {
  return request({
    url: requestUrl('/reportExport/exportEquityRelaseRecord'),
    method: 'get',
    responseType: 'arraybuffer',
    params: query
  })
}

/**
 * 查询点豆对账单
 */
export function qryStartbeanL(query) {
  return request({
    url: requestUrl('/report/qryCustStartbeanVerifyList'),
    method: 'get',
    params: query
  })
}

/**
 * 点豆发放明细查询
 */
export function qryStartbeanGetL(query) {
  return request({
    url: requestUrl('/report/qryCustStartbeanGetList'),
    method: 'get',
    params: query
  })
}

/**
 * 权益发放记录导出
 */
export function exportStartbeanGetL(query) {
  return request({
    url: requestUrl('/reportExport/exportCustStartbeanGetList'),
    method: 'get',
    responseType: 'arraybuffer',
    params: query
  })
}

/**
 * 权益订单查询
 */
export function qryEquityOrderList(query) {
  return request({
    url: requestUrl('/report/qryEquityOrderList'),
    method: 'get',
    params: query
  })
}

/**
 * 供应商对账单导出
 */
export function exportSupplierVerifyL(query) {
  return request({
    url: requestUrl('/reportExport/exportSupplierVerifyList'),
    method: 'get',
    responseType: 'arraybuffer',
    params: query
  })
}

/**
 * 供应商对账单查询
 */
export function qrySupplierVerifyL(query) {
  return request({
    url: requestUrl('/report/qrySupplierVerifyList'),
    method: 'get',
    params: query
  })
}

/**
 * 活动商品查询
 */
export function queryProdStock(query) {
  return request({
    url: requestUrl('/report/queryProdStock'),
    method: 'get',
    params: query
  })
}

/**
 * 活动商品导出
 */
export function exportProdStock(query) {
  return request({
    url: requestUrl('/reportExport/exportProdStock'),
    method: 'get',
    responseType: 'arraybuffer',
    params: query
  })
}

export function queryTicketCode(query) {
  return request({
    url: requestUrl('/report/queryTicketCode'),
    method: 'get',
    params: query
  })
}

export function exportTicketCode(query) {
  return request({
    url: requestUrl('/reportExport/exportTicketCode'),
    method: 'get',
    responseType: 'arraybuffer',
    params: query
  })
}

export function qryEquityOrderOne(id) {
  return request({
    url: requestUrl(`/report/qryEquityOrderOne?id=${id}`),
    method: 'get'
  })
}

export function addLogisticsInfo(formData) {
  return request({
    url: requestUrl(`/report/addLogisticsInfo`),
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  })
}

/**
 * 商品当前库存报表查询
 */
export function qryProdStock(query) {
  return request({
    url: requestUrl('/report/qryProdStock'),
    method: 'get',
    params: query
  })
}

/**
 * 商品当前库存报表导出
 */
export function exportProdCurStock(query) {
  return request({
    url: requestUrl('/reportExport/exportProdCurStock'),
    method: 'get',
    responseType: 'arraybuffer',
    params: query
  })
}

/**
 * 权益订单报表导出
 */
export function exportOrder(query) {
  return request({
    url: requestUrl('/reportExport/exportOrder'),
    method: 'get',
    responseType: 'arraybuffer',
    params: query
  })
}

/**
 * 查询补充物流提醒天数
 */
export function qryLogiDayFlag(query) {
  return request({
    url: requestUrl('/report/qryLogiDayFlag'),
    method: 'get',
    params: query
  })
}

/**
 * 设置补充物流提醒天数
 */
export function setLogiDayFlag(data) {
  return request({
    url: requestUrl('/report/setLogiDayFlag '),
    method: 'post',
    data: data
  })
}

/**
 * 商品库存扣减记录查询
 */
export function qryProdReduceRecord(query) {
  return request({
    url: requestUrl('/report/qryProdReduceRecord'),
    method: 'get',
    params: query
  })
}

/**
 * 商品库存扣减记录报表导出
 */
export function exportProdReduceRecord(query) {
  return request({
    url: requestUrl('/reportExport/exportProdReduceRecord'),
    method: 'get',
    responseType: 'arraybuffer',
    params: query
  })
}

/**
 * 权益订单上传文件内的订单数
 */
export function getFileOrderSize(formData) {
  return request({
    url: requestUrl('/report/getFileOrderSize'),
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  })
}

/**
 * 导出上传执行结果明细
 */
export function exportOrderOperation(query) {
  return request({
    url: requestUrl('/suppliermgr/orderOperation/exportOrderOperation'),
    method: 'get',
    responseType: 'arraybuffer',
    params: query
  })
}

/**
 * 供应商上传文件内的订单数
 */
export function suppAddLogisticsInfo(formData) {
  return request({
    url: requestUrl('/suppliermgr/orderOperation/suppAddLogisticsInfo'),
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  })
}

/**
 * 供应商查询订单
 */
export function getEquityOrderList(query) {
  return request({
    url: requestUrl('/supplierView/getEquityOrderList'),
    method: 'get',
    params: query
  })
}

/**
 * 权益订单取消订单
 */
export function orderCancel(data, channel) {
  return request({
    url: requestUrl(`/report/orderCancel/${channel}`),
    method: 'post',
    data: data
  })
}

/**
 * 审批列表-查看积分取消列表
 */
export function getOrderCancelList (params) {
  return request({
    url: requestUrl('/report/getOrderCancelList'),
    method: 'get',
    params: params
  })
}

/**
 * 查询奖池抽奖参与情况列表
 */
export function getJackpotActReport (params) {
  return request({
    url: requestUrl('/report/getJackpotActReport'),
    method: 'get',
    params: params
  })
}

/**
 * 奖池抽奖参与情况导出
 */
export function exportJackpotActReport(query) {
  return request({
    url: requestUrl('/reportExport/exportJackpotActReport'),
    method: 'get',
    responseType: 'arraybuffer',
    params: query
  })
}

/**
 * 查询奖池抽奖参与情况中奖记录
 */
export function getJackpotOrderReport(params) {
  return request({
    url: requestUrl('/report/getJackpotOrderReport'),
    method: 'get',
    params: params
  })
}

/**
 * 奖池抽奖参与情况中奖记录导出
 */
export function exportJackpotOrderReport(query) {
  return request({
    url: requestUrl('/reportExport/exportJackpotOrderReport'),
    method: 'get',
    responseType: 'arraybuffer',
    params: query
  })
}
