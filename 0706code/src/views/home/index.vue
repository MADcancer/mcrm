<template>
  <div class="home">
    <el-button id="modelSelecter" @click="modelSelectHandle()"
      >页面设置</el-button
    >
    <!-- <el-card class="box-card">
      <div slot="header" class="clearfix" style="position: relative">
        <span class="cardTitle">智能搜索</span>
      </div>
      <div style="display: inline-block">
        <el-select
          v-model="listValue"
          filterable
          remote
          reserve-keyword
          placeholder="请输入关键词"
          :remote-method="remoteMethod"
          :loading="loading"
          @change="searchChangeHandle($event)"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div style="display: inline-block; margin-left: 5px">
        <el-radio-group
          v-model="originRadio"
          @change="radioChange($event)"
          :disabled="radioDisabled"
        >
          <el-radio label="1">客户</el-radio>
          <el-radio label="2">产品</el-radio>
        </el-radio-group>
      </div>
    </el-card> -->
    <div v-for="item in modelData" :key="item">
      <data-statistics v-if="item === 'dataStatistics'"></data-statistics>
      <map-distribution v-if="item === 'distribution'"></map-distribution>
      <bank-assets v-if="item === 'bankAssets'"></bank-assets>
      <credit-info v-if="item === 'creditInfo'"></credit-info>
      <guest-top v-if="item === 'guestTop'"></guest-top>
      <revenue-report v-if="item === 'revenueReport'"></revenue-report>
      <used-credit v-if="item === 'usedCredit'"></used-credit>
    </div>
    <model-selecter
      ref="modelSelect"
      @modelDataList="getModelList"
    ></model-selecter>
  </div>
</template>
<script>
import API from '@/api'
import dataStatistics from './data-statistics'
import mapDistribution from './map-distribution'
import bankAssets from './bank-assets'
import creditInfo from './credit-info'
import guestTop from './guest-top'
import revenueReport from './revenue-report'
import usedCredit from './used-credit'
import modelSelecter from './model-selecter'
export default {
  // watch: {
  //   $route: {
  //     handler() {
  //       if (this.$route.name === 'home') {
  //         this.getDatas()
  //       }
  //     },
  //     deep: true,
  //   },
  // },
  data() {
    return {
      options: [],
      listValue: [],
      list: [],
      loading: false,
      disabled: false,
      states: [
        'Alabama',
        'Alaska',
        'Arizona',
        'Arkansas',
        'California',
        'Colorado',
        'Connecticut',
        'Delaware',
        'Florida',
        'Georgia',
        'Hawaii',
        'Idaho',
        'Illinois',
        'Indiana',
        'Iowa',
        'Kansas',
        'Kentucky',
        'Louisiana',
        'Maine',
        'Maryland',
        'Massachusetts',
        'Michigan',
        'Minnesota',
        'Mississippi',
        'Missouri',
        'Montana',
        'Nebraska',
        'Nevada',
        'New Hampshire',
        'New Jersey',
        'New Mexico',
        'New York',
        'North Carolina',
        'North Dakota',
        'Ohio',
        'Oklahoma',
        'Oregon',
        'Pennsylvania',
        'Rhode Island',
        'South Carolina',
        'South Dakota',
        'Tennessee',
        'Texas',
        'Utah',
        'Vermont',
        'Virginia',
        'Washington',
        'West Virginia',
        'Wisconsin',
        'Wyoming',
      ],
      modelData: [
        'dataStatistics',
        'distribution',
        'bankAssets',
        'creditInfo',
        'guestTop',
        'revenueReport',
        'usedCredit',
      ],
      originRadio: '1',
    }
  },
  computed: {
    // 是否是管理员
    isAdmin() {
      return this.$store.state.user.roleId.toString().indexOf('03') !== -1
    },
    radioDisabled() {
      return this.disabled
    },
  },
  components: {
    dataStatistics,
    mapDistribution,
    bankAssets,
    creditInfo,
    guestTop,
    revenueReport,
    usedCredit,
    modelSelecter,
  },
  methods: {
    remoteMethod(query) {
      //智能搜索
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.options = this.list.filter((item) => {
            return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1
          })
        }, 200)
      } else {
        this.options = []
      }
    },
    radioChange(event) {
      console.log(event)
      this.options = []
      this.listValue = ''
      this.disabled = true
      if (event === '1') {
        this.getAllCustList()
      } else {
        this.getAllProdList()
      }
    },
    searchChangeHandle(val) {
      console.log(val)
    },
    getModelList() {
      // 获取页面模块
      this.modelData = []
      this.modelData = this.$refs.modelSelect.selectedList
    },
    getAllCustList() {
      API.cockpit.getAllCustList().then(({ data }) => {
        if (data && data.code === 0) {
          this.custName = []
          for (const item of data.data) {
            this.custName.push(item.custName)
          }
          this.list = this.custName.map((item) => {
            return { value: item, label: item }
          })
        }
        this.disabled = false
      })
    },
    getAllProdList() {
      API.cockpit.getAllProdList().then(({ data }) => {
        if (data && data.code === 0) {
          this.prodName = []
          for (const item of data.data) {
            this.prodName.push(item.prodName)
          }
          this.list = this.prodName.map((item) => {
            return { value: item, label: item }
          })
        }
        this.disabled = false
      })
    },
    modelSelectHandle() {
      this.$nextTick(() => {
        this.$refs.modelSelect.visible = true
      })
    },
  },
  mounted() {
    this.getModelList()
    this.getAllCustList()
    // this.list = this.states.map((item) => {
    //   return { value: item, label: item }
    // })
  },
  created() {},
}
</script>

<style lang="scss" scoped>
.home {
  #modelSelecter {
    position: fixed;
    right: 0;
    top: 108px;
    z-index: 999;
    width: 120px;
    border: 0;
    border-radius: 18px 0 0 18px;
    color: #fff;
    background-color: #78b258;
  }
  .box-card {
    margin-top: 16px;
    .cardTitle {
      font-size: 18px;
      font-weight: bold;
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
