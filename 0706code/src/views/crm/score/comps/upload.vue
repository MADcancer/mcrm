<template>
  <div class="upload">
    <el-dialog
      title="导入提醒"
      :visible.sync="dialogUploadVisible"
      width="900px"
      :before-close="cancel"
    >
      <div style="width: 100%">
        <div class="upload-info">
          <div class="upload-title">导入提示</div>
          <div class="upload-content"> {{ msg }}</div>
        </div>
        <div class="upload-fail" v-if="dealNo">
          <div class="upload-title">导入失败明细</div>
          <el-table
            :data="infoList"
            height="250"
            border
            style="width: 100%"
            :header-cell-style="{
              background: '#80A639',
              'font-weight': '400',
              color: '#ffffff'
            }"
          >
            <el-table-column
              label="客户号"
              header-align="center"
              align="center"
              prop="custNo"
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
              prop="amount"
              label="积分扣减值"
              header-align="center"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="errorChangeContent"
              label="失败原因"
              header-align="center"
              align="center"
            >
            </el-table-column>
          </el-table>
          <v-pagination
            :total="page.total"
            :currentPageNum="page.current"
            :currentPageSize="page.size"
            :pagerCount="5"
            @pageChange="pageChange"
          ></v-pagination>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import vPagination from '@/components/pagination/pagination'
import API from '@/api'
export default {
  components: { vPagination },
  props: {
    dialogUploadVisible: {
      type: Boolean
    },
    msg: {
      type: String
    },
    dealNo: {
      type: String
    }
  },
  watch: {
    dialogUploadVisible (value) {
      if (value && this.dealNo) {
        // 初始化表单并移除所有表单项的校验
        this.custErrExchangeL()
      }
    }
  },
  data() {
    return {
      infoList: [],
      page: {
        total: 0,
        current: 1,
        size: 10
      }
    }
  },
  methods: {
    custErrExchangeL() {
      API.crmscore.custErrExchangeL({ dealNo: this.dealNo, ...this.page }).then((res) => {
        this.infoList = res.data.data.records
        this.page.total = res.data.data.total
      })
    },
    pageChange(val) {
      this.page.current = val.page
      this.page.size = val.limit
      this.custErrExchangeL()
    },
    cancel() {
      this.$emit('cancel', { type: 'upload' })
    }
  }
}
</script>

<style lang="scss" scoped>
.upload {
  /deep/ .el-input__inner, /deep/ .el-input {
    width: 140px;
  }
  &-info {
    border: 1px solid #d1d1d1;
    padding: 10px;
    margin-bottom: 10px;
  }
  &-title {
    font-size: 18px;
    padding: 0 0 10px 0;
  }
  &-content {
    text-align: center;
    font-size: 18px;
    color: rgb(128, 166, 57);
   }
}
</style>
