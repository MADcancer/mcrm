<template>
  <div class="msg-info">
    <el-dialog
      title="短信模板详情"
      :visible.sync="dialogInfoVisible"
      width="600px"
      :before-close="cancel"
      :modal-append-to-body="false"
      :append-to-body="true"
    >
      <el-form :model="infoForm" ref="infoForm">
        <div class="inline-form">
          <el-form-item label="短信模板编号：" label-width="120px">
            <el-input
              v-model="infoForm.smsTemplateId"
              autocomplete="off"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="短信模板名称：" label-width="120px">
            <el-input
              v-model="infoForm.smsTemplateName"
              autocomplete="off"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="权益渠道：" label-width="120px">
            <el-input
              v-model="$root.selectOption.channelObj[infoForm.equityChannel]"
              autocomplete="off"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="发送方式：" label-width="120px">
            <el-input
              v-model="sendType[infoForm.sendType]"
              autocomplete="off"
              disabled
            ></el-input>
          </el-form-item>
        </div>
        <el-form-item label="模板内容：" label-width="120px">
          <el-input
            type="textarea"
            :rows="6"
            maxlength="200"
            v-model="infoForm.sentCon"
            autocomplete="off"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="备注：" label-width="120px" prop="remark">
          <el-input
            type="textarea"
            :rows="4"
            maxlength="200"
            v-model="infoForm.notes"
            autocomplete="off"
            disabled
          ></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import API from '@/api'
export default {
  props: {
    dialogInfoVisible: {
      type: Boolean
    },
    type: {
      type: String
    },
    id: {
      type: String
    }
  },
  watch: {
    dialogInfoVisible(value) {
      if (value) {
        API.prodmsg.getMsgTemplateDetail(this.id).then(res => {
          this.infoForm = res.data.data
        })
      }
    }
  },
  data() {
    return {
      infoForm: {},
      sendType: ['', '手机短信']
    }
  },
  computed: {},
  methods: {
    cancel() {
      this.$emit('cancel', { type: this.type })
    }
  },
  created() {}
}
</script>

<style lang="scss" scoped>
.inline-form {
  /deep/ .el-input {
    width: 280px;
  }
}
</style>
