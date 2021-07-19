<template>
  <div>
    <el-dialog
      title="延长过期时间"
      :visible.sync="dialogUpdTimeVisible"
      width="700px"
      :before-close="cancel"
    >
      <div>
        <el-form :model="editForm">
          <el-form-item label="过期时间：" label-width="120px">
            <el-date-picker
              v-model="editForm.newExpireDate"
              type="date"
              format="yyyy/MM/dd"
              value-format="yyyy/MM/dd"
              :editable="false"
              :clearable="false"
              :picker-options="pickerOptions"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align: center">
          <el-button type="primary" @click="save" :loading="loading">提交</el-button>
          <el-button @click="cancel">取消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import API from '@/api'
export default {
  props: {
    dialogUpdTimeVisible: {
      type: Boolean
    },
    expireTime: {
      type: String
    },
    prodId: {
      type: String
    }
  },
  watch: {
    dialogUpdTimeVisible(value) {
      if (value) {
        this.editForm.newExpireDate = this.expireTime
        this.expireDateHid = this.expireTime
      }
    }
  },
  data() {
    return {
      editForm: {
        newExpireDate: ''
      },
      expireDateHid: '',
      loading: false,
      pickerOptions: {
        disabledDate: time => {
          return time.getTime() < new Date(this.expireDateHid).getTime()
        }
      }
    }
  },
  methods: {
    cancel() {
      this.$emit('cancel', { type: 'updTime' })
    },
    save() {
      this.loading = true
      API.product
        .extendDate({
          prodId: this.prodId,
          newExpireDate: this.editForm.newExpireDate
        })
        .then(() => {
          this.loading = false
          this.$message.success('操作成功！')
          this.cancel()
        }).catch((error) => {
          this.loading = false
          this.$message.error(error.msg)
        })
    }
  }
}
</script>

<style lang="scss" scoped></style>
