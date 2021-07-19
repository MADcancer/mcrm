<template>
  <div class="rule-form">
    <el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="140px" class="demo-dynamic" size="mini"
      label-position="right">
      <div class="rule-form-row">
        <el-form-item label="商品名称:" prop="prodName">
          <el-input :disabled="true" placeholder="请查询" v-model="ruleForm.prodName">
            <i slot="suffix" v-if="!inputDisabled" class="el-input__icon el-icon-khz" @click="proDialogVisible = true"></i>
          </el-input>
          <i v-if="!inputDisabled" class="el-icon-plus" @click="jumpPage('custgroup')"></i>
        </el-form-item>
        <el-form-item label="每人每日限购数量:" prop="oneBuyAmountD">
          <el-input :disabled="inputDisabled" placeholder="请输入" v-model="ruleForm.oneBuyAmountD"></el-input>
        </el-form-item>
        <el-form-item label="每人限购总数量:" prop="oneBuyAmount">
          <el-input :disabled="inputDisabled" placeholder="请输入" v-model="ruleForm.oneBuyAmount"></el-input>
        </el-form-item>
      </div>
      <div class="rule-form-row">
        <el-form-item label="活动商品限定数量:" prop="buyAmount">
          <el-input :disabled="inputDisabled" placeholder="请输入" v-model="ruleForm.buyAmount" @change="changeProdUp"></el-input>
        </el-form-item>
        <el-form-item label="奖品库存:" prop="buyStock">
          <el-input :disabled="true" v-model="ruleForm.buyStock"></el-input>
        </el-form-item>
      </div>
    </el-form>
    <div class="rule-form-notice" v-if="type !== 'detail'">
      <p>注：1、“每人限购总数量”≤100且为正整数；</p>
      <p>2、“活动商品限定数量”≤5000且为正整数；</p>
      <p>3、奖品库存等于活动商品限定数量减去已兑换奖品数量。</p>
    </div>
    <el-dialog class="pro-dialog" title="查询" :visible.sync="proDialogVisible" width="900px" append-to-body>
      <div>
        <div class="pro-dialog-search">
          <div class="search-input">
            <div class="search-input-item">
              <div class="search-input-label">供应商名称</div>
              <el-input placeholder="请输入供应商名称" v-model="searchParams.suppName"></el-input>
            </div>
            <div class="search-input-item">
              <div class="search-input-label">供应商渠道</div>
              <el-select v-model="searchParams.suppChannel" placeholder="请选择" disabled>
                <el-option v-for="(item,index) in $root.selectOption.channel" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </div>
            <div class="search-input-item">
              <div class="search-input-label">商品名称</div>
              <el-input placeholder="请输入商品名称" v-model="searchParams.prodName"></el-input>
            </div>
          </div>
          <div class="search-btns">
            <el-button type="primary" icon="el-icon-query" @click="onSearchBtn">查询</el-button>
            <el-button icon="el-icon-reset" @click="onResetBtn">重置</el-button>
          </div>
        </div>
        <el-table class="pro-dialog-table" :data="tableData" border :header-cell-style="{background:'#80A639',color:'#ffffff'}">
          <el-table-column label="选择" fixed width="60" align="center">
            <template slot-scope="scope">
              <el-radio v-model="radio" :label="scope.$index" @change="onTableSelect(scope.row)">&nbsp;</el-radio>
            </template>
          </el-table-column>
          <el-table-column prop="suppName" label="供应商名称" width="180" align="center">
          </el-table-column>
          <el-table-column prop="suppChannel" label="供应商渠道" align="center">
            <template slot-scope="{row}">
              <span>{{ $root.selectOption.channelObj[row.suppChannel] }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="prodName" label="商品名称" width="180" align="center">
          </el-table-column>
          <el-table-column prop="prodCnt" label="数量" align="center">
          </el-table-column>
        </el-table>
        <v-pagination :total="page.total" :currentPageNum='page.currentPage' :currentPageSize='page.pageSize'
          @pageChange="pageChange"></v-pagination>
        <div class="pro-dialog-btns">
          <el-button type="primary" @click="handleProSelect">添 加</el-button>
          <el-button @click="proDialogVisible = false">返 回</el-button>
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
      var validateAmount = (rule, value, callback) => {
        if (parseInt(value) < parseInt(this.ruleForm.oneBuyAmountD)) {
          callback(new Error('每人限购总数量不能小于每人每日限购数量!'))
        } else {
          callback()
        }
      }
      return {
        channelOptions,
        ruleForm: {
          prodName: '',
          prodId: '',
          buyStock: '',
          oneBuyAmountD: '',
          oneBuyAmount: '',
          buyAmount: ''
        },
        searchParams: {
          suppName: '',
          suppChannel: this.$store.state.user.channel,
          prodName: ''
        },
        radio: '',
        selectId: '',
        selectName: '',
        proDialogVisible: false,
        tableData: [],
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 10 // 每页显示多少条
        },
        rules: {
          prodName: [{
            required: true,
            message: '请输入',
            trigger: 'blur'
          }],
          oneBuyAmountD: [{
            pattern: /^[1-9]\d*$/,
            message: '请输入正整数',
            trigger: 'blur'
          }],
          oneBuyAmount: [{
            pattern: /^[1-9]\d*$/,
            message: '请输入正整数',
            trigger: 'blur'
          }, {
            validator(rule, value, callback) {
              if (value > 100) {
                callback(new Error('“每人限购总数量”<=100且为正整数！'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }, {
            validator: validateAmount,
            trigger: 'blur'
          }],
          buyAmount: [{
            required: true,
            message: '请输入',
            trigger: 'blur'
          }, {
            pattern: /^[1-9]\d*$/,
            message: '请输入正整数',
            trigger: 'blur'
          }, {
            validator(rule, value, callback) {
              if (value > 5000) {
                callback(new Error('“活动商品限定数量”<=5000且为正整数！'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }]
        }
      }
    },
    methods: {
      // 跳转
      jumpPage() {
        const prod = this.$router.resolve({name: 'prod'})
        window.open(prod.href, '_blank')
      },
      handleNextStep() {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            this.ruleForm.oneBuyAmountD = this.ruleForm.oneBuyAmountD ? this.ruleForm.oneBuyAmountD : this.ruleForm.buyAmount
            this.ruleForm.oneBuyAmount = this.ruleForm.oneBuyAmount ? this.ruleForm.oneBuyAmount : this.ruleForm.buyAmount
            this.$emit('handleNext', this.ruleForm)
          } else {
            return false
          }
        })
      },
      // handlePrevStep() {
      //   this.$refs['ruleForm'].clearValidate()
      // },
      // 加载商品配置
      getBuyActProd(page) {
        API.buy.getBuyActProdData({
          actId: this.actId
        }).then(response => {
          if (response.data.data.length === 0) {
            this.ruleForm = {
              prodId: '',
              prodName: '',
              buyStock: '',
              oneBuyAmountD: '',
              oneBuyAmount: '',
              buyAmount: ''
            }
          } else {
            var resData = response.data.data[0]
            this.ruleForm = {
              prodId: resData.prodId,
              prodName: resData.prodName,
              buyStock: resData.buyStock,
              oneBuyAmountD: resData.oneBuyAmountD,
              oneBuyAmount: resData.oneBuyAmount,
              buyAmount: resData.buyAmount
            }
          }
        }).catch(() => {})
      },
      // 请求商品数据
      getProTableList(page) {
        API.buy.getProdListData(Object.assign({
          prodStatus: 1,
          current: page.currentPage,
          size: page.pageSize
        }, this.searchParams)).then(response => {
          this.tableData = response.data.data.records
          this.page.total = response.data.data.total
        }).catch(() => {
          console.log('error')
        })
      },
      // 查询
      onSearchBtn() {
        this.radio = ''
        this.selectId = ''
        this.selectName = ''
        this.page.currentPage = 1
        this.getProTableList(this.page)
      },
      // 查询重置
      onResetBtn() {
        this.radio = ''
        this.selectId = ''
        this.selectName = ''
        this.searchParams = {
          groupName: '',
          suppChannel: this.$store.state.user.channel
        }
        this.page.currentPage = 1
        this.getProTableList(this.page)
      },
      // 分页
      pageChange(page) {
        this.radio = ''
        this.selectId = ''
        this.selectName = ''
        this.page.currentPage = page.page
        this.page.pageSize = page.limit
        this.getProTableList(this.page)
      },
      // 表格单选
      onTableSelect(row) {
        this.selectId = row.prodId
        this.selectName = row.prodName
      },
      handleProSelect() {
        if (!this.selectId) {
          this.$message({
            message: '请选择!',
            type: 'warning'
          })
        } else {
          this.ruleForm.prodId = this.selectId
          this.ruleForm.prodName = this.selectName
          this.proDialogVisible = false
        }
      },
      changeProdUp(val) {
        this.ruleForm.buyStock = val
      }
    },
    created() {
      if (this.type !== 'add') {
        this.getBuyActProd()
      }
    },
    watch: {
      // active(value) {
      //   if (value === 2) {
      //     if (this.type === 'edit' || this.type === 'detail') {
      //       this.getBuyActProd()
      //     }
      //   }
      // },
      type(value) {
        if (!value) {
          this.$nextTick(() => {
            this.$refs['ruleForm'].clearValidate()
            this.ruleForm = {
              prodName: '',
              prodId: '',
              buyStock: '',
              oneBuyAmountD: '',
              oneBuyAmount: '',
              buyAmount: ''
            }
          })
        } else if (value !== 'add') {
          this.getBuyActProd()
        }
      },
      proDialogVisible(value) {
        if (value) {
          this.page = {
            total: 0,
            currentPage: 1,
            pageSize: 10
          }
          this.tableData = []
          this.onResetBtn()
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .rule-form {
    .rule-form-row {
      display: flex;

      .el-form-item {
        /deep/ .el-form-item__label {
          padding-right: 10px;
        }

        .el-input {
          width: 160px;
        }

        &:nth-child(2) {
          margin: 0 60px;
        }
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

    .rule-form-notice {
      color: #FF0000;
      margin-bottom: 60px;

      p {
        margin: 0 0;
      }

      p:not(:first-child) {
        margin-left: 28px;
      }
    }
  }

  .pro-dialog {
    .pro-dialog-search {
      .search-input {
        display: flex;
        justify-content: space-around;

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

        /deep/ .el-input {
          width: 140px;

          /deep/ .el-input__inner {
            height: 34px;
          }
        }
      }

      .search-btns {
        margin: 30px 0;
        display: flex;
        justify-content: center;
      }
    }

    .pro-dialog-btns {
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

    .pro-dialog-table {
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

  /deep/ .el-form-item__content {
    position: relative;
  }
  /deep/ .el-icon-plus {
    position: absolute;
    right: -20px;
    top: 5px;
  }
</style>
