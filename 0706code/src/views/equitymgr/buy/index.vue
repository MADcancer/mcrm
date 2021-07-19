<!--
  ~
  ~  Copyright (c) 2018-2025, Pactera JinXin Software All rights reserved.
  ~
  -->
<template>
  <div class="buy-container">
    <div class="buy-form">
      <div class="buy-form-row">
        <div class="buy-form-item">
          <div class="buy-form-item-babel">活动名称</div>
          <el-input
            v-model="searchParams.actName"
            placeholder="请输入活动名称"
            maxlength="60"
          >
          </el-input>
        </div>
        <div class="buy-form-item">
          <div class="buy-form-item-babel">活动渠道</div>
          <el-select v-model="searchParams.actChannel" placeholder="请选择">
            <el-option v-for="(item,index) in $root.selectOption.channel" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <div class="buy-form-item">
          <div class="buy-form-item-babel">活动状态</div>
          <el-select v-model="searchParams.actStatus" placeholder="请选择">
            <el-option
              v-for="item in actStatusOptions"
              :key="item.key"
              :label="item.name"
              :value="item.key"
            />
          </el-select>
        </div>
      </div>
      <div class="buy-form-row">
        <div class="buy-form-item">
          <div class="buy-form-item-babel">活动开始时间</div>
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
        <div class="buy-form-item">
          <div class="buy-form-item-babel">活动结束时间</div>
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
        <div class="buy-form-item">
          <div class="buy-form-item-babel">是否灰度</div>
          <el-select v-model="searchParams.gray" placeholder="请选择">
            <el-option label="请选择" value=""></el-option>
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </div>
      </div>
      <div class="buy-form-rowBtns">
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
    <el-row class="buy-handelBtns cus-button">
      <el-button
        v-if="isAuth('sys:buyact:create')"
        icon="el-icon-cj"
        @click="handleFuncBtn('add')"
        >创建</el-button
      >
      <el-button v-if="isAuth('sys:buyact:update')" icon="el-icon-xg" @click="handleFuncBtn('edit')"
        >修改</el-button
      >
      <el-button
        v-if="isAuth('sys:buyact:online')"
        icon="el-icon-sx"
        @click="handleFuncBtn('online')"
        >正式上线</el-button
      >
      <el-button
        v-if="isAuth('sys:buyact:grayOnline')"
        icon="el-icon-sx"
        @click="handleFuncBtn('grayOnline')"
        >灰度上线</el-button
      >
      <el-button
        v-if="isAuth('sys:buyact:offline')"
        icon="el-icon-xx"
        @click="handleFuncBtn('offline')"
        >下线</el-button
      >
      <el-button v-if="isAuth('sys:buyact:delete')" icon="el-icon-sc" @click="handleFuncBtn('delete')"
        >删除</el-button
      >
      <el-button
        v-if="isAuth('sys:buyact:create')"
        icon="el-icon-copy"
        @click="handleFuncBtn('copy')"
        >复制</el-button
      >
    </el-row>
    <el-table
      ref="multipleTable"
      class="buy-table"
      :data="list"
      style="width: 100%"
      border
      :header-cell-style="{ background: '#FAFAFA', color: '#262626' }"
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column label="选择" fixed width="60" align="center">
        <template slot-scope="scope">
          <el-radio
            v-model="radio"
            :label="scope.$index"
            @change="onTableSelect(scope.row)"
            >&nbsp;</el-radio
          >
        </template>
      </el-table-column> -->
      <el-table-column type="selection" width="50"> </el-table-column>
      <el-table-column
        prop="actName"
        label="活动名称"
        width="180"
        align="center"
      >
        <template slot-scope="{ row }">
          <span class="buy-table-name" @click="handleDetail(row.actId)">{{
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
      <el-table-column prop="actChannel" label="活动渠道" align="center">
        <template slot-scope="{ row }">
          <!-- <span>{{ row.actChannel | channelFilter }}</span> -->
          <span>{{ $root.selectOption.channelObj[row.actChannel] }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="actStatus" label="活动状态" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.actStatus | statusFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="gray"
        label="是否灰度"
        align="center"
      >
        <template slot-scope="{ row }">
          <span>{{row.gray ? row.gray === '1' ? '是' : '否' : row.gray}}</span>
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
      :dialogVisible="addDialogVisible"
      @onCancel="handleCloce"
      @handleAddId="handleAddId"
    ></add-form>
    <el-dialog
      class="notice-dialog"
      title="提示"
      :visible.sync="noticeDialogVisible"
      width="375px"
    >
      <span>{{
        btnType === 'delete'
          ? '是否确认删除此抢购活动？'
          : btnType === 'online'
          ? '是否确认正式上线抢购活动？'
          : btnType === 'grayOnline' ? '是否确认灰度上线抢购活动' : '是否确认下线抢购活动？'
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
const actChannelKeyValue = actChannelOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.name
  return acc
}, {})
const actStatusKeyValue = actStatusOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.name
  return acc
}, {})
export default {
  name: 'buy',
  components: {
    vPagination,
    addForm
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
      // 查询参数
      searchParams: {
        actName: '',
        actChannel: '',
        actStatus: '',
        actBegtime: '',
        actEndtime: '',
        gray: ''
      },
      searchStatus: false,
      resetStatus: false,
      submitStatus: false,
      actId: '',
      currentActStatus: '',
      currentChannel: '',
      currentUser: '',
      addDialogVisible: false,
      noticeDialogVisible: false,
      btnType: '',
      multipleSelection: [],
      isUpdate: false,
      // 客户信息分页
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      // 抢购活动列表
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
          this.currentChannel !== this.$store.state.user.channel)
      )
    }
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 去前后空格
    removeSpace(obj) {
      Object.keys(obj).forEach(key => {
        if (key === 'actName') {
          obj[key] = obj[key].trim()
        }
      })
    },
    // 请求抢购活动表格数据
    getBuyActTableList(page, params) {
      API.buy
        .getBuyActListData(
          Object.assign(
            {
              current: page.currentPage,
              size: page.pageSize,
              actType: 1
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
    updateBuyActTableList() {
      this.actId = ''
      this.getBuyActTableList(this.page, this.searchParams)
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
      this.removeSpace(this.searchParams)
      this.searchStatus = true
      this.getBuyActTableList(this.page, this.searchParams)
    },
    // 查询重置
    onResetBtn() {
      this.actId = ''
      this.resetStatus = true
      this.searchParams = {
        actName: '',
        actChannel: '',
        actStatus: '',
        actBegtime: '',
        actEndtime: '',
        gray: ''
      }
      this.page.currentPage = 1
      this.getBuyActTableList(this.page)
    },
    // 分页
    pageChange(page) {
      this.actId = ''
      this.page.currentPage = page.page
      this.page.pageSize = page.limit
      this.getBuyActTableList(this.page, this.searchParams)
    },
    // 表格单选
    // onTableSelect(row) {
    //   this.currentActId = row.actId
    //   this.currentActStatus = row.actStatus
    //   this.currentChannel = row.actChannel
    //   this.currentUser = row.createEmpNo
    // },
    // 创建、修改、上线、下线、删除按钮
    handleFuncBtn(type) {
      if (type === 'add') {
        this.actId = ''
        this.btnType = type
        this.addDialogVisible = true
      } else {
        if (this.multipleSelection.length === 0) {
          this.showMessage('请选择活动！', 'warning')
          return
        }
        if (type === 'copy') {
          this.copyCheck(type)
        } else if (type === 'edit') {
          this.editCheck(type)
        } else {
          if (type === 'online' || type === 'grayOnline') {
            if (type === 'online' && this.multipleSelection[0].gray === '1') {
              this.actId = this.multipleSelection
                .map(row => {
                  return row.actId
                })
                .join(',')
              this.btnType = type
              this.noticeDialogVisible = true
              return
            }
            if (
              this.multipleSelection.filter(
                item => item.actChannel !== this.$store.state.user.channel
              ).length > 0
            ) {
              this.showMessage('只能上线本渠道的活动！', 'warning')
              return
            }
            if (
              this.multipleSelection.filter(item => item.actStatus !== '2')
                .length > 0
            ) {
              this.showMessage('同意状态的活动才能上线!', 'warning')
              return
            }
            this.actId = this.multipleSelection
              .map(row => {
                return row.actId
              })
              .join(',')
            this.btnType = type
            this.noticeDialogVisible = true
          } else if (type === 'offline') {
            if (this.multipleSelection.filter(item => item.actChannel !== this.$store.state.user.channel).length > 0) {
              this.showMessage('只能下线本渠道的活动！', 'warning')
              return
            }
            if (this.multipleSelection.filter(item => item.actStatus !== '4').length > 0) {
              this.showMessage('上线状态的活动才能下线!', 'warning')
              return
            }
            this.actId = this.multipleSelection.map(row => {
              return row.actId
            }).join(',')
            this.btnType = type
            this.noticeDialogVisible = true
          } else {
            if (this.multipleSelection.length > 1) {
              this.showMessage('只能对一条数据进行删除！', 'warning')
              return
            }
            const currentActStatus = this.multipleSelection[0].actStatus
            const currentChannel = this.multipleSelection[0].actChannel
            if (
              currentChannel !== '' &&
              currentChannel !== this.$store.state.user.channel
            ) {
              this.showMessage('只能删除本渠道的活动！', 'warning')
              return
            }
            // if (this.multipleSelection[0].createEmpNo !== this.$store.state.user.id) {
            //   this.showMessage('只能删除本人创建的活动！', 'warning')
            //   return
            // }
            if (
              currentActStatus === '1' ||
              currentActStatus === '3' ||
              currentActStatus === '6' ||
              currentActStatus === '7'
            ) {
              this.actId = this.multipleSelection[0].actId
              this.btnType = type
              this.noticeDialogVisible = true
            } else {
              this.showMessage(
                '草稿、驳回、下线、已结束状态的活动才能删除!',
                'warning'
              )
            }
          }
        }
      }
    },
    // 复制校验
    copyCheck(type) {
      if (this.multipleSelection.length > 1) {
        this.showMessage('只能对一条数据进行复制！', 'warning')
        return
      }
      const currentChannel = this.multipleSelection[0].actChannel
      if (
        currentChannel !== '' &&
        currentChannel !== this.$store.state.user.channel
      ) {
        this.showMessage('只能复制本渠道的活动！', 'warning')
        return
      }
      this.actId = this.multipleSelection[0].actId
      this.btnType = type
      this.addDialogVisible = true
    },
    // 修改校验
    editCheck(type) {
      if (this.multipleSelection.length > 1) {
        this.showMessage('只能对一条数据进行修改！', 'warning')
        return
      }
      const currentActStatus = this.multipleSelection[0].actStatus
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
      if (
        currentActStatus === '2' ||
        currentActStatus === '5' ||
        currentActStatus === '4' ||
        currentActStatus === '7' ||
        currentActStatus === '3'
      ) {
        this.showMessage(
          '同意、待审批、上线、下线、已结束状态的活动不支持修改!',
          'warning'
        )
      } else {
        this.actId = this.multipleSelection[0].actId
        this.btnType = type
        this.addDialogVisible = true
      }
    },
    handleDetail(id) {
      this.actId = id
      this.btnType = 'detail'
      this.addDialogVisible = true
    },
    // 创建第一步生成活动Id
    handleAddId(id) {
      this.actId = id
    },
    handleCloce(value) {
      if (this.btnType === 'add' || this.btnType === 'edit' || this.btnType === 'copy') {
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
    handleConfirm() {
      this.submitStatus = true
      if (this.btnType === 'delete') {
        API.buy
          .postDelBuyActData({
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
      } else {
        if (this.btnType === 'online' && this.multipleSelection[0].gray === '1') {
          API.buy.removeGray(this.actId).then(res => {
            this.submitStatus = false
            this.handleCloce()
            this.showMessage(res.data.msg, 'success')
            this.isUpdate = true
          })
          .catch(res => {
            this.submitStatus = false
            this.handleCloce()
            this.showMessage(res.msg, 'warning')
          })
          return
        }
        API.buy
          .postLineBuyActData({
            actId: this.actId,
            actStatus: this.btnType === 'offline' ? '3' : '4',
            modifyEmpName: this.$store.state.user.name,
            modifyEmpNo: this.$store.state.user.id,
            gray: this.btnType === 'online' ? '0' : '1'
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
    this.getBuyActTableList(this.page, this.searchParams)
  },
  watch: {
    isUpdate(value) {
      if (value) {
        this.updateBuyActTableList()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.buy-container {
  background: #ffffff;
  padding: 26px 35px 44px;

  .buy-form-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 25px;

    .buy-form-itemScore {
      display: flex;
      align-items: center;
      height: 36px;

      .buy-form-item-babel {
        width: 84px;
        margin-right: 22px;
      }

      .buy-form-item-line {
        margin: 0 16px;
      }

      .el-input {
        width: 106px;
      }
    }

    .buy-form-item {
      display: flex;
      align-items: center;

      .buy-form-item-babel {
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

  .buy-form-rowBtns {
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

  .buy-handelBtns {
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

  .buy-table {
    /deep/ tr {
      height: 52px;
    }

    /deep/ .cell {
      text-align: center;
    }

    /deep/ .el-radio__label {
      display: none;
    }

    .buy-table-name {
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
