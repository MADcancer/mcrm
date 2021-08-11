<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix" style="line-height: 40px">
      <span class="cardTitle">客户数量分布</span>
      <el-select
        v-model="richValue"
        clearable
        placeholder="全部"
        style="float: right"
        @change="changeTypeHandle($event)"
      >
        <el-option
          v-for="item in richOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <span style="float: right; margin-right: 8px">客户类型</span>
    </div>
    <div class="zEcharts">
      <div class="map-container" id="mapEcharts"></div>
      <div class="vip-container" id="vipEcharts"></div>
    </div>
    <guest-detail ref="guestDetail"></guest-detail>
  </el-card>
</template>
<script>
import API from '@/api'
import * as echarts from 'echarts'
import china from '@/assets/json/china.json'
import guestDetail from './guest-detail'
export default {
  data() {
    return {
      richOptions: [
        {
          value: '1',
          label: '资产1',
        },
        {
          value: '2',
          label: '资产2',
        },
        {
          value: '3',
          label: '资产3',
        },
        {
          value: '4',
          label: '资产4',
        },
        {
          value: '5',
          label: '资产5',
        },
      ],
      richValue: '',
      oriData: [
        { name: '北京', value: this.randomData(), No: 1 },
        { name: '上海', value: this.randomData(), No: 1 },
        { name: '广州', value: this.randomData(), No: 1 },
        { name: '深圳', value: this.randomData(), No: 1 },
        { name: '浙江', value: this.randomData(), No: 1 },
        { name: '江苏', value: this.randomData(), No: 1 },
        { name: '山东', value: this.randomData(), No: 1 },
        { name: '安徽', value: this.randomData(), No: 1 },
        { name: '广东', value: this.randomData(), No: 1 },
        { name: '福建', value: this.randomData(), No: 1 },
      ],
      mapData: [],
      barXData: [],
      barYData: [],
    }
  },
  components: {
    guestDetail,
  },
  methods: {
    // 地图数据
    randomData: function () {
      return Math.round(Math.random() * 1000)
    },
    getCustDist(custType) {
      const params = {
        custType: custType || '',
      }
      API.cockpit
        .custDist(params)
        .then(({ data }) => {
          if (data && data.code === 0) {
            this.barXData = []
            this.barYData = []
            this.mapData = []
            const barData = data.data.slice(0, 10)
            for (const item of data.data) {
              this.mapData.push({ name: item.proivince, value: item.custCount })
            }
            for (const item of barData) {
              this.barXData.push(item.proivince)
              this.barYData.push(item.custCount)
            }
            const count = 10 - barData.length
            for (let i = 0; i < 10 - barData.length; i++) {
              this.barXData.push('')
              this.barYData.push('')
              count--
              if (!count) {
                break
              }
            }
          }
        })
        .then(() => {
          this.initMapEcharts()
          this.initVipEcharts()
        })
    },
    initMapEcharts() {
      // echarts画图实例
      let chinaMapChart = null
      // 画图区域
      chinaMapChart = echarts.init(document.getElementById('mapEcharts'))
      this.optionChinaMap = {
        tooltip: {
          trigger: 'item',
          formatter: function (param) {
            if (!param.value) {
              return param.name + '--'
            }
            return param.name + ' : ' + param.value
          },
        },
        visualMap: {
          //颜色的设置  dataRange
          textStyle: { color: '#000' },
          x: 'left',
          y: 'bottom',
          splitList: [
            { start: 0, end: 100 },
            { start: 100, end: 200 },
            { start: 200, end: 300 },
            { start: 300, end: 400 },
            { start: 400 },
          ],
          show: true,
          // text:['高','低'],// 文本，默认为数值文本
          color: ['#f9c446', '#facf6a', '#fce7b4', '#fdf3d9', '#f5f5f5'],
        },
        series: [
          {
            name: '全国数据',
            type: 'map',
            mapType: 'china',
            zoom: 1.1, //地图大小
            roam: false, //是否开启鼠标缩放和平移漫游
            itemStyle: {
              //地图区域的多边形 图形样式
              normal: {
                borderColor: '#f6f6f6',
                //是图形在默认状态下的样式
              },
              emphasis: {
                //是图形在高亮状态下的样式,比如在鼠标悬浮或者图例联动高亮时
                label: { show: true, fontSize: 12 },
              },
            },
            showLegendSymbol: false,
            top: '50', //组件距离容器的距离
            data: this.mapData,
          },
        ],
      }
      echarts.registerMap('china', china)
      chinaMapChart.setOption(this.optionChinaMap, true)
      chinaMapChart.on('click', (params) => {
        this.$refs.guestDetail.visible = true
        this.$refs.guestDetail.getData(params)
      })
    },
    initVipEcharts() {
      let vipChart = null
      // 画图区域
      vipChart = echarts.init(document.getElementById('vipEcharts'))
      this.optionVip = {
        title: [
          {
            text: '重点客户分布TOP10',
          },
          {
            text: '单位: 人',
            right: 0,
            textStyle: {
              color: 'lightgray',
              fontSize: 12,
            },
          },
        ],
        // tooltip: {
        //   trigger: 'axis',
        //   axisPointer: {
        //     type: 'shadow',
        //   },
        // },
        grid: {
          left: '2%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          show: false,
        },
        yAxis: {
          type: 'category',
          inverse: true,
          data: this.barXData,
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
        },
        series: [
          {
            type: 'bar',
            barWidth: 10,
            itemStyle: {
              normal: {
                color: '#f9c446',
                borderRadius: 5,
                label: {
                  show: true,
                  color: 'gray',
                  position: 'right',
                },
              },
            },
            data: this.barYData,
          },
        ],
      }
      vipChart.setOption(this.optionVip, true)
    },
    changeTypeHandle(val) {
      console.log(val)
      this.getCustDist(val)
    },
  },
  mounted() {
    this.getCustDist() //获取客户地图数据
    // this.initVipEcharts() //加载重点客户柱状图
    // this.initMapEcharts() //加载重点客户地图
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
    .map-container {
      width: 75%;
      height: 500px;
    }
    .vip-container {
      width: 25%;
      height: 500px;
    }
  }
}
</style>