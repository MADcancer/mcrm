<template>
  <div class="email-info">
    <el-dialog
      title="业务邮箱详情"
      :visible.sync="dialogInfoVisible"
      width="600px"
      :before-close="cancel"
    >
      <el-form :model="editForm" ref="editForm">
        <el-form-item label="姓名：" label-width="70px" prop="username">
          <el-input
            v-model="editForm.username"
            autocomplete="off"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱：" label-width="70px" prop="email">
          <el-input
            v-model="editForm.email"
            autocomplete="off"
            disabled
          ></el-input>
        </el-form-item>
         <el-form-item label="工号：" label-width="70px" prop="userno">
            <el-input
              v-model="editForm.userno"
              autocomplete="off"
              disabled
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
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    dialogInfoVisible: {
      type: Boolean
    },
    info: {
      type: Object
    }
  },
  watch: {
    dialogInfoVisible(value) {
      if (value) {
        this.waitLoading = true
        // 初始化数据
        this.editForm = this.info
      }
    }
  },
  data() {
    return {
      waitLoading: false,
      editForm: {
        username: '',
        email: '',
        scoreChannel: this.$store.state.user.channel
      }
    }
  },
  methods: {
    cancel() {
      this.$emit('cancel', { type: 'info' })
    }
  }
}
</script>
<style lang="scss" scoped>
.email-info {
  .inline-form {
    display: flex;
    /deep/ .el-input {
      width: 240px;
    }
  }
}
</style>
