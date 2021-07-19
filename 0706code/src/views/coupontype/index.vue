<template>
  <div class="coupon">
    <div class="search">
      <div class="inline">
        <span>类型名称</span>
        <el-input
          v-model="searchParams.yhmTypeName"
          placeholder="请输入类型名称"
          maxlength="64"
        >
        </el-input>
      </div>
      <div class="inline">
        <span>种类</span>
        <el-select v-model="searchParams.yhmKind" placeholder="">
          <el-option label="请选择" value=""></el-option>
          <el-option label="资格券" value="1"></el-option>
          <el-option label="面额券" value="2"></el-option>
          <el-option label="折扣券" value="3"></el-option>
        </el-select>
      </div>
			<div class="inline">
        <span>状态</span>
        <el-select v-model="searchParams.status" placeholder="">
          <el-option label="请选择" value=""></el-option>
          <el-option label="停用" value="0"></el-option>
          <el-option label="启用" value="1"></el-option>
        </el-select>
      </div>
    </div>
    <div class="search-btn">
      <el-button type="primary" icon="el-icon-search" :loading="searchLoading" @click="onSearchBtn">查询</el-button>
      <el-button icon="el-icon-reset" :loading="resetLoading" @click="onResetBtn">重置</el-button>
    </div>
    <div class="result table">
      <div class="cus-button handle" style="margin-bottom: 14px">
        <el-button icon="el-icon-create" @click="showdialog('create')"
          >创建</el-button
        >
        <el-button icon="el-icon-upd" @click="showdialog('update')"
          :disabled="buttonDisabled">修改</el-button
        >
        <el-button icon="el-icon-del" @click="showdialog('del')"
          :disabled="buttonDisabled">删除</el-button
        > 
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
          label="选择"
          fixed
          width="60"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <el-radio
              :label="scope.row.yhmTypeId"
              v-model="radio"
              @change="getCurrent(scope.row)"
              >&nbsp;</el-radio
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="yhmTypeName"
          label="类型名称"
          width="120"
          header-align="center"
          align="center"
          class="table-botton"
        >
          <!-- <template slot-scope="scope">
            <el-button
              type="text"
              @click="getInfo(scope.row)"
              class="table-botton"
              >{{ scope.row.yhmTypeName }}</el-button
            >
          </template> -->
        </el-table-column>
        <el-table-column
          label="种类"
          width="120"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            {{ yhmKinds[scope.row.yhmKind] }}
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          width="120"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            {{ status[scope.row.status] }}
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          header-align="center"
          width="160"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="createEmpNo"
          label="创建人工号"
          width="120"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="createEmpName"
          label="创建人"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="modifyTime"
          label="修改时间"
          width="160"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="modifyEmpNo"
          label="修改人工号"
          width="120"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="modifyEmpName"
          label="修改人"
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
    <!-- 修改 创建 -->
    <v-edit
      :dialogEditVisible="dialogEditVisible"
      :id="radio"
      :type="type"
      @cancel="cancel"
    >
    </v-edit>
    <!-- 删除 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogDeleteVisible"
      width="30%"
      class="cus-confirm"
    >
      <span>是否确认删除此优惠券类型？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="comfirmDelete" :loading='delLoading'>确 认</el-button>
        <el-button @click="dialogDeleteVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import vPagination from '@/components/pagination/pagination'
import vEdit from './comps/edit'
import API from '@/api'
export default {
  name: 'subject',
  components: {
    vPagination,
    vEdit
  },
  computed: {
    buttonDisabled() {
      return false
      // return this.currentName && (this.currentName !== this.$store.state.user.name)
    }
  },
  data() {
    return {
      searchParams: {
        yhmTypeName: '',
        yhmKind: '',
        status: ''
      },
      resetLoading: false,
      searchLoading: false,
      delLoading: false,
      datas: [],
      page: {
        total: 0,
        current: 1,
        size: 10
      },
      radio: '',
      currentChannel: '',
      currentName: '',
      type: '',
      dialogEditVisible: false,
      dialogDeleteVisible: false,
      yhmKinds: ['', '资格券', '面额券', '折扣券'],
      status: ['停用', '启用']
    }
  },
  methods: {
    showdialog(type) {
      this.type = type
      // 必须选择一条进行操作
      if (this.getCurrentRow(type)) {
        return
      }
      if (type === 'del') {
        this.dialogDeleteVisible = true
      } else {
        this.dialogEditVisible = true
      }
    },
    // 必须选择一条数据进行操作
    getCurrentRow(type) {
      if (this.radio === '' && type !== 'create') {
        this.$message.info('请选择一条数据进行操作')
        return true
      } else {
        return false
      }
    },
    onSearchBtn() {
      this.radio = ''
      this.currentChannel = ''
      this.currentName = ''
      this.searchLoading = true
      this.selectAllYhmType(1)
    },
    onResetBtn() {
      this.radio = ''
      this.currentChannel = ''
      this.currentName = ''
      this.searchParams = {
        yhmTypeName: '',
        yhmKind: '',
        status: ''
      }
      this.resetLoading = true
      this.selectAllYhmType(1)
    },
    getCurrent(row) {
      this.currentChannel = row.subChannel
      this.currentName = row.createEmpName
    },
    comfirmDelete() {
      this.delLoading = true
      API.coupon.delYhmTypeById({
        id: this.radio,
        modifyEmpName: this.$store.state.user.name,
        modifyEmpNo: this.$store.state.user.id
      }).then((res) => {
        this.dialogDeleteVisible = false
        this.delLoading = false
        this.selectAllYhmType()
        this.$message.success('删除成功！')
      }).catch((err) => {
        this.delLoading = false
        this.$message.error(err.msg)
      })
    },
    // 获取列表
    selectAllYhmType(page = this.page.current) {
      this.page.current = page
      let params = Object.assign(this.page, this.searchParams)
      API.coupon.selectAllYhmType(Object.assign(params, {yhmTypeName: params.yhmTypeName.trim()})).then((res) => {
        this.searchLoading = false
        this.resetLoading = false
        if (res.data.data.records.length === 0 && this.page.current !== 1) {
          --this.page.current
          this.selectAllYhmType()
        } else {
          this.datas = res.data.data.records
        }
        this.page.total = res.data.data.total
      }).catch(() => {
        this.searchLoading = false
        this.resetLoading = false
      })
    },
    // 分页
    pageChange(val) {
      this.radio = ''
      this.currentChannel = ''
      this.currentName = ''
      this.page.current = val.page
      this.page.size = val.limit
      this.selectAllYhmType()
    },
    cancel(val) {
      switch (val.type) {
        case 'create':
          this.dialogEditVisible = false
          this.selectAllYhmType(1)
          break
        case 'update':
          this.dialogEditVisible = false
          this.selectAllYhmType()
          break
        default:
      }
    }
  },
  created() {
    this.selectAllYhmType(1)
  }
}
</script>
<style lang="scss" scoped>
.coupon {
  padding: 0 35px 44px;
  .search {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    .inline {
      width: 33%;
      padding-top: 25px;
      >span {
        width: 84px;
      }
      /deep/ .el-input {
        width: 248px;
        margin-left: 22px;
      }
      /deep/ .el-input__inner {
        height: 35px;
        line-height: 35px;
      }
    }
  }
 .search-btn {
    margin-top: 31px;
    margin-bottom: 24px;
    display: flex;
    justify-content: center;
    /deep/ .el-button {
      height: 35px;
      line-height: 1;
      display: flex;
      align-items: center;
    }
  } 
  .handle {
    display: flex;
    margin-bottom: 16px;
    /deep/ .el-icon-create {
      background: url(~@/assets/img/create-logo.png) center no-repeat;
    }
    /deep/ .el-icon-upd {
      background: url(~@/assets/img/edit-logo.png) center no-repeat;
    }
    /deep/ .el-icon-del {
      background: url(~@/assets/img/delete-logo.png) center no-repeat;
    }
    /deep/ .el-icon-create,
    /deep/ .el-icon-upd,
    /deep/ .el-icon-del{
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
