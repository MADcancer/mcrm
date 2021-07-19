<template>
  <div class="emial-edit">
    <el-dialog
      :title="type === 'create' ? '创建业务邮箱' : '修改业务邮箱'"
      :visible.sync="dialogEditVisible"
      width="600px"
      :before-close="cancel"
    >
      <div v-loading="waitLoading">
        <el-form :model="editForm" :rules="rules" ref="editForm">
          <el-form-item
            label="姓名："
            label-width="70px"
            prop="username"
          >
            <el-input
              v-model="editForm.username"
              autocomplete="off"
              maxlength="60"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="邮箱："
            label-width="70px"
            prop="email"
          >
            <el-input
              v-model="editForm.email"
              autocomplete="off"
              maxlength="60"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="工号："
            label-width="70px"
            prop="userno"
          >
            <el-input
              v-model="editForm.userno"
              autocomplete="off"
              maxlength="7"
            ></el-input>
          </el-form-item>
          <el-form-item label="渠道：" label-width="70px">
            <el-input
              v-model="$root.selectOption.channelObj[editForm.scoreChannel]"
              autocomplete="off"
              disabled
            ></el-input>
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
import { isEmail } from '@/utils/validate'
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
          this.editForm.scoreChannel = this.$store.state.user.channel
        } else {
          this.waitLoading = true
          API.supplierEmail
            .getBusiUser(this.id)
            .then(res => {
              this.editForm = res.data.data
              this.waitLoading = false
            })
            .catch(() => {
              this.waitLoading = false
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
    var validateEmail = (rule, value, callback) => {
      if (!isEmail(value)) {
        callback(new Error('邮箱格式错误'))
      } else {
        callback()
      }
    }
    var validateNo = (rule, value, callback) => {
      if (String(value).length !== 7 || !(/^[0-9]{1,}[\d]*$/).test(value)) {
        return callback(new Error('工号必须为7位且只能是数字'))
      }
      return callback()
    }
    return {
      waitLoading: false,
      editForm: {
        username: '',
        email: '',
        userno: '',
        scoreChannel: this.$store.state.user.channel
      },
      rules: {
        username: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
        ],
        userno: [
          { required: true, message: '请输入人工号', trigger: 'blur' },
          { validator: validateNo, trigger: 'blur' }
        ]
      },
      loading: false,
      dialogConfirmVisible: false
    }
  },
  computed: {},
  methods: {
    // 提交
    save() {
      this.$refs['editForm'].validate(valid => {
        if (!valid) {
          return false
        }
        this.dialogConfirmVisible = true
      })
    },

    // 邮箱保存修改
    confirmSubmit() {
      this.loading = true
      API.supplierEmail
        .saveBusiUser(
          Object.assign(this.editForm, {
            username: this.editForm.username.trim(),
            email: this.editForm.email.trim(),
            userno: this.editForm.userno.trim(),
            createEmpName:
              this.type === 'create' ? this.$store.state.user.name : '',
            createEmpNo:
              this.type === 'create' ? this.$store.state.user.id : '',
            modifyEmpName:
              this.type === 'create' ? '' : this.$store.state.user.name,
            modifyEmpNo: this.type === 'create' ? '' : this.$store.state.user.id
          })
        )
        .then(() => {
          this.loading = false
          this.dialogConfirmVisible = false
          this.$message.success('操作成功！')
          this.cancel()
        })
        .catch(error => {
          this.loading = false
          this.$message.error(error.msg)
        })
    },
    cancel() {
      this.$emit('cancel', { type: this.type })
    }
  },
  created() {}
}
</script>

<style lang="scss" scoped>
.emial-edit {
  /deep/ .el-input {
    width: 240px;
  }
}
</style>
