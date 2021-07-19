<template>
  <div class="msg-info">
    <el-form :model="msg" label-position="left">
      <el-form-item label="短信模板名称：" label-width="120px">
        <el-input
          v-model="msg.smsTemplateName"
          autocomplete="off"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="权益渠道：" label-width="120px">
        <el-input
          v-model="$root.selectOption.channelObj[msg.equityChannel]"
          autocomplete="off"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="短信内容：" label-width="120px">
        <el-input
          type="textarea"
          :rows="4"
          maxlength="200"
          v-model="msg.sentCon"
          autocomplete="off"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="发送内容：" label-width="120px">
        <el-input
          type="textarea"
          :rows="4"
          maxlength="200"
          v-model="msg.msgContext"
          autocomplete="off"
          disabled
        ></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import API from '@/api'
export default {
  props: {
    msgInfo: {
      type: Object
    }
  },
  watch: {
  },
  data() {
    return {
      msg: {}
    }
  },
  methods: {
  },
  created() {
    API.prodmsg.getMsgTemplateDetail(this.msgInfo.smsTemplateId).then(res => {
      this.msg = {
        smsTemplateName: res.data.data.smsTemplateName,
        equityChannel: res.data.data.equityChannel,
        msgContext: this.msgInfo.msgContext,
        sentCon: res.data.data.sentCon
      }
    }).catch(() => {
    })
  }
}
</script>
<style lang="scss" scoped>
.msg-info {
  /deep/ .el-input {
    width: 200px;
  }
  /deep/ .el-form-item__label {
    padding: 0;
  }
}
</style>
