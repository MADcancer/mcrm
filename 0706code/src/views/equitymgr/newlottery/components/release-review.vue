<template>
  <div class="stock-edit">
    <el-dialog
      class="prod-dialog"
      title="发布预览"
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
            <el-button type="primary" icon="el-icon-query" @click="onSearchBtn"
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
          <!-- <el-table-column prop="suppChannel" label="供应商渠道" align="center">
            <template slot-scope="{ row }">
              <span>{{ $root.selectOption.channelObj[row.suppChannel] }}</span>
            </template>
          </el-table-column> -->
          <el-table-column prop="custNo" label="客户号" align="center">
          </el-table-column>
          <el-table-column prop="custName" label="客户名称" align="center">
          </el-table-column>
          <el-table-column
            prop="productId"
            label="中奖商品id"
            width="120"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="productName"
            label="中奖商品名称"
            align="center"
          >
          </el-table-column>
          <el-table-column label="中奖等级" align="center">
            <template slot-scope="{ row }">
              <span>{{ prodSeqidArr[row.isSuccess] }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="custMobile"
            label="客户手机号"
            width="120"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="voteScore"
            label="客户总抽奖积分"
            width="120"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="voteCount"
            label="客户总抽奖资格次数"
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
          <el-button type="primary" @click="releaseConfirm">发 布</el-button>
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
      <span>是否确认发布？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="release" :loading="loading"
          >确 认</el-button
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
        this.getProdTableList(this.page)
      } else {
        this.radio = ''
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
    getProdTableList(page) {
      API.newlottery
        .getJackpotRecordList(
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
        })
        .catch(() => {
          console.log('error')
        })
    },
    // 查询
    onSearchBtn() {
      this.selectProdId = ''
      this.selectProdName = ''
      this.page.currentPage = 1
      this.getProdTableList(this.page)
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
      this.getProdTableList(this.page)
    },
    // 分页
    pageChange(page) {
      this.selectProdId = ''
      this.selectProdName = ''
      this.page.currentPage = page.page
      this.page.pageSize = page.limit
      this.getProdTableList(this.page)
    },
    cancel() {
      this.$emit('cancel', { type: this.type })
    },
    // 发布确认
    releaseConfirm() {
      if (this.releaseStatus !== '1') {
        this.$message({
          message: '只能发布未发布的名单！',
          type: 'warning'
        })
        return
      }
      this.dialogConfirmVisible = true
    },
    release() {
      API.newlottery
        .manualRelease(
          Object.assign(this.actId)
        )
        .then(response => {
          if (response.data.code === 0) {
            this.$message({
              message: '发布成功',
              type: 'success'
            })
            this.dialogConfirmVisible = false
            this.cancel()
            this.$emit('updateTable')
          }
        })
        .catch(error => {
          // console.log(error)
          this.$message.error(error.msg)
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
      background: url(../imgs/search.png) center no-repeat;
      background-size: cover;
    }

    /deep/ .el-icon-reset {
      width: 15px;
      height: 19px;
      background: url(../imgs/reset.png) center no-repeat;
      background-size: cover;
    }
  }

  .dialog-footer {
    display: flex;
    justify-content: center;
  }
}
</style>
