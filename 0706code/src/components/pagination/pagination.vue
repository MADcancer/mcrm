// create by yueyao
<template>
  <div class="block">
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPageNum"
      :page-size="currentPageSize"
      :page-sizes="pageSizes"
      :pager-count="pagerCount"
      layout="total, sizes, prev, pager, next, slot"
      :total="total"
    >
      <div class="pagination-slot">
        <span class="totalPage">共{{ totalPages }}页</span>
        <el-input autocomplete="off" v-model.number="jumppage" type="number" @blur='handleInput'></el-input>
        <el-button type="primary" @click="handleCurrentChange(jumppage)" style="display: inline-block"
          >GO</el-button
        >
      </div>
    </el-pagination>
  </div>
</template>
<script>
export default {
  props: {
    // 当前页数
    currentPageNum: {
      type: Number
    },
    // 每页显示条目个数
    currentPageSize: {
      type: Number
    },
    // 页码按钮的数量
    pagerCount: {
      type: Number,
      default: 7
    },
    // 总条目数
    total: {
      type: Number
    }
  },
  data () {
    return {
      // 每页显示个数选择器的选项设置
      pageSizes: [10, 25, 50, 100],
      page: {
        limit: this.currentPageSize,
        page: this.currentPageNum
      },
      jumppage: 1
    }
  },
  computed: {
    totalPages () {
      return Math.ceil(this.total / this.currentPageSize)
    }
  },
  methods: {
    handleInput() {
      this.jumppage = Number(this.jumppage) === 0 ? 1 : Number(this.jumppage)
    },
    handleSizeChange (val) {
      this.page.limit = val
      this.$emit('pageChange', this.page)
    },
    handleCurrentChange (val) {
      if (Number(val) > this.totalPages) {
        this.jumppage = this.totalPages
        val = this.totalPages
      }
      if (Number(val) < 1) {
        this.jumppage = 1
        val = 1
      }
      this.page.page = Number(val)
      this.$emit('pageChange', this.page)
    }
  }
}
</script>
<style lang="scss" scoped>
.block {
  text-align: right;
  /deep/ .el-pagination {
    padding-top: 24px;
    padding-bottom: 44px;
  }
  /deep/ .el-pagination__total,
  /deep/ .el-pagination__sizes {
    float: left;
  }

  .pagination-slot {
    display: inline-block;
    .totalPage {
      font-size: 13px;
      font-weight: 400;
    }
    /deep/ .el-input {
      width: 36px;
      height: 30px;
      margin-left: 18px;
      margin-right: 6px;
      input {
        width: 100%;
        height: 100%;
        padding: 0;
      }
    }
    /deep/ .el-button {
      background-color: #80A639;
      border-radius: 2px;
      padding: 0;
      span {
        width: 100%;
      }
      &:hover {
        color: #ffffff;
      }
    }
  }
}
</style>
