<template>
  <div class="account-search">
    <div class="search">
      <div>
        <div>
          <span>起始日期</span>
          <el-date-picker
            v-model="searchParams.startDate"
            type="date"
            placeholder="请选择起始日期"
            format="yyyy/MM/dd"
            value-format="yyyy/MM/dd"
            :editable="false"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </div>
        <div>
          <span>终止日期</span>
          <el-date-picker
            v-model="searchParams.endDate"
            type="date"
            placeholder="请选择终止日期"
            format="yyyy/MM/dd"
            value-format="yyyy/MM/dd"
            :editable="false"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </div>
        <div>
          <span>活动渠道</span>
          <el-select v-model="searchParams.scoreChannel" placeholder="">
            <el-option v-for="(item,index) in $root.selectOption.channel" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
      </div>
      <div>
        <div>
          <span>活动名称</span>
          <el-input
            v-model="searchParams.actName"
            placeholder="请输入活动名称"
            clearable
          />
        </div>
        <div>
          <span>供应商名称</span>
          <el-input
            v-model="searchParams.merName"
            placeholder="请输入供应商名称"
            clearable
          />
        </div>
        <div>
          <span>商品名称</span>
          <el-input
            v-model="searchParams.productName"
            placeholder="请输入商品名称"
            clearable
          />
        </div>
      </div>
      <div>
        <div>
          <span>订单号</span>
          <el-input
            v-model="searchParams.id"
            placeholder="请输入订单号"
            clearable
          />
        </div>
        <div>
          <span>订单状态</span>
          <el-select v-model="searchParams.orderStatus" placeholder="">
            <el-option label="请选择" value=""></el-option>
            <el-option label="待支付" value="1"></el-option>
            <el-option label="已支付" value="2"></el-option>
            <el-option label="已超时" value="4"></el-option>
            <el-option label="待补充" value="5"></el-option>
            <el-option label="已取消" value="6"></el-option>
          </el-select>
        </div>
        <div>
          <span>物流状态</span>
          <el-select v-model="searchParams.logisticsStatus" placeholder="">
            <el-option label="请选择" value=""></el-option>
            <el-option label="待发货" value="1"></el-option>
            <el-option label="已发货" value="2"></el-option>
          </el-select>
        </div>
      </div>
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
    <div class="result">
      <div>
        <div class="cus-button flex-style" style="margin-bottom: 14px;">
          <el-button
            @click="showRemindModel"
            style="display: inline-flex;margin-right: 10px;max-height: 34px;"
            >设置补充物流提醒天数</el-button
          >
          <el-upload
            slot="append"
            ref="upload"
            action
            class="upload-demo inline-block"
            accept=".xls, .xlsx"
            :show-file-list="false"
            :auto-upload="true"
            :http-request="handleRequest"
            :multiple="false"
            :file-list="fileList"
          >
            <el-button class="sp-lineHeight" :loading="uploadLoading" icon="el-icon-upload">导入物流</el-button>
            <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
          </el-upload>
          <el-button
            v-if="isAuth('sys:report:export')"
            icon="el-icon-export"
            @click="exportData"
            :loading="exportLoading"
            style="display: inline-flex;margin-left: 10px;max-height: 34px;"
            >导出</el-button
          >
          <el-button
            v-if="isAuth('sys:report:export')"
            icon="el-icon-export"
            @click="cancelOrder"
            :loading="exportLoading"
            style="display: inline-flex;margin-left: 10px;max-height: 34px;"
            >订单取消</el-button
          >
        </div>
      </div>
      <el-table
        :data="datas"
        border
        ref="multipleTable"
        style="width: 100%"
        :header-cell-style="{
          background: '#E8E8E8',
          'font-weight': '400',
          color: '#262626'
        }"
      @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50"> </el-table-column>
        <el-table-column
          label="订单号"
          prop="id"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          label="下单时间"
          prop="createTime"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          label="订单状态"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            {{ orderStatus[scope.row.orderStatus] }}
          </template>
        </el-table-column>
        <el-table-column
          label="物流状态"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            {{ logisticsStatus[scope.row.logisticsStatus] }}
          </template>
        </el-table-column>
        <el-table-column
          prop="actName"
          label="活动名称"
          header-align="center"
          align="center">
        </el-table-column>
        <el-table-column
          label="活动渠道"
          header-align="center"
          align="center"
        >
         <template slot-scope="scope">
            {{ $root.selectOption.channelObj[scope.row.scoreChannel] }}
          </template>
        </el-table-column>
        <el-table-column
          prop="productName"
          label="商品名称"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="prizeCount"
          label="兑换数量"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="merName"
          label="供应商名称"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="logisticsPerson"
          label="发货人"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="logisticsTime"
          label="发货时间"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="custName"
          label="收货人姓名"
          header-align="center"
          align="center"
        >
        </el-table-column>
         <el-table-column
          prop="custMobile"
          label="收货人电话"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="custAddress"
          label="收货地址"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="logisticsName"
          label="物流公司"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="logisticsNo"
          label="物流单号"
          header-align="center"
          align="center"
        >
        </el-table-column>
      </el-table>
      <v-pagination
        :total="page.total"
        :currentPageNum="page.current"
        :currentPageSize="page.size"
        @pageChange="pageChange"
      ></v-pagination>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="showFileOrderDetail"
      width="30%"
    >
      <div>
        <div style="font-size: 17px; margin-bottom:10px">您是否确认更新{{uploadCount}}笔订单物流信息?</div>
        <span>是否发送短信:</span>
        <el-switch
          v-model="ifSend"
          active-text="是"
          active-value="1"
          inactive-text="否"
          inactive-value="0"
        >
        </el-switch>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelUpload">取 消</el-button>
        <el-button type="primary" :loading="uploadDetailLoading" @click="addCustByExcel(uploadData)">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="showCanelOrderDetail"
      width="30%"
    >
      <div>
        <span>是否发送短信:</span>
        <el-switch
          v-model="ifSendMessage"
          active-text="是"
          active-value="1"
          inactive-text="否"
          inactive-value="0"
        >
        </el-switch>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showCanelOrderDetail = false">取 消</el-button>
        <el-button type="primary" :loading="cancelLoading" @click="cancelOrderComfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import vPagination from '@/components/pagination/pagination'
import { fileFormat } from '@/utils/validate'
import API from '@/api'
export default {
  components: { vPagination },
  data() {
    return {
      searchParams: {
        startDate: '',
        endDate: '',
        scoreChannel: '',
        actName: '',
        merName: '',
        productName: '',
        orderStatus: '',
        logisticsStatus: '',
        id: ''
      },
      datas: [],
      orderStatus: ['', '待支付', '已支付', '', '已超时', '待补充', '已取消'],
      logisticsStatus: ['无需发货', '待发货', '已发货'],
      page: {
        total: 0,
        current: 1,
        size: 10
      },
      searchLoading: false,
      resetLoading: false,
      uploadLoading: false,
      exportLoading: false,
      uploadDetailLoading: false,
      cancelLoading: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      fileList: [],
      showFileOrderDetail: false,
      uploadCount: '',
      ifSend: '0',
      uploadData: '',
      multipleSelection: [],
      showCanelOrderDetail: false,
      ifSendMessage: '1'
    }
  },

  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    cancelOrder() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请先选择订单!')
        return
      }
      const ifCancel = this.multipleSelection.every(item => {
        if (item.orderStatus !== '2' && item.orderStatus !== '5') {
          this.$message.error(`${item.id}的订单状态不是已支付`)
          return false
        } else if (item.orderType === '5') {
          this.$message.error(`奖池订单不能取消`)
          return false
        } else {
          return true
        }
      })
      if (!ifCancel) {
        return
      }
      this.showCanelOrderDetail = true
    },
    cancelOrderComfirm() {
      this.cancelLoading = true
      const idGroup = this.multipleSelection.map(item => {
        return item.id
      }).join(',')
      const param = {
        id: idGroup,
        openMsg: this.ifSendMessage
      }
      API.report.orderCancel(param, this.$store.state.user.channel).then(res => {
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: res.data.msg
          })
          this.$refs.multipleTable.clearSelection()
          this.multipleSelection = []
        } else {
          this.$message.error('取消失败！')
        };
        this.cancelLoading = false
        this.showCanelOrderDetail = false
      })
    },
    // 分页
    pageChange(val) {
      this.page.current = val.page
      this.page.size = val.limit
      this.getDatas()
    },
    // 搜索
    search() {
      if (
        this.searchParams.endDate &&
        this.searchParams.startDate &&
        new Date(this.searchParams.endDate).getTime() <
          new Date(this.searchParams.startDate).getTime()
      ) {
        this.$message.warning('终止时间不得早于起始时间!')
        return
      }
      this.searchLoading = true
      this.getDatas(1)
    },
    // 获取数据
    getDatas(current = this.page.current) {
      this.page.current = current
      this.searchParams = this.paramTrim(this.searchParams)
      let params = Object.assign(this.searchParams, this.page)
      API.report
        .qryEquityOrderList(params)
        .then(res => {
          this.datas = res.data.data.records
          this.page.total = res.data.data.total
          this.searchLoading = false
          this.resetLoading = false
          // 重置多选
          this.$refs.multipleTable.clearSelection()
          this.multipleSelection = []
        })
        .catch(() => {
          this.searchLoading = false
          this.resetLoading = false
        })
    },
    reset() {
      // 清空数据
      this.searchParams = {
        startDate: '',
        endDate: '',
        scoreChannel: '',
        actName: '',
        merName: '',
        productName: '',
        orderStatus: '',
        id: ''
      }
      this.resetLoading = true
      this.getDatas(1)
    },
    handleRequest(param) {
      if (fileFormat(param.file)) {
        this.uploadLoading = false
        this.$refs.upload.clearFiles()
        return
      }
      const formData = new FormData()
      formData.append('file', param.file)
      this.comfirmUpload(formData)
    },
    cancelUpload() {
      this.showFileOrderDetail = false
      this.resetForm()
    },
    comfirmUpload(formData) {
      this.uploadLoading = true
      API.report
        .getFileOrderSize(formData)
        .then(res => {
          this.uploadLoading = false
          this.uploadCount = res.data.data
          this.uploadData = formData
          this.showFileOrderDetail = true
        })
        .catch(err => {
          this.uploadLoading = false
          this.$message.error(err.msg)
        })
    },
    addCustByExcel(formData) {
      formData.append('operationPerson', this.$store.state.user.name)
      formData.append('userId', this.$store.state.user.id)
      formData.append('ifSend', this.ifSend)
      this.uploadDetailLoading = true
      API.report
        .addLogisticsInfo(formData)
        .then(res => {
          this.uploadDetailLoading = false
          this.$alert(res.data.msg + '点击下载执行结果明细', '提示', {
            confirmButtonText: '下载执行结果明细',
            center: 'true',
            callback: action => {
              this.showFileOrderDetail = false
              if (action === 'confirm') {
                API.report
                .exportOrderOperation({batchNo: res.data.data})
                .then(data => {
                  let blob = new Blob([data.data], {
                    type:
                      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                  })
                  // const blob = new Blob([data.data])
                  if (!!window.ActiveXObject || 'ActiveXObject' in window) {
                    window.navigator.msSaveOrOpenBlob(blob, '执行结果明细.xlsx')
                  } else {
                    const a = document.createElement('a')
                    a.style.display = 'none'
                    a.download = '执行结果明细.xlsx'
                    a.href = window.URL.createObjectURL(blob)
                    a.click()
                  }
                  this.$message({
                    message: '下载成功',
                    type: 'success'
                  })
                })
              }
            }
          })
          this.$refs.upload.clearFiles()
          this.resetForm()
          this.getDatas(1)
        })
        .catch(error => {
          this.uploadDetailLoading = false
          this.$refs.upload.clearFiles()
          this.resetForm()
          this.$message({
            message: error.msg ? error.msg : '导入失败',
            type: 'error'
          })
        })
    },
    resetForm() {
      // 判断ie10以及以下
      let isIE10 = window.navigator.userAgent.indexOf('MSIE') >= 1
      // const upload1 = 'upload'
      let ele = this.$refs.upload.$el.getElementsByTagName('input')[0]
      if (isIE10) {
        let form = document.createElement('form')
        let beforInput = ele.nextSibling
        let parentInput = ele.parentNode
        form.appendChild(ele)
        form.reset()
        parentInput.insertBefore(ele, beforInput)
      } else {
        ele.value = null
      }
    },
    exportData() {
      if (this.page.total > 10000) {
        this.$message.error('一次最多导出10000条，请重新筛选！')
        return
      }
      this.exportLoading = true
      this.searchParams = this.paramTrim(this.searchParams)
      API.report.exportOrder(
        Object.assign(this.searchParams, {
          total: this.page.total,
          current: this.page.current,
          size: 10000
        })
      )
        .then(data => {
          this.exportLoading = false
          let blob = new Blob([data.data], {
            type:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          })
          // const blob = new Blob([data.data])
          if (!!window.ActiveXObject || 'ActiveXObject' in window) {
            window.navigator.msSaveOrOpenBlob(blob, '权益订单查询.xlsx')
          } else {
            const a = document.createElement('a')
            a.style.display = 'none'
            a.download = '权益订单查询.xlsx'
            a.href = window.URL.createObjectURL(blob)
            a.click()
          }
        })
        .catch(() => {
          this.exportLoading = false
          this.$message.error('暂无数据')
        })
    },
    showRemindModel() {
      API.report.qryLogiDayFlag()
        .then(res => {
          this.$prompt('请设置补充物流提醒天数', '设置补充物流提醒天数', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPattern: /^[1-9]\d*$/,
            inputValue: res.data.data,
            inputErrorMessage: '天数不正确,天数只能为正整数'
          }).then(({ value }) => {
            API.report.setLogiDayFlag(value)
            .then(res => {
              this.$message({
                type: 'success',
                message: res.data.msg
              })
            })
            .catch(() => {})
          }).catch(() => {
          })
        })
        .catch(() => {
        })
    }
  },

  created() {
    this.getDatas()
  }
}
</script>

<style lang="scss" scoped>
.account-search {
  .search {
    > div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 25px;
      span {
        width: 80px;
        display: inline-block;
        margin-right: 10px;
      }
    }
    /deep/ .el-input {
      width: 234px;
    }
    /deep/ .el-input--medium .el-input__inner {
      height: 34px;
    }
    .button {
      margin-top: 31px;
      margin-bottom: 24px;
      justify-content: center;
    }
  }
  .inline-block {
    display: inline-block;
  }
  .flex-style {
    display: -webkit-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
  }
}
</style>
