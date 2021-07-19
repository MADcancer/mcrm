<template>
  <div class="edit-dbs">
    <el-dialog
      :title="setTitle"
      :visible.sync="dialogEditVisible"
      width="750px"
      :before-close="cancel"
    >
      <div style="width: 100%">
        <el-form
          :model="editForm"
          :rules="rules"
          ref="editForm"
          label-position="right"
        >
          <el-form-item
            label="起始日："
            label-width="120px"
            prop="startDate"
            :key="editForm.startDate"
            class="sp-formItem"
          >
            <el-date-picker
              v-model="editForm.startDate"
              type="date"
              value-format="yyyy/MM/dd"
              format="yyyy/MM/dd"
              placeholder="请选择起始日"
              :editable="false"
              :picker-options="pickerOptions"
              :disabled="type==='info'"
              >
            </el-date-picker>
          </el-form-item>
          <el-form-item class="sp-formItem" label="截止日：" label-width="120px" prop="endDate" :key="editForm.endDate">
            <el-date-picker
              v-model="editForm.endDate"
              type="date"
              value-format="yyyy/MM/dd"
              format="yyyy/MM/dd"
              placeholder="请选择截止日"
              :editable="false"
              :picker-options="pickerOptions"
              :disabled="type==='info'"
              >
            </el-date-picker>
          </el-form-item>
          <el-form-item class="sp-formItem" label="达标条件代码：" label-width="120px" prop="standardId">
            <el-input
              maxlength="8"
              v-model="editForm.standardId"
              :disabled="type === 'info'"
            ></el-input>
          </el-form-item>
          <el-form-item class="sp-formItem" label="频次：" label-width="120px" prop="rate">
            <el-select :disabled="type==='info'" v-model="editForm.rate" placeholder="">
              <el-option label="请选择" value=""></el-option>
              <el-option v-for="(item,index) in rates" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
          </el-form-item>
          <el-form-item class="sp-formItem" label="达标条件：" label-width="120px" prop="condition">
            <el-select :disabled="type==='info'" v-model="editForm.condition" placeholder="">
              <el-option label="请选择" value=""></el-option>
              <el-option v-for="(item,index) in conditions" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="sp-formItem" label="比较：" label-width="120px" prop="logicForm">
            <el-select :disabled="type==='info'" v-model="editForm.logicForm" placeholder="">
              <el-option label="请选择" value=""></el-option>
              <el-option v-for="(item,index) in logicForms" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
          </el-form-item>
          <el-form-item class="sp-formItem" label="最大达标次数：" label-width="120px" prop="standardFreq">
            <el-input
              maxlength="8"
              v-model="editForm.standardFreq"
              :disabled="type === 'info'"
            ></el-input>
          </el-form-item>
          <el-form-item label="理财产品：" label-width="120px" prop="prodId">
            <el-select :disabled="type==='info'" multiple size="mini" v-model="editForm.prodId" placeholder="">
              <el-option v-for="(item,index) in $root.selectOption.dbsFinacProdCode" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
          </el-form-item>
          <el-form-item class="sp-formItem" label="笔数：" label-width="120px" prop="value1">
            <el-input
              maxlength="8"
              v-model="editForm.value1"
              :disabled="type === 'info'"
            ></el-input>
          </el-form-item>
          <el-form-item class="sp-formItem" label="达标金额(元)：" label-width="120px" prop="value2">
            <el-input
              maxlength="8"
              v-model="editForm.value2"
              :disabled="type === 'info'"
            ></el-input>
          </el-form-item>
          <el-form-item class="sp-formItem" label="获得积分：" label-width="120px" prop="rewardPoint">
            <el-input
              maxlength="8"
              v-model="editForm.rewardPoint"
              :disabled="type === 'info'"
            ></el-input>
          </el-form-item>
          <el-form-item label="创建时间：" label-width="120px" v-if="type === 'info'">
            <el-input
              maxlength="8"
              v-model="editForm.createTime"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="创建人工号：" label-width="120px" v-if="type === 'info'">
            <el-input
              maxlength="8"
              v-model="editForm.createEmpNo"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="创建人：" label-width="120px" v-if="type === 'info'">
            <el-input
              maxlength="8"
              v-model="editForm.createEmpName"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="修改时间：" label-width="120px" v-if="type === 'info'">
            <el-input
              maxlength="8"
              v-model="editForm.modifyTime"
              disabled
            ></el-input>
          </el-form-item>
           <el-form-item label="修改人工号：" label-width="120px" v-if="type === 'info'">
            <el-input
              maxlength="8"
              v-model="editForm.modifyEmpNo"
              disabled
            ></el-input>
          </el-form-item>
           <el-form-item label="修改人：" label-width="120px" v-if="type === 'info'">
            <el-input
              maxlength="8"
              v-model="editForm.modifyEmpName"
              disabled
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="footer-tips">注：笔数不输入即为不限笔数</div>
      <div slot="footer" class="dialog-footer" v-if="type !== 'info'">
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
            startDate: '',
            endDate: '',
            condition: '',
            rate: '',
            logicForm: '',
            value1: '',
            value2: '',
            prodId: [],
            rewardPoint: '',
            standardId: '',
            standardFreq: ''
          }
        } else {
          API.dbsfinr.getDbsFinancialRuleById(this.id).then(res => {
            this.editForm = res.data.data
            this.editForm.prodId = this.editForm.prodId.split(',')
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
    // 校验日期
    var checkDate = (rule, value, callback) => {
      if (this.editForm.startDate &&
          this.editForm.endDate &&
          this.editForm.startDate > this.editForm.endDate) {
        return callback(new Error('起始日期不能大于截止日期'))
      }
      return callback()
    }
    // 校验整数值
    var checkInt = (rule, value, callback) => {
      if (value && !/^[1-9][0-9]*$/.test(value)) {
        return callback(new Error('请输入正整数'))
      }
      return callback()
    }
    // 校验数字及字母
    var checkstandardId = (rule, value, callback) => {
      if (value && !/^[A-Za-z0-9]+$/.test(value)) {
        return callback(new Error('请输入英文或数字'))
      }
      return callback()
    }

    return {
      dialogConfirmVisible: false,
      loading: false,
      editForm: {
        startDate: '',
        endDate: '',
        condition: '',
        rate: '',
        logicForm: '',
        value1: '',
        value2: '',
        rewardPoint: '',
        standardId: '',
        prodId: [],
        standardFreq: ''
      },
      equityChannel: ['', '财富', '直销', '信用卡'],
      rates: [
        {
          value: '1',
          label: '日'
        },
        {
          value: '2',
          label: '周'
        },
        {
          value: '3',
          label: '月'
        },
        {
          value: '4',
          label: '季'
        },
        {
          value: '5',
          label: '年'
        }
      ],
      logicForms: [
        {
          value: '1',
          label: '大于'
        },
        {
          value: '2',
          label: '小于'
        },
        {
          value: '3',
          label: '大于等于'
        },
        {
          value: '4',
          label: '小于等于'
        },
        {
          value: '5',
          label: '等于'
        }
      ],
      conditions: [
        {
          value: '1',
          label: '定期理财'
        },
        {
          value: '2',
          label: '活期理财'
        }
      ],
      pickerOptions: {
        disabledDate(time) {
          let date = new Date()
          date.setDate(date.getDate() - 1)
          return time.getTime() < date.getTime()
        }
      },
      rules: {
        startDate: [
          { required: true, message: '请选择起始日期', trigger: 'change' },
          { validator: checkDate, trigger: 'change' }
        ],
        endDate: [
          { required: true, message: '请选择截止日期', trigger: 'change' },
          { validator: checkDate, trigger: 'change' }
        ],
        standardId: [
          { required: true, message: '请输入达标条件代码', trigger: 'change' },
          { validator: checkstandardId, trigger: 'change' }
        ],
        condition: [
          { required: true, message: '请选择权益条件', trigger: 'change' }
        ],
        rate: [
          { required: true, message: '请选择频次', trigger: 'change' }
        ],
        logicForm: [
          { required: true, message: '请选择条件', trigger: 'change' }
        ],
        // scoreChannel: [
        //   { required: true, message: '请选择积分渠道', trigger: 'change' }
        // ],
        prodId: [
          { required: true, message: '请选择理财产品', trigger: 'change' }
        ],
        value1: [
          // { required: true, message: '请输入阈值', trigger: 'change' },
          { validator: checkInt, trigger: 'blur' }
        ],
        value2: [
          { required: true, message: '请输入达标金额(元)', trigger: 'change' },
          { validator: checkInt, trigger: 'blur' }
        ],
        rewardPoint: [
          { required: true, message: '请输入获得积分', trigger: 'change' },
          { validator: checkInt, trigger: 'blur' }
        ],
        standardFreq: [
          { required: true, message: '请输入获得最大达标次数', trigger: 'change' },
          { validator: checkInt, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    setTitle() {
      return this.type === 'create'
      ? '创建理财达标条件' : (this.type === 'info' ? '查看理财达标条件' : '修改理财达标条件')
    }
  },
  methods: {
    // 保存客户组理财调整信息
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
      this.editForm = this.paramTrim(this.editForm)
      this.loading = true
      console.log(this.editForm)
      API.dbsfinr
        .editDbsFinancialRule(
          Object.assign(this.editForm, {
            scoreChannel: this.$store.state.user.channel,
            createEmpName:
              this.type === 'create' ? this.$store.state.user.name : '',
            createEmpNo:
              this.type === 'create' ? this.$store.state.user.id : '',
            modifyEmpName:
              this.type === 'create' ? '' : this.$store.state.user.name,
            modifyEmpNo: this.type === 'create' ? '' : this.$store.state.user.id
          })
        )
        .then(data => {
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
  created() {
  }
}
</script>
<style lang="scss" scoped>
.edit-dbs {
  /deep/ .el-form-item {
    margin-bottom: 16px;
  }

  /deep/ .el-form {
    display: flex;
    flex-wrap: wrap;
    > div {
      width: 50%;
    }
    .el-form-item__content, .el-date-editor.el-input, .el-date-editor.el-input__inner, .el-input__inner {
      width: 200px;
    }
    .sp-formItem .el-input__inner {
      height: 28px !important;
      // line-height: 26px;
    }
  }
  
  /deep/ .footer-tips {
    color: red;
    padding-bottom: 5px;
  }
}
</style>
