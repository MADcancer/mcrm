<template>
  <div class="subject-act">
    <el-dialog
      :title="type === 'detail' ? '主题活动管理审批详情' : '主题活动管理审批'" 
      :visible.sync="dialogSubjectVisible"
      width="1200px"
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
                title="商品配置"
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
                <span>主题名称：</span>
                <el-input v-model="actInfo.subName" disabled></el-input>
              </div>
              <div>
                <span>主题渠道：</span>
                <el-input
                  v-model="$root.selectOption.channelObj[actInfo.actChannel]"
                  disabled
                ></el-input>
              </div>
              <div>
                <span>活动名称：</span>
                <el-input v-model="actInfo.actName" disabled></el-input>
              </div>
              <div>
                <span>抢购一次资格所需积分：</span>
                <el-input v-model="actInfo.buyScore" disabled></el-input>
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
                <span>抢购开始时间：</span>
                <el-input v-model="actInfo.timeBuyBg" disabled></el-input>
              </div>
              <div>
                <span>抢购结束时间：</span>
                <el-input v-model="actInfo.timeBuyEnd" disabled></el-input> 
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
                <span>原积分：</span>
                <el-input v-model="actInfo.originalScore" disabled></el-input>
              </div>
            </div>
            <div class="line-wrap" v-if="step === 1">
              <div>
                <span style="width: 160px; display: block">备注：</span>
                <el-input
                  v-model="actInfo.actNotes"
                  type="textarea"
                  disabled
                  :rows="3"
                ></el-input>
              </div>
            </div>

            <div class="inline2" v-if="step === 2">
              <div v-for="(product, idex) in products" :key="idex">
                <div class="inline-info">
                  <div>
                    <span>商品名称：</span>
                    <el-input v-model="product.prodName" disabled></el-input>
                  </div>
                  <div>
                    <span>每人每日限购数量：</span>
                    <el-input v-model="product.oneBuyAmountD" disabled></el-input>
                  </div>
                  <div>
                    <span>每人限购总数量：</span>
                    <el-input v-model="product.oneBuyAmount" disabled></el-input>
                  </div>
                </div>
                <div class="inline-info">
                  <div>
                    <span>活动商品限定数量：</span>
                    <el-input v-model="product.buyAmount" disabled></el-input>
                  </div>
                  <div>
                    <span>奖品库存：</span>
                    <el-input v-model="product.buyStock" disabled></el-input>
                  </div>
                  <!-- 占位 -->
                  <div style="visibility: hidden;">
                    <span>奖品库存：</span>
                    <el-input v-model="product.buyStock" disabled></el-input>
                  </div>
                </div>
              </div>
            </div>

            <div class="inline3" v-if="step === 3">
              <div>
                <span>列表浏览标题：</span>
                <el-input v-model="actInfo.actHead" disabled></el-input>
              </div>
              <div>
                <span>列表浏览副标题：</span>
                <el-input v-model="actInfo.actSubHead" disabled></el-input>
              </div>
              <div>
                <span>活动细则：</span>
                <el-input type="textarea" :rows="8" v-model="actInfo.actRules" disabled></el-input>
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
    dialogSubjectVisible: {
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
    dialogSubjectVisible(value) {
      if (value) {
        // 初始化数据
        this.infoForm = {
          approveStatus: this.type === 'edit' ? '3' : this.info.approveStatus,
          approveNotes: this.type === 'edit' ? '' : this.info.approveNotes
        }

        // 获取详情
        this.vloading = true
        API.buy
          .getBuyActBaseData({
            actId: this.info.applyObjId
          })
          .then(response => {
            this.actInfo = response.data.data
          })
          .catch(() => {
            this.vloading = false
          })
        API.buy.getBuyActProdData({ actId: this.info.applyObjId }).then(res => {
          this.products = res.data.data
          this.vloading = false
        }).catch(() => {
          this.vloading = true
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
      actInfo: {},
      products: [],
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
      noticeDialogVisible: false
    }
  },
  methods: {
    changeStatus() {
      if (this.$refs['infoForm']) {
        this.$refs['infoForm'].clearValidate()
      }
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
      this.$emit('cancel', { idx: 11 })
      setTimeout(() => {
        this.step = 1
      }, 350)
    }
  }
}
</script>

<style lang="scss" scoped>
.subject-act {
  /deep/ .el-dialog__body {
    padding: 15px 23px;
  }
  .step:hover {
    cursor: pointer;
  }
  /deep/ .el-step {
    width: 20%;
    max-width: unset !important;
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
        padding-bottom: 15px;
        span {
          display: block;
          width: 160px;
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
          width: 140px;
        }
        >div {
          display: flex;
        }
      }
    }
    .inline3 {
      /deep/ .el-input, /deep/ .el-textarea {
        width: 400px;
      }
      > div {
        margin-bottom: 23px;
        justify-content: center;
        display: flex;
      }
      .img {
        /deep/ .el-input {
          width: 340px;
        }
      }
      span {
        width: 115px;
        display: inline-block;
        text-align: left;
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
    width: 60%;
  }
}
</style>
