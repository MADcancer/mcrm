<template>
  <div class="act-board">
    <div class="search">
      <div class="inline">
        <span>权益板块名称</span>
        <el-input
          v-model="searchParams.boardName"
          placeholder="请输入权益板块名称"
          maxlength="60"
        >
        </el-input>
      </div>
			<div class="inline">
        <span>权益板块渠道</span>
				<el-select v-model="searchParams.boardChannel" placeholder="请选择">
          <el-option v-for="(item,index) in $root.selectOption.channel" :key="index" :label="item.label" :value="item.value"></el-option>
				</el-select>
      </div>
    </div>
    <div class="search-btn">
      <el-button type="primary" icon="el-icon-search" :loading="searchLoading" @click="onSearchBtn">查询</el-button>
      <el-button icon="el-icon-reset" :loading="resetLoading" @click="onResetBtn">重置</el-button>
    </div>
    <div class="result table">
      <div class="cus-button handle" style="margin-bottom: 14px">
        <el-button icon="el-icon-create" v-if="isAuth('sys:board:create')"  @click="showdialog('create')"
          >创建</el-button
        >
        <el-button icon="el-icon-upd" v-if="isAuth('sys:board:upd')" @click="showdialog('update')"
          :disabled="buttonDisabled">修改</el-button
        >
        <el-button icon="el-icon-del" v-if="isAuth('sys:board:del')" @click="showdialog('del')"
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
              :label="scope.row.boardId"
              v-model="radio"
              @change="getCurrent(scope.row)"
              >&nbsp;</el-radio
            >
          </template>
        </el-table-column>
        <el-table-column
          label="权益板块名称"
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
              >{{ scope.row.boardName }}</el-button
            >
          </template>
        </el-table-column>
        <el-table-column
          label="权益板块渠道"
          header-align="center"
          align="center"
          width="140"
        >
         <template slot-scope="scope">
           <span>{{ $root.selectOption.channelObj[scope.row.boardChannel] }}</span>
            <!-- {{ channel[scope.row.boardChannel] }} -->
          </template>
        </el-table-column>
        <el-table-column
          prop="boardOrder"
          label="板块顺序"
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
    <!-- 查看详情 -->
    <v-info
      :dialogInfoVisible="dialogInfoVisible"
      :type="type"
      :id="boardInfo.boardId"
      @cancel="cancel"
    >
    </v-info>
    <!-- 删除 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogDeleteVisible"
      width="30%"
      class="cus-confirm"
    >
      <span>是否确认删除此权益板块？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="comfirmDelete" :loading='delLoading'>确 认</el-button>
        <el-button @click="dialogDeleteVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import vPagination from '@/components/pagination/pagination'
import vEdit from './comps/edit'
import vInfo from './comps/info'
import API from '@/api'
export default {
  name: 'board',
  components: {
    vPagination,
    vEdit,
    vInfo
  },
  computed: {
    buttonDisabled() {
      return (this.currentChannel !== '' && (this.currentChannel !== this.$store.state.user.channel))
      // return (this.currentChannel !== '' && (this.currentChannel !== this.$store.state.user.channel)) ||
      // (this.currentName && (this.currentName !== this.$store.state.user.name))
    }
  },
  data() {
    return {
      searchParams: {
        boardName: '',
        boardChannel: ''
      },
      channel: ['请选择', '财富', '直销', '信用卡'],
      resetLoading: false,
      searchLoading: false,
      delLoading: false,
      datas: [],
      page: {
        total: 0,
        current: 1,
        size: 10
      },
      radio: '',
      currentChannel: '',
      currentName: '',
      type: '',
      dialogEditVisible: false,
      dialogDeleteVisible: false,
      dialogInfoVisible: false,
      boardInfo: {}
    }
  },
  methods: {
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
      this.type = 'info'
      this.boardInfo = row
      this.dialogInfoVisible = true
    },
    onSearchBtn() {
      // 查询校验
      this.radio = ''
      this.currentChannel = ''
      this.currentName = ''
      this.searchLoading = true
      this.getBoardInfoList(1)
    },
    onResetBtn() {
      this.radio = ''
      this.currentChannel = ''
      this.currentName = ''
      this.searchParams = {
        boardName: '',
        boardChannel: ''
      }
      this.resetLoading = true
      this.getBoardInfoList(1)
    },
    getCurrent(row) {
      this.currentChannel = row.boardChannel
      this.currentName = row.createEmpName
    },
    comfirmDelete() {
      this.delLoading = true
      API.equityrule.delBoardInfo({
        boardId: this.radio,
        modifyEmpName: this.$store.state.user.name,
        modifyEmpNo: this.$store.state.user.id
      }).then((res) => {
        this.dialogDeleteVisible = false
        this.delLoading = false
        this.getBoardInfoList()
        this.$message.success('删除成功！')
      }).catch((err) => {
        this.delLoading = false
        this.$message.error(err.msg)
      })
    },
    // 获取列表
    getBoardInfoList(page = this.page.current) {
      this.page.current = page
      let params = Object.assign(this.page, this.searchParams)
      API.equityrule.getBoardInfoL(Object.assign(params, {boardName: params.boardName.trim()})).then((res) => {
        this.searchLoading = false
        this.resetLoading = false
        if (res.data.data.records.length === 0 && this.page.current !== 1) {
          --this.page.current
          this.getBoardInfoList()
        } else {
          this.datas = res.data.data.records
        }
        this.page.total = res.data.data.total
      }).catch(() => {
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
      this.getBoardInfoList()
    },
    cancel(val) {
      switch (val.type) {
        case 'info':
          this.dialogInfoVisible = false
          break
        case 'create':
          this.dialogEditVisible = false
          this.getBoardInfoList(1)
          break
        case 'update':
          this.dialogEditVisible = false
          this.getBoardInfoList()
          break
        default:
      }
    }
  },
  created() {
    this.getBoardInfoList(1)
  }
}
</script>
<style lang="scss" scoped>
.act-board {
  padding: 0 35px 44px;
  .search {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    .inline {
      width: 33%;
      padding-top: 25px;
      >span {
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
      line-height: 35px;
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
    /deep/ .el-icon-del{
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
  }
}
</style>
