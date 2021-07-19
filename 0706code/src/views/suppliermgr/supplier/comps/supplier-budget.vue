<template>
  <div class="supplier-budget">
    <el-dialog
      title="预算配置"
      :visible.sync="dialogBudgetVisible"
      width="1000px"
      :before-close="cancel"
    >
      <div style="width: 100%" v-loading="waitLoading">
        <div style="margin-bottom: 66px">
          <div class="sub-title">
            <div class="space"></div>
            <span>供应商基本信息：</span>
          </div>
          <el-table
            :data="infoDatas"
            border
            style="width: 100%"
            :header-cell-style="{
              background: '#80A639',
              'font-weight': '400',
              color: '#ffffff'
            }"
          >
            <el-table-column
              label="供应商名称"
              width="120"
              prop="suppName"
              header-align="center"
              align="center"
              class="table-botton"
            >
            </el-table-column>
            <el-table-column
              label="供应商渠道"
              width="120"
              header-align="center"
              align="center"
            >
              <template slot-scope="scope">
                {{ $root.selectOption.channelObj[scope.row.suppChannel] }}
              </template>
            </el-table-column>
            <el-table-column
              prop="cleBank"
              label="清算行"
              header-align="center"
              align="center"
            >
            </el-table-column>
             <el-table-column
              prop="cleAccountName"
              label="清算账户名"
              width="120"
              header-align="center"
              align="center"
            >
            </el-table-column>
             <el-table-column
              prop="cleAccount"
              label="清算账户"
              header-align="center"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="suppLinkman"
              label="供应商联系人"
              width="120"
              header-align="center"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="suppTel"
              label="供应商电话"
              width="120"
              header-align="center"
              align="center"
            >
            </el-table-column>
            <!-- 10.22 -->
            <el-table-column
              prop="suppEmail"
              label="供应商邮箱"
              width="120"
              header-align="center"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="suppAddr"
              label="供应商地址"
              width="160"
              header-align="center"
              align="center"
            >
            </el-table-column>
          </el-table>
          <div style="color: #111111; margin-top: 18px">
            备注：{{ infoDatas && infoDatas[0] && infoDatas[0].notes }}
          </div>
        </div>
        <div style="margin-bottom: 66px">
          <div class="sub-title">
            <div class="space"></div>
            <span>历史预算：</span>
          </div>
          <div v-if="hisBudgets.length === 0" style="text-align: center">暂无数据</div>
          <div
            class="inline-form"
            v-for="(hisBudget, idx) in hisBudgets"
            :key="idx"
            v-else
          >
            <div>
              <span>预算年份(年)：</span>
              <el-input v-model="hisBudget.budgetYears" disabled></el-input>
            </div>
            <div>
              <span>历史预算(元)：</span>
              <el-input v-model="hisBudget.budget" disabled></el-input>
            </div>
            <div>
              <span>实际费用(元)：</span>
              <el-input v-model="hisBudget.charge" disabled></el-input>
            </div>
          </div>
        </div>
        <div class="budget">
          <div class="sub-title">
            <div class="space"></div>
            <span>配置预算：</span>
          </div>
           <el-form
              :model="budgets"
              class="demo-form-inline"
              ref="budget"
              :inline="true"
              style="text-align: center"
            >
              <div v-for="(budget, index) in budgets.budgetList" :key="index" style="; position: relative">
                <el-form-item
                  label="预算年份(年)："
                  label-width="140px"
                  :prop="`budgetList.${index}.budgetYears`"
                  :rules="[
                    { required: true, message: '请输入预算年份', trigger: 'change' },
                    { validator: checkYear, trigger: 'change' }
                  ]"
                >
                  <el-input
                    v-model="budget.budgetYears"
                    disabled
                    v-if="index === 0"
                  ></el-input>
                  <el-date-picker
                    v-model="budget.budgetYears"
                    type="year"
                    :picker-options="pickerOptions"
                    placeholder="选择年"
                    value-format="yyyy"
                    :editable="false"
                    v-else
                  ></el-date-picker>
                </el-form-item>
                <el-form-item
                  label="年度预算(元)："
                  label-width="140px"
                  :prop="`budgetList.${index}.budget`"
                  :rules="[
                    { required: true, message: '请输入年度预算', trigger: 'blur' },
                    {validator: checkBudget, trigger: 'blur'}
                  ]"
                >
                  <el-input v-model="budget.budget" @blur="inputBlur(index)"></el-input>
                </el-form-item>
                <img src="~@/assets/img/del.png" class="del" @click="del(index)" v-if="index !== 0" />
              </div>
            </el-form>
          <div class="add-btn" @click="add">
            <img src="~@/assets/img/add-logo.png" />
            <span>添加预算</span>
          </div>
        </div>
      </div>
       <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save"
          >提交</el-button
        >
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
        <el-button type="primary" @click="confirmSub" :loading="loading"
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
    dialogBudgetVisible: {
      type: Boolean
    },
    suppId: {
      type: String
    }
  },
  watch: {
    dialogBudgetVisible(value) {
      if (value) {
        // 获取供应商信息
        this.infoDatas = []
        this.waitLoading = true
        API.supplier.qrySupplier(this.suppId).then((res) => {
          this.infoDatas.push(res.data.data)
        }).catch(() => {
          this.waitLoading = false
        })
        // 获取历史预算
        this.qryCostBudgets()

        // 初始化表单并移除所有表单项的校验
        this.$nextTick(() => {
          this.$refs['budget'].clearValidate()
        })
      }
    }
  },
  data() {
    return {
      waitLoading: false,
      hisBudgets: [],
      budgets: {
        empName: this.$store.state.user.name,
        empNo: this.$store.state.user.id,
        budgetList: []
      },
      infoDatas: [],
      loading: false,
      dialogConfirmVisible: false,
      pickerOptions: {
        disabledDate(time) {
          let date = new Date()
          date.setTime(date.getTime())
          return (
            time.getFullYear() > date.getFullYear() + 19 ||
            time.getFullYear() < date.getFullYear()
          )
        }
      }
    }
  },
  methods: {
    // 供应商预算保存修改
    confirmSub() {
      this.loading = true
      API.supplier.saveSupplierBudget({...this.budgets, suppId: this.suppId}).then(() => {
        this.loading = false
        this.dialogConfirmVisible = false
        this.$message.success('操作成功！')
        this.cancel()
      }).catch((error) => {
        this.$message.error(error.msg)
        this.loading = false
      })
    },
    save() {
      this.$refs['budget'].validate(valid => {
        if (!valid) {
          return false
        }
        this.dialogConfirmVisible = true
      })
    },
    inputBlur(index) {
      let value = this.budgets.budgetList[index].budget
      // 保证输入的第一个不是小数点
      value = value.replace(/^\./g, '')
      // 输入小数点只能是一个
      value = value
        .replace('.', '$#$')
        .replace(/\./g, '')
        .replace('$#$', '.')
        // 只能输入小数点后两位
      // value = value.replace(/^(-)*(\d+)\.(\d\d\d\d).*$/,
      //   '$1$2.$3')
      this.$set(
        this.budgets.budgetList[index],
        'budget',
        value
      )
    },
    // 校验预算
    async checkBudget(rule, value, callback) {
      if (!/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(value)) {
        return callback(new Error('请输入正数'))
      }
      if (value !== '' && String(value).split('.')[1] && String(value).split('.')[1].length > 2) {
        return callback(new Error('最多保留小数点后2位'))
      }
      if (value !== '' && String(value).split('.')[0] && String(value).split('.')[0].length > 12) {
        return callback(new Error('整数部分最多12位'))
      }
      return callback()
    },
    // 校验年份
    async checkYear(rule, value, callback) {
      if (this.budgets.budgetList.filter(item => item.budgetYears === value).length > 1) {
        return callback(new Error('该年份已选，请重新选择'))
      }
      return callback()
    },
    // 添加预算
    add() {
      this.budgets.budgetList.push({
        budgetYears: '',
        budget: ''
      })
    },
    // 删除预算
    del(index) {
      this.budgets.budgetList.splice(index, 1)
    },
    // 获取当前年份
    getYear() {
      let date = new Date()
      date.setTime(date.getTime())
      return date.getFullYear().toString()
    },
    // 获取历史预算
    qryCostBudgets() {
      API.supplier.qryCostBudgets(this.suppId).then(res => {
        this.hisBudgets = res.data.data.filter(item => item.budgetYears < this.getYear())
        this.budgets.budgetList = res.data.data.filter(item => item.budgetYears >= this.getYear())
        if (this.budgets.budgetList.filter(item => item.budgetYears === this.getYear()).length === 0) {
          this.budgets.budgetList.unshift({
            budgetYears: this.getYear(),
            budget: ''
          })
        }
        this.waitLoading = false
      }).catch(() => {
        this.waitLoading = false
      })
    },
    cancel() {
      this.$emit('cancel', { type: 'budget' })
    }
  }
}
</script>
<style lang="scss" scoped>
.supplier-budget {
  /deep/ .el-table__header-wrapper {
    height: 36px;
    line-height: 36px;
    display: flex;
    align-items: center;
  }
  .sub-title {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    border-bottom: 1px solid #eeeeee;
    .space {
      width: 6px;
      height: 16px;
      background-color: #80a639;
      margin-right: 10px;
    }
    span {
      font-size: 16px;
      color: #111111;
    }
  }
  .inline-form {
    display: flex;
    justify-content: space-around;
    align-items: center;
    /deep/ .el-input {
      width: 208px;
      height: 26px;
    }
  }
  .budget {
    /deep/ .el-input {
      width: 208px;
    }
  }
  .del {
    cursor: pointer;
    width: 24px;
    height: 24px;
    margin-left: 50px;
    position: absolute;
    top: 10px;
  }
  .add-btn {
    display: flex;
    align-items: center;
    margin-left: 150px;
    width: 90px;
    &:hover {
      cursor: pointer;
    }
    img {
      width: 14px;
      height: 14px;
      margin-right: 6px;
    }
    color: #80a639;
  }
}
</style>
