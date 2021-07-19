<template>
  <div class="equityact-container">
    <div class="equityact-form">
      <div class="equityact-form-row">
        <div class="equityact-form-item">
          <div class="equityact-form-item-babel">权益板块名称</div>
          <el-input
            v-model="searchParams.boardName"
            placeholder="请输入权益板块名称"
            maxlength="60"
          >
          </el-input>
        </div>
        <div class="equityact-form-item">
          <div class="equityact-form-item-babel">活动名称</div>
          <el-input
            v-model="searchParams.actName"
            placeholder="请输入活动名称"
            maxlength="60"
          >
          </el-input>
        </div>
        <div class="equityact-form-item">
          <div class="equityact-form-item-babel">活动渠道</div>
          <el-select v-model="searchParams.actChannel" placeholder="请选择">
            <el-option
              v-for="(item, index) in $root.selectOption.channel"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="equityact-form-row">
        <div class="equityact-form-item">
          <div class="equityact-form-item-babel">活动状态</div>
          <el-select v-model="searchParams.actStatus" placeholder="请选择">
            <el-option
              v-for="item in actStatusOptions"
              :key="item.key"
              :label="item.name"
              :value="item.key"
            />
          </el-select>
        </div>
        <div class="equityact-form-item">
          <div class="equityact-form-item-babel">活动目标</div>
          <el-select v-model="searchParams.actTarget" placeholder="请选择">
            <el-option
              v-for="item in actTargetOptions"
              :key="item.key"
              :label="item.name"
              :value="item.key"
            />
          </el-select>
        </div>
        <div class="equityact-form-item">
          <div class="equityact-form-item-babel">活动开始时间</div>
          <el-date-picker
            v-model="searchParams.actBegtime"
            type="date"
            value-format="yyyy/MM/dd"
            format="yyyy/MM/dd"
            placeholder="请选择活动开始时间"
            :editable="false"
          >
          </el-date-picker>
        </div>
      </div>
      <div class="equityact-form-row">
        <div class="equityact-form-item">
          <div class="equityact-form-item-babel">活动结束时间</div>
          <el-date-picker
            v-model="searchParams.actEndtime"
            type="date"
            value-format="yyyy/MM/dd"
            format="yyyy/MM/dd"
            placeholder="请选择活动结束时间"
            :editable="false"
          >
          </el-date-picker>
        </div>
        <div class="equityact-form-item">
          <div class="equityact-form-item-babel">是否灰度</div>
          <el-select v-model="searchParams.gray" placeholder="请选择">
            <el-option label="请选择" value=""></el-option>
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </div>
        <!-- 临时占位 -->
        <div class="equityact-form-item" style="visibility: hidden;">
          <div class="equityact-form-item-babel">是否灰度</div>
          <el-select v-model="searchParams.gray" placeholder="请选择">
            <el-option label="请选择" value=""></el-option>
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </div>
      </div>
      <div class="equityact-form-rowBtns">
        <el-button
          type="primary"
          icon="el-icon-query"
          :loading="searchStatus"
          @click="onSearchBtn"
          >查询</el-button
        >
        <el-button
          icon="el-icon-reset"
          :loading="resetStatus"
          @click="onResetBtn"
          >重置</el-button
        >
      </div>
    </div>
    <el-row class="equityact-handelBtns cus-button">
      <el-button
        v-if="isAuth('sys:activity:create')"
        icon="el-icon-cj"
        @click="handleFuncBtn('add')"
        >创建</el-button
      >
      <el-button
        v-if="isAuth('sys:activity:update')"
        icon="el-icon-xg"
        @click="handleFuncBtn('edit')"
        >修改</el-button
      >
      <el-button
        v-if="isAuth('sys:activity:update')"
        icon="el-icon-xg"
        @click="handleFuncBtn('stock')"
        >添加库存</el-button
      >
      <el-button
        v-if="isAuth('sys:activity:online')"
        icon="el-icon-sx"
        @click="handleFuncBtn('online')"
        >正式上线</el-button
      >
      <el-button
        v-if="isAuth('sys:activity:grayOnline')"
        icon="el-icon-sx"
        @click="handleFuncBtn('grayOnline')"
        >灰度上线</el-button
      >
      <el-button
        v-if="isAuth('sys:activity:offline')"
        icon="el-icon-xx"
        @click="handleFuncBtn('offline')"
        >下线</el-button
      >
      <el-button
        v-if="isAuth('sys:activity:delete')"
        icon="el-icon-sc"
        @click="handleFuncBtn('delete')"
        >删除</el-button
      >
      <el-button
        v-if="isAuth('sys:activity:create')"
        icon="el-icon-copy"
        @click="handleFuncBtn('copy')"
        >复制</el-button
      >
      <el-button
        v-if="isAuth('sys:activity:update')"
        icon="el-icon-xg"
        @click="handleFuncBtn('sort')"
        >调整顺序</el-button
      >
    </el-row>
    <el-table
      ref="multipleTable"
      class="equityact-table"
      :data="list"
      style="width: 100%"
      border
      :header-cell-style="{ background: '#FAFAFA', color: '#262626' }"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50"> </el-table-column>
      <el-table-column
        prop="actName"
        label="权益活动名称"
        width="180"
        align="center"
      >
        <template slot-scope="{ row }">
          <span class="equityact-table-name" @click="handleDetail(row.actId)">{{
            row.actName
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="actBegtime"
        label="活动开始时间"
        width="160"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="actEndtime"
        label="活动结束时间"
        width="160"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="boardName"
        label="权益板块名"
        width="160"
        align="center"
      >
      </el-table-column>
      <el-table-column prop="actChannel" label="活动渠道" align="center">
        <template slot-scope="{ row }">
          <span>{{ $root.selectOption.channelObj[row.actChannel] }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="活动顺序" align="center">
      </el-table-column>
      <el-table-column prop="actStatus" label="活动状态" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.actStatus | statusFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="gray" label="是否灰度" align="center">
        <template slot-scope="{ row }">
          <span>{{
            row.gray ? (row.gray === '1' ? '是' : '否') : row.gray
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="160"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="createEmpNo"
        label="创建人工号"
        width="100"
        align="center"
      >
      </el-table-column>
      <el-table-column prop="createEmpName" label="创建人" align="center">
      </el-table-column>
      <el-table-column
        prop="modifyTime"
        label="修改时间"
        width="160"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="modifyEmpNo"
        label="修改人工号"
        width="100"
        align="center"
      >
      </el-table-column>
      <el-table-column prop="modifyEmpName" label="修改人" align="center">
      </el-table-column>
      <el-table-column
        prop="approveEmpNo"
        label="审批人工号"
        width="100"
        align="center"
      >
      </el-table-column>
      <el-table-column prop="approvePerson" label="审批人" align="center">
      </el-table-column>
    </el-table>
    <v-pagination
      :total="page.total"
      :currentPageNum="page.currentPage"
      :currentPageSize="page.pageSize"
      @pageChange="pageChange"
    ></v-pagination>
    <add-form
      :type="btnType"
      :actId="actId"
      :currentActStatus="currentActStatus"
      :dialogVisible="addDialogVisible"
      @onCancel="handleCloce"
      @handleAddId="handleAddId"
    ></add-form>
    <edit-sort
      :boardSortVisible="boardSortVisible"
      :actId="actId"
      @cancel="editCancel"
    >
    </edit-sort>
    <!-- 添加库存 -->
    <stock-edit
      :dialogEditStockVisible="dialogEditStockVisible"
      :actId="actId"
      :type="btnType"
      @cancel="dialogEditStockVisible = false"
    ></stock-edit>
    <el-dialog
      class="notice-dialog"
      title="提示"
      :visible.sync="noticeDialogVisible"
      width="460px"
    >
      <span>{{
        btnType === 'delete'
          ? '是否确认删除此权益活动？'
          : btnType === 'online'
          ? '是否确认正式上线权益活动？'
          : btnType === 'grayOnline'
          ? '是否确认灰度上线此权益活动'
          : '是否确认下线权益活动？'
      }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="submitStatus" @click="handleConfirm"
          >确 认</el-button
        >
        <el-button :disabled="submitStatus" @click="handleCloce"
          >取 消</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import API from '@/api'
import vPagination from '@/components/pagination/pagination'
import addForm from './components/add-form'
import editSort from './components/edit-sort'
import stockEdit from './components/stock-edit'
const actChannelOptions = [
  {
    key: '',
    name: '请选择'
  },
  {
    key: '1',
    name: '财富'
  },
  {
    key: '2',
    name: '直销'
  },
  {
    key: '3',
    name: '信用卡'
  }
]
const actStatusOptions = [
  {
    key: '',
    name: '请选择'
  },
  {
    key: '1',
    name: '草稿'
  },
  {
    key: '2',
    name: '同意'
  },
  {
    key: '3',
    name: '下线'
  },
  {
    key: '4',
    name: '上线'
  },
  {
    key: '5',
    name: '待审批'
  },
  {
    key: '6',
    name: '驳回'
  },
  {
    key: '7',
    name: '已结束'
  }
]
const actTargetOptions = [
  {
    key: '',
    name: '请选择'
  },
  {
    key: '1',
    name: '新客获取'
  },
  {
    key: '2',
    name: '老客户营销'
  },
  {
    key: '3',
    name: '流失客户挽留'
  },
  {
    key: '4',
    name: '睡眠客户激活'
  }
]
const actChannelKeyValue = actChannelOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.name
  return acc
}, {})
const actStatusKeyValue = actStatusOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.name
  return acc
}, {})
export default {
  name: 'equityact',
  components: {
    vPagination,
    addForm,
    editSort,
    stockEdit
  },
  filters: {
    channelFilter(num) {
      return actChannelKeyValue[num]
    },
    statusFilter(num) {
      return actStatusKeyValue[num]
    }
  },
  data() {
    return {
      actChannelOptions,
      actStatusOptions,
      actTargetOptions,
      // 查询参数
      searchParams: {
        boardName: '',
        actName: '',
        actChannel: '',
        actStatus: '',
        actTarget: '',
        actBegtime: '',
        actEndtime: '',
        gray: ''
      },
      currentActStatus: '',
      searchStatus: false,
      resetStatus: false,
      submitStatus: false,
      actId: '',
      currentChannel: '',
      currentUser: '',
      addDialogVisible: false,
      noticeDialogVisible: false,
      boardSortVisible: false,
      dialogEditStockVisible: false,
      btnType: '',
      radio: '',
      multipleSelection: [],
      isUpdate: false,
      // 分页
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      // 列表
      list: []
    }
  },
  computed: {
    buttonDisabled() {
      return (
        this.currentChannel !== '' &&
        this.currentChannel !== this.$store.state.user.channel
      )
    },

    buttonEditDisabled() {
      return (
        (this.currentChannel !== '' &&
          this.currentChannel !== this.$store.state.user.channel) ||
        this.currentUser !== this.$store.state.user.id
      )
    }
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    selectInit(row, index) {},
    // 去前后空格
    removeSpace(obj) {
      Object.keys(obj).forEach(key => {
        if (key === 'actName') {
          obj[key] = obj[key].trim()
        }
      })
    },
    // 请求权益活动表格数据
    getEquityActTableList(page, params) {
      API.activity
        .getEquityActListData(
          Object.assign(
            {
              current: page.currentPage,
              size: page.pageSize
            },
            params
          )
        )
        .then(response => {
          this.list = response.data.data.records
          this.page.total = response.data.data.total
          this.searchStatus = false
          this.resetStatus = false
          this.isUpdate = false
        })
        .catch(() => {
          this.searchStatus = false
          this.resetStatus = false
          this.isUpdate = false
        })
    },
    // 更新表格数据
    updateActivityTableList() {
      this.actId = ''
      this.getEquityActTableList(this.page, this.searchParams)
    },
    // 查询
    onSearchBtn() {
      // 查询校验
      if (
        this.searchParams.actEndtime &&
        this.searchParams.actBegtime &&
        new Date(this.searchParams.actEndtime).getTime() <
          new Date(this.searchParams.actBegtime).getTime()
      ) {
        this.showMessage('结束时间不得早于开始时间!', 'warning')
        return
      }
      this.actId = ''
      this.page.currentPage = 1
      this.searchStatus = true
      this.removeSpace(this.searchParams)
      this.getEquityActTableList(this.page, this.searchParams)
    },
    // 查询重置
    onResetBtn() {
      this.actId = ''
      this.resetStatus = true
      this.searchParams = {
        boardName: '',
        actName: '',
        actChannel: '',
        actStatus: '',
        actTarget: '',
        actBegtime: '',
        actEndtime: '',
        gray: ''
      }
      this.page.currentPage = 1
      this.getEquityActTableList(this.page)
    },
    // 分页
    pageChange(page) {
      this.actId = ''
      this.page.currentPage = page.page
      this.page.pageSize = page.limit
      this.getEquityActTableList(this.page, this.searchParams)
    },
    // 创建、修改、上线、下线、删除按钮
    handleFuncBtn(type) {
      this.btnType = type
      if (type === 'add') {
        this.actId = null
        this.addDialogVisible = true
      } else {
        if (this.multipleSelection.length === 0) {
          this.showMessage('请选择活动！', 'warning')
          return
        }
        if (type === 'copy') {
          this.copyCheck()
        } else if (type === 'edit' || type === 'sort' || type === 'stock') {
          this.editCheck(type)
        } else {
          // 上线
          if (type === 'online' || type === 'grayOnline') {
            if (
              this.multipleSelection.filter(
                item => item.actChannel !== this.$store.state.user.channel
              ).length > 0
            ) {
              this.showMessage('只能上线本渠道的活动！', 'warning')
              return
            }
            if (
              this.multipleSelection.filter(
                item => item.actStatus !== '2' && item.actStatus !== '4'
              ).length > 0
            ) {
              this.showMessage('同意状态的活动才能上线！', 'warning')
              return
            }
            if (
              this.multipleSelection.filter(item => item.actStatus === '4')
                .length > 0
            ) {
              if (
                this.multipleSelection.filter(item => item.gray === '0')
                  .length > 0
              ) {
                this.showMessage('活动已经上线！', 'warning')
                return
              }
              if (
                this.multipleSelection.filter(item => item.gray === '1')
                  .length > 0 &&
                type === 'grayOnline'
              ) {
                this.showMessage('活动已经上线！', 'warning')
                return
              }
            }
            this.actId = this.multipleSelection
              .map(row => {
                return row.actId
              })
              .join(',')
            this.noticeDialogVisible = true
          } else if (type === 'offline') {
            if (
              this.multipleSelection.filter(
                item => item.actChannel !== this.$store.state.user.channel
              ).length > 0
            ) {
              this.showMessage('只能下线本渠道的活动！', 'warning')
              return
            }
            if (
              this.multipleSelection.filter(item => item.actStatus !== '4')
                .length > 0
            ) {
              this.showMessage('上线状态的活动才能下线！', 'warning')
              return
            }
            this.actId = this.multipleSelection
              .map(row => {
                return row.actId
              })
              .join(',')
            this.noticeDialogVisible = true
          } else {
            if (this.multipleSelection.length > 1) {
              this.showMessage('只能对一条数据进行删除！', 'warning')
              return
            }
            this.currentActStatus = this.multipleSelection[0].actStatus
            const currentChannel = this.multipleSelection[0].actChannel
            if (
              currentChannel !== '' &&
              currentChannel !== this.$store.state.user.channel
            ) {
              this.showMessage('只能删除本渠道的活动！', 'warning')
              return
            }
            // if (
            //   this.multipleSelection[0].createEmpNo !==
            //   this.$store.state.user.id
            // ) {
            //   this.showMessage('只能删除本人创建的活动！', 'warning')
            //   return
            // }
            if (
              this.currentActStatus === '1' ||
              this.currentActStatus === '3' ||
              this.currentActStatus === '6' ||
              this.currentActStatus === '7'
            ) {
              this.actId = this.multipleSelection[0].actId
              this.noticeDialogVisible = true
            } else {
              this.showMessage(
                '草稿、驳回、下线、已结束状态的活动才能删除！',
                'warning'
              )
            }
          }
        }
      }
    },
    // 复制校验
    copyCheck() {
      if (this.multipleSelection.length > 1) {
        this.showMessage('只能对一条数据进行复制！', 'warning')
        return
      }
      this.currentActStatus = this.multipleSelection[0].actStatus
      const currentChannel = this.multipleSelection[0].actChannel
      if (
        currentChannel !== '' &&
        currentChannel !== this.$store.state.user.channel
      ) {
        this.showMessage('只能复制本渠道的活动！', 'warning')
        return
      }
      this.actId = this.multipleSelection[0].actId
      this.addDialogVisible = true
    },
    // 修改校验
    editCheck(type) {
      if (this.multipleSelection.length > 1) {
        this.showMessage('只能对一条数据进行修改！', 'warning')
        return
      }
      this.currentActStatus = this.multipleSelection[0].actStatus
      const currentChannel = this.multipleSelection[0].actChannel
      if (
        currentChannel !== '' &&
        currentChannel !== this.$store.state.user.channel
      ) {
        this.showMessage('只能修改本渠道的活动！', 'warning')
        return
      }
      // if (this.multipleSelection[0].createEmpNo !== this.$store.state.user.id) {
      //   this.showMessage('只能修改本人创建的活动！', 'warning')
      //   return
      // }
      if (type === 'sort') {
        this.actId = this.multipleSelection[0].actId
        this.boardSortVisible = true
        return
      }
      if (type === 'stock') {
        if (this.currentActStatus !== '4') {
          this.showMessage('只能添加上线活动的库存!', 'warning')
          return
        }
        this.actId = this.multipleSelection[0].actId
        this.dialogEditStockVisible = true
        return
      }
      if (
        this.currentActStatus === '2' ||
        this.currentActStatus === '5' ||
        this.currentActStatus === '7' ||
        this.currentActStatus === '3'
      ) {
        this.showMessage(
          '同意、待审批、下线、已结束状态的活动不支持修改！',
          'warning'
        )
      } else {
        this.actId = this.multipleSelection[0].actId
        this.addDialogVisible = true
      }
    },
    handleConfirm() {
      this.submitStatus = true
      if (
        this.btnType === 'online' ||
        this.btnType === 'offline' ||
        this.btnType === 'grayOnline'
      ) {
        API.activity
          .postLineEquityActData({
            actId: this.actId,
            actStatus: this.btnType === 'offline' ? '3' : '4',
            modifyEmpName: this.$store.state.user.name,
            modifyEmpNo: this.$store.state.user.id,
            gray: this.btnType === 'grayOnline' ? '1' : '0'
          })
          .then(response => {
            this.submitStatus = false
            this.handleCloce()
            this.showMessage(response.data.msg, 'success')
            this.isUpdate = true
          })
          .catch(response => {
            this.submitStatus = false
            this.handleCloce()
            this.showMessage(response.msg, 'warning')
          })
      } else {
        API.activity
          .postDelEquityActData({
            actId: this.actId,
            modifyEmpName: this.$store.state.user.name,
            modifyEmpNo: this.$store.state.user.id
          })
          .then(response => {
            this.submitStatus = false
            this.handleCloce()
            this.showMessage(response.data.msg, 'success')
            this.isUpdate = true
          })
          .catch(response => {
            this.submitStatus = false
            this.handleCloce()
            this.showMessage(response.msg, 'warning')
          })
      }
    },
    handleDetail(id) {
      this.actId = id
      this.btnType = 'detail'
      this.addDialogVisible = true
    },
    handleAddId(id) {
      this.actId = id
    },
    handleCloce(value) {
      if (
        this.btnType === 'add' ||
        this.btnType === 'edit' ||
        this.btnType === 'copy'
      ) {
        if (value) {
          this.addDialogVisible = false
          this.isUpdate = true
        } else {
          this.addDialogVisible = false
        }
      } else if (this.btnType === 'detail') {
        this.addDialogVisible = false
      } else {
        this.noticeDialogVisible = false
      }
      setTimeout(() => {
        this.btnType = ''
      }, 350)
    },
    editCancel(val) {
      this.boardSortVisible = false
      if (val.type === 'success') {
        this.getEquityActTableList(this.page, this.searchParams)
      }
    },
    showMessage(mes, type) {
      this.$message({
        message: mes,
        type: type
      })
    }
  },
  created() {
    if (this.$route.query.status) {
      this.searchParams.actStatus = this.$route.query.status
      if (this.$route.query.type && this.$route.query.type === 1) {
        this.searchParams.actChannel = this.$store.state.user.channel
        this.searchParams.createEmpNo = this.$store.state.user.id
        this.searchParams.createEmpName = this.$store.state.user.name
      }
    }
    this.getEquityActTableList(this.page, this.searchParams)
  },
  watch: {
    isUpdate(value) {
      if (value) {
        this.updateActivityTableList()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.equityact-container {
  background: #ffffff;
  padding: 26px 35px 44px;

  .equityact-form-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 25px;

    .equityact-form-itemScore {
      display: flex;
      align-items: center;
      height: 36px;

      .equityact-form-item-babel {
        width: 84px;
        margin-right: 22px;
      }

      .equityact-form-item-line {
        margin: 0 16px;
      }

      .el-input {
        width: 106px;
      }
    }

    .equityact-form-item {
      display: flex;
      align-items: center;

      .equityact-form-item-babel {
        width: 84px;
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

  .equityact-form-rowBtns {
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

  .equityact-handelBtns {
    display: flex;
    margin: 23px 0 16px 0;

    .el-button {
      /deep/ .el-icon-cj {
        width: 16px;
        height: 18px;
        background: url(./imgs/cj.png) center no-repeat;
        background-size: cover;
      }

      /deep/ .el-icon-xg {
        width: 20px;
        height: 20px;
        background: url(./imgs/xg.png) center no-repeat;
        background-size: cover;
      }

      /deep/ .el-icon-sx {
        width: 20px;
        height: 20px;
        background: url(./imgs/sx.png) center no-repeat;
        background-size: cover;
      }

      /deep/ .el-icon-xx {
        width: 20px;
        height: 20px;
        background: url(./imgs/xx.png) center no-repeat;
        background-size: cover;
      }

      /deep/ .el-icon-sc {
        width: 18px;
        height: 19px;
        background: url(./imgs/sc.png) center no-repeat;
        background-size: cover;
      }

      /deep/ .el-icon-copy {
        width: 18px;
        height: 19px;
        background: url(~@/assets/img/copy.png) center no-repeat;
        background-size: cover;
      }
    }
  }

  .equityact-table {
    /deep/ tr {
      height: 52px;
    }

    /deep/ .cell {
      text-align: center;
    }

    /deep/ .el-radio__label {
      display: none;
    }

    .equityact-table-name {
      color: #80a639;
      cursor: pointer;
      text-decoration: underline;
    }
  }
}

.notice-dialog {
  /deep/ .el-dialog__header {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    background-color: #80a639;

    .el-dialog__title,
    .el-dialog__close {
      color: #ffffff;
    }
  }

  /deep/ .el-dialog__body {
    font-size: 20px;
    color: #000000;
  }
}
</style>
