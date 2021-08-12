<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span class="cardTitle">授信使用</span>
      <el-button class="getMore" type="text" @click="getMoreCreditTop()"
        >查看更多>></el-button
      >
    </div>
    <div id="switchChartButton">
      <el-radio-group v-model="originRadio" @change="radioChange">
        <el-radio-button label="1">授信使用率</el-radio-button>
        <el-radio-button label="2">授信使用量</el-radio-button>
      </el-radio-group>
    </div>
    <div class="zEcharts">
      <div
        class="usedCreditContent"
        id="usedCreditEcharts"
        :style="newStyle"
      ></div>
    </div>
  </el-card>
</template>
<script>
import API from '@/api'
import * as echarts from 'echarts'
export default {
  data() {
    return {
      originRadio: '1',
      newStyle: 'height: 500px',
      switchMore: false,
      usedData: [
        '无锡公司',
        '无锡公司',
        '无锡公司',
        '无锡公司',
        '无锡公司',
        '无锡公司',
        '无锡公司',
        '无锡公司',
        '无锡公司',
        '无锡公司',
      ],
    }
  },
  methods: {
    getMoreCreditTop() {
      if (this.switchMore) {
        this.switchMore = false
        this.newStyle = 'height:500px'
        this.usedData = [
          '无锡公司',
          '无锡公司',
          '无锡公司',
          '无锡公司',
          '无锡公司',
          '无锡公司',
          '无锡公司',
          '无锡公司',
          '无锡公司',
          '无锡公司',
        ]
      } else {
        this.switchMore = true
        this.newStyle = 'height:850px'
        this.usedData = [
          '无锡公司',
          '无锡公司',
          '无锡公司',
          '无锡公司',
          '无锡公司',
          '无锡公司',
          '无锡公司',
          '无锡公司',
          '无锡公司',
          '无锡公司',
          '无锡公司',
          '无锡公司',
          '无锡公司',
          '无锡公司',
          '无锡公司',
          '无锡公司',
          '无锡公司',
          '无锡公司',
          '无锡公司',
          '无锡公司',
        ]
      }
      this.initUsedEcharts()
    },
    radioChange(val) {
      console.log(val)
      this.param = '123'
      this.initUsedEcharts()
    },
    initUsedEcharts() {
      let usedCreditChart = null
      usedCreditChart = echarts.init(
        document.getElementById('usedCreditEcharts')
      )
      this.optionUsedCredit = {
        grid: {
          left: '5%',
          bottom: '3%',
          containLabel: true,
        },
        legend: {
          data: ['授信额度', '授信使用'],
          selectedMode: false,
          top: 'top',
          left: 'left',
        },
        xAxis: {
          show: false,
        },
        yAxis: {
          show: true,
          inverse: true,
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          data: this.usedData,
        },
        series: [
          {
            name: '授信使用',
            type: 'bar',
            zlevel: 1,
            barWidth: 10,
            itemStyle: {
              normal: {
                color: '#85b05b',
                borderRadius: 5,
                label: {
                  show: true,
                  position: 'right',
                  offset: [0, -15],
                  formatter: (param) => {
                    return this.param
                  },
                },
              },
            },
            data: [
              31744, 29034, 23489, 18203, 10000, 31744, 29034, 23489, 18203,
              10000, 31744, 29034, 23489, 18203, 10000, 31744, 29034, 23489,
              18203, 10000,
            ],
          },
          {
            name: '授信额度',
            type: 'bar',
            barWidth: 10,
            barGap: '-100%',
            itemStyle: {
              normal: {
                color: '#e6efdd',
                borderRadius: 5,
                label: {
                  show: true,
                  position: 'right',
                },
              },
            },
            data: [
              35000, 32000, 29000, 26000, 12000, 35000, 32000, 29000, 26000,
              12000, 35000, 32000, 29000, 26000, 12000, 35000, 32000, 29000,
              26000, 12000,
            ],
          },
        ],
      }
      usedCreditChart.clear()
      if (this.switchMore) {
        usedCreditChart.resize({ height: '850px' })
      } else {
        usedCreditChart.resize({ height: '500px' })
      }
      usedCreditChart.setOption(this.optionUsedCredit, true)
    },
  },
  mounted() {
      this.initUsedEcharts()
  },
}
</script>
<style lang="scss">
.box-card {
  margin-bottom: 16px;
  .cardTitle {
    font-size: 18px;
    font-weight: bold;
  }
  .getMore {
    float: right;
    padding: 3px 0;
    cursor: pointer;
  }
  #switchChartButton {
    width: 250px;
    height: 40px;
    line-height: 40px;
    margin: auto;
  }
  .zEcharts {
    display: flex;
    .usedCreditContent {
      width: 100%;
    }
  }
}
</style>