<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span class="cardTitle">客户TOP10</span>
      <el-button type="text" class="getMore" @click="getMoreGuest()"
        >查看更多>></el-button
      >
    </div>
    <div class="zEcharts">
      <div class="guestContent" id="guestEcharts"></div>
    </div>
  </el-card>
</template>
<script>
import API from '@/api'
import * as echarts from 'echarts'
export default {
  data() {
    return {
      top: 10,
      custName: [],
      assetBal: [],
      tradeAmt: [],
      tradeNum: []
    }
  },
  methods: {
    getCustAssetTop() {
      const param = {
        quantity: this.top,
      }
      this.custName = [],
      this.assetBal = [],
      this.tradeAmt = [],
      this.tradeNum = []
      API.cockpit.custAssetTop(param).then(({ data }) => {
        if (data && data.code === 0) {
          console.log(data.data)
          for (const item of data.data) {
            this.custName.push(item.custName)
            this.assetBal.push(item.assetBal)
            this.tradeAmt.push(item.tradeAmt)
            this.tradeNum.push(item.tradeNum)
          }
          this.initGuestEcharts()
        }
      })
    },
    initGuestEcharts() {
      let guestChart = null
      guestChart = echarts.init(document.getElementById('guestEcharts'))
      this.optionGuest = {
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
          data: ['资产余额', '交易量', '交易笔数'],
          top: 'bottom',
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '10%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          axisTick: false,
          axisLabel: {
            interval: 0,
            rotate: 45,
          },
          data: this.custName,
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            name: '资产余额',
            type: 'bar',
            barWidth: 8,
            itemStyle: {
              borderRadius: [5, 5, 0, 0],
            },
            data: this.assetBal,
          },
          {
            name: '交易量',
            type: 'bar',
            barWidth: 8,
            itemStyle: {
              borderRadius: [5, 5, 0, 0],
            },
            data: this.tradeAmt,
          },
          {
            name: '交易笔数',
            type: 'bar',
            barWidth: 8,
            itemStyle: {
              borderRadius: [5, 5, 0, 0],
            },
            data: this.tradeNum,
          },
        ],
        // dataZoom: {
        // show: true,
        // realtime: true,
        // type:'inside',
        // height: 20, // 表示滚动条的高度，也就是粗细
        // start: 0, // 表示默认展示20%～80%这一段。
        // end: 80
        // }
      }
      guestChart.setOption(this.optionGuest, true)
    },
    getMoreGuest() {
      if (this.top === 10) {
        this.top = 20
      } else {
        this.top = 10
      }
      this.getCustAssetTop()
    },
  },
  mounted() {
    this.getCustAssetTop()
    // this.initGuestEcharts() //加载客户TOP10
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
  .zEcharts {
    display: flex;
    .guestContent {
      width: 100%;
      height: 350px;
    }
  }
}
</style>