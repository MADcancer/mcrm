<template>
  <div class="info">
    <div class="score-info">
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        style="width: 80%"
        label-width="100px"
      >
        <div class="info-form-row">
          <img src="~@/assets/img/info-logo.png" class="info-logo" />
          <el-form-item label="文字说明：" prop="info" style="width: 100%">
            <el-input
              type="textarea"
              placeholder="请输入文字说明"
              v-model="form.info"
              :rows="12"
              show-word-limit
            />
            <!-- <div id="websiteEditorElem"
                  style="height:300px;background: #ffffff;width: 600px;z-index: 1"></div> -->
            <!-- <quill-editor
                  style="width: 600px"
                  v-model="form.info"
                  ref="myQuillEditor"
                  class="editer"
                  :options="editorOption"
                >
                </quill-editor> -->
          </el-form-item>
        </div>
        <div class="info-form-row" style="position: relative;">
          <el-form-item label="图片说明：" prop="pictureName">
            <el-input disabled placeholder="请选择" v-model="form.pictureName">
              <el-upload
                slot="append"
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
                <span>选择文件</span>
                <div
                  style="position: absolute;left: -190px;top: 44px;color:#ff0000"
                >
                  <span v-if="message">{{ message }}</span>
                </div>
              </el-upload>
            </el-input>
            <el-button
              size="small"
              type="primary"
              @click="uploadImg()"
              :loading="uploadLoading"
              >导入</el-button
            >
            <el-button size="small" type="primary" @click="previewImg()"
              >上传图片预览</el-button
            >
            <el-button size="small" type="primary" @click="remove()"
              >移除图片</el-button
            >
          </el-form-item>
          <div class="info">
            {{ `注：1. 要加粗的文字请在文字前后加上${tempTag}` }}
          </div>
          <div class="info" style="top: 80px; left: 50px">
            2.
            文字说明、图片说明至少录入一项，若两项都有，手机端优先展示图片说明。
          </div>
        </div>
      </el-form>
    </div>
    <div style="width: 100%; text-align: center">
      <el-button
        type="primary"
        @click="save"
        icon="el-icon-document"
        style="margin-top: 90px"
        :loading="loading"
        v-if="isAuth('sys:rule:save')"
        >保存</el-button
      >
    </div>
    <!-- 预览 图片 -->
    <el-dialog
      class="notice-dialog"
      :title="name === 'level' ? '星级说明图片' : '积分说明图片'"
      :visible.sync="imgShow"
      width="720px"
    >
      <div class="previewImg">
        <img :src="`${baseUrl}/${form.pictureUrl}`" style="width: 500px" />
        <!-- <img src="~@/assets/img/test1.jpg" /> -->
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { validateImg, imgFormat } from '@/utils/validate'
import API from '@/api'
import { baseUrl } from '@/utils'
// import E from 'wangeditor'
// import { quillEditor } from 'vue-quill-editor'
export default {
  props: {
    name: {
      type: String
    }
  },
  watch: {
    name(value) {
      if (value === 'info' || value === 'level') {
        // 初始化数据
        this.form = {
          info: '',
          pictureUrl: '',
          pictureName: '',
          id: ''
        }
        this.message = ''
        this.qryScoreDescByChannel()
      }
    }
  },
  data() {
    return {
      baseUrl: baseUrl(),
      imgShow: false,
      form: {
        info: '',
        pictureUrl: '',
        pictureName: '',
        id: ''
      },
      editorOption: {
        placeholder: '请输入',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline'], // 加粗，斜体，下划线，删除线
            ['blockquote', 'code-block'],
            [{ color: ['#C69D57', '#70A328', '#656565', '#333333'] }]
          ]
        }
      },
      rules: {
        // info: [
        //   { required: true, message: '请输入文字说明维护', trigger: 'blur' }
        // ],
        // pictureName: [
        //   { required: true, message: '请输上传积分图片说明', trigger: 'change' }
        // ]
      },
      pictureList: [],
      formData: new FormData(),
      loading: false,
      uploadLoading: false,
      message: '',
      editor: null,
      tempTag: '<b></b>, 例：<b>1.什么是权益积分?</b>`'
    }
  },
  methods: {
    // 图片check
    beforeUpload(file) {
      if (imgFormat(file)) {
        // this.previewLoading = false
        this.clearImageForm()
        return
      }
      let _this = this
      let imgWidth = 700
      let imgHight = 0
      validateImg(file, imgWidth, imgHight)
        .then(() => {
          this.uploadImage()
        })
        .catch(() => {
          _this.$message.warning({
            message: `上传文件的图片大小不合符标准,宽需要为${imgWidth}px。`
          })
          // this.previewLoading = false
          this.clearImageForm()
        })
    },
    // 选择图片变更
    handleChangeFile(file, fileList) {
      // 只有一张图片
      this.pictureList = []
      this.pictureList.push(fileList[fileList.length - 1])
      this.form.pictureName = file.name
      this.form.pictureUrl = ''
      this.message = ''
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
    // 图片上传
    uploadImage() {
      this.uploadLoading = true
      API.common
        .upload(this.formData)
        .then(res => {
          this.form.pictureUrl = res.data.data[0].fileUrl
          this.uploadLoading = false
          this.resetForm()
          this.$message.success('上传成功！')
        })
        .catch(() => {
          this.clearImageForm()
          this.$message.error('上传失败！')
          this.uploadLoading = false
        })
    },
    // 清空图片信息
    clearImageForm() {
      this.pictureList = []
      this.form.pictureName = ''
      this.form.pictureUrl = ''
      this.$refs.upload.clearFiles()
      this.resetForm()
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

    // 移除图片
    remove() {
      this.form.pictureName = ''
      this.form.pictureUrl = ''
    },
    save() {
      this.$refs['form'].validate(valid => {
        if (!this.form.info && !this.form.pictureName) {
          this.$message.warning('文字说明，图片说明至少输入一项！')
          return
        }
        this.message = ''
        if (this.form.pictureName && !this.form.pictureUrl) {
          this.message = '请导入图片'
          return
        }
        this.loading = true
        let params = {
          // textDesc: this.editor.txt.html(),
          textDesc: this.form.info,
          pictureName: this.form.pictureName,
          pictureUrl: this.form.pictureUrl,
          scoreChannel: this.$store.state.user.channel,
          createEmpNo: this.form.id ? '' : this.$store.state.user.id,
          createEmpName: this.form.id ? '' : this.$store.state.user.name,
          modifyEmpNo: this.form.id ? this.$store.state.user.id : '',
          modifyEmpName: this.form.id ? this.$store.state.user.name : '',
          type: this.name === 'level' ? '1' : '0'
        }
        API.scorerule
          .saveScoreDesc(params)
          .then(res => {
            this.loading = false
            this.form.id = res.data.msg
            this.$message.success('操作成功!')
          })
          .catch(() => {
            this.loading = false
            this.$message.error('保存失败')
          })
      })
    },
    // 获取数据
    qryScoreDescByChannel() {
      let params = {
        channel: this.$store.state.user.channel,
        empNo: this.$store.state.user.id,
        type: this.name === 'level' ? '1' : '0'
      }
      API.scorerule.qryScoreDescByChannel(params).then(res => {
        if (res.data.data) {
          this.form = {
            id: res.data.data.id,
            info: res.data.data.textDesc,
            pictureUrl: res.data.data.pictureUrl,
            pictureName: res.data.data.pictureName
          }
          // this.initEditor()
        }
      })
    },
    // initEditor() {
    //   // wangeditor
    //   this.editor = new E('#websiteEditorElem')
    //   // 自定义菜单配置
    //   this.editor.customConfig.menus = [
    //     'head',
    //     'bold',
    //     'italic',
    //     'underline',
    //     'foreColor'  // 文字颜色
    //   ]
    //   // 自定义配置颜色（字体颜色、背景色）
    //   this.editor.customConfig.colors = [
    //     '#C69D57', '#70A328', '#656565', '#333333'
    //   ]
    //   // 创建一个富文本编辑器
    //   this.editor.create()
    //   // 富文本内容
    //   this.editor.txt.html(this.form.info)
    // },
    // 图片预览
    previewImg() {
      if (!this.form.pictureUrl) {
        this.$message.info('还没有上传的积分图片说明！')
        return
      }
      this.imgShow = true
    }
  }
}
</script>

<style lang="scss" scoped>
.info {
  .score-info {
    display: flex;
    justify-content: center;
    img {
      width: 19px;
      height: 20px;
      margin-right: 4px;
    }
  }
  .info-form-row {
    display: flex;
    position: relative;
    .info-logo {
      margin-top: 10px;
      left: -10px;
      position: absolute;
    }
    .info {
      position: absolute;
      top: 60px;
      left: 20px;
      color: #f56c6c;
    }
    /deep/ .el-form-item {
      padding-bottom: 60px;
    }
    /deep/ .el-form-item__content {
      display: flex;
    }
    /deep/ .el-input {
      margin-right: 10px;
      width: 290px;
    }
  }
  .previewImg {
    height: 600px;
    overflow-y: auto;
  }
}
</style>
