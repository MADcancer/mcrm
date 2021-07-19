<template>
  <div class="dbs-mgr">
    <div class="search">
      <div>
        <div>
          <span>起始日</span>
          <el-date-picker
              v-model="searchParams.startDate"
              type="date"
              value-format="yyyy/MM/dd"
              format="yyyy/MM/dd"
              placeholder="请选择起始日"
              :editable="false"
              >
            </el-date-picker>
        </div>
        <div>
          <span>截止日</span>
          <el-date-picker
            v-model="searchParams.endDate"
            type="date"
            value-format="yyyy/MM/dd"
            format="yyyy/MM/dd"
            placeholder="请选择截止日"
            :editable="false"
            >
          </el-date-picker>
        </div>
        <div>
          <span>达标条件</span>
          <el-select v-model="searchParams.condition" placeholder="">
            <el-option label="请选择" value=""></el-option>
            <el-option v-for="(item,index) in conditionSelect" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <div>
          <span>审批状态</span>
          <el-select v-model="searchParams.status" placeholder="">
            <el-option label="请选择" value=""></el-option>
            <el-option label="待审批" value="1"></el-option>
            <el-option label="同意" value="3"></el-option>
            <el-option label="驳回" value="4"></el-option>
          </el-select>
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
         <el-button icon="el-icon-create"  @click="showdialog('create')"
          >创建</el-button
        >
        <el-button icon="el-icon-upd" :disabled="buttonDisabled" @click="showdialog('update')"
          >修改</el-button
        >
        <el-button icon="el-icon-info" @click="showdialog('info')"
          >查看</el-button
        >
        <el-button icon="el-icon-del" :disabled="buttonDisabled" @click="showdialog('del')">删除</el-button>
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
          prop="startDate"
          label="起始日"
          width="120"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="endDate"
          label="截止日"
          width="120"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="standardId"
          label="达标条件代码"
          width="160"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          label="频次"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            {{ rates[scope.row.rate] }}
          </template>
        </el-table-column>
        <el-table-column
          label="达标条件"
          width="120"
          header-align="center"
          align="center"
        >
         <template slot-scope="scope">
            {{ conditions[scope.row.condition] }}
          </template>
        </el-table-column>
        <el-table-column
          prop="standardFreq"
          label="最大达标次数"
          width="120"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          label="理财产品"
          width="150"
          header-align="center"
          align="center"
        >
         <template slot-scope="scope">
            {{scope.row.prodId.split(",").map(item => {return dbsFinacProdCode[item]}).join(",")}}
          </template>
        </el-table-column>
        <el-table-column
          label="比较"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            {{ logicForms[scope.row.logicForm] }}
          </template>
        </el-table-column>
        <el-table-column
          prop="value1"
          label="笔数"
          width="160"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="value2"
          label="达标金额(元)"
          width="160"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="rewardPoint"
          label="获得积分"
          width="120"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="status"
          label="审批状态"
          width="120"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            {{ status[scope.row.status] }}
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="180"
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
        :currentPageNum="page.current"
        :currentPageSize="page.size"
        @pageChange="pageChange"
      ></v-pagination>
    </div>
    <!-- 创建/更新 -->
    <edit-dbs
      :dialogEditVisible="dialogEditVisible"
      :type="type"
      :id="radio"
      @cancel="closeDialog"
    ></edit-dbs>
    <!-- 删除 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogDeleteVisible"
      width="30%"
      class="cus-confirm"
    >
      <span>是否确认删除此理财达标条件？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="comfirmDelete" :loading="delLoading">确 认</el-button>
        <el-button @click="dialogDeleteVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import vPagination from '@/components/pagination/pagination'
import editDbs from './comps/edit-dbs'
import API from '@/api'
export default {
  components: { vPagination, editDbs },
  data() {
    return {
      searchParams: {
        startDate: '',
        endDate: '',
        condition: '',
        status: ''
      },
      datas: [],
      currentData: {},
      page: {
        total: 0,
        current: 1,
        size: 10
      },
      radio: '',
      searchLoading: false,
      resetLoading: false,
      delLoading: false,
      scoreChannel: ['', '财富', '直销', '信用卡'],
      dialogEditVisible: false,
      dialogDeleteVisible: false,
      type: '',
      rates: ['', '日', '周', '月', '季', '年'],
      logicForms: ['', '大于', '小于', '大于等于', '小于等于', '等于'],
      status: ['', '待审批', '', '同意', '驳回'],
      conditions: { 1: '定期理财', 2: '活期理财' },
      conditionSelect: [
        {
          value: '1',
          label: '定期理财'
        },
        {
          value: '2',
          label: '活期理财'
        }
      ],
      dbsFinacProdCode: {}
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
      this.page.current = val.page
      this.page.size = val.limit
      this.getDatas()
    },
    // 搜索
    search() {
      this.searchLoading = true
      this.getDatas(1)
    },
    // 获取数据
    getDatas(page = this.page.current) {
      this.page.current = page
      let params = Object.assign(this.page, this.searchParams)
      API.dbsfinr
        .qryDbsFinancialRuleList(params)
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
        }).catch(() => {
          this.searchLoading = false
          this.resetLoading = false
        })
    },
    reset() {
      // 清空数据
      this.searchParams = {
        startDate: '',
        endDate: '',
        condition: '',
        status: ''
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
      // 待审批状态的不可修改 删除
      if ((type === 'update' || type === 'del') && this.currentData.status === '1') {
        this.$message.warning('不可修改或删除待审批状态的数据！')
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
      this.dialogEditVisible = false
      switch (val.type) {
        case 'create':
          this.getDatas(1)
          break
        case 'update':
          this.getDatas()
          break
        default:
      }
    },
    // 确认删除
    comfirmDelete() {
      this.delLoading = true
      let params = {
        id: this.radio,
        modifyEmpNo: this.$store.state.user.id,
        modifyEmpName: this.$store.state.user.name
      }
      API.dbsfinr.delRule(params).then(() => {
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
  },

  mounted() {
    // this.$root.selectOption.condition.map(item => {
    //   this.conditions[item.value] = item.label
    // })
    this.$root.selectOption.dbsFinacProdCode.map(item => {
      this.dbsFinacProdCode[item.value] = item.label
    })
    this.getDatas()
  }
}
</script>

<style lang="scss" scoped>
.dbs-mgr {
  .search {
    > div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      >div {
        width: 33%;
        margin-bottom: 25px;
        text-align: center;
      }
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
