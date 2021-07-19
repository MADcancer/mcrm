<template>
  <div class="info-form">
    <el-form :model="templateForm" ref="templateForm" :rules="rules" label-width="120px" class="demo-dynamic" size="mini"
      label-position="left">
      <div class="info-form-row">
        <el-form-item label="列表浏览标题:" prop="actHead">
          <el-input :disabled="type === 'detail'" placeholder="请输入"  maxlength="60" v-model="templateForm.actHead"></el-input>
        </el-form-item>
      </div>
      <div class="info-form-row">
        <div class="info-form-row">
          <el-form-item label="列表浏览副标题:" prop="actSubHead">
            <el-input :disabled="type === 'detail'" placeholder="请输入"  maxlength="60" v-model="templateForm.actSubHead"></el-input>
          </el-form-item>
        </div>
      </div>
      <div class="info-form-row">
        <div class="info-form-row">
          <el-form-item label="活动细则:" prop="actRules">
            <el-input :disabled="type === 'detail'" type="textarea"  maxlength="500" :rows="8" placeholder="请输入" v-model="templateForm.actRules"></el-input>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <el-dialog class="notice-dialog" title="提示" :visible.sync="noticeDialogVisible" width="375px" append-to-body>
      <span>是否确认提交？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleConfirm">确 认</el-button>
        <el-button @click="noticeDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import API from '@/api'
  export default {
    props: {
      actId: {
        type: String
      },
      type: {
        type: String
      },
      active: {
        type: Number
      }
    },
    data() {
      return {
        templateForm: {
          actHead: '',
          actSubHead: '',
          actRules: ''
        },
        noticeDialogVisible: false,
        rules: {
          actHead: [{
            required: true,
            message: '请输入',
            trigger: 'blur'
          }, {
            min: 0,
            max: 60,
            message: '长度限制60字符内',
            trigger: 'blur'
          }],
          actSubHead: [{
            min: 0,
            max: 60,
            message: '长度限制60字符内',
            trigger: 'blur'
          }],
          actRules: [{
            required: true,
            message: '请输入',
            trigger: 'blur'
          }, {
            min: 0,
            max: 500,
            message: '长度限制500字符内',
            trigger: 'blur'
          }]
        }
      }
    },
    methods: {
      getBuyActBase() {
        API.buy.getBuyActBaseData({
          actId: this.actId
        }).then(response => {
          var resData = response.data.data
          this.templateForm = {
            actHead: resData.actHead,
            actSubHead: resData.actSubHead,
            actRules: resData.actRules
          }
        }).catch(() => {})
      },
      handleSubmit() {
        this.$refs['templateForm'].validate((valid) => {
          if (valid) {
            this.noticeDialogVisible = true
          } else {
            return false
          }
        })
      },
      handleConfirm() {
        this.$emit('handleNext', this.templateForm)
        this.noticeDialogVisible = false
      }
    },
    created() {
      if (this.type !== 'add') {
        this.getBuyActBase()
      }
    },
    watch: {
      type(value) {
        if (!value) {
          this.$nextTick(() => {
            this.$refs['templateForm'].resetFields()
          })
        } else if (value !== 'add') {
          this.getBuyActBase()
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .info-form {
    .info-form-row {
      display: flex;

      .el-form-item {

        .el-input,
        .el-textarea {
          width: 423px;
        }
      }
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
