<template>
  <div class="senior-executive mt-16">
    <div class="title">
      <div class="title-text">高管信息</div>
    </div>
    <div class="no-data" v-if="!executivesList.length">暂无数据</div>
    <div v-if="executivesList.length" class="member-card" v-for="item in executivesList" :key="item.id">
      <div class="member-name">
        <div class="name">{{item.stockName | formatValue}}</div>
        <div class="phone">{{item.stockName | formatValue}}</div>
      </div>
      <div class="member-message">
        <div class="label">性别</div>
        <div class="value">男</div>
      </div>
      <div class="member-message">
        <div class="label">国籍</div>
        <div class="value">中国</div>
      </div>
      <div class="member-message">
        <div class="label">高管类别</div>
        <div class="value">{{item.stockType}}</div>
      </div>
      <div class="member-message">
        <div class="label">证件类型</div>
        <div class="value">身份证</div>
      </div>
      <div class="member-message">
        <div class="label">证件号码</div>
        <div class="value">875699857485689965</div>
      </div>
      <div class="divider-vertical"></div>
      <div class="member-message">
        <div class="label">登记人</div>
        <div class="value">周土口</div>
      </div>
      <div class="member-message">
        <div class="label">登记时间</div>
        <div class="value">2021-10-1</div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api'
import { Constants } from '../../constants'

export default {
  props: {
    socCode: {
      type: String
    }
  },
  data() {
    return {
      executivesList: []
    }
  },
  created() {
    this.getExecutivesList()
  },
  mounted() {
  },
  methods: {
    getExecutivesList() {
      let params = {
        socCode: this.socCode,
        current: 1,
        size: 10
      }
      api.customerView.getExecutivesList(params).then(({data}) => {
        if (data && data.code === Constants.HTTP_SUCCESS) {
          console.log('getExecutivesList', data)
          this.executivesList = data.data ? data.data.records : []
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.senior-executive {
  display: flex;
  flex-direction: column;
  padding: 16px 8px;
  .member-card {
    display: flex;
    margin-top: 16px;
    background: #FFFFFF;
    box-shadow: 0px 4px 16px 0px rgba(1, 58, 129, 0.1);
    border-radius: 8px;
    .member-name {
      width: 133px;
      flex-shrink: 0;
      background: #79AC43;
      border-radius: 8px;
      padding: 18px 20px;
      .name {
        height: 25px;
        font-size: 18px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #FFFFFF;
        line-height: 25px;
      }
      .phone {
        margin-top: 8px;
        word-break: break-all;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #FFFFFF;
        line-height: 20px;
      }
    }
    .member-message {
      margin-left: 2%;
      padding: 18px 0;
      flex: 1;
      .label {
        height: 20px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
        line-height: 20px;
      }
      .value {
        margin-top: 12px;
        word-break: break-all;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
        line-height: 20px;
      }
    }
    .divider-vertical {
      flex-shrink: 0;
      margin: 20px 6px 20px 2%;
      width: 1px;
      height: 48px;
      background: #EDEDED;
      border-radius: 3px;
    }
  }
}
</style>
