<template>
  <el-dialog
    class="sort-dialog"
    title="查询"
    :visible.sync="boardSortVisible"
    width="550px"
    :before-close="cancel"
    :append-to-body="true"
  >
    <div>
      <el-form
        :model="editForm"
        ref="editForm"
        :rules="rules"
        label-width="80px"
        class="demo-dynamic"
        size="mini"
        label-position="left"
      >
        <el-form-item label="活动顺序:" prop="sort">
          <el-input
            maxlength="6"
            placeholder="请输入活动顺序"
            v-model="editForm.sort"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button type="primary" @click="save" :loading="loading"
          >提交</el-button
        >
        <el-button @click="cancel">取消</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import API from '@/api'
export default {
  props: {
    boardSortVisible: {
      type: Boolean
    },
    actId: {
      type: String
    }
  },
  watch: {
    boardSortVisible(value) {
      if (value) {
        API.newlottery.getLotteryActBaseData({actId: this.actId}).then(res => {
          this.editForm.sort = res.data.data.sort || ''
        })
      }
    }
  },
  data() {
    return {
      editForm: {
        sort: ''
      },
      loading: false,
      rules: {
        sort: [
          {
            required: true,
            message: '请输入活动顺序',
            trigger: 'blur'
          },
          {
            pattern: /^[1-9]\d*$/,
            message: '请输入正整数',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    cancel(optiontype = 'cancel') {
      this.$emit('cancel', { type: optiontype })
    },
    save() {
      this.loading = true
      API.newlottery
        .modifyLotteryActSort({
          actId: this.actId,
          sort: this.editForm.sort,
          modifyEmpName: this.$store.state.user.name,
          modifyEmpNo: this.$store.state.user.id
        })
        .then(() => {
          this.loading = false
          this.$message.success('修改成功')
          this.cancel('success')
        })
        .catch(err => {
          this.loading = false
          this.$message.error(err.msg)
        })
    }
  }
}
</script>
<style lang="scss" scoped></style>
