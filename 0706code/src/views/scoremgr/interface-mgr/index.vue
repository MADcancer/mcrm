<template>
  <div class="interface-mgr">
    <div class="search">
      <div>
        <div>
          <span>规则渠道</span>
          <el-select v-model="searchParams.equityChannel" placeholder="">
            <el-option v-for="(item,index) in $root.selectOption.channel" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <div>
          <span>对接系统</span>
          <el-select v-model="searchParams.conSys" placeholder="">
            <el-option label="请选择" value=""></el-option>
            <el-option v-for="(item,index) in $root.selectOption.conSys" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <div>
          <span>调整方向</span>
          <el-select v-model="searchParams.adjType" placeholder="">
            <el-option label="请选择" value=""></el-option>
            <el-option label="调增" value="1"></el-option>
            <el-option label="调减" value="2"></el-option>
          </el-select>
        </div>
      </div>
      <div>
        <div>
          <span>调整积分</span>
          <el-input v-model="searchParams.adjScore"></el-input>
        </div>
      </div>
      <div class="button">
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="search()"
          :loading="searchLoading"
          >查询</el-button
        >
        <el-button
          icon="el-icon-refresh-right"
          @click="reset"
          :loading="resetLoading"
          >重置</el-button
        >
      </div>
    </div>
    <div class="result table">
      <div class="handle cus-button">
        <el-button v-if="isAuth('sys:interface:create')" icon="el-icon-create"  @click="showdialog('create')"
          >创建</el-button
        >
        <el-button v-if="isAuth('sys:interface:upd')" icon="el-icon-upd" :disabled="buttonDisabled" @click="showdialog('update')"
          >修改</el-button
        >
        <el-button v-if="isAuth('sys:interface:del')" icon="el-icon-del" :disabled="buttonDisabled" @click="showdialog('del')">删除</el-button>
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
        <el-table-column label="选择" header-align="center" align="center" width="60">
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
          label="交易码"
          width="120"
          header-align="center"
          align="center"
        >
         <template slot-scope="scope">
            <el-button
              type="text"
              @click="getInfo(scope.row)"
              class="table-botton"
              >{{ scope.row.transCode }}</el-button
            >
          </template>
        </el-table-column>
        <el-table-column
          label="对接系统"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            {{ conSysObj[scope.row.conSys] }}
          </template>
        </el-table-column>
        <el-table-column
          label="权益渠道"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            {{ $root.selectOption.channelObj[scope.row.equityChannel] }}
          </template>
        </el-table-column>
        <el-table-column
          label="调整方向"
          width="120"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.adjType=== '1'">调增</span>
            <span v-if="scope.row.adjType=== '2'">调减</span>
          </template>
        </el-table-column>
        <el-table-column
          label="调整分值"
          header-align="center"
          align="center"
          prop="adjScore"
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
          width="120"
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
          width="140"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="modifyEmpName"
          label="修改人"
          width="140"
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
    <edit-interface
      :dialogEditVisible="dialogEditVisible"
      :type="type"
      :id="radio"
      :conSysObj="conSysObj"
      @cancel="closeDialog"
    ></edit-interface>
    <!-- 删除 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogDeleteVisible"
      width="30%"
      class="cus-confirm"
    >
      <span>是否确认删除此接口？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="comfirmDelete" :loading="delLoading">确 认</el-button>
        <el-button @click="dialogDeleteVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 查看详情 -->
    <interface-info
      :dialogInfoVisible="dialogInfoVisible"
      :interInfo="info"
      :conSysObj="conSysObj"
      @cancel="closeDialog"
    ></interface-info>
  </div>
</template>

<script>
import vPagination from '@/components/pagination/pagination'
import editInterface from './comps/edit-interface'
import interfaceInfo from './comps/interface-info'
import API from '@/api'
export default {
  components: { vPagination, editInterface, interfaceInfo },
  data() {
    return {
      searchParams: {
        equityChannel: '',
        conSys: '',
        adjType: '',
        adjScore: ''
      },
      datas: [],
      currentData: {},
      info: {},
      page: {
        total: 0,
        page: 1,
        limit: 10
      },
      radio: '',
      searchLoading: false,
      resetLoading: false,
      delLoading: false,
      scoreChannel: ['', '财富', '直销', '信用卡'],
      dialogEditVisible: false,
      dialogDeleteVisible: false,
      dialogInfoVisible: false,
      type: '',
      conSysObj: {}
    }
  },
  computed: {
    buttonDisabled() {
      return this.currentData.equityChannel && (this.currentData.equityChannel !== this.$store.state.user.channel)
    }
  },
  methods: {
    getCurrent(row) {
      this.currentData = row
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
    // 分页
    pageChange(val) {
      this.radio = ''
      this.page.page = val.page
      this.page.limit = val.limit
      this.getDatas()
    },
    // 搜索
    search() {
      this.searchLoading = true
      this.getDatas(1)
    },
    // 获取数据
    getDatas(page = this.page.page) {
      this.page.page = page
      let params = Object.assign(this.page, this.searchParams)
      API.interfacemgr
        .qryInterfaceList(
          Object.assign(params, {
            adjScore: params.adjScore.trim()
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
        }).catch(() => {
          this.searchLoading = false
          this.resetLoading = false
        })
    },
    reset() {
      // 清空数据
      this.searchParams = {
        equityChannel: '',
        conSys: '',
        adjType: '',
        adjScore: ''
      }
      this.radio = ''
      this.resetLoading = true
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
    // 查看详情
    getInfo(row) {
      this.info = row
      this.dialogInfoVisible = true
    },
    // 关闭弹框
    closeDialog(val) {
      switch (val.type) {
        case 'create':
          this.dialogEditVisible = false
          this.getDatas(1)
          break
        case 'update':
          this.dialogEditVisible = false
          this.getDatas()
          break
        case 'info':
          this.dialogInfoVisible = false
          break
        default:
      }
    },
    // 确认删除
    comfirmDelete() {
      this.delLoading = true
      let params = {
        id: this.radio,
        empNo: this.$store.state.user.id,
        empName: this.$store.state.user.name
      }
      API.interfacemgr.delInterface(params).then(() => {
        this.delLoading = false
        this.radio = ''
        this.$message.success('删除成功！')
        this.dialogDeleteVisible = false
        this.getDatas()
      }).catch(() => {
        this.delLoading = false
        // this.$message.error(error.msg)
      })
    }
  },

  created() {
    // 对接系统
    this.$root.selectOption.conSys.map(item => {
      this.conSysObj[item.value] = item.label
    })
    this.getDatas()
  }
}
</script>

<style lang="scss" scoped>
.interface-mgr {
  .search {
    > div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 25px;
      span {
        width: 60px;
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
