<template>
  <div class="rule">
    <el-dialog
      :title="type === 'detail' ? '积分达标条件审批详情' : '积分达标条件审批'"
      :visible.sync="dialogdDbsVisible"
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
                <span>起始日：</span>
                <el-input v-model="dbsInfo.startDate" disabled></el-input>
              </div>
              <div>
                <span>截止日：</span>
                <el-input v-model="dbsInfo.endDate" disabled></el-input>
              </div>
              <div>
                <span>频次：</span>
                <el-input
                  v-model="rates[dbsInfo.rate]"
                  disabled
                ></el-input>
              </div>
              <div>
                <span>权益条件：</span>
                <el-input
                  v-model="conditions[dbsInfo.condition]"
                  disabled
                ></el-input>
              </div>
              <div>
                <span>条件：</span>
                <el-input
                  v-model="logicForms[dbsInfo.logicForm]"
                  disabled
                ></el-input>
              </div>
              <div>
                <span>阈值：</span>
                <el-input
                  v-model="dbsInfo.value"
                  disabled
                ></el-input>
              </div>
              <div>
                <span>获得积分：</span>
                <el-input
                  v-model="dbsInfo.rewardPoint"
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
    dialogdDbsVisible: {
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
    dialogdDbsVisible(value) {
      if (value) {
        // 初始化数据
        this.infoForm = {
          approveStatus: this.type === 'edit' ? '3' : this.info.approveStatus,
          approveNotes: this.type === 'edit' ? '' : this.info.approveNotes
        }

        // 获取详情
        this.vloading = true
        API.dbsmgr.getDbsPointRuleById(this.info.applyObjId).then(res => {
          this.dbsInfo = res.data.data
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
      dbsInfo: {},
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
      rates: ['', '日', '周', '月', '季', '年'],
      conditions: {},
      logicForms: ['', '大于', '小于', '大于等于', '小于等于', '等于'],
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
      this.$emit('cancel', { idx: 13 })
    }
  },
  created() {
    this.$root.selectOption.condition.map(item => {
      this.conditions[item.value] = item.label
    })
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
      flex-wrap: wrap;
      > div {
        width: 33%;
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
