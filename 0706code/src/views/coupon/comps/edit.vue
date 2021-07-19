<template>
  <div class="edit-coupon">
    <el-dialog
      :title="setTitle"
      :visible.sync="dialogEditVisible"
      width="800px"
      :before-close="cancel"
    >
      <div style="width: 100%" v-loading="vLoading">
        <el-form
          :model="editForm"
          :rules="rules"
          ref="editForm"
          label-position="right"
        >
          <el-form-item label="优惠券名称：" label-width="140px" prop="yhmName">
            <el-input
              maxlength="64"
              v-model="editForm.yhmName"
              :disabled="type === 'info'"
            ></el-input>
          </el-form-item>
          <el-form-item label="优惠券类型：" label-width="140px" prop="yhmTypeName">
            <el-input v-model="editForm.yhmTypeName" autocomplete="off" disabled
              ><img
                src="~@/assets/img/search-logo.png"
                slot="suffix"
                style="width:15px; height:18px; margin-bottom:2px"
                v-if="type === 'create'"
                @click="searchCouponType"
            /></el-input>
          </el-form-item>
          <el-form-item
            label="有效开始时间："
            label-width="140px"
            prop="beginTime"
          >
            <el-date-picker
              v-model="editForm.beginTime"
              type="date"
              value-format="yyyy/MM/dd"
              format="yyyy/MM/dd"
              placeholder="请有效开始时间"
              :editable="false"
              :disabled="type === 'info'"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item
            label="有效期失效时间："
            label-width="140px"
            prop="endTime"
          >
            <el-date-picker
              v-model="editForm.endTime"
              type="date"
              value-format="yyyy/MM/dd"
              format="yyyy/MM/dd"
              placeholder="请选择有效期失效时间"
              :editable="false"
              :disabled="type === 'info'"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="面额：" label-width="140px" prop="amount">
            <el-input
              maxlength="8"
              v-model="editForm.amount"
              :disabled="type === 'info'"
            ></el-input>
          </el-form-item>
          <el-form-item label="产品id：" label-width="140px" prop="productId">
            <el-input
              maxlength="8"
              v-model="editForm.productId"
              :disabled="type === 'info'"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="购买产品上限："
            label-width="140px"
            prop="limMax"
          >
            <el-input
              maxlength="8"
              v-model="editForm.limMax"
              :disabled="type === 'info'"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="购买产品下限："
            label-width="140px"
            prop="limMin"
          >
            <el-input
              maxlength="8"
              v-model="editForm.limMin"
              :disabled="type === 'info'"
            ></el-input>
          </el-form-item>
          <el-form-item label="使用说明：" label-width="140px" prop="useDesc" class="textarea">
            <el-input
              type="textarea"
              :rows="5"
              v-model="editForm.useDesc"
              :disabled="type === 'info'"
            ></el-input>
          </el-form-item>
          <el-form-item label="备注：" label-width="140px" prop="remark" class="textarea">
            <el-input
              type="textarea"
              :rows="5"
              v-model="editForm.remark"
              :disabled="type === 'info'"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>

      <div slot="footer" class="dialog-footer" v-if="type !== 'info'">
        <el-button type="primary" @click="saveCoupon">提交</el-button>
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
    <coupon-type :dialogCouponVisible='dialogCouponVisible' @cancel="selectType"></coupon-type>
  </div>
</template>
<script>
import API from '@/api'
import couponType from './coupontype'
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
  components: {
    couponType
  },
  watch: {
    dialogEditVisible(value) {
      if (value) {
        // 初始化数据
        if (this.type === 'create') {
          this.editForm = {
            yhmName: '',
            yhmTypeId: '',
            yhmTypeName: '',
            beginTime: '',
            endTime: '',
            amount: '',
            productId: '',
            limMax: '',
            limMin: '',
            useDesc: '',
            status: '0',
            remark: ''
          }
        } else {
          this.vLoading = true
          API.coupon.getYhmInfoById(this.id).then(res => {
            this.vLoading = false
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
    // 校验日期
    var checkDate = (rule, value, callback) => {
      if (
        this.editForm.beginTime &&
        this.editForm.endTime &&
        this.editForm.beginTime > this.editForm.endTime
      ) {
        return callback(new Error('起始日期不能大于截止日期'))
      }
      return callback()
    }
    // 校验整数值
    var checkInt = (rule, value, callback) => {
      if (value && !/^[0-9]{1,}[\d]*$/.test(value)) {
        return callback(new Error('请输入正整数'))
      }
      return callback()
    }

    // 下限不能大于上限
    var checkLimt = (rule, value, callback) => {
      if (
        this.editForm.limMax &&
        this.editForm.limMin &&
        Number(this.editForm.limMin) > Number(this.editForm.limMax)
      ) {
        return callback(new Error('产品下限不能大于上限'))
      }
      return callback()
    }

    return {
      dialogConfirmVisible: false,
      loading: false,
      editForm: {
        yhmName: '',
        yhmTypeId: '',
        yhmTypeName: '',
        beginTime: '',
        endTime: '',
        amount: '',
        productId: '',
        limMax: '',
        limMin: '',
        useDesc: '',
        status: '0',
        remark: ''
      },
      dialogCouponVisible: false,
      vLoading: false,
      rules: {
        yhmName: [
          { required: true, message: '请输入优惠券名称', trigger: 'blur' }
        ],
        yhmTypeName: [
          { required: true, message: '请选择优惠券类型', trigger: 'change' }
        ],
        beginTime: [
          { required: true, message: '请选择有效期开始时间', trigger: 'change' },
          { validator: checkDate, trigger: 'change' }
        ],
        endTime: [
          { required: true, message: '请选择有效期失效时间', trigger: 'change' },
          { validator: checkDate, trigger: 'change' }
        ],
        amount: [
          { required: true, message: '请输入面额', trigger: 'blur' },
          { validator: checkInt, trigger: 'blur' }
        ],
        productId: [{ required: true, message: '请输入商品id', trigger: 'blur' }],
        limMax: [
          { required: true, message: '请输入购买产品上限', trigger: 'blur' },
          { validator: checkInt, trigger: 'blur' },
          { validator: checkLimt, trigger: 'blur' }
        ],
        limMin: [
          { required: true, message: '请输入购买产品下限', trigger: 'blur' },
          { validator: checkInt, trigger: 'blur' },
          { validator: checkLimt, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    setTitle() {
      return this.type === 'create'
      ? '创建优惠券' : (this.type === 'info' ? '查看优惠券' : '修改优惠券')
    }
  },
  methods: {
    searchCouponType() {
      this.dialogCouponVisible = true
    },
    selectType(val) {
      if (val.info.yhmTypeId) {
        this.editForm.yhmTypeName = val.info.yhmTypeName
        this.editForm.yhmTypeId = val.info.yhmTypeId
      }
      this.dialogCouponVisible = false
    },
    // 保存客户组积分调整信息
    saveCoupon() {
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
      API.coupon
        .editYhmInfo(
          Object.assign(this.editForm, {
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
  created() {}
}
</script>
<style lang="scss" scoped>
.edit-coupon {
  /deep/ .el-form-item {
    margin-bottom: 16px;
  }

  /deep/ .el-form {
    display: flex;
    flex-wrap: wrap;
    > div {
      width: 50%;
    }
    .textarea {
      width: 100%;
    }
    /deep/ .el-textarea {
      width: 580px;
    }
    .el-form-item__content,
    .el-date-editor.el-input,
    .el-date-editor.el-input__inner,
    .el-input__inner {
      width: 200px;
    }
    .el-input__inner {
      height: 26px !important;
      line-height: 26px;
    }
  }
}
</style>
