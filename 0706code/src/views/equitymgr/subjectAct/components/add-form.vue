<template>
  <div class="act-dialog">
    <el-dialog :title="setTitle" :visible.sync="dialogVisible"
      width="1200px" :before-close="handleClose">
      <div v-loading="waitLoading">
        <el-steps :active="active" align-center>
          <el-step style="width: 160px;" :class="{ 'act-step': type === 'detail' }" title="基本信息" @click.native='handleDetailStep(1)'></el-step>
          <el-step style="width: 160px;" :class="{ 'act-step': type === 'detail' }" title="商品配置" @click.native='handleDetailStep(2)'></el-step>
          <el-step style="width: 160px;" :class="{ 'act-step': type === 'detail' }" title="模版配置" @click.native='handleDetailStep(3)'></el-step>
        </el-steps>
        <info-form ref="infoChild" v-show="active === 1" :active="active" :type="type" :actId="actId" :actStatus="actStatus" @handleNext="handleNext" @handleLoading="handleLoading"></info-form>
        <rule-form ref="ruleChild" v-show="active === 2" :active="active" :type="type" :actId="actId" :actStatus="actStatus" @handleNext="handleNext"></rule-form>
        <template-form ref="templateChild" v-show="active === 3" :active="active" :type="type" :actId="actId"
          @handleNext="handleNext"></template-form>
        <div class="dialog-btns" v-if="type !== 'detail'">
          <el-button v-if="active !== 1" :disabled="btnStatus" @click="handlePrevStep">上一步</el-button>
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
    computed: {
      setTitle() {
        let title = ''
        switch (this.type) {
          case 'add':
            title = '创建主题活动'
            break
          case 'edit':
            title = '修改主题活动'
            break
          case 'copy':
            title = '复制主题活动'
            break
          case 'detail':
            title = '主题活动详情'
            break
          default:
        }
        return title
      }
    },
    data() {
      return {
        waitLoading: false,
        active: 1,
        btnStatus: false,
        copyed: false, // 复制已经生成数据
        isSave: false
      }
    },
    methods: {
      handleLoading(val) {
        this.waitLoading = val
      },
      handleClose(isSave) {
        this.active = 1
        this.copyed = false
        this.$emit('onCancel', this.isSave)
        this.isSave = false
      },
      handleNext(obj) {
        this.btnStatus = true
        if (this.active === 1) {
          API.buy.postSaveBuyActBaseData(Object.assign({
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
          API.buy.postSaveBuyActProdData(Object.assign({
            actId: this.actId,
            createEmpName: this.$store.state.user.name,
            createEmpNo: this.$store.state.user.id
          }, obj)).then(response => {
            this.btnStatus = false
            this.isSave = true
            this.active += 1
          }).catch(response => {
            this.btnStatus = false
            this.showMessage(response.msg, 'warning')
          })
        } else {
          API.buy.postSaveBuyActTemplateData(Object.assign({
            actId: this.actId,
            createEmpName: this.$store.state.user.name,
            createEmpNo: this.$store.state.user.id
          }, obj)).then(response => {
            this.btnStatus = false
            this.isSave = true
            this.handleClose()
            this.showMessage(this.type === 'add' ? '创建成功！' : '修改成功', 'success')
          }).catch(response => {
            this.btnStatus = false
            this.showMessage(response.msg, 'warning')
          })
        }
      },
      // 判断创建还是更新
      isCreate() {
        return (this.type === 'add' && !this.actId) || (this.type === 'copy' && !this.copyed)
      },
      handleNextStep() {
        if (this.active === 1) {
          this.$refs.infoChild.handleNextStep()
        } else if (this.active === 2) {
          this.$refs.ruleChild.handleNextStep()
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
