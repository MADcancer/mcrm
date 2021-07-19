<template>
  <div class="edit">
    <el-dialog
      :title="type === 'create' ? '创建优惠券类型' : '修改优惠券类型'"
      :visible.sync="dialogEditVisible"
      width="700px"
      :before-close="cancel"
    >
      <div v-loading="waitLoading">
        <el-form
          label-position="left"
          label-width="100px"
          :model="editForm"
          :rules="rules"
          ref="editForm"
        >
          <el-form-item label="类型名称：" prop="yhmTypeName">
            <el-input
              v-model="editForm.yhmTypeName"
              autocomplete="off"
              maxlength="60"
            ></el-input>
          </el-form-item>
          <el-form-item label="种类：" prop="yhmKind">
            <el-select v-model="editForm.yhmKind" placeholder="" :disabled="type === 'update'">
              <el-option label="请选择" value=""></el-option>
              <el-option label="资格券" value="1"></el-option>
              <el-option label="面额券" value="2"></el-option>
              <el-option label="折扣券" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="editForm.status" placeholder="">
              <el-option label="请选择" value=""></el-option>
              <el-option label="停用" value="0"></el-option>
              <el-option label="启用" value="1"></el-option>
            </el-select>
          </el-form-item>
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
        <el-button type="primary" @click="handleConfirm" :loading="loading"
          >确 认</el-button
        >
        <el-button @click="noticeDialogVisible = false">取 消</el-button>
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
    id: {
      type: String
    },
    type: {
      type: String
    }
  },
  watch: {
    dialogEditVisible(value) {
      if (value) {
        if (this.type === 'create') {
          this.editForm = {
            yhmTypeName: '',
            yhmKind: '',
            status: ''
          }
        } else {
          this.waitLoading = true
          API.coupon.getYhmTypeById(this.id).then(res => {
            this.editForm = res.data.data
            this.waitLoading = false
          }).catch(() => {
            this.waitLoading = false
          })
        }
      }
    }
  },
  data() {
    return {
      editForm: {
        yhmTypeName: '',
        yhmKind: '',
        status: ''
      },
      waitLoading: false,
      upLoading: false,
      loading: false,
      noticeDialogVisible: false,
      rules: {
        yhmTypeName: [
          { required: true, message: '请输入类型名称', trigger: 'blur' }
        ],
        yhmKind: [
          { required: true, message: '请选择种类', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ]
      }
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
      API.coupon
        .editYhmType({
          ...this.editForm,
          yhmTypeName: this.editForm.yhmTypeName.trim(),
          createEmpName:
            this.type === 'create' ? this.$store.state.user.name : '',
          createEmpNo: this.type === 'create' ? this.$store.state.user.id : '',
          modifyEmpName:
            this.type === 'create' ? '' : this.$store.state.user.name,
          modifyEmpNo: this.type === 'create' ? '' : this.$store.state.user.id,
          yhmTypeId: this.type === 'create' ? '' : this.id
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
      this.$emit('cancel', {type: this.type})
      setTimeout(() => {
        if (this.$refs['editForm']) {
          this.$refs['editForm'].clearValidate()
        }
      }, 350)
    }
  }
}
</script>

<style lang="scss" scoped>
.edit {
  /deep/ .el-input,
  /deep/ .el-input__inner {
    width: 260px;
    height: 26px !important;
    line-height: 26px !important;
  }
  /deep/ .el-form-item {
    margin-bottom: 14px;
  }
}
</style>
