<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span class="cardTitle">全行资产分布图</span>
    </div>
    <div class="zEcharts">
      <div class="propContent" id="propEcharts"></div>
      <div class="propContent">
        <el-table
          :data="tableData"
          max-height="400"
          style="width: 90%; margin: auto"
          :row-style="{ height: '0px' }"
          :header-cell-style="{ color: '#000', background: 'lightgray' }"
        >
          <el-table-column prop="prodName" label="资产名称"> </el-table-column>
          <el-table-column prop="proportion" label="占比"> </el-table-column>
          <el-table-column prop="assetBal" label="金额（万元）">
          </el-table-column>
        </el-table>
      </div>
    </div>
  </el-card>
</template>
<script>
import API from '@/api'
import filters from '@/filters'
import * as echarts from 'echarts'
export default {
  data() {
    return {
      totalVal: '',
      pieData: [],
      tableData: [],
    }
  },
  methods: {
    getBankAssets() {
      API.cockpit.getAssetDist().then(({ data }) => {
        if (data && data.code === 0) {
          this.totalVal = data.data.total
          for (const item of data.data.data) {
            this.tableData.push({
              prodName: item.prodName,
              proportion: (item.proportion * 100) + '%',
              assetBal: item.assetBal,
            })
            this.pieData.push({ name: item.prodName, value: item.proportion })
          }
          this.initPropEcharts()
        }
      })
    },
    initPropEcharts() {
      let propChart = null
      propChart = echarts.init(document.getElementById('propEcharts'))
      this.optionProp = {
        title: {
          text: '总资产\n' + filters.moneyFormat(this.totalVal),
          top: 'center',
          left: '39%',
          textAlign: 'center',
        },
        tooltip: {
          trigger: 'item',
        },
        legend: {
          top: 'middle',
          right: 20,
          icon: 'circle',
          orient: 'vertical',
        },
        series: [
          {
            name: '资产分布',
            type: 'pie',
            center: ['40%', '50%'],
            radius: ['50%', '80%'],
            label: {
              show: true,
              textStyle: {
                fontSize: 14,
              },
              formatter: function (param) {
                return param.value * 100 + '%'
              },
            },
            data: this.pieData,
          },
        ],
      }
      propChart.setOption(this.optionProp, true)
    },
  },
  mounted() {
    this.getBankAssets()
    // this.initPropEcharts() //加载全行资产分布图
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
    .propContent {
      width: 50%;
      height: 350px;
    }
  }
}
</style>
