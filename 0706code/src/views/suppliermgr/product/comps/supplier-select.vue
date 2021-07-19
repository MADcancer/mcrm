<template>
  <div class="supplier-select">
    <el-dialog
      title="选择供应商"
      :visible.sync="dialogSupplierVisible"
      width="900px"
      :before-close="cancel"
    >
      <div style="width: 100%">
        <div class="search">
          <el-form
            :inline="true"
            :model="searchParams"
            class="demo-form-inline"
          >
            <el-form-item label="供应商名称">
              <el-input
                v-model="searchParams.suppName"
                placeholder="请输入供应商名称"
              ></el-input>
            </el-form-item>
            <el-form-item label="供应商渠道">
              <el-select v-model="searchParams.suppChannel" disabled>
                <el-option
                  v-for="item in $root.selectOption.channel"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-form>
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
        <div class="result table">
          <el-table
            :data="datas"
            border
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
                  :label="scope.row.suppId"
                  v-model="radio"
                  @change="getCurrent(scope.row)"
                  >&nbsp;</el-radio
                >
              </template>
            </el-table-column>
            <el-table-column
              label="供应商名称"
              width="120"
              header-align="center"
              align="center"
              class="table-botton"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="getInfo(scope.row)"
                  class="table-botton"
                  >{{ scope.row.suppName }}</el-button
                >
              </template>
            </el-table-column>
            <el-table-column
              label="供应商渠道"
              header-align="center"
              align="center"
            >
              <template slot-scope="scope">
                {{ $root.selectOption.channelObj[scope.row.suppChannel] }}
              </template>
            </el-table-column>
            <el-table-column
              prop="createTime"
              label="创建时间"
              header-align="center"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="createEmpNo"
              label="创建人工号"
              header-align="center"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="createEmpName"
              label="创建人"
              header-align="center"
              align="center"
            >
            </el-table-column>
          </el-table>
          <v-pagination
            :total="page.total"
            :currentPageNum="page.page"
            :currentPageSize="page.limit"
            @pageChange="pageChange"
          ></v-pagination>
        </div>
        <div slot="footer" class="dialog-footer" style="text-align: center">
          <el-button type="primary" @click="addSupplier" :loading="addLoading">添加</el-button>
          <el-button @click="cancel">返回</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import vPagination from '@/components/pagination/pagination'
import API from '@/api'
export default {
  components: {
    vPagination
  },
  props: {
    dialogSupplierVisible: {
      type: Boolean
    }
  },
  watch: {
    dialogSupplierVisible(value) {
      if (value) {
        // 初始化数据
        this.radio = ''
      }
    }
  },
  data() {
    return {
      searchParams: {
        suppName: '',
        suppChannel: this.$store.state.user.channel
      },
      datas: [],
      page: {
        total: 0,
        page: 1,
        limit: 10
      },
      searchLoading: false,
      resetLoading: false,
      addLoading: false,
      radio: '',
      seletedInfo: {}
    }
  },

  methods: {
    // 分页
    pageChange(val) {
      this.radio = ''
      this.page.page = val.page
      this.page.limit = val.limit
      this.getDatas()
    },
    getCurrent(row) {
      this.seletedInfo = row
    },
    // 搜索
    search() {
      this.searchLoading = true
      this.getDatas(1)
    },
    // 获取数据
    getDatas(page = this.page.page) {
      // this.radio = ''
      this.page.page = page
      let params = Object.assign(this.page, this.searchParams)
      API.supplier
        .qrySupplierList(
          Object.assign(params, {
            suppName: params.suppName.trim()
          })
        )
        .then(res => {
          this.page.total = res.data.data.totalCount
          this.searchLoading = false
          this.resetLoading = false
          this.datas = res.data.data.list
        })
        .catch(() => {
          this.searchLoading = false
          this.resetLoading = false
        })
    },
    reset() {
      // 清空数据
      this.searchParams = {
        suppName: '',
        suppChannel: this.$store.state.user.channel
      }
      this.radio = ''
      this.resetLoading = true
      this.getDatas(1)
    },
    // 必须选择一条数据进行操作
    getCurrentRow() {
      if (this.radio === '') {
        this.$message.info('请选择一条数据进行操作')
        return true
      } else {
        return false
      }
    },
    // 添加供应商
    addSupplier() {
      if (this.getCurrentRow()) {
        return
      }
      this.cancel('add')
    },
    cancel(operate) {
      this.$emit('cancel', { info: operate === 'add' ? this.seletedInfo : {} })
    }
  },

  created() {
    this.getDatas()
  }
}
</script>

<style lang="scss" scoped>
.supplier-select {
  padding: 0 44px;
  .search {
    width: 100%;
    text-align: center;
    /deep/ .el-input {
      width: 234px;
      input {
        padding: 0 15px;
      }
    }
    /deep/ .el-form-item__label {
      padding: 0 10px;
    }
    .button {
      margin-top: 31px;
      margin-bottom: 24px;
      text-align: center;
    }
  }
}
</style>
