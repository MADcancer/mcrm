<template>
  <div class="mod-engine">
    <el-form
      :model="uploadForm"
      :rules="uploadRules"
      :inline="true"
      ref="uploadForm"
      class="demo-form-inline cus-button"
    >
      <el-form-item label="选择文件" label-width="100px" prop="fileName">
        <el-input
          placeholder=""
          v-model="uploadForm.fileName"
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
      </el-form-item>
      <el-form-item>
        <el-button @click="uploadFile" :loading="uploadLoading"
          >文件上传</el-button
        >
      </el-form-item>
      <el-form-item>
        <el-button
          @click="publish"
          :loading="publishLoading"
          :disabled="disabled"
          >规则发布</el-button
        >
      </el-form-item>
      <el-form-item>
        <el-button @click="downloadTemplate" :loading="downloadloading"
          >引擎文件模板下载</el-button
        >
      </el-form-item>
    </el-form>

    <el-form
      :model="form"
      :inline="true"
      ref="form"
      class="demo-form-inline cus-button"
    >
      <el-form-item label="选择文件" label-width="100px" prop="fileName">
        <el-input
          placeholder=""
          v-model="form.fileName"
          disabled
          style="padding: 0 10px"
        >
          <el-upload
            slot="append"
            ref="upload1"
            action
            class="upload-demo"
            accept=".xls, .xlsx"
            :show-file-list="false"
            :auto-upload="false"
            :http-request="handleRequest1"
            :multiple="false"
            :file-list="fileList1"
            :on-change="handleChange1"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="uploadFile1"
          >文件上传</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import API from '@/api'
import { fileFormat } from '@/utils/validate'
import { resetForm } from '@/utils/index'
export default {
  data() {
    return {
      uploadForm: {
        fileName: ''
      },
      form: {
        fileName: ''
      },
      fileList: [],
      fileList1: [],
      disabled: true,
      uploadLoading: false,
      publishLoading: false,
      downloadloading: false,
      formData: new FormData(),
      uploadRules: {
        fileName: [{ required: true, message: '请选择文件', trigger: 'change' }]
      }
    }
  },
  methods: {
    // 选择文件变更
    handleChange(file, fileList) {
      // 只能传一个文件
      this.fileList = []
      this.fileList.push(fileList[fileList.length - 1])
      this.uploadForm.fileName = file.name
    },
    // 选择文件变更
    handleChange1(file, fileList) {
      // 只能传一个文件
      this.fileList1 = []
      this.fileList1.push(fileList[fileList.length - 1])
      this.form.fileName = file.name
    },
    handleRequest(param) {
      if (fileFormat(param.file)) {
        resetForm('upload', this)
        this.$refs.upload.clearFiles()
        this.$refs.uploadForm.resetFields()
        return
      }
      this.uploadLoading = true

      this.formData.append('droolsFile', param.file)
      this.formData.append('type', 'tdtsmst')
      this.updateDrools()
    },
    handleRequest1(param) {
      if (fileFormat(param.file)) {
        resetForm('upload1', this)
        this.$refs.upload1.clearFiles()
        this.$refs.form.resetFields()
        return
      }

      this.formData.append('droolsFile', param.file)
      this.formData.append('type', 'tdtsmst')
      API.engine
        .updateDroolsTemplate(this.formData)
        .then(() => {
          this.$message.success('上传成功！')
          this.disabled = false
          this.uploadLoading = false
          resetForm('upload1', this)
          this.$refs.upload1.clearFiles()
          this.$refs.form.resetFields()
        })
        .catch(err => {
          this.$message.error(err.msg)
          this.uploadLoading = false
          resetForm('upload1', this)
          this.$refs.upload1.clearFiles()
          this.$refs.form.resetFields()
        })
    },
    uploadFile1() {
      this.$refs['form'].validate(valid => {
        if (!valid) {
          return false
        }
        this.formData = new FormData()
        this.$refs.upload1.submit()
      })
    },
    updateDrools() {
      API.engine
        .updateDrools(this.formData)
        .then(() => {
          this.$message.success('上传成功！')
          this.disabled = false
          this.uploadLoading = false
          resetForm('upload', this)
          this.$refs.upload.clearFiles()
          this.$refs.uploadForm.resetFields()
        })
        .catch(err => {
          this.$message.error(err.msg)
          this.uploadLoading = false
          resetForm('upload', this)
          this.$refs.upload.clearFiles()
          this.$refs.uploadForm.resetFields()
        })
    },
    uploadFile() {
      this.$refs['uploadForm'].validate(valid => {
        if (!valid) {
          return false
        }
        this.formData = new FormData()
        this.$refs.upload.submit()
      })
    },
    publish() {
      this.publishLoading = true
      API.engine
        .publishDrools('tdtsmst')
        .then(() => {
          this.$message.success('发布成功！')
          this.publishLoading = false
        })
        .catch(err => {
          this.$message.error(err.msg)
          this.publishLoading = false
        })
    },
    downloadTemplate() {
      this.downloadLoading = true
      API.engine
        .downloadTemplate('tdtsmst')
        .then(data => {
          let blob = new Blob([data.data], {
            type:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          })
          // ie浏览器
          if (!!window.ActiveXObject || 'ActiveXObject' in window) {
            window.navigator.msSaveOrOpenBlob(blob, '引擎文件模板')
          } else {
            const a = document.createElement('a')
            a.style.display = 'none'
            a.download = '引擎文件模板'
            a.href = window.URL.createObjectURL(blob)
            a.click()
          }
          this.downloadLoading = false
        })
        .catch(() => {
          this.$message.error('暂无数据')
          this.downloadLoading = false
        })
    }
  },
  created() {}
}
</script>
<style lang="scss" scoped>
.mod-engine {
  /deep/ .el-input__inner,
  /deep/ .el-input {
    width: 240px;
  }
}
</style>
