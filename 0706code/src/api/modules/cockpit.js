/*
 *
 *  Copyright (c) 2018-2025, Pactera JinXin Software All rights reserved.
 *
 */

import request from '../request'
import requestUrl from '../requestUrl'
import requestParam from '../requestParam'
/**
 * 智能搜索客户
 */
export function getAllCustList() {
  return request({
    url: requestUrl('/cm/custInfo/getAllCustList'),
    method: 'get',
  })
}
/**
 * 智能搜索产品
 */
 export function getAllProdList() {
  return request({
    url: requestUrl('/pm/prodInfo/getAllProdList'),
    method: 'get',
  })
}
/**
 * 查询一级部门
 */
export function getDept() {
  return request({
    url: requestUrl('/hp/assetdebtSum/getDept'),
    method: 'get',
  })
}
/**
 * 查询数据统计
 */
export function getImportIndex(params) {
  return request({
    url: requestUrl('/hp/assetdebtSum/getImportIndex'),
    method: 'get',
    params: requestParam(params, 'get')
  })
}
/**
 * 查询客户分布地图数据
 */
export function custDist(params) {
  return request({
    url: requestUrl('/cm/custInfo/custDist'),
    method: 'get',
    params: requestParam(params, 'get')
  })
}
/**
 * 查询区域客户明细
 */
export function getCustInfoByPro(params) {
  return request({
    url: requestUrl('/cm/custInfo/getCustInfoByPro'),
    method: 'get',
    params: requestParam(params, 'get')
  })
}
/**
 * 查询全行资产分布
 */
export function getAssetDist() {
  return request({
    url: requestUrl('/hp/assetdist/assetdist'),
    method: 'get',
  })
}
/**
 * 查询授信信息
 */
 export function creditinfo() {
  return request({
    url: requestUrl('/hp/creditlimitsum/creditinfo'),
    method: 'get',
  })
}
/**
 * 查询授信业务趋势图
 */
export function wholecredit(params) {
  return request({
    url: requestUrl('hp/creditlimitsum/wholecredit'),
    method: 'get',
    params: requestParam(params, 'get')
  })
}
/**
 * 查询客户资产TOP
 */
 export function custAssetTop(params) {
  return request({
    url: requestUrl('/hp/custassetscale/custassettop'),
    method: 'get',
    params: requestParam(params, 'get')
  })
}
/**
 * 查询营收报表
 */
 export function getprofitreport() {
  return request({
    url: requestUrl('/hp/checkprofit/getprofitreport'),
    method: 'get',
  })
}
/**
 * 查询授信使用
 */
export function custcredittop(params) {
  return request({
    url: requestUrl('/hp/creditlimitsum/custcredittop'),
    method: 'get',
    params: requestParam(params, 'get')
  })
}
/**
 * 申请审批接口
 */
export function approveOperation(params) {
  return request({
    url: requestUrl(`/platform/homepageMgr/approveOperation`),
    method: 'post',
    data: params
  })
}