<template>
  <div class="prodmsg-select">
    <el-dialog
      title="选择虚拟商品"
      :visible.sync="dialogProdVisible"
      width="900px"
      :before-close="cancel"
      :modal-append-to-body="false"
      :append-to-body="true"
    >
      <div style="width: 100%">
        <div class="search" style="text-align: center">
          <el-form :inline="true" :model="searchParams">
            <el-form-item label="供应商名称" label-width="100px">
              <el-input
                v-model="searchParams.suppName"
                placeholder="请输入供应商名称"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品名称" label-width="100px">
              <el-input
                v-model="searchParams.prodName"
                placeholder="请输入商品名称"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品类型" label-width="100px">
              <el-select v-model="searchParams.prodType" disabled>
                <el-option label="请选择" value=""></el-option>
                <el-option label="虚拟" value="1"></el-option>
                <el-option label="实物" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="权益渠道" label-width="100px">
              <el-select v-model="searchParams.suppChannel" disabled>
                <el-option label="请选择" value=""></el-option>
                <el-option label="财富" value="1"></el-option>
                <el-option label="直销" value="2"></el-option>
                <el-option label="信用卡" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div
            style="margin-top: 31px;
      margin-bottom: 24px;
      text-align: center;"
          >
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
            ref="multipleTable"
            :data="datas"
            border
            style="width: 100%"
            :header-cell-style="{
              background: '#E8E8E8',
              'font-weight': '400',
              color: '#262626'
            }"
            v-loading="tableLoading"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="50"> </el-table-column>
            <el-table-column
              label="商品名称"
              prop="prodName"
              header-align="center"
              align="center"
            >
            </el-table-column>
            <el-table-column
              label="商品类型"
              header-align="center"
              align="center"
            >
              <template slot-scope="scope">
                {{ prodType[Number(scope.row.prodType)] }}
              </template>
            </el-table-column>
            <el-table-column
              prop="unitCost"
              width="140"
              label="单价成本（元）"
              header-align="center"
              align="center"
            >
              <template slot-scope="scope">
                {{ scope.row.unitCost && scope.row.unitCost.toFixed(2) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="prodCnt"
              label="数量"
              header-align="center"
              align="center"
            >
            </el-table-column>
            <el-table-column
              label="供应商名称"
              header-align="center"
              align="center"
              prop="suppName"
            >
            </el-table-column>
            <el-table-column
              prop="suppChannel"
              label="供应商渠道"
              width="120"
              header-align="center"
              align="center"
            >
              <template slot-scope="scope">
                {{ $root.selectOption.channelObj[scope.row.suppChannel] }}
              </template>
            </el-table-column>
            <el-table-column
              label="商品状态"
              header-align="center"
              align="center"
            >
              <template slot-scope="scope">
                {{ scope.row.prodStatus === '1' ? '已完成' : '' }}
              </template>
            </el-table-column>
          </el-table>
          <v-pagination
            :total="page.total"
            :currentPageNum="page.current"
            :currentPageSize="page.size"
            @pageChange="pageChange"
          ></v-pagination>
        </div>
        <div slot="footer" class="dialog-footer" style="text-align: center">
          <el-button type="primary" @click="addProd" :loading="addLoading"
            >添加</el-button
          >
          <el-button @click="cancel">返回</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 详情 -->
    <!-- <msg-info
      :dialogInfoVisible="dialogInfoVisible"
      :id="currentMsg.id"
      @cancel="closeDialog"
    ></msg-info> -->
  </div>
</template>
<script>
import vPagination from '@/components/pagination/pagination'
import msgInfo from '../../prod-msg/comps/msg-info'
import API from '@/api'
export default {
  components: {
    vPagination,
    msgInfo
  },
  props: {
    dialogProdVisible: {
      type: Boolean
    }
  },
  watch: {
    dialogProdVisible(value) {
      if (value) {
        // 初始化数据
        this.getDatas()
      }
    }
  },
  data() {
    return {
      searchParams: {
        suppName: '',
        suppChannel: this.$store.state.user.channel,
        prodType: '1',
        prodStatus: '1',
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
      multipleSelection: [],
      addLoading: false,
      equityChannel: ['', '财富', '直销', '信用卡'],
      prodType: ['', '虚拟', '实物'],
      // currentMsg: {},
      // dialogInfoVisible: false,
      tableLoading: false
    }
  },

  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
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
      let params = Object.assign(this.page, this.searchParams)
      API.product.getProd(
        Object.assign(params, {
          suppName: params.suppName.trim(),
          prodName: params.prodName.trim()
        })
      ).then(res => {
        this.page.total = res.data.data.total
        this.searchLoading = false
        this.resetLoading = false
        this.datas = res.data.data.records
      }).catch(() => {
        this.searchLoading = false
        this.resetLoading = false
      })
    },
    reset() {
      // 清空数据
      this.searchParams = {
        suppName: '',
        suppChannel: this.$store.state.user.channel,
        prodType: '1',
        prodStatus: '1',
        prodName: ''
      }
      this.resetLoading = true
      this.getDatas(1)
    },
    // 必须选择一条数据进行操作
    getCurrentRow() {
      if (this.multipleSelection.length === 0) {
        this.$message.info('请至少选择一条数据进行操作')
        return true
      } else {
        return false
      }
    },
    // 添加模板信息
    addProd() {
      // if (this.getCurrentRow()) {
      //   return
      // }
      this.cancel('add')
    },
    // 关闭详情弹框
    closeDialog() {
      this.dialogInfoVisible = false
    },
    cancel(operate) {
      this.$emit('cancel', { info: operate === 'add' ? this.multipleSelection : [], type: 'prod' })
    }
  },

  created() {}
}
</script>

<style lang="scss" scoped>
.search {
  /deep/ .el-form-item {
    width: 46%;
  }
  /deep/ .el-input {
    width: 234px;
  }
}
.result {
  /deep/ .cell {
    text-align: center;
  }
}
</style>
