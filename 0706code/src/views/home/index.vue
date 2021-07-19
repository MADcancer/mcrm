<template>
  <div class="home">
    <div class="todo-list">
      <div class="title">
        <img src="~@/assets/img/todo-logo.png" />
        <span>待办事项</span>
      </div>
      <div :class="['content', isAdmin? 'admin': '']">
        <el-card class="box-card" v-for="(work, index) in works" :key="index">
          <div slot="header" class="header">
            <div :class="work.name !== '未提交的活动' ? 'jump' : ''" @click="jumpToApprove(work.name)">{{ work.name }}</div>
            <div style="float: right; padding: 3px 0">
              共<span>{{ work.total }}</span
              >条未读信息
            </div>
          </div>
          <div
            v-for="(item, idx) in work.list"
            :key="idx"
            class="item"
            @click="jumpPage(item, work.name)"
          >
            <div class="icon"></div>
            <div>{{ item.name }}</div>
            <div class="count">{{ item.sum }}</div>
          </div>
        </el-card>
      </div>
    </div>
    <div class="activity-list">
      <div class="title">
        <img src="~@/assets/img/activity-logo.png" />
        <span>活动看板</span>
      </div>
      <div class="content">
        <el-card
          class="box-card"
          v-for="(activity, index) in activityBord"
          :key="index"
        >
          <div slot="header" class="header">
            <div>{{ activity.name }}</div>
          </div>
          <div class="item">
            <div class="daily-count">
              <div>{{ activity.list[0].sum }}</div>
              <div>{{ activity.list[0].name }}</div>
            </div>
            <div class="line"></div>
            <div class="total-count">
              <div>{{ activity.list[1].sum }}</div>
              <div>{{ activity.list[1].name }}</div>
            </div>
          </div>
        </el-card>
      </div>
    </div>
    <div class="cust-list">
      <div class="title">
        <img src="~@/assets/img/cust-logo.png" />
        <span>客户参与情况</span>
      </div>
      <div class="content" v-if="custInfos.length > 0">
        <div class="left-content">
          <div
            v-for="(custInfo, index) in custInfos"
            :key="index"
            :class="type === index ? 'selected' : ''"
            @click="clickItem(custInfo, index)"
          >
            <span>{{ custInfo.actName }}</span
            ><img src="~@/assets/img/home-arrow.png" v-if="type === index" />
            <img src="~@/assets/img/home-white-arrow.png" v-else />
          </div>
        </div>
        <div class="right-content">
          <div>
            <img src="~@/assets/img/plan-count.png" />
            <div>
              <span style="color: #5C8A06; font-size: 32px">{{ currentInfo.planNum }}</span><br />
              <span style="color: #262626; font-size: 18px">计划参与人数</span>
            </div>
          </div>
          <div>
            <img src="~@/assets/img/actual-count.png" />
            <div>
              <span style="color: #5C8A06; font-size: 32px">{{ currentInfo.realNum }}</span><br />
              <span style="color: #262626; font-size: 18px">实际参与人数</span>
            </div>
          </div>
          <div>
            <img src="~@/assets/img/prod-limit.png" />
            <div>
              <span style="color: #5C8A06; font-size: 32px">{{ currentInfo.goodsCeiling }}</span><br />
              <span style="color: #262626; font-size: 18px">商品上限</span>
            </div>
          </div>
          <div>
            <img src="~@/assets/img/release-count.png" />
            <div>
              <span style="color: #5C8A06; font-size: 32px">{{ currentInfo.goodsProvideNum }}</span><br />
              <span style="color: #262626; font-size: 18px">商品发放数量</span>
            </div>
          </div>
          <div>
            <img src="~@/assets/img/release-rate.png" />
            <div>
              <span style="color: #5C8A06; font-size: 32px">{{ currentInfo.goodsProvideRate }}</span><br />
              <span style="color: #262626; font-size: 18px">商品发放率</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="empty-content">
        暂无已完成的活动
      </div>
    </div>
  </div>
</template>
<script>
import API from '@/api'
export default {
  computed: {
    // 是否是管理员
    isAdmin() {
      return this.$store.state.user.roleId.toString().indexOf('03') !== -1
    }
  },
  watch: {
    $route: {
      handler() {
        if (this.$route.name === 'home') {
          this.getDatas()
        }
      },
      deep: true
    }
  },
  data() {
    return {
      type: 0,
      businessType: [
        '',
        '积分冻结',
        '积分解冻',
        '积分调整',
        '客户组管理',
        '黑名单管理',
        '权益规则管理',
        '权益活动管理',
        '抽奖活动管理',
        '抢购活动管理',
        '轮播图管理',
        '主题活动管理',
        '票选活动管理',
        '积分达标条件',
        '理财达标条件',
        '奖池活动管理',
        '订单取消'
      ],
      unSubmitL: {
        '权益规则管理': 'esequityrule',
        '权益活动管理': 'activity',
        '抽奖活动管理': 'lottery',
        '抢购活动管理': 'buy',
        '轮播图管理': 'slideshow',
        '主题活动管理': 'subjectAct',
        '票选活动管理': 'voteAct',
        '奖池活动管理': 'newlottery'
      },
      works: [],
      activityBord: [],
      custInfos: [],
      currentInfo: {}
    }
  },
  methods: {
    clickItem(info, type) {
      this.currentInfo = info
      this.type = type
    },
    getDatas() {
      let params = {
        empNo: this.$store.state.user.id,
        roleId: this.$store.state.user.roleId,
        channel: this.$store.state.user.channel
      }
      // 查询待办事项
      API.home.qryWorkNum(params, this).then(res => {
        this.works = res.data.data
        // 管理员  03结尾
        if (this.isAdmin) {
          this.works.shift()
        }
      })
      // 查询活动看板信息
      API.home.qryActivityBoard(params).then(res => {
        this.activityBord = res.data.data
      })
      // 客户参与活动情况列表
      API.home.qryActivityCustInfo(params).then(res => {
        this.custInfos = res.data.data
        this.currentInfo = res.data.data[0]
      })
    },
    // 跳转到审批页
    jumpToApprove(name) {
      let approveStatus = []
      if (name === '未提交的活动') {
        return
      }
      if (name === '待审批的活动') {
        approveStatus = '1'
      } else {
        approveStatus = '3,4'
      }
      this.$router.push({
        path: '/approval',
        query: {
          approveStatus: approveStatus,
          businessType: ''
        }
      })
    },
    // 跳转审批页面
    jumpPage(item, name) {
      let approveStatus = []
      let businessType = ''
      // 未提交活动 type => 1 从首页过去的
      if (name === '未提交的活动') {
        this.$router.push({
          name: this.unSubmitL[item.name],
          query: {status: '1', type: 1}
        })
      } else {
        if (name === '待审批的活动') {
          approveStatus = '1'
        } else {
          approveStatus = '3,4'
        }
        businessType = this.businessType.findIndex((value, index, arr) => {
          return value === item.name
        })
        this.$router.push({
          path: '/approval',
          query: {
            approveStatus: approveStatus,
            businessType: businessType
          }
        })
      }
    }
  },
  created() {
    this.getDatas()
  }
}
</script>

<style lang="scss" scoped>
.home {
  .title {
    display: flex;
    align-items: center;
    padding-bottom: 8px;
    img {
      width: 26px;
      height: 26px;
      margin-right: 6px;
    }
    span {
      color: #111111;
      font-size: 18px;
    }
    border-bottom: 1px solid #d9d9d9;
  }
  .todo-list {
    .content {
      display: flex;
      justify-content: space-between;
      padding-top: 23px;
      padding-bottom: 30px;
    }
    /deep/ .el-card {
      width: 30%;
      // height: 300px;
      border: 1px solid #80a639;
    }
    .box-card {
      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .jump {
          &:hover {
            cursor: pointer;
          }
        }
        div {
          color: #ffffff;
          font-size: 16px;
        }
        > div:nth-child(2) {
          font-size: 14px;
          span {
            font-size: 20px;
          }
        }
      }
      /deep/ .el-card__header {
        padding: 13px 15px;
        background-color: #80a639;
      }
      /deep/ .el-card__body {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        padding: 20px 30px;
        .item {
          width: 50%;
          display: flex;
          align-items: center;
          margin-bottom: 25px;
          > div:nth-child(2) {
            &:hover {
              cursor: pointer;
              color: #5c8a06;
              text-decoration: underline;
            }
          }
          .icon {
            width: 4px;
            height: 4px;
            border-radius: 50%;
            background-color: #5c8a06;
            margin-right: 5px;
          }
          .count {
            // width: 18px;
            // height: 18px;
            // background: #da8b04;
            // color: #ffffff;
            // display: flex;
            // align-items: center;
            // justify-content: center;
            // border-radius: 50%;
            // margin-left: 2px;
            color: #da8b04;
            margin-left: 6px;
            font-weight: bold;
          }
        }
        .item:nth-child(2n) {
          justify-content: flex-end;
        }
      }
    }
  }
  .activity-list {
    margin-bottom: 58px;
    /deep/ .el-card {
      width: 24%;
      height: 208px;
    }
    /deep/ .el-card__header {
      padding: 16px 0 0;
      margin: 0 22px;
      border-bottom: 1px solid #5c8a06;
    }
    .content {
      margin-top: 24px;
      display: flex;
      justify-content: space-between;
    }
    .header {
      div {
        width: 80px;
        padding: 4px;
        border-bottom: 3px solid #5c8a06;
      }
    }
    .item {
      display: flex;
      justify-content: space-between;
      .daily-count {
        div:nth-child(1) {
          color: #80a639;
          font-size: 88px;
          text-align: center;
        }
      }
      .line {
        height: 65px;
        border-left: 1px dashed #80a639;
        margin-top: 20px;
      }
      .total-count {
        div:nth-child(1) {
          font-size: 36px;
          color: #262626;
          padding-top: 60px;
        }
      }
    }
  }
  .cust-list {
    .empty-content {
      margin: 24px 0;
      width: 100%;
      height: 100px;
      background: #f5f8f0;
      border: 1px solid #e9e9e9;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
    }
    .content {
      margin: 24px 0;
      display: flex;
    }
    .left-content {
      img {
        width: 15px;
        height: 15px;
      }
      color: #ffffff;
      font-size: 16px;
      background: #ffffff;
      width: 30%;
      &:hover {
        cursor: pointer;
      }
      div {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 55px;
        width: 100%;
        padding: 0 45px 0 38px;
        background: #80a639;
        margin-bottom: 2px;
      }
      .selected {
        background: #f5f8f0;
        color: #80a639;
        margin-bottom: 0;
        border: 1px solid #e9e9e9;
      }
    }
    .right-content {
      display: flex;
      flex-wrap: wrap;
      width: 70%;
      img:nth-child(1) {
        width: 40px;
        height: 43px;
      }
      img:nth-child(2) {
        width: 50px;
        height: 51px;
      }
      img:nth-child(3) {
        width: 39px;
        height: 44px;
      }
      img:nth-child(4) {
        width: 50px;
        height: 44px;
      }
      img:nth-child(4) {
        width: 43px;
        height: 48px;
      }
      img {
        margin-right: 13px;
      }
      > div {
        display: flex;
        width: 33%;
        height: 168px;
        align-items: center;
        justify-content: center;
        background: #f5f8f0;
        border-left: 1px solid #e9e9e9;
        border-top: 1px solid #e9e9e9;
      }
    }
  }
  .admin {
    /deep/ .el-card {
      width: 46%;
    }
    /deep/ .el-card__body {
      padding: 20px 70px 0 !important;
    }
  }
}
</style>
