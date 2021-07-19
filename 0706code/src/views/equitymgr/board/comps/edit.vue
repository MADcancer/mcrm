<template>
  <div class="edit">
    <el-dialog
      :title="type === 'create' ? '创建权益板块' : '修改权益板块'"
      :visible.sync="dialogEditVisible"
      width="700px"
      :before-close="cancel"
    >
      <div v-loading="waitLoading">
        <el-form
          label-position="left"
          label-width="120px"
          :model="editForm"
          :rules="rules"
          ref="editForm"
        >
          <el-form-item label="权益板块名称：" prop="boardName">
            <el-input
              v-model="editForm.boardName"
              autocomplete="off"
              maxlength="60"
            ></el-input>
          </el-form-item>
          <el-form-item label="权益板块渠道：" prop="boardChannel">
            <el-input
              v-model="$root.selectOption.channelObj[editForm.boardChannel]"
              autocomplete="off"
              disabled
            ></el-input>
          </el-form-item>
          <div class="board-img">
            <span style="color: #F56C6C; margin-right:4px; margin-bottom: 13px"
              >*</span
            >
            <el-form-item label="权益板块图片：" label-width="110px">
              <el-input
                disabled
                placeholder="请选择"
                v-model="editForm.pictureName"
              >
                <el-upload
                  :slot="type === 'detail' ? '' : 'append'"
                  ref="upload"
                  action=""
                  class="upload-demo"
                  accept=".png, .jpg, .jpeg"
                  :auto-upload="false"
                  :show-file-list="false"
                  :before-upload="beforeUpload"
                  :file-list="pictureList"
                  :http-request="handlePreviewRequest"
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
                :loading="upLoading"
                @click="uploadImg"
                >导入</el-button
              >
            </el-form-item>
          </div>
          <el-form-item label="客户组:">
            <el-input :disabled="true" placeholder="请查询" v-model="editForm.custGroupName">
             <img
                src="~@/assets/img/search-logo.png"
                slot="suffix"
                style="width:15px; height:18px; margin-bottom:2px"
                @click="groupDialogVisible = true"
              />
            </el-input>
            <router-link :to="{path:'/custmgr/custgroup'}" target="_blank">
              <i class="el-icon-plus add-icon-style"></i>
            </router-link>
          </el-form-item>
          <el-form-item label="板块顺序：" prop="boardOrder">
            <el-input
              maxlength="6"
              v-model="editForm.boardOrder"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="权益板块说明：">
            <el-input
              type="textarea"
              :rows="4"
              maxlength="100"
              v-model="editForm.remark"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align: center">
          <el-button type="primary" @click="save">提交</el-button>
          <el-button @click="cancel">取消</el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      class="notice-dialog cus-confirm"
      title="提示"
      :visible.sync="noticeDialogVisible"
      width="300px"
      append-to-body
    >
      <span>是否确认提交？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleConfirm" :loading="loading"
          >确 认</el-button
        >
        <el-button @click="noticeDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <v-group :groupDialogVisible='groupDialogVisible' @cancel='closeGroup'></v-group>
  </div>
</template>

<script>
import API from '@/api'
import { validateImg, imgFormat } from '@/utils/validate'
import vGroup from './group'
export default {
  props: {
    dialogEditVisible: {
      type: Boolean
    },
    id: {
      type: String
    },
    type: {
      type: String
    }
  },
  components: { vGroup },
  watch: {
    dialogEditVisible(value) {
      if (value) {
        if (this.type === 'create') {
          this.editForm = {
            boardName: '',
            boardChannel: this.$store.state.user.channel,
            pictureName: '',
            pictureUrl: '',
            boardOrder: '',
            custGroupName: '',
            custGroupId: ''
          }
        } else {
          let boardId = this.id
          API.equityrule.qryBoardInfo({ boardId }).then(res => {
            this.editForm = res.data.data
          })
        }
      }
    }
  },
  data() {
    // 校验调整分值
    var checkBoardOrder = (rule, value, callback) => {
      if (!/^[1-9]{1,}[\d]*$/.test(value)) {
        return callback(new Error('请输入正整数'))
      }
      return callback()
    }
    return {
      editForm: {
        boardName: '',
        boardChannel: this.$store.state.user.channel,
        pictureName: '',
        pictureUrl: '',
        boardOrder: '',
        custGroupName: '',
        custGroupId: '',
        remark: ''
      },
      waitLoading: false,
      upLoading: false,
      loading: false,
      noticeDialogVisible: false,
      channel: ['', '财富', '直销', '信用卡'],
      message: '',
      pictureList: [],
      rules: {
        boardName: [
          { required: true, message: '请输入权益板块名称', trigger: 'blur' }
        ],
        boardOrder: [
          { required: true, message: '请输入板块顺序', trigger: 'blur' },
          { validator: checkBoardOrder, trigger: 'blur' }
        ]
      },
      formData: new FormData(),
      groupDialogVisible: false
    }
  },
  methods: {
    closeGroup(param) {
      if (param.type === 'add') {
        this.editForm.custGroupId = param.selectGroup.selectGroupId
        this.editForm.custGroupName = param.selectGroup.selectGroupName
      }
      this.groupDialogVisible = false
    },
    save() {
      this.$refs['editForm'].validate(valid => {
        if (!valid) {
          return
        }
        if (!this.editForm.pictureUrl) {
          this.message = '请导入权益板块图片'
          return
        }
        this.noticeDialogVisible = true
      })
    },
    handleConfirm() {
      this.loading = true
      API.equityrule
        .editBoardInfo({
          ...this.editForm,
          boardName: this.editForm.boardName.trim(),
          createEmpName:
            this.type === 'create' ? this.$store.state.user.name : '',
          createEmpNo: this.type === 'create' ? this.$store.state.user.id : '',
          modifyEmpName:
            this.type === 'create' ? '' : this.$store.state.user.name,
          modifyEmpNo: this.type === 'create' ? '' : this.$store.state.user.id,
          id: this.type === 'create' ? '' : this.id
        })
        .then(() => {
          this.$message.success('操作成功！')
          this.loading = false
          this.noticeDialogVisible = false
          this.cancel()
        })
        .catch(error => {
          this.loading = false
          this.$message.error(error.msg)
        })
    },
    cancel() {
      this.$emit('cancel', {type: this.type})
      setTimeout(() => {
        this.pictureList = []
        this.message = ''
        if (this.$refs['editForm']) {
          this.$refs['editForm'].clearValidate()
        }
      }, 350)
    },
    // ----- 图片处理 ----
    // 图片check
    beforeUpload(file) {
      if (imgFormat(file)) {
        this.pictureList = []
        this.editForm.pictureName = ''
        this.editForm.pictureUrl = ''
        this.$refs.upload.clearFiles()
        this.resetForm()
        return
      }
      let _this = this
      let imgWidth = 335
      let imgHight = 270
      validateImg(file, imgWidth, imgHight)
        .then(() => {
          this.formData.append('files', file)
          this.uploadImage()
        })
        .catch(() => {
          _this.$message.warning({
            message: `上传文件的图片大小不合符标准,宽需要为${imgWidth}px，高需要为${imgHight}px。`
          })
          this.pictureList = []
          this.editForm.pictureName = ''
          this.editForm.pictureUrl = ''
          this.$refs.upload.clearFiles()
          this.resetForm()
        })
    },
    // 选择图片变更
    handleChangeFile(file, fileList) {
      // 只有一张图片
      this.pictureList = []
      this.pictureList.push(fileList[fileList.length - 1])
      this.editForm.pictureName = file.name
      this.editForm.pictureUrl = ''
      this.message = ''
    },
    handlePreviewRequest(params) {
      // this.formData.append('files', params.file)
    },
    uploadImg() {
      this.message = ''
      if (!this.editForm.pictureName) {
        this.message = '请选择后图片再导入'
        return
      }
      if (this.pictureList.length === 0) {
        this.$message.warning('请选择新的图片再导入！')
        return
      }
      this.formData = new FormData()
      this.$refs.upload.submit()
    },
    uploadImage() {
      this.upLoading = true
      API.common
        .upload(this.formData)
        .then(res => {
          this.upLoading = false
          this.editForm.pictureUrl = res.data.data[0].fileUrl
          this.resetForm()
          this.$message.success('上传成功！')
        })
        .catch(() => {
          this.upLoading = false
          this.pictureList = []
          this.editForm.pictureName = ''
          this.editForm.pictureUrl = ''
          this.$message.error('上传失败！')
          this.resetForm()
          // this.uploadDetailLoading = false
        })
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
    }
  }
}
</script>

<style lang="scss" scoped>
.edit {
  /deep/ .el-input,
  /deep/ .el-textarea {
    width: 260px;
  }
  /deep/ .el-form-item {
    margin-bottom: 14px;
  }
  .board-img {
    display: flex;
    align-items: center;
    /deep/ .el-button {
      height: 24px;
      line-height: 24px;
      display: inline-flex;
      align-items: center;
    }
  }
}
</style>
