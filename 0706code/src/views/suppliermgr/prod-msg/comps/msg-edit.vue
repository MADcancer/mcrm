<template>
  <div class="msg-edit">
    <el-dialog
      :title="type === 'create' ? '短信模板创建' : '短信模板修改'"
      :visible.sync="dialogEditVisible"
      width="800px"
      :before-close="cancel"
    >
      <el-form
        :model="editForm"
        :rules="rules"
        ref="editForm"
        label-position="left"
        style="width: 100%"
      >
        <div class="inline-form">
          <el-form-item
            label="短信模板编号："
            label-width="120px"
            prop="smsTemplateId"
          >
            <el-input
              v-model="editForm.smsTemplateId"
              autocomplete="off"
              maxlength="32"
              :disabled="type === 'update'"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="短信模板名称："
            label-width="120px"
            prop="smsTemplateName"
          >
            <el-input
              v-model="editForm.smsTemplateName"
              autocomplete="off"
              maxlength="60"
            ></el-input>
          </el-form-item>
        </div>
        <div class="inline-form">
          <el-form-item
            label="权益渠道："
            label-width="120px"
            prop="equityChannel"
          >
            <el-select v-model="editForm.equityChannel" disabled>
              <el-option
                v-for="item in $root.selectOption.channel"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="发送方式：" label-width="120px" prop="sendType">
            <el-select v-model="editForm.sendType">
              <el-option label="请选择" value=""></el-option>
              <el-option label="手机短信" value="1"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <el-form-item label="模板内容：" label-width="120px" prop="sentCon">
          <el-input
            type="textarea"
            :rows="4"
            maxlength="100"
            v-model="editForm.sentCon"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="短信标签：" label-width="120px">
          <div class="tabs-inline">
            <div v-for="(tab, index) in tabs" :key="index">
              <i class="el-icon-circle-plus" @click="addTabs(tab)"></i>
              <div>{{ tab.name }}</div>
            </div>
          </div>
          <div style="color:#f56c6c">若需使用短信平台登记注册的空模板，则只选择【发送内容】</div>
        </el-form-item>
        <el-form-item label="备注：" label-width="120px" prop="notes">
          <el-input
            type="textarea"
            :rows="4"
            maxlength="100"
            v-model="editForm.notes"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save">提交</el-button>
        <el-button @click="cancel">取消</el-button>
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
        <el-button type="primary" @click="saveMsgTemplate" :loading="loading"
          >确 认</el-button
        >
        <el-button @click="dialogConfirmVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import API from '@/api'
export default {
  props: {
    dialogEditVisible: {
      type: Boolean
    },
    type: {
      type: String
    },
    id: {
      type: String
    }
  },
  watch: {
    dialogEditVisible(value) {
      if (value) {
        // 初始化数据
        if (this.type === 'create') {
          for (let key in this.editForm) {
            this.editForm[key] = ''
          }
          this.editForm.equityChannel = this.$store.state.user.channel
        } else {
          API.prodmsg.getMsgTemplateDetail(this.id).then(res => {
            this.editForm = res.data.data
          })
        }
        // 移除所有表单项的校验
        this.$nextTick(() => {
          this.$refs['editForm'].clearValidate()
        })
      }
    }
  },
  data() {
    var checkSentCon = (rule, value, callback) => {
      if (value.length > 100) {
        return callback(new Error('最多只能输入100个字符'))
      }
      let result = this.tabsName.findIndex(item => {
        return value.indexOf(item) !== -1
      })
      if (result === -1) {
        return callback(new Error('模板内容至少包含一个短信标签'))
      }
      return callback()
    }
    var checkId = (rule, value, callback) => {
      if (value && !/^[0-9a-zA-Z]*$/.test(value)) {
        return callback(new Error('只能输入校验字母或数字'))
      }
      return callback()
    }
    return {
      editForm: {
        smsTemplateName: '',
        equityChannel: this.$store.state.user.channel,
        sendType: '',
        sentCon: '',
        // msgParam: '',
        notes: ''
      },
      tabs: [
        {
          type: 'cusName',
          name: '客户姓名'
        },
        {
          type: 'actName',
          name: '活动名称'
        },
        {
          type: 'count',
          name: '数量'
        },
        {
          type: 'date',
          name: '日期'
        },
        {
          type: 'proName',
          name: '商品名称'
        },
        {
          type: 'cardNo',
          name: '卡号'
        },
        {
          type: 'code',
          name: '券码'
        },
        {
          type: 'sentContent',
          name: '发送内容'
        }
      ],
      tabsName: ['[客户姓名]', '[活动名称]', '[数量]', '[日期]', '[商品名称]', '[卡号]', '[券码]', '[发送内容]'],
      rules: {
        smsTemplateId: [
          { required: true, message: '请输入短信编号', trigger: 'blur' },
          {validator: checkId, trigger: 'blur'}
        ],
        smsTemplateName: [
          { required: true, message: '请输入短信模板名称', trigger: 'blur' }
        ],
        equityChannel: [
          { required: true, message: '请选择权益渠道', trigger: 'change' }
        ],
        sendType: [
          { required: true, message: '请选择发送方式', trigger: 'change' }
        ],
        sentCon: [
          { required: true, message: '请输入模板内容', trigger: 'change' },
          { validator: checkSentCon, trigger: 'change' }
        ]
      },
      loading: false,
      dialogConfirmVisible: false
    }
  },
  computed: {},
  methods: {
    // 下一步/导入
    save() {
      this.$refs['editForm'].validate(valid => {
        if (!valid) {
          return false
        }
        this.dialogConfirmVisible = true
      })
    },

    // 创建及修改短信模板
    saveMsgTemplate() {
      this.loading = true
      API.prodmsg
        .saveMsgTemplate(
          Object.assign(this.editForm, {
            smsTemplateName: this.editForm.smsTemplateName.trim(),
            createEmpName: this.type === 'create' ? this.$store.state.user.name : '',
            createEmpNo: this.type === 'create' ? this.$store.state.user.id : '',
            modifyEmpName: this.type === 'create' ? '' : this.$store.state.user.name,
            modifyEmpNo: this.type === 'create' ? '' : this.$store.state.user.id,
            id: this.type === 'create' ? '' : this.id
          })
        )
        .then(data => {
          this.loading = false
          this.step = 2
          this.$message.success('操作成功！')
          this.dialogConfirmVisible = false
          this.cancel()
        })
        .catch((error) => {
          this.loading = false
          this.$message.error(error.msg)
        })
    },
    // 添加标签
    addTabs(tab) {
      this.editForm.sentCon = `${this.editForm.sentCon} [${tab.name}] `
    },
    cancel() {
      this.$emit('cancel', { type: this.type })
    }
  },
  created() {}
}
</script>

<style lang="scss" scoped>
.msg-edit {
  .inline-form {
    display: flex;
    justify-content: space-between;
    /deep/ .el-input {
      width: 180px;
    }
  }
  .tabs-inline {
    display: flex;
    i {
      padding-right: 5px;
      &:hover {
        cursor: pointer;
      }
    }
    > div {
      display: flex;
      align-items: center;
      justify-content: center;
      padding-right: 15px;
    }
  }
}
</style>
