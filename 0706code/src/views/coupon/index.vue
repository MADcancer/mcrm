<template>
  <div class="coupon">
    <div class="search">
      <div class="inline">
        <span>优惠券名称</span>
        <el-input
          v-model="searchParams.yhmName"
          placeholder="请输入优惠券名称"
          maxlength="64"
        >
        </el-input>
      </div>
      <div class="inline">
        <span>产品id</span>
        <el-input
          v-model="searchParams.productId"
          placeholder="请输入产品id"
          maxlength="20"
        >
        </el-input>
      </div>
      <div class="inline">
        <span>状态</span>
        <el-select v-model="searchParams.status" placeholder="">
          <el-option label="请选择" value=""></el-option>
          <el-option label="未生成" value="0"></el-option>
          <el-option label="已生成" value="1"></el-option>
          <el-option label="手工作废" value="2"></el-option>
        </el-select>
      </div>
    </div>
    <div class="search-btn">
      <el-button
        type="primary"
        icon="el-icon-search"
        :loading="searchLoading"
        @click="onSearchBtn"
        >查询</el-button
      >
      <el-button
        icon="el-icon-reset"
        :loading="resetLoading"
        @click="onResetBtn"
        >重置</el-button
      >
    </div>
    <div class="result table">
      <div class="cus-button handle" style="margin-bottom: 14px">
        <el-button icon="el-icon-create" @click="showdialog('create')"
          >创建</el-button
        >
        <el-button
          icon="el-icon-upd"
          @click="showdialog('update')"
          :disabled="buttonDisabled"
          >修改</el-button
        >
        <el-button
          icon="el-icon-del"
          @click="showdialog('del')"
          :disabled="buttonDisabled"
          >删除</el-button
        >
        <el-button
          icon="el-icon-del"
          @click="showdialog('delCode')"
          :disabled="buttonDisabled"
          >优惠券作废</el-button
        >
        <el-button
          icon="el-icon-create"
          @click="showdialog('code')"
          :disabled="buttonDisabled"
          >生成券码</el-button
        >
        <el-button
          icon="el-icon-info"
          :disabled="buttonDisabled"
          @click="couponLDoalog('show')"
          >获取优惠券券码</el-button
        >
        <el-button
          icon="el-icon-download"
          :disabled="buttonDisabled"
          @click="couponLDoalog('dowanload')"
          >下载券码</el-button
        >
      </div>
      <el-table
        :data="datas"
        border
        :header-cell-style="{
          background: '#E8E8E8',
          'font-weight': '400',
          color: '#262626'
        }"
      >
        <el-table-column
          label="选择"
          fixed
          width="60"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <el-radio
              :label="scope.row.yhmId"
              v-model="radio"
              @change="getCurrent(scope.row)"
              >&nbsp;</el-radio
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="yhmName"
          label="优惠码名称"
          width="120"
          header-align="center"
          align="center"
          class="table-botton"
        >
        </el-table-column>
        <el-table-column
          prop="yhmTypeId"
          label="优惠码类型"
          width="120"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="beginTime"
          label="有效期开始时间"
          width="120"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="endTime"
          label="有效期失效时间"
          width="120"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="times"
          label="券码生成次数"
          width="120"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="totalCount"
          label="券码个数"
          width="120"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="amount"
          label="面额"
          width="120"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="totalAmount"
          label="总面额"
          width="120"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="productId"
          label="产品id"
          width="120"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="limMax"
          label="购买产品上限"
          width="120"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="limMin"
          label="购买产品下限"
          width="120"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="useDesc"
          label="使用说明"
          width="120"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          label="状态"
          width="120"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            {{ status[scope.row.status] }}
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          width="120"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          header-align="center"
          width="160"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="createEmpNo"
          label="创建人工号"
          width="120"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="createEmpName"
          label="创建人"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="modifyTime"
          label="修改时间"
          width="160"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="modifyEmpNo"
          label="修改人工号"
          width="120"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="modifyEmpName"
          label="修改人"
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
    <!-- 修改 创建 -->
    <v-edit
      :dialogEditVisible="dialogEditVisible"
      :id="radio"
      :type="type"
      @cancel="cancel"
    >
    </v-edit>
    <!-- 优惠券券码列表 -->
    <v-couponL
      :dialogCouponLVisible="dialogCouponLVisible"
      :yhmId="radio"
      @cancel="dialogCouponLVisible = false"
    >
    </v-couponL>
    <!-- 删除 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogHandleVisible"
      width="30%"
      class="cus-confirm"
    >
      <span>{{ msg[type] }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="comfirmHandle"
          :loading="handleLoading"
          >确 认</el-button
        >
        <el-button @click="dialogHandleVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 下载 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogDownLoadVisible"
      width="30%"
      class="cus-confirm"
    >
      <div class="download">
        <div class="inline">
          <span>状态</span>
          <el-select v-model="downParams.status" placeholder="">
            <el-option label="请选择" value=""></el-option>
            <el-option label="未生成" value="0"></el-option>
            <el-option label="已生成" value="1"></el-option>
            <el-option label="手工作废" value="2"></el-option>
          </el-select>
        </div>

        <div class="inline">
          <span>生成批次</span>
          <el-select v-model="downParams.times" placeholder="">
            <el-option
              v-for="(item, index) in times"
              :key="index"
              :label="item+1"
              :value="item+1"
            ></el-option>
          </el-select>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="comfirmDownLoad">下 载</el-button>
        <el-button @click="dialogDownLoadVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import vPagination from '@/components/pagination/pagination'
import vEdit from './comps/edit'
import vCouponL from './comps/couponL'
import API from '@/api'
export default {
  name: 'subject',
  components: {
    vPagination,
    vEdit,
    vCouponL
  },
  computed: {
    buttonDisabled() {
      return false
      // return (
      //   this.currentName && this.currentName !== this.$store.state.user.name
      // )
    }
  },
  data() {
    return {
      searchParams: {
        yhmName: '',
        productId: '',
        status: ''
      },
      downParams: {
        yhmId: '',
        times: 1,
        status: ''
      },
      resetLoading: false,
      searchLoading: false,
      handleLoading: false,
      datas: [],
      page: {
        total: 0,
        current: 1,
        size: 10
      },
      radio: '',
      currentChannel: '',
      currentName: '',
      currentStatus: '',
      type: '',
      apiInterface: '',
      dialogEditVisible: false,
      dialogCouponLVisible: false,
      dialogHandleVisible: false,
      dialogDownLoadVisible: false,
      yhmKinds: ['', '资格券', '面额券', '折扣券'],
      status: ['未生成', '已生成', '手工作废'],
      dialogType: '',
      msg: {
        del: '是否确认删除此优惠券？',
        delCode: '是否确认将此优惠券作废？',
        code: '是否确认生成优惠券码？'
      },
      times: Array(10)
        .fill(null)
        .map((_, h) => h)
    }
  },
  methods: {
    showdialog(type) {
      this.type = type
      // 必须选择一条进行操作
      if (this.getCurrentRow(type)) {
        return
      }
      if (type === 'del' || type === 'delCode' || type === 'code') {
        this.dialogHandleVisible = true
      } else {
        this.dialogEditVisible = true
      }
    },
    couponLDoalog(type) {
      // 必须选择一条进行操作
      if (this.getCurrentRow()) {
        return
      }
      if (this.currentStatus === '2') {
        this.$message.warning('该优惠券已经作废！')
        return
      }
      if (this.currentStatus === '0') {
        this.$message.warning('该优惠券还未生成券码！')
        return
      }
      if (type === 'show') {
        this.dialogCouponLVisible = true
      } else {
        this.dialogDownLoadVisible = true
      }
    },
    // 下载
    comfirmDownLoad() {
      this.downParams.yhmId = this.radio
      API.coupon
        .exportYhmCode(this.downParams)
        .then(data => {
          let blob = new Blob([data.data], {
            type:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          })
          // ie浏览器
          if (!!window.ActiveXObject || 'ActiveXObject' in window) {
            window.navigator.msSaveOrOpenBlob(blob, '券码.xls')
          } else {
            const a = document.createElement('a')
            a.style.display = 'none'
            a.download = '券码.xls'
            a.href = window.URL.createObjectURL(blob)
            a.click()
          }
          this.$message.success('下载成功！')
          this.dialogDownLoadVisible = false
        })
        .catch(() => {
          this.$message.error('暂无数据')
          this.dialogDownLoadVisible = false
        })
    },
    // 必须选择一条数据进行操作
    getCurrentRow(type) {
      if (this.radio === '' && type !== 'create') {
        this.$message.info('请选择一条数据进行操作')
        return true
      } else {
        return false
      }
    },
    onSearchBtn() {
      this.radio = ''
      this.currentChannel = ''
      this.currentName = ''
      this.searchLoading = true
      this.selectAllYhmInfo(1)
    },
    onResetBtn() {
      this.radio = ''
      this.currentChannel = ''
      this.currentName = ''
      this.searchParams = {
        yhmName: '',
        productId: '',
        status: ''
      }
      this.resetLoading = true
      this.selectAllYhmInfo(1)
    },
    getCurrent(row) {
      this.currentChannel = row.subChannel
      this.currentName = row.createEmpName
      this.currentStatus = row.status
    },
    comfirmHandle() {
      if (this.type === 'del') {
        // 删除
        this.apiInterface = 'delYhmInfoById'
        this.handle()
      } else if (this.type === 'delCode') {
        // 作废
        if (this.currentStatus === '2') {
          this.$message.warning('该优惠券已经作废！')
          return
        }
        this.apiInterface = 'delYhmCode'
        this.handle()
      } else {
        // 生成券码
        if (this.currentStatus === '2') {
          this.$message.warning('该优惠券已经作废, 不可生成券码！')
          return
        }
        this.apiInterface = 'createYhmCode'
        this.handle()
      }
    },
    handle() {
      this.handleLoading = true
      let id = this.type === 'code' ? 'yhmId' : 'id'
      API.coupon[this.apiInterface]({
        [id]: this.radio,
        modifyEmpName: this.$store.state.user.name,
        modifyEmpNo: this.$store.state.user.id
      })
        .then(res => {
          this.radio = ''
          this.dialogHandleVisible = false
          this.handleLoading = false
          this.selectAllYhmInfo()
          this.$message.success('操作成功！')
        })
        .catch(err => {
          this.handleLoading = false
          this.$message.error(err.msg)
        })
    },
    // 获取列表
    selectAllYhmInfo(page = this.page.current) {
      this.page.current = page
      let params = Object.assign(this.page, this.searchParams)
      API.coupon
        .selectAllYhmInfo(
          Object.assign(
            params,
            { yhmName: params.yhmName.trim() },
            { productId: params.productId.trim() }
          )
        )
        .then(res => {
          this.searchLoading = false
          this.resetLoading = false
          if (res.data.data.records.length === 0 && this.page.current !== 1) {
            --this.page.current
            this.selectAllYhmInfo()
          } else {
            this.datas = res.data.data.records
          }
          this.page.total = res.data.data.total
        })
        .catch(() => {
          this.searchLoading = false
          this.resetLoading = false
        })
    },
    // 分页
    pageChange(val) {
      this.radio = ''
      this.currentChannel = ''
      this.currentName = ''
      this.page.current = val.page
      this.page.size = val.limit
      this.selectAllYhmInfo()
    },
    cancel(val) {
      switch (val.type) {
        case 'create':
          this.dialogEditVisible = false
          this.selectAllYhmInfo(1)
          break
        case 'update':
          this.dialogEditVisible = false
          this.selectAllYhmInfo()
          break
        default:
      }
    }
  },
  created() {
    this.selectAllYhmInfo(1)
  }
}
</script>
<style lang="scss" scoped>
.coupon {
  padding: 0 35px 44px;
  .search {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    .inline {
      width: 33%;
      padding-top: 25px;
      > span {
        width: 84px;
      }
      /deep/ .el-input {
        width: 248px;
        margin-left: 22px;
      }
      /deep/ .el-input__inner {
        height: 35px;
        line-height: 35px;
      }
    }
  }
  .search-btn {
    margin-top: 31px;
    margin-bottom: 24px;
    display: flex;
    justify-content: center;
    /deep/ .el-button {
      height: 35px;
      line-height: 1;
      display: flex;
      align-items: center;
    }
  }
  .handle {
    display: flex;
    margin-bottom: 16px;
    /deep/ .el-icon-create {
      background: url(~@/assets/img/create-logo.png) center no-repeat;
    }
    /deep/ .el-icon-upd {
      background: url(~@/assets/img/edit-logo.png) center no-repeat;
    }
    /deep/ .el-icon-del {
      background: url(~@/assets/img/delete-logo.png) center no-repeat;
    }
    /deep/ .el-icon-create,
    /deep/ .el-icon-upd,
    /deep/ .el-icon-del {
      background-size: cover;
      width: 16px;
      height: 16px;
    }
  }
  .result {
    /deep/ .table-botton {
      span {
        text-decoration: underline;
      }
    }
    /deep/ table {
      width: 100% !important;
    }
  }
  .download {
    width: 100%;
    .inline {
      display: flex;
      justify-content: center;
      padding-bottom: 10px;
      >span {
        width: 80px;
        display: block;
      }
    }
  }
}
</style>
