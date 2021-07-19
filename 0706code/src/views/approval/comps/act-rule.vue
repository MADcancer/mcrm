<template>
  <div class="act-rule">
    <el-dialog
      :title="type === 'detail' ? '权益活动管理审批详情' : '权益活动管理审批'"  
      :visible.sync="dialogActVisible"
      width="1250px"
      :before-close="cancel"
    >
      <div style="width: 100%" v-loading="vloading">
        <div class="info">
          <div
            style="background: #FFFFFF; padding:23px 28px 0 28px;border-radius: 4px"
          >
            <el-steps
              :space="100"
              :active="step"
              align-center
              style="width:100%"
            >
              <el-step
                title="基本信息"
                @click.native="clickStep(1)"
                :class="['step', step !== 1 ? 'unfinish' : '']"
              ></el-step>
              <el-step
                title="规则配置"
                @click.native="clickStep(2)"
                :class="['step', step !== 2 ? 'unfinish' : '']"
              ></el-step>
              <el-step
                title="模板配置"
                @click.native="clickStep(3)"
                :class="['step', step !== 3 ? 'unfinish' : '']"
              ></el-step>
            </el-steps>
            <div class="inline" v-if="step === 1">
              <div>
                <span>活动名称：</span>
                <el-input v-model="actInfo.actName" disabled></el-input>
              </div>
              <div>
                <span>活动渠道：</span>
                <el-input
                  v-model="$root.selectOption.channelObj[actInfo.actChannel]"
                  disabled
                ></el-input>
              </div>
              <div>
                <span>活动开始时间：</span>
                <el-input v-model="actInfo.actBegtime" disabled></el-input>
              </div>
              <div>
                <span>活动结束时间：</span>
                <el-input v-model="actInfo.actEndtime" disabled></el-input>
              </div>
              <div>
                <span>参与活动对象：</span>
                <el-input v-model="custType[actInfo.custType]" disabled></el-input>
              </div>
              <div v-if="actInfo.custType === '1'">
                <span>参与活动客户组：</span>
                <el-input v-model="actInfo.custGroupName" disabled></el-input>
              </div>
              <div v-if="actInfo.custType === '2'">
                <span>机构：</span>
                <el-tooltip class="item" effect="dark" :content="actInfo.orgName" placement="top-start">
                  <el-input v-model="actInfo.orgName" disabled></el-input>
                </el-tooltip>
              </div>
              <div>
                <span>活动目标：</span>
                <el-input v-model="actTarget[actInfo.actTarget]" disabled></el-input>
              </div>
              <div>
                <span>活动频率：</span>
                <el-input v-model="actRate[actInfo.actRate]" disabled></el-input>
              </div>
              <div>
                <span>每次具体时间：</span>
                <el-input v-model="actInfo.actTime" disabled></el-input>
              </div>
              <div>
                <span>每人兑换上限：</span>
                <el-input v-model="actInfo.actMaxAmout" disabled></el-input>
              </div>
              <div>
                <span>活动顺序：</span>
                <el-input v-model="actInfo.sort" disabled></el-input>
              </div>
            </div>
            <div class="line-wrap" v-if="step === 1">
              <div>
                <span style="width: 130px; display: block">备注：</span>
                <el-input
                  v-model="actInfo.note"
                  type="textarea"
                  disabled
                  :rows="3"
                ></el-input>
              </div>
            </div>

            <div class="inline2" v-if="step === 2">
              <div v-for="(rule, idex) in actRules" :key="idex">
                <div class="inline-info">
                  <div>
                    <span>规则名称：</span>
                    <el-input v-model="rule.ruleName" disabled></el-input>
                  </div>
                  <div>
                    <span>权益奖励：</span>
                    <el-input v-model="rule.prodName" disabled></el-input>
                  </div>
                  <div>
                    <span>奖品发放上限：</span>
                    <el-input v-model="rule.prodUp" disabled></el-input>
                  </div>
                  <div>
                    <span>奖品库存:</span>
                    <el-input v-model="rule.prodStock" disabled></el-input>
                  </div>
                </div>
                <div class="inline-info">
                  <div style="display: flex">
                    <span>{{ rule.title }}</span>
                    <el-input v-model="rule.amount" disabled></el-input>
                  </div>
                  <div>
                    <span>{{ rule.oneAmoutTitle }}</span>
                    <el-input v-model="rule.limitAmout" disabled></el-input>
                  </div>
                  <div>
                    <span>每人限购总数量：</span>
                    <el-input v-model="rule.oneAmout" disabled></el-input>
                  </div>
                  <div>
                    <span>兑换积分：</span>
                    <el-input v-model="rule.exchange" disabled></el-input>
                  </div>
                </div>
                <div class="inline-info">
                  <div style="display: flex">
                    <span>原积分：</span>
                    <el-input v-model="rule.originalScore" disabled></el-input>
                  </div>
                </div>
              </div>
            </div>

            <div class="inline3" v-if="step === 3">
              <div>
                <span>活动标题文字：</span>
                <el-input v-model="actInfo.actHead" disabled></el-input>
              </div>
              <div>
                <span>副标题文字：</span>
                <el-input v-model="actInfo.actsubhead" disabled></el-input>
              </div>
              <div>
                <span>活动细则：</span>
                <!-- <el-input v-model="actInfo.actRules" disabled></el-input> -->
                <el-input type="textarea" :rows="8" v-model="actInfo.actRules" disabled></el-input>
              </div>
              <div class="img">
                <span>活动图片：</span>
                <el-input v-model="actInfo.pictureName" disabled></el-input>
                <!-- pictureUrl -->
                <el-button type="primary" size="mini" @click="imgShow = true">预览</el-button>
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
          <div class="applyInfo" style=" margin-bottom: 0">
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
          <div>审批操作</div>
          <div>
            <span style="margin-right: 20px">审批状态</span>
            <div style="width: 30%; display: block;">
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
      <!-- 预览 图片 -->
      <el-dialog
        class="notice-dialog"
        title="活动图片"
        :visible.sync="imgShow"
        width="800px"
        append-to-body
      >
        <img :src='`${baseUrl}/${actInfo.pictureUrl}`' style="width: 500px" />
        <!-- <img src="~@/assets/img/test.jpg" style="width: 400px" /> -->
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import API from '@/api'
import { baseUrl } from '@/utils'
export default {
  props: {
    dialogActVisible: {
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
    dialogActVisible(value) {
      if (value) {
        // 初始化数据
        this.infoForm = {
          approveStatus: this.type === 'edit' ? '3' : this.info.approveStatus,
          approveNotes: this.type === 'edit' ? '' : this.info.approveNotes
        }

        // 获取详情
        this.vloading = true
        API.activity.getEquityActBaseData(this.info.applyObjId).then(res => {
          let data = res.data.data
          this.getEquityActRuleData(data.actRate)
          switch (data.actRate) {
            case 'M':
              data.actTime =
                '每月' +
                data.dateM +
                '日' +
                data.beginTimeD +
                '~' +
                data.endTimeD
              break
            case 'W':
              data.actTime =
                '每周' +
                this.weekday[data.dateW] +
                data.beginTimeD +
                '~' +
                data.endTimeD
              break
            case 'D':
              data.actTime = '每日' + data.beginTimeD + '~' + data.endTimeD
              break
          }
          this.actInfo = data
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
      baseUrl: baseUrl(),
      actInfo: {},
      actRules: [],
      weekday: ['', '一', '二', '三', '四', '五', '六', '日'],
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
      custType: ['无限制', '客户组', '机构'],
      actTarget: ['', '新客获取', '老客户营销', '流失客户挽留', '睡眠客户激活'],
      actRate: {'D': '每日一次', 'W': '每周一次', 'M': '每月一次'},
      step: 1,
      // actStatus: ['', '草稿', '待审批', '下线', '上线', '已审批'],
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
      noticeDialogVisible: false,
      imgShow: false
    }
  },
  methods: {
    changeStatus() {
      if (this.$refs['infoForm']) {
        this.$refs['infoForm'].clearValidate()
      }
    },
    getEquityActRuleData(actRate) {
      API.activity.getEquityActRuleData(this.info.applyObjId).then(res => {
        res.data.data.forEach(data => {
          switch (actRate) {
            case 'M':
              data.title = '每月发放最大数量：'
              data.oneAmoutTitle = '每人每月限购数量：'
              data.amount = data.maxAmoutM
              data.limitAmout = data.oneAmoutM
              break
            case 'W':
              data.title = '每周发放最大数量：'
              data.oneAmoutTitle = '每人每周限购数量：'
              data.amount = data.maxAmoutW
              data.limitAmout = data.oneAmoutW
              break
            case 'D':
              data.title = '每日发放最大数量：'
              data.oneAmoutTitle = '每人每日限购数量：'
              data.amount = data.maxAmoutD
              data.limitAmout = data.oneAmoutD
              break
          }
        })
        this.actRules = res.data.data
        this.vloading = false
      }).catch(() => {
        this.vloading = false
      })
    },
    clickStep(val) {
      this.step = val
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
      this.$emit('cancel', { idx: 7 })
      setTimeout(() => {
        this.step = 1
      }, 350)
    }
  }
}
</script>

<style lang="scss" scoped>
.act-rule {
  /deep/ .el-dialog__body {
    padding: 15px 23px;
  }
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
  .info {
    background: #fafafa;
    padding: 24px 30px;
    border-radius: 10px;
    .inline {
      display: flex;
      flex-wrap: wrap;
      > div {
        width: 50%;
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        span {
          width: 130px;
          display: block;
        }
      }
      > div:nth-child(2n) {
        justify-content: flex-end;
      }
    }
    .inline2 {
      .inline-info {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
        span {
          display: block;
          width: 130px;
        }
        > div {
          display: flex;
        }
      }
      /deep/ .el-input {
        width: 140px;
      }
    }
    .inline3 {
      /deep/ .el-input, /deep/ .el-textarea {
        width: 400px;
      }
      > div {
        margin-bottom: 23px;
        display: flex;
        justify-content: center;
      }
      .img {
        /deep/ .el-input {
          width: 340px;
        }
      }
      span {
        width: 100px;
        display: inline-block;
        text-align: left;
      }
    }
    .line-wrap {
      > div {
        display: flex;
        align-items: center;
        // justify-content: center;
        padding-bottom: 15px;
      }
      /deep/ .el-textarea {
        width: 86%;
      }
    }
    .applyInfo {
      display: flex;
      margin: 24px 0;
      > div:nth-child(1) {
        width: 300px;
      }
    }
  }
  .approveInfo {
    display: flex;
    >div {
      width: 33%;
    }
  }
  .operate {
    margin-top: 20px;
    margin-left: 24px;
    > div:nth-child(1) {
      color: #333333;
      font-weight: bold;
      padding-bottom: 22px;
    }
    > div:nth-child(2) {
      display: flex;
    }
  }
  /deep/ .el-input {
    width: 50%;
  }
}
</style>
