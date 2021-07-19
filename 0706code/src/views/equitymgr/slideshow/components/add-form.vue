<template>
  <div class="slide-dialog">
    <el-dialog
      :title="type === 'add' ? '创建轮播图' : '修改轮播图'"
      :visible.sync="dialogVisible"
      width="668px"
      :before-close="handleClose"
    >
      <el-form
        v-loading="waitLoading"
        :model="slideForm"
        ref="slideForm"
        label-width="110px"
        class="demo-dynamic"
        size="mini"
        label-position="left"
      >
        <el-form-item
          label="活动类型:"
          prop="showType"
          :rules="{ required: true, message: '请输入活动类型', trigger: 'blur' }"
        >
          <el-select
            v-model="slideForm.showType"
            @change="slideForm.actName = '',slideForm.actId = ''"
          >
            <el-option label="活动" value="1"></el-option>
            <el-option label="名单" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="活动名称:"
          prop="actName"
          :rules="{ required: true, message: '请输入活动名称', trigger: 'blur' }"
        >
          <el-input
            :disabled="true"
            placeholder="请查询"
            v-model="slideForm.actName"
          >
            <i
              slot="suffix"
              class="el-input__icon el-icon-khz"
              @click="actDialogVisible = true"
            ></i>
          </el-input>
        </el-form-item>
        <el-form-item
          label="图片标题文字:"
          prop="pictureTitleText"
          :rules="[
            { required: true, message: '请输入图片标题文字', trigger: 'blur' },
            { min: 0, max: 60, message: '长度限制60字符内', trigger: 'blur' }
          ]"
        >
          <el-input
            placeholder="请输入图片标题文字"
            maxlength="60"
            v-model="slideForm.pictureTitleText"
          ></el-input>
        </el-form-item>
        <div class="info-form-row">
          <span style="color: #F56C6C; margin-right:4px">*</span>
          <el-form-item
            label="轮播图片:"
            label-width="100px"
            prop="pictureName"
          >
            <el-input
              disabled
              placeholder="请选择"
              v-model="slideForm.pictureName"
            >
              <el-upload
                :slot="type === 'detail' ? '' : 'append'"
                ref="upload"
                action
                class="upload-demo"
                accept=".png, .jpg, .jpeg"
                :show-file-list="false"
                :auto-upload="false"
                :before-upload="beforeUpload"
                :file-list="pictureList"
                :http-request="handleRequest"
                :multiple="false"
                :on-change="handleChangeFile"
              >
                <span v-if="type !== 'detail'">选择文件</span>
                <div
                  style="position: absolute;left: -170px;top: 25px;color:#ff0000"
                >
                  <span v-if="message">{{ message }}</span>
                </div>
              </el-upload>
            </el-input>
            <el-button
              size="small"
              type="primary"
              v-if="type !== 'detail'"
              @click="uploadImg"
              >导入</el-button
            >
          </el-form-item>
        </div>
        <div class="slide-dialog-btns">
          <el-button type="primary" :loading="btnStatus" @click="handleSubmit"
            >提交</el-button
          >
          <el-button :disabled="btnStatus" @click="handleClose">取消</el-button>
        </div>
      </el-form>
      <el-dialog
        class="act-dialog"
        title="查询"
        :visible.sync="actDialogVisible"
        width="780px"
        append-to-body
      >
        <div style="width: 100%">
          <div class="act-dialog-search">
            <div class="search-input">
              <div class="search-input-item">
                <div class="search-input-label">活动类型</div>
                <el-select
                  v-model="actSearchParams.actType"
                  :disabled="slideForm.showType === '2'"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in $root.selectOption.actType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>
              <div class="search-input-item">
                <div class="search-input-label">活动渠道</div>
                <el-select v-model="actSearchParams.actChannel" disabled>
                  <el-option v-for="(item,index) in $root.selectOption.channel" :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </div>
            </div>
            <div class="search-input">
              <div class="search-input-item">
                <div class="search-input-label">活动名称</div>
                <el-input
                  placeholder="请输入活动名称"
                  v-model="actSearchParams.actName"
                ></el-input>
              </div>
              <div class="search-input-item">
                <div class="search-input-label">活动状态</div>
                <el-select
                  v-model="actSearchParams.actStatus"
                  placeholder="请选择"
                  disabled
                >
                  <el-option
                    v-for="item in statusOptions"
                    :key="item.key"
                    :label="item.name"
                    :value="item.key"
                  />
                </el-select>
              </div>
            </div>
            <div class="search-btns">
              <el-button
                type="primary"
                icon="el-icon-query"
                @click="onSearchBtn"
                >查询</el-button
              >
              <el-button icon="el-icon-reset" @click="onResetBtn"
                >重置</el-button
              >
            </div>
          </div>
          <el-table
            class="act-dialog-table"
            :data="actTableData"
            border
            :header-cell-style="{ background: '#80A639', color: '#ffffff' }"
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
            </el-table-column>
            <el-table-column
              label="活动类型"
              align="center"
            >
              <template slot-scope="{ row }">
                <span>{{ actTypeObj[row.actType] }}</span>
              </template>              
            </el-table-column>
            <el-table-column prop="actChannel" label="活动渠道" align="center">
              <template slot-scope="{ row }">
                <span>{{ $root.selectOption.channelObj[row.actChannel] }}</span>
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
            <el-table-column prop="actChannel" label="活动状态" align="center">
              <template slot-scope="{ row }">
                <span>{{ row.actStatus | statusFilter }}</span>
              </template>
            </el-table-column>
          </el-table>
          <v-pagination
            :total="page.total"
            :currentPageNum="page.currentPage"
            :currentPageSize="page.pageSize"
            @pageChange="pageChange"
          ></v-pagination>
          <div class="act-dialog-btns">
            <el-button type="primary" @click="handleAdd">添 加</el-button>
            <el-button @click="actDialogVisible = false">返 回</el-button>
          </div>
        </div>
      </el-dialog>
      <el-dialog
        class="add-notice-dialog"
        title="提示"
        :visible.sync="noticeDialogVisible"
        width="375px"
        append-to-body
      >
        <span>是否确认提交？</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleConfirm">确 认</el-button>
          <el-button @click="noticeDialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </el-dialog>
  </div>
</template>
<script>
import API from '@/api'
import vPagination from '@/components/pagination/pagination'
import { validateImg, imgFormat } from '@/utils/validate'
const typeOptions = [
  {
    key: '',
    name: '请选择'
  },
  {
    key: '1',
    name: '权益活动'
  },
  {
    key: '2',
    name: '抽奖活动'
  },
  {
    key: '3',
    name: '抢购活动'
  },
  {
    key: '4',
    name: '票选活动'
  }
]
const statusOptions = [
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
  }, {
    key: '7',
    name: '已结束'
  }
]
const typeKeyValue = typeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.name
  return acc
}, {})
const statusKeyValue = statusOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.name
  return acc
}, {})
export default {
  components: {
    vPagination
  },
  filters: {
    statusFilter(num) {
      return statusKeyValue[num]
    },
    typeFilter(num) {
      return typeKeyValue[num]
    }
  },
  props: {
    id: {
      type: String
    },
    type: {
      type: String
    },
    // 弹框显隐
    dialogVisible: {
      type: Boolean
    },
    slideInfo: {
      type: Object
    }
  },
  data() {
    return {
      typeOptions,
      statusOptions,
      waitLoading: false,
      slideForm: {
        actName: '',
        actId: '',
        actType: '',
        pictureTitleText: '',
        pictureName: '',
        pictureUrl: '',
        showType: '1'
      },
      pictureList: [],
      message: '',
      noticeDialogVisible: false,
      actDialogVisible: false,
      actSearchParams: {
        actType: '',
        actChannel: this.$store.state.user.channel,
        actName: '',
        actStatus: '4'
      },
      radio: '',
      selectActId: '',
      selectActName: '',
      selectActType: '',
      btnStatus: false,
      actTableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      formData: new FormData(),
      actTypeObj: {}
    }
  },
  methods: {
    // 图片check
    beforeUpload(file) {
      if (imgFormat(file)) {
        // this.previewLoading = false
        this.pictureList = []
        this.slideForm.pictureName = ''
        this.slideForm.pictureUrl = ''
        this.$refs.upload.clearFiles()
        this.resetForm()
        return
      }
      let _this = this
      let imgWidth = 700
      let imgHight = 240
      validateImg(file, imgWidth, imgHight)
        .then(() => {
          this.uploadImage()
        })
        .catch(() => {
          _this.$message.warning({
            message: `上传文件的图片大小不合符标准,宽需要为${imgWidth}px，高需要为${imgHight}px。`
          })
          // this.previewLoading = false
          this.pictureList = []
          this.slideForm.pictureName = ''
          this.slideForm.pictureUrl = ''
          this.$refs.upload.clearFiles()
          this.resetForm()
        })
    },
    // 选择图片变更
    handleChangeFile(file, fileList) {
      // 只有一张图片
      this.pictureList = []
      this.pictureList.push(fileList[fileList.length - 1])
      this.slideForm.pictureName = file.name
      this.slideForm.pictureUrl = ''
      this.message = ''
    },
    // 图片上传
    uploadImage() {
      API.common
        .upload(this.formData)
        .then(res => {
          this.slideForm.pictureUrl = res.data.data[0].fileUrl
          this.resetForm()
          this.$message.success('上传成功！')
        })
        .catch(() => {
          this.pictureList = []
          this.slideForm.pictureName = ''
          this.slideForm.pictureUrl = ''
          this.$message.error('上传失败！')
          this.resetForm()
          // this.uploadDetailLoading = false
        })
    },
    // 导入
    handleRequest(param) {
      this.formData.append('files', param.file)
    },
    uploadImg() {
      this.message = ''
      if (this.pictureList.length === 0) {
        this.message = '请选择后图片再导入'
        return
      }
      this.formData = new FormData()
      this.$refs.upload.submit()
    },
    // 清空input val
    resetForm() {
      // 判断ie10以及以下
      let isIE10 = window.navigator.userAgent.indexOf('MSIE') >= 1
      let ele = this.$refs.upload.$el.getElementsByTagName('input')[0]
      if (isIE10) {
        let form = document.createElement('form')
        let beforInput = ele.nextSibling
        let parentInput = ele.parentNode
        form.appendChild(ele)
        form.reset()
        parentInput.insertBefore(ele, beforInput)
      } else {
        ele.value = null
      }
    },
    handleSubmit() {
      this.$refs['slideForm'].validate(valid => {
        this.message = ''
        if (!this.slideForm.pictureName) {
          this.message = '请选择图片'
          return
        }
        if (!this.slideForm.pictureUrl) {
          this.message = '请导入图片'
          return
        }
        if (valid && !this.message) {
          this.noticeDialogVisible = true
        } else {
          return false
        }
      })
    },
    handleConfirm() {
      this.btnStatus = true
      this.$emit('handleConfirm', this.slideForm)
      this.noticeDialogVisible = false
    },
    handleClose() {
      this.$emit('onCancel')
    },
    // 请求活动列表数据
    getActTableList(page, showType) {
      const addValue = showType === '2'
      ? {
        releaseStatus: '2'
      }
      : {}
      API.slide
        .getSlideActData(
          Object.assign(
            {
              current: page.currentPage,
              size: page.pageSize
            },
            this.actSearchParams,
            addValue
          )
        )
        .then(response => {
          this.actTableData = response.data.data.records
          this.page.total = response.data.data.total
        })
        .catch(() => {})
    },
    // 去前后空格
    removeSpace(obj) {
      Object.keys(obj).forEach(key => {
        if (key === 'actName') {
          obj[key] = obj[key].trim()
        }
      })
    },
    // 查询
    onSearchBtn() {
      this.page.currentPage = 1
      this.radio = ''
      this.selectActId = ''
      this.selectActName = ''
      this.selectActType = ''
      this.removeSpace(this.actSearchParams)
      this.getActTableList(this.page, this.slideForm.showType)
    },
    // 查询重置
    onResetBtn() {
      this.resetParams()
      this.getActTableList(this.page, this.slideForm.showType)
    },
    // 重置
    resetParams() {
      this.actSearchParams = {
        actType: '',
        actChannel: this.$store.state.user.channel,
        actName: '',
        actStatus: '4'
      }
      this.page.currentPage = 1
      this.radio = ''
      this.selectActId = ''
      this.selectActName = ''
      this.selectActType = ''
    },
    // 分页
    pageChange(page) {
      this.radio = ''
      this.selectActId = ''
      this.selectActName = ''
      this.selectActType = ''
      this.page.currentPage = page.page
      this.page.pageSize = page.limit
      this.getActTableList(this.page, this.slideForm.showType)
    },
    // 表格单选
    onTableSelect(row) {
      this.selectActId = row.actId
      this.selectActName = row.actName
      this.selectActType = row.actType
    },
    // 添加
    handleAdd() {
      if (!this.selectActId) {
        this.$message({
          message: '请选择!',
          type: 'warning'
        })
      } else {
        this.slideForm.actId = this.selectActId
        this.slideForm.actName = this.selectActName
        this.slideForm.actType = this.selectActType
        this.actDialogVisible = false
      }
    }
  },
  watch: {
    dialogVisible(value) {
      if (value && this.type === 'edit') {
        this.$nextTick(() => {
          this.waitLoading = true
          API.slide.getSlideDetailData({
            id: this.id
          }).then(response => {
            var resData = response.data.data
            this.slideForm = {
              actName: resData.actName,
              actId: resData.actId,
              actType: resData.actType,
              pictureName: resData.pictureName,
              pictureTitleText: resData.pictureTitleText,
              pictureUrl: resData.pictureUrl,
              showType: resData.showType
            }
            this.waitLoading = false
          }).catch(response => {
            this.waitLoading = false
            this.$message({
              message: response.msg,
              type: 'warning'
            })
          })
        })
      } else {
        this.btnStatus = false
        if (this.$refs['slideForm']) {
          this.$refs['slideForm'].clearValidate()
        }
        this.message = ''
        this.pictureList = []
        this.slideForm = {
          actName: '',
          actId: '',
          actType: '',
          pictureTitleText: '',
          pictureName: '',
          pictureUrl: '',
          showType: '1'
        }
      }
    },
    actDialogVisible(value) {
      if (value) {
        if (this.slideForm.showType === '2') {
          this.actSearchParams.actType = '5'
        }
        this.getActTableList(this.page, this.slideForm.showType)
      } else {
        this.page = {
          total: 0,
          currentPage: 1,
          pageSize: 10
        }
        this.actTableData = []
        this.resetParams()
      }
    }
  },
  created() {
    this.actTypeObj = this.$root.selectOption.actType.reduce((acc, cur) => {
      acc[cur.value] = cur.label
      return acc
    }, {})
  }
}
</script>
<style lang="scss" scoped>
.slide-dialog {
  /deep/ .el-input__icon {
    line-height: 26px;
  }

  /deep/ .el-form-item__label {
    line-height: 26px;
    padding: 0;
  }

  /deep/ .el-form-item__content {
    line-height: 26px;
  }

  /deep/ .el-input {
    width: 260px;

    /deep/ .el-input__inner {
      height: 26px;
    }
  }

  .el-icon-khz {
    width: 16px;
    height: 19px;
    background: url(../imgs/khz.png) center no-repeat;
    background-size: cover;
    position: relative;
    top: 3px;
    cursor: pointer;
  }

  .slide-dialog-btns {
    display: flex;
    justify-content: center;
  }

  .slide-upload {
    display: flex;
    justify-content: center;
    margin-bottom: 30px;

    .slide-upload-label {
      width: 110px;

      .slide-upload-label-required {
        color: #f56c6c;
        margin-right: 4px;
      }
    }

    .slide-upload-btn {
      height: 26px;
      padding: 0 10px;
      margin-left: 10px;
    }

    .el-input {
      width: 204px;

      /deep/ .el-input-group__append {
        padding: 0px 6px;
      }
    }
  }
  .info-form-row {
    display: flex;
  }
}

.act-dialog {
  .act-dialog-search {
    .search-input {
      display: flex;
      justify-content: space-around;
      margin-bottom: 20px;

      /deep/ .el-input {
        width: 200px;

        /deep/ .el-input__inner {
          height: 34px;
        }
      }
    }
  }

  .search-input-item {
    display: flex;
    align-items: center;
  }

  .search-input-label {
    width: 70px;
    margin-right: 16px;
  }

  .search-btns {
    margin: 30px 0;
    display: flex;
    justify-content: center;
  }

  .act-dialog-btns {
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

  .act-dialog-table {
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

.add-notice-dialog {
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
