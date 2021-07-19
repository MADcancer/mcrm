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
          label="日期"
          prop="datadate"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="grantnum"
          label="总发数量"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="usednum"
          label="总使用量"
          header-align="center"
          align="center">
        </el-table-column>
        <el-table-column
          prop="subsidenum"
          label="总沉淀量"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="expirenum"
          label="到期点豆总数"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="personnum"
          label="人工扣减总数"
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
        endDate: ''
      },
      datas: [],
      page: {
        total: 0,
        current: 1,
        size: 10
      },
      searchLoading: false,
      resetLoading: false,
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
        .qryStartbeanL(params)
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
        endDate: ''
      }
      this.resetLoading = true
      this.getDatas(1)
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
}
</style>
