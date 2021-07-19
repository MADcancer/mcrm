<template>
  <div class="custinfo-dialog">
    <el-dialog title="权益详情" :visible.sync="dialogVisible" width="898px" :before-close="handleClose">
      <div style="width: 100%;">
        <div class="custinfo-dialog-form">
          <div>
            <div class="custinfo-dialog-item">
              <div class="custinfo-dialog-item-label">客户号:</div>
              <el-input :disabled="true" :value="rowObj.custNo"></el-input>
            </div>
            <div class="custinfo-dialog-item">
              <div class="custinfo-dialog-item-label">客户姓名:</div>
              <el-input :disabled="true" :value="rowObj.custName"></el-input>
            </div>
          </div>
          <div>
            <div class="custinfo-dialog-item">
              <div class="custinfo-dialog-item-label">证件号码:</div>
              <el-input :disabled="true" :value="rowObj.cretNo"></el-input>
            </div>
            <div class="custinfo-dialog-item">
              <div class="custinfo-dialog-item-label">客户等级:</div>
              <el-select :disabled="true" v-model="rowObj.custLevel" placeholder="请选择">
                <el-option label="零星" value="0">
                </el-option>
                <el-option label="一星" value="1">
                </el-option>
                <el-option label="二星" value="2">
                </el-option>
                <el-option label="三星" value="3">
                </el-option>
                <el-option label="四星" value="4">
                </el-option>
                <el-option label="五星" value="5">
                </el-option>
                <el-option label="六星" value="6">
                </el-option>
              </el-select>
            </div>
          </div>
          <div>
            <div class="custinfo-dialog-item">
              <div class="custinfo-dialog-item-label">积分渠道:</div>
              <el-select :disabled="true" :value="rowObj.scoreChannel" placeholder="请选择">
                <el-option
                  v-for="item in $root.selectOption.channel"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
            <div class="custinfo-dialog-item">
              <div class="custinfo-dialog-item-label">冻结标志:</div>
              <el-select :disabled="true" :value="rowObj.frzFlg" placeholder="请选择">
                <el-option label="是" value="1">
                </el-option>
                <el-option label="否" value="0">
                </el-option>
              </el-select>
            </div>
          </div>
          <div>
            <div class="custinfo-dialog-item">
              <div class="custinfo-dialog-item-label">可用积分:</div>
              <el-input :disabled="true" :value="rowObj.avaScore"></el-input>
            </div>
          </div>
        </div>
        <el-table class="custinfo-dialog-table" :header-cell-style="{background:'#80A639',color:'#ffffff'}" :data="equitiesList"
          border>
          <el-table-column prop="actBegtime" label="活动开始时间" width="150" align="center">
          </el-table-column>
          <el-table-column prop="actEndtime" label="活动结束时间" width="150" align="center">
          </el-table-column>
          <el-table-column prop="actName" label="权益名称" width="180" align="center">
          </el-table-column>
          <el-table-column prop="equitiesCnt" label="权益数量" align="center">
          </el-table-column>
          <el-table-column prop="exchangeScore" label="兑换积分" align="center">
          </el-table-column>
          <el-table-column prop="suppName" label="供应商名称" width="180" align="center">
          </el-table-column>
          <el-table-column label="兑换渠道" align="center">
            <template slot-scope="scope">
              {{ scope.row.exchangeChannel === '1' ? '手机银行' : '' }}
            </template>
          </el-table-column>
        </el-table>
        <v-pagination class="custinfo-dialog-pagination" :total="detailPage.total" :currentPageNum='detailPage.currentPage'
          :currentPageSize='detailPage.pageSize' @pageChange="detailPageChange"></v-pagination>
      </div>
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
      rowObj: {
        type: Object
      },
      // 弹框显隐
      dialogVisible: {
        type: Boolean
      }
    },
    data() {
      return {
        equitiesList: [],
        // 权益详情分页
        detailPage: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 10 // 每页显示多少条
        }
      }
    },
    methods: {
      handleClose(done) {
        this.$emit('onCancel')
      },
      // 请求权益详情表格数据
      getDetailTableList(page) {
        API.custinfo.getEquitiesListData({
          custNo: this.rowObj.custNo,
          scoreChannel: this.$store.state.user.channel,
          current: this.detailPage.currentPage,
          size: this.detailPage.pageSize
        }).then(response => {
          this.equitiesList = response.data.data.records
          this.detailPage.total = response.data.data.total
        })
      },
      detailPageChange(page) {
        this.detailPage = {
          pageSize: page.limit,
          currentPage: page.page
        }
        this.getDetailTableList(this.detailPage)
      }
    },
    watch: {
      dialogVisible(value) {
        if (value) {
          this.$nextTick(() => {
            this.getDetailTableList(this.detailPage)
          })
        } else {
          this.detailPage = {
            total: 0,
            currentPage: 1,
            pageSize: 10
          }
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .custinfo-dialog {
    .custinfo-dialog-form {
      height: 200px;

      .custinfo-dialog-item {
        display: flex;
        align-items: center;
        margin-bottom: 22px;
        float: left;

        /deep/ .el-input {
          width: 260px;

          /deep/ .el-input__inner {
            width: 260px;
            height: 26px;
          }

          /deep/ .el-input__icon {
            line-height: 26px;
          }
        }

        .custinfo-dialog-item-label {
          width: 100px;
        }
      }

      .custinfo-dialog-item:nth-child(odd) {
        margin: 0 50px 0 43px;
      }
    }

    .custinfo-dialog-table {
      width: 770px;
      margin: 0 auto;

      /deep/ tr {
        height: 35px;

        /deep/ th,
        td {
          padding: 0;
        }
      }
    }

    .custinfo-dialog-pagination {
      width: 770px;
      margin: 0 auto;
    }
  }
</style>
