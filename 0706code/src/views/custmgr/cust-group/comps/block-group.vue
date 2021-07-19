<template>
  <div class="block-group">
    <el-dialog
      title="客户组黑名单管理"
      :visible.sync="dialogBlockVisible"
      width="600px"
      :before-close="cancel"
    >
      <el-form
        :model="blockForm"
        :rules="rules"
        ref="blockForm"
        label-position="left"
      >
        <el-form-item label="客户组名称：" label-width="100px">
          <el-input v-model="groupName" disabled></el-input>
        </el-form-item>
        <el-form-item label="积分渠道：" label-width="100px">
          <el-input
            v-model="$root.selectOption.channelObj[blockForm.scoreChannel]"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="申请人工号：" label-width="100px">
          <el-input v-model="blockForm.applyEmpNo" disabled></el-input>
        </el-form-item>
        <el-form-item label="申请人：" label-width="100px">
          <el-input v-model="blockForm.applyPerson" disabled></el-input>
        </el-form-item>
        <el-form-item label="申请时间：" label-width="100px">
          <el-input v-model="applyTime" disabled></el-input>
        </el-form-item>
        <el-form-item label="操作类型：" label-width="100px" prop="operaType">
          <el-select v-model="blockForm.operaType">
            <el-option label="请选择" value=""></el-option>
            <el-option label="移入" value="1"></el-option>
            <el-option label="移出" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作原因：" label-width="100px" prop="operaRea">
          <el-input
            type="textarea"
            :rows="4"
            maxlength="100"
            v-model="blockForm.operaRea"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveGroup">提交</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-dialog>
    <!-- 确认弹框 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogConfirmVisible"
      width="30%"
      class="cus-confirm"
    >
      <span
        >是否确认将这个客户组{{ operaType[blockForm.operaType] }}黑名单？</span
      >
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirm" :loading="loading"
          >确认</el-button
        >
        <el-button @click="dialogConfirmVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// import { saveCustGroupBlk } from '@/api/custmgr/cust-group';
import API from '@/api'
export default {
  props: {
    dialogBlockVisible: {
      type: Boolean
    },
    groupName: {
      type: String
    },
    groupNo: {
      type: String
    }
  },
  watch: {
    dialogBlockVisible (value) {
      // 初始化数据
      if (value) {
        // 初始化表单并移除所有表单项的校验
        this.$nextTick(() => {
          this.$refs['blockForm'].resetFields()
        })
      }
    }
  },
  data () {
    return {
      dialogConfirmVisible: false,
      loading: false,
      applyTime: this.getDate(),
      blockForm: {
        scoreChannel: this.$store.state.user.channel, // 1,财富渠道、2,直销渠道、3,信用卡渠道
        applyEmpNo: this.$store.state.user.id,
        applyPerson: this.$store.state.user.name,
        operaType: '', // 1移入2移出
        operaRea: ''
      },
      operaType: ['', '移入', '移出'],
      rules: {
        operaType: [
          { required: true, message: '请选择操作类型', trigger: 'change' }
        ],
        operaRea: [
          { required: true, message: '请输入调整说明', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  methods: {
    // 获取当天时间
    getDate () {
      let date = new Date()
      date.setTime(date.getTime())
      return (
        date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate()
      )
    },
    // 保存客户组积分调整信息
    saveGroup () {
      this.$refs['blockForm'].validate(valid => {
        if (!valid) {
          return false
        }
        this.dialogConfirmVisible = true
      })
    },
    // 确认提交
    confirm () {
      this.loading = true
      API.custgroup
        .saveCustGroupBlk(
          Object.assign(this.blockForm, {
            groupNo: this.groupNo,
            groupName: this.groupName
          })
        )
        .then(data => {
          this.loading = false
          this.dialogConfirmVisible = false
          this.$message.success('操作成功！')
          this.cancel()
        })
        .catch((error) => {
          this.loading = false
          this.$message.error(error.msg)
        })
    },
    cancel () {
      this.$emit('cancel', { type: 'block' })
    }
  },
  created () {}
}
</script>
<style lang="scss" scoped>
.block-group {
  /deep/ .el-form-item {
    margin-bottom: 16px;
  }
}
</style>
