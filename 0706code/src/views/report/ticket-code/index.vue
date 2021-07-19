<template>
  <div class="code-search">
    <div class="search">
      <div>
        <div>
          <span>供应商名称</span>
          <el-input
            v-model="searchParams.suppName"
            placeholder="请输入供应商名称"
            clearable
          />
        </div>
        <div>
          <span>商品名称</span>
          <el-input
            v-model="searchParams.prodName"
            placeholder="请输入商品名称"
            clearable
          />
        </div>
        <div>
          <span>有效期区间</span>
          <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy/MM/dd"
            value-format="yyyy/MM/dd"
            :editable="false"
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
        <el-button v-if="isAuth('sys:report:export')" icon="el-icon-export" @click="exportData" :loading="exportLoading">导出</el-button>
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
          prop="suppName"
          label="供应商名称"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="prodName"
          label="商品名称"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="导入日期"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column 
          prop="expiredate" 
          label="有效期"
          header-align="center" 
          align="center">
        </el-table-column>
        <el-table-column
          prop="tickUsed"
          label="库存"
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
        suppName: '',
        prodName: '',
        expiredateMin: '',
        expiredateMax: ''
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
      actChannel: ['', '财富', '直销', '信用卡']
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
      this.searchParams = this.paramTrim(this.searchParams)
      let params = Object.assign(this.searchParams, this.page)
      API.report.queryTicketCode(Object.assign(params, {
        expiredateMin: this.date && this.date.length > 0 ? this.date[0] : '',
        expiredateMax: this.date && this.date.length > 0 ? this.date[1] : ''
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
        suppName: '',
        prodName: '',
        expiredateMin: '',
        expiredateMax: ''
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
      this.searchParams = this.paramTrim(this.searchParams)
      API.report.exportTicketCode(
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
            window.navigator.msSaveOrOpenBlob(blob, '券码信息.xls')
          } else {
            const a = document.createElement('a')
            a.style.display = 'none'
            a.download = '券码信息.xls'
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
.code-search {
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
}
</style>
