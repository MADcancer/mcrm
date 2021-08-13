import * as common from './modules/common'
import * as user from './modules/user'
import * as role from './modules/role'
import * as menu from './modules/menu'
import * as log from './modules/log'
import * as config from './modules/config'
import * as dict from './modules/dict'
import * as schedule from './modules/schedule'
import * as custgroup from './modules/custmgr/cust-group'
import * as interfacemgr from './modules/scoremgr/interface-mgr'
import * as scorerule from './modules/scoremgr/score-rule'
import * as dbsmgr from './modules/scoremgr/dbs-mgr'
import * as dbsfinr from './modules/scoremgr/dbs-finr'
import * as scoresearch from './modules/scoremgr/score-search'
import * as prodmsg from './modules/suppliermgr/prod-msg'
import * as product from './modules/suppliermgr/product'
import * as supplier from './modules/suppliermgr/supplier'
import * as loseffect from './modules/suppliermgr/loseffect'
import * as supplierEmail from './modules/suppliermgr/supplier-email'
import * as home from './modules/home'
import * as custinfo from './modules/custmgr/cust-info'
import * as scoreadjust from './modules/custmgr/score-adjust'
import * as scorefrz from './modules/custmgr/score-frz'
import * as custblack from './modules/custmgr/cust-black'
import * as custwhite from './modules/custmgr/cust-white'
import * as custgrey from './modules/custmgr/cust-grey'
import * as buy from './modules/equitymgr/buy'
import * as equityrule from './modules/equitymgr/equity-rule'
import * as activity from './modules/equitymgr/activity'
import * as voteact from './modules/equitymgr/voteAct'
import * as lottery from './modules/equitymgr/lottery'
import * as newlottery from './modules/equitymgr/newlottery'
import * as subject from './modules/equitymgr/subject'
import * as slide from './modules/equitymgr/slide'
import * as report from './modules/equitymgr/report'
import * as crmscore from './modules/crm/score'
import * as engine from './modules/engine'
import * as coupon from './modules/coupon'
import * as cockpit from './modules/cockpit'
import * as customerView from './modules/custmgr/customerView'
import * as workbench from './modules/workbench'
export default {
  workbench,  // 工作台
  common,     // 公共
  user,       // 管理员管理
  role,       // 角色管理
  menu,       // 菜单管理
  log,        // 系统日志
  config,     // 参数管理
  dict,       // 字典管理
  schedule,    // 定时任务
  custgroup,   // 客户组管理
  interfacemgr, // 接口管理
  scorerule,   // 积分规则
  dbsmgr,     // 获取积分达标
  dbsfinr,     // 获取理财达标
  scoresearch,  // 积分查询
  prodmsg,      // 短信模板管理
  product,      // 商品管理
  supplier,      // 供应商管理
  home,         // 首页
  report,       // 权益发放记录
  crmscore,     // 旺季营销
  engine,       // 引擎文件管理
  coupon,       // 优惠券
  // songxiongxiong START
  custinfo,     // 客户信息查询
  scoreadjust,   // 客户积分调整历史
  scorefrz,     // 客户积分冻结解冻历史
  custblack,    // 黑名单管理
  custwhite,    // 白名单管理
  buy,          // 抢购活动管理
  equityrule,   // 权益规则管理
  activity,     // 权益活动管理
  lottery,      // 权益抽奖管理
  newlottery,   //
  subject,      // 权益抽奖管理
  slide,         // 轮播图管理
  loseffect,      // 券码失效
  custgrey,      // 灰度名单
  voteact,      // 票选活动
  supplierEmail,   // 业务邮箱维护
  cockpit, //驾驶舱
  customerView // 客户360视图
  // songxiongxiong END
}
