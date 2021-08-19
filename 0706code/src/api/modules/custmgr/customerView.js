import request from '../../request'
import requestUrl from '../../requestUrl'
import requestParam from '../../requestParam'

// 客户360视图基本信息
export function getCustomerInfo(params) {
  return request({
    url: requestUrl('/cm/cust/getCustInfo'),
    method: 'get',
    params: params
  })
}

// 客户tab页签变化
export function getTabChange(params) {
  return request({
    url: requestUrl('/cm/tabChange/getTabChange'),
    method: 'get',
    params: params
  })
}

// 客户关注状态
export function getCustFocus(params) {
  return request({
    url: requestUrl('/cm/focus/getCustFocus'),
    method: 'get',
    params: params
  })
}

// 客户状态关注或取消
export function saveCustFocus(params) {
  return request({
    url: requestUrl('/cm/focus/saveCustFocus'),
    method: 'post',
    data: params
  })
}

// 消息已读
export function saveMsg(params) {
  return request({
    url: requestUrl('/pm/msg/saveMsg'),
    method: 'post',
    data: requestParam(params)
  })
}

// 客户评级信息
export function getCustGradeList(params) {
  return request({
    url: requestUrl('/cm/grade/getCustGradeList'),
    method: 'get',
    params: params
  })
}

// 客户基本信息
export function getCustomerDetail(params) {
  return request({
    url: requestUrl('pm/base/getBaseIno'),
    method: 'get',
    params: params
  })
}

// 客户提醒列表
export function getCustWarnInfo(params) {
  return request({
    url: requestUrl('/wb/warn/custWarnInfo'),
    method: 'get',
    params: params
  })
}

// 客户舆情信息
export function getOpinionInfo(params) {
  return request({
    url: requestUrl('/pm/opinion/getOpinionInfo'),
    method: 'get',
    params: params
  })
}

// 客户近三年年份
export function getBusinessInfoYear(params) {
  return request({
    url: requestUrl('/pm/business/getBusinessInfoYear'),
    method: 'get',
    params: params
  })
}

// 客户综合贡献度
export function getCustContribute(params) {
  return request({
    url: requestUrl('/pm/contribute/getCustContribute'),
    method: 'get',
    params: params
  })
}

// 客户授信及用信情况
export function getBusinessInfoHis(params) {
  return request({
    url: requestUrl('/pm/business/getBusinessInfoHis'),
    method: 'get',
    params: params
  })
}

// 客户合作时间线
export function getCustCooperation(params) {
  return request({
    url: requestUrl('/pm/cooperation/getCustCooperation'),
    method: 'get',
    params: params
  })
}

// 客户业务信息
export function getHoldDetailList(params) {
  return request({
    url: requestUrl('/pm/hold/getHoldDetailList'),
    method: 'get',
    params: params
  })
}

// 客户授信树
export function getCreditTree(params) {
  return request({
    url: requestUrl('/pm/credit/getCreditTree'),
    method: 'get',
    params: params
  })
}

// 客户授信列表
export function getCreditList(params) {
  return request({
    url: requestUrl('/pm/credit/getCreditList'),
    method: 'get',
    params: params
  })
}

// 客户用信列表
export function getCreditListCg(params) {
  return request({
    url: requestUrl('/cg/credit/getCreditList'),
    method: 'get',
    params: params
  })
}

// 客户高管信息
export function getExecutivesList(params) {
  return request({
    url: requestUrl('/cm/executives/getExecutivesList'),
    method: 'get',
    params: params
  })
}

// 客户股东信息
export function getShareholderList(params) {
  return request({
    url: requestUrl('/cm/shareholder/getShareholderList'),
    method: 'get',
    params: params
  })
}

// 客户上市信息
export function getIpoList(params) {
  return request({
    url: requestUrl('/cm/ipo/getIpoList'),
    method: 'get',
    params: params
  })
}

// 客户关键联系人
export function getKeyPersonList(params) {
  return request({
    url: requestUrl('/cm/key/getKeyPersonList'),
    method: 'get',
    params: params
  })
}

// 客户关键联系人详情
export function getKeyPerson(params) {
  return request({
    url: requestUrl('/cm/key/getKeyPerson'),
    method: 'get',
    params: params
  })
}

// 客户关键联系人新增修改
export function updateKeyPerson(params) {
  return request({
    url: requestUrl('/cm/key/updateKeyPerson'),
    method: 'post',
    data: params
  })
}

// 客户关键联系人新增修改
export function delKeyPerson(params) {
  return request({
    url: requestUrl('/cm/key/delKeyPerson'),
    method: 'post',
    params: params
  })
}

// 客户拜访记录
export function getCustServList(params) {
  return request({
    url: requestUrl('/cm/serv/getCustServList'),
    method: 'get',
    params: params
  })
}
