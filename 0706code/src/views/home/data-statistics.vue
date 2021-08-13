<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span class="cardTitle">数据统计</span>
    </div>
    <div>
      <el-select
        v-model="deptValue"
        clearable
        placeholder="选择部门"
        style="margin-right: 10px"
        @change="changeDeptHandle($event)"
      >
        <el-option
          v-for="item in deptOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <span>公司投行部业务：</span>
      <el-radio-group v-model="defaultRadio" @change="changeContain($event)">
        <el-radio :label="1">包含</el-radio>
        <el-radio :label="0">不包含</el-radio>
      </el-radio-group>
    </div>
    <div class="moneyCardGroup">
      <div class="moneyCard" style="background: #78b258">
        <span>总资产(万元)</span>
        <span class="moneyNum">{{ assetBal | moneyFormat(0) }}</span>
      </div>
      <div class="moneyCard" style="background: #e78c57">
        <span>总负债(万元)</span>
        <span class="moneyNum">{{ debtBal | moneyFormat(0) }}</span>
      </div>
      <div class="moneyCard" style="background: #f9c446">
        <span>考核利润(万元)</span>
        <span class="moneyNum">{{ checkProfit | moneyFormat(0) }}</span>
      </div>
      <div class="moneyCard" style="background: #7ec4ea">
        <span>授信总量(万元)</span>
        <span class="moneyNum">{{ countCust | moneyFormat(0) }}</span>
      </div>
      <div class="moneyCard" style="background: #78b258">
        <span>授信客户数</span>
        <span class="moneyNum">{{ creditLimitSum | moneyFormat(0) }}</span>
      </div>
    </div>
  </el-card>
</template>

<script>
import API from '@/api'
export default {
  data() {
    return {
      defaultRadio: 1,
      deptOptions: [],
      deptValue: '',
      depCode: '',
      isContainlb: 'N',
      assetBal: '',
      debtBal: '',
      checkProfit: '',
      countCust: '',
      creditLimitSum: ''
    }
  },
  methods: {
    getDebts() {
      API.cockpit.getDept().then(({ data }) => {
        if (data && data.code === 0) {
          for (const item of data.data) {
            this.deptOptions.push({ value: item.deptCode, label: item.deptName })
          }
        }
      })
    },
    getAssetDebtUsing() {
      var params = {
        depCode: this.depCode,
        isContainlb: this.isContainlb,
      }
      API.cockpit.getImportIndex(params).then(({ data }) => {
        if (data && data.code === 0) {
          this.assetBal = data.data.assetBal
          this.debtBal = data.data.debtBal
          this.checkProfit = data.data.checkProfit
          this.countCust = data.data.countCust
          this.creditLimitSum =  data.data.creditLimitSum
        } else {
        }
      })
    },
    changeDeptHandle(val) {
      console.log(val)
      this.depCode = val
      this.getAssetDebtUsing()
    },
    changeContain(val) {
      this.isContainlb = val
      this.getAssetDebtUsing()
    },
  },
  mounted() {
    this.getDebts()
    this.getAssetDebtUsing()
  },
}
</script>
<style lang="scss">
.box-card {
  margin-bottom: 16px;
  .cardTitle {
    font-size: 18px;
    font-weight: bold;
  }
  .moneyCardGroup {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 85px;
    margin-top: 16px;
  }
  .moneyCard {
    display: flex;
    flex-flow: column;
    width: 19%;
    height: 85px;
    border-radius: 5px;
    padding: 16px 0 0 16px;
    color: #fff;
    .moneyNum {
      font-size: 30px;
      margin-top: 5px;
    }
  }
}
</style>