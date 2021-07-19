<template>
  <div class="cust-group">
    <div class="serch">
      <div class="searchParam">
        <div>
          <span class="name">创建人</span>
          <el-input
            placeholder="请输入创建人"
            v-model="searchParam.createEmpName"
            clearable
          ></el-input>
        </div>
        <div>
          <span class="name">创建人工号</span>
          <el-input
            placeholder="请输入创建人工号"
            v-model="searchParam.createEmpNo"
            clearable
          ></el-input>
        </div>
        <div>
          <span class="name">客户组名称</span>
          <el-input
            placeholder="请输入客户组名称"
            v-model="searchParam.groupName"
            clearable
          ></el-input>
        </div>
      </div>
      <div style="margin-top: 31px; margin-bottom: 24px">
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="search()"
          :loading="searchLoading"
          >查询</el-button
        >
        <el-button
          icon="el-icon-refresh-right"
          @click="reset"
          :loading="resetLoading"
          >重置</el-button
        >
      </div>
    </div>
    <div class="result table">
      <div class="handle cus-button">
        <el-button v-if="isAuth('sys:group:create')" icon="el-icon-create" @click="showdialog('create')"
          >创建</el-button
        >
        <el-button v-if="isAuth('sys:group:update')" icon="el-icon-upd" @click="showdialog('update')"
          :disabled="buttonDisabled">修改</el-button
        >
        <el-button v-if="isAuth('sys:group:del')" icon="el-icon-del" @click="showdialog('del')"
          :disabled="buttonDisabled">删除</el-button
        >
        <el-button v-if="isAuth('sys:group:adjust')" icon="el-icon-adjust" @click="showdialog('adjust')"
          :disabled="buttonDisabled">积分调整</el-button
        >
        <el-button v-if="isAuth('sys:group:frz')" icon="el-icon-frz" @click="showdialog('frz')"
          :disabled="buttonDisabled">冻结/解冻</el-button
        >
        <el-button v-if="isAuth('sys:group:black')" icon="el-icon-block" @click="showdialog('block')"
          :disabled="buttonDisabled">黑名单</el-button
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
              :label="scope.row.groupNo"
              v-model="radio"
              @change="getCurrent(scope.row)"
              >&nbsp;</el-radio
            >
          </template>
        </el-table-column>
        <el-table-column
          label="客户组名称"
          width="180"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="getInfo(scope.row)"
              class="table-botton"
              >{{ scope.row.groupName }}</el-button
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="createEmpNo"
          label="创建人工号"
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
          prop="createDate"
          label="创建日期"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="modifyEmpName"
          label="修改人工号"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="modifyEmpNo"
          label="修改人"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="modifyTime"
          label="修改时间"
          header-align="center"
          align="center"
        >
        </el-table-column>
      </el-table>
      <v-pagination
        :total="page.total"
        :currentPageNum="page.page"
        :currentPageSize="page.limit"
        @pageChange="pageChange"
      ></v-pagination>
    </div>
    <!-- 查看客户组详情 -->
    <group-info
      :dialogInfoVisible="dialogInfoVisible"
      :currentGroup="info"
      @cancel="closeDialog"
    ></group-info>
    <edit-group
      :dialogEditVisible="dialogEditVisible"
      :type="type"
      :currentGroup="currentGroup"
      @cancel="closeDialog"
    ></edit-group>
    <!-- 删除 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogDeleteVisible"
      width="30%"
      class="cus-confirm"
    >
      <span>是否确认删除这个客户组？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="comfirmDelete" :loading="delLoading"
          >确 认</el-button
        >
        <el-button @click="dialogDeleteVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 积分调整 -->
    <adjust-group
      :dialogAdjustVisible="dialogAdjustVisible"
      :groupName="currentGroup.groupName"
      :groupNo="currentGroup.groupNo"
      @cancel="closeDialog"
    ></adjust-group>
    <!-- 冻结/解冻 -->
    <frz-group
      :dialogFrzVisible="dialogFrzVisible"
      :groupName="currentGroup.groupName"
      :groupNo="currentGroup.groupNo"
      @cancel="closeDialog"
    ></frz-group>
    <!-- 黑名单 -->
    <block-group
      :dialogBlockVisible="dialogBlockVisible"
      :groupName="currentGroup.groupName"
      :groupNo="currentGroup.groupNo"
      @cancel="closeDialog"
    ></block-group>
    <!-- 提示弹框  审批中 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogMessageVisible"
      width="30%"
      class="cus-confirm"
    >
    <!-- 正在审批中，请审批完成后再操作 -->
      <span>{{message}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogMessageVisible = false"
          >确 认</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import vPagination from '@/components/pagination/pagination'
import editGroup from './comps/edit-group'
import adjustGroup from './comps/adjust-group'
import frzGroup from './comps/frz-group'
import blockGroup from './comps/block-group'
import groupInfo from './comps/group-info'
import API from '@/api'
export default {
  components: {
    vPagination,
    editGroup,
    adjustGroup,
    frzGroup,
    blockGroup,
    groupInfo
  },
  data() {
    return {
      searchParam: {
        groupName: '',
        createEmpName: '',
        createEmpNo: this.$store.state.user.id.toString()
      },
      currentGroup: {},
      info: {
        groupName: '',
        groupDesc: '',
        groupNo: '',
        custLevel: '',
        orgName: ''
      },
      radio: '',
      page: {
        total: 0,
        page: 1,
        limit: 10
      },
      dialogInfoVisible: false,
      dialogEditVisible: false,
      dialogDeleteVisible: false,
      dialogAdjustVisible: false,
      dialogFrzVisible: false,
      dialogBlockVisible: false,
      dialogMessageVisible: false,
      datas: [],
      searchLoading: false,
      resetLoading: false,
      delLoading: false,
      type: '', // create update...
      message: ''
    }
  },
  computed: {
    buttonDisabled() {
      return false
      // return this.currentGroup.createEmpName && (this.currentGroup.createEmpName !== this.$store.state.user.name)
    }
  },
  methods: {
    // 检索
    search() {
      this.searchLoading = true
      this.getCustGroup(1)
    },
    // 获取数据
    getCustGroup(page = this.page.page) {
      this.radio = ''
      this.page.page = page
      API.custgroup
        .getCustGroupPage({
          groupName: this.searchParam.groupName.trim(),
          createEmpNo: this.searchParam.createEmpNo.trim(),
          createEmpName: this.searchParam.createEmpName.trim(),
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
    reset() {
      this.searchParam = {
        groupName: '',
        createEmpName: '',
        createEmpNo: ''
      }
      this.radio = ''
      this.currentGroup = {}
      this.resetLoading = true
      this.getCustGroup(1)
    },
    // 查看详情
    getInfo(row) {
      this.info = {
        groupName: row.groupName,
        groupDesc: row.groupDesc,
        groupNo: row.groupNo,
        orgName: row.orgName,
        groupType: row.groupType,
        custLevel: row.custLevel,
        cardName: row.cardName
      }
      this.dialogInfoVisible = true
    },
    // 删除客户组
    comfirmDelete() {
      this.delLoading = true
      let param = {
        groupNo: this.radio,
        empNo: this.$store.state.user.id,
        empName: this.$store.state.user.name
      }
      API.custgroup
        .removeByGroupNo(param)
        .then(res => {
          this.dialogDeleteVisible = false
          this.delLoading = false
          this.radio = ''
          this.currentGroup = {}
          this.$message.success('删除成功')
          this.getCustGroup()
        })
        .catch((error) => {
          this.delLoading = false
          this.dialogDeleteVisible = false
          setTimeout(() => {
            this.message = error.msg
            this.dialogMessageVisible = true
          }, 350)
        })
    },
    // 分页
    pageChange(val) {
      this.radio = ''
      this.currentGroup = {}
      this.page.page = val.page
      this.page.limit = val.limit
      this.getCustGroup()
    },
    // 打开弹框
    showdialog(type) {
      this.type = type
      if (type === 'create') {
        this.dialogEditVisible = true
      } else {
        // 必须选择一条进行操作
        if (this.getCurrentRow()) {
          return
        }
        // 删除 修改无需审批
        if (type === 'del' || type === 'update') {
          this.openDiaolog()
          return
        }
        let qryType = type === 'adjust' ? 1 : type === 'frz' ? 2 : 3
        API.custgroup
        .qryGroupApproveStatus({ qryType, groupNo: this.radio })
        .then(res => {
          if (res.data.data) {
            this.openDiaolog()
          } else {
            this.message = res.data.msg
            this.dialogMessageVisible = true
          }
        }).catch((error) => {
          this.$message.warning({ message: error.msg })
        })
      }
    },
    openDiaolog() {
      switch (this.type) {
        case 'adjust':
          this.dialogAdjustVisible = true
          break
        case 'del':
          this.dialogDeleteVisible = true
          break
        case 'frz':
          this.dialogFrzVisible = true
          break
        case 'block':
          this.dialogBlockVisible = true
          break
        default:
          this.dialogEditVisible = true
      }
    },
    // 关闭弹框
    closeDialog(val) {
      switch (val.type) {
        case 'adjust':
          this.dialogAdjustVisible = false
          break
        case 'frz':
          this.dialogFrzVisible = false
          break
        case 'block':
          this.dialogBlockVisible = false
          break
        case 'edit':
          this.getCustGroup()
          this.dialogEditVisible = false
          break
        case 'info':
          this.dialogInfoVisible = false
          break
        default:
      }
    },
    getCurrent(row) {
      this.currentGroup = {
        groupName: row.groupName,
        groupDesc: row.groupDesc,
        groupType: row.groupType,
        groupNo: row.groupNo,
        custLevel: row.custLevel,
        cardName: row.cardName,
        certYcDistrict: row.certYcDistrict,
        certYcCity: row.certYcCity,
        orgNo: row.orgNo,
        orgName: row.orgName,
        createEmpName: row.createEmpName
      }
    },
    // 必须选择一条数据进行操作
    getCurrentRow() {
      if (this.radio === '') {
        this.$message.info('请选择一条数据进行操作')
        return true
      } else {
        return false
      }
    }
  },
  created() {
    this.getCustGroup()
  }
}
</script>
<style lang="scss" scoped>
  // css 混合
  // @mixin xx($num, $c: #ccc) {
  //   width: $num;
  //   height: $num;
  //   background-color: $c;
  // }

  // #div1 {
  //   @include xx(20px)
  // }

.serch {
  text-align: center;
  .searchParam {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  /deep/ .el-input {
    width: 250px;
  }
  .name {
    color: #262626;
    margin-right: 20px;
  }
}
$icons: create adjust frz block;
.result {
  // padding: 0 36px;
  /deep/ .table-botton {
    span {
      text-decoration: underline;
    }
  }
  .handle {
    display: flex;
    margin-bottom: 16px;

    @each $icon in $icons {
      /deep/ .el-icon-#{$icon} {
        background: url('~@/assets/img/' + $icon +'-logo.png') center no-repeat;
        background-size: cover;
        width: 16px;
        height: 16px;
      }
    }
    /deep/ .el-icon-upd {
      background: url(~@/assets/img/edit-logo.png) center no-repeat;
      background-size: cover;
      width: 16px;
      height: 16px;
    }
    /deep/ .el-icon-del {
      background: url(~@/assets/img/delete-logo.png) center no-repeat;
      background-size: cover;
      width: 16px;
      height: 16px;
    }
  }
}
</style>
