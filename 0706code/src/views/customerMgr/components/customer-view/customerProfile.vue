<template>
  <div>
    <div class="remind-box">
      <div class="remind-card">
        <div class="title">
          <div class="title-left">
            业务提醒
            <div class="red-box">8</div>
          </div>
          <div class="title-right">更多</div>
        </div>
        <ul class="content">
          <li class="content-item">
            <div class="red-dot"></div>
            <div class="text">【内部分享】如何建立良好如何建立良好如何建立良好如何建立良好如何建立良好如何建立良好</div>
            <div class="time">2019.04.12 19:00</div>
          </li>
          <li class="content-item">
            <div class="red-dot"></div>
            <div class="text">【内部分享】如何建立良好</div>
            <div class="time">2019.04.12 19:00</div>
          </li>
          <li class="content-item">
            <div class="red-dot"></div>
            <div class="text">【内部分享】如何建立良好</div>
            <div class="time">2019.04.12 19:00</div>
          </li>
          <li class="content-item">
            <div class="red-dot"></div>
            <div class="text">【内部分享】如何建立良好</div>
            <div class="time">2019.04.12 19:00</div>
          </li>
        </ul>
      </div>
      <div class="remind-card">
        <div class="title">
          <div class="title-left">
            舆情信息
            <div class="red-box">8</div>
          </div>
          <div class="title-right">更多</div>
        </div>
        <ul class="content">
          <li class="content-item">
            <div class="red-dot"></div>
            <div class="text">【内部分享】如何建立良好</div>
            <div class="time">2019.04.12 19:00</div>
          </li>
          <li class="content-item">
            <div class="red-dot"></div>
            <div class="text">【内部分享】如何建立良好</div>
            <div class="time">2019.04.12 19:00</div>
          </li>
          <li class="content-item">
            <div class="red-dot"></div>
            <div class="text">【内部分享】如何建立良好</div>
            <div class="time">2019.04.12 19:00</div>
          </li>
          <li class="content-item">
            <div class="red-dot"></div>
            <div class="text">【内部分享】如何建立良好</div>
            <div class="time">2019.04.12 19:00</div>
          </li>
        </ul>
      </div>
    </div>
    <div class="indicator">
      <div class="title">
        <div class="title-text">重要指标</div>
        <div class="button-group">
          <div class="button-item">2018</div>
          <div class="button-item">2019</div>
          <div class="button-item active">2020</div>
        </div>
      </div>
      <div class="content-subject">
        <div class="content-left">
          <div class="legend"></div>
          <div class="card-box">
            <div class="card-item">
              <div class="card-top">
                <div class="number-text">2.46</div>
                <div class="trend">+0.2</div>
              </div>
              <div class="card-bottom">资产余额（亿元）</div>
            </div>
            <div class="card-item">
              <div class="card-top">
                <div class="number-text">2.46</div>
                <div class="trend">+0.2</div>
              </div>
              <div class="card-bottom">资产余额（亿元）</div>
            </div>
            <div class="card-item">
              <div class="card-top">
                <div class="number-text">2.46</div>
                <div class="trend">+0.2</div>
              </div>
              <div class="card-bottom">资产余额（亿元）</div>
            </div>
            <div class="card-item">
              <div class="card-top">
                <div class="number-text">2.46</div>
                <div class="trend">+0.2</div>
              </div>
              <div class="card-bottom">资产余额（亿元）</div>
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
        <div class="button-group">
          <div class="button-item">1个月</div>
          <div class="button-item">3个月</div>
          <div class="button-item">6个月</div>
          <div class="button-item">1年</div>
          <div class="button-item">3年</div>
          <div class="button-item active">全部</div>
        </div>
      </div>
      <div class="time-content">
        <div class="timer-x"></div>
        <div class="timer-box">
          <div class="timer-item">
            <div class="timer-node"></div>
            <div class="timer-text" :data-date="'2015.05.01'">
              <span>第一次xx业务</span>
              <i class="el-icon-arrow-right"></i>
            </div>
          </div>
          <div class="timer-item">
            <div class="timer-node"></div>
            <div class="timer-text" :data-date="'2015.05.01'">
              <span>第一次xx业务</span>
              <i class="el-icon-arrow-right"></i>
            </div>
          </div>
          <div class="timer-item">
            <div class="timer-node"></div>
            <div class="timer-text" :data-date="'2015.05.01'">
              <span>第一次xx业务</span>
              <i class="el-icon-arrow-right"></i>
            </div>
          </div>
          <div class="timer-item">
            <div class="timer-node"></div>
            <div class="timer-text" :data-date="'2015.05.01'">
              <span>第一次xx业务</span>
              <i class="el-icon-arrow-right"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as echarts from 'echarts'
import getBalanceOptions, { getLinesOptions } from './option'
export default {
  computed: {
  },
  data() {
    return {
      tabs: []
    }
  },
  methods: {
    getEchartsBalanceView(id) {
      let chartDom = this.$refs[id]
      let myChart = echarts.init(chartDom)
      let option = getBalanceOptions(2.35)
      option && myChart.setOption(option)
    },
    getEchartsLinesView(id) {
      let chartDom = this.$refs[id]
      let myChart = echarts.init(chartDom)
      let option = getLinesOptions(2.35)
      option && myChart.setOption(option)
    }
  },
  created() {
  },
  mounted() {
    this.getEchartsBalanceView('chartTop')
    this.getEchartsLinesView('chartBottom')
  }
}
</script>

<style lang="scss" scoped>
.red-col {
  color: #F46042;
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
    .timer-x {
      position: absolute;
      width: 100%;
      left: 0;
      bottom: 55px;
      height: 4px;
      background: #79AC43;
      border-radius: 3px;
      z-index: 1;
    }
    .timer-box {
      position: absolute;
      bottom: 50px;
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
          max-width: 131px;
          height: 40px;
          background: #FFFFFF;
          border-radius: 3px;
          border: 1px solid #79AC43;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #79AC43;
          display: flex;
          align-items: center;
          white-space: nowrap;
          text-align: center;
          padding: 10px 10px 10px 16px;
          &:after {
            content: attr(data-date);
            height: 20px;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #323232;
            position: absolute;
            bottom: 40px;
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
