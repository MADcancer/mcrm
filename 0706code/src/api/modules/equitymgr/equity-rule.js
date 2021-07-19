import request from '../../request'
import requestUrl from '../../requestUrl'
// import requestParam from '../../requestParam'

export function getBoardInfoL(query) {
  return request({
    url: requestUrl('/equitymgr/board/getBoardInfoList'),
    method: 'get',
    params: query
  })
}

export function editBoardInfo(obj) {
  return request({
    url: requestUrl('/equitymgr/board/editBoardInfo'),
    method: 'post',
    data: obj
  })
}

export function qryBoardInfo(boardId) {
  return request({
    url: requestUrl('/equitymgr/board/qryBoardInfo'),
    method: 'get',
    params: boardId
  })
}

export function delBoardInfo(boardId) {
  return request({
    url: requestUrl('/equitymgr/board/delBoardInfo'),
    method: 'post',
    data: boardId
  })
}

// 查询权益规则列表
export function getEquityRuleListData(query) {
  return request({
    url: requestUrl('/equitymgr/esequityrule/queryEquityRule'),
    method: 'get',
    params: query
  })
}

// 创建及修改权益规则
export function postSaveEquityRuleData(obj) {
  return request({
    url: requestUrl('/equitymgr/esequityrule/saveEquityRule'),
    method: 'post',
    data: obj
  })
}

// 加载权益规则
export function getEquityRuleData(id) {
  return request({
    url: requestUrl('/equitymgr/esequityrule/getEquityRule' + (id != null ? `/${id}` : '')),
    method: 'get'
  })
}

// 活动规则删除
export function postDelEquityRuleData(obj) {
  return request({
    url: requestUrl('/equitymgr/esequityrule/delEquityRule'),
    method: 'delete',
    data: obj
  })
}
