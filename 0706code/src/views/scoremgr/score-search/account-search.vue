<template>
  <div :class="['account-search', loaded ? 'searchHeight' : '']">
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
          <span>客户等级</span>
          <el-select v-model="searchParams.custLevel" placeholder="">
            <el-option label="请选择" value=""></el-option>
            <el-option label="零星" value="0"></el-option>
            <el-option label="一星" value="1"></el-option>
            <el-option label="二星" value="2"></el-option>
            <el-option label="三星" value="3"></el-option>
            <el-option label="四星" value="4"></el-option>
            <el-option label="五星" value="5"></el-option>
            <el-option label="六星" value="6"></el-option>
          </el-select>
        </div>
        <div>
          <span>积分渠道</span>
          <el-select v-model="searchParams.scoreChannel" placeholder="请选择">
            <el-option v-for="(item,index) in $root.selectOption.channel" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <div class="block">
          <span class="demonstration">查询年月</span>
          <el-date-picker
            v-model="searchParams.yearMonth"
            type="month"
            placeholder="请输入查询年月"
            format="yyyy/MM"
            value-format="yyyy/MM"
            :editable="false"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
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
        <el-button icon="el-icon-refresh-right" :loading="resetLoading" @click="reset">重置</el-button>
      </div>
    </div>
    <div class="result">
      <div class="cus-button" style="margin-bottom: 14px">
        <el-button v-if="isAuth('sys:score:export')" icon="el-icon-export" :disabled="searchParams.scoreChannel !== $store.state.user.channel" @click="exportData" :loading="exportLoading">导出</el-button>
      </div>
      <el-table
        :data="datas"
        border
        ref="table"

        :header-cell-style="{
          background: '#E8E8E8',
          'font-weight': '400',
          color: '#262626'
        }"
      >
        <el-table-column
          label="年月"
          prop="yearMonth"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="custNo"
          label="客户号"
          width="120"
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
          label="客户等级"
          width="120"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            {{ custLevel[scope.row.custLevel] }}
          </template>
        </el-table-column>
        <el-table-column label="积分渠道" header-align="center" align="center">
          <template slot-scope="scope">
            {{ $root.selectOption.channelObj[scope.row.scoreChannel] }}
          </template>
        </el-table-column>
        <el-table-column
          prop="lastMonPoints"
          label="上月底积分"
          width="120"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="lastMonAddPoints"
          label="上月调增积分"
          width="120"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="lastMonSubstractPoints"
          label="上月调减积分"
          width="120"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="monthPoiontsBalance"
          label="本月积分余额"
          width="120"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="monthNormalAddPoints"
          label="本月日常新增积分"
          width="140"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="monthAccuAddPoints"
          label="本月累计调增积分"
          width="140"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="monthAccuSubstractPoints"
          label="本月累计调减积分"
          width="140"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="monthExchangePoints"
          label="本月兑换积分"
          width="120"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="frozenPoints"
          label="冻结积分"
          width="120"
          header-align="center"
          align="center"
        >
        </el-table-column>
      </el-table>
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
export default {
  props: {
    name: {
      type: String
    }
  },
  components: { vPagination },
  watch: {
    name(value) {
      if (value === 'account') {
        this.getDatas(1)
      }
    }
  },
  data() {
    return {
      searchParams: {
        custNo: '',
        certType: '',
        custLevel: '',
        custName: '',
        certNo: '',
        scoreChannel: '',
        yearMonth: ''
      },
      datas: [],
      page: {
        total: 0,
        current: 1,
        size: 10
      },
      searchLoading: false,
      resetLoading: false,
      exportLoading: false,
      loaded: false,
      custLevel: [
        '零星',
        '一星',
        '二星',
        '三星',
        '四星',
        '五星',
        '六星'
      ],
      scoreChannel: ['', '财富', '直销', '信用卡'],
      // 不支持查询当月，前25个月
      pickerOptions: {
        disabledDate(time) {
          let date = new Date()
          let date1 = new Date()
          // 本月之前的25个月 month（0-11）
          date.setMonth(date.getMonth() - 25)
          return time.getTime() < date.getTime() ||
            (time.getFullYear() === date1.getFullYear() && time.getMonth() >= date1.getMonth()) ||
            time.getFullYear() > date1.getFullYear()
        }
      }
    }
  },

  methods: {
    // 分页
    pageChange(val) {
      this.page.current = val.page
      this.page.size = val.limit
      this.getDatas()
    },
    // 搜索
    search() {
      this.searchLoading = true
      this.getDatas(1)
    },
    // 获取数据
    getDatas(current = this.page.current) {
      this.page.current = current
      let params = Object.assign(this.searchParams, this.page)
      API.scoresearch.getCustAccuPointsVerify(
        Object.assign(params, {
          custNo: params.custNo.trim(),
          custName: params.custName.trim(),
          certNo: params.certNo.trim()
        })
      ).then(res => {
        this.datas = res.data.data.records
        this.page.total = res.data.data.total
        this.searchLoading = false
        this.resetLoading = false
      }).catch(() => {
        this.searchLoading = false
        this.resetLoading = false
      })
    },
    reset() {
      // 清空数据
      this.searchParams = {
        custNo: '',
        certType: '',
        custLevel: '',
        custName: '',
        certNo: '',
        scoreChannel: '',
        yearMonth: ''
      }
      this.resetLoading = true
      this.getDatas(1)
    },
    exportData() {
      if (this.page.total > 10000) {
        this.$message.error('一次最多导出10000条，请重新筛选！')
        return
      }
      this.exportLoading = true
      // let params = Object.assign(this.page, this.searchParams)
      API.scoresearch.exportCustAccuPointsVerify(
        Object.assign(this.searchParams, {
          custNo: this.searchParams.custNo.trim(),
          custName: this.searchParams.custName.trim(),
          certNo: this.searchParams.certNo.trim(),
          total: this.page.total,
          current: this.page.current,
          size: 10000
        })
      )
        .then(data => {
          this.exportLoading = false
          // const blob = new Blob([data.data])
          let blob = new Blob([data.data], {
            type:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          })
          if (!!window.ActiveXObject || 'ActiveXObject' in window) {
            window.navigator.msSaveOrOpenBlob(blob, '客户对账单.xls')
          } else {
            const a = document.createElement('a')
            a.style.display = 'none'
            a.download = '客户对账单.xls'
            a.href = window.URL.createObjectURL(blob)
            a.click()
          }
        })
        .catch(() => {
          this.exportLoading = false
          this.$message.error('暂无数据')
        })
    }
  },
  mounted() {
    // 获取需要绑定的table
    this.dom = this.$refs.table.bodyWrapper
    this.dom.addEventListener('scroll', () => {
      console.log(this.dom.scrollLeft)
      if (this.dom.scrollLeft > 0 && this.dom.scrollLeft < 100 && !this.loaded) {
        this.loaded = true
      }

      if (this.dom.scrollLeft > 300 && this.loaded) {
        console.log(this.loaded)
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
.searchHeight {
  /deep/ table {
    display: block;
  }
}
.account-search {
  .search {
    > div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 25px;
      span {
        width: 60px;
        display: inline-block;
        margin-right: 10px;
      }
    }
    /deep/ .el-input {
      width: 234px;
    }
    /deep/ .el-input--medium .el-input__inner {
      height: 34px;
    }
    .button {
      margin-top: 31px;
      margin-bottom: 24px;
      justify-content: center;
    }
  }
}
</style>
