<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span class="cardTitle">授信信息</span>
    </div>
    <div class="zEcharts" style="position: relative">
      <div class="creditContent" id="creditBarEcharts"></div>
      <div class="creditContent" id="creditLineEcharts"></div>
      <el-radio-group
        v-model="defaultRadio"
        @change="changeQuantum($event)"
        style="position: absolute; right: 0; top: 36px"
      >
        <el-radio :label="6">半年</el-radio>
        <el-radio :label="12">一年</el-radio>
        <el-radio :label="36">三年</el-radio>
      </el-radio-group>
    </div>
  </el-card>
</template>
<script>
import API from '@/api'
import * as echarts from 'echarts'
export default {
  data() {
    return {
      defaultRadio: 6,
      custType: [],
      creditLimit: [],
      creditUsed: [],
    }
  },
  methods: {
    getCreditInfo() {
      API.cockpit.creditinfo().then(({ data }) => {
        if (data && data.code === 0) {  
          for (const item of data.data) {
            this.custType.push(item.custType)
            this.creditLimit.push(item.creditLimitSum)
            this.creditUsed.push(item.creditUseSum)
          }
          this.initCreditBarEcharts()
        }
      })
    },
    initCreditBarEcharts() {
      let creditBarChart = null
      creditBarChart = echarts.init(document.getElementById('creditBarEcharts'))
      this.optionCreditBar = {
        grid: {
          left: '2%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          show: false,
        },
        yAxis: {
          show: false,
          inverse: true,
          // data: ['全部', '银行', '券商', '保险', '其他'],
          data: this.custType,
        },
        series: [
          {
            type: 'bar',
            zlevel: 1,
            barWidth: 10,
            itemStyle: {
              normal: {
                color: '#f9c446',
                borderRadius: 5,
                label: {
                  show: true,
                  width: 50,
                  color: 'gray',
                  position: 'left',
                  offset: [220, -20],
                  formatter: function (param) {
                    return '用信：' + param.value
                  },
                  rich: {
                    div: {
                      fontWeight: 'bold',
                      fontSize: 14,
                    },
                  },
                },
              },
            },
            data: this.creditUsed,
          },
          {
            type: 'bar',
            barWidth: 10,
            barGap: '-100%',
            itemStyle: {
              normal: {
                color: '#fce7b4',
                borderRadius: 5,
                label: {
                  show: true,
                  width: 50,
                  color: 'gray',
                  position: 'left',
                  offset: [40, -20],
                  formatter: function (param) {
                    return '{div|' + param.name + '}授信：' + param.value
                  },
                  rich: {
                    div: {
                      fontWeight: 'bold',
                      fontSize: 14,
                      padding: [0, 20],
                    },
                  },
                },
              },
            },
            data: this.creditLimit,
          },
        ],
      }
      creditBarChart.setOption(this.optionCreditBar, true)
    },
    initCreditLineEcharts() {
      let creditLineChart = null
      creditLineChart = echarts.init(
        document.getElementById('creditLineEcharts')
      )
      this.optionCreditLine = {
        title: {
          text: '全部创利&收益趋势图',
          left: 'center',
        },
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: ['授信', '用信'],
          left: 'left',
          top: '15%',
        },
        grid: {
          left: '0%',
          top: '25%',
          right: '4%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['2021-1', '2021-2', '2021-3', '2021-4', '2021-5', '2021-6'],
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            name: '授信',
            type: 'line',
            symbol: 'circle',
            smooth: true,
            itemStyle: {
              color: '#78B258',
            },
            data: [220, 182, 191, 234, 290, 330],
          },
          {
            name: '用信',
            type: 'line',
            symbol: 'circle',
            smooth: true,
            itemStyle: {
              color: '#f9c446',
            },
            data: [120, 132, 101, 134, 90, 230],
          },
        ],
      }
      creditLineChart.setOption(this.optionCreditLine, true)
    },
    changeQuantum(val) {},
  },
  mounted() {
    this.getCreditInfo()
    // this.initCreditBarEcharts() //加载授权信息柱状图
    this.initCreditLineEcharts() //加载收益趋势图
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
    #creditBarEcharts {
      width: 40%;
      height: 400px;
    }
    #creditLineEcharts {
      width: 60%;
      height: 400px;
    }
  }
}
</style>