<template>
  <div class="edit">
    <el-dialog
      title="主题详情"
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
          <el-form-item label="主题名称：" prop="subName">
            <el-input
              v-model="editForm.subName"
              autocomplete="off"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="主题渠道：" prop="subChannel">
            <el-input
              v-model="$root.selectOption.channelObj[editForm.subChannel]"
              autocomplete="off"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="主题开始时间：" prop="subBegtime">
            <el-date-picker
              v-model="editForm.subBegtime"
              type="date"
              value-format="yyyy/MM/dd"
              format="yyyy/MM/dd"
              placeholder="请选择主题开始时间"
              :editable="false"
              disabled
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="主题结束时间：" prop="subEndtime">
            <el-date-picker
              v-model="editForm.subEndtime"
              type="date"
              value-format="yyyy/MM/dd"
              format="yyyy/MM/dd"
              placeholder="请选择主题结束时间"
              :editable="false"
              disabled
            >
            </el-date-picker>
          </el-form-item>
          <div class="subject-img">
            <span style="color: #F56C6C; margin-right:4px; margin-bottom: 13px"
              >*</span
            >
            <el-form-item label="主题图片：" label-width="110px">
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
          <el-form-item label="主题说明：" prop="notes">
            <el-input
              type="textarea"
              :rows="4"
              v-model="editForm.subRemark"
              autocomplete="off"
              disabled
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <!-- 预览 图片 -->
      <el-dialog
        class="notice-dialog"
        title="主题图片"
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
        API.subject.getSubInfo({id: this.id}).then(res => {
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
        subName: '',
        subChannel: this.$store.state.user.channel,
        subBegtime: '',
        subEndtime: '',
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
  .subject-img {
    display: flex;
    align-items: center;
    /deep/ .el-button {
      height: 24px;
      line-height: 1;
      display: inline-flex;
      align-items: center;
    }
  }
}
</style>
