<template>
  <div class="interface-info">
    <el-dialog
      title="接口详情"
      :visible.sync="dialogInfoVisible"
      width="700px"
      :before-close="cancel"
    >
      <!-- 基本信息 -->
      <div class="info">
        <div>
          <span>权益渠道：</span
          ><el-input v-model="$root.selectOption.channelObj[info.equityChannel]" disabled></el-input>
        </div>
        <div>
          <span>对接系统：</span
          ><el-input v-model="conSysObj[info.conSys]" disabled></el-input>
        </div>
        <div>
          <span>调整方向：</span
          ><el-input v-model="adjType[info.adjType]" disabled></el-input>
        </div>
        <div>
          <span>调整分值：</span
          ><el-input v-model="info.adjScore" disabled></el-input>
        </div>
        <div>
          <span>交易码：</span
          ><el-input v-model="info.transCode" disabled></el-input>
        </div>
        <div>
          <span>交易描述：</span
          ><el-input v-model="info.notes" type="textarea" disabled></el-input>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    dialogInfoVisible: {
      type: Boolean
    },
    interInfo: {
      type: Object
    },
    conSysObj: {
      type: Object
    }
  },
  watch: {
    dialogInfoVisible(value) {
      if (value) {
        // 初始化数据
        this.info = this.interInfo
      }
    }
  },
  data() {
    return {
      info: {},
      equityChannel: ['', '财富', '直销', '信用卡'],
      adjType: ['', '调增', '调减']
    }
  },
  computed: {},
  methods: {
    cancel() {
      this.$emit('cancel', { type: 'info' })
    }
  },
  created() {}
}
</script>

<style lang="scss" scoped>
.interface-info {
  .info {
    /deep/ .el-input,
    /deep/ .el-textarea {
      width: 240px;
    }
    > div {
      margin-top: 20px;
    }
    span {
      display: inline-block;
      width: 86px;
    }
  }
}
</style>
