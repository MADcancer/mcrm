/*
 *
 *  Copyright (c) 2018-2025, Pactera JinXin Software All rights reserved.
 *
 */

import request from '../../request'
import requestUrl from '../../requestUrl'

/**
 * 搜索积分规则
 */
export function getScoreByType(ruleType, channel) {
  return request({
    url: requestUrl(`/scoremgr/scoreRule/getScoreRule/${ruleType}/${channel}`),
    method: 'get'
  })
}

/**
 * 搜索积分规则网银
 */
export function getScoreByTypeWy(ruleType, channel) {
  return request({
    url: requestUrl(`/scoremgr/scoreRule/getScoreRuleWy/${ruleType}/${channel}`),
    method: 'get'
  })
}

/**
 * 更新积分规则
 */
export function update(params) {
  return request({
    url: requestUrl('/scoremgr/scoreRule/updateScoreRule'),
    method: 'post',
    data: params
  })
}

/**
 * 更新积分规则
 */
export function updateWy(params) {
  return request({
    url: requestUrl('/scoremgr/scoreRule/updateScoreRuleWy'),
    method: 'post',
    data: params
  })
}

/**
 * 查询积分折算率
 */
export function getScoreConvert(type) {
  return request({
    url: requestUrl(`/scoremgr/scoreConvert/getScoreConvert/${type}`),
    method: 'get'
  })
}

/**
 * 更新积分折算率
 */
export function updateConvert(params) {
  return request({
    url: requestUrl('/scoremgr/scoreConvert/updateScoreConvert'),
    method: 'post',
    data: params
  })
}

/**
 * 录入积分说明信息
 */
export function saveScoreDesc(params) {
  return request({
    url: requestUrl('/scoremgr/scoreDesc/saveScoreDesc'),
    method: 'post',
    data: params
  })
}

/**
 * 获取当前渠道积分说明
 */
export function qryScoreDescByChannel(params) {
  return request({
    url: requestUrl(`/scoremgr/scoreDesc/qryScoreDescByChannel`),
    method: 'get',
    params: params
  })
}

/**
 * 查询旺季营销规则
 */
export function getDroolsRule(params) {
  return request({
    url: requestUrl(`/droolsmgr/getDroolsRule/tdtsmst`),
    method: 'get',
    params: params
  })
}

/**
 * 编辑旺季营销
 */
export function updateDroolsRule(params) {
  return request({
    url: requestUrl('/droolsmgr/updateDroolsRule/tdtsmst'),
    method: 'post',
    data: params
  })
}

/**
 * 发布旺季营销
 */
export function publishDroolsRule(params) {
  return request({
    url: requestUrl('/droolsmgr/publishDroolsRule/tdtsmst'),
    method: 'post',
    data: params
  })
}
