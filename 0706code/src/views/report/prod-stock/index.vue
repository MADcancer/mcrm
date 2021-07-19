<template>
  <div class="stock-search">
    <div class="search">
      <div>
        <div>
          <span>活动名称</span>
          <el-input
            v-model="searchParams.actName"
            placeholder="请输入活动名称"
            clearable
          />
        </div>
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
      </div>
      <div>
        <div>
          <span>积分渠道</span>
          <el-select v-model="searchParams.actChannel" placeholder="">
            <el-option v-for="(item,index) in $root.selectOption.channel" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
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
        <el-button v-if="isAuth('sys:report:export')" icon="el-icon-export" :disabled="searchParams.actChannel !== $store.state.user.channel" @click="exportData" :loading="exportLoading">导出</el-button>
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
          prop="actName"
          label="活动名称"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          label="活动渠道"
          header-align="center"
          align="center"
        >
         <template slot-scope="scope">
            {{ $root.selectOption.channelObj[scope.row.actChannel] }}
          </template>
        </el-table-column>
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
          align="center">
        </el-table-column>
        <el-table-column
          prop="prodCnt"
          label="未使用库存"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="prodUp"
          label="活动商品总库存"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="prodUse"
          label="活动商品已兑换数量"
          width="180"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="prodStock"
          label="活动商品剩余库存"
          width="140"
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
        actName: '',
        actChannel: '',
        suppName: '',
        prodName: ''
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
      API.report.queryProdStock(params
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
        actName: '',
        actChannel: '',
        suppName: '',
        prodName: ''
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
      this.searchParams = this.paramTrim(this.searchParams)
      API.report.exportProdStock(
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
            window.navigator.msSaveOrOpenBlob(blob, '活动商品库存.xlsx')
          } else {
            const a = document.createElement('a')
            a.style.display = 'none'
            a.download = '活动商品库存.xlsx'
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
.stock-search {
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
