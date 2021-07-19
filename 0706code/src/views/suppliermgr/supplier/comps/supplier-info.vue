<template>
  <div class="supplier-info">
    <el-dialog
      title="供应商详情"
      :visible.sync="dialogInfoVisible"
      width="1000px"
      :before-close="cancel"
    >
      <el-form :model="editForm" ref="editForm" v-if="step === 1" v-loading="waitLoading">
        <el-steps :space="100" :active="step" align-center style="width:100%">
          <el-step
            title="基本信息"
            @click.native="clickStep(1)"
            class="step"
          ></el-step>
          <el-step
            title="预算配置"
            @click.native="clickStep(2)"
            class="step unfinish"
          ></el-step>
        </el-steps>
        <div class="inline-form">
          <el-form-item label="供应商名称：" label-width="110px">
            <el-input v-model="editForm.suppName" disabled></el-input>
          </el-form-item>
          <el-form-item label="供应商渠道：" label-width="110px">
            <el-input v-model="$root.selectOption.channelObj[editForm.suppChannel]" disabled></el-input>
          </el-form-item>
        </div>
        <div class="inline-form">
          <el-form-item label="供应商联系人：" label-width="110px">
            <el-input v-model="editForm.suppLinkman" disabled></el-input>
          </el-form-item>
          <el-form-item label="供应商电话：" label-width="110px">
            <el-input v-model="editForm.suppTel" disabled></el-input>
          </el-form-item>
        </div>
        <div class="inline-form">
          <el-form-item label="供应商邮箱：" label-width="110px">
            <el-input v-model="editForm.suppEmail" disabled></el-input>
          </el-form-item>
          <el-form-item label="清算行：" label-width="110px">
            <el-input v-model="editForm.cleBank" disabled></el-input>
          </el-form-item>
        </div>
        <div class="inline-form">
          <el-form-item label="清算账户名：" label-width="110px">
            <el-input v-model="editForm.cleAccountName" disabled></el-input>
          </el-form-item>
          <el-form-item label="清算账户：" label-width="110px">
            <el-input v-model="editForm.cleAccount" disabled></el-input>
          </el-form-item>
        </div>
     
        <!-- <el-form-item label="清算行：" label-width="110px">
          <el-input v-model="editForm.cleBank" disabled></el-input>
        </el-form-item> -->
         <el-form-item label="供应商地址：" label-width="110px">
          <el-input v-model="editForm.suppAddr" disabled></el-input>
        </el-form-item>
        <el-form-item label="备注：" label-width="110px">
          <el-input
            type="textarea"
            :rows="4"
            v-model="editForm.notes"
            disabled
          ></el-input>
        </el-form-item>
      </el-form>
      <div v-else style="width: 100%" v-loading="waitLoading">
        <el-steps :space="100" :active="step" align-center style="width:100%">
          <el-step
            title="基本信息"
            @click.native="clickStep(1)"
            class="step unfinish"
          ></el-step>
          <el-step
            title="预算配置"
            @click.native="clickStep(2)"
            class="step"
          ></el-step>
        </el-steps>
        <div class="inline-budget" v-for="(budget, index) in budgets" :key="index">
          <div>
            预算年份(年)：<el-input v-model="budget.budgetYears" disabled></el-input>
          </div>
          <div>
            年度预算(元)：<el-input v-model="budget.budget" disabled></el-input>
          </div>
          <div>
            实际费用(元)：<el-input v-model="budget.charge" disabled></el-input>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import API from '@/api'
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
        // 获取历史预算
        this.qryCostBudgets()
        this.step = 1
      }
    }
  },
  data() {
    return {
      waitLoading: false,
      editForm: {
        suppName: '',
        suppChannel: '',
        suppLinkman: '',
        suppTel: '',
        suppEmail: '',
        cleAccount: '',
        suppAddr: '',
        notes: ''
      },
      budgets: [],
      step: 1
    }
  },
  methods: {
    clickStep(val) {
      // if (val === 2) { this.qryCostBudgets() }
      this.step = val
    },
    // 获取历史预算
    qryCostBudgets() {
      API.supplier.qryCostBudgets(this.info.suppId).then(res => {
        this.budgets = res.data.data
        this.waitLoading = false
      }).catch(() => {
        this.waitLoading = false
      })
    },
    cancel() {
      this.$emit('cancel', {type: 'info'})
    }
  }
}
</script>
<style lang="scss" scoped>
.supplier-info {
  /deep/ .el-step {
    width: 20%;
    max-width: unset !important;
  }
  .step:hover {
    cursor: pointer;
  }
  .unfinish {
    /deep/ .is-finish {
      color: #606266;
      border-color: #606266;
    }
  }
  .inline-form {
    display: flex;
    /deep/ .el-input {
      width: 240px;
    }
  }
  .inline-budget {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-bottom: 10px;
    /deep/ .el-input {
      width: 220px;
    }
  }
}
</style>
