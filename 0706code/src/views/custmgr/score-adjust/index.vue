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
          <el-select v-model="searchParams.scoreChannel" placeholder="请选择">
            <el-option
              v-for="item in $root.selectOption.channel"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="custinfo-form-item">
          <div class="custinfo-form-item-babel">起止时间</div>
          <el-date-picker v-model="searchParams.date" type="daterange" range-separator="-" start-placeholder="开始日期"
            end-placeholder="结束日期" value-format="yyyy/MM/dd" :editable="false" :picker-options="pickerOptions">
          </el-date-picker>
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
      </div>
      <div class="custinfo-form-rowBtns">
        <el-button type="primary" icon="el-icon-query" :loading="searchBtnStatus" @click="onSearchBtn">查询</el-button>
        <el-button icon="el-icon-reset" :loading="resetBtnStatus" @click="onResetBtn">重置</el-button>
      </div>
    </div>
    <el-table class="custinfo-table" :data="list" style="width: 100%" border :header-cell-style="{background:'#FAFAFA',color:'#262626'}">
      <el-table-column prop="custNo" label="客户号" width="180" align="center">
      </el-table-column>
      <el-table-column prop="custName" label="客户姓名" width="180" align="center">
      </el-table-column>
      <el-table-column prop="cretNo" label="证件号码"  width="180" align="center">
      </el-table-column>
      <el-table-column prop="mobile" label="手机号"  width="180" align="center">
      </el-table-column>
      <el-table-column prop="adjDate" label="调整日期" width="150" align="center">
      </el-table-column>
      <el-table-column prop="custScore" label="客户积分" align="center">
      </el-table-column>
      <el-table-column prop="scoreChannel" label="积分渠道" align="center">
        <template slot-scope="scope">
          <span>{{ $root.selectOption.channelObj[scope.row.scoreChannel] }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="adjType" label="调整方向" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.adjType=== '1'">调增</span>
          <span v-if="scope.row.adjType=== '2'">调减</span>
        </template>
      </el-table-column>
      <el-table-column prop="adjValue" label="调整分值" align="center">
      </el-table-column>
      <el-table-column prop="adjRea" label="调整原因" align="center">
      </el-table-column>
      <el-table-column prop="applyPerson" label="申请人" align="center">
      </el-table-column>
      <el-table-column prop="applyEmpNo" label="申请人工号" width="100" align="center">
      </el-table-column>
      <el-table-column prop="approvePerson" label="审批人" align="center">
      </el-table-column>
      <el-table-column prop="approveEmpNo" label="审批人工号" width="100" align="center">
      </el-table-column>
    </el-table>
    <v-pagination :total="page.total" :currentPageNum='page.currentPage' :currentPageSize='page.pageSize' @pageChange="pageChange"></v-pagination>
  </div>
</template>
<script>
  import API from '@/api'
  import vPagination from '@/components/pagination/pagination'
  export default {
    name: 'ScoreAdjust',
    components: {
      vPagination
    },
    data() {
      return {
        pickerOptions: {
          disabledDate(time) {
            let date = new Date()
            date.setMonth(date.getMonth() - 13)
            date.setDate(date.getDate() - 1)
            return time.getTime() < date.getTime() || time.getTime() > new Date()
          }
        },
        // 查询参数
        searchParams: {
          custNo: '', // 客户号
          date: [], // 起止日期
          custName: '', // 客户姓名
          cretNo: '', // 证件号码
          scoreChannel: '', // 积分渠道
          mobile: ''
        },
        searchBtnStatus: false,
        resetBtnStatus: false,
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
    methods: {
      // 请求积分调整历史表格数据
      getCustScoreHisList(page) {
        var params = {
          custNo: this.searchParams.custNo,
          adjDateMin: this.searchParams.date.length > 0 ? this.searchParams.date[0] : '',
          adjDateMax: this.searchParams.date.length > 0 ? this.searchParams.date[1] : '',
          custName: this.searchParams.custName,
          mobile: this.searchParams.mobile,
          cretNo: this.searchParams.cretNo,
          scoreChannel: this.searchParams.scoreChannel
        }
        API.scoreadjust.getCustScoreHisData(Object.assign({
          current: page.currentPage,
          size: page.pageSize
        }, params)).then(response => {
          this.list = response.data.data.records
          this.page.total = response.data.data.total
          this.searchBtnStatus = false
          this.resetBtnStatus = false
        }).catch(() => {
          this.searchBtnStatus = false
          this.resetBtnStatus = false
        })
      },
      // 查询
      onSearchBtn() {
        this.searchBtnStatus = true
        this.page.currentPage = 1
        this.removeSpace(this.searchParams)
        this.getCustScoreHisList(this.page)
      },
      // 查询重置
      onResetBtn() {
        this.resetBtnStatus = true
        this.searchParams = {
          custNo: '',
          date: [],
          custName: '',
          mobile: '',
          cretNo: '',
          scoreChannel: ''
        }
        this.page.currentPage = 1
        this.getCustScoreHisList(this.page)
      },
      // 分页
      pageChange(page) {
        this.page.currentPage = page.page
        this.page.pageSize = page.limit
        this.getCustScoreHisList(this.page)
      },
      // 去前后空格
      removeSpace(obj) {
        Object.keys(obj).forEach((key) => {
          if (key !== 'date') {
            obj[key] = obj[key].trim()
          }
        })
      }
    },
    mounted() {
      this.getCustScoreHisList(this.page)
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
        .el-select,
        .el-date-editor {
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
      margin: 0 0 40px 0;
      padding-top: 9px;

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

    .custinfo-table {
      /deep/ tr {
        height: 52px;
      }
    }
  }
</style>
