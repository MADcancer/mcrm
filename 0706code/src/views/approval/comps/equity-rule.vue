<template>
  <div class="rule">
    <el-dialog
      :title="type === 'detail' ? '权益规则管理审批详情' : '权益规则管理审批'"
      :visible.sync="dialogRuleVisible"
      width="1150px"
      :before-close="cancel"
    >
      <div v-loading="vloading" style="width: 100%">
        <div class="info">
          <div
            style="background: #FFFFFF; padding:23px 28px 0 28px; border-radius: 4px;"
          >
            <div class="inline">
              <div>
                <span>规则名称：</span>
                <el-input v-model="ruleInfo.ruleName" disabled></el-input>
              </div>
              <div>
                <span>规则渠道：</span>
                <el-input
                  v-model="$root.selectOption.channelObj[ruleInfo.ruleChannel]"
                  disabled
                ></el-input>
              </div>
              <div>
                <span>条件关系：</span>
                <el-input
                  v-model="relation[ruleInfo.relation]"
                  disabled
                ></el-input>
              </div>
            </div>
            <div
              v-for="(info, index) in ruleInfo.infoList"
              :key="index"
              class="inline target"
            >
              <div>
                <span>指标名称：</span>
                 <el-select disabled v-model="info.targetName" placeholder="请选择">
                  <el-option v-for="item in targetNameOptions" :key="item.key" :label="item.name" :value="item.key" />
                </el-select>
              </div>
              <div>
                <el-select disabled v-model="info.logicForm" placeholder="请选择">
                  <el-option v-for="item in logicOptions" :key="item.key" :label="item.name" :value="item.key" />
                </el-select>
              </div>
              <div>
                <el-input disabled v-model="info.value">
                  <template slot="append">{{ info.targetName === '1' ? '元' : info.targetName === '2' ? '星' : ''}}</template>
                </el-input>
              </div>
              <div style="padding-right: 10px">，且</div>
              <div>
                <el-select disabled v-model="info.secLogicForm" placeholder="">
                  <el-option v-for="item in logicOptions" :key="item.key" :label="item.name" :value="item.key" />
                </el-select>
              </div>
              <div>
                <el-input disabled v-model="info.secValue">
                  <template slot="append">{{ info.targetName === '1' ? '元' : info.targetName === '2' ? '星' : ''}}</template>
                </el-input>
              </div>
            </div>

            <div class="line-wrap">
              <div>
                <span style=" width: 80px; display: block;">备注：</span>
                <el-input
                  v-model="ruleInfo.note"
                  type="textarea"
                  disabled
                ></el-input>
              </div>
            </div>
          </div>
          <div class="applyInfo">
            <div>
              <span>申请人工号：</span>
              <span>{{ info.applyEmpNo }}</span>
            </div>
            <div>
              <span>申请类型：</span>
              <span>{{ applyType[info.applyType] }}</span>
            </div>
          </div>
          <div class="applyInfo" style="margin-bottom: 0">
            <div>
              <span>申请人：</span>
              <span>{{ info.applyPerson }}</span>
            </div>
            <div>
              <span>申请时间：</span>
              <span>{{ info.createDate }}</span>
            </div>
          </div>
        </div>

        <div class="operate" v-if="type !== 'detail'">
          <div style="margin-right: 20px">审批操作</div>
          <div>
            <span style="margin-right: 20px">审批状态</span>
            <div style="width: 30%">
              <el-radio-group v-model="infoForm.approveStatus" @change="changeStatus" :disabled="type==='info'">
                <el-radio label="3">同意</el-radio>
                <el-radio label="4">不同意</el-radio> 
              </el-radio-group>
            </div>
            <div style="display: flex; width: 60%">
              <el-form
                :model="infoForm"
                :rules="infoForm.approveStatus === '4' ? rules: {}"
                ref="infoForm"
                label-width="100px"
                style="width: 100%"
              >
                <el-form-item label="审批意见：" prop="approveNotes">
                  <el-input
                    v-model="infoForm.approveNotes"
                    type="textarea"
                    :rows="3"
                    maxlength="100"
                    :disabled="type==='info'"
                  ></el-input>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
        <div class="approveInfo" style="margin-bottom: 20px" v-if="type === 'info'">
          <div>
            审批人工号：<span style="padding-left: 10px">{{info.approveEmpNo}}</span>
          </div>
          <div>
            审批人：<span style="padding-left: 10px">{{info.approvePerson}}</span>
          </div>
          <div>
            审批时间：<span style="padding-left: 10px">{{info.approveTime && info.approveTime.substring(0,11)}}</span>
          </div>
        </div>
        <div
          slot="footer"
          class="dialog-footer"
          style="text-align: center; margin-top: 0px"
          v-if="type === 'edit'"
        >
          <el-button type="primary" @click="save">提交</el-button>
          <el-button @click="cancel">取消</el-button>
        </div>
      </div>
      <el-dialog
        class="notice-dialog cus-confirm"
        title="提示"
        :visible.sync="noticeDialogVisible"
        width="300px"
        append-to-body
      >
        <span>是否确认提交？</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleConfirm" :loading="loading"
            >确 认</el-button
          >
          <el-button @click="noticeDialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import API from '@/api'
export default {
  props: {
    dialogRuleVisible: {
      type: Boolean
    },
    info: {
      type: Object
    },
    type: {
      type: String
    }
  },
  watch: {
    dialogRuleVisible(value) {
      if (value) {
        // 初始化数据
        this.infoForm = {
          approveStatus: this.type === 'edit' ? '3' : this.info.approveStatus,
          approveNotes: this.type === 'edit' ? '' : this.info.approveNotes
        }

        // 获取详情
        this.vloading = true
        API.equityrule.getEquityRuleData(this.info.applyObjId).then(res => {
          var resObj = res.data.data
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
          this.ruleInfo = Object.assign(res.data.data, { infoList: targetArr })
          this.vloading = false
          console.log(this.ruleInfo)
        }).catch(() => {
          this.vloading = false
        })
        // 移除所有表单项的校验
        this.$nextTick(() => {
          if (this.$refs['infoForm']) {
            this.$refs['infoForm'].clearValidate()
          }
        })
      }
    }
  },
  data() {
    return {
      ruleInfo: {},
      applyType: [
        '',
        '积分冻结',
        '积分解冻',
        '积分调增',
        '积分调减',
        '移入黑名单',
        '移出黑名单',
        '新增',
        '修改',
        '删除'
      ],
      targetNameOptions: [{
        key: '1',
        name: '金融资产'
      }, {
        key: '2',
        name: '客户等级'
      }],
      logicOptions: [{
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
      }],
      slideshowStatus: ['', '草稿', '已审批', '下线', '上线', '待审批', '驳回', '已结束'],
      actStatus: ['', '草稿', '同意', '下线', '上线', '待审批', '驳回', '已结束'],
      relation: ['', '全部满足', '满足一个'],
      // targetName: ['', '客户金融资产', '客户类型', '交易金额', '交易笔数'],
      // logicForm: ['', '大于', '小于', '大于等于', '小于等于', '等于'],
      infoForm: {
        approveStatus: '3',
        approveNotes: ''
      },
      rules: {
        approveNotes: [
          { required: true, message: '请填写审批意见', trigger: 'blur' }
        ]
      },
      loading: false,
      vloading: false,
      noticeDialogVisible: false
    }
  },
  methods: {
    changeStatus() {
      if (this.$refs['infoForm']) {
        this.$refs['infoForm'].clearValidate()
      }
    },
    save() {
      this.$refs['infoForm'].validate(valid => {
        if (!valid) {
          return false
        }
        this.noticeDialogVisible = true
      })
    },
    handleConfirm() {
      this.loading = true
      API.home
        .approveOperation(
          Object.assign(this.infoForm, {
            id: this.info.id,
            approveEmpNo: this.$store.state.user.id,
            approvePerson: this.$store.state.user.name
          })
        )
        .then(res => {
          this.loading = false
          this.$message.success('操作成功！')
          this.noticeDialogVisible = false
          this.cancel()
        })
        .catch((error) => {
          this.loading = false
          this.noticeDialogVisible = false
          this.$message.error(error.msg)
        })
    },
    cancel() {
      this.$emit('cancel', { idx: 6 })
    }
  }
}
</script>

<style lang="scss" scoped>
.rule {
  /deep/ .el-dialog__body {
    padding: 15px 23px;
  }
  .info {
    background: #fafafa;
    border-radius: 10px;
    padding: 24px 30px;
    .inline {
      display: flex;
      // flex-wrap: wrap;
      > div {
        // width: 33%;
        display: flex;
        align-items: center;
        padding-bottom: 15px;
        span {
          width: 80px;
          display: block;
        }
      }
      > div:nth-child(3n) {
        justify-content: flex-end;
      }
      > div:nth-child(3n + 2) {
        justify-content: center;
      }
    }
    .line-wrap {
      > div {
        display: flex;
        align-items: center;
        // justify-content: center;
        padding-bottom: 20px;
      }
      /deep/ .el-textarea {
        width: 90%;
      }
    }
    .applyInfo {
      display: flex;
      margin: 24px;
      > div:nth-child(1) {
        width: 300px;
      }
    }
  }
  .operate {
    margin-top: 20px;
    > div:nth-child(1) {
      color: #333333;
      font-weight: bold;
      padding-bottom: 22px;
    }
    > div:nth-child(2) {
      display: flex;
    }
  }
  .approveInfo {
    display: flex;
    >div {
      width: 33%;
    }
  }
  /deep/ .el-input {
    width: 200px;
    margin-right: 10px;
  }
  .target {
    /deep/ .el-input {
      width: 160px;
    }
  }
}
</style>
