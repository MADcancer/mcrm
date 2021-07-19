/*
 *
 *  Copyright (c) 2018-2025, Pactera JinXin Software All rights reserved.
 *
 */

import request from '../../request'
import requestUrl from '../../requestUrl'
// import requestParam from '../../requestParam'

export function getCustInfoListData(query) {
  return request({
    url: requestUrl('/custmgr/custInfo/getCustInfo'),
    method: 'get',
    params: query
  })
}

export function postScoreFrzData(obj) {
  return request({
    url: requestUrl('/custmgr/custScoreFrzHis/saveCustScoreFrzHis'),
    method: 'post',
    data: obj
  })
}

export function postScoreAdjustData(obj) {
  return request({
    url: requestUrl('/custmgr/socreAdjust/saveCustSocreAdjustApply'),
    method: 'post',
    data: obj
  })
}

export function postBlackApplyData(obj) {
  return request({
    url: requestUrl('/custmgr/custBlack/custBlackApply'),
    method: 'post',
    data: obj
  })
}

export function getEquitiesListData(query) {
  return request({
    url: requestUrl('/custmgr/custEquities/queryCustEquities'),
    method: 'get',
    params: query
  })
}

/**
 * 冻结解冻审批详情
 */
export function custScoreApprove(query) {
  return request({
    url: requestUrl(`/custmgr/custScoreFrzHis/queryCustScoreApprove/${query.id}/${query.type}`),
    method: 'get'
  })
}
