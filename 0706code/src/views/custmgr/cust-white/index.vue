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
            placeholder="请输入客户号"
            v-model="searchParams.custNo"
            maxlength="20"
          >
          </el-input>
        </div>
        <div class="custinfo-form-item">
          <div class="custinfo-form-item-babel">手机号</div>
          <el-input
            placeholder="请输入手机号"
            v-model="searchParams.mobile"
            maxlength="64"
          >
          </el-input>
        </div>
        <div class="custinfo-form-item">
          <div class="custinfo-form-item-babel">证件号码</div>
          <el-input
            placeholder="请输入证件号码"
            v-model="searchParams.certNo"
            maxlength="128"
          >
          </el-input>
        </div>
      </div>
      <div class="custinfo-form-rowBtns">
        <el-button
          type="primary"
          icon="el-icon-search"
          :loading="searchBtnStatus"
          @click="onSearchBtn"
          >查询</el-button
        >
        <el-button
          icon="el-icon-refresh-right"
          :loading="resetBtnStatus"
          @click="onResetBtn"
          >重置</el-button
        >
      </div>
    </div>
    <el-row class="custinfo-handelBtns cus-button">
      <el-button icon="el-icon-upload" @click="dialogEditVisible = true"
        >导入白名单</el-button
      >
      <el-button icon="el-icon-export" @click="exportData" :loading="loading"
        >导出</el-button
      >
    </el-row>
    <el-table
      class="custinfo-table"
      :data="list"
      style="width: 100%"
      border
      :header-cell-style="{ background: '#FAFAFA', color: '#262626' }"
    >
      <el-table-column prop="custNo" label="ECIF客户号" width="180" align="center">
      </el-table-column>
      <el-table-column prop="mobile" label="手机号" width="180" align="center">
      </el-table-column>
      <el-table-column
        prop="certNo"
        label="证件号码"
        width="180"
        align="center"
      >
      </el-table-column>
      <el-table-column prop="point" label="积分" width="180" align="center">
      </el-table-column>
      <el-table-column
        label="是否要求完成开设直销银行二类户"
        width="180"
        align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.needAccount === '0' ? '否' : '是' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="180" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.isGiven === '0' ? '未发放' : '已发放' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="createEmpNo"
        label="创建人工号"
        width="180"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="createEmpName"
        label="创建人姓名"
        width="180"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="180"
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
    <v-upload
      :dialogEditVisible="dialogEditVisible"
      @cancel="cancel"
    ></v-upload>
  </div>
</template>
<script>
import API from '@/api'
import vPagination from '@/components/pagination/pagination'
import vUpload from './comps/upload'
export default {
  name: 'CustWhite',
  components: {
    vPagination,
    vUpload
  },
  data() {
    return {
      // 查询参数
      searchParams: {
        custNo: '', // 客户号
        mobile: '', // 客户姓名
        cretNo: '' // 证件号码
      },
      btnStatus: false,
      searchBtnStatus: false,
      resetBtnStatus: false,
      dialogEditVisible: false,
      loading: false,
      // 客户信息分页
      page: {
        total: 0, // 总页数
        current: 1, // 当前页数
        size: 10 // 每页显示多少条
      },
      // 客户信息列表
      list: []
    }
  },
  methods: {
    // 请求白名单客户表格数据
    getCustWhiteL(page) {
      API.custwhite
        .getEsDbsWhiteL(
          Object.assign(
            {
              current: page.current,
              size: page.size
            },
            this.searchParams
          )
        )
        .then(response => {
          this.list = response.data.data.records
          this.page.total = response.data.data.total
          this.searchBtnStatus = false
          this.resetBtnStatus = false
        })
        .catch(() => {
          this.searchBtnStatus = false
          this.resetBtnStatus = false
        })
    },
    // 查询
    onSearchBtn() {
      this.btnStatus = false
      this.searchBtnStatus = true
      this.page.current = 1
      this.removeSpace(this.searchParams)
      this.getCustWhiteL(this.page)
    },
    // 查询重置
    onResetBtn() {
      this.btnStatus = false
      this.resetBtnStatus = true
      this.searchParams = {
        custNo: '',
        mobile: '',
        cretNo: ''
      }
      this.page.current = 1
      this.getCustWhiteL(this.page)
    },
    // 分页
    pageChange(page) {
      this.btnStatus = false
      this.page.current = page.page
      this.page.size = page.limit
      this.getCustWhiteL(this.page)
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
        obj[key] = obj[key].trim()
      })
    },
    // 关闭弹框
    cancel() {
      this.dialogEditVisible = false
      this.getCustWhiteL(this.page)
    },
    // 导出数据
    exportData() {
      if (this.page.total > 10000) {
        this.$message.error('一次最多导出10000条，请重新筛选！')
        return
      }
      this.loading = true
      API.custwhite
        .exportEsDbsWhiteList(
          Object.assign(this.searchParams, {
            custNo: this.searchParams.custNo.trim(),
            mobile: this.searchParams.mobile.trim(),
            cretNo: this.searchParams.cretNo.trim(),
            total: this.page.total,
            current: this.page.current,
            size: 10000
          })
        )
        .then(data => {
          this.loading = false
          let blob = new Blob([data.data], {
            type:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          })
          // const blob = new Blob([data.data])
          if (!!window.ActiveXObject || 'ActiveXObject' in window) {
            window.navigator.msSaveOrOpenBlob(blob, '白名单.xlsx')
          } else {
            const a = document.createElement('a')
            a.style.display = 'none'
            a.download = '白名单'
            a.href = window.URL.createObjectURL(blob)
            a.click()
          }
        })
        .catch(() => {
          this.loading = false
          this.$message.error('暂无数据')
        })
    }
  },
  created() {
    this.getCustWhiteL(this.page)
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
    }
  }

  .custinfo-handelBtns {
    display: flex;
    margin: 23px 0 16px 0;

    .el-button {
      /deep/ .el-icon-black {
        width: 15px;
        height: 15px;
        // background: url(./imgs/move.png) center no-repeat;
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
