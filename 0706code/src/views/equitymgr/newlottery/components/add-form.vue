<template>
  <div class="act-dialog">
    <el-dialog :title="setTitle" :visible.sync="dialogVisible"
      width="1200px" :before-close="handleClose">
      <div v-loading="waitLoading">
        <el-steps :active="active" align-center>
          <el-step style="width: 160px;" :class="{ 'act-step': type === 'detail' }" title="基本信息" @click.native='handleDetailStep(1)'></el-step>
          <el-step style="width: 160px;" :class="{ 'act-step': type === 'detail' }" title="奖品配置" @click.native='handleDetailStep(2)'></el-step>
          <el-step style="width: 160px;" :class="{ 'act-step': type === 'detail' }" title="模版配置" @click.native='handleDetailStep(3)'></el-step>
        </el-steps>
        <info-form ref="infoChild" v-show="active === 1" :actId="actId" :type="type" :active="active" :actStatus="actStatus" @typeChange="typeChange" @handleNext="handleNext" @handleLoading="handleLoading"></info-form>
        <rule-form ref="ruleChild" v-show="active === 2" :actId="actId" :type="type" :active="active" :actStatus="actStatus" :typeChanged="typeChanged"
          @handleNext="handleNext"></rule-form>
        <template-form ref="templateChild" v-show="active === 3" :actId="actId" :type="type" :active="active"
          @handleNext="handleNext"></template-form>
        <div class="dialog-btns" v-if="type !== 'detail'">
          <el-button v-if="active !== 1" :disabled="btnStatus" @click="handlePrevStep">上一步</el-button>
          <el-button v-if="active === 2" :disabled="btnStatus" @click="handleNextStep('TEMP')">保存</el-button>
          <el-button type="primary" :loading="btnStatus" @click="handleNextStep">{{active === 3 ? '提交' : '下一步'}}</el-button>
          <el-button :disabled="btnStatus" @click="handleClose">取消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import API from '@/api'
  import infoForm from './info-form'
  import ruleForm from './rule-form'
  import templateForm from './template-form'
  export default {
    components: {
      infoForm,
      ruleForm,
      templateForm
    },
    props: {
      // 客户号
      actId: {
        type: String
      },
      type: {
        type: String
      },
      // 弹框显隐
      dialogVisible: {
        type: Boolean
      },
      actStatus: {
        type: String
      }
    },
    data() {
      return {
        typeChanged: false,
        waitLoading: false,
        active: 1,
        btnStatus: false,
        status: '',
        isSave: false,
        copyed: false
      }
    },
    computed: {
      setTitle() {
        let title = ''
        switch (this.type) {
          case 'add':
            title = '创建奖池活动'
            break
          case 'edit':
            title = '修改奖池活动'
            break
          case 'copy':
            title = '复制奖池活动'
            break
          case 'detail':
            title = '奖池活动详情'
            break
          default:
        }
        return title
      }
    },
    methods: {
      typeChange(val) {
        this.typeChanged = val
      },
      handleLoading(val) {
        this.waitLoading = val
      },
      handleClose(isSave) {
        this.active = 1
        this.$emit('onCancel', this.isSave)
        this.isSave = false
        this.copyed = false
        this.typeChanged = false
      },
      handleNext(obj) {
        this.btnStatus = this.status !== 'TEMP'
        if (this.active === 1) {
          // 基本信息活动频率
          API.newlottery.postSaveLotteryActBaseData(Object.assign({
            actId: this.type === 'copy' && !this.copyed ? '' : this.actId,
            createEmpName: this.isCreate() ? this.$store.state.user.name : '',
            createEmpNo: this.isCreate() ? this.$store.state.user.id : '',
            modifyEmpName: !this.isCreate() ? this.$store.state.user.name : '',
            modifyEmpNo: !this.isCreate() ? this.$store.state.user.id : ''
          }, obj)).then(response => {
            this.btnStatus = false
            this.isSave = true
            if (this.type === 'add' || this.type === 'copy') {
              this.$emit('handleAddId', response.data.data)
              if (this.type === 'copy') {
                this.copyed = true
              }
            }
            this.active += 1
          }).catch(response => {
            this.btnStatus = false
            this.showMessage(response.msg, 'warning')
          })
        } else if (this.active === 2) {
          API.newlottery.postSaveLotteryActProdData(Object.assign({
            actId: this.actId,
            createEmpName: this.$store.state.user.name,
            createEmpNo: this.$store.state.user.id,
            status: this.status === 'TEMP' ? 'TEMP' : '',
            data: obj
          })).then(response => {
            this.btnStatus = false
            this.isSave = true
            if (this.status === 'TEMP') {
              this.$message.success('保存成功！')
            } else {
              this.active += 1
            }
          }).catch(response => {
            this.btnStatus = false
            this.showMessage(response.msg, 'warning')
          })
        } else {
          API.newlottery.postSaveLotteryActTemplateData(Object.assign({
            actId: this.actId,
            createEmpName: this.$store.state.user.name,
            createEmpNo: this.$store.state.user.id
          }, obj)).then(response => {
            this.btnStatus = false
            this.isSave = true
            this.handleClose()
            // this.showMessage(this.type === 'add' ? '创建成功！' : '修改成功', 'success')
            this.showMessage('操作成功！', 'success')
          }).catch(response => {
            this.btnStatus = false
            this.showMessage(response.msg, 'warning')
          })
        }
      },
      isCreate() {
        return (this.type === 'add' && !this.actId) || (this.type === 'copy' && !this.copyed)
      },
      handleNextStep(type) {
        if (this.active === 1) {
          this.$refs.infoChild.handleNextStep()
        } else if (this.active === 2) {
          this.status = type
          this.$refs.ruleChild.handleNextStep(type)
        } else {
          this.$refs.templateChild.handleSubmit()
        }
      },
      handlePrevStep() {
        this.active -= 1
      },
      handleDetailStep(step) {
        if (this.type === 'detail') {
          this.active = step
        }
      },
      showMessage(mes, type) {
        this.$message({
          message: mes,
          type: type
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .act-dialog {
    .act-step {
      /deep/ .el-step__icon {
        cursor: pointer;
      }
    }

    /deep/ .el-steps {
      width: 477px;
      margin: 0 auto;

      /deep/ .is-finish {
        /deep/ .el-step__icon {
          width: 16px;
          height: 16px;
          background: #80A639;
        }

        /deep/ .el-step__line {
          /deep/ .el-step__line-inner {
            height: 4px;
            background-color: #80A639;
          }
        }
      }

      /deep/ .is-wait,
      /deep/ .is-process {
        /deep/ .el-step__icon {
          width: 16px;
          height: 16px;
          background: #c0c4cc;
          border-color: #c0c4cc;
        }
      }

      /deep/ .el-step__line {
        height: 4px;
        top: 10px;
      }

      /deep/ .el-step__icon-inner {
        color: #fff;
      }
    }

    /deep/ .el-input__icon {
      line-height: 26px;
    }

    /deep/ .el-form-item__label {
      line-height: 26px;
      padding: 0;
    }

    /deep/ .el-form-item__content {
      line-height: 26px;
    }

    /deep/ .el-input {
      width: 260px;

      /deep/ .el-input__inner {
        height: 26px;
      }
    }

    .dialog-btns {
      display: flex;
      justify-content: center;
    }
  }
</style>
