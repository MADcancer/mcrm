<template>
  <div class="custinfo-dialog">
    <el-dialog title="积分调整" :visible.sync="dialogVisible" width="518px" :before-close="handleClose">
      <div>
        <div class="custinfo-dialog-item">
          <div class="custinfo-dialog-item-label">客户号:</div>
          <el-input :disabled="true" :value="custNo"></el-input>
        </div>
        <div class="custinfo-dialog-item">
          <div class="custinfo-dialog-item-label">客户姓名:</div>
          <el-input :disabled="true" :value="custName"></el-input>
        </div>
        <div class="custinfo-dialog-item">
          <div class="custinfo-dialog-item-label">积分渠道:</div>
          <el-select :disabled="true" :value="scoreChannel" placeholder="请选择">
            <el-option
              v-for="item in $root.selectOption.channel"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="custinfo-dialog-item">
          <div class="custinfo-dialog-item-label">申请人:</div>
          <el-input :disabled="true" :value="applyPerson"></el-input>
        </div>
        <div class="custinfo-dialog-item">
          <div class="custinfo-dialog-item-label">工号:</div>
          <el-input :disabled="true" :value="applyEmpNo"></el-input>
        </div>
        <div class="custinfo-dialog-item">
          <div class="custinfo-dialog-item-label">申请时间:</div>
          <el-input :disabled="true" :value="currentDate"></el-input>
        </div>
        <el-form ref="form" :model="form" :rules="rules" label-width="100px" label-position="left">
          <el-form-item label="调整方向:" prop="adjType">
            <el-select v-model="form.adjType" placeholder="请选择">
              <el-option label="请选择" value="">
              </el-option>
              <el-option label="调增" value="1">
              </el-option>
              <el-option label="调减" value="2">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="调整分值:" prop="adjValue">
            <el-input placeholder="请输入分值"  maxlength="16" v-model="form.adjValue"></el-input>
          </el-form-item>
          <el-form-item class="custinfo-dialog-reason" label="调整原因:" prop="adjRea">
            <el-input type="textarea" :rows="3" placeholder="请输入原因"  maxlength="100" v-model="form.adjRea"></el-input>
          </el-form-item>
        </el-form>
        <div class="custinfo-dialog-btns">
          <el-button type="primary" @click="handleSubmit">提交</el-button>
          <el-button @click="handleClose">取消</el-button>
        </div>
      </div>
      <el-dialog class="notice-dialog" title="提示" :visible.sync="noticeDialogVisible" width="300px" append-to-body>
        <span>{{ form.adjType === '1' ? '是否确认调增客户积分？' : '是否确认调减客户积分？'}}</span>
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
      }
    },
    data() {
      return {
        applyPerson: this.$store.state.user.name,
        applyEmpNo: this.$store.state.user.id,
        currentDate: '',
        form: {
          adjType: '',
          adjValue: '',
          adjRea: ''
        },
        noticeDialogVisible: false,
        noticeBtnStatus: false,
        rules: {
          adjType: [{
            required: true,
            message: '请选择调整方向',
            trigger: 'change'
          }],
          adjValue: [{
            required: true,
            message: '请输入分值',
            trigger: 'blur'
          }, {
            pattern: /^[1-9]\d*$/,
            message: '请输入正整数',
            trigger: 'blur'
          }, {
            min: 0,
            max: 16,
            message: '长度限制16字符内',
            trigger: 'blur'
          }],
          adjRea: [{
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
    created() {
      var data = new Date()
      var month = data.getMonth() < 9 ? '0' + (data.getMonth() + 1) : data.getMonth() + 1
      var date = data.getDate() <= 9 ? '0' + data.getDate() : data.getDate()
      this.currentDate = data.getFullYear() + '/' + month + '/' + date
    },
    methods: {
      handleClose() {
        this.$emit('onCancel')
      },
      handleSubmit() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.noticeDialogVisible = true
          } else {
            return false
          }
        })
      },
      handleConfirm() {
        this.noticeBtnStatus = true
        var obj = Object.assign(this.form, {
          custNo: this.custNo,
          custName: this.custName,
          scoreChannel: this.$store.state.user.channel
        })
        this.$emit('handleAdjust', obj)
      }
    },
    watch: {
      dialogVisible(value) {
        if (value) {
          this.$nextTick(() => {
            this.$refs['form'].resetFields()
          })
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
      margin-bottom: 22px;

      .el-input {
        width: 260px;
      }

      .custinfo-dialog-item-label {
        width: 100px;
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

    /deep/ .el-input__inner {
      width: 260px;
      height: 26px;
    }

    .custinfo-dialog-reason {
      margin-bottom: 39px;
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
