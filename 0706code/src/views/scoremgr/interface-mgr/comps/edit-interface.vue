<template>
  <div class="edit-interface">
    <el-dialog
      :title="type === 'create' ? '创建接口' : '修改接口'"
      :visible.sync="dialogEditVisible"
      width="600px"
      :before-close="cancel"
    >
      <el-form
        :model="editForm"
        :rules="rules"
        ref="editForm"
        label-position="left"
      >
        <el-form-item
          label="权益渠道："
          label-width="100px"
          prop="equityChannel"
        >
          <el-input v-model="$root.selectOption.channelObj[editForm.equityChannel]" disabled></el-input>
        </el-form-item>
        <el-form-item label="对接系统：" label-width="100px" prop="conSys">
          <el-select v-model="editForm.conSys" placeholder="" :disabled="type==='update'">
            <el-option label="请选择" value=""></el-option>
            <el-option v-for="(item,index) in $root.selectOption.conSys" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="调整方向：" label-width="100px">
          <el-select v-model="editForm.adjType">
            <el-option label="请选择" value=""></el-option>
            <el-option label="调增" value="1"></el-option>
            <el-option label="调减" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="调整分值：" label-width="100px" prop="adjScore">
          <el-input maxlength="12" v-model="editForm.adjScore"></el-input>
        </el-form-item>
        <el-form-item label="交易码：" label-width="100px" prop="transCode">
          <el-input maxlength="10" v-model="editForm.transCode" :disabled="type === 'update'"></el-input>
        </el-form-item>
        <el-form-item label="交易描述：" label-width="100px" prop="notes">
          <el-input
            type="textarea"
            :rows="4"
            maxlength="100"
            v-model="editForm.notes"
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
          this.editForm = {
            equityChannel: this.$store.state.user.channel, // 1,财富渠道、2,直销渠道、3,信用卡渠道
            conSys: '',
            adjType: '', // 1调增、2调减
            adjScore: '',
            adjRea: ''
          }
        } else {
          API.interfacemgr.getInterfaceById(this.id).then((res) => {
            this.editForm = res.data.data
          })
        }
        // 初始化表单并移除所有表单项的校验
        this.$nextTick(() => {
          this.$refs['editForm'].resetFields()
        })
      }
    }
  },
  data() {
    // 校验调整分值
    var checkadjScore = (rule, value, callback) => {
      if (value && !/^[+]{0,1}(\d+)$/.test(value)) {
        return callback(new Error('请输入非负的整数'))
      }
      return callback()
    }
    // 校验码
    var checkTransCode = (rule, value, callback) => {
      if (!/^[0-9a-zA-Z]*$/g.test(value)) {
        return callback(new Error('只能输入数字或者字母'))
      }
      return callback()
    }

    return {
      dialogConfirmVisible: false,
      loading: false,
      editForm: {
        equityChannel: this.$store.state.user.channel, // 1,财富渠道、2,直销渠道、3,信用卡渠道
        conSys: '',
        adjType: '', // 1调增、2调减
        adjScore: '',
        adjRea: ''
      },
      equityChannel: ['', '财富', '直销', '信用卡'],
      adjType: ['', '调整', '调减'],
      rules: {
        equityChannel: [
          { required: true, message: '请选择权益渠道', trigger: 'change' }
        ],
        conSys: [
          { required: true, message: '请选择对接系统', trigger: 'change' }
        ],
        adjType: [
          { required: true, message: '请选择调整方向', trigger: 'change' }
        ],
        adjScore: [
          { validator: checkadjScore, trigger: 'blur' }
        ],
        transCode: [
          { required: true, message: '请输入交易码', trigger: 'blur' },
          { validator: checkTransCode, trigger: 'blur' }
        ],
        notes: [
          { required: true, message: '请输入交易描述', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  methods: {
    // 保存客户组积分调整信息
    saveGroup() {
      this.$refs['editForm'].validate(valid => {
        if (!valid) {
          return false
        }
        this.dialogConfirmVisible = true
      })
    },
    // 确认提交
    confirmSubmit() {
      this.loading = true
      API.interfacemgr.editInterface(
        Object.assign(this.editForm, {
          createEmpName: this.type === 'create' ? this.$store.state.user.name : '',
          createEmpNo: this.type === 'create' ? this.$store.state.user.id : '',
          modifyEmpName: this.type === 'create' ? '' : this.$store.state.user.name,
          modifyEmpNo: this.type === 'create' ? '' : this.$store.state.user.id
          // adjScore: this.editForm.adjScore && this.editForm.adjScore.toString().trim()
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
    cancel() {
      this.$emit('cancel', { type: this.type })
    }
  },
  created() {
  }
}
</script>
<style lang="scss" scoped>
.edit-interface {
  /deep/ .el-form-item {
    margin-bottom: 16px;
  }
}
</style>
