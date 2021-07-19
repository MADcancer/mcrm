<template>
  <div class="rule-dialog">
    <el-dialog :title="type === 'add' ? '创建权益规则' : type === 'edit' ? '修改权益规则' : '权益规则详情'" :visible.sync="dialogVisible"
      width="1200px" :before-close="handleClose">
      <div v-loading="waitLoading">
        <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" class="rule-dialog-form" size="mini">
          <div class="rule-form-row">
            <div class="rule-form-item">
              <div class="item-label">规则名称:</div>
              <el-form-item prop="ruleName" :rules="[{ required: true, message: '请输入', trigger: 'blur' }, { max: 50, message: '长度限制50字符内', trigger: 'blur' }]">
                <el-input placeholder="请输入规则名称"  maxlength="50" :disabled="type === 'edit' || type === 'detail' ? true : false" v-model="dynamicValidateForm.ruleName"></el-input>
              </el-form-item>
            </div>
            <div class="rule-form-item">
              <div class="item-label">规则渠道:</div>
              <el-form-item prop="ruleChannel" :rules="{ required: true, message: '请选择', trigger: 'change' }">
                <el-select disabled v-model="dynamicValidateForm.ruleChannel"
                  placeholder="请选择">
                  <el-option v-for="(item,index) in $root.selectOption.channel" :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="rule-form-item">
              <div class="item-label">条件关系:</div>
              <el-form-item prop="relation" :rules="{ required: true, message: '请选择', trigger: 'change' }">
                <el-select :disabled="type === 'detail' ? true : false" v-model="dynamicValidateForm.relation"
                  placeholder="请选择">
                  <el-option v-for="item in relationOptions" :key="item.key" :label="item.name" :value="item.key" />
                </el-select>
              </el-form-item>
            </div>
          </div>
          <div class="rule-form-row" v-for="(item, index) in dynamicValidateForm.targets" :key="item.key">
            <div class="rule-form-item">
              <div class="item-label">指标名称:</div>
              <el-form-item :prop="'targets.' + index + '.targetName'" :rules="{ required: true, message: '请选择', trigger: 'change' }">
                <el-select :disabled="type === 'detail' ? true : false" v-model="item.targetName" placeholder="请选择">
                  <el-option v-for="item in targetNameOptions" :key="item.key" :label="item.name" :value="item.key" />
                </el-select>
              </el-form-item>
            </div>
            <div class="rule-form-item">
              <el-form-item :prop="'targets.' + index + '.logicForm'" :rules="{ required: true, message: '请选择', trigger: 'change' }">
                <el-select :disabled="type === 'detail' ? true : false" v-model="item.logicForm" placeholder="请选择">
                  <el-option v-for="item in logicOptions" :key="item.key" :label="item.name" :value="item.key" />
                </el-select>
              </el-form-item>
            </div>
            <div class="rule-form-item">
              <el-form-item :prop="'targets.' + index + '.value'" :rules="[{ required: true, message: '请输入', trigger: 'blur' }, { pattern: /^[0-9]\d*$/, message: '请输入正整数', trigger: ['blur', 'change'] }, { max: 8, message: '长度限制8字符内', trigger: 'blur' }, { validator: (rule, value, callback) => checkValue(rule, value, callback, item), trigger: 'blur' }]">
                <el-input placeholder="请输入" :disabled="type === 'detail' ? true : false"  maxlength="8" v-model="item.value">
                  <template slot="append">{{ item.targetName === '1' ? '元' : item.targetName === '2' ? '星' : ''}}</template>
                </el-input>
              </el-form-item>
            </div>
            <div style="marginRight: 15px;">，且</div>
            <div class="rule-form-item">
              <el-form-item :prop="'targets.' + index + '.secLogicForm'">
                <el-select :disabled="type === 'detail' ? true : false" v-model="item.secLogicForm" placeholder="请选择">
                  <el-option v-for="item in logicOptions" :key="item.key" :label="item.name" :value="item.key" />
                </el-select>
              </el-form-item>
            </div>
            <div class="rule-form-item">
              <el-form-item :prop="'targets.' + index + '.secValue'" :rules="[{ pattern: /^[1-9]\d*$/, message: '请输入正整数', trigger: ['blur', 'change'] }, { max: 8, message: '长度限制8字符内', trigger: 'blur' }]">
                <el-input placeholder="请输入" :disabled="type === 'detail' ? true : false"  maxlength="8" v-model="item.secValue">
                  <template slot="append">{{ item.targetName === '1' ? '元' : item.targetName === '2' ? '星' : ''}}</template>
                </el-input>
              </el-form-item>
            </div>
            <div class="rule-form-item" v-if="index !== 0 && type !== 'detail'">
              <i class="el-icon-remove" @click.prevent="removeTarget(item)"></i>
            </div>
            <div class="rule-form-item" v-else>
              <div style="width: 20px;"></div>
            </div>
          </div>
          <div class="rule-dialog-add" v-if="type === 'detail' ? false : true" @click="addTarget">
            <i class="el-icon-tjzb"></i>
            <span>添加指标</span>
          </div>
          <div class="rule-form-row">
            <div class="rule-form-item">
              <div class="item-label" style="height: 100%;">备注:</div>
              <el-form-item class="rule-dialog-note" prop="note" :rules="{ min: 0, max: 100, message: '长度限制100字符内', trigger: 'blur' }">
                <el-input :disabled="type === 'detail' ? true : false"  maxlength="100" type="textarea" :rows="3" placeholder="请输入"
                  v-model="dynamicValidateForm.note"></el-input>
              </el-form-item>
            </div>
          </div>
        </el-form>
        <div class="rule-dialog-notice" v-if="type === 'detail' ? false : true">注：规则指标最多添加5个。</div>
        <div class="rule-dialog-btns" v-if="type === 'detail' ? false : true">
          <el-button :disabled="btnStatus" :loading="btnStatus && ruleStatus === 'save'" @click="handleSubmit('save')">保存</el-button>
          <el-button :disabled="btnStatus" :loading="btnStatus && ruleStatus === 'submit'" type="primary" @click="handleSubmit('submit')">提交</el-button>
          <el-button :disabled="btnStatus" @click="handleClose">取消</el-button>
        </div>
      </div>
      <el-dialog class="notice-dialog" title="提示" :visible.sync="noticeDialogVisible" width="360px" append-to-body>
        <span>是否确认提交？</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleConfirm">确 认</el-button>
          <el-button @click="noticeDialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </el-dialog>
  </div>
</template>
<script>
  import API from '@/api'
  const ruleChannelOptions = [{
    key: '1',
    name: '财富'
  }, {
    key: '2',
    name: '直销'
  }, {
    key: '3',
    name: '信用卡'
  }]
  const relationOptions = [{
    key: '1',
    name: '全部满足'
  }, {
    key: '2',
    name: '满足一个'
  }]
  const targetNameOptions = [{
    key: '1',
    name: '金融资产'
  }, {
    key: '2',
    name: '客户等级'
  }]
  const logicOptions = [{
    key: '1',
    name: '>'
  }, {
    key: '2',
    name: '<'
  }, {
    key: '3',
    name: '≥'
  }, {
    key: '4',
    name: '≤'
  }, {
    key: '5',
    name: '='
  }]
  export default {
    props: {
      // 客户号
      ruleId: {
        type: String
      },
      type: {
        type: String
      },
      // 弹框显隐
      dialogVisible: {
        type: Boolean
      }
    },
    data() {
      var checkValue = (rule, value, callback, item) => {
        if (item.targetName === '2') {
          if (value < 0 || value > 6) {
            callback(new Error('等级最高6星！'))
          } else {
            callback()
          }
        } else if (item.targetName === '1') {
          if (value === '0') {
            callback(new Error('请输入大于0正整数！'))
          } else {
            callback()
          }
        } else {
          callback(new Error('请选择指标名称！'))
        }
      }
      return {
        checkValue,
        waitLoading: false,
        ruleChannelOptions,
        relationOptions,
        targetNameOptions,
        logicOptions,
        dynamicValidateForm: {
          ruleName: '',
          ruleChannel: this.$store.state.user.channel,
          relation: '',
          note: '',
          targets: [{
            targetName: '',
            logicForm: '',
            value: '',
            secLogicForm: '',
            secValue: ''
          }]
        },
        noticeDialogVisible: false,
        ruleStatus: '',
        targetsNum: 0,
        btnStatus: false
      }
    },
    methods: {
      handleClose() {
        this.$refs['dynamicValidateForm'].resetFields()
        this.$emit('onCancel')
      },
      handleSubmit(status) {
        this.ruleStatus = status
        this.$refs['dynamicValidateForm'].validate((valid) => {
          if (valid) {
            if (status === 'submit') {
              this.noticeDialogVisible = true
            } else {
              this.handleConfirm()
            }
          } else {
            return false
          }
        })
      },
      handleConfirm() {
        this.dynamicValidateForm.ruleStatus = this.ruleStatus === 'save' ? '1' : '5'
        var obj = this.dynamicValidateForm
        var newObj = {}
        Object.keys(obj).forEach((key) => {
          if (key !== 'targets') {
            newObj[key] = obj[key]
          } else {
            obj[key].forEach((item, index) => {
              Object.keys(item).forEach((tkey) => {
                newObj[tkey + (parseInt(index) + 1)] = item[tkey]
              })
            })
          }
        })
        this.btnStatus = true
        this.$emit('handleConfirm', newObj)
        this.noticeDialogVisible = false
      },
      removeTarget(item) {
        var index = this.dynamicValidateForm.targets.indexOf(item)
        if (index !== -1) {
          this.dynamicValidateForm.targets.splice(index, 1)
        }
      },
      addTarget() {
        if (this.dynamicValidateForm.targets.length < 5) {
          this.dynamicValidateForm.targets.push({
            targetName: '',
            logicForm: '',
            value: '',
            secLogicForm: '',
            secValue: ''
          })
        } else {
          this.$message({
            message: '规则指标最多添加5个。',
            type: 'warning'
          })
        }
      },
      // 加载权益规则
      getEquityRule() {
        this.waitLoading = true
        API.equityrule.getEquityRuleData(this.ruleId).then(response => {
          var resObj = response.data.data
          var targetArr = []
          Object.keys(resObj).forEach((key) => {
            if (key === 'targetName1' && resObj['targetName1']) {
              targetArr.push({
                targetName: resObj.targetName1,
                logicForm: resObj.logicForm1,
                value: resObj.value1 || resObj.value1 === 0 ? String(resObj.value1) : '',
                secLogicForm: resObj.secLogicForm1,
                secValue: resObj.secValue1 || resObj.secValue1 === 0 ? String(resObj.secValue1) : ''
              })
            } else if (key === 'targetName2' && resObj['targetName2']) {
              targetArr.push({
                targetName: resObj.targetName2,
                logicForm: resObj.logicForm2,
                value: resObj.value2 || resObj.value2 === 0 ? String(resObj.value2) : '',
                secLogicForm: resObj.secLogicForm2,
                secValue: resObj.secValue2 || resObj.secValue2 === 0 ? String(resObj.secValue2) : ''
              })
            } else if (key === 'targetName3' && resObj['targetName3']) {
              targetArr.push({
                targetName: resObj.targetName3,
                logicForm: resObj.logicForm3,
                value: resObj.value3 || resObj.value3 === 0 ? String(resObj.value3) : '',
                secLogicForm: resObj.secLogicForm3,
                secValue: resObj.secValue3 || resObj.secValue3 === 0 ? String(resObj.secValue3) : ''
              })
            } else if (key === 'targetName4' && resObj['targetName4']) {
              targetArr.push({
                targetName: resObj.targetName4,
                logicForm: resObj.logicForm4,
                value: resObj.value4 || resObj.value4 === 0 ? String(resObj.value4) : '',
                secLogicForm: resObj.secLogicForm4,
                secValue: resObj.secValue4 || resObj.secValue4 === 0 ? String(resObj.secValue4) : ''
              })
            } else if (key === 'targetName5' && resObj['targetName5']) {
              targetArr.push({
                targetName: resObj.targetName5,
                logicForm: resObj.logicForm5,
                value: resObj.value5 || resObj.value5 === 0 ? String(resObj.value5) : '',
                secLogicForm: resObj.secLogicForm5,
                secValue: resObj.secValue5 || resObj.secValue5 === 0 ? String(resObj.secValue5) : ''
              })
            }
          })
          this.dynamicValidateForm = {
            ruleName: resObj.ruleName,
            ruleChannel: resObj.ruleChannel,
            relation: resObj.relation,
            note: resObj.note,
            targets: targetArr
          }
          console.log(this.dynamicValidateForm.targets)
          this.waitLoading = false
        }).catch(() => {
          this.waitLoading = false
        })
      }
    },
    watch: {
      dialogVisible(value) {
        if (value) {
          if (this.type === 'edit' || this.type === 'detail') {
            this.getEquityRule()
          }
        } else {
          this.dynamicValidateForm = {
            ruleName: '',
            ruleChannel: this.$store.state.user.channel,
            relation: '',
            note: '',
            targets: [{
              targetName: '',
              logicForm: '',
              value: '',
              secLogicForm: '',
              secValue: ''
            }]
          }
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .rule-dialog {
    .rule-dialog-form {
      .rule-form-row {
        display: flex;

        .rule-form-item {
          display: flex;
          align-items: center;
          margin-bottom: 20px;

          .item-label {
            width: 80px;
          }

          /deep/ .el-form-item {
            margin: 0 15px 0 0;
          }
        }
      }
    }

    /deep/ .el-input__icon {
      line-height: 26px;
    }

    /deep/ .el-form-item__label {
      line-height: 26px;
      padding: 0 30px 0 0;
    }

    /deep/ .el-form-item__content {
      line-height: 26px;
    }

    /deep/ .el-input {
      width: 170px;

      /deep/ .el-input__inner {
        // width: 212px;
        height: 26px;
      }
    }

    /deep/ .el-textarea__inner {
      width: 954px;
    }

    /deep/ .el-input-group__append {
      width: 36px;
      padding: 0 10px;
    }

    .rule-dialog-add {
      width: 72px;
      display: flex;
      align-items: center;
      color: #80A639;
      cursor: pointer;
      margin-bottom: 20px;

      /deep/ .el-icon-tjzb {
        width: 11px;
        height: 11px;
        background: url(./../imgs/tjzb.png) center no-repeat;
        background-size: cover;
        margin-right: 5px;
      }
    }

    .el-icon-remove {
      font-size: 20px;
      line-height: 26px;
      color: #FF0000;
      cursor: pointer;
      margin-left: 5px;
    }

    .rule-dialog-note {
      margin: 25px 0 21px 0;
    }

    .rule-dialog-notice {
      color: #FF0000;
      margin-bottom: 60px;
    }

    .rule-dialog-btns {
      display: flex;
      justify-content: center;
    }
  }

  .notice-dialog {
    /deep/ .el-dialog__header {
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      background-color: #80A639;

      .el-dialog__title,
      .el-dialog__close {
        color: #ffffff
      }
    }

    /deep/ .el-dialog__body {
      font-size: 20px;
      color: #000000;
    }
  }
</style>
