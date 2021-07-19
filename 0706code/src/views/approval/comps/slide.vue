<template>
  <div class="slide">
    <el-dialog
      :title="type === 'detail' ? '轮播图管理审批详情' : '轮播图管理审批'" 
      :visible.sync="dialogSlideVisible"
      width="950px"
      :before-close="cancel"
    >
      <div v-loading="vloading" style="width: 100%">
        <div class="info">
          <div
            style="background: #FFFFFF; padding:23px 28px 0 28px;border-radius: 4px"
          >
            <div class="inline">
              <div>
                <span>活动名称：</span>
                <el-input v-model="slideInfo.actName" disabled></el-input>
              </div>
              <div>
                <span>活动渠道：</span>
                <el-input
                  v-model="$root.selectOption.channelObj[slideInfo.actChannel]"
                  disabled
                ></el-input>
              </div>
              <div>
                <span>活动开始时间：</span>
                <el-input v-model="slideInfo.actBegtime" disabled></el-input>
              </div>
              <div>
                <span>活动结束时间：</span>
                <el-input v-model="slideInfo.actEndtime" disabled></el-input>
              </div>
              <div>
                <span>活动状态：</span>
                <el-input
                  v-model="actStatus[slideInfo.actStatus]"
                  disabled
                ></el-input>
              </div>
              <div>
                <span>轮播图状态：</span>
                <el-input
                  v-model="slideshowStatus[slideInfo.slideshowStatus]"
                  disabled
                ></el-input>
              </div>
              <div>
                <span>轮播图顺序：</span>
                <el-input
                  v-model="slideInfo.slideshowOrder"
                  disabled
                ></el-input>
              </div>
              <div style="visibility: hidden">
                <span>轮播图顺序：</span>
                <el-input
                  v-model="slideInfo.slideshowOrder"
                  disabled
                ></el-input>
              </div>
            </div>
            <div class="line-wrap">
              <div>
                <span style="width: 120px; display: block">图片标题文字：</span>
                <el-input
                  v-model="slideInfo.pictureTitleText"
                  type="textarea"
                  disabled
                ></el-input>
              </div>
              <div>
                <span style="width: 120px; display: block">轮播图片：</span>
                <img :src="`${baseUrl}/${slideInfo.pictureUrl}`" style="height: 100px" />
                <!-- <img src="~@/assets/img/test.jpg" style="height: 100px" /> -->
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
          v-if="type === 'edit'"
          style="text-align: center; margin-top: 0px"
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
import { baseUrl } from '@/utils'
export default {
  props: {
    dialogSlideVisible: {
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
    dialogSlideVisible(value) {
      if (value) {
        // 初始化数据
        this.infoForm = {
          approveStatus: this.type === 'edit' ? '3' : this.info.approveStatus,
          approveNotes: this.type === 'edit' ? '' : this.info.approveNotes
        }

        // 获取详情
        this.vloading = true
        API.slide
          .getSlideDetailData({
            id: this.info.applyObjId
          })
          .then(res => {
            this.slideInfo = res.data.data
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
      slideInfo: {},
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
      slideshowStatus: ['', '草稿', '同意', '下线', '上线', '待审批', '驳回', '已结束'],
      actStatus: ['', '草稿', '同意', '下线', '上线', '待审批', '驳回', '已结束'],
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
      this.$emit('cancel', { idx: 10 })
    }
  }
}
</script>

<style lang="scss" scoped>
.slide {
  /deep/ .el-dialog__body {
    padding: 15px 23px;
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
          width: 120px;
          display: block;
        }
      }
      > div:nth-child(2n) {
        justify-content: flex-end;
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
    // /deep/ .el-textarea__inner {
    //   margin-top: 10px;
    // }
  }
  /deep/ .el-input {
    width: 60%;
  }
}
</style>
