import Vue from 'vue'
import Router from 'vue-router'
import customer from '@/views/customer'

// 开发环境不使用懒加载, 因为懒加载页面太多的话会造成webpack热更新太慢, 所以只有开发环境使用懒加载
const _import = require('./import-' + process.env.NODE_ENV)

Vue.use(Router)

// 路由定义使用说明:
// 1. 代码中路由统一使用name属性跳转.
// 2. 开放path属性用做简短路由, 比如: '/a1', 访问地址: www.renren.io/#/a1
const router = window.SITE_CONFIG['isSupp'] === '0' ? {
  mode: 'hash',
  routes: [
    { path: '/404', component: _import('error/404'), name: '404', desc: '404未找到' },
    { path: '/login', component: _import('login/index'), name: 'login', desc: '登录' },
    {
      path: '/',
      component: _import('layout/index'),
      name: 'layout',
      redirect: { name: 'home' },
      desc: '上左右整体布局',
      children: [
        // 通过isTab属性, 设定是否通过tab标签页展示内容
        {
          path: '/workbench',
          component: _import('workbench/index'),
          name: 'workbench',
          desc: '工作台',
          meta: { isTab: true }
        },
        {
          path: '/eventReminder',
          component: _import('workbench/eventReminder/index'),
          name: 'eventReminder',
          desc: '事件提醒',
          meta: { isTab: true }
        },
        {
          path: '/noticeManagement',
          component: _import('workbench/noticeManagement/index'),
          name: 'noticeManagement',
          desc: '公告管理',
          meta: { isTab: true }
        },
        {
          path: '/myProcess',
          component: _import('workbench/myProcess/index'),
          name: 'myProcess',
          desc: '我的流程',
          meta: { isTab: true }
        },
        {
          path: '/riskLimits',
          component: _import('workbench/riskLimits/index'),
          name: 'riskLimits',
          desc: '风险限额',
          meta: { isTab: true }
        },
        {
          path: '/customerManagement',
          component: _import('customerManagement/index'),
          name: 'customerManagement',
          desc: '客户管理',
          meta: { isTab: true }
        },
        {
          path: '/flexibleQuery',
          component: _import('customerManagement/flexibleQuery/index'),
          name: 'flexibleQuery',
          desc: '灵活查询',
          meta: { isTab: true }
        },
        {
          path: '/visitRecordQuery',
          component: _import('customerManagement/visitRecordQuery/index'),
          name: 'visitRecordQuery',
          desc: '拜访记录查询',
          meta: { isTab: true }
        },
        {
          path: '/standingBook',
          component: _import('customerManagement/standingBook/index'),
          name: 'standingBook',
          desc: '台账管理',
          meta: { isTab: true }
        },
        {
          path: '/groupCustomerQuery',
          component: _import('groupCustomerManagement/groupCustomerQuery/index'),
          name: 'groupCustomerQuery',
          desc: '集团客户查询',
          meta: { isTab: true }
        },
        {
          path: '/groupView',
          component: _import('groupCustomerManagement/groupView/index'),
          name: 'groupView',
          desc: '集团视图',
          meta: { isTab: true }
        },
        { path: '/home', component: _import('home/index'), name: 'home', desc: '首页', meta: { isTab: true } },
        { path: '/layout-setting', component: _import('layout/setting'), name: 'setting', desc: '布局设置' },
        { path: '/customer', component: customer, name: 'customer', desc: '客户管理', meta: { isTab: false } },
        { path: '/user', component: _import('user/index'), name: 'user', desc: '用户管理', meta: { isTab: true } },
        { path: '/role', component: _import('role/index'), name: 'role', desc: '角色管理', meta: { isTab: true } },
        { path: '/menu', component: _import('menu/index'), name: 'menu', desc: '菜单管理', meta: { isTab: true } },
        { path: '/sql', component: _import('sql/index'), name: 'sql', desc: 'SQL监控', meta: { isTab: true } },
        { path: '/schedule', component: _import('schedule/index'), name: 'schedule', desc: '任务管理', meta: { isTab: true } },
        { path: '/config', component: _import('config/index'), name: 'config', desc: '参数管理', meta: { isTab: true } },
        { path: '/dict', component: _import('dict/index'), name: 'dict', desc: '字典管理', meta: { isTab: true } },
        { path: '/log', component: _import('log/index'), name: 'log', desc: '系统日志', meta: { isTab: true } },
        { path: '/engine', component: _import('engine/index'), name: 'engine', desc: '引擎维护', meta: { isTab: true } },
        { path: '/approval', component: _import('approval/index'), name: 'approval', desc: '积分权益审批', meta: {isTab: true} },
        { path: '/coupontype', component: _import('coupontype/index'), name: 'coupontype', desc: '优惠券类型', meta: {isTab: true} },
        { path: '/coupon', component: _import('coupon/index'), name: 'coupon', desc: '优惠券', meta: {isTab: true} },
        { path: '/empty', component: _import('empty/index'), name: 'empty', desc: '空白', meta: {isTab: false} }
      ],
      beforeEnter (to, from, next) {
        let token = Vue.cookie.get('token')
        if (!token || !/\S/.test(token)) {
          next({ name: 'login' })
        }
        next()
      }
    },
    // Add by yueyao ST
    // crm旺季营销页面
    // { path: '/crm/score', component: _import('crm/score/index'), name: 'score', desc: '旺季营销' },
    {
      path: '/crm',
      component: _import('layout/index-cust'),
      name: 'crm',
      redirect: { name: 'score' },
      children: [
        // 通过isTab属性, 设定是否通过tab标签页展示内容
        { path: 'score', component: _import('crm/score/index'), name: 'crmscore', desc: '旺季营销' }
      ]
    },
    {
      path: '/custmgr',
      component: _import('layout/index'),
      name: 'custmgr',
      redirect: { name: 'home' },
      children: [
        // 通过isTab属性, 设定是否通过tab标签页展示内容
        { path: 'custgroup', component: _import('custmgr/cust-group/index'), name: 'custgroup', desc: '客户组管理', meta: { isTab: true } },
        { path: 'custblack', component: _import('custmgr/cust-black/index'), name: 'custblack', desc: '黑名单管理', meta: { isTab: true } },
        { path: 'custinfo', component: _import('custmgr/cust-info/index'), name: 'custinfo', desc: '客户信息查询', meta: { isTab: true } },
        { path: 'scoreadjust', component: _import('custmgr/score-adjust/index'), name: 'scoreadjust', desc: '客户积分调整历史', meta: { isTab: true } },
        { path: 'scorefrz', component: _import('custmgr/score-frz/index'), name: 'scorefrz', desc: '客户积分冻结解冻历史', meta: { isTab: true } },
        { path: 'custgrey', component: _import('custmgr/cust-grey/index'), name: 'custgrey', desc: '灰度名单查询', meta: { isTab: true } },
        { path: 'custwhite', component: _import('custmgr/cust-white/index'), name: 'custwhite', desc: '白名单查询', meta: { isTab: true } }
      ]
    },
    {
      path: '/score',
      component: _import('layout/index'),
      name: 'score',
      redirect: { name: 'home' },
      children: [
        { path: 'scorerule', component: _import('scoremgr/score-rule/index'), name: 'scorerule', desc: '积分规则维护', meta: { isTab: true } },
        { path: 'scoresearch', component: _import('scoremgr/score-search/index'), name: 'scoresearch', desc: '积分统计查询', meta: { isTab: true } },
        { path: 'interfacemgr', component: _import('scoremgr/interface-mgr/index'), name: 'interfacemgr', desc: '接口管理', meta: { isTab: true } },
        { path: 'dbsmgr', component: _import('scoremgr/dbs-mgr/index'), name: 'dbsmgr', desc: '积分达标条件配置', meta: { isTab: true } },
        { path: 'dbsfinr', component: _import('scoremgr/dbs-finr/index'), name: 'dbsfinr', desc: '理财达标条件配置', meta: { isTab: true } }
      ]
    },
    {
      path: '/report',
      component: _import('layout/index'),
      name: 'report',
      redirect: { name: 'home' },
      children: [
        { path: 'equiltyrecord', component: _import('report/equilty-record/index'), name: 'equiltyrecord', desc: '权益发放记录查询', meta: { isTab: true } },
        { path: 'equityorder', component: _import('report/equity-order/index'), name: 'equityorder', desc: '权益订单查询', meta: { isTab: true } },
        { path: 'startbean', component: _import('report/start-bean/index'), name: 'startbean', desc: '点豆对账', meta: { isTab: true } },
        { path: 'startbeanL', component: _import('report/start-beanL/index'), name: 'startbeanlist', desc: '点豆发放明细', meta: { isTab: true } },
        { path: 'verify', component: _import('report/verify/index'), name: 'verify', desc: '供应商对账单', meta: { isTab: true } },
        { path: 'prodstock', component: _import('report/prod-stock/index'), name: 'prodstock', desc: '活动商品库存查询', meta: { isTab: true } },
        { path: 'currentstock', component: _import('report/current-stock/index'), name: 'currentstock', desc: '商品当前库存查询', meta: { isTab: true } },
        { path: 'stockrecord', component: _import('report/stock-record/index'), name: 'stockrecord', desc: '商品库存扣减记录报表', meta: { isTab: true } },
        { path: 'ticketcode', component: _import('report/ticket-code/index'), name: 'ticketcode', desc: '券码信息查询', meta: { isTab: true } },
        { path: 'lotteryparticipate', component: _import('report/lottery-participate/index'), name: 'lotteryparticipate', desc: '奖池活动参与情况', meta: { isTab: true } }
      ]
    },
    {
      path: '/supplier',
      component: _import('layout/index'),
      name: 'supplier',
      redirect: { name: 'home' },
      children: [
        { path: 'mgr', component: _import('suppliermgr/supplier/index'), name: 'mgr', desc: '供应商管理', meta: { isTab: true } },
        { path: 'prodmsg', component: _import('suppliermgr/prod-msg/index'), name: 'prodmsg', desc: '短信模板管理', meta: { isTab: true } },
        { path: 'prod', component: _import('suppliermgr/product/index'), name: 'prod', desc: '商品管理', meta: { isTab: true } },
        { path: 'loseffect', component: _import('suppliermgr/loseffect/index'), name: 'loseffect', desc: '券码失效 ', meta: { isTab: true } },
        { path: 'stockwarning', component: _import('suppliermgr/stock-warning/index'), name: 'stockwarning', desc: '库存预警设置 ', meta: { isTab: true } },
        { path: 'email', component: _import('suppliermgr/email/index'), name: 'email', desc: '业务邮箱维护', meta: { isTab: true } }
      ]
    },
    // Add by yueyao ENd
    // Add by songxiongxiong ST
    {
      path: '/equitymgr',
      component: _import('layout/index'),
      name: 'equitymgr',
      redirect: { name: 'home' },
      children: [
        { path: 'buy', component: _import('equitymgr/buy/index'), name: 'buy', desc: '抢购活动管理', meta: { isTab: true } },
        { path: 'board', component: _import('equitymgr/board/index'), name: 'board', desc: '权益板块管理', meta: { isTab: true } },
        { path: 'esequityrule', component: _import('equitymgr/es-equity-rule/index'), name: 'esequityrule', desc: '权益规则管理', meta: { isTab: true } },
        { path: 'activity', component: _import('equitymgr/activity/index'), name: 'activity', desc: '权益活动管理', meta: { isTab: true } },
        { path: 'lottery', component: _import('equitymgr/lottery/index'), name: 'lottery', desc: '抽奖活动管理', meta: { isTab: true } },
        { path: 'subject', component: _import('equitymgr/subject/index'), name: 'subject', desc: '主题管理', meta: { isTab: true } },
        { path: 'subjectAct', component: _import('equitymgr/subjectAct/index'), name: 'subjectAct', desc: '主题活动管理', meta: { isTab: true } },
        { path: 'slideshow', component: _import('equitymgr/slideshow/index'), name: 'slideshow', desc: '轮播图管理', meta: { isTab: true } },
        { path: 'voteAct', component: _import('equitymgr/voteAct/index'), name: 'voteAct', desc: '票选活动管理', meta: { isTab: true } },
        { path: 'newlottery', component: _import('equitymgr/newlottery/index'), name: 'newlottery', desc: '奖池活动管理', meta: { isTab: true } }
      ]
    },
    // Add by songxiongxiong ENd
    { path: '*', redirect: { name: '404' } }
  ]
} : {
  mode: 'hash',
  routes: [
    { path: '/login', component: _import('login/index'), name: 'login', desc: '登录' },
    {
      path: '/',
      component: _import('layout/index'),
      name: 'layout',
      redirect: { name: 'supporder' },
      desc: '上左右整体布局',
      children: [
        // 通过isTab属性, 设定是否通过tab标签页展示内容
        // { path: '/home', component: _import('report/supp-order/index'), name: 'home', desc: '首页', meta: { isTab: true } },
        { path: '/empty', component: _import('empty/index'), name: 'empty', desc: '空白', meta: {isTab: false} }
      ],
      beforeEnter (to, from, next) {
        let token = Vue.cookie.get('token')
        if (!token || !/\S/.test(token)) {
          next({ name: 'login' })
        } else if (window.SITE_CONFIG['isSupp'] === '1') {
        }
        next()
      }
    },
    {
      path: '/report',
      component: _import('layout/index'),
      name: 'report',
      redirect: { name: 'supporder' },
      children: [
        { path: 'supporder', component: _import('report/supp-order/index'), name: 'supporder', desc: '供应商订单管理', meta: { isTab: true } }
      ]
    },
    { path: '*', redirect: { name: '404' } },
    { path: '/404', component: _import('error/404'), name: '404', desc: '404未找到' }
  ]
}

export default new Router(router)
