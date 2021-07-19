<template>
  <div class="stock-edit">
    <el-dialog
      class="prod-dialog"
      title="中奖记录"
      :visible.sync="dialogReleaseVisible"
      width="1100px"
      :before-close="cancel"
    >
      <div>
        <div class="prod-dialog-search">
          <div class="search-input">
            <div class="search-input-item">
              <div class="search-input-label">中奖等级</div>
              <el-select
                v-model="prodSearchParams.isSuccess"
                placeholder="请选择"
              >
                <el-option value="1" label="一等奖"></el-option>
                <el-option value="2" label="二等奖"></el-option>
                <el-option value="3" label="三等奖"></el-option>
                <el-option value="4" label="四等奖"></el-option>
                <el-option value="5" label="五等奖"></el-option>
                <el-option value="6" label="六等奖"></el-option>
              </el-select>
            </div>
            <!-- <div class="search-input-item">
              <div class="search-input-label">供应商渠道</div>
              <el-select
                v-model="prodSearchParams.suppChannel"
                placeholder="请选择"
                disabled
              >
                <el-option
                  v-for="(item, index) in $root.selectOption.channel"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div> -->
            <div class="search-input-item">
              <div class="search-input-label">客户号</div>
              <el-input
                placeholder="请输入客户号"
                v-model="prodSearchParams.custNo"
              ></el-input>
            </div>
            <div class="search-input-item">
              <div class="search-input-label">客户姓名</div>
              <el-input
                placeholder="请输入客户姓名"
                v-model="prodSearchParams.custName"
              ></el-input>
            </div>
          </div>
          <div class="search-btns">
            <el-button type="primary" icon="el-icon-query" :loading="loading" @click="onSearchBtn"
              >查询</el-button
            >
            <el-button icon="el-icon-reset" @click="onResetBtn">重置</el-button>
          </div>
        </div>
        <el-table
          class="prod-dialog-table"
          :data="prodTableData"
          border
          :header-cell-style="{ background: '#80A639', color: '#ffffff' }"
        >
          <el-table-column prop="custNo" label="客户号" align="center">
          </el-table-column>
          <el-table-column prop="custName" label="客户姓名" align="center">
          </el-table-column>
          <el-table-column
            prop="cretNo"
            label="身份证号码"
            width="120"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="voteCount"
            label="抽奖次数"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="voteScore"
            label="投入积分"
            width="120"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="isSuccess" label="奖品级别" align="center">
          </el-table-column>
          <el-table-column
            prop="productName"
            label="中奖奖品名称"
            width="120"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="custAddress"
            label="收货地址"
            width="120"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="custMobile"
            label="联系方式"
            width="120"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="id"
            label="订单号"
            width="120"
            align="center"
          >
          </el-table-column>
        </el-table>
        <v-pagination
          :total="page.total"
          :currentPageNum="page.currentPage"
          :currentPageSize="page.pageSize"
          @pageChange="pageChange"
        ></v-pagination>
        <div class="prod-dialog-btns">
          <el-button type="primary" @click="releaseConfirm">导 出</el-button>
          <el-button @click="cancel">返 回</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 提示框 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogConfirmVisible"
      width="30%"
      class="cus-confirm"
    >
      <span>是否确认导出报表？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="exportLoading" @click="exportRecord">确 认</el-button
        >
        <el-button @click="dialogConfirmVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import API from '@/api'
import vPagination from '@/components/pagination/pagination'
export default {
  components: {
    vPagination
  },
  props: {
    dialogReleaseVisible: {
      type: Boolean
    },
    type: {
      type: String
    },
    actId: {
      type: String
    },
    releaseStatus: {
      type: String
    }
  },
  watch: {
    dialogReleaseVisible(value) {
      if (value) {
        // 初始化数据
        this.vLoading = true
        this.getOrderReportList(this.page)
      } else {
        this.selectProdId = ''
        this.selectProdName = ''
        this.prodSearchParams = {
          isSuccess: '',
          custNo: '',
          custName: ''
        }
        this.page = {
          total: 0,
          currentPage: 1,
          pageSize: 10
        }
        this.prodTableData = []
      }
    }
  },
  data() {
    return {
      vLoading: false,
      loading: false,
      exportLoading: false,
      dialogConfirmVisible: false,
      prodSearchParams: {
        isSuccess: '',
        custNo: '',
        custName: ''
      },
      prodTableData: [],
      prodSeqidArr: {
        '1': '一等奖',
        '2': '二等奖',
        '3': '三等奖',
        '4': '四等奖',
        '5': '五等奖',
        '6': '六等奖'
      },
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      }
    }
  },
  computed: {},
  methods: {
    // 请求商品列表数据
    getOrderReportList(page) {
      API.report
        .getJackpotOrderReport(
          Object.assign(
            {
              current: page.currentPage,
              size: page.pageSize,
              actId: this.actId
            },
            this.prodSearchParams
          )
        )
        .then(response => {
          this.prodTableData = response.data.data.records
          this.page.total = response.data.data.total
          this.loading = false
        })
        .catch(() => {
          console.log('error')
          this.loading = false
        })
    },
    // 查询
    onSearchBtn() {
      this.selectProdId = ''
      this.selectProdName = ''
      this.page.currentPage = 1
      this.loading = true
      this.getOrderReportList(this.page)
    },
    // 查询重置
    onResetBtn() {
      this.selectProdId = ''
      this.selectProdName = ''
      this.prodSearchParams = {
        isSuccess: '',
        custNo: '',
        custName: ''
      }
      this.page.currentPage = 1
      this.getOrderReportList(this.page)
    },
    // 分页
    pageChange(page) {
      this.selectProdId = ''
      this.selectProdName = ''
      this.page.currentPage = page.page
      this.page.pageSize = page.limit
      this.getOrderReportList(this.page)
    },
    cancel() {
      this.$emit('cancel', { type: this.type })
    },
    // 发布确认
    releaseConfirm() {
      this.dialogConfirmVisible = true
    },
    exportRecord() {
      if (this.page.total > 10000) {
        this.$message.error('一次最多导出10000条，请重新筛选！')
        return
      }
      this.exportLoading = true
      this.prodSearchParams = this.paramTrim(this.prodSearchParams)
      API.report.exportJackpotOrderReport(
        Object.assign(this.prodSearchParams, {
          total: this.page.total,
          current: this.page.current,
          size: 10000,
          actId: this.actId
        })
      )
        .then(data => {
          this.dialogConfirmVisible = false
          // this.cancel()
          this.exportLoading = false
          let blob = new Blob([data.data], {
            type:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          })
          // const blob = new Blob([data.data])
          if (!!window.ActiveXObject || 'ActiveXObject' in window) {
            window.navigator.msSaveOrOpenBlob(blob, '奖池抽奖中奖记录报表.xlsx')
          } else {
            const a = document.createElement('a')
            a.style.display = 'none'
            a.download = '奖池抽奖中奖记录报表'
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
  created() { }
}
</script>

<style lang="scss" scoped>
.stock-edit {
  .prod-dialog-search {
    .search-input {
      display: flex;
      justify-content: space-around;

      /deep/ .el-input {
        width: 140px;
        /deep/ .el-input__inner {
          height: 35px;
        }
      }
    }
  }
  .search-input-item {
    display: flex;
    align-items: center;

    &:nth-child(2) {
      margin: 0 50px;
    }
  }
  .search-input-label {
    width: 70px;
    margin-right: 16px;
  }

  .search-btns {
    margin: 30px 0;
    display: flex;
    justify-content: center;
  }

  .prod-dialog-btns {
    display: flex;
    justify-content: center;
  }

  .el-button {
    height: 35px;
    display: flex;
    align-items: center;
    padding: 0 20px;

    /deep/ .el-icon-query {
      width: 18px;
      height: 18px;
      background: url(./imgs/search.png) center no-repeat;
      background-size: cover;
    }

    /deep/ .el-icon-reset {
      width: 15px;
      height: 19px;
      background: url(./imgs/reset.png) center no-repeat;
      background-size: cover;
    }
  }

  .dialog-footer {
    display: flex;
    justify-content: center;
  }
}
</style>
