<template>
  <div class="account-search">
    <div class="search">
      <div>
        <div>
          <span>起始日期</span>
          <el-date-picker
            v-model="searchParams.startDate"
            type="date"
            placeholder="请选择起始日期"
            format="yyyy/MM/dd"
            value-format="yyyy/MM/dd"
            :editable="false"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </div>
        <div>
          <span>终止日期</span>
          <el-date-picker
            v-model="searchParams.endDate"
            type="date"
            placeholder="请选择终止日期"
            format="yyyy/MM/dd"
            value-format="yyyy/MM/dd"
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
        <el-button
          icon="el-icon-refresh-right"
          :loading="resetLoading"
          @click="reset"
          >重置</el-button
        >
      </div>
    </div>
    <div class="result">
      <div class="handle cus-button">
        <el-button @click="switchTab('0')">发放统计</el-button>
        <el-button @click="switchTab('1')">使用统计</el-button>
        <el-button @click="exportData" :loading="exportLoading">导出</el-button>
      </div>
      <el-table
        :data="datas"
        border
        style="width: 100%"
        :header-cell-style="{
          background: '#E8E8E8',
          'font-weight': '400',
          color: '#262626'
        }"
      >
        <el-table-column
          :label="`${label}途径`"
          prop="beanType"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="beanNum"
          :label="`${label}点豆数`"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="countNum"
          :label="`${label}笔数`"
          header-align="center"
          align="center">
        </el-table-column>
        <el-table-column
          prop="custNum"
          :label="`${label}人数`"
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
  components: { vPagination },
  data() {
    return {
      searchParams: {
        startDate: '',
        endDate: '',
        qryType: '0'
      },
      datas: [],
      page: {
        total: 0,
        current: 1,
        size: 10
      },
      label: '发放',
      searchLoading: false,
      resetLoading: false,
      exportLoading: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
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
      if (
        this.searchParams.endDate &&
        this.searchParams.startDate &&
        new Date(this.searchParams.endDate).getTime() <
          new Date(this.searchParams.startDate).getTime()
      ) {
        this.$message.warning('终止时间不得早于起始时间!')
        return
      }
      this.searchLoading = true
      this.getDatas(1)
    },
    // 获取数据
    getDatas(current = this.page.current) {
      this.page.current = current
      let params = Object.assign(this.searchParams, this.page)
      API.report
        .qryStartbeanGetL(params)
        .then(res => {
          this.datas = res.data.data.records
          this.page.total = res.data.data.total
          this.searchLoading = false
          this.resetLoading = false
        })
        .catch(() => {
          this.searchLoading = false
          this.resetLoading = false
        })
    },
    reset() {
      // 清空数据
      this.searchParams = {
        startDate: '',
        endDate: '',
        qryType: '0'
      }
      this.resetLoading = true
      this.getDatas(1)
    },
    switchTab(type) {
      this.searchParams.qryType = type
      this.label = type === '0' ? '发放' : '使用'
      this.getDatas(1)
    },
    exportData() {
      if (this.page.total > 10000) {
        this.$message.error('一次最多导出10000条，请重新筛选！')
        return
      }
      this.exportLoading = true
      API.report.exportStartbeanGetL(
        Object.assign(this.searchParams, {
          total: this.page.total,
          current: this.page.current,
          size: 10000
        })
      )
        .then(data => {
          this.exportLoading = false
          let blob = new Blob([data.data], {
            type:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          })
          // const blob = new Blob([data.data])
          if (!!window.ActiveXObject || 'ActiveXObject' in window) {
            window.navigator.msSaveOrOpenBlob(blob, '点豆发放明细.xlsx')
          } else {
            const a = document.createElement('a')
            a.style.display = 'none'
            a.download = '点豆发放明细.xlsx'
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

  created() {
    this.getDatas()
  }
}
</script>

<style lang="scss" scoped>
.account-search {
  .search {
    > div {
      display: flex;
      align-items: center;
      justify-content: space-around;
      margin-bottom: 25px;
      span {
        width: 80px;
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

  .handle {
    display: flex;
    margin-bottom: 16px;
  }
}
</style>
