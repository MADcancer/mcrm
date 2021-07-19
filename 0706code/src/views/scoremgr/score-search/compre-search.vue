<template>
  <div :class="['compre-search', loaded ? 'contentHeight' : '']" class="compre-search">
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
          <span>客户等级</span>
          <el-select v-model="searchParams.custLevel" placeholder="">
            <el-option label="请选择" value=""></el-option>
            <el-option label="零星" value="0"></el-option>
            <el-option label="一星" value="1"></el-option>
            <el-option label="二星" value="2"></el-option>
            <el-option label="三星" value="3"></el-option>
            <el-option label="四星" value="4"></el-option>
            <el-option label="五星" value="5"></el-option>
            <el-option label="六星" value="6"></el-option>
          </el-select>
        </div>
        <div>
          <span>积分渠道</span>
          <el-select v-model="searchParams.scoreChannel" placeholder="">
            <el-option v-for="(item,index) in $root.selectOption.channel" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <div class="section">
          <span>可用积分</span>
          <el-input
            v-model="searchParams.presentPointsMin"
            placeholder="请输入下限"
            clearable
          />
          <i style="padding: 0 9px">-</i>
          <el-input
            v-model="searchParams.presentPointsMax"
            placeholder="请输入上限"
            clearable
          />
          <div class="msg">{{ msg }}</div>
        </div>
      </div>
      <div>
        <div>
          <span>冻结标志</span>
          <el-select v-model="searchParams.frozenMark" placeholder="">
            <el-option label="请选择" value=""></el-option>
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </div>
        <div>
          <span>黑名单</span>
          <el-select v-model="searchParams.isBlackList" placeholder="">
            <el-option label="请选择" value=""></el-option>
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </div>
        <div style="width: 308px"></div>
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
        ref="table"
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
          label="客户等级"
          width="120"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            {{ custLevel[scope.row.custLevel] }}
          </template>
        </el-table-column>
        <el-table-column
          label="积分渠道"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            {{ $root.selectOption.channelObj[scope.row.scoreChannel] }}
          </template>
        </el-table-column>
        <el-table-column
          prop="presentPoints"
          label="当前积分"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="accuAddPoints"
          label="累计调增积分"
          width="120"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="accuSubtractPoints"
          label="累计调减积分"
          width="120"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="accuExchangePoints"
          label="累计兑换积分"
          width="120"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="invalidPoints"
          label="已失效积分"
          width="120"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="mayExpirePoints"
          label="即将到期积分"
          width="120"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column label="冻结标志" header-align="center" align="center">
          <template slot-scope="scope">
            {{ scope.row.frozenMark === "1" ? "是" : "否" }}
          </template>
        </el-table-column>
        <el-table-column
          label="是否黑名单"
          width="120"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.isBlackList === "1" ? "是" : "否" }}
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
      if (value === 'compre') {
        this.getDatas(1)
      }
    },
    'searchParams.presentPointsMin': {
      handler: function(value) {
        this.checkPoint(value, this.searchParams.presentPointsMax)
      }
    },

    'searchParams.presentPointsMax': {
      handler: function(value) {
        this.checkPoint(this.searchParams.presentPointsMin, value)
      }
    }
  },
  data() {
    return {
      searchParams: {
        custNo: '',
        certType: '',
        custLevel: '',
        custName: '',
        certNo: '',
        scoreChannel: '',
        presentPointsMin: '',
        presentPointsMax: '',
        frozenMark: '',
        isBlackList: ''
      },
      loaded: false,
      datas: [],
      page: {
        total: 0,
        current: 1,
        size: 10
      },
      searchLoading: false,
      resetLoading: false,
      exportLoading: false,
      msg: '',
      custLevel: [
        '零星',
        '一星',
        '二星',
        '三星',
        '四星',
        '五星',
        '六星'
      ],
      scoreChannel: ['', '财富', '直销', '信用卡']
    }
  },

  methods: {
    // 分页
    pageChange(val) {
      this.page.current = val.page
      this.page.size = val.limit
      this.getDatas()
    },
    // 验证积分上下限
    checkPoint(min, max) {
      // 校验是否是正整数
      if (
        (min !== '' && !/^[1-9]{1,}[\d]*$/.test(min)) ||
        (max !== '' && !/^[1-9]{1,}[\d]*$/.test(max))
      ) {
        this.msg = '请输入正整数'
      } else if (min !== '' && max !== '' && Number(min) > Number(max)) {
        this.msg = '积分上限不得小于下限'
      } else {
        this.msg = ''
      }
    },
    // 搜索
    search() {
      this.searchLoading = true
      this.getDatas(1)
    },
    // 获取数据
    getDatas(current = this.page.current) {
      this.page.current = current
      let params = Object.assign(this.searchParams, this.page)
      API.scoresearch.getCustAccuPoints(
        Object.assign(params, {
          custNo: params.custNo.trim(),
          custName: params.custName.trim(),
          certNo: params.certNo.trim()
        })
      ).then(res => {
        this.datas = res.data.data.records
        this.page.total = res.data.data.total
        this.searchLoading = false
        this.resetLoading = false
      }).catch(() => {
        this.searchLoading = false
        this.resetLoading = false
      })
    },
    reset() {
      // 清空数据
      this.searchParams = {
        custNo: '',
        certType: '',
        custLevel: '',
        custName: '',
        certNo: '',
        scoreChannel: '',
        presentPointsMin: '',
        presentPointsMax: '',
        frozenMark: '',
        isBlackList: ''
      }
      this.resetLoading = true
      this.getDatas(1)
    },
    exportData() {
      if (this.page.total > 10000) {
        this.$message.error('一次最多导出10000条，请重新筛选！')
        return
      }
      this.exportLoading = true
      API.scoresearch.exportCustAccuPoints(
        Object.assign(this.searchParams, {
          custNo: this.searchParams.custNo.trim(),
          custName: this.searchParams.custName.trim(),
          certNo: this.searchParams.certNo.trim(),
          total: this.page.total,
          current: this.page.current,
          size: 10000
        })
      )
        .then(data => {
          this.exportLoading = false
          let blob = new Blob([data.data], {
            type:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          })
          // const blob = new Blob([data.data])
          // ie浏览器
          if (!!window.ActiveXObject || 'ActiveXObject' in window) {
            window.navigator.msSaveOrOpenBlob(blob, '客户综合积分查询.xls')
          } else {
            const a = document.createElement('a')
            a.style.display = 'none'
            a.download = '客户综合积分查询.xls'
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
  mounted() {
    // 获取需要绑定的table
    this.dom = this.$refs.table.bodyWrapper
    this.dom.addEventListener('scroll', () => {
      console.log(this.dom.scrollLeft)
      if (this.dom.scrollLeft > 0 && this.dom.scrollLeft < 100 && !this.loaded) {
        this.loaded = true
      }

      if (this.dom.scrollLeft > 130 && this.loaded) {
        console.log(this.loaded)
        this.loaded = false
      }
    })
  },
  created() {
    this.getDatas()
  }
}
</script>

<style lang="scss" scoped>
.contentHeight {
  /deep/ table {
    display: block;
  }
}
.compre-search {
  .search {
    > div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 25px;
      span {
        width: 60px;
        display: inline-block;
        margin-right: 10px;
      }
    }
    /deep/ .el-input {
      width: 234px;
      input {
        padding: 0 15px;
      }
    }
    /deep/ .el-input--medium .el-input__inner {
      height: 34px;
    }
    .section {
      /deep/ .el-input {
        width: 102px;
      }
      .msg {
        margin: 10px 0 0 70px;
        color: #f56c6c;
      }
    }
    .button {
      margin-top: 31px;
      margin-bottom: 24px;
      justify-content: center;
    }
  }
}
</style>
