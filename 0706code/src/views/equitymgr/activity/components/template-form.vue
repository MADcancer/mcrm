<template>
  <div class="info-form">
    <el-form
      :model="templateForm"
      ref="templateForm"
      label-width="110px"
      class="demo-dynamic"
      size="mini"
      label-position="left"
    >
      <div class="info-form-row">
        <el-form-item
          label="活动标题文字:"
          prop="actHead"
          :rules="[
            { required: true, message: '请输入', trigger: 'blur' },
            { min: 0, max: 60, message: '长度限制60字符内', trigger: 'blur' }
          ]"
        >
          <el-input
            :disabled="type === 'detail'"
            placeholder="请输入"
            maxlength="60"
            v-model="templateForm.actHead"
          ></el-input>
        </el-form-item>
      </div>
      <div class="info-form-row">
        <el-form-item
          label="副标题文字:"
          prop="actsubhead"
          :rules="[
            { min: 0, max: 60, message: '长度限制60字符内', trigger: 'blur' }
          ]"
        >
          <el-input
            :disabled="type === 'detail'"
            placeholder="请输入"
            maxlength="60"
            v-model="templateForm.actsubhead"
          ></el-input>
        </el-form-item>
      </div>
      <div class="info-form-row">
        <el-form-item
          label="活动细则:"
          prop="actRules"
          :rules="[
            { required: true, message: '请输入', trigger: 'blur' },
            { min: 0, max: 500, message: '长度限制500字符内', trigger: 'blur' }
          ]"
        >
          <el-input
            :disabled="type === 'detail'"
            type="textarea"
            :rows="8"
            maxlength="500"
            placeholder="请输入"
            v-model="templateForm.actRules"
          ></el-input>
        </el-form-item>
      </div>
      <div class="info-form-row img">
        <span style="color: #F56C6C; margin-right:4px">*</span>
        <el-form-item label="活动图片:" label-width="100px" prop="pictureName">
          <el-input
            disabled
            placeholder="请选择"
            v-model="templateForm.pictureName"
          >
            <el-upload
              :slot="type === 'detail'? '' : 'append'"
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
          <el-button size="small" type="primary" v-if="type !== 'detail'" @click="uploadImg">导入</el-button>
          <el-button v-if="type === 'detail'" size="small" type="primary" @click="previewImg">预览</el-button>
        </el-form-item>
      </div>
    </el-form>

    <el-dialog
      class="notice-dialog"
      title="提示"
      :visible.sync="noticeDialogVisible"
      width="300px"
      append-to-body
    >
      <span>是否确认提交？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleConfirm">确 认</el-button>
        <el-button @click="noticeDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 预览 图片 -->
    <el-dialog
      class="img-dialog"
      title="图片预览"
      :visible.sync="imgShow"
      width="780px"
      append-to-body 
    >
      <div class="preview-img">
        <img :src='`${baseUrl}/${templateForm.pictureUrl}`' style="width: 700px;" />
      </div>
    </el-dialog>
  </div>
</template>
<script>
import API from '@/api'
import { baseUrl } from '@/utils'
import { validateImg, imgFormat } from '@/utils/validate'
export default {
  props: {
    actId: {
      type: String
    },
    type: {
      type: String
    },
    active: {
      type: Number
    }
  },
  data() {
    return {
      templateForm: {
        actHead: '',
        actsubhead: '',
        actRules: '',
        pictureName: '',
        pictureUrl: ''
      },
      noticeDialogVisible: false,
      pictureList: [],
      formData: new FormData(),
      message: '',
      imgShow: false,
      baseUrl: baseUrl()
    }
  },
  methods: {
    // 图片check
    beforeUpload(file) {
      // 文件不能超过2M
      if (imgFormat(file)) {
        // this.previewLoading = false
        this.pictureList = []
        this.templateForm.pictureName = ''
        this.templateForm.pictureUrl = ''
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
          this.templateForm.pictureName = ''
          this.templateForm.pictureUrl = ''
          this.$refs.upload.clearFiles()
          this.resetForm()
        })
    },
    // 选择图片变更
    handleChangeFile(file, fileList) {
      // 只有一张图片
      this.pictureList = []
      this.pictureList.push(fileList[fileList.length - 1])
      this.templateForm.pictureName = file.name
      this.templateForm.pictureUrl = ''
      this.message = ''
    },
    // 图片上传
    uploadImage() {
      API.common
        .upload(this.formData)
        .then(res => {
          this.templateForm.pictureUrl = res.data.data[0].fileUrl
          // this.uploadDetailLoading = false
          // this.uploadDetailFlg = true
          this.resetForm()
          this.$message.success('上传成功！')
        })
        .catch(() => {
          this.pictureList = []
          this.templateForm.pictureName = ''
          this.templateForm.pictureUrl = ''
          this.resetForm()
          this.$message.error('上传失败！')
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
    // 清空upload input
    resetForm() {
      // 判断ie10以及以下
      let isIE10 = window.navigator.userAgent.indexOf('MSIE') >= 1
      let ele = this.$refs.upload.$el.getElementsByTagName('input')[0]
      console.log(ele)
      if (isIE10) {
        let form = document.createElement('form')
        let beforInput = ele.nextSibling
        let parentInput = ele.parentNode
        form.appendChild(ele)
        form.reset()
        parentInput.insertBefore(ele, beforInput)
        console.log(ele)
      } else {
        ele.value = null
      }
    },
    // 图片预览
    previewImg(url) {
      if (!this.templateForm.pictureUrl) {
        this.$message.info('还没有上传的图片！')
        return
      }
      this.imgShow = true
    },
    // 加载权益活动基本信息
    getEquityActBase() {
      this.pictureList = []
      API.activity
        .getEquityActBaseData(this.actId)
        .then(response => {
          var data = response.data.data
          this.templateForm = {
            actHead: data.actHead,
            actsubhead: data.actsubhead,
            actRules: data.actRules,
            pictureName: data.pictureName,
            pictureUrl: data.pictureUrl
          }
        })
        .catch(() => {})
    },
    handleSubmit() {
      this.$refs['templateForm'].validate(valid => {
        this.message = ''
        if (!this.templateForm.pictureName) {
          this.message = '请选择图片'
          return
        }
        if (!this.templateForm.pictureUrl) {
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
      this.$emit('handleNext', this.templateForm)
      this.noticeDialogVisible = false
    }
  },
  created() {
    if (this.type === 'edit' || this.type === 'detail' || this.type === 'copy') {
      this.getEquityActBase()
    }
  },
  watch: {
    type(value) {
      if (!value) {
        this.message = ''
        this.$nextTick(() => {
          this.$refs['templateForm'].resetFields()
        })
      } else if (value !== 'add') {
        this.getEquityActBase()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.info-form {
  .info-form-row {
    display: flex;

    .el-form-item {
      .el-input,
      .el-textarea {
        width: 423px;
      }
    }
  }

  .img {
    /deep/ .el-input {
      width: 260px !important;
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
