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
          <span class="cust-name">{{ customerMessage.custName }}</span>
          <div class="label-box">
            <div class="cust-label">{{customerMessage.custType}}</div>
            <div class="cust-label">业务提升</div>
            <div class="cust-label">授信客户</div>
          </div>
        </div>
        <div class="box-bottom">
          客户编号：{{ customerMessage.custNo }}
        </div>
      </div>
    </div>
    <ul class="tab-nav">
      <li  v-for="(tab, index) in tabs" v-if="tab.show" :key="index" class="tab-card" :class="{'tab-active': tab.active, 'red-point': tab.hasNew}" @click="activeEvent(tab)">
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
      <visit-record v-if="tabBar.id === 'visitRecord'"></visit-record>
    </div>
  </div>
</template>
<script>
import API from '@/api'
import { Constants } from '../customerMgr/constants'
import {getCustFocus, saveMsg} from '../../api/modules/custmgr/customerView'

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
      customerMessage: {},
      tabs: [
        {
          text: '客户概况',
          value: '01',
          active: true,
          show: true,
          hasNew: false,
          id: 'customer'
        }, {
          text: '基本信息',
          value: '02',
          active: false,
          show: true,
          hasNew: false,
          id: 'essential'
        }, {
          text: '业务信息',
          value: '03',
          active: false,
          show: true,
          hasNew: false,
          id: 'business'
        }, {
          text: '授信信息',
          value: '04',
          active: false,
          show: true,
          hasNew: false,
          id: 'credit'
        }, {
          text: '财务信息',
          value: '05',
          active: false,
          show: true,
          hasNew: false,
          id: 'financial'
        }, {
          text: '高管信息',
          value: '06',
          active: false,
          show: true,
          hasNew: false,
          id: 'seniorExecutive'
        }, {
          text: '股东信息',
          value: '07',
          active: false,
          show: true,
          hasNew: false,
          id: 'shareholder'
        }, {
          text: '上市信息',
          value: '08',
          active: false,
          show: true,
          hasNew: false,
          id: 'beListed'
        }, {
          text: '诉讼信息',
          value: '09',
          active: false,
          show: false,
          hasNew: false,
          id: 'litigation'
        }, {
          text: '关键联系人',
          value: '10',
          active: false,
          show: true,
          hasNew: false,
          id: 'contacts'
        }, {
          text: '拜访记录信息',
          value: '11',
          active: false,
          show: true,
          hasNew: false,
          id: 'visitRecord'
        }
      ],
      tabBar: {}
    }
  },
  methods: {
    getTabChange() {
      let params = {
        socCode: '10000',
        roleId: this.$store.state.user.roleId,
        userNo: this.$store.state.user.id
      }
      API.customerView.getTabChange(params).then(({ data }) => {
        if (data && data.code === Constants.HTTP_SUCCESS) {
          console.log('getTabChange', data)
          console.log('this.$store.state.user', this.$store.state.user)
          let tabNewList = data.data || []
          for (const item of this.tabs) {
            let newItem = tabNewList.find(e => e.tabType === item.value)
            item.hasNew = !!newItem
            item.objId = newItem ? newItem.id : ''
          }
        }
      })
    },
    getCustFocus() {
      let params = {
        socCode: '10000',
        roleId: this.$store.state.user.roleId,
        userNo: this.$store.state.user.id
      }
      API.customerView.getCustFocus(params).then(({ data }) => {
        if (data && data.code === Constants.HTTP_SUCCESS) {
          console.log('getCustFocus', data)
        }
      })
    },
    saveMsg(item) {
      let params = {
        msgType: '03',
        objId: item.objId,
        userNo: this.$store.state.user.id
      }
      API.customerView.saveMsg(params).then(({ data }) => {
        if (data && data.code === Constants.HTTP_SUCCESS) {
          item.hasNew = false
        }
      })
    },
    getCustomerMessage() {
      let params = {
        socCode: '10000'
      }
      API.customerView.getCustomerInfo(params).then(({ data }) => {
        if (data && data.code === Constants.HTTP_SUCCESS) {
          console.log('getCustomerInfo', data)
          this.customerMessage = data.data
        }
      })
    },
    activeEvent(tab) {
      this.tabs.forEach(tabItem => {
        tabItem.active = false
      })
      tab.active = true
      this.tabBar = tab
      if (tab.hasNew) {
        this.saveMsg(tab)
      }
    }
  },
  created() {
    this.tabBar = this.tabs.find(tab => tab.id === 'customer')
    this.getCustomerMessage()
    this.getTabChange()
  }
}
</script>

<style lang="scss" scoped>
.customer-view {
  display: flex;
  flex-direction: column;
  padding-right: 7px;
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
      &.red-point {
        position: relative;
        &:after {
          position: absolute;
          content: '';
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #F46042;
          top: 10px;
          right: 16px;
        }
      }
    }
  }
}
</style>
