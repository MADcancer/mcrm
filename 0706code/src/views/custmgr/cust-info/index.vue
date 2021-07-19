<!--
  ~
  ~  Copyright (c) 2018-2025, Pactera JinXin Software All rights reserved.
  ~
  -->
<template>
  <div class="custinfo-container">
    <div class="custinfo-form">
      <div class="custinfo-form-row">
        <div class="custinfo-form-item">
          <div class="custinfo-form-item-babel">客户号</div>
          <el-input
            v-model="searchParams.custNo"
            placeholder="请输入客户号"
            maxlength="20"
          >
          </el-input>
        </div>
        <div class="custinfo-form-item">
          <div class="custinfo-form-item-babel">客户姓名</div>
          <el-input
            placeholder="请输入客户姓名"
            v-model="searchParams.custName"
            maxlength="64"
          >
          </el-input>
        </div>
        <div class="custinfo-form-item">
          <div class="custinfo-form-item-babel">证件号码</div>
          <el-input
            placeholder="请输入证件号码"
            v-model="searchParams.cretNo"
            maxlength="128"
          >
          </el-input>
        </div>
      </div>
      <div class="custinfo-form-row">
        <div class="custinfo-form-item">
          <div class="custinfo-form-item-babel">客户等级</div>
          <el-select v-model="searchParams.custLevel" placeholder="请选择">
            <el-option
              v-for="item in custLevelOptions"
              :key="item.key"
              :label="item.name"
              :value="item.key"
            />
          </el-select>
        </div>
        <div class="custinfo-form-item">
          <div class="custinfo-form-item-babel">积分渠道</div>
          <el-select v-model="searchParams.scoreChannel" placeholder="请选择">
            <el-option
              v-for="item in $root.selectOption.channel"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="custinfo-form-itemScore">
          <div class="custinfo-form-item-babel">积分区间</div>
          <el-input
            placeholder="请输入下限"
            v-model="searchParams.avaScoreMin"
            maxlength="16"
          >
          </el-input>
          <div class="custinfo-form-item-line">-</div>
          <el-input
            placeholder="请输入上限"
            v-model="searchParams.avaScoreMax"
            maxlength="16"
          >
          </el-input>
        </div>
      </div>
      <div class="custinfo-form-row">
        <div class="custinfo-form-item">
          <div class="custinfo-form-item-babel">冻结标志</div>
          <el-select v-model="searchParams.frzFlg" placeholder="请选择">
            <el-option label="请选择" value=""> </el-option>
            <el-option label="是" value="1"> </el-option>
            <el-option label="否" value="0"> </el-option>
          </el-select>
        </div>
        <div class="custinfo-form-item">
          <div class="custinfo-form-item-babel">可操作类型</div>
          <el-select v-model="searchParams.chkStatus" placeholder="请选择">
            <el-option
              v-for="item in chkStatusOptions"
              :key="item.key"
              :label="item.name"
              :value="item.key"
            />
          </el-select>
        </div>
        <div class="custinfo-form-item">
          <div class="custinfo-form-item-babel">人才级别</div>
          <el-select
            v-model="searchParams.certYc"
            placeholder="请选择"
            @change="selectChange"
          >
            <el-option label="请选择" value=""> </el-option>
            <el-option label="区级人才卡" value="2"> </el-option>
            <el-option label="市级人才卡" value="1"> </el-option>
          </el-select>
        </div>
      </div>
      <div class="custinfo-form-row">
        <div class="custinfo-form-item">
          <div class="custinfo-form-item-babel">人才卡种</div>
          <el-select v-model="searchParams.certYcNo" placeholder="请选择">
            <el-option
              v-for="item in certYc"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="custinfo-form-item">
          <div class="custinfo-form-item-babel">手机号</div>
          <el-input
            placeholder="请输入手机号"
            v-model="searchParams.mobile"
            maxlength="11"
          >
          </el-input>
        </div>
        <!-- 占位 -->
        <div class="custinfo-form-item" style="visibility: hidden">
          <div class="custinfo-form-item-babel">手机号</div>
          <el-input
            placeholder="请输入手机号"
            v-model="searchParams.mobile"
            maxlength="11"
          >
          </el-input>
        </div>
      </div>
      <div class="custinfo-form-rowBtns">
        <el-button
          type="primary"
          icon="el-icon-query"
          :loading="searchBtnStatus"
          @click="onSearchBtn"
          >查询</el-button
        >
        <el-button
          icon="el-icon-reset"
          :loading="resetBtnStatus"
          @click="onResetBtn"
          >重置</el-button
        >
      </div>
    </div>
    <el-row class="custinfo-handelBtns cus-button">
      <el-button
        v-if="isAuth('sys:custinfo:adjust')"
        icon="el-icon-adjust"
        @click="handleFuncBtn('adjust')"
        :disabled="buttonDisabled"
        >积分调整</el-button
      >
      <el-button
        v-if="isAuth('sys:custinfo:frz')"
        icon="el-icon-frz"
        @click="handleFuncBtn('frz')"
        :disabled="buttonDisabled"
        >冻结</el-button
      >
      <el-button
        v-if="isAuth('sys:custinfo:unfrz')"
        icon="el-icon-unfrz"
        @click="handleFuncBtn('unfrz')"
        :disabled="buttonDisabled"
        >解冻</el-button
      >
      <el-button
        v-if="isAuth('sys:custinfo:black')"
        icon="el-icon-black"
        @click="handleFuncBtn('black')"
        :disabled="buttonDisabled"
        >移入黑名单</el-button
      >
      <el-button
        v-if="isAuth('sys:custinfo:detail')"
        icon="el-icon-detail"
        @click="handleFuncBtn('detail')"
        >权益详情</el-button
      >
    </el-row>
    <el-table
      class="custinfo-table"
      :data="list"
      style="width: 100%"
      border
      :header-cell-style="{ background: '#FAFAFA', color: '#262626' }"
      @sort-change="sortByAva"
    >
      <el-table-column label="选择" fixed width="60" align="center">
        <template slot-scope="scope">
          <el-radio
            v-model="radio"
            :label="scope.$index"
            @change="onTableSelect(scope.row)"
            >&nbsp;</el-radio
          >
        </template>
      </el-table-column>
      <el-table-column prop="custNo" label="客户号" width="180" align="center">
      </el-table-column>
      <el-table-column
        prop="custName"
        label="客户姓名"
        width="180"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="cretNo"
        label="证件号码"
        width="200"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="手机号"
        width="200"
        align="center"
      >
      </el-table-column>
      <el-table-column prop="scoreChannel" label="积分渠道" align="center">
        <template slot-scope="{ row }">
          <span>{{ $root.selectOption.channelObj[row.scoreChannel] }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="custLevel" label="客户等级" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.custLevel | custLevelFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="avaScore"
        label="可用积分"
        sortable="custom"
        width="120"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="matScore"
        label="即将到期积分"
        sortable="custom"
        width="140"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="usedScore"
        label="已用积分"
        sortable="custom"
        width="120"
        align="center"
      >
      </el-table-column>
      <el-table-column prop="frzFlg" label="冻结标志" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.frzFlg === '1'">是</span>
          <span v-if="scope.row.frzFlg !== '1'">否</span>
        </template>
      </el-table-column>
    </el-table>
    <v-pagination
      :total="page.total"
      :currentPageNum="page.currentPage"
      :currentPageSize="page.pageSize"
      @pageChange="pageChange"
    ></v-pagination>
    <adjust-form
      ref="adjustChild"
      :custNo="rowObj.custNo"
      :custName="rowObj.custName"
      :scoreChannel="rowObj.scoreChannel"
      :dialogVisible="adjDialogVisible"
      @onCancel="adjDialogVisible = false"
      @handleAdjust="handleAdjust"
    ></adjust-form>
    <frz-form
      ref="frzChild"
      :custNo="rowObj.custNo"
      :custName="rowObj.custName"
      :scoreChannel="rowObj.scoreChannel"
      :frzFlg="rowObj.frzFlg"
      :frzType="rowObj.frzFlgType"
      :btnType="btnType"
      :dialogVisible="frzDialogVisible"
      @onCancel="frzDialogVisible = false"
      @handleFrz="handleFrz"
    ></frz-form>
    <black-form
      ref="blackChild"
      :custNo="rowObj.custNo"
      :custName="rowObj.custName"
      :scoreChannel="rowObj.scoreChannel"
      :dialogVisible="blackDialogVisible"
      @onCancel="blackDialogVisible = false"
      @handleBlack="handleBlack"
    ></black-form>
    <detail-form
      :rowObj="rowObj"
      :dialogVisible="detailDialogVisible"
      @onCancel="detailDialogVisible = false"
    ></detail-form>
    <div id="main" style="height:400px"></div>
  </div>
</template>
<script>
import API from '@/api'
import * as echarts from 'echarts';
// import { isMobile } from '@/utils/validate'
import vPagination from '@/components/pagination/pagination'
import adjustForm from './components/adjust-form'
import frzForm from './components/frz-form'
import blackForm from './components/black-form'
import detailForm from './components/detail-form'
const custLevelOptions = [
  {
    key: '',
    name: '请选择'
  },
  {
    key: '0',
    name: '零星'
  },
  {
    key: '1',
    name: '一星'
  },
  {
    key: '2',
    name: '二星'
  },
  {
    key: '3',
    name: '三星'
  },
  {
    key: '4',
    name: '四星'
  },
  {
    key: '5',
    name: '五星'
  },
  {
    key: '6',
    name: '六星'
  },

]
const chkStatusOptions = [
  {
    key: '',
    name: '请选择'
  },
  {
    key: '1',
    name: '积分调整'
  },
  {
    key: '2',
    name: '冻结/解冻'
  },
  {
    key: '3',
    name: '移入黑名单'
  }
]
const custLevelKeyValue = custLevelOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.name
  return acc
}, {})
export default {
  name: 'CustInfo',
  components: {
    vPagination,
    adjustForm,
    frzForm,
    blackForm,
    detailForm
  },
  filters: {
    custLevelFilter(num) {
      return custLevelKeyValue[num]
    }
  },
  computed: {
    buttonDisabled() {
      return (
        (this.rowObj.scoreChannel &&
          this.rowObj.scoreChannel !== this.$store.state.user.channel) ||
        (this.rowObj.isBlackList && this.rowObj.isBlackList === '1')
      )
    }
  },
  data() {
    return {
      custLevelOptions,
      chkStatusOptions,
      // 查询参数
      searchParams: {
        custNo: '', // 客户号
        custLevel: '', // 客户等级
        custName: '', // 客户姓名
        cretNo: '', // 证件号码
        scoreChannel: this.$store.state.user.channel, // 积分渠道
        avaScoreMin: '', // 积分区间下限
        avaScoreMax: '', // 积分区间上限 *校验输入内容是否为非负整数，上限不可小于下限
        frzFlg: '', // 冻结标志 *1冻结,2解冻
        chkStatus: '', // 审批状态
        mobile: '',
        certYc: '',
        certYcNo: '',
        descs: '',
        ascs: ''
      },
      certYc: [],
      searchBtnStatus: false,
      resetBtnStatus: false,
      rowObj: {},
      adjDialogVisible: false,
      frzDialogVisible: false,
      blackDialogVisible: false,
      detailDialogVisible: false,
      btnStatus: false,
      noticeBtnStatus: false,
      radio: '',
      isUpdate: false,
      // 客户信息分页
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      // 客户信息列表
      list: [],
      btnType: ''
    }
  },
  methods: {
    selectChange() {
      this.searchParams.certYcNo = ''
      if (this.searchParams.certYc === '2') {
        this.certYc = [
          {
            id: '-1',
            value: '',
            label: '请选择'
          },
          ...this.$root.selectOption.certYcDistrict
        ]
      } else if (this.searchParams.certYc === '1') {
        this.certYc = [
          {
            id: '-1',
            value: '',
            label: '请选择'
          },
          ...this.$root.selectOption.certYcCity
        ]
      } else {
        this.searchParams.certYcNo = undefined
        this.certYc = []
      }
    },
    sortByAva(column) {
      if (column.order === 'ascending') {
        this.searchParams.ascs = column.prop
        this.searchParams.descs = ''
      } else {
        this.searchParams.descs = column.prop
        this.searchParams.ascs = ''
      }
      this.getCustInfoTableList(this.page, this.searchParams)
    },
    // 请求客户信息表格数据
    getCustInfoTableList(page, params) {
      if (
        params.scoreChannel &&
        params.scoreChannel === this.$store.state.user.channel
      ) {
        params.isBlackList = '0'
      } else {
        params.isBlackList = ''
      }
      API.custinfo
        .getCustInfoListData(
          Object.assign(
            {
              current: page.currentPage,
              size: page.pageSize
            },
            params
          )
        )
        .then(response => {
          this.list = response.data.data.records
          this.page.total = response.data.data.total
          this.searchBtnStatus = false
          this.resetBtnStatus = false
          this.isUpdate = false
        })
        .catch(() => {
          this.searchBtnStatus = false
          this.resetBtnStatus = false
          this.isUpdate = false
        })
    },
    // 更新表格数据
    updateCustInfoTableList() {
      this.radio = ''
      this.btnStatus = false
      this.rowObj = {}
      this.getCustInfoTableList(this.page, this.searchParams)
    },
    // 查询
    onSearchBtn() {
      // 校验手机号是否正确 TODO
      // if (this.searchParams.mobile && !isMobile(this.searchParams.mobile)) {
      //   this.showMessage('请输入正确的手机号码', 'warning')
      //   return
      // }
      // 查询校验
      this.searchParams.avaScoreMin = this.searchParams.avaScoreMin.replace(
        /[, ]/g,
        ''
      )
      this.searchParams.avaScoreMax = this.searchParams.avaScoreMax.replace(
        /[, ]/g,
        ''
      )
      if (
        (this.searchParams.avaScoreMin &&
          !/^[0-9]+?$/.test(this.searchParams.avaScoreMin)) ||
        (this.searchParams.avaScoreMax &&
          !/^[0-9]+?$/.test(this.searchParams.avaScoreMax))
      ) {
        this.showMessage('积分区间需输入非负整数', 'warning')
        this.searchBtnStatus = false
        return
      }
      if (
        this.searchParams.avaScoreMin &&
        this.searchParams.avaScoreMax &&
        parseInt(this.searchParams.avaScoreMax) <
          parseInt(this.searchParams.avaScoreMin)
      ) {
        this.showMessage('积分区间上限不可小于下限', 'warning')
        this.searchBtnStatus = false
        return
      }
      this.radio = ''
      this.btnStatus = false
      this.rowObj = {}
      this.searchBtnStatus = true
      this.page.currentPage = 1
      this.removeSpace(this.searchParams)
      this.getCustInfoTableList(this.page, this.searchParams)
    },
    // 查询重置
    onResetBtn() {
      this.radio = ''
      this.btnStatus = false
      this.rowObj = {}
      this.certYc = []
      this.resetBtnStatus = true
      this.searchParams = {
        custNo: '',
        cretType: '',
        custLevel: '',
        custName: '',
        cretNo: '',
        scoreChannel: '',
        avaScoreMin: '',
        avaScoreMax: '',
        frzFlg: '',
        chkStatus: '',
        mobile: '',
        certYc: '',
        certYcNo: undefined // 默认placeHolder 请选择
      }
      this.page.currentPage = 1
      this.getCustInfoTableList(this.page, this.searchParams)
    },
    // 分页
    pageChange(page) {
      this.radio = ''
      this.btnStatus = false
      this.rowObj = {}
      this.page.currentPage = page.page
      this.page.pageSize = page.limit
      this.getCustInfoTableList(this.page, this.searchParams)
    },
    // 表格单选
    onTableSelect(row) {
      this.btnStatus = true
      this.rowObj = row
    },
    // 积分调整、冻结、解冻、移入黑名单、权益详情操作按钮
    handleFuncBtn(btnType) {
      if (!this.btnStatus) {
        this.showMessage('请选择客户！', 'warning')
      } else {
        if (btnType === 'adjust') {
          if (this.rowObj.frzFlg === '1') {
            this.showMessage(
              '调整积分只针对“是否冻结”为“否”的客户！',
              'warning'
            )
          } else {
            this.adjDialogVisible = true
          }
        } else if (btnType === 'frz') {
          this.btnType = 'frz'
          if (
            this.rowObj.frzFlgType &&
            this.rowObj.frzFlgType.split(',').length === 6
          ) {
            this.showMessage('已全部冻结！', 'warning')
          } else {
            this.frzDialogVisible = true
          }
        } else if (btnType === 'unfrz') {
          if (this.rowObj.frzFlg !== '1') {
            this.showMessage(
              '解冻功能只针对“是否冻结”为“是”的客户！',
              'warning'
            )
          } else {
            this.btnType = 'unfrz'
            this.frzDialogVisible = true
          }
        } else if (btnType === 'black') {
          if (this.rowObj.isBlackList === '1') {
            this.showMessage('该客户已是黑名单客户！', 'warning')
          } else {
            this.blackDialogVisible = true
          }
        } else {
          this.detailDialogVisible = true
        }
      }
    },
    // form提交
    handleAdjust(obj) {
      var newObj = Object.assign(obj, {
        applyPerson: this.$store.state.user.name,
        applyEmpNo: this.$store.state.user.id
      })
      API.custinfo
        .postScoreAdjustData(newObj)
        .then(response => {
          this.$refs.adjustChild.noticeBtnStatus = false
          this.$refs.adjustChild.noticeDialogVisible = false
          this.adjDialogVisible = false
          this.showMessage(response.data.msg, 'success')
          this.isUpdate = true
        })
        .catch(response => {
          this.$refs.adjustChild.noticeBtnStatus = false
          this.$refs.adjustChild.noticeDialogVisible = false
          this.showMessage(response.msg, 'warning')
        })
    },
    handleFrz(obj) {
      var newObj = Object.assign(obj, {
        applyPerson: this.$store.state.user.name,
        applyEmpNo: this.$store.state.user.id
      })
      API.custinfo
        .postScoreFrzData(newObj)
        .then(response => {
          this.$refs.frzChild.noticeBtnStatus = false
          this.$refs.frzChild.noticeDialogVisible = false
          this.frzDialogVisible = false
          this.showMessage(response.data.msg, 'success')
          this.isUpdate = true
        })
        .catch(response => {
          this.$refs.frzChild.noticeBtnStatus = false
          this.$refs.frzChild.noticeDialogVisible = false
          this.showMessage(response.msg, 'warning')
        })
    },
    handleBlack(obj) {
      var newObj = Object.assign(obj, {
        applicant: this.$store.state.user.name,
        jobId: this.$store.state.user.id
      })
      API.custinfo
        .postBlackApplyData(newObj)
        .then(response => {
          this.$refs.blackChild.noticeBtnStatus = false
          this.$refs.blackChild.noticeDialogVisible = false
          this.blackDialogVisible = false
          this.showMessage(response.data.msg, 'success')
          this.isUpdate = true
        })
        .catch(response => {
          this.$refs.blackChild.noticeBtnStatus = false
          this.$refs.blackChild.noticeDialogVisible = false
          this.showMessage(response.msg, 'warning')
        })
    },
    showMessage(mes, type) {
      this.$message({
        message: mes,
        type: type
      })
    },
    // 去前后空格
    removeSpace(obj) {
      Object.keys(obj).forEach(key => {
        obj[key] = obj[key] && obj[key].trim()
      })
    }
  },
  mounted() {
    this.main = echarts.init(document.getElementById('main'));
    this.main.setOption({
    title: {
        text: 'ECharts 入门示例'
    },
    tooltip: {},
    xAxis: {
        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
    },
    yAxis: {},
    series: [{
        name: '销量',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
    }]
  });
  },
  created() {
    this.getCustInfoTableList(this.page, this.searchParams)
  },
  watch: {
    isUpdate(value) {
      if (value) {
        this.updateCustInfoTableList()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.custinfo-container {
  background: #ffffff;
  padding: 26px 35px 44px;

  .custinfo-form-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 25px;

    .custinfo-form-itemScore {
      display: flex;
      align-items: center;
      height: 36px;

      .custinfo-form-item-babel {
        width: 70px;
        margin-right: 22px;
      }

      .custinfo-form-item-line {
        margin: 0 16px;
      }

      .el-input {
        width: 106px;
      }
    }

    .custinfo-form-item {
      display: flex;
      align-items: center;

      .custinfo-form-item-babel {
        width: 70px;
      }

      .el-input,
      .el-select {
        width: 248px;
        margin-left: 22px;

        /deep/ .el-input__inner {
          height: 35px;
          line-height: 35px;
        }
      }
    }
  }

  .custinfo-form-rowBtns {
    display: flex;
    justify-content: center;

    .el-button {
      height: 35px;
      display: flex;
      align-items: center;
      padding: 0 20px;

      /deep/ .el-icon-query {
        width: 18px;
        height: 18px;
        background: url(./imgs/search.png) center no-repeat;
        background-size: cover;
      }

      /deep/ .el-icon-reset {
        width: 15px;
        height: 19px;
        background: url(./imgs/reset.png) center no-repeat;
        background-size: cover;
      }
    }
  }

  .custinfo-handelBtns {
    display: flex;
    margin: 23px 0 16px 0;

    .el-button {
      /deep/ .el-icon-adjust {
        width: 16px;
        height: 16px;
        background: url(./imgs/adjust.png) center no-repeat;
        background-size: cover;
      }

      /deep/ .el-icon-frz {
        width: 12px;
        height: 16px;
        background: url(./imgs/frz.png) center no-repeat;
        background-size: cover;
      }

      /deep/ .el-icon-unfrz {
        width: 15px;
        height: 15px;
        background: url(./imgs/unfrz.png) center no-repeat;
        background-size: cover;
      }

      /deep/ .el-icon-black {
        width: 15px;
        height: 15px;
        background: url(./imgs/black.png) center no-repeat;
        background-size: cover;
      }

      /deep/ .el-icon-detail {
        width: 17px;
        height: 16px;
        background: url(./imgs/detail.png) center no-repeat;
        background-size: cover;
      }
    }
  }

  .custinfo-table {
    /deep/ tr {
      height: 52px;
    }

    /deep/ .el-radio__label {
      display: none;
    }
  }
}
</style>
