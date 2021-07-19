/*
 *
 *  Copyright (c) 2018-2025, Pactera JinXin Software All rights reserved.
 *
 */

import request from '../../request'
import requestUrl from '../../requestUrl'

/**
 * 商品查询
 */
export function getProd(params) {
  return request({
    url: requestUrl(`/suppliermgr/prodMgr/getProd`),
    method: 'get',
    params: params
  })
}

/**
 * 商品保存修改(基本信息)
 */
export function saveProd(params) {
  return request({
    url: requestUrl(`/suppliermgr/prodMgr/saveProd`),
    method: 'post',
    data: params
  })
}

/**
 * 商品保存修改(图片配置)
 */
export function saveProdImg(params) {
  return request({
    url: requestUrl(`/suppliermgr/prodMgr/saveProdImg`),
    method: 'post',
    data: params
  })
}

/**
 * 商品保存修改(劵码导入)
 */
export function saveCode (formData) {
  return request({
    url: requestUrl(`/suppliermgr/prodMgr/saveCode`),
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  })
}

/**
 * 商品保存修改(劵码模板下载)
 */
export function uploadCodeFile() {
  return request({
    url: requestUrl('/suppliermgr/prodMgr/uploadCodeFile'),
    method: 'get',
    responseType: 'arraybuffer'
  })
}

/**
 * 商品保存修改(短信模板)
 */
export function saveProdMsg(params) {
  return request({
    url: requestUrl('/suppliermgr/prodMgr/saveProdMsg'),
    method: 'post',
    data: params
  })
}

/**
 * 商品信息删除
 */
export function delProd(params) {
  return request({
    url: requestUrl('/suppliermgr/prodMgr/delProd'),
    method: 'post',
    data: params
  })
}

/**
 * 单条商品查询
 */
export function getProdOne(param) {
  return request({
    url: requestUrl(`/suppliermgr/prodMgr/getProdOne`),
    method: 'get',
    params: param
  })
}

/**
 * 劵码查询
 */
export function getCode(param) {
  return request({
    url: requestUrl(`/suppliermgr/prodMgr/getCode`),
    method: 'get',
    params: param
  })
}

/**
 * 是否导入券码
 */
export function getCodeCount(param) {
  return request({
    url: requestUrl(`/suppliermgr/prodMgr/getCodeCount`),
    method: 'get',
    params: param
  })
}

/**
 * 券码导出
 */
export function exportCodeFile(prodId) {
  return request({
    url: requestUrl(`/suppliermgr/prodMgr/exportCodeFile/${prodId}`),
    method: 'get',
    responseType: 'arraybuffer'
  })
}

/**
 * 添加库存
 */
export function addProdCount(param) {
  return request({
    url: requestUrl(`/suppliermgr/prodMgr/addProdCount`),
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: param
  })
}

/**
 * 获取券码最近的失效日期
 */
export function getProdExpireDate(param) {
  return request({
    url: requestUrl(`/suppliermgr/prodMgr/getProdExpireDate`),
    method: 'get',
    params: param
  })
}

/**
 * 券码失效日期延长
 */
export function extendDate(param) {
  return request({
    url: requestUrl(`/suppliermgr/prodMgr/extendProdExpireDate`),
    method: 'post',
    data: param
  })
}
