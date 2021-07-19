<template>
  <div class="compre-search">
    <div class="search">
      <el-form
        :inline="true"
        :model="searchParams"
        ref="searchParams"
        :rules="rules"
        class="demo-form-inline"
      >
        <el-form-item label="供应商名称">
          <el-input
            v-model="searchParams.suppName"
            placeholder="请输入供应商名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="供应商渠道">
          <el-select v-model="searchParams.suppChannel">
            <el-option
              v-for="item in $root.selectOption.channel"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="供应商电话" prop="suppTel">
          <el-input
            v-model="searchParams.suppTel"
            placeholder="请输入供应商电话"
          ></el-input>
        </el-form-item>
      </el-form>
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
    <div class="result table">
      <div class="cus-button handle" style="margin-bottom: 14px">
        <el-button v-if="isAuth('sys:supplier:create')" icon="el-icon-create" @click="showdialog('create')"
          >创建</el-button
        >
        <el-button v-if="isAuth('sys:supplier:upd')" icon="el-icon-upd" @click="showdialog('update')"
          :disabled="buttonDisabled">修改</el-button
        >
        <el-button v-if="isAuth('sys:supplier:del')" icon="el-icon-del" @click="showdialog('del')"
          :disabled="buttonDisabled">删除</el-button
        >
        <el-button  v-if="isAuth('sys:supplier:save')" icon="el-icon-adjust" @click="showdialog('budget')"
          :disabled="buttonDisabled">预算配置</el-button
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
          fixed
          width="60"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <el-radio
              :label="scope.row.suppId"
              v-model="radio"
              @change="getCurrent(scope.row)"
              >&nbsp;</el-radio
            >
          </template>
        </el-table-column>
        <el-table-column
          label="供应商名称"
          width="120"
          header-align="center"
          align="center"
          class="table-botton"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="getInfo(scope.row)"
              class="table-botton"
              >{{ scope.row.suppName }}</el-button
            >
          </template>
        </el-table-column>
        <el-table-column
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
          prop="suppLinkman"
          label="供应商联系人"
          width="120"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="suppTel"
          label="供应商电话"
          width="120"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="suppEmail"
          label="供应商邮箱"
          width="120"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="160"
          header-align="center"
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
        :currentPageNum="page.page"
        :currentPageSize="page.limit"
        @pageChange="pageChange"
      ></v-pagination>
    </div>
    <!-- 创建/更新 -->
    <supplier-edit
      :dialogEditVisible="dialogEditVisible"
      :type="type"
      :suppId="radio"
      @cancel="closeDialog"
    ></supplier-edit>
    <!-- 详情 -->
    <supplier-info
      :dialogInfoVisible="dialogInfoVisible"
      :info="info"
      @cancel="closeDialog"
    ></supplier-info>
    <!-- 删除 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogDeleteVisible"
      width="30%"
      class="cus-confirm"
    >
      <span>是否确认删除此供应商？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="comfirmDelete" :loading="delLoading"
          >确 认</el-button
        >
        <el-button @click="dialogDeleteVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 供应商预算 -->
    <supplier-budget
      :dialogBudgetVisible="dialogBudgetVisible"
      :suppId="radio"
      @cancel="closeDialog"
    ></supplier-budget>
  </div>
</template>

<script>
import vPagination from '@/components/pagination/pagination'
import supplierEdit from './comps/supplier-edit'
import supplierInfo from './comps/supplier-info'
import supplierBudget from './comps/supplier-budget'
import API from '@/api'
export default {
  components: {
    vPagination,
    supplierEdit,
    supplierInfo,
    supplierBudget
  },
  data() {
    // 校验手机号
    var checkPhone = (rule, value, callback) => {
      if (value !== '' && value.length !== 11) {
        return callback(new Error('手机号码长度需为11位'))
      }
      if (
        value !== '' &&
        !/^(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])\d{8}$/.test(
          value
        )
      ) {
        return callback(new Error('手机号码格式不正确'))
      }
      return callback()
    }
    return {
      searchParams: {
        suppName: '',
        suppChannel: '',
        suppTel: ''
      },
      datas: [],
      page: {
        total: 0,
        page: 1,
        limit: 10
      },
      searchLoading: false,
      resetLoading: false,
      rules: {
        suppTel: [
          {
            validator: checkPhone,
            trigger: 'blur'
          }
        ]
      },
      dialogEditVisible: false,
      dialogInfoVisible: false,
      dialogDeleteVisible: false,
      dialogBudgetVisible: false,
      delLoading: false,
      type: '',
      radio: '',
      info: {},
      currentChannel: ''
    }
  },
  computed: {
    buttonDisabled() {
      return this.currentChannel !== '' && (this.currentChannel !== this.$store.state.user.channel)
    }
  },
  methods: {
    // 分页
    pageChange(val) {
      this.radio = ''
      this.currentChannel = ''
      this.page.page = val.page
      this.page.limit = val.limit
      this.getDatas()
    },
    getCurrent(row) {
      this.currentChannel = row.suppChannel
    },
    // 搜索
    search() {
      this.$refs['searchParams'].validate(valid => {
        if (!valid) {
          return false
        }
        this.searchLoading = true
        this.getDatas(1)
      })
    },
    // 获取数据
    getDatas(page = this.page.page) {
      // this.radio = ''
      this.page.page = page
      let params = Object.assign(this.page, this.searchParams)
      API.supplier
        .qrySupplierList(
          Object.assign(params, {
            suppName: params.suppName.trim(),
            suppTel: params.suppTel.trim()
          })
        )
        .then(res => {
          this.page.total = res.data.data.totalCount
          this.searchLoading = false
          this.resetLoading = false
          if (res.data.data.list.length === 0 && this.page.page !== 1) {
            --this.page.page
            this.getDatas()
          } else {
            this.datas = res.data.data.list
          }
        })
        .catch(() => {
          this.searchLoading = false
          this.resetLoading = false
        })
    },
    reset() {
      // 清空数据
      this.searchParams = {
        suppName: '',
        suppChannel: '',
        suppTel: ''
      }
      this.radio = ''
      this.currentChannel = ''
      this.resetLoading = true
      this.$refs['searchParams'].clearValidate()
      this.getDatas(1)
    },
    // 查看详情
    getInfo(row) {
      this.info = row
      this.dialogInfoVisible = true
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
    // 删除
    comfirmDelete() {
      this.delLoading = true
      API.supplier
        .delSupplier({
          suppId: this.radio,
          empNo: this.$store.state.user.id,
          empName: this.$store.state.user.name
        })
        .then(res => {
          this.dialogDeleteVisible = false
          this.delLoading = false
          this.radio = ''
          this.$message.success('删除成功')
          this.getDatas()
        })
        .catch(error => {
          this.delLoading = false
          this.dialogDeleteVisible = false
          this.$message.info(error.msg)
        })
    },
    // 显示弹框
    showdialog(type) {
      // 必须选择一条进行操作
      if (this.getCurrentRow(type)) {
        return
      }
      this.type = type
      switch (type) {
        case 'del':
          this.dialogDeleteVisible = true
          break
        case 'budget':
          this.dialogBudgetVisible = true
          break
        default:
          this.dialogEditVisible = true
      }
    },
    // 关闭弹框
    closeDialog(val) {
      switch (val.type) {
        case 'create':
          this.getDatas(1)
          this.dialogEditVisible = false
          break
        case 'update':
          this.getDatas()
          this.dialogEditVisible = false
          break
        case 'budget':
          this.dialogBudgetVisible = false
          break
        case 'info':
          this.dialogInfoVisible = false
          break
        default:
      }
    }
  },

  created() {
    this.getDatas()
  }
}
</script>

<style lang="scss" scoped>
.compre-search {
  padding: 0 44px;

  .search {
    /deep/ .el-input {
      width: 234px;

      input {
        padding: 0 15px;
      }
    }

    .button {
      margin-top: 31px;
      margin-bottom: 24px;
      text-align: center;
    }
  }

  .el-form--inline {
    display: flex;
    justify-content: space-between;
  }

  .handle {
    display: flex;
    margin-bottom: 16px;

    /deep/ .el-icon-create {
      background: url(~@/assets/img/create-logo.png) center no-repeat;
    }

    /deep/ .el-icon-adjust {
      background: url(~@/assets/img/adjust-logo.png) center no-repeat;
    }

    /deep/ .el-icon-upd {
      background: url(~@/assets/img/edit-logo.png) center no-repeat;
    }

    /deep/ .el-icon-del {
      background: url(~@/assets/img/delete-logo.png) center no-repeat;
    }

    /deep/ .el-icon-create,
    /deep/ .el-icon-upd,
    /deep/ .el-icon-del,
    /deep/ .el-icon-adjust {
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
