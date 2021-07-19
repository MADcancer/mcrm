/*
 *
 *  Copyright (c) 2018-2025, Pactera JinXin Software All rights reserved.
 *
 */

import request from '../../request'
import requestUrl from '../../requestUrl'
// import requestParam from '../../requestParam'

// 票选活动信息查询(列表)
export function getVoteActList(query) {
  return request({
    url: requestUrl('/equitymgr/vote/getVoteActList'),
    method: 'get',
    params: query
  })
}

// 保存修改票选活动
export function saveVoteActBase(obj) {
  return request({
    url: requestUrl('/equitymgr/vote/saveVoteActBase'),
    method: 'post',
    data: obj
  })
}

// 上下线票选活动
export function startOrEndVoteAct(obj) {
  return request({
    url: requestUrl('/equitymgr/vote/startOrEndVoteAct'),
    method: 'post',
    data: obj
  })
}

// 票选活动基本信息查询(单个)
export function queryVoteAct(query) {
  return request({
    url: requestUrl('/equitymgr/vote/queryVoteAct'),
    method: 'get',
    params: query
  })
}

// 保存票选活动商品图片
export function saveVoteActProdImg(obj) {
  return request({
    url: requestUrl('/equitymgr/vote/saveVoteActProdImg'),
    method: 'post',
    data: obj
  })
}

// 删除票选活动
export function delVoteAct(obj) {
  return request({
    url: requestUrl('/equitymgr/vote/delVoteAct'),
    method: 'post',
    data: obj
  })
}

export function queryVoteActProd(query) {
  return request({
    url: requestUrl('/equitymgr/vote/queryVoteActProd'),
    method: 'get',
    params: query
  })
}
