<template>
  <div class="rule-form">
    <div class="rule-form-title">
      <span class="line"></span>
      <span>奖池奖品配置</span>
    </div>
    <el-form
      :model="ruleForm"
      ref="ruleForm"
      label-width="90px"
      class="demo-dynamic"
      size="mini"
      label-position="right"
    >
      <div v-for="(item, index) in ruleForm.rules" :key="index">
        <div class="rule-form-row">
          <div class="rule-form-num">
            <span class="number">{{ index + 1 }}</span>
          </div>
          <el-form-item
            label="奖品级别:"
            label-width="200px"
            :prop="'rules.' + index + '.prodSeqid'"
            :class="`prodSeqid${index}`"
          >
            <el-select :disabled="true" v-model="item.prodSeqid">
              <el-option label="一等奖" value="1"></el-option>
              <el-option label="二等奖" value="2"></el-option>
              <el-option label="三等奖" value="3"></el-option>
              <el-option label="四等奖" value="4"></el-option>
              <el-option label="五等奖" value="5"></el-option>
              <el-option label="六等奖" value="6"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="奖品:"
            :prop="'rules.' + index + '.prodName'"
            :rules="{ required: true, message: '请输入', trigger: 'blur' }"
            :class="`prodName${index}`"
          >
            <el-input
              :disabled="true"
              placeholder="请查询"
              v-model="item.prodName"
            >
              <i
                v-if="!inputDisabled"
                slot="suffix"
                class="el-input__icon el-icon-khz"
                @click="handleDialogVisible(index)"
              ></i>
            </el-input>
            <i
              v-if="!inputDisabled && index === 0"
              class="el-icon-plus"
              @click="jumpPage"
            ></i>
          </el-form-item>
          <el-form-item
            label="奖品上限:"
            :prop="'rules.' + index + '.prodUp'"
            :rules="[
              { required: true, message: '请输入', trigger: 'blur' },
              { validator: checkProdUp, trigger: 'blur' },
            ]"
          >
            <el-input
              :disabled="inputDisabled"
              placeholder="请输入"
              v-model="item.prodUp"
              @change="(val) => changeProdUp(val, index)"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="奖品库存:"
            :prop="'rules.' + index + '.prodStock'"
          >
            <el-input :disabled="true" v-model="item.prodStock"></el-input>
          </el-form-item>
        </div>
        <div class="rule-form-row">
          <div style="width: 50px"></div>
          <el-form-item
            label="是否允许单个奖品的重复获奖:"
            label-width="200px"
            :prop="'rules.' + index + '.prodRepeat'"
          >
            <el-select :disabled="inputDisabled" v-model="item.prodRepeat">
              <el-option label="不允许" value="1"></el-option>
              <el-option label="允许" value="0"></el-option>
            </el-select>
          </el-form-item>
          <div
            class="rule-form-row"
            v-if="index === ruleForm.rules.length - 1 && index !== 0 && !inputDisabled"
          >
            <i class="el-icon-remove" @click.prevent="removeRule(item)"></i>
          </div>
        </div>
      </div>
    </el-form>
    <div class="rule-form-add" @click="addRule" v-if="!inputDisabled">
      <i class="el-icon-tjzb"></i>
      <span>增加奖品</span>
    </div>
    <div class="rule-form-notice" v-if="!inputDisabled">
      <p>注：1、奖池等级最多添加6个；</p>
      <p>2、“奖品上限”≤5000且为正整数；</p>
      <p>3、奖品库存等于奖品发放上限减去已兑换奖品数量；</p>
    </div>
    <el-dialog
      class="prod-dialog"
      title="查询"
      :visible.sync="prodDialogVisible"
      width="900px"
      append-to-body
    >
      <div>
        <div class="prod-dialog-search">
          <div class="search-input">
            <div class="search-input-item">
              <div class="search-input-label">供应商名称</div>
              <el-input
                placeholder="请输入供应商名称"
                v-model="prodSearchParams.suppName"
              ></el-input>
            </div>
            <div class="search-input-item">
              <div class="search-input-label">供应商渠道</div>
              <el-select
                v-model="prodSearchParams.suppChannel"
                placeholder="请选择"
                disabled
              >
                <el-option
                  v-for="(item, index) in $root.selectOption.channel"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
            <div class="search-input-item">
              <div class="search-input-label">商品名称</div>
              <el-input
                placeholder="请输入商品名称"
                v-model="prodSearchParams.prodName"
              ></el-input>
            </div>
          </div>
          <div class="search-btns">
            <el-button type="primary" icon="el-icon-query" @click="onSearchBtn"
              >查询</el-button
            >
            <el-button icon="el-icon-reset" @click="onResetBtn">重置</el-button>
          </div>
        </div>
        <el-table
          class="prod-dialog-table"
          :data="prodTableData"
          border
          :header-cell-style="{ background: '#80A639', color: '#ffffff' }"
        >
          <el-table-column label="选择" fixed width="60" align="center">
            <template slot-scope="scope">
              <el-radio
                v-model="radio"
                :label="scope.$index"
                @change="onTableSelect(scope.row)"
                >&nbsp;</el-radio
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="suppName"
            label="供应商名称"
            width="180"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="suppChannel" label="供应商渠道" align="center">
            <template slot-scope="{ row }">
              <span>{{ $root.selectOption.channelObj[row.suppChannel] }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="prodName"
            label="商品名称"
            width="180"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="prodCnt" label="数量" align="center">
          </el-table-column>
        </el-table>
        <v-pagination
          :total="page.total"
          :currentPageNum="page.currentPage"
          :currentPageSize="page.pageSize"
          @pageChange="pageChange"
        ></v-pagination>
        <div class="prod-dialog-btns">
          <el-button type="primary" @click="handleAdd">添 加</el-button>
          <el-button @click="prodDialogVisible = false">返 回</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import API from '@/api'
import { baseUrl } from '@/utils'
import vPagination from '@/components/pagination/pagination'
const channelOptions = [
  {
    key: '',
    name: '请选择'
  },
  {
    key: '1',
    name: '尊享'
  },
  {
    key: '2',
    name: '普惠'
  },
  {
    key: '3',
    name: '信用卡'
  }
]
const channelKeyValue = channelOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.name
  return acc
}, {})
export default {
  components: {
    vPagination
  },
  filters: {
    channelFilter(num) {
      return channelKeyValue[num]
    }
  },
  props: {
    actId: {
      type: String
    },
    type: {
      type: String
    },
    active: {
      type: Number
    },
    typeChanged: {
      type: Boolean
    },
    actStatus: {
      type: String
    }
  },
  computed: {
    inputDisabled() {
      return this.type === 'detail' || (this.type === 'edit' && this.actStatus === '4')
    }
  },
  data() {
    var checkProdUp = (rule, value, callback) => {
      if (value > 5000) {
        callback(new Error('“奖品上限”<=5000！'))
      } else if (!/^([1-9]\d*)$/.test(value)) {
        callback(new Error('“奖品上限”为正整数！'))
      } else {
        callback()
      }
    }
    var checkRate = (rule, value, callback) => {
      if (!/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(value)) {
        callback(new Error('请输入正数！'))
      } else if (value > 100) {
        callback(new Error('不可大于100%!'))
      } else if (value < 0) {
        callback(new Error('不可为负数!'))
      } else if (!/^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/.test(value)) {
        callback(new Error('保留两位小数!'))
      } else {
        callback()
      }
    }
    return {
      checkProdUp,
      checkRate,
      channelOptions,
      pictureUrl: '',
      baseUrl: baseUrl(),
      ruleForm: {
        rules: [
          {
            prodId: '',
            prodName: '',
            prodSeqid: '1',
            prodRepeat: '1',
            prodUp: '',
            prodStock: '',
            lotteryRate: '',
            showType: '',
            showMessage: false,
            message: ''
          }
        ]
      },
      upload: false, // 是否提交表单
      prodDialogVisible: false,
      prodSearchParams: {
        suppName: '',
        suppChannel: this.$store.state.user.channel,
        prodName: ''
      },
      radio: '',
      selectProdId: '',
      selectProdName: '',
      ruleIndex: '',
      prodTableData: [],
      formData: new FormData(),
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      }
    }
  },
  methods: {
    // 跳转至商品管理
    jumpPage() {
      const prod = this.$router.resolve({ name: 'prod' })
      window.open(prod.href, '_blank')
    },
    handleNextStep(type) {
      if (type === 'TEMP') {
        this.setParams(type)
      } else {
        this.$refs['ruleForm'].validate(valid => {
          if (valid) {
            this.setParams()
          }
        })
      }
    },
    setParams(type) {
      this.upload = true
      var rulesArr = []
      this.ruleForm.rules.forEach((item, index) => {
        var ruleObj = {}
        if (type === 'TEMP') {
          ruleObj = {
            prodSeqid: item.prodSeqid,
            prodRepeat: item.prodRepeat,
            prodId: item.prodId,
            prodName: item.prodName,
            prodUp: item.prodUp,
            prodStock: item.prodStock,
            lotteryRate: item.lotteryRate,
            showType: item.showType,
            ifThanks: 0
          }
        } else {
          ruleObj = {
            prodSeqid: item.prodSeqid,
            prodRepeat: item.prodRepeat,
            prodId: item.prodId,
            prodName: item.prodName,
            prodUp: item.prodUp,
            prodStock: item.prodStock,
            lotteryRate: item.lotteryRate,
            showType: item.showType,
            ifThanks: 0
          }
        }
        rulesArr.push(ruleObj)
      })
      if (this.upload) {
        this.$emit('handleNext', rulesArr)
      }
    },
    removeRule(item) {
      var index = this.ruleForm.rules.indexOf(item)
      if (index !== -1) {
        this.ruleForm.rules.splice(index, 1)
      }
    },
    addRule() {
      if (this.ruleForm.rules.length < 6) {
        this.ruleForm.rules.push({
          prodId: '',
          prodName: '',
          prodUp: '',
          prodStock: '',
          prodSeqid: (this.ruleForm.rules.length + 1).toString(),
          prodRepeat: '1',
          lotteryRate: '',
          showType: '',
          showMessage: false,
          message: ''
        })
      } else {
        this.$message({
          message: '奖池等级最多添加6个!',
          type: 'warning'
        })
      }
    },
    resetRuleForm() {
      var ruleArr = []
      var rule = {}
      for (var j = 0; j < 1; j++) {
        rule = {
          prodId: '',
          prodName: '',
          prodSeqid: (j + 1).toString(),
          prodRepeat: '1',
          prodUp: '',
          prodStock: '',
          lotteryRate: '',
          showType: '',
          showMessage: false,
          message: ''
        }
        ruleArr.push(rule)
      }
      this.ruleForm = {
        rules: ruleArr
      }
    },
    handleDialogVisible(index) {
      this.ruleIndex = index
      this.prodDialogVisible = true
    },
    // 加载奖品配置
    getLotteryActProd() {
      API.newlottery
        .getLotteryActProdData({
          actId: this.actId
        })
        .then(response => {
          if (response.data.data.length === 0) {
            this.resetRuleForm()
          } else {
            var data = response.data.data
            var ruleArr = []
            data.forEach(item => {
              var rule = {
                prodSeqid: item.prodSeqid,
                prodId: item.prodId,
                prodName: item.prodName,
                prodUp: item.prodUp,
                prodStock: item.prodStock,
                lotteryRate: item.lotteryRate && item.lotteryRate.toFixed(2),
                prodRepeat: item.prodRepeat,
                showType: item.showType,
                ifThanks: item.ifThanks,
                showMessage: false,
                message: ''
              }
              ruleArr.push(rule)
            })
            this.ruleForm = {
              rules: ruleArr
            }
          }
        })
        .catch(() => { })
    },
    // 请求商品列表数据
    getProdTableList(page) {
      API.buy
        .getProdListData(
          Object.assign(
            {
              prodStatus: 1,
              current: page.currentPage,
              size: page.pageSize
            },
            this.prodSearchParams
          )
        )
        .then(response => {
          this.prodTableData = response.data.data.records
          this.page.total = response.data.data.total
        })
        .catch(() => {
          console.log('error')
        })
    },
    // 查询
    onSearchBtn() {
      this.selectProdId = ''
      this.selectProdName = ''
      this.radio = ''
      this.page.currentPage = 1
      this.getProdTableList(this.page)
    },
    // 查询重置
    onResetBtn() {
      this.selectProdId = ''
      this.selectProdName = ''
      this.radio = ''
      this.prodSearchParams = {
        suppName: '',
        suppChannel: this.$store.state.user.channel,
        prodName: ''
      }
      this.page.currentPage = 1
      this.getProdTableList(this.page)
    },
    // 分页
    pageChange(page) {
      this.selectProdId = ''
      this.selectProdName = ''
      this.radio = ''
      this.page.currentPage = page.page
      this.page.pageSize = page.limit
      this.getProdTableList(this.page)
    },
    // 表格单选
    onTableSelect(row) {
      this.selectProdId = row.prodId
      this.selectProdName = row.prodName
    },
    handleAdd() {
      if (!this.selectProdId) {
        this.$message({
          message: '请选择!',
          type: 'warning'
        })
      } else {
        this.ruleForm.rules.forEach((item, index) => {
          if (this.ruleIndex === index) {
            item.prodId = this.selectProdId
            item.prodName = this.selectProdName
          }
        })
        this.prodDialogVisible = false
      }
    },
    changeProdUp(val, i) {
      this.ruleForm.rules.forEach((item, index) => {
        if (i === index) {
          item.prodStock = val
        }
      })
    }
  },
  created() {
    if (this.type !== 'add') {
      this.getLotteryActProd()
    }
  },
  watch: {
    type(value) {
      if (!value) {
        this.$nextTick(() => {
          this.$refs['ruleForm'].clearValidate()
          this.ruleForm = {
            rules: [
              {
                prodId: '',
                prodName: '',
                prodUp: '',
                prodStock: '',
                lotteryRate: '',
                showType: ''
              }
            ]
          }
        })
      } else if (value !== 'add') {
        this.getLotteryActProd()
      } else if (value === 'add') {
        this.resetRuleForm()
      }
    },
    prodDialogVisible(value) {
      if (value) {
        this.getProdTableList(this.page)
      } else {
        this.radio = ''
        this.selectProdId = ''
        this.selectProdName = ''
        this.prodSearchParams = {
          suppName: '',
          suppChannel: this.$store.state.user.channel,
          prodName: ''
        }
        this.page = {
          total: 0,
          currentPage: 1,
          pageSize: 10
        }
        this.prodTableData = []
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.rule-form {
  .rule-form-title {
    display: flex;
    align-items: center;
    color: #111111;
    margin-bottom: 25px;

    .line {
      width: 2px;
      height: 12px;
      margin-right: 5px;
      background-color: #80a639;
    }
  }

  .rule-form-row {
    display: flex;

    .rule-form-num {
      width: 50px;

      .text {
        font-size: 12px;
        color: #676666;
      }

      .number {
        width: 20px;
        height: 20px;
        font-size: 10px;
        color: #ffffff;
        margin-left: 6px;
        text-align: center;
        line-height: 20px;
        display: inline-block;
        border-radius: 4px;
        background-color: #80a639;
      }
    }

    .el-form-item {
      /deep/ .el-input {
        width: 130px;
      }

      /deep/ .el-form-item__label {
        padding-right: 10px;
      }

      /deep/ .el-input-group__append {
        padding: 4px;
      }

      &:nth-child(2),
      &:nth-child(3),
      &:nth-child(4) {
        margin-right: 40px;
      }

      .el-icon-khz {
        width: 16px;
        height: 19px;
        background: url(../imgs/khz.png) center no-repeat;
        background-size: cover;
        position: relative;
        top: 3px;
        cursor: pointer;
      }
    }

    .el-icon-remove {
      font-size: 20px;
      line-height: 26px;
      color: #ff0000;
      margin-left: 15px;
      cursor: pointer;
    }
  }

  .rule-form-add {
    width: 72px;
    display: flex;
    align-items: center;
    color: #80a639;
    cursor: pointer;

    /deep/ .el-icon-tjzb {
      width: 11px;
      height: 11px;
      background: url(../imgs/tjzb.png) center no-repeat;
      background-size: cover;
      margin-right: 5px;
    }
  }

  .rule-form-notice {
    color: #ff0000;
    margin: 60px 0;

    p {
      margin: 0;
    }

    p:not(:first-child) {
      margin-left: 28px;
    }
  }
}

.prod-dialog,
.rule-dialog {
  .prod-dialog-search {
    .search-input {
      display: flex;
      justify-content: space-around;

      /deep/ .el-input {
        width: 140px;
        /deep/ .el-input__inner {
          height: 35px;
        }
      }
    }
  }

  .rule-dialog-search {
    .search-input {
      display: flex;
      justify-content: center;
      align-items: center;

      /deep/ .el-input {
        width: 248px;
      }
    }
  }

  .search-input-item {
    display: flex;
    align-items: center;

    &:nth-child(2) {
      margin: 0 50px;
    }
  }

  .search-input-label {
    width: 70px;
    margin-right: 16px;
  }

  .search-btns {
    margin: 30px 0;
    display: flex;
    justify-content: center;
  }

  .prod-dialog-btns,
  .rule-dialog-btns {
    display: flex;
    justify-content: center;
  }

  .el-button {
    height: 35px;
    display: flex;
    align-items: center;
    padding: 0 20px;

    /deep/ .el-icon-query {
      width: 18px;
      height: 18px;
      background: url(../imgs/search.png) center no-repeat;
      background-size: cover;
    }

    /deep/ .el-icon-reset {
      width: 15px;
      height: 19px;
      background: url(../imgs/reset.png) center no-repeat;
      background-size: cover;
    }
  }

  .prod-dialog-table,
  .rule-dialog-table {
    /deep/ tr {
      height: 35px;

      /deep/ th,
      td {
        padding: 0;
      }
    }

    /deep/ .el-radio__label {
      display: none;
    }
  }
}
.prodName0 {
  /deep/ .el-form-item__content {
    position: relative;
  }
  /deep/ .el-icon-plus {
    position: absolute;
    right: -20px;
    top: 5px;
  }
}
</style>
