/*
 *
 *  Copyright (c) 2018-2025, Pactera JinXin Software All rights reserved.
 *
 */

import request from '../../request'
import requestUrl from '../../requestUrl'
// import requestParam from '../../requestParam'

// 黑名单客户查询
export function getCustBlackListData(query) {
  return request({
    url: requestUrl('/custmgr/custBlack/queryCustBlackList'),
    method: 'get',
    params: query
  })
}
