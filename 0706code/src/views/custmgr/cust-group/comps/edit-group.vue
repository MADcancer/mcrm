<template>
  <div class="group-edit">
    <el-dialog
      :title="type === 'create' ? '客户组创建' : '客户组修改'"
      :visible.sync="dialogEditVisible"
      width="600px"
      :before-close="cancel"
    >
      <div>
        <el-steps :space="100" :active="step" align-center>
          <el-step title="基本信息"></el-step>
          <el-step v-if="editForm.groupType !== '2' && editForm.groupType !== '3'" :title="setTitle"></el-step>
        </el-steps>
        <el-form
          :model="editForm"
          :rules="rules"
          ref="editForm"
          v-if="step == 1"
        >
          <el-form-item label="客户组名称" label-width="100px" prop="groupName">
            <el-input
              v-model="editForm.groupName"
              maxlength="60"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="客户组说明" label-width="100px" prop="groupDesc">
            <el-input
              type="textarea"
              :rows="4"
              maxlength="100"
              v-model="editForm.groupDesc"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="客户组类型" label-width="100px" prop="groupType">
            <el-select
              v-model="editForm.groupType"
              placeholder="请选择"
              :disabled="type === 'update'"
            >
              <!-- <el-option label="请选择" value=""></el-option> -->
              <el-option label="筛选条件" value="1"></el-option>
              <el-option label="导入名单" value="0"></el-option>
              <el-option label="代发薪" value="2"></el-option>
              <el-option label="社保卡营销" value="3"></el-option>

            </el-select>
          </el-form-item>
        </el-form>
        <div class="upload cus-button" v-else-if="editForm.groupType === '0'">
          <span style="color: #F56C6C; margin-right:4px">*</span>
          <span>选择文件</span>
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
          <!-- <el-button @click="upload" :loading="loading">导入</el-button> -->
          <el-button @click="download">模板下载</el-button>
        </div>
        <div v-else-if="editForm.groupType === '1'" class="cus-button step2">
          <el-form :model="custForm" ref="custForm">
            <el-form-item label="客户等级" label-width="100px">
              <el-select v-model="custLevel" multiple placeholder="请选择">
                <el-option
                  v-for="item in custLevels"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="机构号" label-width="100px" prop="orgName">
              <el-input
                v-model="custForm.orgName"
                placeholder="请选择"
                autocomplete="off"
                disabled
                ><img
                  src="~@/assets/img/search-logo.png"
                  slot="suffix"
                  style="width:15px; height:18px; margin-bottom:2px"
                  @click="searchOrg"
              /></el-input>
            </el-form-item>
            <el-form-item label="人才卡" label-width="100px" prop="card">
              <el-input
                v-model="card"
                placeholder="请选择"
                autocomplete="off"
                disabled
                ><img
                  src="~@/assets/img/search-logo.png"
                  slot="suffix"
                  style="width:15px; height:18px; margin-bottom:2px"
                  @click="cardVisible = true"
              /></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div>
          <span class="message" v-show="messageShow">请选择文件</span>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="step = 1" v-if="step == 2">上一步</el-button>
        <el-button type="primary" @click="save" :loading="loading">{{
          (step == 1 && (editForm.groupType !== '2'&& editForm.groupType !== '3')) ? '下一步' : editForm.groupType === '0' ? '导入' : '保存'
        }}</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-dialog>
    <v-card
      :cardVisible="cardVisible"
      :certYcCity="custForm.certYcCity"
      :certYcDistrict="custForm.certYcDistrict"
      @cancelCard="cancelCard"
    ></v-card>
    <v-org
      :orgVisible="orgVisible"
      :orgNo="custForm.orgNo"
      @cancelOrg="cancelOrg"
    ></v-org>
    <!-- 提示框 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogConfirmVisible"
      width="30%"
      class="cus-confirm"
    >
      <span>{{ msg }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogConfirmVisible = false"
          >确 认</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import API from '@/api'
import { fileFormat } from '@/utils/validate'
import vOrg from './org'
import vCard from '@/components/card/card'
export default {
  components: {
    vOrg, vCard
  },
  props: {
    dialogEditVisible: {
      type: Boolean
    },
    type: {
      type: String
    },
    currentGroup: {
      type: Object
    }
  },
  watch: {
    dialogEditVisible(value) {
      if (value) {
        // 初始化数据
        this.editForm = {
          groupName: this.type === 'create' ? '' : this.currentGroup.groupName,
          groupDesc: this.type === 'create' ? '' : this.currentGroup.groupDesc,
          groupType: this.type === 'create' ? '1' : this.currentGroup.groupType,
          groupNo: this.type === 'create' ? '' : this.currentGroup.groupNo
        }
        this.custForm = {
          orgName: this.type === 'create' ? '' : this.currentGroup.orgName,
          orgNo: this.type === 'create' ? '' : this.currentGroup.orgNo,
          certYcCity: this.type === 'create' ? '' : this.currentGroup.certYcCity,
          certYcDistrict: this.type === 'create' ? '' : this.currentGroup.certYcDistrict
        }

        this.custLevel =
          this.type === 'create' || this.currentGroup.custLevel === null
            ? []
            : this.currentGroup.custLevel.split(',')
        this.card = this.type === 'create' ? '' : this.currentGroup.cardName

        this.fileName = ''
        // 移除所有表单项的校验
        this.$nextTick(() => {
          this.$refs['editForm'].clearValidate()
        })
      }
    }
  },
  data() {
    return {
      step: 1,
      editForm: {
        groupName: '',
        groupDesc: '',
        groupType: '1',
        groupNo: ''
      },
      rules: {
        groupName: [
          { required: true, message: '请输入客户组名称', trigger: 'blur' }
        ],
        groupDesc: [
          { required: true, message: '请输入客户组说明', trigger: 'blur' }
        ],
        groupType: [
          { required: true, message: '请选择客户组类型', trigger: 'change' }
        ]
      },
      fileName: '',
      loading: false,
      messageShow: false,
      msg: '',
      dialogConfirmVisible: false,
      orgVisible: false,
      cardVisible: false,
      fileList: [],
      formData: new FormData(),
      custForm: {
        // custLevel: '',
        orgName: '',
        orgNo: ''
      },
      custLevel: [],
      card: '',
      custLevels: [
        {
          value: '0',
          label: '零星'
        },
        {
          value: '1',
          label: '一星'
        },
        {
          value: '2',
          label: '二星'
        },
        {
          value: '3',
          label: '三星'
        },
        {
          value: '4',
          label: '四星'
        },
        {
          value: '5',
          label: '五星'
        },
        {
          value: '6',
          label: '六星'
        }
      ]
    }
  },
  computed: {
    setTitle() {
      return this.editForm.groupType === '0' ? '导入名单' : '筛选条件'
    }
  },
  methods: {
    // 下一步/导入
    save() {
      if (this.step === 1) {
        this.$refs['editForm'].validate(valid => {
          if (!valid) {
            return false
          }
          this.editgroup()
        })
      } else {
        if (this.editForm.groupType === '0') {
          this.upload()
        } else {
          this.addGroupCust()
        }
      }
    },
    // 创建/更新客户组名单
    editgroup() {
      this.loading = true
      if (this.type === 'create') {
        API.custgroup
          .saveCustGroup(
            Object.assign(this.editForm, {
              groupName: this.editForm.groupName.trim(),
              groupDesc: this.editForm.groupDesc.trim(),
              createEmpNo: this.$store.state.user.id,
              createEmpName: this.$store.state.user.name,
              scoreChannel: this.$store.state.user.channel
            })
          )
          .then(data => {
            // 下一步
            this.loading = false
            if (this.editForm.groupType !== '2' && this.editForm.groupType !== '3') {
              this.step = 2
              this.editForm.groupNo = data.data.msg
            } else {
              this.$message.success('保存成功！')
              this.cancel()
            }
          })
          .catch(error => {
            this.loading = false
            this.$message.error(error.msg)
          })
      } else {
        API.custgroup
          .updateCustGroup(
            Object.assign(this.editForm, {
              groupName: this.editForm.groupName.trim(),
              groupDesc: this.editForm.groupDesc.trim(),
              modifyEmpNo: this.$store.state.user.id,
              modifyEmpName: this.$store.state.user.name
            })
          )
          .then(() => {
            this.loading = false
            if (this.editForm.groupType !== '2' && this.editForm.groupType !== '3') {
              this.step = 2
            } else {
              this.$message.success('保存成功！')
              this.cancel()
            }
          })
          .catch(error => {
            this.loading = false
            this.$message.error(error.msg)
          })
      }
    },
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
        this.resetForm()
        return
      }
      this.formData.append('file', param.file)
      this.addCustByExcel()
    },
    // 导入
    upload() {
      if (this.fileName === '') {
        this.messageShow = true
        return
      }
      this.loading = true
      this.formData = new FormData()
      this.$refs.upload.submit()
    },
    // 上传文件
    addCustByExcel() {
      API.custgroup
        .addCustByExcel(this.formData, this.editForm.groupNo)
        .then(res => {
          this.loading = false
          this.msg = res.data.msg
          this.dialogConfirmVisible = true
          this.$refs.upload.clearFiles()
          this.fileName = ''
          this.resetForm()
        })
        .catch(error => {
          this.loading = false
          this.$refs.upload.clearFiles()
          this.fileName = ''
          this.resetForm()
          this.$message.error(error.msg)
        })
    },
    resetForm() {
      // 判断ie10以及以下
      let isIE10 = window.navigator.userAgent.indexOf('MSIE') >= 1
      // const upload1 = 'upload'
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
    // 下载模板
    download() {
      // 返回数据流
      API.custgroup
        .downloadTemplate()
        .then(data => {
          let blob = new Blob([data.data], {
            type:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          })
          // ie浏览器
          if (!!window.ActiveXObject || 'ActiveXObject' in window) {
            window.navigator.msSaveOrOpenBlob(blob, '客户组导入模板.xlsx')
          } else {
            const a = document.createElement('a')
            a.style.display = 'none'
            a.download = '客户组导入模板.xlsx'
            a.href = window.URL.createObjectURL(blob)
            a.click()
          }
        })
        .catch(() => {
          this.$message.error('暂无数据')
        })
    },
    searchOrg() {
      this.orgVisible = true
    },
    cancelOrg(val) {
      this.orgVisible = false
      if (val.type === 'add') {
        this.custForm.orgNo = val.orgInfo.orgNo
        this.custForm.orgName = val.orgInfo.orgName
      }
    },
    cancelCard(val) {
      this.cardVisible = false
      if (val.type === 'add') {
        let checkedNodes = []
        let certYcDistrict = []
        let certYcCity = []
        val.checkedNodes.forEach(node => {
          if (node.label) {
            checkedNodes.push(node.label)
          }
          if (node.type && node.type === 'cert_yc_district') {
            certYcDistrict.push(node.value)
          }
          if (node.type && node.type === 'cert_yc_city') {
            certYcCity.push(node.value)
          }
        })
        // 反显
        this.card = checkedNodes.join(',')
        // 传值
        this.custForm.certYcDistrict = certYcDistrict.join(',')
        this.custForm.certYcCity = certYcCity.join(',')
      }
    },

    addGroupCust() {
      if (
        this.custLevel.length === 0 &&
        !this.custForm.orgNo &&
        !this.card
      ) {
        this.$message.warning('请至少选择一项！')
        return
      }
      API.custgroup
        .addGroupCust(
          Object.assign(
            {
              custLevel: this.custLevel.join(','),
              groupNo: this.editForm.groupNo,
              groupType: this.editForm.groupType
            },
            this.custForm
          )
        )
        .then(() => {
          this.$message.success('保存成功！')
          this.cancel()
        })
        .catch(error => {
          this.$message.error(error.msg)
        })
    },
    cancel() {
      this.$emit('cancel', { type: 'edit', step: this.step })
      setTimeout(() => {
        this.step = 1
        this.messageShow = false
      }, 350)
    }
  }
}
</script>

<style lang="scss" scoped>
.group-edit {
  /deep/ .el-input,
  /deep/ .el-textarea {
    width: 260px;
  }
  // .step2 {
  //   /deep/ .el-input,
  //   /deep/ .el-textarea {
  //     width: 460px;
  //   }
  // }
  /deep/ .el-step {
    width: 30%;
    max-width: unset !important;
  }
  /deep/ .el-select__tags {
    flex-wrap: wrap;
    span {
      flex-wrap: wrap;
    }
  }
  .cus-button /deep/ .el-button {
    height: 26px;
    line-height: 26px;
    padding: 0 9px;
  }
  .upload {
    display: flex;
    align-items: center;
  }
  .message {
    color: #f56c6c;
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
    padding-left: 74px;
    position: absolute;
  }
}
</style>
