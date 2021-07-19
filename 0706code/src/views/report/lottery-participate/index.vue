<template>
  <div class="verify-search">
    <div class="search">
      <div>
        <div>
          <span>开始时间</span>
          <el-date-picker
            v-model="searchParams.actBegtime"
            type="date"
            placeholder="请选择开始时间"
            format="yyyy/MM/dd"
            value-format="yyyy/MM/dd"
            :editable="false"
          >
          </el-date-picker>
        </div>
        <div>
          <span>结束时间</span>
          <el-date-picker
            v-model="searchParams.actEndtime"
            type="date"
            placeholder="请选择结束时间"
            format="yyyy/MM/dd"
            value-format="yyyy/MM/dd"
            :editable="false"
          >
          </el-date-picker>
        </div>
        <div>
          <span>活动名称</span>
          <el-input
            v-model="searchParams.actName"
            placeholder="请输入供应商名称"
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
        <el-button icon="el-icon-refresh-right" :loading="resetLoading" @click="reset">重置</el-button>
      </div>
    </div>
    <div class="result">
      <div class="cus-button handle" style="margin-bottom: 14px">
        <el-button v-if="isAuth('sys:report:export')" icon="el-icon-export" @click="exportData" :loading="exportLoading">导出</el-button>
        <el-button v-if="isAuth('sys:report:export')" icon="el-icon-export" @click="showRecord" :loading="exportLoading">中奖名单</el-button>
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
          label="选择"
          fixed
          width="60"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <el-radio
              :label="scope.row.actId"
              v-model="actId"
              >&nbsp;</el-radio
            >
          </template>
        </el-table-column>
        <el-table-column
          label="活动名称"
          prop="actName"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="actBegtime"
          label="开始时间"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="actEndtime"
          label="结束时间"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="actStatus"
          label="活动状态"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column 
          prop="gray" 
          label="是否灰度"
          header-align="center" 
          align="center">
        </el-table-column>
        <el-table-column
          prop="lotterTime"
          label="开奖时间"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="releaseStatus"
          label="开奖状态"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="releaseTime"
          label="中奖发布时间"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="prodCount"
          label="奖品总数"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="lotoneScore"
          label="单次参与消耗积分数"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="voteCount"
          label="总参与人数"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="sumVoteCount"
          label="总抽奖次数"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="sumVoteScore"
          label="积分池总分数"
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
      <!-- 发布名单 -->
      <release-review
        :dialogReleaseVisible="dialogReleaseVisible"
        :actId="actId"
        @cancel="dialogReleaseVisible = false"
      ></release-review>
    </div>
  </div>
</template>

<script>
import vPagination from '@/components/pagination/pagination'
import releaseReview from './release-review'
import API from '@/api'
export default {
  components: { vPagination, releaseReview },
  data() {
    return {
      searchParams: {
        actBegtime: '',
        actEndtime: '',
        actName: ''
      },
      actId: '',
      datas: [],
      page: {
        total: 0,
        current: 1,
        size: 10
      },
      searchLoading: false,
      resetLoading: false,
      exportLoading: false,
      dialogReleaseVisible: false
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
      this.radio = ''
      this.getDatas(1)
    },
    // 获取数据
    getDatas(current = this.page.current) {
      if (
        this.searchParams.actEndtime &&
        this.searchParams.actBegtime &&
        new Date(this.searchParams.actEndtime).getTime() <
          new Date(this.searchParams.actBegtime).getTime()
      ) {
        this.searchLoading = false
        this.$message.warning('终止时间不得早于起始时间!')
        return
      }
      this.page.current = current
      this.searchParams = this.paramTrim(this.searchParams)
      let params = Object.assign(this.searchParams, this.page)
      API.report.getJackpotActReport(params).then(res => {
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
        actBegtime: '',
        actEndtime: '',
        actName: ''
      }
      this.radio = ''
      this.resetLoading = true
      this.getDatas(1)
    },
    exportData() {
      if (this.page.total > 10000) {
        this.$message.error('一次最多导出10000条，请重新筛选！')
        return
      }
      this.exportLoading = true
      this.searchParams = this.paramTrim(this.searchParams)
      API.report.exportJackpotActReport(
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
            window.navigator.msSaveOrOpenBlob(blob, '奖池抽奖参与情况报表.xlsx')
          } else {
            const a = document.createElement('a')
            a.style.display = 'none'
            a.download = '奖池抽奖参与情况报表'
            a.href = window.URL.createObjectURL(blob)
            a.click()
          }
        })
        .catch(() => {
          this.exportLoading = false
          this.$message.error('暂无数据')
        })
    },
    showRecord() {
      if (!this.actId) {
        this.$message({
          type: 'warning',
          message: '请选择活动!'
        })
        return
      }
      this.dialogReleaseVisible = true
    }
  },

  created() {
    this.getDatas()
  }
}
</script>

<style lang="scss" scoped>
.verify-search {
  .search {
    > div {
      display: flex;
      align-items: center;
      justify-content: space-between;
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
    /deep/ .el-range-editor.el-input__inner {
      width: 240px;
    }
    /deep/ .el-range-editor--medium .el-range-separator {
      width: 20px;
    }
    /deep/ .el-date-editor .el-range-separator {
      width: 10%;
    }
    .button {
      margin-top: 31px;
      margin-bottom: 24px;
      justify-content: center;
    }
  }
  .handle {
    display: flex;
    // margin-bottom: 16px;
  }
}
</style>
