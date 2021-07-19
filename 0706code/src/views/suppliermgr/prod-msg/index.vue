<template>
  <div class="msg-search">
    <div class="search">
      <el-form :inline="true" :model="searchParams" class="demo-form-inline">
        <el-form-item label="短信模板名称" style="padding-right: 80px">
          <el-input
            v-model="searchParams.smsTemplateName"
            placeholder="请输入短信模板名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="权益渠道">
          <el-select v-model="searchParams.equityChannel">
            <el-option
              v-for="item in $root.selectOption.channel"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="创建日期">
          <el-date-picker
            v-model="searchParams.createDate"
            type="date"
            format="yyyy/MM/dd"
            value-format="yyyy/MM/dd"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item> -->
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
        <el-button v-if="isAuth('sys:msg:create')" icon="el-icon-create" @click="showdialog('create')"
          >创建</el-button
        >
        <el-button v-if="isAuth('sys:msg:upd')" icon="el-icon-upd" @click="showdialog('update')"
          :disabled="buttonDisabled">修改</el-button
        >
        <el-button v-if="isAuth('sys:msg:del')" icon="el-icon-del" @click="showdialog('del')"
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
        <el-table-column label="选择" header-align="center" width="60" align="center">
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
          label="短信模板编号"
          prop="smsTemplateId"
          width="120"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          label="短信模板名称"
          width="120"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="getInfo(scope.row)"
              class="table-botton"
              >{{ scope.row.smsTemplateName }}</el-button
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="equityChannel"
          label="权益渠道"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            {{ $root.selectOption.channelObj[scope.row.equityChannel] }}
          </template>
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
    <msg-edit
      :dialogEditVisible="dialogEditVisible"
      :type="type"
      :id="radio"
      @cancel="closeDialog"
    ></msg-edit>
    <!-- 详情 -->
    <msg-info
      :dialogInfoVisible="dialogInfoVisible"
      :type="type"
      :id="currentMsg.id"
      @cancel="closeDialog"
    ></msg-info>
    <!-- 删除 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogDeleteVisible"
      width="30%"
      class="cus-confirm"
    >
      <span>是否确认删除此短信模板？</span>
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
import msgEdit from './comps/msg-edit'
import msgInfo from './comps/msg-info'
import API from '@/api'
export default {
  components: { vPagination, msgEdit, msgInfo },
  data() {
    return {
      searchParams: {
        smsTemplateName: '',
        equityChannel: ''
        // createDate: ''
      },
      datas: [],
      page: {
        total: 0,
        current: 1,
        size: 10
      },
      searchLoading: false,
      resetLoading: false,
      delLoading: false,
      dialogEditVisible: false,
      dialogInfoVisible: false,
      dialogDeleteVisible: false,
      type: '',
      radio: '',
      currentMsg: {},
      currentChannel: ''
    }
  },
  computed: {
    buttonDisabled() {
      return this.currentChannel !== '' && (this.currentChannel !== this.$store.state.user.channel)
    }
  },
  methods: {
    getCurrent(row) {
      this.currentChannel = row.equityChannel
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
      this.currentMsg = row
      this.type = 'info'
      this.dialogInfoVisible = true
    },
    // 分页
    pageChange(val) {
      this.radio = ''
      this.currentChannel = ''
      this.page.current = val.page
      this.page.size = val.limit
      this.getDatas()
    },
    search() {
      this.searchLoading = true
      this.getDatas(1)
    },
    // 搜索
    getDatas(current = this.page.current) {
      this.page.current = current
      let params = Object.assign(this.page, this.searchParams)
      API.prodmsg
        .queryMsgTemplate(
          Object.assign(params, {
            smsTemplateName: params.smsTemplateName.trim()
          })
        )
        .then(res => {
          this.searchLoading = false
          this.resetLoading = false
          this.datas = res.data.data.records
          this.page.total = res.data.data.total
        })
        .catch(() => {
          this.searchLoading = false
          this.resetLoading = false
        })
    },
    reset() {
      // 清空数据
      this.searchParams = {
        smsTemplateName: '',
        equityChannel: ''
        // createDate: ''
      }
      this.resetLoading = true
      this.radio = ''
      this.currentChannel = ''
      this.getDatas(1)
    },
    // 打开弹框
    showdialog(type) {
      this.type = type
      // 必须选择一条进行操作
      if (this.getCurrentRow(type)) {
        return
      }
      if (type === 'del') {
        this.dialogDeleteVisible = true
      } else {
        this.dialogEditVisible = true
      }
    },
    // 关闭弹框
    closeDialog(val) {
      switch (val.type) {
        case 'info':
          this.dialogInfoVisible = false
          break
        case 'create':
          this.dialogEditVisible = false
          this.getDatas(1)
          break
        case 'update':
          this.dialogEditVisible = false
          this.getDatas()
          break
        default:
      }
    },
    // 确认删除
    comfirmDelete() {
      this.delLoading = true
      API.prodmsg
        .delMsgTemplate({
          id: this.radio,
          modifyEmpNo: this.$store.state.user.id,
          modifyEmpName: this.$store.state.user.name
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
    }
  },

  created() {
    this.getDatas()
  }
}
</script>

<style lang="scss" scoped>
.msg-search {
  padding: 0 44px;
  .search {
    /deep/ .el-input {
      width: 234px;
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
