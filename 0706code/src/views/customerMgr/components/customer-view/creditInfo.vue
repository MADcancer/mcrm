<template>
  <div class="credit-box mt-16">
    <div class="credit-title">
      <div>授信信息</div>
      <div>授信明细 <i class="el-icon-arrow-right"></i></div>
    </div>
    <div class="credit-info">
      <div class="title">
        <div class="title-text">当前授信额度：20亿元</div>
        <div class="button-group">
          <div class="button-item">2018</div>
          <div class="button-item">2019</div>
          <div class="button-item active">2020</div>
        </div>
      </div>
      <div class="credit-content">
        <div class="left-card">
          <div class="card-item">
            <div class="top-text">13.46</div>
            <div class="describe">可用额度（亿元）</div>
          </div>
          <div class="card-item">
            <div class="top-text">13.46</div>
            <div class="describe">已用额度（亿元）</div>
          </div>
          <div class="card-item">
            <div class="top-text">13.46</div>
            <div class="describe">冻结额度（亿元）</div>
          </div>
          <div class="card-item">
            <div class="top-text">13.46</div>
            <div class="describe">总额度（亿元）</div>
          </div>
          <div class="card-item">
            <div class="top-text">13.46</div>
            <div class="describe">总额当年累计占用（亿元）</div>
          </div>
          <div class="card-item">
            <div class="top-text">13.46</div>
            <div class="describe">当年平均额度（亿元）</div>
          </div>
        </div>
        <div class="right-echarts" ref="creditEcharts">
        </div>
      </div>
    </div>
    <div class="divider spacing"></div>
    <div class="credit-history">
      <div class="title">
        <div class="title-text">授信占用历史</div>
        <div class="button-group">
          <div class="button-item">1个月</div>
          <div class="button-item">3个月</div>
          <div class="button-item">6个月</div>
          <div class="button-item">1年</div>
          <div class="button-item">3年</div>
          <div class="button-item active">全部</div>
        </div>
      </div>
      <div class="history-echarts" ref="historyEcharts">
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import {getCreditOptions, getCreditHistoryOptions} from './option'

export default {
  data() {
    return {
      isSupp: window.SITE_CONFIG['isSupp'] === '1'
    }
  },
  mounted() {
    this.getEchartsCreditView()
    this.getEchartsCreditHistoryView()
  },
  methods: {
    getEchartsCreditView() {
      let chartDom = this.$refs['creditEcharts']
      let myChart = echarts.init(chartDom)
      let option = getCreditOptions()
      if (option) {
        myChart.clear()
        myChart.setOption(option)
      }
    },
    getEchartsCreditHistoryView() {
      let chartDom = this.$refs['historyEcharts']
      let myChart = echarts.init(chartDom)
      let option = getCreditHistoryOptions()
      if (option) {
        myChart.clear()
        myChart.setOption(option)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.credit-box {
  display: flex;
  flex-direction: column;
  height: 977px;
  background: #FFFFFF;
  box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.06);
  padding: 16px 20px;
  border-radius: 8px;
  .credit-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    div:first-of-type {
      font-size: 20px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
    }
    div:last-of-type {
      cursor: pointer;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #79AC43;
    }
  }
  .credit-info {
    margin-top: 35px;
    display: flex;
    flex-direction: column;
    .credit-content {
      padding-top: 16px;
      margin-top: 10px;
      display: flex;
      .left-card {
        flex: 3;
        display: flex;
        flex-wrap: wrap;
        .card-item {
          width: calc((100% - 16px)/3);
          height: 110px;
          background: rgba(35, 150, 107, 0.05);
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          padding: 22px 0 21px 44px;
          margin-left: 8px;
          .top-text {
            font-size: 32px;
            font-family: DINAlternate-Bold, DINAlternate;
            font-weight: bold;
            color: #333333;
            line-height: 37px;
          }
          .describe {
            margin-top: 10px;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #666666;
          }
          &:nth-of-type(3n+1) {
            margin-left: 0;
          }
          &:nth-of-type(n+4) {
            margin-top: 8px;
          }
          &:nth-of-type(1) {
            background: #85B05B;
            .top-text {
              color: #ffffff;
            }
            .describe {
              color: #ffffff;
            }
          }
          &:nth-of-type(2) {
            background: #7EACEA;
            .top-text {
              color: #ffffff;
            }
            .describe {
              color: #ffffff;
            }
          }
          &:nth-of-type(3) {
            background: #F0BC3E;
            .top-text {
              color: #ffffff;
            }
            .describe {
              color: #ffffff;
            }
          }
        }
      }
      .right-echarts {
        flex: 2;
      }
    }
  }
  .spacing {
    margin: 25px 0 40px;
  }
  .credit-history {
    flex: 1;
    display: flex;
    flex-direction: column;
    .history-echarts {
      margin-top: 20px;
      flex: 1;
    }
  }
}
</style>
