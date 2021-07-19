<template>
  <el-dialog
    class="group-dialog"
    title="查询"
    :visible.sync="groupDialogVisible"
    width="850px"
    :before-close="close"
    append-to-body
  >
    <div style="width: 100%">
      <div class="group-dialog-search">
        <div class="search-input">
          <div class="search-input-label">客户组名称</div>
          <el-input
            placeholder="请输入客户组名称"
            v-model="searchParams.groupName"
          ></el-input>
        </div>
        <div class="search-btns">
          <el-button
            type="primary"
            icon="el-icon-search"
            :loading="searchLoading"
            @click="onSearchBtn"
            >查询</el-button
          >
          <el-button
            icon="el-icon-reset"
            :loading="resetLoading"
            @click="onResetBtn"
            >重置</el-button
          >
        </div>
      </div>
      <el-table
        class="group-dialog-table"
        :data="datas"
        style="width: 100%"
        border
        :header-cell-style="{ background: '#80A639', color: '#ffffff' }"
      >
        <el-table-column label="选择" fixed width="60" align="center" class-name="radio">
          <template slot-scope="scope">
            <el-radio
              v-model="radio"
              :label="scope.$index"
              @change="onTableSelect(scope.row)"
              >&nbsp;</el-radio
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="groupName"
          label="客户组名称"
          width="180"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="createDate"
          label="创建时间"
          width="160"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="createEmpNo"
          label="创建人工号"
          width="100"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="createEmpName"
          label="创建人"
          align="center"
        ></el-table-column>
      </el-table>
      <v-pagination
        :total="page.total"
        :currentPageNum="page.page"
        :currentPageSize="page.limit"
        @pageChange="pageChange"
      ></v-pagination>
      <div class="group-dialog-btns">
        <el-button type="primary" @click="close('add')">添 加</el-button>
        <el-button @click="close('back')">返 回</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import API from '@/api'
import vPagination from '@/components/pagination/pagination'
export default {
  props: {
    groupDialogVisible: {
      type: Boolean
    }
  },
  components: { vPagination },
  watch: {
    groupDialogVisible(value) {
      if (value) {
        this.searchParams = {
          groupName: ''
        }
        this.radio = ''
        this.selectGroup = {
          selectGroupName: '',
          selectGroupId: ''
        }
        this.getCustGroup(1)
      }
    }
  },
  data() {
    return {
      searchParams: {
        groupName: ''
      },
      page: {
        total: 0,
        page: 1,
        limit: 10
      },
      searchLoading: false,
      resetLoading: false,
      radio: '',
      selectGroup: {
        selectGroupName: '',
        selectGroupId: ''
      },
      datas: []
    }
  },
  methods: {
    // 检索
    onSearchBtn() {
      this.searchLoading = true
      this.getCustGroup(1)
    },
    // 分页
    pageChange(val) {
      this.radio = ''
      this.selectGroup = {
        selectGroupName: '',
        selectGroupId: ''
      }
      this.page.page = val.page
      this.page.limit = val.limit
      this.getCustGroup()
    },
    // 获取数据
    getCustGroup(page = this.page.page) {
      this.radio = ''
      this.page.page = page
      API.custgroup
        .getCustGroupPage({
          groupName: this.searchParams.groupName.trim(),
          ...this.page
        })
        .then(res => {
          this.page.total = res.data.data.totalCount
          this.searchLoading = false
          this.resetLoading = false
          if (res.data.data.list.length === 0 && this.page.page !== 1) {
            --this.page.page
            this.getCustGroup()
          } else {
            this.datas = res.data.data.list
          }
        })
        .catch(() => {
          this.searchLoading = false
          this.resetLoading = false
        })
    },
    // 重置
    onResetBtn() {
      this.searchParams = {
        groupName: ''
      }
      this.radio = ''
      this.selectGroup = {
        selectGroupName: '',
        selectGroupId: ''
      }
      this.resetLoading = true
      this.getCustGroup(1)
    },
    // 表格单选
    onTableSelect(row) {
      this.selectGroup = {
        selectGroupName: row.groupName,
        selectGroupId: row.groupNo
      }
    },
    close(type) {
      this.$emit('cancel', {type: type, selectGroup: this.selectGroup})
    }
  }
}
</script>

<style lang="scss" scoped>
.group-dialog {
  .group-dialog-search {
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

        /deep/ .el-input__inner {
          height: 34px;
        }
      }
    }

    .search-btns {
      margin: 30px 0;
      display: flex;
      justify-content: center;
    }
  }
  /deep/ .radio {
    .cell {
      line-height: 1;
    }
  }
  .group-dialog-btns {
    display: flex;
    justify-content: center;
  }

  .el-button {
    height: 35px;
    display: flex;
    align-items: center;
    padding: 0 20px;
  }

  .group-dialog-table {
    /deep/ tr {
      height: 35px;

      /deep/ th,
      td {
        padding: 0;
      }

      /deep/ .el-radio__label {
        display: none;
      }
    }
  }
}
</style>
