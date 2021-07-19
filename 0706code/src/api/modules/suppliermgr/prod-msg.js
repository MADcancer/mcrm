/*
 *
 *  Copyright (c) 2018-2025, Pactera JinXin Software All rights reserved.
 *
 */

import request from '../../request'
import requestUrl from '../../requestUrl'

/**
 * 短信模板查询
 */
export function queryMsgTemplate(params) {
  return request({
    url: requestUrl(`/suppliermgr/msgTemplate/queryMsgTemplate`),
    method: 'get',
    params: params
  })
}

/**
 * 创建及修改短信模板
 */
export function saveMsgTemplate(params) {
  return request({
    url: requestUrl('/suppliermgr/msgTemplate/saveMsgTemplate'),
    method: 'post',
    data: params
  })
}

/**
 * 短信模板详情
 */
export function getMsgTemplateDetail(id) {
  return request({
    url: requestUrl(`/suppliermgr/msgTemplate/getMsgTemplateDetail/${id}`),
    method: 'get'
  })
}

/**
 * 短信模板删除
 */
export function delMsgTemplate(params) {
  return request({
    url: requestUrl('/suppliermgr/msgTemplate/delMsgTemplate'),
    method: 'delete',
    data: params
  })
}
