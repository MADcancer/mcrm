<template>
  <div>
    <el-dialog
      title="优惠券券码列表"
      :visible.sync="dialogCouponLVisible"
      width="900px"
      :before-close="cancel"
      append-to-body
    >
      <div class="coupon-select" style="width: 100%">
        <div class="search">
          <span>生成批次</span>
          <el-select v-model="searchParams.times" placeholder="">
            <el-option
              v-for="(item, index) in times"
              :key="index"
              :label="item+1"
              :value="item+1"
            ></el-option>
          </el-select>
          <div class="button">
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="search"
              :loading="searchLoading"
              >查询</el-button
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
              prop="yhmCode"
              label="码值"
              header-align="center"
              align="center"
              class="table-botton"
            >
            </el-table-column>
            <el-table-column
              prop="times"
              label="批次"
              header-align="center"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="custNo"
              label="使用客户号"
              header-align="center"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="useTime"
              label="使用时间"
              header-align="center"
              align="center"
            >
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
            :currentPageNum="page.current"
            :currentPageSize="page.size"
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
  components: {
    vPagination
  },
  props: {
    dialogCouponLVisible: {
      type: Boolean
    },
    yhmId: {
      type: String
    }
  },
  watch: {
    dialogCouponLVisible(value) {
      if (value) {
        // 获取数据
        this.getDatas(1)
      }
    }
  },
  data() {
    return {
      searchParams: {
        times: 1
      },
      times: Array(10)
        .fill(null)
        .map((_, h) => h),
      datas: [],
      searchLoading: false,
      status: ['未使用', '已使用', '手工作废', '已过期'],
      page: {
        total: 0,
        current: 1,
        size: 10
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
      this.searchLoading = true
      this.getDatas(1)
    },
    // 获取数据
    getDatas(page = this.page.page) {
      this.page.page = page
      API.coupon
        .selectAllYhmCodeInfo(
          Object.assign(this.page, {
            yhmId: this.yhmId,
            times: this.searchParams.times
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
    cancel() {
      this.$emit('cancel')
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
    text-align: center;
  }
  .button {
    margin: 18px 0;
  }
}
</style>
