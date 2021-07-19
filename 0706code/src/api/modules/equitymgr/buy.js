/*
 *
 *  Copyright (c) 2018-2025, Pactera JinXin Software All rights reserved.
 *
 */

import request from '../../request'
import requestUrl from '../../requestUrl'
// import requestParam from '../../requestParam'

// 查询抢购活动列表
export function getBuyActListData(query) {
  return request({
    url: requestUrl('/equitymgr/buy/getBuyActList'),
    method: 'get',
    params: query
  })
}

// 创建抢购基本信息
export function postSaveBuyActBaseData(obj) {
  return request({
    url: requestUrl('/equitymgr/buy/saveBuyActBase'),
    method: 'post',
    data: obj
  })
}

// 创建抢购商品配置
export function postSaveBuyActProdData(obj) {
  return request({
    url: requestUrl('/equitymgr/buy/saveBuyActProd'),
    method: 'post',
    data: obj
  })
}

// 创建抢购模版配置
export function postSaveBuyActTemplateData(obj) {
  return request({
    url: requestUrl('/equitymgr/buy/saveBuyActTemplate'),
    method: 'post',
    data: obj
  })
}

// 加载抢购基本信息
export function getBuyActBaseData(query) {
  return request({
    url: requestUrl('/equitymgr/buy/queryBuyActBase'),
    method: 'get',
    params: query
  })
}

// 加载抢购活动商品配置
export function getBuyActProdData(query) {
  return request({
    url: requestUrl('/equitymgr/buy/queryBuyActProd'),
    method: 'get',
    params: query
  })
}

// 抢购活动上下线
export function postLineBuyActData(obj) {
  return request({
    url: requestUrl('/equitymgr/buy/startOrEndBuyAct'),
    method: 'post',
    data: obj
  })
}

// 抢购活动删除
export function postDelBuyActData(obj) {
  return request({
    url: requestUrl('/equitymgr/buy/delBuyAct'),
    method: 'post',
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

// 解除灰度上线
export function removeGray(query) {
  return request({
    url: requestUrl(`/equitymgr/buy/removeGray?actId=${query}`),
    method: 'post'
  })
}

export function addBuyProdCount(obj) {
  return request({
    url: requestUrl('/equitymgr/buy/addBuyProdCount'),
    method: 'post',
    data: obj
  })
}
