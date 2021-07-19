<template>
  <div class="email-search">
    <div class="search">
      <el-form
        :inline="true"
        :model="searchParams"
        ref="searchParams"
        class="demo-form-inline"
      >
        <el-form-item label="姓名">
          <el-input
            v-model="searchParams.username"
            placeholder="请输入姓名"
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
        <el-button v-if="isAuth('sys:email:create')" icon="el-icon-create" @click="showdialog('create')"
          >创建</el-button
        >
        <el-button v-if="isAuth('sys:email:upd')" icon="el-icon-upd" @click="showdialog('update')"
          :disabled="buttonDisabled">修改</el-button
        >
        <el-button v-if="isAuth('sys:email:del')" icon="el-icon-del" @click="showdialog('del')"
          :disabled="buttonDisabled">删除</el-button
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
              :label="scope.row.id"
              v-model="radio"
              @change="getCurrent(scope.row)"
              >&nbsp;</el-radio
            >
          </template>
        </el-table-column>
        <el-table-column
          label="姓名"
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
              >{{ scope.row.username }}</el-button
            >
          </template>
        </el-table-column>
        <el-table-column
          label="渠道"
          width="120"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            {{ $root.selectOption.channelObj[scope.row.scoreChannel] }}
          </template>
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          width="120"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="createDate"
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
        :currentPageNum="page.current"
        :currentPageSize="page.size"
        @pageChange="pageChange"
      ></v-pagination>
    </div>
    <!-- 创建/更新 -->
    <email-edit
      :dialogEditVisible="dialogEditVisible"
      :type="type"
      :id="radio"
      @cancel="closeDialog"
    ></email-edit>
    <!-- 详情 -->
    <email-info
      :dialogInfoVisible="dialogInfoVisible"
      :info="info"
      @cancel="closeDialog"
    ></email-info>
    <!-- 删除 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogDeleteVisible"
      width="30%"
      class="cus-confirm"
    >
      <span>是否确认删除此业务邮箱？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="comfirmDelete" :loading="delLoading"
          >确 认</el-button
        >
        <el-button @click="dialogDeleteVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import vPagination from '@/components/pagination/pagination'
import emailEdit from './comps/email-edit'
import emailInfo from './comps/email-info'
import API from '@/api'
export default {
  components: {
    vPagination,
    emailEdit,
    emailInfo
  },
  data() {
    return {
      searchParams: {
        username: '',
        scoreChannel: '',
        email: ''
      },
      datas: [],
      page: {
        total: 0,
        current: 1,
        size: 10
      },
      searchLoading: false,
      resetLoading: false,
      dialogEditVisible: false,
      dialogInfoVisible: false,
      dialogDeleteVisible: false,
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
      this.page.current = val.page
      this.page.size = val.limit
      this.getDatas()
    },
    getCurrent(row) {
      this.currentChannel = row.scoreChannel
    },
    // 搜索
    search() {
      this.searchLoading = true
      this.getDatas(1)
    },
    // 获取数据
    getDatas(current = this.page.current) {
      this.page.current = current
      let params = Object.assign(this.page, this.searchParams)
      API.supplierEmail
        .getBusiUserList(
          Object.assign(params, {
            username: params.username.trim(),
            email: params.email.trim()
          })
        )
        .then(res => {
          this.page.total = res.data.data.total
          this.searchLoading = false
          this.resetLoading = false
          if (res.data.data.records.length === 0 && this.page.current !== 1) {
            --this.page.current
            this.getDatas()
          } else {
            this.datas = res.data.data.records
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
        username: '',
        scoreChannel: '',
        email: ''
      }
      this.radio = ''
      this.currentChannel = ''
      this.resetLoading = true
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
      API.supplierEmail
        .delBusiUser({
          id: this.radio,
          modifyEmpNo: this.$store.state.user.id,
          modifyEmpName: this.$store.state.user.name
        })
        .then(res => {
          this.dialogDeleteVisible = false
          this.delLoading = false
          this.radio = ''
          this.currentChannel = ''
          this.$message.success('删除成功')
          this.getDatas()
        })
        .catch(error => {
          this.delLoading = false
          this.dialogDeleteVisible = false
          this.$message.info(error.msg)
          // setTimeout(() => {
          //   this.message = error.msg
          //   this.dialogMessageVisible = true
          // }, 350)
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
.email-search {
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
    justify-content: center;
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
