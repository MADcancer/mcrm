<template>
  <div class="customer-view main-body">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>客户管理</el-breadcrumb-item>
      <el-breadcrumb-item>客户详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="cust-info">
      <div class="left-card"></div>
      <div class="right-box">
        <div class="box-top">
          <span class="cust-name">宁波银行股份有限公司</span>
          <div class="label-box">
            <div class="cust-label">战略客户</div>
            <div class="cust-label">业务提升</div>
            <div class="cust-label">授信客户</div>
          </div>
        </div>
        <div class="box-bottom">
          客户编号：00000012345
        </div>
      </div>
    </div>
    <ul class="tab-nav">
      <li  v-for="(tab, index) in tabs" v-if="tab.show" :key="index" class="tab-card" :class="tab.active ? 'tab-active' : ''" @click="activeEvent(tab)">
        {{tab.text}}
      </li>
    </ul>
    <div class="scroll-body">
      <customer-profile v-if="tabBar.id === 'customer'"></customer-profile>
      <customer-info v-if="tabBar.id === 'essential'"></customer-info>
      <business-info v-if="tabBar.id === 'business'"></business-info>
      <credit-info v-if="tabBar.id === 'credit'"></credit-info>
      <financial-info v-if="tabBar.id === 'financial'"></financial-info>
      <senior-executive v-if="tabBar.id === 'seniorExecutive'"></senior-executive>
      <be-listed v-if="tabBar.id === 'beListed'"></be-listed>
      <contacts v-if="tabBar.id === 'contacts'"></contacts>
    </div>
  </div>
</template>
<script>
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
      tabs: [
        {
          text: '客户概况',
          active: true,
          show: true,
          id: 'customer'
        }, {
          text: '基本信息',
          active: false,
          show: true,
          id: 'essential'
        }, {
          text: '业务信息',
          active: false,
          show: true,
          id: 'business'
        }, {
          text: '授信信息',
          active: false,
          show: true,
          id: 'credit'
        }, {
          text: '财务信息',
          active: false,
          show: true,
          id: 'financial'
        }, {
          text: '高管信息',
          active: false,
          show: true,
          id: 'seniorExecutive'
        }, {
          text: '股东信息',
          active: false,
          show: true,
          id: 'shareholder'
        }, {
          text: '上市信息',
          active: false,
          show: true,
          id: 'beListed'
        }, {
          text: '诉讼信息',
          active: false,
          show: true,
          id: 'litigation'
        }, {
          text: '关键联系人',
          active: false,
          show: true,
          id: 'contacts'
        }, {
          text: '拜访记录信息',
          active: false,
          show: true,
          id: 'visitRecords'
        }
      ],
      tabBar: {}
    }
  },
  methods: {
    activeEvent(tab) {
      this.tabs.forEach(tabItem => {
        tabItem.active = false
      })
      tab.active = true
      this.tabBar = tab
    }
  },
  created() {
    this.tabBar = this.tabs.find(tab => tab.id === 'customer')
  }
}
</script>

<style lang="scss" scoped>
  .customer-view {
    display: flex;
    flex-direction: column;
    .cust-info{
      display: flex;
      height: 135px;
      margin-top: 20px;
      background: #FFFFFF;
      box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.06);
      border-radius: 8px;
      .left-card {
        width: 8px;
        height: 135px;
        background: #79AC43;
        border-top-left-radius: 6px;
        border-bottom-left-radius: 6px;
      }
      .right-box {
        display: flex;
        flex-direction: column;
        flex:1;
        padding: 32px 0 32px 32px;
        .box-top {
          display: flex;
          .cust-name {
            width: 240px;
            height: 33px;
            font-size: 24px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #333333;
            line-height: 33px;
          }
          .label-box {
            display: flex;
            margin-left: 72px;
            .cust-label {
              height: 32px;
              margin-left: 8px;
              border-radius: 4px;
              border: 1px solid #79AC43;
              padding: 6px 12px;
              font-size: 14px;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: #79AC43;
              line-height: 20px;
              &:first-of-type {
                margin-left: 0;
              }
            }
          }
        }
        .box-bottom {
          margin-top: 16px;
          height: 22px;
          font-size: 16px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #333333;
          line-height: 22px;
        }
      }
    }
    .tab-nav {
      height: 60px;
      background: #FFFFFF;
      border-radius: 8px;
      border: 1px solid #EDEDED;
      margin-top: 16px;
      display: flex;
      align-items: center;
      padding: 8px;
      .tab-card {
        width: 104px;
        height: 44px;
        border-radius: 8px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #B1B9C3;
        line-height: 44px;
        text-align: center;
        cursor: pointer;
        &.tab-active {
          font-weight: 600;
          color: #FFFFFF;
          background: #79AC43;
        }
      }
    }
  }
</style>
