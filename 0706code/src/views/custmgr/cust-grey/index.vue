<template>
  <div class="act-subject">
    <div class="search">
      <div class="inline">
        <span>客户号</span>
        <el-input v-model="searchParams.custNo" placeholder="请输入客户号" maxlength="60"></el-input>
      </div>
    </div>
    <div class="search-btn">
      <el-button
        type="primary"
        icon="el-icon-search"
        :loading="searchLoading"
        @click="onSearchBtn"
      >查询</el-button>
      <el-button icon="el-icon-reset" :loading="resetLoading" @click="onResetBtn">重置</el-button>
    </div>
    <div class="result table">
      <div class="cus-button handle" style="margin-bottom: 14px">
        <el-button
          v-if="isAuth('sys:custgrey:create')"
          icon="el-icon-create"
          @click="showdialog('create')"
        >创建</el-button>
        <el-button
          v-if="isAuth('sys:custgrey:update')"
          icon="el-icon-upd"
          @click="showdialog('update')"
          :disabled="buttonDisabled"
        >修改</el-button>
        <el-button
          v-if="isAuth('sys:custgrey:del')"
          icon="el-icon-del"
          @click="showdialog('del')"
          :disabled="buttonDisabled"
        >删除</el-button>
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
        <el-table-column label="选择" fixed width="60" header-align="center" align="center">
          <template slot-scope="scope">
            <el-radio
              :label="scope.row.custNo"
              v-model="radio"
              @change="getCurrent(scope.row)"
            >&nbsp;</el-radio>
          </template>
        </el-table-column>
        <el-table-column
          label="客户号"
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
            >{{ scope.row.custNo }}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="custName"
          label="客户姓名"
          width="120"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="custLevel"
          label="客户等级"
          width="120"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">{{ scope.row.custLevel | levelFilter }}</template>
        </el-table-column>
        <el-table-column prop="aumAmt" label="AUM余额" header-align="center" align="center"></el-table-column>
        <el-table-column label="积分渠道" header-align="center" width="160" align="center">
          <template slot-scope="scope">{{ $root.selectOption.channelObj[scope.row.scoreChannel] }}</template>
        </el-table-column>
        <el-table-column
          prop="avaScore"
          label="可用积分"
          width="120"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column prop="mobile" label="手机号" header-align="center" align="center"></el-table-column>
        <el-table-column
          prop="parentOrgName"
          label="上级机构"
          width="120"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="cardName"
          label="人才卡"
          width="120"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column prop="orgName" label="机构" width="160" header-align="center" align="center"></el-table-column>
        <el-table-column label="链接" header-align="center" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="opendialogVisible(scope.row.url)" class="table-botton">查看</el-button>
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
    <!-- 修改 创建 -->
    <v-edit :dialogEditVisible="dialogEditVisible" :id="radio" :type="type" @cancel="cancel"></v-edit>
    <!-- 查看详情 -->
    <v-info
      :dialogInfoVisible="dialogInfoVisible"
      :type="type"
      :id="subjectInfo.custNo"
      @cancel="cancel"
    ></v-info>
    <!-- 删除 -->
    <el-dialog title="提示" :visible.sync="dialogDeleteVisible" width="30%" class="cus-confirm">
      <span>是否确认删除此灰度名单？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="comfirmDelete" :loading="delLoading">确 认</el-button>
        <el-button @click="dialogDeleteVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="查看地址" :visible.sync="dialogUrlVisible" width="30%" class="cus-confirm">
      <div class="table-url">{{tableUrl}}</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogUrlVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import vPagination from '@/components/pagination/pagination'
import vEdit from './comps/edit'
import vInfo from './comps/info'
import API from '@/api'
const custLevels = [
  {
    value: '0',
    label: '零星'
  }, {
    value: '1',
    label: '一星'
  }, {
    value: '2',
    label: '二星'
  }, {
    value: '3',
    label: '三星'
  }, {
    value: '4',
    label: '四星'
  }, {
    value: '5',
    label: '五星'
  }, {
    value: '6',
    label: '六星'
  }
]
const actLevelKeyValue = custLevels.reduce((acc, cur) => {
  acc[cur.value] = cur.label
  return acc
}, {})

export default {
  name: 'Custgrey',
  components: {
    vPagination,
    vEdit,
    vInfo
  },
  computed: {
    buttonDisabled() {
      return this.currentChannel !== '' && (this.currentChannel !== this.$store.state.user.channel)
    }
  },
  filters: {
    levelFilter(num) {
      return actLevelKeyValue[num]
    }
  },
  data() {
    return {
      searchParams: {
        custNo: ''
        // scoreChannel: ''
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
      currentCustNo: '',
      currentChannel: '',
      type: '',
      dialogEditVisible: false,
      dialogDeleteVisible: false,
      dialogInfoVisible: false,
      dialogUrlVisible: false,
      subjectInfo: {},
      tableUrl: ''
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
      this.subjectInfo = row
      this.dialogInfoVisible = true
    },
    onSearchBtn() {
      this.currentChannel = ''
      this.searchLoading = true
      this.getSubInfoList(1)
    },
    onResetBtn() {
      this.currentChannel = ''
      this.searchParams = {
        custNo: ''
      }
      this.radio = ''
      this.resetLoading = true
      this.updateCustGreyTableList(1)
    },
    getCurrent(row) {
      this.currentChannel = row.scoreChannel
      this.radio = row.custNo
    },
    comfirmDelete() {
      this.delLoading = true
      API.custgrey.delCustGrayInfo({
        custNo: this.radio
      }).then((res) => {
        this.dialogDeleteVisible = false
        this.delLoading = false
        this.radio = ''
        this.updateCustGreyTableList()
        this.$message.success('删除成功！')
      }).catch((err) => {
        this.delLoading = false
        this.$message.error(err.msg ? err.msg : 'error')
      })
    },
    // 更新表格数据
    updateCustGreyTableList() {
      this.searchParams.custNo = ''
      this.getSubInfoList()
    },
    // 获取列表
    getSubInfoList(page = this.page.current) {
      this.page.current = page
      let params = Object.assign(this.page, this.searchParams)
      API.custgrey.getCustGreyListData(Object.assign(params, { custNo: params.custNo.trim() })).then((res) => {
        this.searchLoading = false
        this.resetLoading = false
        if (res.data.data.records.length === 0 && this.page.current !== 1) {
          --this.page.current
          this.getSubInfoList()
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
      this.currentChannel = ''
      this.radio = ''
      this.page.current = val.page
      this.page.size = val.limit
      this.getSubInfoList()
    },
    cancel(val) {
      switch (val.type) {
        case 'info':
          this.dialogInfoVisible = false
          break
        case 'create':
          this.dialogEditVisible = false
          this.updateCustGreyTableList()
          break
        case 'update':
          this.dialogEditVisible = false
          this.updateCustGreyTableList()
          break
        default:
      }
    },
    opendialogVisible(UrlValue) {
      this.dialogUrlVisible = true
      this.tableUrl = UrlValue
    }
  },
  created() {
    this.getSubInfoList(1)
  }
}
</script>
<style lang="scss" scoped>
.act-subject {
  padding: 0 35px 44px;
  .table-url {
    word-break: break-all;
    width: 100%;
  }
  .search {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    .inline {
      // width: 33%;
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
  }
}
</style>
