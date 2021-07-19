<template>
  <div class="rule-form">
    <el-form :model="ruleForm" ref="ruleForm" label-width="130px" class="demo-dynamic" size="mini" label-position="left">
      <div v-for="(item, index) in ruleForm.rules" :key="index">
        <div class="rule-form-row">
          <el-form-item label="规则名称:" :prop="'rules.' + index + '.ruleName'">
            <el-input :disabled="true" placeholder="请查询" v-model="item.ruleName">
              <i v-if="type !== 'detail' && actStatus !== '4' " slot="suffix" class="el-input__icon el-icon-khz" @click="handleDialogVisible(index, 'rule')"></i>
            </el-input>
            <i v-if="type !== 'detail' && actStatus !== '4'" class="el-icon-circle-close" @click="clearRuleName(index)"></i>
            <router-link v-if="index === 0" :to="{path:'/equitymgr/esequityrule'}" target="_blank">
              <i v-if="type !== 'detail' && actStatus !== '4'" class="el-icon-plus add-icon-style"></i>
            </router-link>
          </el-form-item>
          <el-form-item label="权益奖励:" :prop="'rules.' + index + '.prodName'" :rules="{ required: true, message: '请查询', trigger: 'blur' }">
            <el-input :disabled="true" placeholder="请查询" v-model="item.prodName">
              <i v-if="type !== 'detail' && actStatus !== '4'" slot="suffix" class="el-input__icon el-icon-khz" @click="handleDialogVisible(index, 'prod')"></i>
            </el-input>
            <router-link v-if="index === 0" :to="{path:'/supplier/prod'}" target="_blank">
              <i v-if="type !== 'detail' && actStatus !== '4'" class="el-icon-plus add-icon-style"></i>
            </router-link>
          </el-form-item>
          <el-form-item label="奖品发放上限:" :prop="'rules.' + index + '.prodUp'" :rules="[{ required: true, message: '请输入', trigger: 'blur' }, {pattern: /^([1-9]\d*)$/, message: '请输入正整数', trigger: 'blur'}, { min: 0, max: 8, message: '长度限制8字符内', trigger: 'blur' }]">
            <el-input :disabled="type === 'detail' || actStatus === '4'" placeholder="请输入"  maxlength="8" v-model="item.prodUp" @change="val => changeProdUp(val, index)"></el-input>
          </el-form-item>
          <el-form-item label="奖品库存:" :prop="'rules.' + index + '.prodStock'">
            <el-input :disabled="true" v-model="item.prodStock"></el-input>
          </el-form-item>
        </div>
        <div class="rule-form-row">
          <!-- <el-form-item :label="ruleType === 'D' ? '每日发放最大数量:' : ruleType === 'W' ? '每周发放最大数量:' : '每月发放最大数量:'" :prop="'rules.' + index + '.maxAmout'"
            :rules="[{ required: true, message: '请输入', trigger: 'blur' }, {pattern: /^([1-9]\d*)$/, message: '请输入正整数', trigger: 'blur'}, { min: 0, max: 8, message: '长度限制8字符内', trigger: 'blur' }]"> -->
          <el-form-item :label="ruleType === 'D' ? '每日发放最大数量:' : ruleType === 'W' ? '每周发放最大数量:' : '每月发放最大数量:'" :prop="'rules.' + index + '.maxAmout'"
            :rules="[{pattern: /^([1-9]\d*)$/, message: '请输入正整数', trigger: 'blur'}, { min: 0, max: 8, message: '长度限制8字符内', trigger: 'blur' }]">
            <el-input :disabled="type === 'detail' || actStatus === '4'"  maxlength="8" placeholder="请输入" v-model="item.maxAmout"></el-input>
            <!-- 占位 -->
            <i v-if="type !== 'detail' && actStatus !== '4' " class="el-icon-circle-close" style="visibility: hidden;"></i>
          </el-form-item>
          <!-- <el-form-item :label="ruleType === 'D' ? '每人每日限购数量:' : ruleType === 'W' ? '每人每周限购数量:' : '每人每月限购数量:'" :prop="'rules.' + index + '.limitAmout'"
            :rules="[{ required: true, message: '请输入', trigger: 'blur' }, {pattern: /^([1-9]\d*)$/, message: '请输入正整数', trigger: 'blur'}, { min: 0, max: 8, message: '长度限制8字符内', trigger: 'blur' }]"> -->
          <el-form-item :label="ruleType === 'D' ? '每人每日限购数量:' : ruleType === 'W' ? '每人每周限购数量:' : '每人每月限购数量:'" :prop="'rules.' + index + '.limitAmout'"
            :rules="[{pattern: /^([1-9]\d*)$/, message: '请输入正整数', trigger: 'blur'}, { min: 0, max: 8, message: '长度限制8字符内', trigger: 'blur' }]">
            <el-input :disabled="type === 'detail' || actStatus === '4'"  maxlength="8" placeholder="请输入" v-model="item.limitAmout"></el-input>
          </el-form-item>
          <!-- <el-form-item label="每人限购总数量:" :prop="'rules.' + index + '.oneAmout'" :rules="[{ required: true, message: '请输入', trigger: 'blur' }, {pattern: /^([1-9]\d*)$/, message: '请输入正整数', trigger: 'blur'}, { min: 0, max: 8, message: '长度限制8字符内', trigger: 'blur' }]"> -->
          <el-form-item label="每人限购总数量:" :prop="'rules.' + index + '.oneAmout'" :rules="[{pattern: /^([1-9]\d*)$/, message: '请输入正整数', trigger: 'blur'}, { min: 0, max: 8, message: '长度限制8字符内', trigger: 'blur' }]">
            <el-input :disabled="type === 'detail' || actStatus === '4'" placeholder="请输入"  maxlength="8" v-model="item.oneAmout"></el-input>
          </el-form-item>
          <el-form-item label="兑换积分:" :prop="'rules.' + index + '.exchange'" :rules="[{ required: true, message: '请输入', trigger: 'blur' }, {pattern: /^([1-9]\d*)$/, message: '请输入正整数', trigger: 'blur'}, { min: 0, max: 12, message: '长度限制12字符内', trigger: 'blur' }]">
            <el-input :disabled="type === 'detail'" placeholder="请输入"  maxlength="12" v-model="item.exchange"></el-input>
          </el-form-item>
        </div>
        <div class="rule-form-row">
          <el-form-item label="原积分:" :prop="'rules.' + index + '.originalScore'" :rules="[{pattern: /^([1-9]\d*)$/, message: '请输入正整数', trigger: 'blur'}, { min: 0, max: 12, message: '长度限制12字符内', trigger: 'blur' }]">
            <el-input :disabled="type === 'detail'" placeholder="请输入"  maxlength="12" v-model="item.originalScore"></el-input>
          </el-form-item>
          <i class="el-icon-remove" v-if="index !== 0 && type !== 'detail' && actStatus !== '4'" @click.prevent="removeRule(item)"></i>
        </div>
      </div>
    </el-form>
    <div class="rule-form-add" @click="addRule" v-if="type !== 'detail' && actStatus !== '4'">
      <i class="el-icon-tjzb"></i>
      <span>添加规则</span>
    </div>
    <div class="rule-form-notice" v-if="type !== 'detail' && actStatus !== '4'">注：规则指标最多添加10个。</div>
    <el-dialog class="prod-dialog" title="查询" :visible.sync="prodDialogVisible" width="900px" append-to-body>
      <div style="width: 100%">
        <div class="prod-dialog-search">
          <div class="search-input">
            <div class="search-input-item">
              <div class="search-input-label">供应商名称</div>
              <el-input placeholder="请输入供应商名称" v-model="prodSearchParams.suppName"></el-input>
            </div>
            <div class="search-input-item">
              <div class="search-input-label">供应商渠道</div>
              <el-select v-model="prodSearchParams.suppChannel" placeholder="请选择" disabled>
                <el-option v-for="(item,index) in $root.selectOption.channel" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </div>
            <div class="search-input-item">
              <div class="search-input-label">商品名称</div>
              <el-input placeholder="请输入商品名称" v-model="prodSearchParams.prodName"></el-input>
            </div>
          </div>
          <div class="search-btns">
            <el-button type="primary" icon="el-icon-query" @click="onSearchBtn('prod')">查询</el-button>
            <el-button icon="el-icon-reset" @click="onResetBtn('prod')">重置</el-button>
          </div>
        </div>
        <el-table class="prod-dialog-table" :data="prodTableData" border style="width: 100%" :header-cell-style="{background:'#80A639',color:'#ffffff'}">
          <el-table-column label="选择" fixed width="60" align="center">
            <template slot-scope="scope">
              <el-radio v-model="radio" :label="scope.$index" @change="onTableSelect(scope.$index, scope.row, 'prod')">&nbsp;</el-radio>
            </template>
          </el-table-column>
          <el-table-column prop="suppName" label="供应商名称" width="180" align="center">
          </el-table-column>
          <el-table-column prop="suppChannel" label="供应商渠道" align="center">
            <template slot-scope="{row}">
              <!-- <span>{{ row.suppChannel | channelFilter }}</span> -->
              <span>{{ $root.selectOption.channelObj[row.suppChannel] }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="prodName" label="商品名称" width="180" align="center">
          </el-table-column>
          <el-table-column prop="prodCnt" label="数量" align="center">
          </el-table-column>
        </el-table>
        <v-pagination :total="page.total" :currentPageNum='page.currentPage' :currentPageSize='page.pageSize'
          @pageChange="(page) => pageChange(page, 'prod')"></v-pagination>
        <div class="prod-dialog-btns">
          <el-button type="primary" @click="handleAdd('prod')">添 加</el-button>
          <el-button @click="prodDialogVisible = false">返 回</el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog class="rule-dialog" title="查询" :visible.sync="ruleDialogVisible" width="800px" append-to-body>
      <div style="width: 100%">
        <div class="rule-dialog-search">
          <div class="search-input">
            <div class="search-input-label">规则名称</div>
            <el-input placeholder="请输入规则名称" v-model="ruleSearchParams.ruleName"></el-input>
          </div>
          <div class="search-btns">
            <el-button type="primary" icon="el-icon-query" @click="onSearchBtn('rule')">查询</el-button>
            <el-button icon="el-icon-reset" @click="onResetBtn('rule')">重置</el-button>
          </div>
        </div>
        <el-table class="rule-dialog-table" :data="ruleTableData" style="width: 100%" border :header-cell-style="{background:'#80A639',color:'#ffffff'}">
          <el-table-column label="选择" fixed width="60" align="center">
            <template slot-scope="scope">
              <el-radio v-model="radio" :label="scope.$index" @change="onTableSelect(scope.$index, scope.row, 'rule')">&nbsp;</el-radio>
            </template>
          </el-table-column>
          <el-table-column prop="ruleName" label="规则名称" width="180" align="center">
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="160" align="center">
          </el-table-column>
          <el-table-column prop="createEmpNo" label="创建人工号" width="100" align="center">
          </el-table-column>
          <el-table-column prop="createEmpName" label="创建人" align="center">
          </el-table-column>
        </el-table>
        <v-pagination :total="rulePage.total" :currentPageNum='rulePage.currentPage' :currentPageSize='rulePage.pageSize'
          @pageChange="(page) => pageChange(page, 'rule')"></v-pagination>
        <div class="rule-dialog-btns">
          <el-button type="primary" @click="handleAdd('rule')">添 加</el-button>
          <el-button @click="ruleDialogVisible = false">返 回</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import API from '@/api'
  import vPagination from '@/components/pagination/pagination'
  const channelOptions = [{
    key: '',
    name: '请选择'
  }, {
    key: '1',
    name: '财富'
  }, {
    key: '2',
    name: '直销'
  }, {
    key: '3',
    name: '信用卡'
  }]
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
      ruleType: {
        type: String
      },
      actStatus: {
        type: String
      }
    },
    computed: {
      inputDisabled () {
        return this.type === 'detail' || (this.type === 'edit' && this.actStatus === '4')
      }
    },
    data() {
      return {
        channelOptions,
        ruleForm: {
          rules: [{
            ruleId: '',
            ruleName: '',
            prodId: '',
            prodName: '',
            prodUp: '',
            maxAmout: '',
            limitAmout: '',
            oneAmout: '',
            exchange: '',
            originalScore: '',
            prodStock: ''
          }]
        },
        prodDialogVisible: false,
        ruleDialogVisible: false,
        prodSearchParams: {
          suppName: '',
          suppChannel: this.$store.state.user.channel,
          prodName: ''
        },
        ruleSearchParams: {
          ruleName: '',
          ruleChannel: this.$store.state.user.channel
        },
        radio: '',
        selectProdId: '',
        selectProdName: '',
        selectRuleId: '',
        selectRuleName: '',
        ruleIndex: '',
        prodTableData: [],
        ruleTableData: [],
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 10 // 每页显示多少条
        },
        rulePage: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 10 // 每页显示多少条
        }
      }
    },
    methods: {
      handleNextStep() {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            var typeArr = ['D', 'M', 'W']
            var index = typeArr.indexOf(this.ruleType)
            if (index > -1) {
              typeArr.splice(index, 1)
            }
            this.ruleForm.rules.forEach(item => {
              // 默认赋值
              item.maxAmout = item.maxAmout ? item.maxAmout : item.prodUp
              item.limitAmout = item.limitAmout ? item.limitAmout : item.prodUp
              item.oneAmout = item.oneAmout ? item.oneAmout : item.prodUp
              Object.keys(item).forEach(key => {
                if (key === 'maxAmout') {
                  item['maxAmout' + this.ruleType] = item[key]
                  item['maxAmout' + typeArr[0]] = ''
                  item['maxAmout' + typeArr[1]] = ''
                } else if (key === 'limitAmout') {
                  item['oneAmout' + this.ruleType] = item[key]
                  item['oneAmout' + typeArr[0]] = ''
                  item['oneAmout' + typeArr[1]] = ''
                }
                item.createEmpName = this.$store.state.user.name
                item.createEmpNo = this.$store.state.user.id
              })
            })
            this.$emit('handleNext', this.ruleForm.rules)
          } else {
            return false
          }
        })
      },
      // 清空规则名称
      clearRuleName(idx) {
        this.$set(this.ruleForm.rules[idx], 'ruleName', '')
        this.$set(this.ruleForm.rules[idx], 'ruleId', '')
      },
      removeRule(item) {
        var index = this.ruleForm.rules.indexOf(item)
        if (index !== -1) {
          this.ruleForm.rules.splice(index, 1)
        }
      },
      addRule() {
        if (this.ruleForm.rules.length < 10) {
          this.ruleForm.rules.push({
            ruleId: '',
            ruleName: '',
            prodId: '',
            prodName: '',
            prodUp: '',
            maxAmout: '',
            limitAmout: '',
            oneAmout: '',
            exchange: '',
            originalScore: '',
            prodStock: ''
          })
        } else {
          this.$message({
            message: '规则指标最多添加10个!',
            type: 'warning'
          })
        }
      },
      resetRuleForm() {
        this.ruleForm = {
          rules: [{
            ruleId: '',
            ruleName: '',
            prodId: '',
            prodName: '',
            prodStock: '',
            prodUp: '',
            maxAmout: '',
            limitAmout: '',
            exchange: '',
            originalScore: '',
            oneAmout: ''
          }]
        }
      },
      handleDialogVisible(index, type) {
        this.ruleIndex = index
        if (type === 'prod') {
          this.prodDialogVisible = true
        } else {
          this.ruleDialogVisible = true
        }
      },
      // 加载权益活动规则配置
      getEquityActRule() {
        API.activity.getEquityActRuleData(this.actId).then(response => {
          if (response.data.data.length === 0) {
            this.resetRuleForm()
          } else {
            var data = response.data.data
            var ruleArr = []
            data.forEach(item => {
              var rule = {
                id: item.id,
                ruleId: item.ruleId,
                ruleName: item.ruleName,
                prodId: item.prodId,
                prodName: item.prodName,
                prodUp: String(item.prodUp),
                // maxAmout: this.ruleType === 'D' ? item.maxAmoutD : this.ruleType === 'M' ? item.maxAmoutM : item
                //   .maxAmoutW,
                // limitAmout: this.ruleType === 'D' ? item.oneAmoutD : this.ruleType === 'M' ? item.oneAmoutM : item
                //   .oneAmoutW,
                maxAmout: item.maxAmoutD ? String(item.maxAmoutD) : item.maxAmoutM ? String(item.maxAmoutM) : String(item
                  .maxAmoutW),
                limitAmout: item.oneAmoutD ? String(item.oneAmoutD) : item.oneAmoutM ? String(item.oneAmoutM) : String(item
                  .oneAmoutW),
                oneAmout: String(item.oneAmout),
                exchange: String(item.exchange),
                originalScore: String(item.originalScore || ''),
                prodStock: String(item.prodStock)
              }
              ruleArr.push(rule)
            })
            this.ruleForm.rules = ruleArr
          }
        }).catch(() => {})
      },
      // 请求规则列表数据
      getRuleTableList(page) {
        API.equityrule.getEquityRuleListData(Object.assign({
          current: page.currentPage,
          size: page.pageSize,
          ruleStatus: '2'
        }, this.ruleSearchParams)).then(response => {
          this.ruleTableData = response.data.data.records
          this.rulePage.total = response.data.data.total
        }).catch(() => {})
      },
      // 请求商品列表数据
      getProdTableList(page) {
        API.buy.getProdListData(Object.assign({
          prodStatus: 1,
          current: page.currentPage,
          size: page.pageSize
        }, this.prodSearchParams)).then(response => {
          this.prodTableData = response.data.data.records
          this.page.total = response.data.data.total
        }).catch(() => {})
      },
      // 查询
      onSearchBtn(type) {
        this.radio = ''
        if (type === 'prod') {
          this.selectProdId = ''
          this.selectProdName = ''
          this.page.currentPage = 1
          this.getProdTableList(this.page)
        } else {
          this.selectRuleId = ''
          this.selectRuleName = ''
          this.rulePage.currentPage = 1
          this.getRuleTableList(this.rulePage)
        }
      },
      // 查询重置
      onResetBtn(type) {
        this.radio = ''
        if (type === 'prod') {
          this.selectProdId = ''
          this.selectProdName = ''
          this.prodSearchParams = {
            suppName: '',
            suppChannel: this.$store.state.user.channel,
            prodName: ''
          }
          this.page.currentPage = 1
          this.getProdTableList(this.page)
        } else {
          this.selectRuleId = ''
          this.selectRuleName = ''
          this.ruleSearchParams = {
            ruleName: '',
            ruleChannel: this.$store.state.user.channel
          }
          this.rulePage.currentPage = 1
          this.getRuleTableList(this.rulePage)
        }
      },
      // 分页
      pageChange(page, type) {
        this.radio = ''
        if (type === 'prod') {
          this.selectProdId = ''
          this.selectProdName = ''
          this.page.currentPage = page.page
          this.page.pageSize = page.limit
          this.getProdTableList(this.page)
        } else {
          this.selectRuleId = ''
          this.selectRuleName = ''
          this.rulePage.currentPage = page.page
          this.rulePage.pageSize = page.limit
          this.getRuleTableList(this.rulePage)
        }
      },
      // 表格单选
      onTableSelect(index, row, type) {
        if (type === 'prod') {
          this.selectProdId = row.prodId
          this.selectProdName = row.prodName
        } else {
          this.selectRuleName = row.ruleName
          this.selectRuleId = row.ruleId
        }
      },
      handleAdd(type) {
        if (type === 'prod') {
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
        } else {
          if (!this.selectRuleName) {
            this.$message({
              message: '请选择!',
              type: 'warning'
            })
          } else {
            this.ruleForm.rules.forEach((item, index) => {
              if (this.ruleIndex === index) {
                item.ruleName = this.selectRuleName
                item.ruleId = this.selectRuleId
              }
            })
            this.ruleDialogVisible = false
          }
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
      if (this.type === 'edit' || this.type === 'detail' || this.type === 'copy') {
        this.getEquityActRule()
      }
    },
    watch: {
      type(value) {
        if (!value) {
          this.$nextTick(() => {
            this.resetRuleForm()
            this.$refs['ruleForm'].clearValidate()
          })
        } else if (value !== 'add') {
          this.getEquityActRule()
        }
      },
      // active(value) {
      //   if (value === 2 && this.type !== 'add') {
      //   }
      // },
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
      },
      ruleDialogVisible(value) {
        if (value) {
          this.getRuleTableList(this.rulePage)
        } else {
          this.radio = ''
          this.selectRuleName = ''
          this.selectRuleId = ''
          this.ruleSearchParams = {
            ruleName: '',
            ruleChannel: this.$store.state.user.channel
          }
          this.rulePage = {
            total: 0,
            currentPage: 1,
            pageSize: 10
          }
          this.ruleTableData = []
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .rule-form {
    .rule-form-row {
      display: flex;
      position: relative;
      // justify-content: space-between;

      .el-form-item {
        margin-right: 38px;

        .el-input {
          width: 120px;
        }

        // &:last-child {
        //   margin: 0;
        // }

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
        color: #FF0000;
        cursor: pointer;
      }
    }

    .rule-form-add {
      width: 72px;
      display: flex;
      align-items: center;
      color: #80A639;
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
      color: #FF0000;
      margin-bottom: 60px;
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

          /deep/ .el-input__inner {
            height: 35px;
          }
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
  .add-icon-style {
    position: absolute;
     bottom: 6px;
     right: -16px;
     cursor: pointer;
  }
</style>
