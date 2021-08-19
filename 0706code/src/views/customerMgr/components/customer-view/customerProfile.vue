<template>
  <div>
    <div class="remind-box">
      <div class="remind-card">
        <div class="title">
          <div class="title-left">
            业务提醒
            <div class="red-box" v-if="warnList.length">{{warnList.length}}</div>
          </div>
          <div class="title-right" v-if="warnList.length">更多</div>
        </div>
        <ul class="content" v-if="warnList.length">
          <li class="content-item" v-for="item in warnList" :key="item.id">
            <div class="red-dot"></div>
            <div class="text">{{`【${item.warnType}】${item.warnInfo}`}}</div>
            <div class="time">{{item.endDt}}</div>
          </li>
        </ul>
        <div v-else class="no-data">
          暂无数据
        </div>
      </div>
      <div class="remind-card">
        <div class="title">
          <div class="title-left">
            舆情信息
            <div class="red-box" v-if="opinionList.length">{{opinionList.length}}</div>
          </div>
          <div class="title-right" v-if="opinionList.length">更多</div>
        </div>
        <ul class="content" v-if="opinionList.length">
          <li class="content-item" v-for="item in opinionList" :key="item.id">
            <div class="red-dot"></div>
            <div class="text">{{`【${item.tagList}】${item.title}`}}</div>
            <div class="time">{{item.endDate}}</div>
          </li>
        </ul>
        <div v-else class="no-data">
          暂无数据
        </div>
      </div>
    </div>
    <div class="indicator">
      <div class="title">
        <div class="title-text">重要指标</div>
        <div class="button-group">
          <div class="button-item" :class="{'active': item.active}" v-for="(item, index) in yearsList" :key="index" @click="yearChange(item)">{{item.value}}</div>
        </div>
      </div>
      <div class="content-subject">
        <div class="content-left">
          <div class="legend">
            <div class="legend-echarts" ref="legend"></div>
            <div class="legend-table">
              <div class="title">
                <div class="title-text" style="font-weight: 500">综合贡献率</div>
              </div>
              <div class="table-content">
                <div class="table-header">
                  <div class="first-td">指示名称</div>
                  <div>本年度</div>
                  <div>较上年</div>
                  <div>排名</div>
                </div>
                <div class="table-td">
                  <div class="first-td">资产余额</div>
                  <div>{{custContribute.aum | moneyFormat}}万元</div>
                  <div :style="getColor(custContribute.aumCompare)">{{ getValueStr(custContribute.aumCompare) }}</div>
                  <div>{{custContribute.aumRank ? (custContribute.aumRank + '/' + custContribute.custCount) : '-'}}</div>
                </div>
                <div class="table-td">
                  <div class="first-td">产品覆盖度</div>
                  <div>{{ custContribute.prodCount }}个</div>
                  <div :style="getColor(custContribute.prodCompare)">{{ getValueStr(custContribute.prodCompare) }}</div>
                  <div>{{custContribute.prodRank ? (custContribute.prodRank + '/' + custContribute.custCount) : '-'}}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="card-box">
            <div class="card-item">
              <div class="card-top">
                <div class="number-text">{{custContribute.aum | moneyFormat}}</div>
                <div class="trend" :style="getColor(custContribute.aumCompare)">{{getValueStr(custContribute.aumCompare)}}</div>
              </div>
              <div class="card-bottom">资产余额（亿元）</div>
            </div>
            <div class="card-item">
              <div class="card-top">
                <div class="number-text">{{custContribute.transAmt | moneyFormat}}</div>
                <div class="trend" :style="getColor(custContribute.aumCompare)">{{getValueStr(custContribute.aumCompare)}}</div>
              </div>
              <div class="card-bottom">交易发生额（亿元）</div>
            </div>
            <div class="card-item">
              <div class="card-top">
                <div class="number-text">{{custContribute.transNum | moneyFormat}}</div>
<!--                <div class="trend">+0.2</div>-->
              </div>
              <div class="card-bottom">交易笔数</div>
            </div>
            <div class="card-item">
              <div class="card-top">
                <div class="number-text">{{custContribute.usebAmt | moneyFormat}}</div>
<!--                <div class="trend">+0.2</div>-->
              </div>
              <div class="card-bottom">授信占用</div>
            </div>
          </div>
        </div>
        <div class="content-right">
          <div class="chart-item" ref="chartTop"></div>
          <div class="chart-item" ref="chartBottom"></div>
        </div>
      </div>
    </div>
    <div class="time-line">
      <div class="title">
        <div class="title-text">合作时间线</div>
      </div>
      <div class="time-content">
        <div class="timer-x" :style="{width: timeLineWidth}"></div>
        <div class="timer-box">
          <div class="timer-item" v-for="item in custCooperation" :key="item.id">
            <div class="timer-node"></div>
            <div class="timer-text" :data-date="item.dataDt">
              <span>业务余额: {{item.aum | moneyFormat}}</span>
              <span>授信额度: {{item.creditAmt | moneyFormat}}</span>
              <span>持有产品数: {{item.prodCount | moneyFormat}}</span>
              <span>用信额度: {{item.usebAmt | moneyFormat}}</span>
<!--              <i class="el-icon-arrow-right"></i>-->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as echarts from 'echarts'
import getBalanceOptions, {getAssets, getLinesOptions} from './option'
import api from '@/api'
import { Constants } from '../../constants'
export default {
  computed: {
  },
  props: {
    socCode: {
      type: String
    }
  },
  data() {
    return {
      tabs: [],
      warnList: [],
      opinionList: [],
      yearsList: [],
      yearSelected: {
        value: '2020',
        active: true
      },
      custContribute: {},
      businessInfoCredit: {},
      businessInfoLetter: {},
      custCooperation: [],
      timeLineWidth: ''
    }
  },
  methods: {
    getValueStr(value) {
      return value ? '+' + value : value
    },
    getColor(value) {
      return {color: value ? '#F46042' : '#79AC43'}
    },
    getCustWarnInfo() {
      let params = {
        socCode: this.socCode,
        warnUserNo: this.$store.state.user.id
      }
      api.customerView.getCustWarnInfo(params).then(({data}) => {
        if (data && data.code === Constants.HTTP_SUCCESS) {
          console.log('getCustWarnInfo', data)
          this.warnList = data.data || []
        }
      })
    },
    getOpinionList() {
      let params = {
        socCode: this.socCode,
        userNo: this.$store.state.user.id,
        roleId: this.$store.state.user.roleId
      }
      api.customerView.getOpinionInfo(params).then(({data}) => {
        if (data && data.code === Constants.HTTP_SUCCESS) {
          console.log('getOpinionInfo', data)
          this.opinionList = data.data || []
        }
      })
    },
    getBusinessInfoYear(callback) {
      let params = {
        socCode: this.socCode
      }
      api.customerView.getBusinessInfoYear(params).then(({data}) => {
        if (data && data.code === Constants.HTTP_SUCCESS) {
          let years = Array.isArray(data.data) ? data.data.reverse() : []
          years.forEach((year, index) => {
            let item = {
              value: year,
              active: false
            }
            if (index === years.length - 1) {
              item.active = true
              this.yearSelected = item
            }
            this.yearsList.push(item)
          })
          callback()
        }
      })
    },
    getCustContribute() {
      let params = {
        socCode: this.socCode,
        dataDt: this.yearSelected.value
      }
      api.customerView.getCustContribute(params).then(({data}) => {
        if (data && data.code === Constants.HTTP_SUCCESS) {
          console.log('getCustContribute', data)
          this.custContribute = data.data || {}
          this.$nextTick(() => {
            this.getAssets(data.data)
          })
        }
      })
    },
    getBusinessInfoHis(type) {
      let params = {
        socCode: this.socCode,
        dataDt: this.yearSelected.value,
        type: type
      }
      api.customerView.getBusinessInfoHis(params).then(({data}) => {
        if (data && data.code === Constants.HTTP_SUCCESS) {
          console.log('getBusinessInfoHis', data)
          if (type === 1) {
            this.$nextTick(() => {
              this.getEchartsBalanceView(data.data)
            })
          } else {
            this.$nextTick(() => {
              this.getEchartsLinesView(data.data)
            })
          }
        }
      })
    },
    getCustCooperation() {
      let params = {
        socCode: this.socCode
      }
      api.customerView.getCustCooperation(params).then(({data}) => {
        if (data && data.code === Constants.HTTP_SUCCESS) {
          console.log('getCustCooperation', data)
          if (Array.isArray(data.data)) {
            this.timeLineWidth = 150 * data.data.length + 'px'
            this.custCooperation = data.data.reverse()
          } else {
            this.custCooperation = []
            this.timeLineWidth = '100%'
          }
        }
      })
    },
    getEchartsBalanceView(data) {
      let chartDom = this.$refs.chartTop
      let myChart = echarts.init(chartDom)
      let option = getBalanceOptions(data)
      myChart.clear()
      option && myChart.setOption(option)
    },
    getEchartsLinesView(data) {
      let chartDom = this.$refs.chartBottom
      let myChart = echarts.init(chartDom)
      let option = getLinesOptions(data)
      myChart.clear()
      option && myChart.setOption(option)
    },
    getAssets(data) {
      let chartDom = this.$refs.legend
      let myChart = echarts.init(chartDom)
      let option = getAssets(data)
      myChart.clear()
      option && myChart.setOption(option)
    },
    yearChange(item) {
      for (const year of this.yearsList) {
        year.active = false
      }
      item.active = true
      this.yearSelected = item
      this.getAllData()
    },
    getAllData() {
      if (this.yearsList.length) {
        this.getCustContribute()
        this.getBusinessInfoHis(1)
        this.getBusinessInfoHis(2)
      } else {
        this.getBusinessInfoYear(() => {
          this.getCustContribute()
          this.getBusinessInfoHis(1)
          this.getBusinessInfoHis(2)
        })
      }
    }
  },
  created() {
    this.getCustWarnInfo()
    this.getOpinionList()
    this.getAllData()
    this.getCustCooperation()
  },
  mounted() {
  }
}
</script>

<style lang="scss" scoped>
.red-col {
  color: #F46042;
}
.no-data {
  height: 122px;
  text-align: center;
  line-height: 122px;
}
.remind-box {
  display: flex;
  margin-top: 16px;
  .remind-card {
    width: calc(50% - 8px);
    margin-left: 16px;
    background: #FFFFFF;
    box-shadow: 0px 4px 16px 0px rgba(1, 58, 129, 0.1);
    border-radius: 4px;
    padding: 15px 20px 10px;
    &:first-of-type {
      margin-left: 0;
    }
    .title {
      height: 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .title-left {
        display: flex;
        align-items: center;
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #323232;
        height: 22px;
        .red-box{
          padding: 0px 8px;
          background: #F46042;
          border-radius: 8px;
          font-size: 14px;
          color: #FFFFFF;
          margin-left: 8px;
        }
      }
      .title-right {
        width: 68px;
        height: 32px;
        background: #FFFFFF;
        border-radius: 4px;
        border: 1px solid #23966B;
        font-size: 14px;
        color: #23966B;
        line-height: 32px;
        text-align: center;
        cursor: pointer;
      }
    }
    .content {
      display: flex;
      flex-direction: column;
      margin-top: 7px;
      .content-item {
        display: flex;
        align-items: center;
        padding: 8px 0;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
        position: relative;
        &:after {
          content: '';
          width: calc(100% + 8px);
          position: absolute;
          left: 12px;
          top: 100%;
          height: 1px;
          background: #EEEEEE;
        }
        &:last-of-type:after {
          display: none;
        }
        .red-dot {
          width: 6px;
          height: 6px;
          background: #F46042;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .text {
          flex: 1;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}
.indicator {
  margin-top: 16px;
  padding: 16px 16px 24px 20px;
  background: #FFFFFF;
  box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.06);
  border-radius: 8px;
  .content-subject {
    height: 565px;
    display: flex;
    margin-top: 8px;
    .content-left {
      display: flex;
      flex-direction: column;
      flex: 6;
      .legend {
        height: 254px;
        border-bottom: 1px solid #EDEDED;
        display: flex;
        .legend-echarts {
          width: 220px;
          height: 220px;
          flex-shrink: 0;
        }
        .legend-table {
          flex: 1;
          margin-top: 30px;
          .table-content {
            margin-top: 10px;
            display: flex;
            flex-direction: column;
            .table-header {
              height: 32px;
              background: #79AC43;
              border-radius: 1px;
              color: #FFFFFF;
              font-size: 14px;
              display: flex;
              align-items: center;
              div {
                padding-left: 16px;
                text-align: left;
                flex: 1;
                &.first-td {
                  width: 100px;
                  flex-shrink: 0;
                }
              }
            }
            .table-td {
              height: 40px;
              background: #F4F4F4;
              border-radius: 1px;
              color: #666666;
              font-size: 14px;
              display: flex;
              align-items: center;
              div {
                padding-left: 16px;
                text-align: left;
                flex: 1;
                &.first-td {
                  width: 100px;
                  flex-shrink: 0;
                }
              }
              &:nth-of-type(2) {
                background: #FFFFFF;
              }
            }
          }
        }
      }
      .card-box {
        display: flex;
        margin-top: 16px;
        flex-wrap: wrap;
        .card-item {
          display: flex;
          flex-direction: column;
          margin-top: 16px;
          margin-left: 16px;
          padding: 32px;
          width: calc(50% - 8px);
          height: 131px;
          background: #FDF9F2;
          border-radius: 8px;
          &:nth-of-type(odd) {
            margin-left: 0;
          }
          .card-top {
            display: flex;
            align-items: flex-end;
            .number-text {
              height: 37px;
              font-size: 32px;
              font-family: DINAlternate-Bold, DINAlternate;
              font-weight: bold;
              color: #333333;
              line-height: 37px;
            }
            .trend {
              margin-left: 8px;
              margin-bottom: 5px;
              font-size: 14px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #F46042;
              line-height: 20px;
            }
          }
          .card-bottom {
            margin-top: 10px;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #666666;
            line-height: 20px;
          }
        }
      }
    }
    .content-right {
      display: flex;
      flex-direction: column;
      flex: 5;
      .chart-item {
        height: 50%;
      }
    }
  }
}
.time-line {
  display: flex;
  flex-direction: column;
  margin-top: 16px;
  height: 308px;
  background: #FFFFFF;
  box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.06);
  border-radius: 8px;
  padding: 16px;
  .time-content {
    flex: 1;
    position: relative;
    overflow-x: auto;
    overflow-y: hidden;
    .timer-x {
      position: absolute;
      width: 100%;
      left: 0;
      bottom: 35px;
      height: 4px;
      background: #79AC43;
      border-radius: 3px;
      z-index: 1;
    }
    .timer-box {
      position: absolute;
      bottom: 30px;
      width: 100%;
      left: 0;
      z-index: 2;
      display: flex;
      align-items: flex-end;
      .timer-item {
        margin-left: 123px;
        position: relative;
        &:first-of-type {
          margin-left: 95px;
        }
        .timer-node {
          width: 24px;
          height: 13px;
          background: #FFFFFF;
          border-radius: 7px;
          border: 4px solid #79AC43;
          position: relative;
          &:after {
            content: '';
            position: absolute;
            width: 1px;
            background: #23966B;
            border-radius: 4px;
            bottom: 9px;
            left: 7px;
          }
        }
        .timer-text {
          cursor: pointer;
          position: absolute;
          transform: translateX(calc(12px - 50%));
          background: #FFFFFF;
          border-radius: 3px;
          border: 1px solid #79AC43;
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #79AC43;
          display: flex;
          white-space: nowrap;
          padding: 10px 10px 10px 16px;
          flex-direction: column;
          line-height: 16px;
          &:after {
            content: attr(data-date);
            height: 20px;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #323232;
            position: absolute;
            bottom: 100%;
            text-align: center;
            width: 100%;
            left: 0;
          }
          span {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
        &:nth-of-type(odd) {
          .timer-node:after {
            height: 16px;
          }
          .timer-text {
            bottom: 29px;
          }
        }
        &:nth-of-type(even) {
          .timer-node:after {
            height: 86px;
          }
          .timer-text {
            bottom: 99px;
          }
        }
      }
    }
  }
}
</style>
