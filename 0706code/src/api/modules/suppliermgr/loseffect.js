/*
 *
 *  Copyright (c) 2018-2025, Pactera JinXin Software All rights reserved.
 *
 */

import request from '../../request'
import requestUrl from '../../requestUrl'

/**
 * 券码短信提醒配置(获取)
 */
export function getTicket (formData) {
  return request({
    url: requestUrl(`/sys/expire/getTicketCfg`),
    method: 'get',
    data: formData
  })
}

/**
 * 券码短信提醒配置(更新,保存)
 */
export function updateTicket(formData) {
  return request({
    url: requestUrl(`/sys/expire/updateTicketCfg`),
    method: 'post',
    data: formData
  })
}
