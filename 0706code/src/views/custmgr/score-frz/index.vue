<!--
  ~
  ~  Copyright (c) 2018-2025, Pactera JinXin Software All rights reserved.
  ~
  -->
<template>
  <div :class="['custinfo-container', loaded ? 'contentHeight' : '']">
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
            end-placeholder="结束日期" value-format="yyyy/MM/dd" :editable="false">
          </el-date-picker>
        </div>
        <div style="width: 326px;"></div>
      </div>
      <div class="custinfo-form-rowBtns">
        <el-button type="primary" icon="el-icon-query" :loading="searchBtnStatus" @click="onSearchBtn">查询</el-button>
        <el-button icon="el-icon-reset" :loading="resetBtnStatus" @click="onResetBtn">重置</el-button>
      </div>
    </div>
    <el-table class="custinfo-table" :data="list" style="width: 100%" border ref="table" :header-cell-style="{background:'#FAFAFA',color:'#262626'}">
      <el-table-column prop="custNo" label="客户号" width="180" align="center">
      </el-table-column>
      <el-table-column prop="custName" label="客户姓名" width="180" align="center">
      </el-table-column>
      <el-table-column prop="cretNo" label="证件号码" width="180" align="center">
      </el-table-column>
      <el-table-column prop="frzFlg" label="冻结标志" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.frzFlg === '1'">冻结</span>
          <span v-if="scope.row.frzFlg !== '1'">解冻</span>
        </template>
      </el-table-column>
      <el-table-column prop="frzFlgType" label="冻结类别" align="center" width="250">
        <template slot-scope="scope">
          <span>{{numToType(scope.row.frzFlgType)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="scoreChannel" label="积分渠道" align="center">
        <template slot-scope="scope">
          <span>{{ $root.selectOption.channelObj[scope.row.scoreChannel] }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="datadate" label="日期" width="150" align="center">
      </el-table-column>
      <el-table-column prop="reason" label="原因" width="180" align="center">
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
    name: 'ScoreFrz',
    components: {
      vPagination
    },
    data() {
      return {
        // 查询参数
        searchParams: {
          custNo: '', // 客户号
          date: [], // 起止日期
          custName: '', // 客户姓名
          cretNo: '', // 证件号码
          scoreChannel: '' // 积分渠道
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
        list: [],
        loaded: false
      }
    },
    methods: {
      // 请求客户积分冻结解冻表格数据
      getCustFrzHisList(page) {
        var params = {
          custNo: this.searchParams.custNo,
          datadateMin: this.searchParams.date.length > 0 ? this.searchParams.date[0] : '',
          datadateMax: this.searchParams.date.length > 0 ? this.searchParams.date[1] : '',
          custName: this.searchParams.custName,
          cretNo: this.searchParams.cretNo,
          scoreChannel: this.searchParams.scoreChannel
        }
        API.scorefrz.getCustScoreFrzHisData(Object.assign({
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
        this.getCustFrzHisList(this.page)
      },
      // 查询重置
      onResetBtn() {
        this.resetBtnStatus = true
        this.searchParams = {
          custNo: '',
          date: [],
          custName: '',
          cretNo: '',
          scoreChannel: ''
        }
        this.page.currentPage = 1
        this.getCustFrzHisList(this.page)
      },
      // 分页
      pageChange(page) {
        this.page.currentPage = page.page
        this.page.pageSize = page.limit
        this.getCustFrzHisList(this.page)
      },
      // 去前后空格
      removeSpace(obj) {
        Object.keys(obj).forEach((key) => {
          if (key !== 'date') {
            obj[key] = obj[key].trim()
          }
        })
      },
      // 冻结类别转换
      numToType(val) {
        if (val) {
          var valArr = val.split(',')
          var typeArr = ['金融资产', '新客奖励', '基金定投', '绑定快捷支付', '代发工资', '代收业务']
          var newArr = []
          for (var i = 1; i <= typeArr.length; i++) {
            if (valArr.includes(String(i))) {
              newArr.push(typeArr[i - 1])
            }
          }
          return newArr.join('，')
        }
      }
    },
    mounted() {
      this.getCustFrzHisList(this.page)

      // 获取需要绑定的table
      this.dom = this.$refs.table.bodyWrapper
      this.dom.addEventListener('scroll', () => {
        console.log(this.dom.scrollLeft)
        if (this.dom.scrollLeft > 0 && this.dom.scrollLeft < 100 && !this.loaded) {
          this.loaded = true
        }

        if (this.dom.scrollLeft > 260 && this.loaded) {
          console.log(this.loaded)
          this.loaded = false
        }
      })
    }
  }
</script>
<style lang="scss" scoped>
  .contentHeight {
    // height: 1800px;
    // transform: scale(1.1, 1.1)
    /deep/ table {
      display: block;
    }
  }
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
