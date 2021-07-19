<template>
  <div class="peakMarketing" v-loading="vLoading">
    <div class="peakMarketing-contanier">
      <div class="peakMarketing-title">
        旺季营销
      </div>
      <div class="peakMarketing-content">
        <div class="peakMarketing-content-info">
          <div>
            <span>旺季营销积分</span>
            <el-input v-model="user.peakPoints" disabled></el-input>
            <a class="detail" @click="dialogDetailVisible = true">明细</a>
          </div>
          <div>
            <span>财富积分</span>
            <el-input v-model="user.fortunePoints" disabled></el-input>
          </div>
          <div>
            <span>客户号</span>
            <el-input v-model="user.custNo" disabled></el-input>
          </div>
          <div>
            <span>客户名</span>
            <el-input v-model="user.custName" disabled></el-input>
          </div>
          <div>
            <span>身份证号</span>
            <el-input v-model="user.certNo" disabled></el-input>
          </div>
          <div>
            <span>机构号</span>
            <el-input v-model="user.orgNo" disabled></el-input>
          </div>
          <div>
            <span>机构名</span>
            <el-input v-model="user.orgName" disabled></el-input>
          </div>
          <div>
            <span>员工号</span>
            <el-input v-model="user.empNo" disabled></el-input>
          </div>
          <div>
            <span>员工名</span>
            <el-input v-model="user.empName" disabled></el-input>
          </div>
        </div>
      </div>
      <div class="peakMarketing-content">
        <div class="peakMarketing-content-title">单个客户扣除</div>
        <el-form
          :model="editForm"
          :rules="rules"
          :inline="true"
          ref="editForm"
          class="demo-form-inline"
        >
          <el-form-item label="积分扣减值" label-width="100px" prop="amount">
            <el-input v-model="editForm.amount" maxlength="11"></el-input>
          </el-form-item>
          <el-form-item label="兑换内容" label-width="100px" prop="operationName">
            <el-input
              type="textarea"
              :rows="4"
              maxlength="60"
              v-model="editForm.operationName"
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="peakMarketing-content-btn">
          <el-button
            type="primary"
            icon="el-icon-refresh-right"
            @click="submitCust"
            >提交</el-button
          >
        </div>
      </div>
      <div class="peakMarketing-content">
        <div class="peakMarketing-content-title">批量客户扣除</div>
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
            <el-button @click="downloadTemplate" :loading="downloadLoading">模板下载</el-button>
          </el-form-item>
        </el-form>
        <div class="peakMarketing-content-btn">
          <el-button
            type="primary"
            @click="uploadFile"
            :loading="uploadLoading"
            >导入</el-button
          >
        </div>
      </div>
    </div>
    <v-detail
      :dialogDetailVisible="dialogDetailVisible"
      :custNo="user.custNo"
      @cancel="cancel"
    ></v-detail>
    <v-upload
      :dialogUploadVisible="dialogUploadVisible"
      :msg="msg"
      :dealNo="dealNo"
      @cancel="cancel"
    ></v-upload>
  </div>
</template>

<script>
import vDetail from './comps/detail'
import vUpload from './comps/upload'
import API from '@/api'
import { fileFormat } from '@/utils/validate'
// import { getUrlKey } from '@/utils'
export default {
  components: { vDetail, vUpload },
  data() {
    // 校验整数值
    var checkInt = (rule, value, callback) => {
      if (value && !/^[1-9]{1,}[\d]*$/.test(value)) {
        return callback(new Error('请输入正整数'))
      }
      return callback()
    }

    return {
      user: {
        custNo: '',
        custName: '',
        empNo: '',
        empName: '',
        orgNo: '',
        orgName: '',
        certNo: '',
        peakPoints: 0,
        fortunePoints: 0
      },
      editForm: {
        amount: '',
        operationName: ''
      },
      uploadForm: {
        fileName: ''
      },
      msg: '',
      dealNo: '',
      fileList: [],
      formData: new FormData(),
      vLoading: true,
      uploadLoading: false,
      downloadLoading: false,
      rules: {
        amount: [
          { required: true, message: '请输入积分扣减值', trigger: 'blur' },
          { validator: checkInt, trigger: 'blur' }
        ],
        operationName: [
          { required: true, message: '请输入兑换内容', trigger: 'blur' }
        ]
      },
      uploadRules: {
        fileName: [{ required: true, message: '请选择文件', trigger: 'change' }]
      },
      dialogDetailVisible: false,
      dialogUploadVisible: false
    }
  },
  methods: {
    getCustScore() {
      // 财富是1 旺季是4
      API.crmscore.getCustScore({ custNo: this.user.custNo }).then(res => {
        this.$set(this.user, 'peakPoints', res.data.data['4'] || 0)
        this.$set(this.user, 'fortunePoints', res.data.data['1'] || 0)
        this.vLoading = false
      }).catch((error) => {
        this.vLoading = false
        this.$message.error(error.msg)
      })
    },
    // 单个客户提交
    submitCust() {
      this.$refs['editForm'].validate(valid => {
        if (!valid) {
          return false
        }
        this.vLoading = true
        API.crmscore.custExchange(Object.assign(this.user, this.editForm)).then(() => {
          this.getCustScore()
          this.$message.success('兑换成功！')
          this.$refs.editForm.resetFields()
          this.vLoading = false
        }).catch((error) => {
          this.vLoading = false
          this.$message.error(error.msg)
        })
      })
    },
    // 模板下载
    downloadTemplate() {
      this.downloadLoading = true
      API.crmscore.downloadTemplate().then(data => {
        let blob = new Blob([data.data], {
          type:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })
        // ie浏览器
        if (!!window.ActiveXObject || 'ActiveXObject' in window) {
          window.navigator.msSaveOrOpenBlob(blob, '批量客户模板.xlsx')
        } else {
          const a = document.createElement('a')
          a.style.display = 'none'
          a.download = '批量客户模板.xlsx'
          a.href = window.URL.createObjectURL(blob)
          a.click()
        }
        this.downloadLoading = false
      })
      .catch(() => {
        this.$message.error('暂无数据')
        this.downloadLoading = false
      })
    },
    // 选择文件变更
    handleChange(file, fileList) {
      // 只能传一个文件
      this.fileList = []
      this.fileList.push(fileList[fileList.length - 1])
      this.uploadForm.fileName = file.name
    },
    handleRequest(param) {
      if (fileFormat(param.file)) {
        this.resetForm('upload')
        this.$refs.upload.clearFiles()
        this.$refs.uploadForm.resetFields()
        return
      }
      this.vLoading = true
      this.formData.append('flowFile', param.file)
      this.formData.append('orgNo', this.user.orgNo)
      this.formData.append('empNo', this.user.empNo)
      this.formData.append('empName', this.user.empName)
      this.custExchangeL()
    },
    custExchangeL() {
      API.crmscore.custExchangeL(this.formData).then((res) => {
        this.vLoading = false
        this.dialogUploadVisible = true
        this.msg = res.data.msg
        this.dealNo = res.data.data
        this.getCustScore()
        this.resetForm('upload')
        this.$refs.upload.clearFiles()
        this.$refs.uploadForm.resetFields()
      }).catch((error) => {
        this.vLoading = false
        this.resetForm('upload')
        this.$refs.upload.clearFiles()
        this.$refs.uploadForm.resetFields()
        this.$message.error(error.msg)
      })
    },
    // 批量客户兑换
    uploadFile() {
      this.$refs['uploadForm'].validate(valid => {
        if (!valid) {
          return false
        }
        this.formData = new FormData()
        this.$refs.upload.submit()
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
    cancel(param) {
      if (param.type === 'detail') {
        this.dialogDetailVisible = false
      } else {
        this.dialogUploadVisible = false
      }
    }
  },
  created() {
    this.user = {
      custNo: this.$route.query.custNo || '',
      custName: this.$route.query.custName || '',
      empNo: this.$route.query.empNo || '',
      empName: this.$route.query.empName || '',
      orgNo: this.$route.query.orgNo || '',
      orgName: this.$route.query.orgName || '',
      certNo: this.$route.query.certNo || ''
    }
    this.getCustScore()
  }
}
</script>

<style lang="scss" scoped>
$borderColor: #d1d1d1;
.peakMarketing {
  /deep/ .el-textarea__inner {
    width: 280px;
  }

  /deep/ .el-input__inner,
  /deep/ .el-input {
    height: 30px;
    line-height: 30px;
    width: 240px;
  }
  border: 1px solid $borderColor;
  &-title {
    height: 50px;
    line-height: 50px;
    padding-left: 10px;
    background-color: #f7f7f7;
    border-bottom: 1px solid $borderColor;
    font-size: 20px;
  }
  &-content {
    border: 1px solid $borderColor;
    padding: 20px;
    margin: 20px 10px;
    &-info {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      justify-content: space-around;
      > div {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 33%;
        margin-bottom: 15px;
        position: relative;
        span {
          width: 100px;
          display: block;
        }
        .detail {
          position: absolute;
          right: -5px;
          cursor: pointer;
          top: 50%;
          transform: translate(0, -50%);
          
        }
      }
    }
    &-title {
      font-size: 18px;
      padding-bottom: 20px;
    }
    &-btn {
      text-align: center;
    }
    &-upload {
      display: flex;
      align-items: center;
      .title {
        width: 100px;
      }
    }
  }
}
</style>
