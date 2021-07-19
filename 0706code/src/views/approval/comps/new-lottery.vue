<template>
  <div class="lottery-act">
    <el-dialog
      :title="type === 'detail' ? '奖池活动管理审批详情' : '奖池活动管理审批'" 
      :visible.sync="dialogLotteryVisible"
      width="1150px"
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
                title="奖品配置"
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
                <el-input v-model="lotteryInfo.actName" disabled></el-input>
              </div>
              <div>
                <span>活动渠道：</span>
                <el-input
                  v-model="$root.selectOption.channelObj[lotteryInfo.actChannel]"
                  disabled
                ></el-input>
              </div>
              <div>
                <span>活动开始时间：</span>
                <el-input v-model="lotteryInfo.actBegtime" disabled></el-input>
              </div>
              <div>
                <span>活动结束时间：</span>
                <el-input v-model="lotteryInfo.actEndtime" disabled></el-input>
              </div>
              <div>
                <span>开奖时间：</span>
                <el-input v-model="lotteryInfo.lotterTime" disabled></el-input>
              </div>
              <div>
                <span>发布时间：</span>
                <el-input v-model="lotteryInfo.releaseTime" disabled></el-input>
              </div>
              <div>
                <span>参与活动对象：</span>
                <el-input v-model="custType[lotteryInfo.custType]" disabled></el-input>
              </div>
              <div>
                <span>是否允许不同奖品的重复获奖：</span>
                <el-input v-model="lotTemplate[lotteryInfo.lotTemplate]" disabled></el-input>
              </div>
              <div v-if="lotteryInfo.custType === '1'">
                <span>参与活动客户组：</span>
                <el-input v-model="lotteryInfo.custGroupName" disabled></el-input>
              </div>
              <div v-if="lotteryInfo.custType === '2'">
                <span>机构：</span>
                <el-tooltip class="item" effect="dark" :content="lotteryInfo.orgName" placement="top-start">
                  <el-input v-model="lotteryInfo.orgName" disabled></el-input>
                </el-tooltip>
              </div>
              <div>
                <span>抽奖一次资格所需积分：</span>
                <el-input v-model="lotteryInfo.lotoneScore" disabled></el-input>
              </div>
              <div>
                <span>原积分：</span>
                <el-input v-model="lotteryInfo.originalScore" disabled></el-input>
              </div>
              <div>
                <span>每人抽奖次数上限：</span>
                <el-input v-model="lotteryInfo.oneLotimeD" disabled></el-input>
              </div>
              <div>
                <span>活动顺序：</span>
                <el-input v-model="lotteryInfo.sort" disabled></el-input>
              </div>
            </div>
            <div class="line-wrap" v-if="step === 1">
              <div>
                <span style="width: 160px; display: block">备注：</span>
                <el-input
                  v-model="lotteryInfo.actNotes"
                  type="textarea"
                  disabled
                  :rows="3"
                ></el-input>
              </div>
            </div>

            <div class="inline2" v-if="step === 2">
              <div style="font-weight: bold">奖池奖品配置</div>
              <div v-for="(rule, index) in actRules" :key="index" class="info2">
                <div class="inline-info">
                  <div>
                    <span>奖品级别：</span>
                    <el-input v-model="prodSeqidArr[rule.prodSeqid]" disabled></el-input>
                  </div>
                  <div>
                    <!-- <span style="margin-right: 20px"
                      >奖品格序号{{ index + 1 }}</span
                    > -->
                    <span>奖品：</span>
                    <el-input v-model="rule.prodName" disabled></el-input>
                  </div>
                  <div>
                    <span>奖品上限：</span>
                    <el-input v-model="rule.prodUp" disabled></el-input>
                  </div>
                  <div>
                    <span>商品库存：</span>
                    <el-input v-model="rule.prodStock" disabled></el-input>
                  </div>
                </div>
                <div class="inline-info">
                  <div>
                    <span>是否允许单个奖品的重复获奖:</span>
                    <el-select
                    disabled
                    v-model="rule.prodRepeat"
                    placeholder="请选择"
                  >
                    <el-option key="01" label="不允许" value="1" />
                    <el-option key="02" label="允许" value="0" />
                  </el-select>
                  </div>
                </div>
              </div>
            </div>

            <div class="inline3" v-if="step === 3">
              <div>
                <span>活动标题文字：</span>
                <el-tooltip class="item" effect="dark" :content="lotteryInfo.actHead" placement="top-start">
                  <el-input v-model="lotteryInfo.actHead" disabled></el-input>
                </el-tooltip>
              </div>
              <div>
                <span>活动细则：</span>
                <!-- <el-tooltip class="item" effect="dark" :content="lotteryInfo.actRules" placement="top-start">
                  <el-input v-model="lotteryInfo.actRules" type="textarea" disabled></el-input>
                </el-tooltip> -->
                <el-input type="textarea" :rows="8" v-model="lotteryInfo.actRules" disabled></el-input>
              </div>
              <div class="img">
                <span>活动图片：</span>
                <el-input v-model="lotteryInfo.pictureName" disabled></el-input>
                <!-- pictureUrl -->
                <el-button type="primary" size="mini" @click="showPicture(lotteryInfo.pictureUrl)">预览</el-button>
              </div>
              <div class="img">
                <span>活动列表图：</span>
                <el-input v-model="lotteryInfo.actPictureName" disabled></el-input>
                <!-- pictureUrl -->
                <el-button type="primary" size="mini" @click="showPicture(lotteryInfo.actPictureUrl)">预览</el-button>
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
      <!-- 预览 图片 -->
      <el-dialog
        class="notice-dialog"
        title="活动图片"
        :visible.sync="imgShow"
        width="800px"
        append-to-body
      >
        <img :src='`${baseUrl}/${pictureUrl}`' />
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import API from '@/api'
import { baseUrl } from '@/utils'
export default {
  props: {
    dialogLotteryVisible: {
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
    dialogLotteryVisible(value) {
      if (value) {
        // 初始化数据
        this.infoForm = {
          approveStatus: this.type === 'edit' ? '3' : this.info.approveStatus,
          approveNotes: this.type === 'edit' ? '' : this.info.approveNotes
        }

        // 获取详情
        this.vloading = true
        API.newlottery
          .getLotteryActBaseData({
            actId: this.info.applyObjId
          })
          .then(res => {
            this.lotteryInfo = res.data.data
          }).catch(() => {
            this.vloading = false
          })

        API.newlottery.getLotteryActProdData({actId: this.info.applyObjId}).then((res) => {
          // res.data.data.forEach(ele => {
          //   ele.lotteryRate = ele.lotteryRate.toFixed(2) + '%' // 风险！！！！null值没有tofixed方法，如果报错代码运行到这一行会停止跳至catch，不会提示报错。
          // })
          this.actRules = res.data.data
          this.vloading = false
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
      lotteryInfo: {},
      actRules: [],
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
      lotTemplate: ['允许', '不允许'],
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
      imgShow: false,
      prodSeqidArr: {
        '1': '一等奖',
        '2': '二等奖',
        '3': '三等奖',
        '4': '四等奖',
        '5': '五等奖',
        '6': '六等奖'
      },
      pictureUrl: ''
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
    showPicture(url) {
      this.pictureUrl = url
      this.imgShow = true
    },
    cancel() {
      this.$emit('cancel', { idx: 15 })
      setTimeout(() => {
        this.step = 1
      }, 350)
    }
  }
}
</script>

<style lang="scss" scoped>
.lottery-act {
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
        /deep/ .el-input {
          width: 50%;
        }
        span {
          width: 200px;
          display: block;
        }
      }
      > div:nth-child(2n) {
        justify-content: flex-end;
      }
    }
    .inline2 {
      .info2 {
        /deep/ .el-input {
          width: 120px;
        }
        .inline-info {
          display: flex;
          width: 100%;
          margin-bottom: 20px;
          >div {
            display: flex;
            width: 25%;
            span {
              display: block;
              width: 117px;
            }
          }
        }
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
        padding-bottom: 20px;
      }
      /deep/ .el-textarea {
        width: 82%;
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

  .image {
    position: relative;
    /deep/ .el-button  {
      position: absolute;
      left: 260px;
    }
  }
}
</style>
