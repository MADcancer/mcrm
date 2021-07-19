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
          <el-input placeholder="请输入客户号" v-model="searchParams.custNo" maxlength="20">
          </el-input>
        </div>
        <div class="custinfo-form-item">
          <div class="custinfo-form-item-babel">客户姓名</div>
          <el-input placeholder="请输入客户姓名" v-model="searchParams.custName" maxlength="64">
          </el-input>
        </div>
        <div class="custinfo-form-item">
          <div class="custinfo-form-item-babel">证件号码</div>
          <el-input placeholder="请输入证件号码" v-model="searchParams.cretNo" maxlength="128">
          </el-input>
        </div>
      </div>
      <div class="custinfo-form-row">
        <div class="custinfo-form-item">
          <div class="custinfo-form-item-babel">积分渠道</div>
           <el-select v-model="searchParams.scoreChannel" placeholder="">
            <el-option v-for="(item,index) in $root.selectOption.channel" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
      </div>
      <div class="custinfo-form-rowBtns">
        <el-button type="primary" icon="el-icon-query" :loading="searchBtnStatus" @click="onSearchBtn">查询</el-button>
        <el-button icon="el-icon-reset" :loading="resetBtnStatus" @click="onResetBtn">重置</el-button>
      </div>
    </div>
    <el-row class="custinfo-handelBtns cus-button">
      <el-button v-if="isAuth('sys:custblack:outblack')" icon="el-icon-black" @click="handleFuncBtn" :disabled="buttonDisabled">移出黑名单</el-button>
    </el-row>
    <el-table class="custinfo-table" :data="list" style="width: 100%" border :header-cell-style="{background:'#FAFAFA',color:'#262626'}">
      <el-table-column label="选择" width="60" fixed align="center">
        <template slot-scope="scope">
          <el-radio v-model="radio" :label="scope.$index" @change="onTableSelect(scope.row)">&nbsp;</el-radio>
        </template>
      </el-table-column>
      <el-table-column prop="custNo" label="客户号" width="180" align="center">
      </el-table-column>
      <el-table-column prop="custName" label="客户姓名" width="180" align="center">
      </el-table-column>
      <el-table-column prop="cretNo" label="证件号码" width="180" align="center">
      </el-table-column>
      <el-table-column prop="scoreChannel" label="积分渠道" align="center">
        <template slot-scope="scope">
          <span>{{ $root.selectOption.channelObj[scope.row.scoreChannel] }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="custScore" label="可用积分" align="center">
      </el-table-column>
    </el-table>
    <v-pagination :total="page.total" :currentPageNum='page.currentPage' :currentPageSize='page.pageSize' @pageChange="pageChange"></v-pagination>
    <black-form ref="blackChild" :custNo="rowObj.custNo" :custName="rowObj.custName" :scoreChannel="rowObj.scoreChannel" :dialogVisible="blackDialogVisible"
      @onCancel="blackDialogVisible = false" @handleBlack="handleBlack"></black-form>
  </div>
</template>
<script>
  import API from '@/api'
  import vPagination from '@/components/pagination/pagination'
  import blackForm from './components/black-form'
  export default {
    name: 'CustBlack',
    components: {
      vPagination,
      blackForm
    },
    data() {
      return {
        // 查询参数
        searchParams: {
          custNo: '', // 客户号
          custName: '', // 客户姓名
          scoreChannel: '',
          cretNo: '' // 证件号码
        },
        rowObj: {},
        blackDialogVisible: false,
        btnStatus: false,
        searchBtnStatus: false,
        resetBtnStatus: false,
        radio: '',
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
        return this.rowObj.scoreChannel && (this.rowObj.scoreChannel !== this.$store.state.user.channel)
      }
    },
    methods: {
      // 请求黑名单客户表格数据
      getCustBlackList(page) {
        API.custblack.getCustBlackListData(Object.assign({
          current: page.currentPage,
          size: page.pageSize
        }, this.searchParams)).then(response => {
          this.list = response.data.data.records
          this.page.total = response.data.data.total
          this.searchBtnStatus = false
          this.resetBtnStatus = false
        }).catch(() => {
          this.searchBtnStatus = false
          this.resetBtnStatus = false
        })
      },
      // 更新表格数据
      updateCustBlackTableList() {
        this.radio = ''
        this.btnStatus = false
        this.rowObj = {}
        this.getCustBlackList(this.page)
      },
      // 查询
      onSearchBtn() {
        this.radio = ''
        this.btnStatus = false
        this.rowObj = {}
        this.searchBtnStatus = true
        this.page.currentPage = 1
        this.removeSpace(this.searchParams)
        this.getCustBlackList(this.page)
      },
      // 查询重置
      onResetBtn() {
        this.radio = ''
        this.btnStatus = false
        this.rowObj = {}
        this.resetBtnStatus = true
        this.searchParams = {
          custNo: '',
          custName: '',
          cretNo: '',
          scoreChannel: ''
        }
        this.page.currentPage = 1
        this.getCustBlackList(this.page)
      },
      // 分页
      pageChange(page) {
        this.radio = ''
        this.btnStatus = false
        this.rowObj = {}
        this.page.currentPage = page.page
        this.page.pageSize = page.limit
        this.getCustBlackList(this.page)
      },
      // 表格单选
      onTableSelect(row) {
        this.btnStatus = true
        this.rowObj = row
      },
      // 移出黑名单按钮
      handleFuncBtn() {
        if (!this.btnStatus) {
          this.$message({
            message: '请选择客户！',
            type: 'warning'
          })
        } else {
          this.blackDialogVisible = true
        }
      },
      // form提交
      handleBlack(obj) {
        var newObj = Object.assign(obj, {
          jobId: this.$store.state.user.id,
          applicant: this.$store.state.user.name
        })
        API.custinfo.postBlackApplyData(newObj).then(response => {
          this.$refs.blackChild.noticeBtnStatus = false
          this.$refs.blackChild.noticeDialogVisible = false
          this.blackDialogVisible = false
          this.showMessage(response.data.msg, 'success')
          this.updateCustBlackTableList()
        }).catch(response => {
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
        Object.keys(obj).forEach((key) => {
          obj[key] = obj[key].trim()
        })
      }
    },
    created() {
      this.getCustBlackList(this.page)
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
          width: 56px;
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
          width: 56px;
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
        // height: 35px;
        // display: flex;
        // align-items: center;
        // padding: 0 20px;
        // color: #80A639;
        // border-color: #80A639;

        /deep/ .el-icon-black {
          width: 15px;
          height: 15px;
          background: url(./imgs/move.png) center no-repeat;
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
