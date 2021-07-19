/*
 *
 *  Copyright (c) 2018-2025, Pactera JinXin Software All rights reserved.
 *
 */

import request from '../../request'
import requestUrl from '../../requestUrl'

/**
 * 获取积分达标条件列表
 */
export function qryDbsPointRuleL(params) {
  return request({
    url: requestUrl(`/scoremgr/dbsPointRule/qryDbsPointRuleList`),
    method: 'get',
    params: params
  })
}

/**
 * 积分达标条件创建修改
 */
export function editDbsPointRule(params) {
  return request({
    url: requestUrl('/scoremgr/dbsPointRule/editDbsPointRule'),
    method: 'post',
    data: params
  })
}

/**
 * 获取积分达标条件信息
 */
export function getDbsPointRuleById(id) {
  return request({
    url: requestUrl(`/scoremgr/dbsPointRule/getDbsPointRuleById/${id}`),
    method: 'get'
  })
}

/**
 * 积分达标条件删除
 */
export function delRule(params) {
  return request({
    url: requestUrl('/scoremgr/dbsPointRule/delRuleById'),
    method: 'post',
    data: params
  })
}
