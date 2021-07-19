/*
 *
 *  Copyright (c) 2018-2025, Pactera JinXin Software All rights reserved.
 *
 */

import request from '../../request'
import requestUrl from '../../requestUrl'
// import requestParam from '../../requestParam'

// 白名单客户查询
export function getEsDbsWhiteL(query) {
  return request({
    url: requestUrl('/custmgr/esDbsWhiteList/selectAllEsDbsWhiteList'),
    method: 'get',
    params: query
  })
}

/**
 * 导入白名单
 */
export function addWhiteListByExcel(formData) {
  return request({
    url: requestUrl('/custmgr/esDbsWhiteList/addWhiteListByExcel'),
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  })
}

/**
 * 下载模板
 */
export function downloadTemplate () {
  return request({
    url: requestUrl('/custmgr/esDbsWhiteList/downloadTemplate'),
    responseType: 'arraybuffer',
    method: 'get'
  })
}

/**
 * 导出数据
 */
export function exportEsDbsWhiteList () {
  return request({
    url: requestUrl('/custmgr/esDbsWhiteList/exportEsDbsWhiteList'),
    responseType: 'arraybuffer',
    method: 'get'
  })
}
