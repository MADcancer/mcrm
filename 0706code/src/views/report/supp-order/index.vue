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
          <span>物流状态</span>
          <el-select v-model="searchParams.logisticsStatus" placeholder="">
            <el-option label="请选择" value=""></el-option>
            <el-option label="待发货" value="1"></el-option>
            <el-option label="已发货" value="2"></el-option>
          </el-select>
        </div>
        <div style="visibility:hidden;">
          <span>占位字段隐藏</span>
          <el-input/>
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
        </div>
      </div>
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
          label="物流状态"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            {{ logisticsStatus[scope.row.logisticsStatus] }}
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
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelUpload">取 消</el-button>
        <el-button type="primary" :loading="uploadDetailLoading" @click="addCustByExcel(uploadData)">确 定</el-button>
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
        actName: '',
        productName: '',
        logisticsStatus: '',
        id: ''
      },
      datas: [],
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
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 24 * 60 * 60 * 1000
        }
      },
      fileList: [],
      showFileOrderDetail: false,
      uploadCount: '',
      ifSend: '0',
      uploadData: ''
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
        .getEquityOrderList(params)
        .then(res => {
          this.datas = res.data.data.records
          this.page.total = res.data.data.total
          this.searchLoading = false
          this.resetLoading = false
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
        actName: '',
        productName: '',
        logisticsStatus: '',
        id: ''
      }
      this.resetLoading = true
      this.getDatas(1)
    },
    cancelUpload() {
      this.showFileOrderDetail = false
      this.resetForm()
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
      this.uploadDetailLoading = true
      API.report
        .suppAddLogisticsInfo(formData)
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
