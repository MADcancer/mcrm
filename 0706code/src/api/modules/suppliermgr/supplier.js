/*
 *
 *  Copyright (c) 2018-2025, Pactera JinXin Software All rights reserved.
 *
 */

import request from '../../request'
import requestUrl from '../../requestUrl'

/**
 * 供应商管理查询
 */
export function qrySupplierList(params) {
  return request({
    url: requestUrl(`/suppliermgr/supplier/qrySupplierList`),
    method: 'get',
    params: params
  })
}

/**
 * 供应商保存修改
 */
export function saveSupplier(params) {
  return request({
    url: requestUrl(`/suppliermgr/supplier/saveSupplier`),
    method: 'post',
    data: params
  })
}

/**
 * 供应商删除
 */
export function delSupplier(params) {
  return request({
    url: requestUrl(`/suppliermgr/supplier/delSupplier`),
    method: 'post',
    data: params
  })
}

/**
 * 单个供应商预算信息查询
 */
export function qryCostBudgets(suppId) {
  return request({
    url: requestUrl(`/suppliermgr/supplier/qryCostBudgetList/${suppId}`),
    method: 'get'
  })
}

/**
 * 单个供应商信息查询
 */
export function qrySupplier(suppId) {
  return request({
    url: requestUrl(`/suppliermgr/supplier/qrySupplier/${suppId}`),
    method: 'get'
  })
}

/**
 * 供应商预算保存修改
 */
export function saveSupplierBudget(params) {
  return request({
    url: requestUrl(`/suppliermgr/supplier/saveSupplierBudget`),
    method: 'post',
    data: params
  })
}
