<template>
  <div class="adjust-group">
    <el-dialog
      title="客户组积分调整"
      :visible.sync="dialogAdjustVisible"
      width="600px"
      :before-close="cancel"
    >
      <el-form
        :model="adjustForm"
        :rules="rules"
        ref="adjustForm"
        label-position="left"
      >
        <el-form-item label="客户组名称：" label-width="100px">
          <el-input v-model="groupName" disabled></el-input>
        </el-form-item>
        <el-form-item label="积分渠道：" label-width="100px">
          <el-input
            v-model="$root.selectOption.channelObj[adjustForm.scoreChannel]"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="申请人工号：" label-width="100px">
          <el-input v-model="adjustForm.applyEmpNo" disabled></el-input>
        </el-form-item>
        <el-form-item label="申请人：" label-width="100px">
          <el-input v-model="adjustForm.applyPerson" disabled></el-input>
        </el-form-item>
        <el-form-item label="申请时间：" label-width="100px">
          <el-input v-model="applyTime" disabled></el-input>
        </el-form-item>
        <el-form-item label="调整方向：" label-width="100px" prop="adjType">
          <el-select v-model="adjustForm.adjType">
            <el-option label="请选择" value=""></el-option>
            <el-option label="调增" value="1"></el-option>
            <el-option label="调减" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="调整分值：" label-width="100px" prop="adjValue">
          <el-input
            v-model="adjustForm.adjValue"
            maxlength="10"
            @blur="adjustForm.adjValue = adjustForm.adjValue.trim()"
          ></el-input>
        </el-form-item>
        <el-form-item label="调整原因：" label-width="100px" prop="adjRea">
          <el-input
            type="textarea"
            :rows="4"
            maxlength="100"
            v-model="adjustForm.adjRea"
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
      <span>是否确认{{ adjType[adjustForm.adjType] }}这个客户组？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmAjust" :loading="loading"
          >确 认</el-button
        >
        <el-button @click="dialogConfirmVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// import { saveCustGroupAdjust } from '@/api/custmgr/cust-group'
import API from '@/api'
export default {
  props: {
    dialogAdjustVisible: {
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
    dialogAdjustVisible (value) {
      // 初始化数据
      if (value) {
        // 初始化表单并移除所有表单项的校验
        this.$nextTick(() => {
          this.$refs['adjustForm'].resetFields()
        })
      }
    }
  },
  data () {
    // 校验调整分值
    var checkAdjValue = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('请输入调整分值'))
      }
      if (!/^[1-9]{1,}[\d]*$/.test(value)) {
        return callback(new Error('请输入正整数'))
      }
      return callback()
    }
    return {
      dialogConfirmVisible: false,
      loading: false,
      applyTime: this.getDate(),
      adjustForm: {
        scoreChannel: this.$store.state.user.channel, // 1,财富渠道、2,直销渠道、3,信用卡渠道
        applyEmpNo: this.$store.state.user.id,
        applyPerson: this.$store.state.user.name,
        adjType: '', // 1调增、2调减
        adjValue: '',
        adjRea: ''
      },
      adjType: ['', '调增', '调减'],
      rules: {
        adjType: [
          {
            required: true,
            message: '请选择调整方向',
            trigger: 'change'
          }
        ],
        adjValue: [
          { required: true, validator: checkAdjValue, trigger: 'blur' }
        ],
        adjRea: [{ required: true, message: '请输入调整说明', trigger: 'blur' }]
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
      this.$refs['adjustForm'].validate(valid => {
        if (!valid) {
          return false
        }
        this.dialogConfirmVisible = true
      })
    },
    // 确认提交
    confirmAjust () {
      this.loading = true
      API.custgroup.saveCustGroupAdjust(
        Object.assign(this.adjustForm, {
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
      this.$emit('cancel', { type: 'adjust' })
    }
  },
  created () {}
}
</script>
<style lang="scss" scoped>
.adjust-group {
  /deep/ .el-form-item {
    margin-bottom: 16px;
  }
}
</style>
