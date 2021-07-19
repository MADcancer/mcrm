<template>
  <div class="pipeline-search">
    <div class="search">
      <div>
        <div>
          <span>客户号</span>
          <el-input
            v-model="searchParams.custNo"
            placeholder="请输入客户号"
            clearable
          />
        </div>
        <div>
          <span>客户姓名</span>
          <el-input
            v-model="searchParams.custName"
            placeholder="请输入客户姓名"
            clearable
          />
        </div>
        <div>
          <span>证件号码</span>
          <el-input
            v-model="searchParams.certNo"
            placeholder="请输入证件号码"
            clearable
          />
        </div>
      </div>
      <div>
        <div>
          <span>起止时间</span>
          <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy/MM/dd"
            value-format="yyyy/MM/dd"
            :picker-options="pickerOptions"
            :editable="false"
          >
          </el-date-picker>
        </div>
        <div>
          <span>积分类型</span>
          <el-select v-model="searchParams.pointsType" placeholder=""  @change="typeChange">
            <el-option label="请选择" value=""></el-option>
            <el-option v-for="(item, index) in $root.selectOption.pointsType" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <div>
          <span>积分细类</span>
          <el-select v-model="searchParams.pointsSubType" placeholder="">
            <el-option label="请选择" value=""></el-option>
            <el-option v-for="(item, index) in pointsSubTypes" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
      </div>
      <div>
        <div>
          <span>积分渠道</span>
          <el-select v-model="searchParams.scoreChannel" placeholder="">
            <el-option v-for="(item,index) in $root.selectOption.channel" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <div>
          <span>手机号</span>
          <el-input
            placeholder="请输入手机号"
            v-model="searchParams.mobile"
            maxlength="11"
          >
          </el-input>
        </div>
        <div>
          <span>交易流水号</span>
          <el-input
            placeholder="请输入交易流水号"
            v-model="searchParams.dealNo"
          >
          </el-input>
        </div>
      </div>
      <div class="button">
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="search"
          :loading="searchLoading"
          >查询</el-button
        >
        <el-button icon="el-icon-refresh-right" :loading="resetLoading" @click="reset">重置</el-button>
      </div>
    </div>
    <div class="result">
      <div class="cus-button" style="margin-bottom: 14px">
        <el-button v-if="isAuth('sys:score:export')" icon="el-icon-export" :disabled="searchParams.scoreChannel !== $store.state.user.channel" @click="exportData" :loading="exportLoading">导出</el-button>
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
          label="客户号"
          prop="custNo"
          width="120"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="custName"
          label="客户姓名"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="certNo"
          label="证件号码"
          width="180"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="手机号"
          width="180"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="scoreChannel"
          label="积分渠道"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            {{ $root.selectOption.channelObj[scope.row.scoreChannel] }}
          </template>
        </el-table-column>
        <el-table-column
          prop="points"
          label="积分"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          label="积分类型"
          prop="pointsType"
          header-align="center"
          width="120"
          align="center"
        >
        </el-table-column>
        <el-table-column
          label="积分细类"
          prop="pointsSubType"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="pointsDate"
          label="积分日期"
          width="140"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="expireDate"
          label="过期时间"
          width="180"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="expireMark"
          label="过期标示"
          width="120"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="dealNo"
          label="交易流水号"
          width="180"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="transDesc"
          label="交易描述"
          width="120"
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
  </div>
</template>

<script>
import vPagination from '@/components/pagination/pagination'
import API from '@/api'
export default {
  props: {
    name: {
      type: String
    }
  },
  components: { vPagination },
  watch: {
    name(value) {
      if (value === 'pipeline') {
        this.getDatas(1)
      }
    }
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          let date = new Date()
          date.setMonth(date.getMonth() - 13)
          // return time.getFullYear() < date.getFullYear() ||
          // (time.getFullYear() === date.getFullYear() && time.getMonth() < date.getMonth())
          date.setDate(date.getDate() - 1)
          return time.getTime() < date.getTime() || time.getTime() > new Date()
        }
      },
      searchParams: {
        custNo: '',
        custName: '',
        certNo: '',
        scoreChannel: '',
        pointsType: '',
        pointsSubType: '',
        pointsDateMax: '',
        pointsDateMin: '',
        mobile: '',
        dealNo: ''
      },
      date: [],
      datas: [],
      page: {
        total: 0,
        current: 1,
        size: 10
      },
      searchLoading: false,
      resetLoading: false,
      exportLoading: false,
      scoreChannel: ['', '财富', '直销', '信用卡'],
      pointsSubTypes: []
    }
  },

  methods: {
    typeChange() {
      this.pointsSubTypes = this.searchParams.pointsType
      ? (this.searchParams.pointsType === '6'
      ? this.$root.selectOption.dbsPointsSubType
      : this.searchParams.pointsType === '7'
      ? this.$root.selectOption.nbsPointsSubType
      : this.$root.selectOption.pointsSubType)
      : []
    },
    // 分页
    pageChange(val) {
      this.page.current = val.page
      this.page.size = val.limit
      this.getDatas()
    },

    setParams() {
      let params = Object.assign(this.searchParams, this.page)
      return Object.assign(params, {
        custNo: params.custNo.trim(),
        custName: params.custName.trim(),
        certNo: params.certNo.trim(),
        pointsDateMin: this.date && this.date.length > 0 ? this.date[0] : '',
        pointsDateMax: this.date && this.date.length > 0 ? this.date[1] : '',
        mobile: params.mobile && params.mobile.trim(),
        dealNo: params.dealNo && params.dealNo.trim()
      })
    },
    setReportParams() {
      return Object.assign(this.searchParams, {
        custNo: this.searchParams.custNo.trim(),
        custName: this.searchParams.custName.trim(),
        certNo: this.searchParams.certNo.trim(),
        pointsDateMin: this.date && this.date.length > 0 ? this.date[0] : '',
        pointsDateMax: this.date && this.date.length > 0 ? this.date[1] : '',
        mobile: this.searchParams.mobile && this.searchParams.mobile.trim(),
        dealNo: this.searchParams.dealNo && this.searchParams.dealNo.trim(),
        total: this.page.total,
        current: this.page.current,
        size: 10000
      })
    },

    // 搜索
    search() {
      this.searchLoading = true
      this.getDatas(1)
    },

    // 获取数据
    getDatas(current = this.page.current) {
      this.page.current = current
      let params = this.setParams()
      API.scoresearch.getCustPointsAccount(params).then(res => {
        this.datas = res.data.data.records
        this.page.total = res.data.data.total
        this.resetLoading = false
        this.searchLoading = false
      }).catch(() => {
        this.resetLoading = false
        this.searchLoading = false
      })
    },
    reset() {
      // 清空数据
      this.searchParams = {
        custNo: '',
        custName: '',
        certNo: '',
        scoreChannel: '',
        pointsType: '',
        pointsSubType: '',
        pointsDateMax: '',
        pointsDateMin: '',
        mobile: '',
        dealNo: ''
      }
      this.date = []
      this.resetLoading = true
      this.getDatas(1)
    },
    exportData() {
      if (this.page.total > 10000) {
        this.$message.error('一次最多导出10000条，请重新筛选！')
        return
      }
      this.exportLoading = true
      let params = this.setReportParams()
      API.scoresearch.exportCustPointsAccount(params).then(data => {
        this.exportLoading = false
        // const blob = new Blob([data.data])
        let blob = new Blob([data.data], {
          type:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })
        if (!!window.ActiveXObject || 'ActiveXObject' in window) {
          window.navigator.msSaveOrOpenBlob(blob, '客户积分流水.xlsx')
        } else {
          const a = document.createElement('a')
          a.style.display = 'none'
          a.download = '客户积分流水.xlsx'
          a.href = window.URL.createObjectURL(blob)
          a.click()
        }
      })
      .catch(() => {
        this.exportLoading = false
        this.$message.error('暂无数据')
      })
    }
  },

  created() {
    this.getDatas()
  }
}
</script>

<style lang="scss" scoped>
.pipeline-search {
  .search {
    > div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 25px;
      span {
        width: 70px;
        display: inline-block;
        margin-right: 2px;
      }
    }
    /deep/ .el-input {
      width: 240px;
      input {
        padding: 0 15px;
      }
    }
    /deep/ .el-range-editor.el-input__inner {
      width: 240px;
    }
    /deep/ .el-input--medium .el-input__inner {
      height: 34px;
      line-height: 34px;
    }
    /deep/ .el-range-editor--medium .el-range-separator {
      width: 20px;
    }
    /deep/ .el-date-editor .el-range-separator {
      width: 10%;
    }
    .button {
      margin-top: 31px;
      margin-bottom: 24px;
      justify-content: center;
    }
  }
}
</style>
