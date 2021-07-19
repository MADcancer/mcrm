<template>
  <div class="supplier-edit">
    <el-dialog
      :title="type === 'create' ? '创建供应商' : '修改供应商'"
      :visible.sync="dialogEditVisible"
      width="800px"
      :before-close="cancel"
    >
      <div style="width: 100%" v-loading="waitLoading">
        <el-form :model="editForm" :rules="rules" ref="editForm">
          <div class="inline-form">
            <el-form-item
              label="供应商名称："
              label-width="120px"
              prop="suppName"
            >
              <el-input
                v-model="editForm.suppName"
                autocomplete="off"
                maxlength="60"
              ></el-input>
            </el-form-item>
            <el-form-item label="供应商渠道：" label-width="120px">
              <el-input
                v-model="$root.selectOption.channelObj[editForm.suppChannel]"
                autocomplete="off"
                disabled
              ></el-input>
            </el-form-item>
          </div>
          <div class="inline-form">
            <el-form-item
              label="供应商联系人："
              label-width="120px"
              prop="suppLinkman"
            >
              <el-input
                v-model="editForm.suppLinkman"
                autocomplete="off"
                maxlength="60"
              ></el-input>
            </el-form-item>
            <el-form-item label="供应商电话：" label-width="120px" prop="suppTel">
              <el-input
                v-model="editForm.suppTel"
                autocomplete="off"
                maxlength="13"
              ></el-input>
            </el-form-item>
          </div>
          <div class="inline-form">
            <el-form-item
              label="供应商邮箱："
              label-width="120px"
              prop="suppEmail"
            >
              <el-input
                v-model="editForm.suppEmail"
                autocomplete="off"
                maxlength="30"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="清算行："
              label-width="120px"
            >
              <el-input
                v-model="editForm.cleBank"
                autocomplete="off"
                maxlength="60"
              ></el-input>
            </el-form-item>
          </div>
          <div class="inline-form">
            <el-form-item label="清算账户名：" label-width="120px">
              <el-input
                v-model="editForm.cleAccountName"
                autocomplete="off"
                maxlength="16"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="清算账户："
              label-width="120px"
            >
              <el-input
                v-model="editForm.cleAccount"
                autocomplete="off"
                maxlength="22"
              ></el-input>
            </el-form-item>
          </div>
          <el-form-item label="供应商地址：" label-width="120px" prop="suppAddr">
            <el-input
              v-model="editForm.suppAddr"
              autocomplete="off"
              maxlength="60"
            ></el-input>
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
    suppId: {
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
          this.editForm.suppChannel = this.$store.state.user.channel
        } else {
          this.waitLoading = true
          API.supplier
            .qrySupplier(this.suppId)
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
    // 校验联系电话
    var checkPhone = (rule, value, callback) => {
      // 判断固定电话以及移动电话
      if (
        !/^(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])\d{8}$/.test(
          value
        ) &&
        !/^(0|4)\d{2,3}-?\d{7,8}$/.test(value)
      ) {
        return callback(new Error('电话格式不正确'))
      }
      return callback()
    }
    var validateEmail = (rule, value, callback) => {
      if (value && !isEmail(value)) {
        callback(new Error('邮箱格式错误'))
      } else {
        callback()
      }
    }
    return {
      waitLoading: false,
      editForm: {
        suppName: '',
        suppChannel: this.$store.state.user.channel,
        suppLinkman: '',
        suppTel: '',
        cleAccount: '',
        cleBank: '',
        suppEmail: '',
        suppAddr: '',
        notes: ''
      },
      rules: {
        suppName: [
          { required: true, message: '请输入供应商名称', trigger: 'blur' }
        ],
        // suppChannel: [
        //   { required: true, message: '请选择供应商渠道', trigger: 'change' }
        // ],
        suppLinkman: [
          { required: true, message: '请输入供应商联系人', trigger: 'blur' }
        ],
        suppTel: [
          { required: true, message: '请输入供应商电话', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ],
        // cleAccount: [
        //   { required: true, message: '请输入清算账户', trigger: 'blur' }
        // ],
        suppEmail: [{ validator: validateEmail, trigger: 'blur' }],
        suppAddr: [{ required: true, message: '请输入供应商地址', trigger: 'blur' }]
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

    // 供应商保存修改
    confirmSubmit() {
      this.loading = true
      API.supplier
        .saveSupplier(
          Object.assign(this.editForm, {
            suppName: this.editForm.suppName.trim(),
            suppLinkman: this.editForm.suppLinkman.trim(),
            suppTel: this.editForm.suppTel.trim(),
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
.supplier-edit {
  .inline-form {
    display: flex;
    /deep/ .el-input {
      width: 240px;
    }
  }
}
</style>
