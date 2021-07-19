/*
 *
 *  Copyright (c) 2018-2025, Pactera JinXin Software All rights reserved.
 *
 */

import request from '../../request'
import requestUrl from '../../requestUrl'
// import requestParam from '../../requestParam'

// 查询权益活动列表
export function getEquityActListData(query) {
  return request({
    url: requestUrl('/equitymgr/activity/queryEquityAct'),
    method: 'get',
    params: query
  })
}

// 创建编辑权益活动基本信息
export function postSaveEquityActBaseData(obj) {
  return request({
    url: requestUrl('/equitymgr/activity/saveEquityActBase'),
    method: 'post',
    data: obj
  })
}

// 创建及修改权益活动规则配置
export function postSaveEquityActRuleData(id, obj) {
  return request({
    url: requestUrl('/equitymgr/activity/saveEquityActRule' + (id != null ? `/${id}` : '')),
    method: 'post',
    data: obj
  })
}

// 创建及提交权益活动模板配置
export function postSaveEquityActTemplateData(obj) {
  return request({
    url: requestUrl('/equitymgr/activity/saveEquityAct'),
    method: 'post',
    params: obj
  })
}

// 加载权益活动基本信息
export function getEquityActBaseData(id) {
  return request({
    url: requestUrl('/equitymgr/activity/queryEquityActBase' + (id != null ? `/${id}` : '')),
    method: 'get'
  })
}

// 加载权益活动规则配置
export function getEquityActRuleData(id) {
  return request({
    url: requestUrl('/equitymgr/activity/qyeryEquityActRule' + (id != null ? `/${id}` : '')),
    method: 'get'
  })
}

// 权益活动上线下线
export function postLineEquityActData(obj) {
  return request({
    url: requestUrl('/equitymgr/activity/startOrEndEquityAct'),
    method: 'put',
    data: obj
  })
}

// 权益活动删除
export function postDelEquityActData(obj) {
  return request({
    url: requestUrl('/equitymgr/activity/delEquityAct'),
    method: 'delete',
    data: obj
  })
}

// 商品查询
export function getProdListData(query) {
  return request({
    url: requestUrl('/suppliermgr/prodMgr/getProd'),
    method: 'get',
    params: query
  })
}

// 机构树查询
export function getOrgTreeData(obj) {
  return request({
    url: requestUrl('/sys/org/findAllTree'),
    method: 'post',
    data: obj
  })
}

/**
 * 修改活动顺序
 */
export function modifyEquityActSort(obj) {
  return request({
    url: requestUrl('/equitymgr/activity/modifyEquityActSort'),
    method: 'post',
    data: obj
  })
}

/**
 * 权益活动添加库存
 */
export function addEquityActStock(obj) {
  return request({
    url: requestUrl('/equitymgr/activity/addEquityActStock'),
    method: 'post',
    data: obj
  })
}
