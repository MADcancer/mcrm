/*
 *
 *  Copyright (c) 2018-2025, Pactera JinXin Software All rights reserved.
 *
 */

import request from '../../request'
import requestUrl from '../../requestUrl'

/**
 * 获取理财达标条件列表
 */
export function qryDbsFinancialRuleList(params) {
  return request({
    url: requestUrl(`/scoremgr/dbsFinancialRule/qryDbsFinancialRuleList`),
    method: 'get',
    params: params
  })
}

/**
 * 积分达标条件创建修改
 */
export function editDbsFinancialRule(params) {
  return request({
    url: requestUrl('/scoremgr/dbsFinancialRule/editDbsFinancialRule'),
    method: 'post',
    data: params
  })
}

/**
 * 获取积分达标条件信息
 */
export function getDbsFinancialRuleById(id) {
  return request({
    url: requestUrl(`/scoremgr/dbsFinancialRule/getDbsFinancialRuleById/${id}`),
    method: 'get'
  })
}

/**
 * 积分达标条件删除
 */
export function delRule(params) {
  return request({
    url: requestUrl('/scoremgr/dbsFinancialRule/delFinancialRuleById'),
    method: 'post',
    data: params
  })
}
