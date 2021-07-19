/*
 *
 *  Copyright (c) 2018-2025, Pactera JinXin Software All rights reserved.
 *
 */

import request from '../../request'
import requestUrl from '../../requestUrl'
// import requestParam from '../../requestParam'

// 查询抽奖活动列表
export function getLotteryActListData(query) {
  return request({
    url: requestUrl('/equitymgr/jackpot/getJackpotActList'),
    method: 'get',
    params: query
  })
}

// 抽奖活动基本信息创建修改
export function postSaveLotteryActBaseData(obj) {
  return request({
    url: requestUrl('/equitymgr/jackpot/saveJackpotActBase'),
    method: 'post',
    data: obj
  })
}

// 抽奖活动奖品配置创建修改
export function postSaveLotteryActProdData(obj) {
  return request({
    url: requestUrl('/equitymgr/jackpot/saveJackpotActProd'),
    method: 'post',
    data: obj
  })
}

// 抽奖活动创建模板配置及提交
export function postSaveLotteryActTemplateData(obj) {
  return request({
    url: requestUrl('/equitymgr/jackpot/saveJackpotActTemplate'),
    method: 'post',
    data: obj
  })
}

// 加载抽奖活动基本信息
export function getLotteryActBaseData(query) {
  return request({
    url: requestUrl('/equitymgr/jackpot/queryJackpotActBase'),
    method: 'get',
    params: query
  })
}

// 加载抽奖活动奖品配置
export function getLotteryActProdData(query) {
  return request({
    url: requestUrl('/equitymgr/jackpot/queryJackpotActProd'),
    method: 'get',
    params: query
  })
}

// 抽奖活动删除
export function postDelLotteryActData(obj) {
  return request({
    url: requestUrl('/equitymgr/jackpot/delJackpotAct'),
    method: 'post',
    data: obj
  })
}

// 抽奖活动上下线
export function postLineLotteryActData(obj) {
  return request({
    url: requestUrl('/equitymgr/jackpot/startOrEndJackpotAct'),
    method: 'post',
    data: obj
  })
}

/**
 * 修改活动顺序
 */
export function modifyLotteryActSort(obj) {
  return request({
    url: requestUrl('/equitymgr/jackpot/modifyJackpotActSort'),
    method: 'post',
    data: obj
  })
}

/**
 * 抽奖活动添加库存
 */
export function addLotteryActStock(obj) {
  return request({
    url: requestUrl('/equitymgr/jackpot/addJackpotActStock'),
    method: 'post',
    data: obj
  })
}

/**
 * 中奖名单预览
 */
export function getJackpotRecordList(query) {
  return request({
    url: requestUrl('/equitymgr/jackpot/getJackpotRecordList'),
    method: 'get',
    params: query
  })
}

/**
 * 发布中奖名单
 */
export function manualRelease(data) {
  return request({
    url: requestUrl(`/equitymgr/jackpot/manualRelease/${data}`),
    method: 'post'
  })
}
