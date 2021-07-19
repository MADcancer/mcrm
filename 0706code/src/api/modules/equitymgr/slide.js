/*
 *
 *  Copyright (c) 2018-2025, Pactera JinXin Software All rights reserved.
 *
 */

import request from '../../request'
import requestUrl from '../../requestUrl'
// import requestParam from '../../requestParam'

// 查询轮播图列表
export function getSlideListData(query) {
  return request({
    url: requestUrl('/equitymgr/slideshow/querySlideshow'),
    method: 'get',
    params: query
  })
}

// 创建及修改轮播图
export function postSaveSlideData(obj) {
  return request({
    url: requestUrl('/equitymgr/slideshow/saveSlideshow'),
    method: 'post',
    data: obj
  })
}

// 轮播图可用顺序查询
export function postSlideOrderSearchData(id) {
  return request({
    url: requestUrl('/equitymgr/slideshow/slideshowOrderSearch' + (id != null ? `/${id}` : '')),
    method: 'get'
  })
}

// 轮播图删除
export function postDelSlideData(obj) {
  return request({
    url: requestUrl('/equitymgr/slideshow/delSlideshow'),
    method: 'delete',
    data: obj
  })
}

// 轮播图上线下线
export function postSlidelineData(obj) {
  return request({
    url: requestUrl('/equitymgr/slideshow/startOrEndSlideshow'),
    method: 'put',
    data: obj
  })
}

// 轮播图详情查询
export function getSlideDetailData(query) {
  return request({
    url: requestUrl('/equitymgr/slideshow/getSlideshowDetail'),
    method: 'get',
    params: query
  })
}

// 轮播图活动查询
export function getSlideActData(query) {
  return request({
    url: requestUrl('/equitymgr/slideshow/querySlideshowAct'),
    method: 'get',
    params: query
  })
}
