<!--
  ~
  ~  Copyright (c) 2018-2025, Pactera JinXin Software All rights reserved.
  ~
  -->
<template>
  <div class="equityrule-container">
    <div class="equityrule-form">
      <div class="equityrule-form-row">
        <div class="equityrule-form-item">
          <div class="equityrule-form-item-babel">规则名称</div>
          <el-input v-model="searchParams.ruleName" placeholder="请输入规则名称" maxlength="50">
          </el-input>
        </div>
        <div class="equityrule-form-item">
          <div class="equityrule-form-item-babel">规则渠道</div>
          <el-select v-model="searchParams.ruleChannel" placeholder="请选择">
            <el-option v-for="(item,index) in $root.selectOption.channel" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <div class="equityrule-form-item">
          <div class="equityrule-form-item-babel">规则状态</div>
          <el-select v-model="searchParams.ruleStatus" placeholder="请选择">
            <el-option v-for="item in ruleStatusOptions" :key="item.key" :label="item.name" :value="item.key" />
          </el-select>
        </div>
      </div>
      <div class="equityrule-form-rowBtns">
        <el-button type="primary" icon="el-icon-query" :loading="searchStatus" @click="onSearchBtn">查询</el-button>
        <el-button icon="el-icon-reset" :loading="resetStatus" @click="onResetBtn">重置</el-button>
      </div>
    </div>
    <el-row class="equityrule-handelBtns cus-button">
      <el-button v-if="isAuth('sys:equityrule:create')" icon="el-icon-cj" @click="handleFuncBtn('add')">创建</el-button>
      <el-button v-if="isAuth('sys:equityrule:update')" icon="el-icon-xg" :disabled="buttonDisabled" @click="handleFuncBtn('edit')">修改</el-button>
      <el-button v-if="isAuth('sys:equityrule:delete')" icon="el-icon-sc" :disabled="buttonDisabled" @click="handleFuncBtn('delete')">删除</el-button>
    </el-row>
    <el-table class="equityrule-table" :data="list" style="width: 100%" border :header-cell-style="{background:'#FAFAFA',color:'#262626'}">
      <el-table-column label="选择" fixed width="60" align="center">
        <template slot-scope="scope">
          <el-radio v-model="radio" :label="scope.$index" @change="onTableSelect(scope.row)">&nbsp;</el-radio>
        </template>
      </el-table-column>
      <el-table-column prop="ruleName" label="规则名称" width="180" align="center">
        <template slot-scope="{row}">
          <span class="equityrule-table-name" @click="handleDetail(row.ruleId)">{{ row.ruleName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ruleChannel" label="规则渠道" align="center">
        <template slot-scope="{row}">
          <!-- <span>{{ row.ruleChannel | channelFilter }}</span> -->
          <span>{{ $root.selectOption.channelObj[row.ruleChannel] }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ruleStatus" label="规则状态" align="center">
        <template slot-scope="{row}">
          <span>{{ row.ruleStatus | ruleFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="160" align="center">
      </el-table-column>
      <el-table-column prop="createEmpNo" label="创建人工号" width="100" align="center">
      </el-table-column>
      <el-table-column prop="createEmpName" label="创建人" align="center">
      </el-table-column>
      <el-table-column prop="modifyTime" label="修改时间" width="160" align="center">
      </el-table-column>
      <el-table-column prop="modifyEmpNo" label="修改人工号" width="100" align="center">
      </el-table-column>
      <el-table-column prop="modifyEmpName" label="修改人" align="center">
      </el-table-column>
      <el-table-column prop="approveEmpNo" label="审批人工号" width="100" align="center">
      </el-table-column>
      <el-table-column prop="approvePerson" label="审批人" align="center">
      </el-table-column>
    </el-table>
    <v-pagination :total="page.total" :currentPageNum='page.currentPage' :currentPageSize='page.pageSize' @pageChange="pageChange"></v-pagination>
    <add-form ref="addChild" :type="btnType" :ruleId="ruleId" :dialogVisible="addDialogVisible" @onCancel="addDialogVisible = false"
      @handleConfirm="handleConfirm"></add-form>
    <el-dialog class="notice-dialog" title="提示" :visible.sync="noticeDialogVisible" width="360px" append-to-body>
      <span>是否确认删除此权益规则？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="submitStatus" @click="handleConfirm">确 认</el-button>
        <el-button :disabled="submitStatus" @click="noticeDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import API from '@/api'
  import vPagination from '@/components/pagination/pagination'
  import addForm from './components/add-form'
  const ruleChannelOptions = [{
    key: '',
    name: '请选择'
  }, {
    key: '1',
    name: '财富'
  }, {
    key: '2',
    name: '直销'
  }, {
    key: '3',
    name: '信用卡'
  }]
  const ruleStatusOptions = [{
    key: '',
    name: '请选择'
  }, {
    key: '1',
    name: '草稿'
  }, {
    key: '2',
    name: '同意'
  }, {
    key: '5',
    name: '待审批'
  }, {
    key: '6',
    name: '驳回'
  }]
  const ruleChannelKeyValue = ruleChannelOptions.reduce((acc, cur) => {
    acc[cur.key] = cur.name
    return acc
  }, {})
  const ruleStatusKeyValue = ruleStatusOptions.reduce((acc, cur) => {
    acc[cur.key] = cur.name
    return acc
  }, {})
  export default {
    name: 'EquityRule',
    components: {
      vPagination,
      addForm
    },
    filters: {
      channelFilter(num) {
        console.log(num)
        return ruleChannelKeyValue[num]
      },
      ruleFilter(num) {
        return ruleStatusKeyValue[num]
      }
    },
    data() {
      return {
        ruleChannelOptions,
        ruleStatusOptions,
        // 查询参数
        searchParams: {
          ruleName: '',
          ruleChannel: '',
          ruleStatus: ''
        },
        searchStatus: false,
        resetStatus: false,
        ruleId: '',
        currentId: '',
        currentStatus: '',
        currentChannel: '',
        currentUser: '',
        addDialogVisible: false,
        noticeDialogVisible: false,
        btnType: '',
        radio: '',
        submitStatus: false,
        isUpdate: false,
        // 客户信息分页
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 10 // 每页显示多少条
        },
        // 客户信息列表
        list: []
      }
    },
    computed: {
      buttonDisabled() {
        return (this.currentChannel !== '' &&
          (this.currentChannel !== this.$store.state.user.channel))
      }
    },
    methods: {
      // 去前后空格
      removeSpace(obj) {
        Object.keys(obj).forEach((key) => {
          obj[key] = obj[key].trim()
        })
      },
      // 请求客户信息表格数据
      getEquityRuleTableList(page, params) {
        API.equityrule.getEquityRuleListData(Object.assign({
          current: page.currentPage,
          size: page.pageSize
        }, params)).then(response => {
          this.list = response.data.data.records
          this.page.total = response.data.data.total
          this.searchStatus = false
          this.resetStatus = false
          this.isUpdate = false
        }).catch(() => {
          this.searchStatus = false
          this.resetStatus = false
          this.isUpdate = false
        })
      },
      // 更新表格数据
      updateEquityRuleTableList() {
        this.radio = ''
        this.ruleId = ''
        this.currentId = ''
        this.currentStatus = ''
        this.currentChannel = ''
        this.currentUser = ''
        this.getEquityRuleTableList(this.page, this.searchParams)
      },
      // 查询
      onSearchBtn() {
        this.radio = ''
        this.ruleId = ''
        this.currentId = ''
        this.currentStatus = ''
        this.currentChannel = ''
        this.currentUser = ''
        this.page.currentPage = 1
        this.searchStatus = true
        this.removeSpace(this.searchParams)
        this.getEquityRuleTableList(this.page, this.searchParams)
      },
      // 查询重置
      onResetBtn() {
        this.radio = ''
        this.ruleId = ''
        this.currentId = ''
        this.currentStatus = ''
        this.currentChannel = ''
        this.currentUser = ''
        this.page.currentPage = 1
        this.resetStatus = true
        this.searchParams = {
          ruleName: '',
          ruleChannel: '',
          ruleStatus: ''
        }
        this.getEquityRuleTableList(this.page)
      },
      // 分页
      pageChange(page) {
        this.radio = ''
        this.ruleId = ''
        this.currentId = ''
        this.currentStatus = ''
        this.currentChannel = ''
        this.currentUser = ''
        this.page.currentPage = page.page
        this.page.pageSize = page.limit
        this.getEquityRuleTableList(this.page, this.searchParams)
      },
      // 表格单选
      onTableSelect(row) {
        this.currentId = row.ruleId
        this.currentStatus = row.ruleStatus
        this.currentChannel = row.ruleChannel
        this.currentUser = row.createEmpNo
      },
      // 创建、修改、删除按钮
      handleFuncBtn(type) {
        if (type === 'add') {
          this.btnType = type
          this.ruleId = ''
          this.addDialogVisible = true
        } else if (type === 'edit') {
          if (!this.currentId) {
            this.showMessage('请选择规则!', 'warning')
          } else {
            if (this.currentStatus === '1' || this.currentStatus === '6') {
              this.ruleId = this.currentId
              this.btnType = type
              this.addDialogVisible = true
            } else {
              this.showMessage('草稿状态和驳回状态的规则可以修改!', 'warning')
            }
          }
        } else {
          if (!this.currentId) {
            this.showMessage('请选择规则!', 'warning')
          } else {
            if (this.currentStatus === '1' || this.currentStatus === '6') {
              this.btnType = type
              this.noticeDialogVisible = true
            } else {
              this.showMessage('草稿状态和驳回状态的规则可以删除!', 'warning')
            }
          }
        }
      },
      handleDetail(id) {
        this.ruleId = id
        this.btnType = 'detail'
        this.addDialogVisible = true
      },
      // form提交
      handleConfirm(obj) {
        var userInfo = {
          createEmpName: this.btnType === 'add' ? this.$store.state.user.name : '',
          createEmpNo: this.btnType === 'add' ? this.$store.state.user.id : '',
          modifyEmpName: this.btnType === 'add' ? '' : this.$store.state.user.name,
          modifyEmpNo: this.btnType === 'add' ? '' : this.$store.state.user.id
        }
        if (this.btnType === 'add' || this.btnType === 'edit') {
          API.equityrule.postSaveEquityRuleData(Object.assign({
            ruleId: this.ruleId
          }, userInfo, obj)).then(response => {
            this.$refs.addChild.btnStatus = false
            this.addDialogVisible = false
            this.showMessage(response.data.msg, 'success')
            this.isUpdate = true
          }).catch(response => {
            this.$refs.addChild.btnStatus = false
            this.showMessage(response.msg, 'warning')
          })
        } else {
          this.submitStatus = true
          API.equityrule.postDelEquityRuleData({
            ruleId: this.currentId,
            modifyEmpName: this.$store.state.user.name,
            modifyEmpNo: this.$store.state.user.id
          }).then(response => {
            this.submitStatus = false
            this.noticeDialogVisible = false
            this.showMessage(response.data.msg, 'success')
            this.isUpdate = true
          }).catch(response => {
            this.submitStatus = false
            this.noticeDialogVisible = false
            this.showMessage(response.msg, 'warning')
          })
        }
      },
      showMessage(mes, type) {
        this.$message({
          message: mes,
          type: type
        })
      }
    },
    created() {
      if (this.$route.query.status) {
        this.searchParams.ruleStatus = this.$route.query.status
        if (this.$route.query.type && this.$route.query.type === 1) {
          this.searchParams.ruleChannel = this.$store.state.user.channel
          this.searchParams.createEmpNo = this.$store.state.user.id
          this.searchParams.createEmpName = this.$store.state.user.name
        }
      }
      this.getEquityRuleTableList(this.page, this.searchParams)
      console.log(this.$root.selectOption)
    },
    watch: {
      isUpdate(value) {
        if (value) {
          this.updateEquityRuleTableList()
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .equityrule-container {
    background: #ffffff;
    padding: 26px 35px 44px;

    .equityrule-form-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 25px;

      .equityrule-form-itemScore {
        display: flex;
        align-items: center;
        height: 36px;

        .equityrule-form-item-babel {
          width: 70px;
          margin-right: 22px;
        }

        .equityrule-form-item-line {
          margin: 0 16px;
        }

        .el-input {
          width: 106px;
        }
      }

      .equityrule-form-item {
        display: flex;
        align-items: center;

        .equityrule-form-item-babel {
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

    .equityrule-form-rowBtns {
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

    .equityrule-handelBtns {
      display: flex;
      margin: 23px 0 16px 0;

      .el-button {
        /deep/ .el-icon-cj {
          width: 16px;
          height: 18px;
          background: url(./imgs/cj.png) center no-repeat;
          background-size: cover;
        }

        /deep/ .el-icon-xg {
          width: 20px;
          height: 20px;
          background: url(./imgs/xg.png) center no-repeat;
          background-size: cover;
        }

        /deep/ .el-icon-sc {
          width: 18px;
          height: 19px;
          background: url(./imgs/sc.png) center no-repeat;
          background-size: cover;
        }
      }
    }

    .equityrule-table {
      /deep/ tr {
        height: 52px;
      }

      /deep/ .el-radio__label {
        display: none;
      }

      .equityrule-table-name {
        color: #80A639;
        cursor: pointer;
      }
    }
  }

  .notice-dialog {
    /deep/ .el-dialog__header {
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      background-color: #80A639;

      .el-dialog__title,
      .el-dialog__close {
        color: #ffffff
      }
    }

    /deep/ .el-dialog__body {
      font-size: 20px;
      color: #000000;
    }
  }
</style>
