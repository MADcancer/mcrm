<template>
  <div class="msg-edit">
    <el-form
      :model="editMsg"
      :rules="rules"
      ref="editMsg"
      label-position="left"
      v-loading="waitLoading"
    >
      <el-form-item
        label="短信模板名称："
        label-width="120px"
        prop="smsTemplateName"
      >
        <el-input v-model="editMsg.smsTemplateName" autocomplete="off" disabled
          ><img
            src="~@/assets/img/search-logo.png"
            slot="suffix"
            style="width:16px; height:18px; margin-bottom:2px"
            @click="dialogProdmsgVisible = true"
        /></el-input>
      </el-form-item>
      <el-form-item label="短信内容：" label-width="120px" prop="sentCon">
        <el-input
          type="textarea"
          :rows="4"
          maxlength="200"
          v-model="editMsg.sentCon"
          autocomplete="off"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="发送内容：" label-width="120px" prop="msgContext" :required="checkMsg">
        <el-input
          type="textarea"
          :rows="4"
          maxlength="200"
          v-model="editMsg.msgContext"
          autocomplete="off"
          :disabled="!checkMsg"
        ></el-input>
      </el-form-item>
    </el-form>
    <!-- 选择短信模板 -->
    <prodmsg-select
      :dialogProdmsgVisible="dialogProdmsgVisible"
      @cancel="close"
    ></prodmsg-select>
    <!-- 确认弹框 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogConfirmVisible"
      width="30%"
      class="cus-confirm"
      :modal-append-to-body="false"
      :append-to-body="true"
    >
      <span>是否确认提交？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveProdMsg" :loading="loading"
          >确 认</el-button
        >
        <el-button @click="dialogConfirmVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import prodmsgSelect from './prodmsg-select'
import API from '@/api'
export default {
  components: { prodmsgSelect },
  props: {
    step: {
      type: Number
    },
    steps: {
      type: Number
    },
    operate: {
      type: String
    },
    type: {
      type: String
    },
    prodId: {
      type: String
    },
    msgContext: {
      type: String
    },
    smsTemplateId: {
      type: String
    }
  },
  watch: {
    'step': {
      deep: true,
      immediate: true,
      handler: function(value) {
        if (this.steps > 2 && value === this.steps) {
          // 初始化数据
          if (this.type === 'create') {
            this.editMsg = {
              smsTemplateName: '',
              sentCon: '',
              prodId: this.prodId,
              msgContext: '',
              smsTemplateId: ''
            }
          } else {
            this.waitLoading = true
            this.$emit('setLoading', true)
            API.prodmsg.getMsgTemplateDetail(this.smsTemplateId).then(res => {
              this.waitLoading = false
              this.$emit('setLoading', false)
              this.editMsg = {
                smsTemplateName: res.data.data.smsTemplateName,
                sentCon: res.data.data.sentCon,
                prodId: this.prodId,
                msgContext: this.msgContext,
                smsTemplateId: this.smsTemplateId
              }
            }).catch(() => {
              this.waitLoading = false
              this.$emit('setLoading', false)
            })
          }

          // 移除所有表单项的校验
          this.$nextTick(() => {
            this.$refs['editMsg'].clearValidate()
          })
        }
      }
    },

    operate(value) {
      if (value === 'submit') {
        this.$emit('setOperate', '')
        // 校验发送内容 (单个触发验证)
        // this.$refs['editMsg'].validateField('smsTemplateName')
        this.$refs['editMsg'].validate(valid => {
          if (!valid) {
            return false
          }
          this.dialogConfirmVisible = true
        })
      }
    }
  },
  data() {
    var checkContext = (rule, value, callback) => {
      if (this.checkMsg && !value) {
        return callback(new Error('请输入发送内容'))
      }
      return callback()
    }
    return {
      editMsg: {
        smsTemplateName: '',
        sentCon: '',
        msgContext: '',
        smsTemplateId: ''
      },
      rules: {
        smsTemplateName: [
          { required: true, message: '请输入短信模板名称', trigger: 'change' }
        ],
        sentCon: [
          { required: true, message: '请输入短信内容', trigger: 'change' }
        ],
        msgContext: [
          // { required: true, message: '请输入发送内容', trigger: 'blur' }
          { validator: checkContext, trigger: 'blur' }
        ]
      },
      dialogProdmsgVisible: false,
      dialogConfirmVisible: false,
      loading: false,
      waitLoading: false
    }
  },
  computed: {
    checkMsg() {
      return this.editMsg.sentCon.indexOf('[发送内容]') !== -1
    }
  },
  methods: {
    // 关闭供应商弹框
    close(val) {
      setTimeout(() => {
        this.dialogProdmsgVisible = false
      }, 350)
      if (val && val.info.id) {
        this.editMsg.sentCon = val.info.sentCon
        // this.editMsg.sentCon = '[名称]'
        this.editMsg.smsTemplateName = val.info.smsTemplateName
        this.editMsg.smsTemplateId = val.info.id
        this.editMsg.msgContext = ''
        this.$refs.editMsg.clearValidate('msgContext')
      }
    },

    // 商品保存修改(短信模板)
    saveProdMsg() {
      this.loading = true
      API.product
        .saveProdMsg(
          Object.assign(this.editMsg, {
            modifyEmpName: this.$store.state.user.name,
            modifyEmpNo: this.$store.state.user.id,
            prodId: this.prodId
          })
        )
        .then(() => {
          this.loading = false
          this.dialogConfirmVisible = false
          this.$message.success('操作成功！')
          this.$emit('cancel', '')
        })
        .catch(error => {
          this.loading = false
          this.dialogConfirmVisible = false
          this.$message.error(error.msg)
        })
    }
  },
  created() {}
}
</script>

<style lang="scss" scoped>
.msg-edit {
  /deep/ .el-input {
    width: 220px;
  }
}
</style>
