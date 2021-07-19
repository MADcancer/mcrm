<template>
  <div class="product">
    <div class="search">
      <div>
        <div>
          <span>供应商名称</span>
          <el-input
            v-model="searchParams.suppName"
            placeholder="请输入供应商名称"
          ></el-input>
        </div>
        <div>
          <span>供应商渠道</span>
          <el-select v-model="searchParams.suppChannel" placeholder="">
           <el-option
              v-for="item in $root.selectOption.channel"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div>
          <span>商品名称</span>
          <el-input
            v-model="searchParams.prodName"
            placeholder="请输入商品名称"
          ></el-input>
        </div>
      </div>
      <div>
        <div>
          <span>商品类型</span>
          <el-select v-model="searchParams.prodType" placeholder="">
            <el-option label="请选择" value=""></el-option>
            <el-option label="虚拟" value="1"></el-option>
            <el-option label="实物" value="2"></el-option>
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
        <el-button icon="el-icon-refresh-right" :loading="resetLoading" @click="reset">重置</el-button>
      </div>
    </div>
    <div class="result table">
      <div class="handle cus-button">
        <el-button v-if="isAuth('sys:prod:create')" icon="el-icon-create" @click="showdialog('create')"
          >创建</el-button
        >
        <el-button v-if="isAuth('sys:prod:upd')" :disabled="buttonDisabled" icon="el-icon-upd" @click="showdialog('update')"
          >修改</el-button
        >
        <el-button v-if="isAuth('sys:prod:del')" :disabled="buttonDisabled" icon="el-icon-del" @click="deleteProd">删除</el-button>
        <el-button v-if="isAuth('sys:prod:upd')" :disabled="buttonDisabled || currentStatus !== '1'" icon="el-icon-upd" @click="showdialog('add')"
          >添加库存</el-button
        >
        <el-button v-if="isAuth('sys:prod:upd')" :disabled="buttonDisabled" icon="el-icon-upd" @click="updExpireTime"
          >延长过期时间</el-button
        >
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
          label="选择"
          width="60"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <el-radio
              :label="scope.row.prodId"
              v-model="radio"
              @change="getCurrent(scope.row)"
              >&nbsp;</el-radio
            >
          </template>
        </el-table-column>
        <el-table-column
          label="商品名称"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="getInfo(scope.row)"
              class="table-botton"
              >{{ scope.row.prodName }}</el-button
            >
          </template>
        </el-table-column>
        <el-table-column
          label="商品类型"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            {{ prodType[Number(scope.row.prodType)] }}
          </template>
        </el-table-column>
        <el-table-column
          prop="unitCost"
          label="单价成本（元）"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.unitCost && scope.row.unitCost.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="prodCnt"
          label="数量"
          width="120"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          label="供应商名称"
          header-align="center"
          align="center"
          prop="suppName"
        >
        </el-table-column>
        <el-table-column
          prop="suppChannel"
          label="供应商渠道"
          width="120"
          header-align="center"
          align="center"
        >
         <template slot-scope="scope">
            {{ $root.selectOption.channelObj[scope.row.suppChannel] }}
          </template>
        </el-table-column>
        <el-table-column
          label="商品状态"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.prodStatus === '1'? '已完成' : '' }}
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
    <!-- 创建/更新 -->
    <product-edit :dialogEditVisible='dialogEditVisible' :type='type' :currentStatus='currentStatus' :prodId='radio' @cancel="closeDialog"></product-edit>
    <!-- 删除 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogDeleteVisible"
      width="30%"
      class="cus-confirm"
    >
      <span>是否确认删除此商品？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="comfirmDelete" :loading='delLoading'>确 认</el-button>
        <el-button @click="dialogDeleteVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 添加库存 -->
    <stock-edit :dialogEditStockVisible="dialogEditStockVisible" :prodId='radio' :type="type" @cancel="closeDialog"></stock-edit>
    <!-- 过期时间 -->
    <upd-expire :dialogUpdTimeVisible="dialogUpdTimeVisible" :prodId="radio" :expireTime="expireTime"  @cancel="closeDialog"></upd-expire>
    <!-- 查看详情 -->
    <product-info :dialogInfoVisible="dialogInfoVisible" :prodId="currentProduct.prodId" @cancel="closeDialog"></product-info>
  </div>
</template>

<script>
import vPagination from '@/components/pagination/pagination'
import productEdit from './comps/product-edit'
import stockEdit from './comps/stock-edit'
import productInfo from './comps/product-info'
import updExpire from './comps/upd-exprie-time'
import API from '@/api'
export default {
  components: { vPagination, productEdit, productInfo, stockEdit, updExpire },
  data() {
    return {
      searchParams: {
        suppName: '',
        suppChannel: '',
        prodType: '',
        prodName: ''
      },
      datas: [],
      page: {
        total: 0,
        current: 1,
        size: 10
      },
      radio: '',
      searchLoading: false,
      resetLoading: false,
      delLoading: false,
      prodType: ['', '虚拟', '实物'],
      dialogEditVisible: false,
      dialogEditStockVisible: false,
      dialogDeleteVisible: false,
      dialogInfoVisible: false,
      dialogUpdTimeVisible: false,
      type: '',
      currentProduct: {},
      currentChannel: '',
      currentStatus: '',
      expireTime: ''
    }
  },
  computed: {
    buttonDisabled() {
      return this.currentChannel !== '' && (this.currentChannel !== this.$store.state.user.channel)
    }
  },
  methods: {
    getCurrent(row) {
      this.currentChannel = row.suppChannel
      this.currentStatus = row.prodStatus
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
    // 查看详情
    getInfo(row) {
      this.dialogInfoVisible = true
      this.currentProduct = row
    },
    // 分页
    pageChange(val) {
      this.radio = ''
      this.currentChannel = ''
      this.currentStatus = ''
      this.page.current = val.page
      this.page.size = val.limit
      this.getProd()
    },
    search() {
      this.searchLoading = true
      this.getProd(1)
    },
    // 搜索
    getProd(current = this.page.current) {
      this.page.current = current
      let params = Object.assign(this.page, this.searchParams)
      API.product.getProd(
        Object.assign(params, {
          suppName: params.suppName.trim(),
          prodName: params.prodName.trim()
        })
      ).then(res => {
        this.page.total = res.data.data.total
        this.searchLoading = false
        this.resetLoading = false
        if (res.data.data.records.length === 0 && this.page.current !== 1) {
          --this.page.current
          this.getProd()
        } else {
          this.datas = res.data.data.records
        }
      }).catch(() => {
        this.searchLoading = false
        this.resetLoading = false
      })
    },
    reset() {
      // 清空数据
      this.searchParams = {
        suppName: '',
        suppChannel: '',
        prodType: '',
        prodName: ''
      }
      this.resetLoading = true
      this.radio = ''
      this.currentChannel = ''
      this.currentStatus = ''
      this.getProd(1)
    },
    // 打开弹框
    showdialog(type) {
      this.type = type
      // 必须选择一条进行操作
      if (this.getCurrentRow(type)) {
        return
      }
      if (type === 'add') {
        this.dialogEditStockVisible = true
      } else {
        this.dialogEditVisible = true
      }
    },
    updExpireTime() {
      // 必须选择一条进行操作
      if (this.getCurrentRow()) {
        return
      }
      API.product.getProdExpireDate({ prodId: this.radio }).then((res) => {
        this.expireTime = res.data.data.substr(0, 10)
        this.dialogUpdTimeVisible = true
      }).catch((error) => {
        this.$message.warning(error.msg)
      })
    },
    // 关闭弹框
    closeDialog(val) {
      this.radio = ''
      this.currentChannel = ''
      this.currentStatus = ''
      switch (val.type) {
        case 'create':
          this.dialogEditVisible = false
          this.getProd(1)
          break
        case 'update':
          this.dialogEditVisible = false
          this.getProd()
          break
        case 'info':
          this.dialogInfoVisible = false
          break
        case 'add':
          this.dialogEditStockVisible = false
          break
        case 'updTime':
          this.dialogUpdTimeVisible = false
          break
        default:
      }
    },
    // 删除弹框
    deleteProd() {
      // 必须选择一条进行操作
      if (this.getCurrentRow()) {
        return
      }
      this.dialogDeleteVisible = true
    },
    // 确认删除
    comfirmDelete() {
      this.delLoading = true
      let param = {
        prodId: this.radio,
        modifyEmpNo: this.$store.state.user.id,
        modifyEmpName: this.$store.state.user.name
      }
      API.product
        .delProd(param)
        .then(res => {
          this.dialogDeleteVisible = false
          this.delLoading = false
          this.radio = ''
          this.$message.success('删除成功')
          this.getProd()
        })
        .catch((error) => {
          this.delLoading = false
          this.dialogDeleteVisible = false
          this.$message.error(error.msg)
        })
    }
  },

  created() {
    this.getProd()
  }
}
</script>

<style lang="scss" scoped>
.product {
  padding: 0 44px;
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
      line-height: 34px;
    }
    .button {
      margin-top: 31px;
      margin-bottom: 24px;
      justify-content: center;
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

  /deep/ .table-botton {
    span {
      text-decoration: underline;
    }
  }
}
</style>
