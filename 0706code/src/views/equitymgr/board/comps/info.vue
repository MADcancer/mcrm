<template>
  <div class="edit">
    <el-dialog
      title="权益板块详情"
      :visible.sync="dialogInfoVisible"
      width="700px"
      :before-close="cancel"
    >
      <div v-loading="waitLoading">
        <el-form
          label-position="left"
          label-width="120px"
          :model="editForm"
          ref="editForm"
        >
          <el-form-item label="权益板块名称：">
            <el-input
              v-model="editForm.boardName"
              autocomplete="off"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="权益板块渠道：">
            <el-input
              v-model="$root.selectOption.channelObj[editForm.boardChannel]"
              autocomplete="off"
              disabled
            ></el-input>
          </el-form-item>
          <div class="board-img">
            <span style="color: #F56C6C; margin-right:4px; margin-bottom: 13px"
              >*</span
            >
            <el-form-item label="权益板块图片：" label-width="110px">
              <el-input
                disabled
                placeholder="请选择"
                v-model="editForm.pictureName"
              >
              </el-input>
              <el-button
                size="small"
                type="primary"
                @click="previewImg"
                >预览图片</el-button
              >
            </el-form-item>
          </div>
          <el-form-item label="客户组:">
            <el-input :disabled="true" placeholder="请查询" v-model="editForm.custGroupName">
            </el-input>
          </el-form-item>
          <el-form-item label="板块顺序：">
            <el-input
              v-model="editForm.boardOrder"
              autocomplete="off"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="权益板块说明：">
            <el-input
              type="textarea"
              :rows="4"
              v-model="editForm.remark"
              autocomplete="off"
              disabled
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <!-- 预览 图片 -->
      <el-dialog
        class="notice-dialog"
        title="板块图片"
        :visible.sync="imgShow"
        width="800px"
        append-to-body
      >
        <img :src='`${baseUrl}/${editForm.pictureUrl}`' />
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import API from '@/api'
import { baseUrl } from '@/utils'
export default {
  props: {
    dialogInfoVisible: {
      type: Boolean
    },
    id: {
      type: String
    },
    type: {
      type: String
    }
  },
  watch: {
    dialogInfoVisible(value) {
      if (value) {
        this.waitLoading = true
        let boardId = this.id
        API.equityrule.qryBoardInfo({ boardId }).then(res => {
          this.waitLoading = false
          this.editForm = res.data.data
        }).catch(() => {
          this.waitLoading = false
        })
      }
    }
  },
  data() {
    return {
      baseUrl: baseUrl(),
      editForm: {
        boardName: '',
        boardChannel: this.$store.state.user.channel,
        pictureName: '',
        pictureUrl: ''
      },
      waitLoading: false,
      channel: ['', '财富', '直销', '信用卡'],
      imgShow: false
    }
  },
  methods: {
    previewImg() {
      this.imgShow = true
    },
    cancel() {
      this.$emit('cancel', {type: this.type})
      setTimeout(() => {
        this.pictureList = []
        this.message = ''
        if (this.$refs['editForm']) {
          this.$refs['editForm'].clearValidate()
        }
      }, 350)
    }
  }
}
</script>

<style lang="scss" scoped>
.edit {
  /deep/ .el-input,
  /deep/ .el-textarea {
    width: 260px;
  }
  /deep/ .el-form-item {
    margin-bottom: 14px;
  }
  .board-img {
    display: flex;
    align-items: center;
    /deep/ .el-button {
      height: 24px;
      line-height: 24px;
      display: inline-flex;
      align-items: center;
    }
  }
}
</style>
