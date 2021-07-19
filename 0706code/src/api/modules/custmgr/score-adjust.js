/*
 *
 *  Copyright (c) 2018-2025, Pactera JinXin Software All rights reserved.
 *
 */

import request from '../../request'
import requestUrl from '../../requestUrl'
// import requestParam from '../../requestParam'

// 客户积分调整历史查询
export function getCustScoreHisData(query) {
  return request({
    url: requestUrl('/custmgr/socreAdjust/queryCustSocreHis'),
    method: 'get',
    params: query
  })
}
