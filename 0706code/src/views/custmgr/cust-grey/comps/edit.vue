<template>
  <div class="edit">
    <el-dialog
      :title="type === 'create' ? '创建灰度名单' : '修改灰度名单'"
      :visible.sync="dialogEditVisible"
      width="1000px"
      :before-close="cancel"
    >
      <div v-loading="waitLoading">
        <el-form
          label-position="left"
          label-width="120px"
          :model="editForm"
          :rules="rules"
          ref="editForm"
          size="mini"
        >
          <div class="info-form-row">
            <el-form-item label="客户号：" prop="custNo">
              <el-input v-model="editForm.custNo" autocomplete="off" maxlength="60" :disabled="type === 'update'"></el-input>
            </el-form-item>
            <el-form-item label="客户姓名：" prop="custName">
              <el-input v-model="editForm.custName" autocomplete="off" maxlength="60"></el-input>
            </el-form-item>
          </div>
          <div class="info-form-row">
            <el-form-item label="客户等级：" prop="custLevel">
              <el-select v-model="editForm.custLevel" placeholder="请选择">
                <el-option
                  v-for="(item,index) in custLevels"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
                <!-- <el-option v-for="(item, index) in channel" :key="index" :label="item" :value="index === 0 ? '': index" /> -->
              </el-select>
            </el-form-item>
            <el-form-item label="AUM余额：" prop="aumAmt">
              <el-input v-model="editForm.aumAmt" autocomplete="off" maxlength="60"></el-input>
            </el-form-item>
          </div>
          <div class="info-form-row">
            <el-form-item label="积分渠道：" prop="scoreChannel">
              <el-select v-model="editForm.scoreChannel" placeholder="请选择" disabled>
                <el-option
                  v-for="(item,index) in $root.selectOption.channel"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
                <!-- <el-option v-for="(item, index) in channel" :key="index" :label="item" :value="index === 0 ? '': index" /> -->
              </el-select>
            </el-form-item>
            <el-form-item label="可用积分：" prop="avaScore">
              <el-input
                :rows="4"
                maxlength="100"
                v-model="editForm.avaScore"
                autocomplete="off"
                disabled
              ></el-input>
            </el-form-item>
          </div>
          <div class="info-form-row">
            <el-form-item label="上级机构：" prop="parentOrgNo">
              <el-select v-model="editForm.parentOrgNo" @change="editForm.orgNo=orgChildrenData[0].children[0].id" placeholder="请选择">
                <el-option
                  v-for="(item,index) in orgdata"
                  :key="index"
                  :label="item.label"
                  :value="item.id"
                ></el-option>
                <!-- <el-option v-for="(item, index) in channel" :key="index" :label="item" :value="index === 0 ? '': index" /> -->
                .
              </el-select>
            </el-form-item>
            <el-form-item v-show="!!editForm.parentOrgNo" label="机构：" prop="orgNo">
              <el-select v-model="editForm.orgNo" placeholder="请选择">
                <el-option
                  v-for="(item,index) in orgChildrenData.length === 0 ? orgChildrenData : orgChildrenData[0].children"
                  :key="index"
                  :label="item.label"
                  :value="item.id"
                ></el-option>
                <!-- <el-option v-for="(item, index) in channel" :key="index" :label="item" :value="index === 0 ? '': index" /> -->
              </el-select>
            </el-form-item>
          </div>
          <div class="info-form-row">
            <el-form-item label="手机号：" prop="mobile">
              <el-input v-model="editForm.mobile" autocomplete="off" maxlength="60"></el-input>
            </el-form-item>
            <el-form-item label="人才卡：" prop="card">
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
          </div>
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
        <el-button type="primary" @click="handleConfirm" :loading="loading">确 认</el-button>
        <el-button @click="noticeDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <v-card
      :cardVisible="cardVisible"
      :certYcCity="editForm.certYcCity"
      :certYcDistrict="editForm.certYcDistrict"
      @cancelCard="cancelCard"
    ></v-card>
  </div>
</template>

<script>
import API from '@/api'
import vCard from '@/components/card/card'
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
  components: {
    vCard
  },
  watch: {
    dialogEditVisible(value) {
      if (value) {
        if (this.type === 'create') {
          this.card = ''
          this.editForm = {
            custNo: '',
            custName: '',
            custLevel: '',
            scoreChannel: this.$store.state.user.channel,
            orgNo: '',
            aumAmt: '',
            parentOrgNo: '',
            mobile: '',
            isBlack: '0'
          }
        } else {
          API.custgrey.getCustGrayInfo({ custNo: this.id }).then(res => {
            this.editForm = res.data.data
            this.card = this.editForm.cardName
            this.avaScore = res.data.data.avaScore
          })
        }
        this.findAlltree()
      }
    }
  },
  data() {
    return {
      editForm: {
        custNo: '',
        custName: '',
        custLevel: '',
        scoreChannel: this.$store.state.user.channel,
        orgNo: '',
        aumAmt: '',
        parentOrgNo: '',
        avaScore: '',
        certYcCity: '',
        certYcDistrict: ''
      },
      cardVisible: false,
      card: '', // 反显
      waitLoading: false,
      loading: false,
      noticeDialogVisible: false,
      custLevels: [
        {
          value: '0',
          label: '零星'
        }, {
          value: '1',
          label: '一星'
        }, {
          value: '2',
          label: '二星'
        }, {
          value: '3',
          label: '三星'
        }, {
          value: '4',
          label: '四星'
        }, {
          value: '5',
          label: '五星'
        }, {
          value: '6',
          label: '六星'
        }
      ],
      message: '',
      rules: {
        custNo: [
          { required: true, message: '请输入客户号', trigger: 'blur' },
          { required: true, pattern: /^\d{11}$/, message: '客户号必须为11位的数字', trigger: 'blur' }
        ],
        custName: [
          { required: true, message: '请输入客户姓名', trigger: 'blur' }
        ],
        custLevel: [
          { required: true, message: '请选择客户等级', trigger: 'change' }
        ],
        aumAmt: [
          { required: true, pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/, message: '请输入正确的值', trigger: 'blur' }
        ],
        parentOrgNo: [
          { required: true, message: '请选择上级机构', trigger: 'change' }
        ],
        orgNo: [
          { required: true, message: '请选择机构', trigger: 'change' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { required: true, pattern: /^\d{11}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ]
        // subEndtime: [
        //   { required: true, message: '请选择主题结束时间', trigger: 'change' },
        //   { validator: checkEndTime, trigger: 'change' }
        // ]
      },
      orgdata: [],
      score: ''
    }
  },
  methods: {
    save() {
      this.$refs['editForm'].validate(valid => {
        if (!valid) {
          return
        }
        this.noticeDialogVisible = true
      })
    },
    handleConfirm() {
      this.loading = true
      let updateUser
      if (this.type === 'update') {
        updateUser = API.custgrey.updateCustGrayInfo
      } else {
        updateUser = API.custgrey.saveCustGroup
      }
      updateUser({
        ...this.editForm
        // subName: this.editForm.subName.trim(),
        // createEmpName:
        //   this.type === 'create' ? this.$store.state.user.name : '',
        // createEmpNo: this.type === 'create' ? this.$store.state.user.id : '',
        // modifyEmpName:
        //   this.type === 'create' ? '' : this.$store.state.user.name,
        // modifyEmpNo: this.type === 'create' ? '' : this.$store.state.user.id,
        // id: this.type === 'create' ? '' : this.id
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
      this.$emit('cancel', { type: this.type })
      setTimeout(() => {
        this.message = ''
        if (this.$refs['editForm']) {
          this.$refs['editForm'].clearValidate()
        }
      }, 350)
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
    findAlltree() {
      var that = this
      this.waitLoading = true
      API.activity
        .getOrgTreeData()
        .then(res => {
          that.orgdata = res.data.data[0].children
          this.waitLoading = false
        })
        .catch(error => {
          this.$message.error(error.message)
          this.waitLoading = false
        })
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
        this.editForm.certYcDistrict = certYcDistrict.join(',')
        this.editForm.certYcCity = certYcCity.join(',')
      }
    }
  },
  computed: {
    orgChildrenData() {
      return this.orgdata.filter(item => {
        return item.id === this.editForm.parentOrgNo
      })
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
  .info-form-row {
    display: flex;

    .el-form-item:first-child {
      margin-right: 60px;
    }
  }
}
</style>
