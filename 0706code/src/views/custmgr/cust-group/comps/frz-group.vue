<template>
  <div class="frz-group">
    <el-dialog
      title="客户组冻结/解冻"
      :visible.sync="dialogFrzVisible"
      width="600px"
      :before-close="cancel"
    >
      <el-form
        :model="frzForm"
        :rules="rules"
        ref="frzForm"
        label-position="left"
      >
        <el-form-item label="客户组名称：" label-width="100px">
          <el-input v-model="groupName" disabled></el-input>
        </el-form-item>
        <el-form-item label="积分渠道：" label-width="100px">
          <el-input
            v-model="$root.selectOption.channelObj[frzForm.scoreChannel]"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="申请人工号：" label-width="100px">
          <el-input v-model="frzForm.applyEmpNo" disabled></el-input>
        </el-form-item>
        <el-form-item label="申请人：" label-width="100px">
          <el-input v-model="frzForm.applyPerson" disabled></el-input>
        </el-form-item>
        <el-form-item label="申请时间：" label-width="100px">
          <el-input v-model="applyTime" disabled></el-input>
        </el-form-item>
        <el-form-item label="操作类型：" label-width="100px" prop="operaType">
          <el-select v-model="frzForm.operaType">
            <el-option label="请选择" value=""></el-option>
            <el-option label="冻结" value="1"></el-option>
            <el-option label="解冻" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="frzForm.operaType === '2'? '解冻类别': '冻结类别：'" label-width="100px" prop="frzType">
          <el-checkbox-group
            v-model="frzForm.frzType"
            @change="handleCheckedChange"
            style="width: 360px"
          >
            <el-checkbox
              v-for="(type, index) in types"
              :label="index + 1"
              :key="type"
              >{{ type }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="操作原因：" label-width="100px" prop="operaRea">
          <el-input
            type="textarea"
            :rows="4"
            maxlength="100"
            v-model="frzForm.operaRea"
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
      <span>是否确认{{ operaTypes[frzForm.operaType] }}这个客户组？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmFrz" :loading="loading"
          >确 认</el-button
        >
        <el-button @click="dialogConfirmVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// import { saveCustGroupFrz } from '@/api/custmgr/cust-group'
import API from '@/api'
export default {
  props: {
    dialogFrzVisible: {
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
    dialogFrzVisible (value) {
      if (value) {
        // 初始化表单并移除所有表单项的校验
        this.$nextTick(() => {
          this.$refs['frzForm'].resetFields()
        })
      }
    }
  },
  data () {
    // 校验操作类型
    // var checkType = (rule, value, callback) => {
    //   if (value === '0') {
    //     return callback(new Error('请选择操作类型'))
    //   }
    //   return callback()
    // }
    // 校验冻结类别
    var checkFrzType = (rule, value, callback) => {
      if (value.length === 0) {
        return callback(new Error('请至少选择一个冻结类别'))
      }
      return callback()
    }
    return {
      dialogConfirmVisible: false,
      applyTime: this.getDate(),
      frzForm: {
        scoreChannel: this.$store.state.user.channel, // 1,财富渠道、2,直销渠道、3,信用卡渠道
        applyEmpNo: this.$store.state.user.id,
        applyPerson: this.$store.state.user.name,
        operaType: '', // 1冻结2解冻
        frzType: [], // 1金融资产、2新客奖励、3基金定投、4绑定快捷支付、5代发工资、6代收业务
        operaRea: ''
      },
      types: [
        '金融资产',
        '新客奖励',
        '基金定投',
        '绑定快捷支付',
        '代发工资',
        '代收业务'
      ],
      operaTypes: ['', '冻结', '解冻'],
      loading: false,
      rules: {
        operaType: [
          { required: true, message: '请选择操作类型', trigger: 'change' }
        ],
        frzType: [
          { validator: checkFrzType, required: true, trigger: 'change' }
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
    // 选择冻结类型
    handleCheckedChange () {
      // console.log(this.frzForm.frzType)
      // this.frzForm.frzType = this.frzTypes.join(',')
    },
    // 保存客户组积分冻结信息
    saveGroup () {
      this.$refs['frzForm'].validate(valid => {
        if (!valid) {
          return false
        }
        this.dialogConfirmVisible = true
      })
    },
    // 确认提交
    confirmFrz () {
      this.loading = true
      API.custgroup.saveCustGroupFrz(
        Object.assign(this.frzForm, {
          frzType: this.frzForm.frzType.join(','),
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
          let frzTypeL = this.frzForm.frzType.split(',')
          this.frzForm.frzType = frzTypeL.map(function(el) { return parseInt(el) })
          this.loading = false
          this.$message.error(error.msg)
        })
    },
    cancel () {
      this.$emit('cancel', { type: 'frz' })
    }
  }
}
</script>
<style lang="scss" scoped>
.frz-group {
  /deep/ .el-select,
  /deep/ .el-input,
  /deep/ .el-textarea {
    width: 260px;
  }
  /deep/ .el-checkbox {
    width: 110px;
    margin-right: 10px;
    margin-left: 0;
  }
}
</style>
