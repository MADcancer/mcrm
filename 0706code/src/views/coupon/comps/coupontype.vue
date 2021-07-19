<template>
  <div>
    <el-dialog
      title="选择券码类型"
      :visible.sync="dialogCouponVisible"
      width="700px"
      :before-close="cancel"
      append-to-body
    >
      <div class="coupon-select" style="width: 100%">
        <div class="search">
          <el-form
            :inline="true"
            :model="searchParams"
            class="demo-form-inline"
          >
            <el-form-item label="类型名称">
              <el-input
                v-model="searchParams.yhmTypeName"
                placeholder="请输入供应商名称"
              ></el-input>
            </el-form-item>
            <el-form-item label="种类">
              <el-select v-model="searchParams.yhmKind" placeholder="">
                <el-option label="请选择" value=""></el-option>
                <el-option label="资格券" value="1"></el-option>
                <el-option label="面额券" value="2"></el-option>
                <el-option label="折扣券" value="3"></el-option>
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
                  :label="scope.row.yhmTypeId"
                  v-model="radio"
                  @change="getCurrent(scope.row)"
                  >&nbsp;</el-radio
                >
              </template>
            </el-table-column>
            <el-table-column
              prop="yhmTypeName"
              label="类型名称"
              header-align="center"
              align="center"
              class="table-botton"
            >
            </el-table-column>
            <el-table-column
              label="种类"
              header-align="center"
              align="center"
            >
              <template slot-scope="scope">
                {{ yhmKinds[scope.row.yhmKind] }}
              </template>
            </el-table-column>
            <el-table-column
              label="状态"
              header-align="center"
              align="center"
            >
              <template slot-scope="scope">
                {{ status[scope.row.status] }}
              </template>
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
          <el-button type="primary" @click="addSupplier" :loading="addLoading"
            >添加</el-button
          >
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
    dialogCouponVisible: {
      type: Boolean
    }
  },
  watch: {
    dialogCouponVisible(value) {
      if (value) {
        // 初始化数据
        this.radio = ''
      }
    }
  },
  data() {
    return {
      searchParams: {
        yhmTypeName: '',
        yhmKind: '',
        status: '1' // 选择启用状态的
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
      yhmKinds: ['', '资格券', '面额券', '折扣券'],
      status: ['停用', '启用'],
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
      API.coupon
        .selectAllYhmType(
          Object.assign(params, {
            yhmTypeName: params.yhmTypeName.trim()
          })
        )
        .then(res => {
          this.page.total = res.data.data.total
          this.searchLoading = false
          this.resetLoading = false
          this.datas = res.data.data.records
        })
        .catch(() => {
          this.searchLoading = false
          this.resetLoading = false
        })
    },
    reset() {
      // 清空数据
      this.searchParams = {
        yhmTypeName: '',
        yhmKind: '',
        status: '1'
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
.coupon-select {
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
  }
  .button {
    margin-top: 31px;
    margin-bottom: 24px;
    text-align: center;
  }
}
</style>
