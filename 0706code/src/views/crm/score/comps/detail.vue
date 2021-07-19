<template>
  <div class="score-detail" v-loading="vLoading">
    <el-dialog
      title="旺季营销积分明细"
      :visible.sync="dialogDetailVisible"
      width="900px"
      :before-close="cancel"
    >
      <div style="width: 100%">
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
            prop="points"
            label="积分变化值"
            header-align="center"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="transDesc"
            label="积分变化原因"
            header-align="center"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="pointsDate"
            label="积分变化时间"
            header-align="center"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="orgName"
            label="积分变化机构"
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
    </el-dialog>
  </div>
</template>

<script>
import vPagination from '@/components/pagination/pagination'
import API from '@/api'
export default {
  components: { vPagination },
  props: {
    dialogDetailVisible: {
      type: Boolean
    },
    custNo: {
      type: String
    }
  },
  watch: {
    dialogDetailVisible (value) {
      // 初始化数据
      if (value) {
        // 初始化表单并移除所有表单项的校验
        this.getCustPointsL()
      }
    }
  },
  data() {
    return {
      infoList: [],
      vLoading: false,
      page: {
        total: 0,
        current: 1,
        size: 10
      }
    }
  },
  methods: {
    getCustPointsL() {
      this.vLoading = true
      let params = Object.assign(this.page, {custNo: this.custNo, scoreChannel: '4'})
      API.crmscore.getCustPointsL(params).then((res) => {
        this.infoList = res.data.data.records
        this.page.total = res.data.data.total
        this.vLoading = false
      }).catch((err) => {
        this.vLoading = false
        this.$message.error(err.msg)
      })
    },
    pageChange(val) {
      this.page.current = val.page
      this.page.size = val.limit
      this.getCustPointsL()
    },
    cancel() {
      this.$emit('cancel', { type: 'detail' })
    }
  }
}
</script>

<style lang="scss" scoped>
.score-detail {
  /deep/ .el-input__inner, /deep/ .el-input {
    width: 140px;
  }
}
</style>
