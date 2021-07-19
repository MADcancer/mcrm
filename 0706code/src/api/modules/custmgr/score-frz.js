/*
 *
 *  Copyright (c) 2018-2025, Pactera JinXin Software All rights reserved.
 *
 */
import request from '../../request'
import requestUrl from '../../requestUrl'
// import requestParam from '../../requestParam'

// 客户积分冻结解冻历史查询
export function getCustScoreFrzHisData(query) {
  return request({
    url: requestUrl('/custmgr/custScoreFrzHis/queryCustScoreFrzHisByParam'),
    method: 'get',
    params: query
  })
}
