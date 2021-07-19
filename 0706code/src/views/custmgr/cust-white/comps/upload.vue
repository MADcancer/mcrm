<template>
  <div class="white-upload">
    <el-dialog
      title="导入白名单"
      :visible.sync="dialogEditVisible"
      width="500px"
      :before-close="cancel"
    >
      <div style="width: 100%">
        <div class="upload cus-button">
          <span style="color: #F56C6C; margin-right:4px">*</span>
          <span class="upload-label">选择文件</span>
          <el-input
            placeholder=""
            v-model="fileName"
            disabled
            style="padding: 0 10px"
          >
            <el-upload
              slot="append"
              ref="upload"
              action
              class="upload-demo"
              accept=".xls, .xlsx"
              :show-file-list="false"
              :auto-upload="false"
              :http-request="handleRequest"
              :multiple="false"
              :file-list="fileList"
              :on-change="handleChange"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-input>
          <el-button @click="downloadTemplate" :loading="downLoading">模板下载</el-button>
        </div>
        <div>
          <span class="message" v-show="messageShow">请选择文件</span>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="uploadExcel" :loading="loading"
          >导入</el-button
        >
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import API from '@/api'
import { fileFormat } from '@/utils/validate'
import { resetForm } from '@/utils/index'
export default {
  props: {
    dialogEditVisible: false
  },
  data() {
    return {
      messageShow: false,
      fileName: '',
      fileList: [],
      formData: new FormData(),
      loading: false,
      downLoading: false
    }
  },
  methods: {
    // 选择文件变更
    handleChange(file, fileList) {
      // 只能传一个文件
      this.fileList = []
      this.fileList.push(fileList[fileList.length - 1])
      this.fileName = file.name
      if (this.fileName !== '') {
        this.messageShow = false
      }
    },
    // 导入excel
    handleRequest(param) {
      if (fileFormat(param.file)) {
        this.loading = false
        this.$refs.upload.clearFiles()
        this.fileName = ''
        resetForm('upload', this)
        return
      }
      this.formData.append('file', param.file)
      this.addWhiteListByExcel()
    },
    // 导入
    uploadExcel() {
      if (this.fileName === '') {
        this.messageShow = true
        return
      }
      this.loading = true
      this.formData = new FormData()
      this.$refs.upload.submit()
    },
    addWhiteListByExcel() {
      this.formData.append('empName', this.$store.state.user.name)
      this.formData.append('empNo', this.$store.state.user.id)
      API.custwhite
        .addWhiteListByExcel(this.formData)
        .then(res => {
          this.loading = false
          this.$refs.upload.clearFiles()
          this.fileName = ''
          resetForm('upload', this)
          this.$message.success(res.data.data)
          this.cancel()
        })
        .catch(error => {
          this.$message.error(error.msg)
          this.loading = false
          this.$refs.upload.clearFiles()
          this.fileName = ''
          resetForm('upload', this)
        })
    },
    downloadTemplate() {
      this.downLoading = true
      // 返回数据流
      API.custwhite
        .downloadTemplate()
        .then(data => {
          this.downLoading = false
          let blob = new Blob([data.data], {
            type:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          })
          // ie浏览器
          if (!!window.ActiveXObject || 'ActiveXObject' in window) {
            window.navigator.msSaveOrOpenBlob(blob, '白名单导入模板.xlsx')
          } else {
            const a = document.createElement('a')
            a.style.display = 'none'
            a.download = '白名单导入模板'
            a.href = window.URL.createObjectURL(blob)
            a.click()
          }
        })
        .catch(() => {
          this.downLoading = false
          this.$message.error('暂无数据')
        })
    },
    cancel() {
      this.$emit('cancel')
      setTimeout(() => {
        this.messageShow = false
      }, 350)
    }
  }
}
</script>
<style lang="scss" scoped>
.white-upload {
  /deep/ .el-input {
    width: 280px;
  }
  .upload {
    display: flex;
    align-items: center;
    &-label {
      width: 100px;
      display: block;
    }
  }
  .cus-button /deep/ .el-button {
    height: 26px;
    line-height: 26px;
    padding: 0 9px;
  }
  .message {
    color: #f56c6c;
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
    padding-left: 90px;
    position: absolute;
  }
}
</style>
