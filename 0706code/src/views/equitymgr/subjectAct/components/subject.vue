<template>
  <el-dialog class="subject-dialog" title="查询" :visible.sync="subjectDialogVisible" width="850px" :before-close="handleCustsubject" :append-to-body="true">
    <div style="width: 100%">
      <div class="subject-dialog-search">
        <div class="search-row">
          <div class="search-input">
            <div class="search-input-label">主题名称</div>
            <el-input placeholder="请输入主题名称" v-model="searchParams.subName"></el-input>
          </div>
          <div class="search-input">
            <div class="search-input-label">活动渠道</div>
            <el-select v-model="searchParams.subChannel" disabled>
                <el-option v-for="(item,index) in $root.selectOption.channel" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </div>
        </div>
       
        <div class="search-btns">
          <el-button type="primary" icon="el-icon-query" :loading="searchLoading" @click="onSearchBtn">查询</el-button>
          <el-button icon="el-icon-reset" :loading="resetLoading" @click="onResetBtn">重置</el-button>
        </div>
      </div>
      <el-table class="subject-dialog-table" :data="tableData" style="width: 100%" border :header-cell-style="{background:'#80A639',color:'#ffffff'}">
        <el-table-column label="选择" fixed width="60" align="center">
          <template slot-scope="scope">
            <el-radio v-model="radio" :label="scope.row.id" @change="getCurrent(scope.row)">&nbsp;</el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="subName" label="主题名称" width="180" align="center">
        </el-table-column>
        <el-table-column label="活动渠道" width="160" align="center">
           <template slot-scope="scope">
            {{ $root.selectOption.channelObj[scope.row.subChannel] }}
          </template>
        </el-table-column>
        <el-table-column prop="subBegtime" label="主题开始时间" align="center">
        </el-table-column>
        <el-table-column prop="subEndtime" label="主题结束时间" align="center">
        </el-table-column>
      </el-table>
      <v-pagination
        :total="page.total"
        :currentPageNum="page.current"
        :currentPageSize="page.size"
        @pageChange="pageChange"
      ></v-pagination>
      <div class="subject-dialog-btns">
        <el-button type="primary" @click="handleCustsubject('select')">添 加</el-button>
        <el-button @click="handleCustsubject">返 回</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import vPagination from '@/components/pagination/pagination'
import API from '@/api'
export default {
  components: { vPagination },
  props: {
    subjectDialogVisible: {
      type: Boolean
    }
  },
  data() {
    return {
      searchParams: {
        subName: '',
        subChannel: this.$store.state.user.channel
      },
      channel: ['请选择', '财富', '直销', '信用卡'],
      page: {
        total: 0,
        current: 1,
        size: 10
      },
      radio: '',
      selectRow: {},
      searchLoading: false,
      resetLoading: false,
      tableData: []
    }
  },
  watch: {
    subjectDialogVisible(value) {
      if (value) {
        // 初始化数据
        this.radio = ''
        this.getSubInfoList(1)
      }
    }
  },
  methods: {
    onSearchBtn() {
      this.searchLoading = true
      this.getSubInfoList(1)
    },
    onResetBtn() {
      this.radio = ''
      this.searchParams = {
        subName: '',
        subChannel: ''
      }
      this.resetLoading = true
      this.getSubInfoList(1)
    },
    getCurrent(row) {
      this.selectRow = row
    },
    handleCustsubject(val) {
      if (!this.radio && val === 'select') {
        this.$message.info('请选择主题！')
        return
      }
      this.$emit('selected', {selectRow: val === 'select' ? this.selectRow : {}})
    },
    // 获取列表
    getSubInfoList(page = this.page.current) {
      this.page.current = page
      let params = Object.assign(this.page, this.searchParams)
      API.subject.getSubInfoList(Object.assign(params, {subName: params.subName.trim()})).then((res) => {
        this.searchLoading = false
        this.resetLoading = false
        this.tableData = res.data.data.records
        this.page.total = res.data.data.total
      }).catch(() => {
        this.searchLoading = false
        this.resetLoading = false
      })
    },
    // 分页
    pageChange(val) {
      this.radio = ''
      this.page.current = val.page
      this.page.size = val.limit
      this.getSubInfoList()
    }
  },
  created() {
    // this.getSubInfoList(1)
  }
}
</script>

<style lang="scss" scoped>
.subject-dialog {
    .subject-dialog-search {
      .search-row {
        display: flex;
        justify-content: space-between;
      }
      .search-input {
        display: flex;
        justify-content: center;
        align-items: center;

        .search-input-label {
          width: 70px;
          margin-right: 16px;
        }

        .el-input {
          width: 248px;
        }

        /deep/ .el-input__inner {
          height: 34px;
        }
      }

      .search-btns {
        margin: 30px 0;
        display: flex;
        justify-content: center;
      }
    }

    .subject-dialog-btns {
      display: flex;
      justify-content: center;
    }

    .el-button {
      height: 35px;
      display: flex;
      align-items: center;
      padding: 0 20px;

      /deep/ .el-icon-query {
        width: 18px;
        height: 18px;
        background: url(../imgs/search.png) center no-repeat;
        background-size: cover;
      }

      /deep/ .el-icon-reset {
        width: 15px;
        height: 19px;
        background: url(../imgs/reset.png) center no-repeat;
        background-size: cover;
      }
    }

    .subject-dialog-table {
      /deep/ tr {
        height: 35px;

        /deep/ th,
        td {
          padding: 0;
        }
      }

      /deep/ .el-radio__label {
        display: none;
      }
    }
  }
</style>