<template>
  <div class="stock-edit">
    <el-dialog
      title="添加库存"
      :visible.sync="dialogEditStockVisible"
      width="700px"
      :before-close="cancel"
    >
      <div v-loading="vLoading">
        <el-form :model="editForm" :rules="rules" ref="editForm">
          <el-form-item label="商品名称：" label-width="120px">
            <el-input
              v-model="info.prodName"
              autocomplete="off"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="当前库存：" label-width="120px">
            <el-input
              v-model="info.prodCnt"
              autocomplete="off"
              disabled
            ></el-input>
          </el-form-item>

          <el-form-item label="商品类型：" label-width="120px">
            <el-select v-model="info.prodType" placeholder="" disabled>
              <el-option label="请选择" value=""></el-option>
              <el-option label="虚拟" value="1"></el-option>
              <el-option label="实物" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="添加库存数量："
            label-width="120px"
            prop="prodCnt"
          >
            <el-input
              v-model="editForm.prodCnt"
              autocomplete="off"
              maxlength="6"
            ></el-input>
          </el-form-item>

          <el-form-item label="是否发送短信：" label-width="120px" v-if="info.prodType === '1'"  >
            <el-select v-model="info.isMsg" placeholder="" disabled>
              <el-option label="请选择" value=""></el-option>
              <el-option label="是" value="0"></el-option>
              <el-option label="否" value="1"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="券码导入：" label-width="120px" v-if="info.prodType === '1'  && info.ifThanks === '0'">
            <span
              style="color: #F56C6C; margin-right:4px; position: absolute;top: 0;left: -87px;"
              >*</span
            >
            <el-input
              placeholder=""
              v-model="fileName"
              disabled
              style="position: relative;"
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
                :file-list="files"
                :on-change="handleChange"
              >
                <el-button size="small" type="primary">选择文件</el-button>
                <div
                  style="position: absolute;left: -150px;top: 30px;color:#ff0000"
                >
                  <span v-show="messageShow">请选择文件</span>
                </div>
              </el-upload>
            </el-input>
            <!-- <el-button @click="upload" :loading="loading">导入</el-button> -->
            <el-button @click="download" :loading="downloadLoading"
              class="download">模板下载</el-button
            >
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align: center">
          <el-button type="primary" @click="save">提交</el-button>
          <el-button @click="cancel">取消</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 提示框 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogConfirmVisible"
      width="30%"
      class="cus-confirm"
    >
      <span>是否确认提交？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmSubmit" :loading="loading"
          >确 认</el-button
        >
        <el-button @click="dialogConfirmVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import API from '@/api'
import { fileFormat } from '@/utils/validate'
export default {
  props: {
    dialogEditStockVisible: {
      type: Boolean
    },
    type: {
      type: String
    },
    prodId: {
      type: String
    }
  },
  watch: {
    dialogEditStockVisible(value) {
      if (value) {
        // 初始化数据
        this.vLoading = true
        API.product
        .getProdOne({ prodId: this.prodId })
        .then(res => {
          this.info = res.data.data.prodInfo
          this.editForm = {
            createEmpName: this.$store.state.user.name,
            createEmpNo: this.$store.state.user.id,
            codeFile: '',
            prodId: this.info.prodId,
            prodCnt: ''
          }
          // 虚拟 不发短信 不导入券码
          this.fileName = this.info.prodType === '1' && this.info.ifThanks === '0' ? '' : null
          this.vLoading = false
        }).catch(() => {
          this.vLoading = false
        })

        // 移除所有表单项的校验
        this.messageShow = false
        this.$nextTick(() => {
          this.$refs['editForm'].clearValidate()
        })
      }
    }
  },
  data() {
    // 校验数量
    var checkCount = (rule, value, callback) => {
      if (!/^[1-9]{1,}[\d]*$/.test(value)) {
        return callback(new Error('请输入正整数'))
      }
      return callback()
    }
    return {
      editForm: {},
      info: {},
      fileName: '',
      files: [],
      rules: {
        prodCnt: [
          { required: true, message: '请输入添加库存数量', trigger: 'blur' },
          { validator: checkCount, trigger: 'blur' }
        ]
      },
      messageShow: false,
      vLoading: false,
      loading: false,
      downloadLoading: false,
      dialogConfirmVisible: false,
      formData: new FormData()
    }
  },
  computed: {},
  methods: {
    // 选择文件变更
    handleChange(file, fileList) {
      // 只能传一个文件
      this.files = []
      this.files.push(fileList[fileList.length - 1])
      this.fileName = file.name
      this.messageShow = this.fileName === ''
    },
     // 提交
    save() {
      this.$refs['editForm'].validate(valid => {
        if (!valid) {
          return false
        }
        if (this.fileName === '') {
          this.messageShow = true
          return
        }
        this.dialogConfirmVisible = true
      })
    },
    // 确认提交
    confirmSubmit() {
      this.loading = true
      this.formData = new FormData()
      this.formData.append('prodId', this.editForm.prodId)
      this.formData.append('createEmpName', this.editForm.createEmpName)
      this.formData.append('createEmpNo', this.editForm.createEmpNo)
      this.formData.append('prodCnt', this.editForm.prodCnt)
      if (this.info.prodType === '1' && this.info.ifThanks === '0') {
        this.$refs.upload.submit()
      } else {
        this.addProdCount()
      }
    },
    // 导入excel
    handleRequest(param) {
      if (fileFormat(param.file)) {
        this.resetForm('upload')
        this.loading = false
        this.dialogConfirmVisible = false
        this.$refs.upload.clearFiles()
        this.fileName = ''
        return
      }
      this.formData.append('codeFile', param.file)
      this.addProdCount()
    },
    // 增加库存
    addProdCount() {
      API.product.addProdCount(this.formData).then(() => {
        this.loading = false
        this.dialogConfirmVisible = false
        if (this.info.prodType === '1' && this.info.ifThanks === '0') {
          this.fileName = ''
          this.$refs.upload.clearFiles()
          this.resetForm('upload')
        }
        this.$message.success('操作成功！')
        this.cancel()
      }).catch((error) => {
        this.loading = false
        this.dialogConfirmVisible = false
        if (this.info.prodType === '1' && this.info.ifThanks === '0') {
          this.$refs.upload.clearFiles()
          this.fileName = ''
          this.resetForm('upload')
        }
        this.$message.warning(error.msg)
      })
    },
    // 下载模板
    download() {
      this.downloadLoading = true
      // 返回数据流
      API.product
        .uploadCodeFile()
        .then(data => {
          this.downloadLoading = false
          let blob = new Blob([data.data], {
            type:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          })
          // const blob = new Blob([data.data])
          if (!!window.ActiveXObject || 'ActiveXObject' in window) {
            window.navigator.msSaveOrOpenBlob(blob, '券码模板.xlsx')
          } else {
            const a = document.createElement('a')
            a.style.display = 'none'
            a.download = '券码模板.xls'
            a.href = window.URL.createObjectURL(blob)
            a.click()
          }
        })
        .catch(() => {
          this.downloadLoading = false
          this.$message.error('暂无数据')
        })
    },
    // 清空input val
    resetForm(uploadName) {
      // 判断ie10以及以下
      let isIE10 = window.navigator.userAgent.indexOf('MSIE') >= 1
      let ele = this.$refs[uploadName].$el.getElementsByTagName('input')[0]
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
    cancel() {
      this.$emit('cancel', { type: this.type })
    }
  },
  created() {}
}
</script>

<style lang="scss" scoped>
.stock-edit {
  /deep/ .el-input {
    width: 240px;
  }

  .download {
    color: #80a639;
    border-color: #80a639;
    padding: 6px 10px;
    margin-left: 10px;
  }
}
</style>
