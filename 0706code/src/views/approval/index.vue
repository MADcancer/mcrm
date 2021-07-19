<template>
</template>

<script>
import vPagination from '@/components/pagination/pagination'
import API from '@/api'
import slide from './comps/slide'
import equityRule from './comps/equity-rule'
import scoreFrz from './comps/score-frz'
import scoreUnfrz from './comps/score-unfrz'
import scoreAdjust from './comps/score-adjust'
import custBlack from './comps/cust-black'
import custGroup from './comps/cust-group'
import actRule from './comps/act-rule'
import buyAct from './comps/buy-act'
import subjectAct from './comps/subject-act'
import lotteryAct from './comps/lottery-act'
import voteAct from './comps/vote-act'
import dbsMgr from './comps/dbs-mgr'
import dbsFinr from './comps/dbs-finr'
import newLottery from './comps/new-lottery'
import orderCancel from './comps/order-cancel'
export default {
  components: {
    vPagination,
    slide,
    equityRule,
    scoreFrz,
    scoreUnfrz,
    scoreAdjust,
    custBlack,
    custGroup,
    actRule,
    buyAct,
    subjectAct,
    lotteryAct,
    voteAct,
    dbsMgr,
    dbsFinr,
    newLottery,
    orderCancel
  },
  data() {
    return {
      searchParams: {
        applyEmpNo: this.$store.state.user.roleId.toString().indexOf('03') !== -1 ? '' : this.$store.state.user.id.toString(),
        applyEmpName: this.$store.state.user.roleId.toString().indexOf('03') !== -1 ? '' : this.$store.state.user.name.toString(),
        businessType: '',
        applyDate: '',
        approveStatus: []
      },
      businessType: [
        '积分冻结',
        '积分解冻',
        '积分调整',
        '客户组管理',
        '黑名单管理',
        '权益规则管理',
        '权益活动管理',
        '抽奖活动管理',
        '抢购活动管理',
        '轮播图管理',
        '主题活动管理',
        '票选活动管理',
        '积分达标条件',
        '理财达标条件',
        '奖池活动管理',
        '订单取消'
      ],
      applyType: [
        '',
        '积分冻结',
        '积分解冻',
        '积分调增',
        '积分调减',
        '移入黑名单',
        '移出黑名单',
        '新增',
        '修改',
        '删除'
      ],
      approveStatus: ['', '待审批', '', '同意', '驳回'],
      datas: [],
      page: {
        total: 0,
        page: 1,
        limit: 10
      },
      radio: '',
      searchLoading: false,
      resetLoading: false,
      backLoading: false,
      // 与businessType一一对应 es6
      editDialog: Array(15).fill(false),
      dialogBackVisible: false,
      currentData: {}, // 单选按钮选择的数据
      currentInfo: {}, // 查看详情的数据
      info: {},
      type: ''
    }
  },
  computed: {
    // 权益规则、权益活动 、抽奖活动 、抢购活动 、轮播图 、票选活动 待审批状态 都可以撤回
    backButtonDisabled() {
      return (
        (['6', '7', '8', '9', '10', '11', '12'].indexOf(this.currentData.businessType) !==
          -1 &&
          this.currentData.approveStatus === '1') ||
        this.currentData.businessType === undefined
      )
    },

    editDialogDisabled() {
      return (
        this.currentData.approveStatus !== '1' &&
        this.currentData.approveStatus !== undefined
      )
    },

    // 是否是管理员
    isAdmin() {
      return this.$store.state.user.roleId.toString().indexOf('03') !== -1
    }
  },
  watch: {
    $route: {
      handler() {
        if (this.$route.name === 'approval') {
          this.loadData()
        }
      },
      deep: true
    }
  },
  methods: {
    loadData() {
      if (this.$route.query.approveStatus) {
        this.searchParams.approveStatus = this.$route.query.approveStatus.split(',')
      }
      if (this.$route.query.businessType) {
        this.searchParams.businessType = Number(this.$route.query.businessType)
      }
      this.getDatas(1)
    },
    // 分页
    pageChange(val) {
      this.radio = ''
      this.currentData = {}
      this.page.page = val.page
      this.page.limit = val.limit
      this.getDatas()
    },

    // 获取列表
    search() {
      this.searchLoading = true
      this.radio = ''
      this.currentData = {}
      this.getDatas(1)
    },
    // 搜索
    getDatas(page = this.page.page) {
      this.page.page = page
      let params = Object.assign(this.page, this.searchParams)
      API.home
        .qryCustList(
          Object.assign(params, {
            applyEmpNo: params.applyEmpNo.trim(),
            applyEmpName: params.applyEmpName.trim(),
            approveStatus: params.approveStatus ? params.approveStatus.join(',') : '',
            empNo: this.$store.state.user.id,
            empName: this.$store.state.user.name,
            channel: this.$store.state.user.channel,
            roleId: this.$store.state.user.roleId
          })
        )
        .then(res => {
          this.page.total = res.data.data.totalCount
          this.resetLoading = false
          this.searchLoading = false
          if (res.data.data.list.length === 0 && this.page.page !== 1) {
            --this.page.page
            this.getDatas()
          } else {
            this.datas = res.data.data.list
          }
        })
        .catch(() => {
          this.resetLoading = false
          this.searchLoading = false
        })
    },
    reset() {
      // 清空数据
      this.searchParams = {
        applyEmpNo: this.isAdmin ? '' : this.$store.state.user.id.toString(),
        applyEmpName: this.isAdmin ? '' : this.$store.state.user.name.toString(),
        businessType: '',
        applyDate: '',
        approveStatus: []
      }
      this.radio = ''
      this.currentData = {}
      this.resetLoading = true
      this.getDatas(1)
    },
    // 查看详情
    getInfo(row) {
      this.currentInfo = row
      this.showdialog('detail')
    },
    getCurrent(row) {
      this.currentData = row
    },
    // 打开弹框
    showdialog(type) {
      this.type = type
      // 查看详情的展示数据
      this.info = type === 'detail' ? this.currentInfo : this.currentData
      if (this.getCurrentRow()) {
        return
      }
      switch (type) {
        case 'edit':
          this.$set(this.editDialog, this.info.businessType, true)
          break
        case 'back':
          this.dialogBackVisible = true
          break
        case 'info':
          this.$set(this.editDialog, this.info.businessType, true)
          break
        case 'detail':
          this.$set(this.editDialog, this.info.businessType, true)
          break
        default:
      }
    },
    // 必须选择一条数据进行操作
    getCurrentRow() {
      if (this.radio === '' && this.type !== 'detail') {
        this.$message.info('请选择一条数据进行操作')
        return true
      } else {
        return false
      }
    },
    // 关闭弹框
    closeDialog(val) {
      this.$set(this.editDialog, val.idx, false)
      this.radio = ''
      this.currentData = {}
      this.getDatas()
    },
    // 撤回申请
    comfirmback() {
      this.backLoading = true
      let params = {
        approveId: this.currentData.id,
        modifyEmpNo: this.$store.state.user.id,
        modifyEmpName: this.$store.state.user.name
      }
      API.home
        .withdrawApply(params)
        .then(() => {
          this.backLoading = false
          this.dialogBackVisible = false
          this.radio = ''
          this.currentData = {}
          this.getDatas()
          this.$message.success('操作成功！')
        })
        .catch(error => {
          this.$message.error(error.msg)
          this.backLoading = false
        })
    }
  },

  created() {
    this.editDialog.unshift('')
    this.loadData()
  }
}
</script>

<style lang="scss" scoped>
.approval {
  .search {
    > div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 25px;
      span {
        width: 70px;
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
    /deep/ .el-icon-handle {
      background: url(~@/assets/img/handle-logo.png) center no-repeat;
    }
    /deep/ .el-icon-custback {
      background: url(~@/assets/img/back-logo.png) center no-repeat;
    }
    /deep/ .el-icon-custinfo {
      background: url(~@/assets/img/custinfo-logo.png) center no-repeat;
    }
    /deep/ .el-icon-handle,
    /deep/ .el-icon-custback,
    /deep/ .el-icon-custinfo {
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
