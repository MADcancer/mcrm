import request from '../../request'
import requestUrl from '../../requestUrl'
import requestParam from '../../requestParam'
// 首页公告信息查看
export function getHomeInfo(params) {
  return request({
    url: requestUrl('/wb/notice/homeInfo'),
    method: 'get',
    data: requestParam(params)
  })
}
// 首页公告信息查看
export function getFtPPrice(params) {
  return request({
    url: requestUrl('/wb/quote/list'),
    method: 'get',
    data: requestParam(params)
  })
}
