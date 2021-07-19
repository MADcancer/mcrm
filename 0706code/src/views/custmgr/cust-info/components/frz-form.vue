<template>
  <div class="custinfo-dialog">
    <el-dialog :title="btnType === 'frz' ? '积分冻结' : '积分解冻'" :visible.sync="dialogVisible" width="570px" :before-close="handleClose">
      <div>
        <div class="custinfo-dialog-item">
          <div class="custinfo-dialog-item-label">客户号:</div>
          <el-input :disabled="true" :value="custNo"></el-input>
        </div>
        <div class="custinfo-dialog-item">
          <div class="custinfo-dialog-item-label">客户姓名:</div>
          <el-input :disabled="true" :value="custName"></el-input>
        </div>
        <el-form ref="form" :model="form" :rules="rules" label-width="100px" label-position="left">
          <el-form-item  class="custinfo-dialog-type" :label="btnType === 'frz' ? '冻结类别:' : '解冻类别:'" prop="frzFlgType">
            <el-checkbox-group v-model="form.frzFlgType" style="width: 260px;">
              <!-- <el-checkbox label="1">金融资产</el-checkbox>
              <el-checkbox label="2">新客奖励</el-checkbox>
              <el-checkbox label="3">基金定投</el-checkbox>
              <el-checkbox label="4">绑定快捷支付</el-checkbox>
              <el-checkbox label="5">代发工资</el-checkbox> -->
              <el-checkbox v-for="item in checkOptions" :label="item.label" :key="item.key" :disabled="item.disabled" :checked="item.checked">{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item class="custinfo-dialog-reason" :label="btnType === 'frz' ? '冻结原因:' : '解冻原因:'" prop="reason">
            <el-input type="textarea" :rows="3" placeholder="请输入原因"  maxlength="100" v-model="form.reason"></el-input>
          </el-form-item>
        </el-form>
        <div class="custinfo-dialog-btns">
          <el-button type="primary" @click="handleSubmit">提交</el-button>
          <el-button @click="handleClose">取消</el-button>
        </div>
      </div>
      <el-dialog class="notice-dialog" title="提示" :visible.sync="noticeDialogVisible" width="698px" append-to-body>
        <span>{{btnType === 'frz' ? '是否确认冻结客户积分?冻结期间该客户积分将不允许使用!' : '是否确认解冻客户积分?解冻后客户积分将允许使用!'}}</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" :loading="noticeBtnStatus" @click="handleConfirm">确 认</el-button>
          <el-button :disabled="noticeBtnStatus" @click="noticeDialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    props: {
      // 客户号
      custNo: {
        type: String
      },
      // 客户姓名
      custName: {
        type: String
      },
      // 积分渠道
      scoreChannel: {
        type: String
      },
      // 弹框显隐
      dialogVisible: {
        type: Boolean
      },
      // 冻结标志
      frzFlg: {
        type: String
      },
      frzType: {
        type: String
      },
      btnType: {
        type: String
      }
    },
    data() {
      return {
        checkOptions: [{
          key: 1,
          label: '1',
          name: '金融资产',
          disabled: false
        }, {
          key: 2,
          label: '2',
          name: '新客奖励',
          disabled: false
        }, {
          key: 3,
          label: '3',
          name: '基金定投',
          disabled: false
        }, {
          key: 4,
          label: '4',
          name: '绑定快捷支付',
          disabled: false
        }, {
          key: 5,
          label: '5',
          name: '代发工资',
          disabled: false
        }, {
          key: 6,
          label: '6',
          name: '代收业务',
          disabled: false
        }],
        form: {
          frzFlgType: [],
          reason: ''
        },
        noticeDialogVisible: false,
        noticeBtnStatus: false,
        rules: {
          frzFlgType: [{
            required: true,
            message: '请选择冻结类别',
            trigger: 'change'
          }],
          reason: [{
            required: true,
            message: '请输入原因',
            trigger: 'blur'
          }, {
            min: 0,
            max: 100,
            message: '长度限制100字符内',
            trigger: 'blur'
          }]
        }
      }
    },
    methods: {
      getArrDifference(arr1, arr2) {
        return arr1.concat(arr2).filter(function(v, i, arr) {
          return arr.indexOf(v) === arr.lastIndexOf(v)
        })
      },
      handleClose(done) {
        this.$emit('onCancel')
      },
      handleSubmit() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.noticeDialogVisible = true
          }
        })
      },
      handleConfirm() {
        this.noticeBtnStatus = true
        var checkValues = []
        if (this.btnType === 'frz') {
          if (this.frzType) {
            checkValues = this.getArrDifference(this.frzType.split(','), this.form.frzFlgType)
          } else {
            checkValues = this.form.frzFlgType
          }
        } else {
          checkValues = this.form.frzFlgType
        }
        var obj = {
          custNo: this.custNo,
          custName: this.custName,
          scoreChannel: this.$store.state.user.channel,
          frzFlg: this.btnType === 'frz' ? '1' : '2',
          frzFlgType: checkValues + '',
          reason: this.form.reason
        }
        this.$emit('handleFrz', obj)
      }
    },
    watch: {
      dialogVisible(value) {
        if (value) {
          this.$nextTick(() => {
            this.$refs['form'].resetFields()
            if (this.btnType === 'frz') {
              if (this.frzType) {
                this.frzType.split(',').forEach(item => {
                  this.checkOptions.forEach(elem => {
                    if (elem.label === item) {
                      elem.disabled = true
                    }
                  })
                })
                this.form.frzFlgType = this.frzType.split(',')
              }
            } else {
              if (this.frzType) {
                var unFrzArr = this.getArrDifference(this.frzType.split(','), ['1', '2', '3', '4', '5', '6'])
                unFrzArr.forEach(item => {
                  this.checkOptions.forEach(elem => {
                    if (elem.label === item) {
                      elem.disabled = true
                    }
                  })
                })
              }
            }
          })
        } else {
          this.checkOptions = [{
            key: 1,
            label: '1',
            name: '金融资产',
            disabled: false
          }, {
            key: 2,
            label: '2',
            name: '新客奖励',
            disabled: false
          }, {
            key: 3,
            label: '3',
            name: '基金定投',
            disabled: false
          }, {
            key: 4,
            label: '4',
            name: '绑定快捷支付',
            disabled: false
          }, {
            key: 5,
            label: '5',
            name: '代发工资',
            disabled: false
          }, {
            key: 6,
            label: '6',
            name: '代收业务',
            disabled: false
          }]
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .custinfo-dialog {
    .custinfo-dialog-item {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 22px;

      .el-input {
        width: 260px;
      }

      .custinfo-dialog-item-label {
        width: 100px;
      }
    }

    /deep/ .el-form-item__label {
      line-height: 26px;
      padding: 0 30px 0 0;
    }

    /deep/ .el-form-item__content {
      line-height: 26px;
    }

    /deep/ .el-input__inner {
      width: 260px;
      height: 26px;
    }

    .custinfo-dialog-reason {
      margin-bottom: 39px;
      /deep/ .el-textarea__inner {
        width: 260px;
      }
    }

    .custinfo-dialog-type {
      .el-checkbox {
        width: 118px;
        margin-left: 0px;
      }
    }

    .custinfo-dialog-btns {
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
