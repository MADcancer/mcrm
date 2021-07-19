<template>
  <div class="slide-container">
    <div class="slide-form">
      <div class="slide-form-row">
        <div class="slide-form-item">
          <div class="slide-form-item-babel">活动名称</div>
          <el-input
            v-model="searchParams.actName"
            placeholder="请输入活动名称"
            maxlength="50"
          >
          </el-input>
        </div>
        <div class="slide-form-item">
          <div class="slide-form-item-babel">活动渠道</div>
          <el-select v-model="searchParams.actChannel" placeholder="请选择">
            <el-option v-for="(item,index) in $root.selectOption.channel" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <div class="slide-form-item">
          <div class="slide-form-item-babel">活动状态</div>
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
      <div class="slide-form-row">
        <div class="slide-form-item">
          <div class="slide-form-item-babel">活动开始时间</div>
          <el-date-picker
            v-model="searchParams.actBegtime"
            type="datetime"
            value-format="yyyy/MM/dd HH:mm:ss"
            format="yyyy/MM/dd HH:mm:ss"
            placeholder="请选择活动开始时间"
            :editable="false"
          >
          </el-date-picker>
        </div>
        <div class="slide-form-item">
          <div class="slide-form-item-babel">活动结束时间</div>
          <el-date-picker
            v-model="searchParams.actEndtime"
            type="datetime"
            value-format="yyyy/MM/dd HH:mm:ss"
            format="yyyy/MM/dd HH:mm:ss"
            placeholder="请选择活动结束时间"
            :editable="false"
          >
          </el-date-picker>
        </div>
        <div class="slide-form-item">
          <div class="slide-form-item-babel">轮播图状态</div>
          <el-select
            v-model="searchParams.slideshowStatus"
            placeholder="请选择"
          >
            <el-option
              v-for="item in slideOptions"
              :key="item.key"
              :label="item.name"
              :value="item.key"
            />
          </el-select>
        </div>
      </div>
      <div class="slide-form-rowBtns">
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
    <el-row class="slide-handelBtns cus-button">
      <el-button
        v-if="isAuth('sys:slideshow:create')"
        icon="el-icon-cj"
        @click="handleFuncBtn('add')"
        >创建</el-button
      >
      <el-button
        v-if="isAuth('sys:slideshow:update')"
        icon="el-icon-xg"
        :disabled="buttonEditDisabled"
        @click="handleFuncBtn('edit')"
        >修改</el-button
      >
      <el-button
        v-if="isAuth('sys:slideshow:online')"
        icon="el-icon-sx"
        :disabled="buttonDisabled"
        @click="handleFuncBtn('online')"
        >上线</el-button
      >
      <el-button
        v-if="isAuth('sys:slideshow:offline')"
        icon="el-icon-xx"
        :disabled="buttonDisabled"
        @click="handleFuncBtn('offline')"
        >下线</el-button
      >
      <el-button
        v-if="isAuth('sys:slideshow:delete')"
        icon="el-icon-sc"
        :disabled="buttonEditDisabled"
        @click="handleFuncBtn('delete')"
        >删除</el-button
      >
    </el-row>
    <el-table
      class="slide-table"
      :data="list"
      style="width: 100%"
      border
      :header-cell-style="{ background: '#FAFAFA', color: '#262626' }"
    >
      <el-table-column label="选择" fixed width="60" align="center">
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
        prop="actName"
        label="活动名称"
        width="180"
        align="center"
      >
        <template slot-scope="{ row }">
          <span class="slide-table-name" @click="handleDetail(row.id)">{{
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
          <span>{{ $root.selectOption.channelObj[row.actChannel] }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="actStatus" label="活动状态" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.actStatus | statusFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="showType"
        label="展示类型"
        align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ showType[row.showType] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="actStatus"
        label="轮播图状态"
        width="100"
        align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.slideshowStatus | slideFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="slideshowOrder"
        label="轮播图顺序"
        width="100"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="createDate"
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
    </el-table>
    <v-pagination
      :total="page.total"
      :currentPageNum="page.currentPage"
      :currentPageSize="page.pageSize"
      @pageChange="pageChange"
    ></v-pagination>
    <add-form
      ref="addChild"
      :type="btnType"
      :id="slideId"
      :dialogVisible="addDialogVisible"
      @handleConfirm="handleConfirm"
      @onCancel="handleClose"
    ></add-form>
    <detail-form
      :id="slideId"
      :dialogVisible="detailDialogVisible"
      @onCancel="handleClose"
    ></detail-form>
    <online-form
      ref="onlineChild"
      :dialogVisible="onlineDialogVisible"
      @handleConfirm="handleConfirm"
      @onCancel="handleClose"
    ></online-form>
    <el-dialog
      class="slide-notice-dialog"
      title="提示"
      :visible.sync="noticeDialogVisible"
      width="375px"
    >
      <span>{{
        btnType === 'delete'
          ? '是否确认删除此轮播图？'
          : '是否确认下线此轮播图？'
      }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="submitStatus" @click="handleConfirm"
          >确 认</el-button
        >
        <el-button :disabled="submitStatus" @click="handleClose"
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
import detailForm from './components/detail-form'
import onlineForm from './components/online-form'
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
const slideOptions = [
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
const slideStatusKeyValue = slideOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.name
  return acc
}, {})
export default {
  name: 'slide',
  components: {
    vPagination,
    addForm,
    detailForm,
    onlineForm
  },
  filters: {
    channelFilter(num) {
      return actChannelKeyValue[num]
    },
    statusFilter(num) {
      return actStatusKeyValue[num]
    },
    slideFilter(num) {
      return slideStatusKeyValue[num]
    }
  },
  data() {
    return {
      actChannelOptions,
      actStatusOptions,
      slideOptions,
      // 查询参数
      searchParams: {
        actName: '',
        actChannel: '',
        actStatus: '',
        slideshowStatus: '',
        actBegtime: '',
        actEndtime: ''
      },
      searchStatus: false,
      resetStatus: false,
      submitStatus: false,
      slideId: '',
      currentSlideId: '',
      currentSlideInfo: {},
      currentActStatus: '',
      currentSlideStatus: '',
      addDialogVisible: false,
      detailDialogVisible: false,
      onlineDialogVisible: false,
      noticeDialogVisible: false,
      btnType: '',
      radio: '',
      isUpdate: false, // 是否更新列表数据
      // 客户信息分页
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      // 客户信息列表
      list: [],
      showType: {
        '1': '活动',
        '2': '名单'
      }
    }
  },
  computed: {
    buttonDisabled() {
      return (
        this.currentSlideInfo.actChannel &&
        this.currentSlideInfo.actChannel !== this.$store.state.user.channel
      )
    },

    buttonEditDisabled() {
      return (
        (this.currentSlideInfo.actChannel &&
          this.currentSlideInfo.actChannel !==
            this.$store.state.user.channel)
      )
    }
  },
  methods: {
    // 去前后空格
    removeSpace(obj) {
      Object.keys(obj).forEach(key => {
        if (key === 'actName') {
          obj[key] = obj[key].trim()
        }
      })
    },
    // 请求轮播图管理表格数据
    getSlideTableList(page, params) {
      API.slide
        .getSlideListData(
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
    updateSlideTableList() {
      this.radio = ''
      this.currentSlideId = ''
      this.currentSlideInfo = {}
      this.currentActStatus = ''
      this.getSlideTableList(this.page, this.searchParams)
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
      this.radio = ''
      this.currentSlideId = ''
      this.currentSlideInfo = {}
      this.currentActStatus = ''
      this.searchStatus = true
      this.page.currentPage = 1
      this.removeSpace(this.searchParams)
      this.getSlideTableList(this.page, this.searchParams)
    },
    // 查询重置
    onResetBtn() {
      this.resetStatus = true
      this.radio = ''
      this.currentSlideId = ''
      this.currentSlideInfo = {}
      this.currentActStatus = ''
      this.searchParams = {
        actName: '',
        actChannel: '',
        actStatus: '',
        slideshowStatus: '',
        actBegtime: '',
        actEndtime: ''
      }
      this.page.currentPage = 1
      this.getSlideTableList(this.page)
    },
    // 分页
    pageChange(page) {
      this.radio = ''
      this.currentSlideId = ''
      this.currentSlideInfo = {}
      this.currentActStatus = ''
      this.page.currentPage = page.page
      this.page.pageSize = page.limit
      this.getSlideTableList(this.page, this.searchParams)
    },
    // 表格单选
    onTableSelect(row) {
      this.currentSlideId = row.id
      this.currentSlideInfo = row
      this.currentActStatus = row.actStatus
      this.currentSlideStatus = row.slideshowStatus
    },
    // 创建、修改、上线、下线、删除按钮
    handleFuncBtn(type) {
      if (type === 'add') {
        this.slideId = ''
        this.btnType = type
        this.addDialogVisible = true
      } else if (type === 'edit') {
        if (!this.currentSlideId) {
          this.showMessage('请选择活动!', 'warning')
        } else {
          if (
            this.currentSlideStatus === '2' ||
            this.currentSlideStatus === '5' ||
            this.currentSlideStatus === '4'
          ) {
            this.showMessage(
              '同意、待审批、上线状态的轮播图活动不支持修改!',
              'warning'
            )
          } else {
            this.slideId = this.currentSlideId
            this.btnType = type
            this.addDialogVisible = true
          }
        }
      } else {
        if (!this.currentSlideId) {
          this.showMessage('请选择活动!', 'warning')
        } else {
          if (type === 'online') {
            if (
              this.currentActStatus === '4' &&
              this.currentSlideStatus === '2'
            ) {
              API.slide
                .postSlideOrderSearchData(this.$store.state.user.channel)
                .then(response => {
                  var slideData = response.data.data.data
                  var flag = true
                  Object.keys(slideData).forEach(key => {
                    if (slideData[key] === 2) {
                      flag = false
                    }
                  })
                  if (!flag) {
                    this.slideId = this.currentSlideId
                    this.btnType = type
                    this.onlineDialogVisible = true
                  } else {
                    this.showMessage('已上线5张轮播图！', 'warning')
                  }
                })
                .catch(() => {})
            } else {
              this.showMessage(
                '活动状态为上线且轮播图状态为同意才可以上线!',
                'warning'
              )
            }
          } else if (type === 'offline') {
            if (this.currentSlideStatus !== '4') {
              this.showMessage('上线状态的轮播图活动才能下线!', 'warning')
            } else {
              this.slideId = this.currentSlideId
              this.btnType = type
              this.noticeDialogVisible = true
            }
          } else {
            if (
              this.currentSlideStatus === '1' ||
              this.currentSlideStatus === '3' ||
              this.currentSlideStatus === '6'
            ) {
              this.slideId = this.currentSlideId
              this.btnType = type
              this.noticeDialogVisible = true
            } else {
              this.showMessage(
                '草稿、驳回、下线状态的轮播图活动才能删除!',
                'warning'
              )
            }
          }
        }
      }
    },
    handleDetail(id) {
      this.slideId = id
      this.btnType = 'detail'
      this.detailDialogVisible = true
    },
    handleConfirm(obj) {
      var userInfo = {
        createEmpName:
          this.btnType === 'add' ? this.$store.state.user.name : '',
        createEmpNo: this.btnType === 'add' ? this.$store.state.user.id : '',
        modifyEmpName:
          this.btnType === 'add' ? '' : this.$store.state.user.name,
        modifyEmpNo: this.btnType === 'add' ? '' : this.$store.state.user.id
      }
      if (this.btnType === 'add' || this.btnType === 'edit') {
        API.slide
          .postSaveSlideData(
            Object.assign(
              {
                id: this.slideId
              },
              userInfo,
              obj
            )
          )
          .then(response => {
            this.$refs.addChild.btnStatus = false
            this.handleClose()
            this.showMessage(response.data.msg, 'success')
            this.isUpdate = true
          })
          .catch(response => {
            this.$refs.addChild.btnStatus = false
            this.showMessage(response.msg, 'warning')
          })
      } else if (this.btnType === 'online') {
        API.slide
          .postSlidelineData(
            Object.assign(
              {
                id: this.slideId,
                slideshowStatus: '4',
                modifyEmpName: this.$store.state.user.name,
                modifyEmpNo: this.$store.state.user.id
              },
              obj
            )
          )
          .then(response => {
            this.$refs.onlineChild.btnStatus = false
            this.handleClose()
            this.showMessage(response.data.msg, 'success')
            this.isUpdate = true
          })
          .catch(response => {
            this.$refs.onlineChild.btnStatus = false
            this.showMessage(response.msg, 'warning')
          })
      } else if (this.btnType === 'offline') {
        this.submitStatus = true
        API.slide
          .postSlidelineData({
            id: this.slideId,
            slideshowStatus: '3',
            modifyEmpName: this.$store.state.user.name,
            modifyEmpNo: this.$store.state.user.id
          })
          .then(response => {
            this.submitStatus = false
            this.handleClose()
            this.showMessage(response.data.msg, 'success')
            this.isUpdate = true
          })
          .catch(response => {
            this.submitStatus = false
            this.showMessage(response.msg, 'warning')
          })
      } else if (this.btnType === 'delete') {
        this.submitStatus = true
        API.slide
          .postDelSlideData({
            id: this.slideId,
            modifyEmpName: this.$store.state.user.name,
            modifyEmpNo: this.$store.state.user.id
          })
          .then(response => {
            this.submitStatus = false
            this.handleClose()
            this.showMessage(response.data.msg, 'success')
            this.isUpdate = true
          })
          .catch(response => {
            this.submitStatus = false
            this.showMessage(response.msg, 'warning')
          })
      }
    },
    handleClose() {
      if (this.btnType === 'add' || this.btnType === 'edit') {
        this.addDialogVisible = false
      } else if (this.btnType === 'online') {
        this.onlineDialogVisible = false
      } else if (this.btnType === 'detail') {
        this.detailDialogVisible = false
      } else {
        this.noticeDialogVisible = false
      }
      setTimeout(() => {
        this.btnType = ''
      }, 350)
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
      this.searchParams.slideshowStatus = this.$route.query.status
      if (this.$route.query.type && this.$route.query.type === 1) {
        this.searchParams.actChannel = this.$store.state.user.channel
        this.searchParams.createEmpNo = this.$store.state.user.id
        this.searchParams.createEmpName = this.$store.state.user.name
      }
    }
    this.getSlideTableList(this.page, this.searchParams)
  },
  watch: {
    isUpdate(value) {
      if (value) {
        this.updateSlideTableList()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.slide-container {
  background: #ffffff;
  padding: 26px 35px 44px;

  .slide-form-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 25px;

    .slide-form-itemScore {
      display: flex;
      align-items: center;
      height: 36px;

      .slide-form-item-babel {
        width: 84px;
        margin-right: 22px;
      }

      .slide-form-item-line {
        margin: 0 16px;
      }

      .el-input {
        width: 106px;
      }
    }

    .slide-form-item {
      display: flex;
      align-items: center;

      .slide-form-item-babel {
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

  .slide-form-rowBtns {
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

  .slide-handelBtns {
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
    }
  }

  .slide-table {
    /deep/ tr {
      height: 52px;
    }

    /deep/ .el-radio__label {
      display: none;
    }

    .slide-table-name {
      color: #80a639;
      cursor: pointer;
      text-decoration: underline;
    }
  }

  .slide-notice-dialog {
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
}
</style>
