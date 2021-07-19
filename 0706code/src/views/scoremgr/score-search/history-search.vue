<template>
  <div :class="['history-search', loaded ? 'contentHeight' : '']">
    <div class="search">
      <div>
        <div>
          <span>客户号</span>
          <el-input
            v-model="searchParams.custNo"
            placeholder="请输入客户号"
            clearable
          />
        </div>
        <div>
          <span>客户姓名</span>
          <el-input
            v-model="searchParams.custName"
            placeholder="请输入客户姓名"
            clearable
          />
        </div>
        <div>
          <span>证件号码</span>
          <el-input
            v-model="searchParams.certNo"
            placeholder="请输入证件号码"
            clearable
          />
        </div>
      </div>
      <div>
        <div>
          <span>兑换时间</span>
          <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy/MM/dd"
            value-format="yyyy/MM/dd"
            :pickerOptions="pickerOptions"
            :editable="false"
          >
          </el-date-picker>
        </div>
        <div>
          <span>积分渠道</span>
          <el-select v-model="searchParams.scoreChannel" placeholder="">
            <el-option v-for="(item,index) in $root.selectOption.channel" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <div class="section">
          <span>兑换积分</span>
          <el-input
            v-model="searchParams.exchangePointsMin"
            placeholder="请输入下限"
            clearable
          />
          <i style="padding: 0 9px">-</i>
          <el-input
            v-model="searchParams.exchangePointsMax"
            placeholder="请输入上限"
            clearable
          />
          <div class="msg">{{ msg }}</div>
        </div>
      </div>
      <div>
        <div>
          <span>兑换渠道</span>
          <el-select v-model="searchParams.exchangeChannel" placeholder="">
            <el-option label="请选择" value=""></el-option>
            <el-option label="权益平台兑换" value="1"></el-option>
          </el-select>
        </div>
        <div>
          <span>活动名称</span>
          <el-input
            v-model="searchParams.actName"
            placeholder="请输入活动名称"
            clearable
          />
        </div>
        <div>
          <span>兑换商品名称</span>
          <el-input
            v-model="searchParams.exchangeProductName"
            placeholder="请输入兑换商品名称"
            clearable
          />
        </div>
      </div>
      <div>
        <div>
          <span>供应商名称</span>
          <el-input
            v-model="searchParams.supplierName"
            placeholder="请输入供应商名称"
            maxlength="20"
            clearable
          />
        </div>
      </div>
      <div class="button">
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="search"
          :loading="searchLoading"
          >查询</el-button
        >
        <el-button
          icon="el-icon-refresh-right"
          :loading="resetLoading"
          @click="reset"
          >重置</el-button
        >
      </div>
    </div>
    <div class="result">
      <div class="cus-button" style="margin-bottom: 14px">
        <el-button
          v-if="isAuth('sys:score:export')"
          icon="el-icon-export"
          :disabled="searchParams.scoreChannel !== $store.state.user.channel"
          @click="exportData"
          :loading="exportLoading"
          >导出</el-button
        >
      </div>
      <el-table
        :data="datas"
        border
        ref="table"
        style="width: 100%"
        :header-cell-style="{
          background: '#E8E8E8',
          'font-weight': '400',
          color: '#262626'
        }"
      >
        <el-table-column
          label="订单号"
          width="120"
          header-align="center"
          align="center"
        >
         <template slot-scope="scope">
           <div @click="getInfo(scope.row.orderId)" class="table-botton">
             {{ scope.row.orderId }}
           </div>
          </template>
        </el-table-column>
        <el-table-column
          label="客户号"
          prop="custNo"
          width="140"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="custName"
          label="客户姓名"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="certNo"
          label="证件号码"
          width="180"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          label="积分渠道"
          width="120"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            {{ $root.selectOption.channelObj[scope.row.scoreChannel] }}
          </template>
        </el-table-column>
        <el-table-column
          prop="availablePoints"
          label="客户可用积分"
          width="120"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="exchangeChannel"
          label="兑换渠道"
          width="120"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.exchangeChannel === '1' ? '权益平台兑换' : '' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="exchangeDate"
          label="兑换时间"
          width="160"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="exchangeProductId"
          label="兑换商品编号"
          width="120"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="exchangeProductName"
          label="兑换商品名称"
          width="120"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="exchangeCount"
          label="兑换数量"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="actName"
          label="活动名称"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          label="活动类型"
          header-align="center"
          align="center"
        >
          <template slot-scope="{ row }">
            <span>{{ row.actType | typeFilter }}</span>
          </template> 
        </el-table-column>
        <el-table-column
          prop="actBoard"
          label="活动版块"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="supplierNo"
          label="供应商号"
          width="180"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="supplierName"
          width="120"
          label="供应商名称"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="exchangePoints"
          label="兑换积分"
          header-align="center"
          align="center"
        >
        </el-table-column>
      </el-table>
      <v-info :dialogInfoVisible='dialogInfoVisible' :id='orderId' @cancel='dialogInfoVisible=false'></v-info>
      <v-pagination
        :total="page.total"
        :currentPageNum="page.current"
        :currentPageSize="page.size"
        @pageChange="pageChange"
      ></v-pagination>
    </div>
  </div>
</template>

<script>
import vPagination from '@/components/pagination/pagination'
import API from '@/api'
import vInfo from './info'
const typeOptions = [
  {
    key: '1',
    name: '权益活动'
  },
  {
    key: '2',
    name: '抽奖活动'
  },
  {
    key: '3',
    name: '主题活动'
  }
]
const typeKeyValue = typeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.name
  return acc
}, {})
export default {
  props: {
    name: {
      type: String
    }
  },
  filters: {
    typeFilter(num) {
      return typeKeyValue[num]
    }
  },
  components: { vPagination, vInfo },
  watch: {
    name(value) {
      if (value === 'history') {
        this.getDatas(1)
      }
    },
    'searchParams.exchangePointsMin': {
      handler: function(value) {
        this.checkPoint(value, this.searchParams.exchangePointsMax)
      }
    },

    'searchParams.exchangePointsMax': {
      handler: function(value) {
        this.checkPoint(this.searchParams.exchangePointsMin, value)
      }
    }
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          let date = new Date()
          date.setMonth(date.getMonth() - 13)
          // return time.getFullYear() < date.getFullYear() ||
          // (time.getFullYear() === date.getFullYear() && time.getMonth() < date.getMonth())
          date.setDate(date.getDate() - 1)
          return time.getTime() < date.getTime() || time.getTime() > new Date()
        }
      },
      searchParams: {
        custNo: '',
        custName: '',
        certNo: '',
        scoreChannel: '',
        exchangeProductName: '',
        supplierName: '',
        actName: '',
        exchangeDateMax: '',
        exchangeDateMin: '',
        exchangeChannel: '',
        exchangePointsMin: '',
        exchangePointsMax: ''
      },
      date: [],
      datas: [],
      page: {
        total: 0,
        current: 1,
        size: 10
      },
      searchLoading: false,
      resetLoading: false,
      exportLoading: false,
      msg: '',
      scoreChannel: ['', '财富', '直销', '信用卡'],
      loaded: false,
      orderId: '',
      dialogInfoVisible: false
      // count: 0
    }
  },

  methods: {
    // 分页
    pageChange(val) {
      this.page.current = val.page
      this.page.size = val.limit
      this.getDatas()
    },
    getInfo(id) {
      this.orderId = id
      this.dialogInfoVisible = true
    },
    setParams() {
      let params = Object.assign(this.searchParams, this.page)
      return Object.assign(params, {
        custNo: params.custNo.trim(),
        custName: params.custName.trim(),
        certNo: params.certNo.trim(),
        exchangeProductName: params.exchangeProductName.trim(),
        supplierName: params.supplierName.trim(),
        actName: params.actName.trim(),
        exchangeDateMin: this.date && this.date.length > 0 ? this.date[0] : '',
        exchangeDateMax: this.date && this.date.length > 0 ? this.date[1] : ''
      })
    },
    setReportParams() {
      // let params = Object.assign(this.page, this.searchParams)
      return Object.assign(this.searchParams, {
        custNo: this.searchParams.custNo.trim(),
        custName: this.searchParams.custName.trim(),
        certNo: this.searchParams.certNo.trim(),
        exchangeDateMin: this.date && this.date.length > 0 ? this.date[0] : '',
        exchangeDateMax: this.date && this.date.length > 0 ? this.date[1] : '',
        total: this.page.total,
        current: this.page.current,
        size: 10000
      })
    },
    // 验证积分上下限
    checkPoint(min, max) {
      // 校验是否是正整数
      if (
        (min !== '' && !/^[1-9]{1,}[\d]*$/.test(min)) ||
        (max !== '' && !/^[1-9]{1,}[\d]*$/.test(max))
      ) {
        this.msg = '请输入正整数'
      } else if (min !== '' && max !== '' && Number(min) > Number(max)) {
        this.msg = '积分上限不得小于下限'
      } else {
        this.msg = ''
      }
    },
    // 搜索
    search() {
      this.searchLoading = true
      this.getDatas(1)
    },
    // 获取数据
    getDatas(current = this.page.current) {
      this.page.current = current
      let params = this.setParams()
      API.scoresearch
        .getCustPointsHis(params)
        .then(res => {
          this.datas = res.data.data.records
          this.page.total = res.data.data.total
          this.searchLoading = false
          this.resetLoading = false
          this.loaded = true
          setTimeout(() => {
            this.loaded = false
          }, 350)
        })
        .catch(() => {
          this.searchLoading = false
          this.resetLoading = false
        })
    },
    reset() {
      // 清空数据
      this.searchParams = {
        custNo: '',
        custName: '',
        certNo: '',
        scoreChannel: '',
        exchangeProductName: '',
        supplierName: '',
        actName: '',
        exchangeDateMax: '',
        exchangeDateMin: '',
        exchangeChannel: '',
        exchangePointsMin: '',
        exchangePointsMax: ''
      }
      this.date = []
      this.resetLoading = true
      this.getDatas(1)
    },
    exportData() {
      if (this.page.total > 10000) {
        this.$message.error('一次最多导出10000条，请重新筛选！')
        return
      }
      this.exportLoading = true
      let params = this.setReportParams()
      API.scoresearch
        .exportCustPointsHis(params)
        .then(data => {
          this.exportLoading = false
          let blob = new Blob([data.data], {
            type:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          })
          // const blob = new Blob([data.data])
          // ie浏览器
          if (!!window.ActiveXObject || 'ActiveXObject' in window) {
            window.navigator.msSaveOrOpenBlob(blob, '客户积分兑换历史.xls')
          } else {
            const a = document.createElement('a')
            a.style.display = 'none'
            a.download = '客户积分兑换历史.xls'
            a.href = window.URL.createObjectURL(blob)
            a.click()
          }
        })
        .catch(() => {
          this.exportLoading = false
          this.$message.error('暂无数据')
        })
    }
    // handleScroll() {
    //   if (this.count === 0 && this.name === 'history') {
    //     this.loaded = true
    //     console.log(this.loaded)
    //     this.loaded = false
    //     console.log(this.loaded)
    //     this.count ++
    //   }
    // }
  },

  mounted() {
    // 获取需要绑定的table
    this.dom = this.$refs.table.bodyWrapper
    this.dom.addEventListener('scroll', () => {
      if (this.dom.scrollLeft > 0 && this.dom.scrollLeft < 100 && !this.loaded) {
        this.loaded = true
      }

      if (this.dom.scrollLeft > 400 && this.loaded) {
        this.loaded = false
      }
    })
  },
  created() {
    this.getDatas()
  }
}
</script>

<style lang="scss" scoped>
.contentHeight {
  /deep/ table {
    display: block;
  }
}
.history-search {
  .search {
    > div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 25px;
      span {
        width: 90px;
        display: inline-block;
        margin-right: 10px;
      }
    }
    /deep/ .el-input {
      width: 240px;
      input {
        padding: 0 15px;
      }
    }
    /deep/ .el-range-editor.el-input__inner {
      width: 240px;
    }
    /deep/ .el-input--medium .el-input__inner {
      height: 34px;
    }
    /deep/ .el-range-editor--medium .el-range-separator {
      width: 20px;
    }
    /deep/ .el-date-editor .el-range-separator {
      width: 10%;
    }
    .section {
      /deep/ .el-input {
        width: 102px;
      }
      .msg {
        margin: 10px 0 0 70px;
        color: #f56c6c;
      }
    }
    .button {
      margin-top: 31px;
      margin-bottom: 24px;
      justify-content: center;
    }
  }
  .refresh {
    /deep/ table {
      display: block;
    }
  }
  .table-botton {
    cursor: pointer;
    color: #80A639;
    text-decoration: underline
  }
}
</style>
