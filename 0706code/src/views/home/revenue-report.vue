<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span class="cardTitle">营收报表</span>
      <el-switch
        v-model="value2"
        active-color="#78B258"
        inactive-color="#78B258"
        active-text="年度"
        inactive-text="季度"
        style="float: right; padding: 3px 0"
        :disabled="switchDisabled"
        @change="changeStatus($event)"
      >
      </el-switch>
    </div>
    <div class="zEcharts">
      <div class="revenueContent" id="revenueEcharts"></div>
    </div>
  </el-card>
</template>
<script>
import API from '@/api'
import * as echarts from 'echarts'
export default {
  data() {
    return {
      value2: false,
      disabled: false,
      xdata: ['第一季度', '第二季度', '第三季度', '第四季度'],
      profitIdx: [],
      profitAct: []
    }
  },
  computed: {
    switchDisabled() {
      return this.disabled
    },
  },
  methods: {
    getProfitReport() {
      this.profitIdx = []
      this.profitAct = []
      API.cockpit.getprofitreport().then(({ data }) => {
        if (data && data.code ===0) {
          for (const item of data.data) {
            this.profitIdx.push(item.profitIdx)
            this.profitAct.push(item.profitAct)
          }
          this.initRevenueEcharts()
        }
        this.disabled = false
      })
    },
    initRevenueEcharts() {
      let revenueChart = null
      revenueChart = echarts.init(document.getElementById('revenueEcharts'))
      this.optionRevenue = {
        title: {
          text: '单位：万元',
          left: '3%',
          textStyle: {
            width: 20,
            color: 'gray',
            fontSize: 12,
          },
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        legend: {
          data: ['利润指标', '利润完成'],
          selectedMode: false,
          top: 'bottom',
        },
        grid: {
          left: '3%',
          right: '4%',
          top: '8%',
          bottom: '10%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            axisTick: false,
            data: this.xdata,
          },
        ],
        yAxis: {
          type: 'value',
        },
        series: [
          {
            name: '利润指标',
            type: 'bar',
            barWidth: 10,
            barGap: '-100%',
            itemStyle: {
              color: '#e6efdd',
              borderRadius: [5, 5, 0, 0],
            },
            data: this.profitIdx,
          },
          // {
          //   name: '利润指标',
          //   type: 'bar',
          //   barGap: '100%',
          //   barWidth: 10,
          //   xAxisIndex: 1,
          //   itemStyle: {
          //     color: '#fef3d9',
          //     borderRadius: [5, 5, 0, 0],
          //   },
          //   data: [1800, 1417, 1149, 1004],
          // },
          {
            name: '利润完成',
            type: 'bar',
            zlevel: 1,
            barWidth: 10,
            itemStyle: {
              color: '#85b05b',
              borderRadius: [5, 5, 0, 0],
            },
            data: this.profitAct,
          },
          // {
          //   name: '利润完成',
          //   type: 'bar',
          //   zlevel: 1,
          //   barGap: '100%',
          //   barWidth: 10,
          //   itemStyle: {
          //     color: '#f9c446',
          //     borderRadius: [5, 5, 0, 0],
          //   },
          //   data: [1700, 1317, 1049, 904],
          // },
        ],
      }
      revenueChart.setOption(this.optionRevenue, true)
    },
    changeStatus($event) {
      this.disabled = true
      if ($event) {
        this.xdata = [
          '一月',
          '二月',
          '三月',
          '四月',
          '五月',
          '六月',
          '七月',
          '八月',
          '九月',
          '十月',
          '十一月',
          '十二月',
        ]
      } else {
        this.xdata = ['第一季度', '第二季度', '第三季度', '第四季度']
      }
      this.getProfitReport()
    },
  },
  mounted() {
    this.getProfitReport()
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
  .zEcharts {
    display: flex;
    .revenueContent {
      width: 100%;
      height: 350px;
    }
  }
}
</style>