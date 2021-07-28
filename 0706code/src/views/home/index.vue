<template>
  <div class="home">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="cardTitle">数据统计</span>
        <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
      </div>
      <div>
        <el-select v-model="deptValue" clearable placeholder="选择部门">
          <el-option
            v-for="item in deptOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div class="moneyCardGroup">
        <div class="moneyCard" style="background: #78b258">
          <span>总资产(万元)</span>
          <span class="moneyNum">{{ 278232 | moneyFormat(0) }}</span>
        </div>
        <div class="moneyCard" style="background: #e78c57">
          <span>总负债(万元)</span>
          <span class="moneyNum">{{ 127774 | moneyFormat(0) }}</span>
        </div>
        <div class="moneyCard" style="background: #f9c446">
          <span>考核利润(万元)</span>
          <span class="moneyNum">{{ 73234 | moneyFormat(0) }}</span>
        </div>
        <div class="moneyCard" style="background: #7ec4ea">
          <span>授信总量(万元)</span>
          <span class="moneyNum">{{ 4748374 | moneyFormat(0) }}</span>
        </div>
        <div class="moneyCard" style="background: #78b258">
          <span>授信客户数</span>
          <span class="moneyNum">{{ 1340 | moneyFormat(0) }}</span>
        </div>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix" style="line-height: 40px">
        <span class="cardTitle">客户数量分布</span>
        <el-select
          v-model="richValue"
          clearable
          placeholder="全部"
          style="float: right"
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
        <div class="map-container" id="mapEcharts" ref="myEchart"></div>
        <div class="vip-container" id="vipEcharts"></div>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="cardTitle">全行资产分布图</span>
      </div>
      <div class="zEcharts">
        <div class="propContent" id="propEcharts"></div>
        <div class="propContent">
          <el-table
            :data="tableData"
            style="width: 90%; margin: auto"
            :row-style="{ height: '0px' }"
            :header-cell-style="{ color: '#000', background: 'lightgray' }"
          >
            <el-table-column prop="name" label="资产名称"> </el-table-column>
            <el-table-column prop="precent" label="占比"> </el-table-column>
            <el-table-column prop="money" label="金额（万元）">
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="cardTitle">授信信息</span>
      </div>
      <div class="zEcharts">
        <div class="creditContent" id="creditBarEcharts"></div>
        <div class="creditContent" id="creditLineEcharts"></div>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="cardTitle">客户TOP10</span>
      </div>
      <div class="zEcharts">
        <div class="guestContent" id="guestEcharts"></div>
      </div>
    </el-card>
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
          @change="changeStatus($event)"
        >
        </el-switch>
      </div>
      <div class="zEcharts">
        <div class="revenueContent" id="revenueEcharts"></div>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="cardTitle">授信使用</span>
        <el-link
          href="https://www.baidu.com"
          style="float: right; padding: 3px 0; cursor: pointer"
          >查看更多>></el-link
        >
      </div>
      <div id="switchChartButton">
        <el-radio-group v-model="originRadio" @change="radioChange">
          <el-radio-button label="1">授信使用率</el-radio-button>
          <el-radio-button label="2">授信使用量</el-radio-button>
        </el-radio-group>
      </div>
      <div class="zEcharts">
        <div class="usedCreditContent" id="usedCreditEcharts"></div>
      </div>
    </el-card>
  </div>
</template>
<script>
import API from '@/api'
import * as echarts from 'echarts'
import filters from '@/filters'
import china from '@/assets/json/china.json'
export default {
  name: 'zEcharts',
  computed: {
    // 是否是管理员
    isAdmin() {
      return this.$store.state.user.roleId.toString().indexOf('03') !== -1
    },
  },
  watch: {
    $route: {
      handler() {
        if (this.$route.name === 'home') {
          this.getDatas()
        }
      },
      deep: true,
    },
  },
  data() {
    return {
      originRadio: '1',
      value2: false,
      totalVal: 1123345,
      myEchart: '',
      optionChinaMap: {}, //地图数据,等待接口数据
      xdata: ['第一季度', '第二季度', '第三季度', '第四季度'],
      deptOptions: [
        {
          value: '1',
          label: '部门1',
        },
        {
          value: '2',
          label: '部门2',
        },
        {
          value: '3',
          label: '部门3',
        },
        {
          value: '4',
          label: '部门4',
        },
        {
          value: '5',
          label: '部门5',
        },
      ],
      deptValue: '',
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
      type: 0,
      works: [],
      activityBord: [],
      custInfos: [],
      currentInfo: {},
      tableData: [
        {
          name: '基金产品',
          precent: '30%',
          money: filters.moneyFormat(275912),
        },
        {
          name: '同业折借',
          precent: '20%',
          money: filters.moneyFormat(215703),
        },
        {
          name: '2016-05-01',
          precent: '王小虎',
          money: '上海市',
        },
        {
          name: '2016-05-03',
          precent: '王小虎',
          money: '上海市',
        },
        {
          name: '2016-05-03',
          precent: '王小虎',
          money: '上海市',
        },
        {
          name: '2016-05-03',
          precent: '王小虎',
          money: '上海市',
        },
      ],
    }
  },
  methods: {
    getDatas() {
      let params = {
        empNo: this.$store.state.user.id,
        roleId: this.$store.state.user.roleId,
        channel: this.$store.state.user.channel,
      }
      // 查询待办事项
      API.home.qryWorkNum(params, this).then((res) => {
        this.works = res.data.data
        // 管理员  03结尾
        if (this.isAdmin) {
          this.works.shift()
        }
      })
      // 查询活动看板信息
      API.home.qryActivityBoard(params).then((res) => {
        this.activityBord = res.data.data
      })
      // 客户参与活动情况列表
      API.home.qryActivityCustInfo(params).then((res) => {
        this.custInfos = res.data.data
        this.currentInfo = res.data.data[0]
      })
    },
    radioChange(val) {
      console.log(val)
    },
    // 地图数据
    randomData: function () {
      return Math.round(Math.random() * 1000)
    },
    initVipEcharts: function () {
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
          data: [
            '北京',
            '上海',
            '广州',
            '深圳',
            '浙江',
            '江苏',
            '山东',
            '安徽',
            '广东',
            '福建',
          ],
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
            data: [31744, 29034, 23489, 18203, 4970, 1010, 999, 888, 777, 666],
          },
        ],
      }
      vipChart.setOption(this.optionVip, true)
    },
    initMapEcharts: function () {
      // echarts画图实例
      let chinaMapChart = null
      // 画图区域
      chinaMapChart = echarts.init(document.getElementById('mapEcharts'))
      this.optionChinaMap = {
        tooltip: {
          trigger: 'item',
          formatter: function (param) {
            return param.name + param.value || ''
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
            data: [
              { name: '上海', value: this.randomData() },
              { name: '北京', value: '100' },
              { name: '天津', value: this.randomData() },
              { name: '重庆', value: this.randomData() },
              { name: '河北', value: this.randomData() },
              { name: '河南', value: this.randomData() },
              { name: '云南', value: this.randomData() },
              { name: '辽宁', value: this.randomData() },
              { name: '黑龙江', value: this.randomData() },
              { name: '湖南', value: this.randomData() },
              { name: '安徽', value: this.randomData() },
              { name: '山东', value: this.randomData() },
              { name: '新疆', value: this.randomData() },
              { name: '江苏', value: this.randomData() },
              { name: '浙江', value: this.randomData() },
              { name: '江西', value: this.randomData() },
              { name: '湖北', value: this.randomData() },
              { name: '广西', value: this.randomData() },
              { name: '甘肃', value: this.randomData() },
              { name: '山西', value: this.randomData() },
              { name: '内蒙古', value: this.randomData() },
              { name: '陕西', value: this.randomData() },
              { name: '吉林', value: this.randomData() },
              { name: '福建', value: this.randomData() },
              { name: '贵州', value: this.randomData() },
              { name: '广东', value: this.randomData() },
              { name: '青海', value: this.randomData() },
              { name: '西藏', value: this.randomData() },
              { name: '四川', value: this.randomData() },
              { name: '宁夏', value: this.randomData() },
              { name: '海南', value: this.randomData() },
              { name: '台湾', value: this.randomData() },
              { name: '香港', value: this.randomData() },
              { name: '澳门', value: this.randomData() },
            ],
          },
        ],
      }
      echarts.registerMap('china', china)
      chinaMapChart.setOption(this.optionChinaMap, true)
      chinaMapChart.on('click', function (params) {
        console.log(params.name) //此处写点击事件内容
      })
    },
    initPropEcharts: function () {
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
          right: 40,
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
                fontSize: 14, //文字的字体大小
              },
              formatter: function (param) {
                return param.value + '%'
              },
            },
            data: [
              { value: 30, name: '基金产品' },
              { value: 20, name: '同业折借' },
              { value: 10, name: '同业存放' },
              { value: 20, name: '同业借款' },
              { value: 20, name: '其他' },
            ],
          },
        ],
      }
      propChart.setOption(this.optionProp, true)
    },
    initCreditBarEcharts: function () {
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
          data: ['全部', '银行', '券商', '保险', '毛病', '其他'],
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
            data: [31744, 29034, 23489, 18203, 490, 10000],
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
            data: [35000, 32000, 29000, 26000, 500, 12000],
          },
        ],
      }
      creditBarChart.setOption(this.optionCreditBar, true)
    },
    initCreditLineEcharts: function () {
      let creditLineChart = null
      creditLineChart = echarts.init(
        document.getElementById('creditLineEcharts')
      )
      this.optionCreditLine = {
        title: {
          text: '全部创利&收益趋势图（半年）',
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
          // bottom: '3%',
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
    initGuestEcharts: function () {
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
          data: ['资产余额', '交易量'],
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
          data: [
            '无锡康雅',
            '无锡康雅',
            '无锡康雅',
            '无锡康雅',
            '无锡康雅有限公司',
            '无锡康雅司',
            '无锡康雅有限公司',
            '无锡康雅',
            '无锡康雅有公司',
            '无锡康雅有限公司',
          ],
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            name: '资产余额',
            type: 'bar',
            barWidth: 10,
            itemStyle: {
              borderRadius: [5, 5, 0, 0],
            },
            data: [1807, 1411, 1215, 1000, 800, 600, 400, 200, 200, 150],
          },
          {
            name: '交易量',
            type: 'bar',
            barWidth: 10,
            itemStyle: {
              borderRadius: [5, 5, 0, 0],
            },
            data: [1700, 1317, 1049, 904, 489, 230, 180, 104, 90, 89],
          },
        ],
      }
      guestChart.setOption(this.optionGuest, true)
    },
    initRevenueEcharts: function () {
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
          data: ['营收指标', '营收完成', '利润指标', '利润完成'],
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
          {
            type: 'category',
            show: false,
            data: this.xdata,
          },
        ],
        yAxis: {
          type: 'value',
        },
        series: [
          {
            name: '营收指标',
            type: 'bar',
            barWidth: 10,
            xAxisIndex: 1,
            itemStyle: {
              color: '#e6efdd',
              borderRadius: [5, 5, 0, 0],
            },
            data: [1907, 1511, 1315, 1100],
          },
          {
            name: '利润指标',
            type: 'bar',
            barGap: '100%',
            barWidth: 10,
            xAxisIndex: 1,
            itemStyle: {
              color: '#fef3d9',
              borderRadius: [5, 5, 0, 0],
            },
            data: [1800, 1417, 1149, 1004],
          },
          {
            name: '营收完成',
            type: 'bar',
            zlevel: 1,
            barWidth: 10,
            itemStyle: {
              color: '#85b05b',
              borderRadius: [5, 5, 0, 0],
            },
            data: [1807, 1411, 1215, 1000],
          },
          {
            name: '利润完成',
            type: 'bar',
            zlevel: 1,
            barGap: '100%',
            barWidth: 10,
            itemStyle: {
              color: '#f9c446',
              borderRadius: [5, 5, 0, 0],
            },
            data: [1700, 1317, 1049, 904],
          },
        ],
      }
      revenueChart.setOption(this.optionRevenue, true)
    },
    initUsedEcharts: function () {
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
          data: [
            '无锡康雅事业有限公司',
            '无锡康雅事业有限公司',
            '无锡康雅事业有限公司',
            '无锡康雅事业有限公司',
            '无锡康雅事业有限公司',
          ],
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
                  formatter: function (param) {
                    return (param.value / 500).toFixed(1) + '%'
                  },
                },
              },
            },
            data: [31744, 29034, 23489, 18203, 10000],
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
              },
            },
            data: [35000, 32000, 29000, 26000, 12000],
          },
        ],
      }
      usedCreditChart.setOption(this.optionUsedCredit, true)
    },
    tableHeaderCellStyle({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'color:#000;background:lightgray'
      }
    },
    changeStatus: function ($event) {
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
        ]
      } else {
        this.xdata = ['第一季度', '第二季度', '第三季度', '第四季度']
      }
      this.initRevenueEcharts()
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.initMapEcharts() //加载重点客户地图
      this.initVipEcharts() //加载重点客户柱状图
      this.initPropEcharts() //加载全行资产分布图
      this.initCreditBarEcharts() //加载授权信息柱状图
      this.initCreditLineEcharts() //加载收益趋势图
      this.initGuestEcharts() //客户TOP10
      this.initRevenueEcharts() //营收报表
      this.initUsedEcharts() //授信使用
    })
  },
  created() {
    this.getDatas()
  },
}
</script>

<style lang="scss" scoped>
.home {
  .title {
    display: flex;
    align-items: center;
    padding-bottom: 8px;
    img {
      width: 26px;
      height: 26px;
      margin-right: 6px;
    }
    span {
      color: #111111;
      font-size: 18px;
    }
    border-bottom: 1px solid #d9d9d9;
  }
  .box-card {
    margin-bottom: 16px;
    .cardTitle {
      font-size: 18px;
      font-weight: bold;
    }
    #switchChartButton {
      width: 250px;
      height: 40px;
      line-height: 40px;
      margin: auto;
    }
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
    .propContent {
      width: 50%;
      height: 350px;
    }
    #creditBarEcharts {
      width: 40%;
      height: 400px;
    }
    #creditLineEcharts {
      width: 60%;
      height: 400px;
    }
    .guestContent,
    .revenueContent {
      width: 100%;
      height: 350px;
    }
    .usedCreditContent {
      width: 100%;
      height: 400px;
    }
  }
  .moneyCardGroup {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 85px;
    margin-top: 16px;
  }
  .moneyCard {
    display: flex;
    flex-flow: column;
    width: 19%;
    height: 85px;
    border-radius: 5px;
    padding: 16px 0 0 16px;
    color: #fff;
    .moneyNum {
      font-size: 30px;
      margin-top: 5px;
    }
  }
  .todo-list {
    .content {
      display: flex;
      justify-content: space-between;
      padding-top: 23px;
      padding-bottom: 30px;
    }
    /deep/ .el-card {
      width: 30%;
      // height: 300px;
      border: 1px solid #80a639;
    }
    .box-card {
      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .jump {
          &:hover {
            cursor: pointer;
          }
        }
        div {
          color: #ffffff;
          font-size: 16px;
        }
        > div:nth-child(2) {
          font-size: 14px;
          span {
            font-size: 20px;
          }
        }
      }
      /deep/ .el-card__header {
        padding: 13px 15px;
        background-color: #80a639;
      }
      /deep/ .el-card__body {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        padding: 20px 30px;
        .item {
          width: 50%;
          display: flex;
          align-items: center;
          margin-bottom: 25px;
          > div:nth-child(2) {
            &:hover {
              cursor: pointer;
              color: #5c8a06;
              text-decoration: underline;
            }
          }
          .icon {
            width: 4px;
            height: 4px;
            border-radius: 50%;
            background-color: #5c8a06;
            margin-right: 5px;
          }
          .count {
            // width: 18px;
            // height: 18px;
            // background: #da8b04;
            // color: #ffffff;
            // display: flex;
            // align-items: center;
            // justify-content: center;
            // border-radius: 50%;
            // margin-left: 2px;
            color: #da8b04;
            margin-left: 6px;
            font-weight: bold;
          }
        }
        .item:nth-child(2n) {
          justify-content: flex-end;
        }
      }
    }
  }
  .activity-list {
    margin-bottom: 58px;
    /deep/ .el-card {
      width: 24%;
      height: 208px;
    }
    /deep/ .el-card__header {
      padding: 16px 0 0;
      margin: 0 22px;
      border-bottom: 1px solid #5c8a06;
    }
    .content {
      margin-top: 24px;
      display: flex;
      justify-content: space-between;
    }
    .header {
      div {
        width: 80px;
        padding: 4px;
        border-bottom: 3px solid #5c8a06;
      }
    }
    .item {
      display: flex;
      justify-content: space-between;
      .daily-count {
        div:nth-child(1) {
          color: #80a639;
          font-size: 88px;
          text-align: center;
        }
      }
      .line {
        height: 65px;
        border-left: 1px dashed #80a639;
        margin-top: 20px;
      }
      .total-count {
        div:nth-child(1) {
          font-size: 36px;
          color: #262626;
          padding-top: 60px;
        }
      }
    }
  }
  .cust-list {
    .empty-content {
      margin: 24px 0;
      width: 100%;
      height: 100px;
      background: #f5f8f0;
      border: 1px solid #e9e9e9;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
    }
    .content {
      margin: 24px 0;
      display: flex;
    }
    .left-content {
      img {
        width: 15px;
        height: 15px;
      }
      color: #ffffff;
      font-size: 16px;
      background: #ffffff;
      width: 30%;
      &:hover {
        cursor: pointer;
      }
      div {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 55px;
        width: 100%;
        padding: 0 45px 0 38px;
        background: #80a639;
        margin-bottom: 2px;
      }
      .selected {
        background: #f5f8f0;
        color: #80a639;
        margin-bottom: 0;
        border: 1px solid #e9e9e9;
      }
    }
    .right-content {
      display: flex;
      flex-wrap: wrap;
      width: 70%;
      img:nth-child(1) {
        width: 40px;
        height: 43px;
      }
      img:nth-child(2) {
        width: 50px;
        height: 51px;
      }
      img:nth-child(3) {
        width: 39px;
        height: 44px;
      }
      img:nth-child(4) {
        width: 50px;
        height: 44px;
      }
      img:nth-child(4) {
        width: 43px;
        height: 48px;
      }
      img {
        margin-right: 13px;
      }
      > div {
        display: flex;
        width: 33%;
        height: 168px;
        align-items: center;
        justify-content: center;
        background: #f5f8f0;
        border-left: 1px solid #e9e9e9;
        border-top: 1px solid #e9e9e9;
      }
    }
  }
  .admin {
    /deep/ .el-card {
      width: 46%;
    }
    /deep/ .el-card__body {
      padding: 20px 70px 0 !important;
    }
  }
}
</style>
