<template>
  <div class="rule-form">
    <el-form
      :model="ruleForm"
      ref="ruleForm"
      label-width="90px"
      class="demo-dynamic"
      size="mini"
      label-position="right"
    >
      <div v-for="(item, index) in ruleForm.rules" :key="index">
        <div v-if="!!item.pictureName||type !== 'detail'" class="rule-form-row">
          <!-- <div class="rule-form-num">
            <span class="number">
              {{
              index + 1
              }}
            </span>
          </div>-->
          <el-form-item
            v-if="type !== 'detail'"
            :label="'票选商品'+(index+1)+'图片'"
            label-width="110px"
            style="position: relative"
          >
            <span
              style="color: #F56C6C; margin-right:4px; position: absolute;top: 0;left: -110px;"
            >*</span>
            <el-input disabled placeholder="请选择" v-model="item.pictureName">
              <el-upload
                :slot="type === 'detail' ? '' : 'append'"
                :ref="`upload${index}`"
                action
                class="upload-demo"
                accept=".png, .jpg, .jpeg"
                :show-file-list="false"
                :auto-upload="false"
                :before-upload="(file) => beforeUpload(file, index)"
                :file-list="item.pictureList"
                :http-request="handleRequest"
                :multiple="false"
                :on-change="(file, fileList) => handleChangeFile(file, fileList, index)"
              >
                <span>选择文件</span>
                <div style="position: absolute;left: -80px;top: 25px;color:#ff0000">
                  <span v-if="item.showMessage">{{item.message}}</span>
                </div>
              </el-upload>
            </el-input>
            <el-button
              v-if="type !== 'detail'"
              size="small"
              type="primary"
              @click="uploadImg(index)"
            >导入</el-button>
            <el-button
              v-if="type === 'detail'"
              size="small"
              type="primary"
              @click="previewImg(item.pictureUrl)"
            >预览</el-button>
          </el-form-item>
          <div v-else class="special-fromItem">
            <span>票选商品{{index+1}}图片：</span>
            <div
              class="preview-img img-view"
              style="cursor: pointer;"
              @click="previewImg(item.pictureUrl)"
            >
              <!-- <img fit="" src="~@/assets/img/test.jpg" style="width: 100px;height: 100px;object-fit: fill;" /> -->
              <img :src="`${baseUrl}/${item.pictureUrl}`" style="width: 50px;height: 50px" />
            </div>
          </div>
          <el-form-item
            :label="'票选商品'+(index+1)+'描述'"
            :prop="'rules.' + index + '.actNotes'"
            label-width="130px"
            :rules="[
              { required: true, message: '请输入', trigger: 'blur' },
              {
                min: 0,
                max: 100,
                message: '长度限制100字符内',
                trigger: 'blur'
              }
            ]"
          >
            <el-input
              :disabled="type === 'detail'"
              placeholder="请输入"
              maxlength="100"
              v-model="item.actNotes"
            />
          </el-form-item>
          <el-form-item label="占比:" v-if="type === 'detail'">
            <el-input :disabled="type === 'detail'" maxlength="100" v-model="item.rate" />
          </el-form-item>
          <el-form-item label="票数:" v-if="type === 'detail'">
            <el-input :disabled="type === 'detail'" maxlength="100" v-model="item.voteCount" />
          </el-form-item>
          <i
            class="el-icon-remove"
            v-if="
              (index !== 0 && type !== 'detail')
            "
            @click.prevent="removeRule(item)"
          ></i>
        </div>
      </div>
    </el-form>
    <div class="rule-form-add" @click="addRule" v-if="type !== 'detail'">
      <i class="el-icon-tjzb"></i>
      <span>{{ '增加商品' }}</span>
    </div>
    <div class="rule-form-notice" v-if="type !== 'detail'">
      <p>注：1、票选商品最多添加10个。</p>
    </div>
    <el-dialog
      class="lottery-notice-dialog"
      title="提示"
      :visible.sync="noticeDialogVisible"
      width="375px"
      append-to-body
    >
      <span>是否确认提交？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleConfirm">确 认</el-button>
        <el-button @click="noticeDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog class="img-dialog" title="图片预览" :visible.sync="imgShow" width="720px" append-to-body>
      <div class="preview-img img-view">
        <!-- <img fit="" src="~@/assets/img/test.jpg" style="width: 100px;height: 100px;object-fit: fill;" /> -->
        <img :src="`${baseUrl}/${pictureUrl}`" style="width: 240px" />
      </div>
    </el-dialog>
  </div>
</template>
<script>
import API from '@/api'
import { baseUrl } from '@/utils'
import vPagination from '@/components/pagination/pagination'
import { validateImg, imgFormat } from '@/utils/validate'
export default {
  components: {
    vPagination
  },
  props: {
    actId: {
      type: String
    },
    type: {
      type: String
    },
    active: {
      type: Number
    },
    lotteryType: {
      type: String
    },
    typeChanged: {
      type: Boolean
    }
  },
  data() {
    return {
      noticeDialogVisible: false,
      pictureUrl: '',
      imgShow: false,
      baseUrl: baseUrl(),
      ruleForm: {
        rules: [
          {
            prodId: '',
            prodName: '',
            pictureName: '',
            pictureUrl: '',
            pictureList: [],
            rate: '',
            voteCount: '',
            showMessage: false,
            message: ''
          }
        ]
      },
      upload: false, // 是否提交表单
      ruleIndex: '',
      // prodTableData: [],
      formData: new FormData()
    }
  },
  methods: {
    // 图片check
    beforeUpload(file, index) {
      let obj = this.ruleForm.rules[index]
      if (imgFormat(file)) {
        // this.previewLoading = false
        obj.pictureList = []
        this.$set(obj, 'pictureName', '')
        this.$set(obj, 'pictureUrl', '')
        this.$refs[`upload${index}`][0].clearFiles()
        this.resetForm(`upload${index}`)
        return
      }
      let _this = this
      let imgWidth = 240
      let imgHight = 160
      validateImg(file, imgWidth, imgHight).then(() => {
        this.uploadImage(index)
      }).catch(() => {
        _this.$message.warning({ message: `上传文件的图片大小不合符标准,宽需要为${imgWidth}px，高需要为${imgHight}px。` })
        // this.previewLoading = false
        obj.pictureList = []
        this.$set(obj, 'pictureUrl', '')
        this.$set(obj, 'pictureName', '')
        this.$refs[`upload${index}`][0].clearFiles()
        this.resetForm(`upload${index}`)
      })
    },
    // 选择文件变更
    handleChangeFile(file, fileList, index) {
      // 只有一张图片
      this.ruleForm.rules[index].pictureList = []
      this.ruleForm.rules[index].pictureList.push(fileList[fileList.length - 1])
      this.$set(this.ruleForm.rules[index], 'pictureName', file.name)
      this.$set(this.ruleForm.rules[index], 'pictureUrl', '')
      this.$set(this.ruleForm.rules[index], 'showMessage', false)
    },
    // 导入
    handleRequest(param) {
      this.formData.append('files', param.file)
    },
    uploadImg(index) {
      let obj = this.ruleForm.rules[index]
      this.$set(obj, 'showMessage', false)
      if (obj.pictureList.length === 0) {
        this.$set(obj, 'showMessage', true)
        this.$set(obj, 'message', '请选择后图片再导入')
        return
      }
      // this.uploadDetailLoading = true
      this.formData = new FormData()
      let upload = `upload${index}`
      this.$refs[upload][0].submit()
    },
    // 图片上传
    uploadImage(index) {
      let obj = this.ruleForm.rules[index]
      API.common.upload(this.formData).then((res) => {
        this.$set(obj, 'pictureUrl', res.data.data[0].fileUrl)
        // this.uploadDetailLoading = false
        // this.uploadDetailFlg = true
        this.resetForm(`upload${index}`)
        this.$message.success('上传成功！')
      }).catch(() => {
        obj.pictureList = []
        this.$set(obj, 'pictureName', '')
        this.$set(obj, 'pictureUrl', '')
        this.resetForm(`upload${index}`)
        this.$message.error('上传失败！')
        // this.uploadDetailLoading = false
      })
    },
    // 清空input val
    resetForm(uploadName) {
      // 判断ie10以及以下
      let isIE10 = window.navigator.userAgent.indexOf('MSIE') >= 1
      let ele = this.$refs[uploadName][0].$el.getElementsByTagName('input')[0]
      if (isIE10) {
        let form = document.createElement('form')
        let beforInput = ele.nextSibling
        let parentInput = ele.parentNode
        form.appendChild(ele)
        form.reset()
        parentInput.insertBefore(ele, beforInput)
      } else {
        ele.value = null
      }
    },
    handleNextStep(type) {
      this.$refs['ruleForm'].validate(valid => {
        this.validateUpload()
        if (valid && this.validateUpload()) {
          this.noticeDialogVisible = true
        } else {
          return false
        }
      })
    },
    handleConfirm() {
      this.setParams()
      this.noticeDialogVisible = false
    },
    validateUpload() {
      var ifPass = true
      this.ruleForm.rules.forEach((item, index) => {
        this.$set(item, 'showMessage', false)
        if (!item.pictureName) {
          ifPass = false
          this.$set(item, 'showMessage', true)
          this.$set(item, 'message', '请选择图片')
          this.upload = false
        }
        if (!item.pictureUrl) {
          ifPass = false
          this.$set(item, 'showMessage', true)
          this.$set(item, 'message', '请导入图片')
          this.upload = false
        }
      })
      return ifPass
    },
    setParams(type) {
      this.upload = true
      var rulesArr = []
      this.ruleForm.rules.forEach((item, index) => {
        var ruleObj = {}
        this.$set(item, 'showMessage', false)
        if (!item.pictureName) {
          this.$set(item, 'showMessage', true)
          this.$set(item, 'message', '请选择图片')
          this.upload = false
          return
        }
        if (!item.pictureUrl) {
          this.$set(item, 'showMessage', true)
          this.$set(item, 'message', '请导入图片')
          this.upload = false
          return
        }
        ruleObj = {
          prodSeqid: index,
          prodId: item.prodId,
          prodName: item.prodName,
          pictureName: item.pictureName,
          pictureUrl: item.pictureUrl,
          actNotes: item.actNotes
        }
        rulesArr.push(ruleObj)
      })
      if (this.upload) {
        this.$emit('handleNext', rulesArr)
      }
    },
    removeRule(item) {
      var index = this.ruleForm.rules.indexOf(item)
      if (index !== -1) {
        this.ruleForm.rules.splice(index, 1)
      }
    },
    addRule() {
      if (this.ruleForm.rules.length < 10) {
        this.ruleForm.rules.push({
          prodId: '',
          prodName: '',
          pictureName: '',
          pictureUrl: '',
          pictureList: [],
          showMessage: false,
          message: ''
        })
      } else {
        this.$message({
          message: '票选商品最多添加10个!',
          type: 'warning'
        })
      }
    },
    resetRuleForm() {
      this.ruleForm = {
        rules: [
          {
            prodId: '',
            prodName: '',
            rate: '',
            voteCount: '',
            pictureName: '',
            pictureUrl: '',
            pictureList: [],
            showMessage: false,
            message: ''
          }
        ]
      }
    },
    getVoteActProd() {
      API.voteact
        .queryVoteActProd({
          actId: this.actId
        })
        .then(response => {
          if (response.data.data.length === 0) {
            this.resetRuleForm()
          } else {
            var data = response.data.data
            var ruleArr = []
            data.forEach(item => {
              var rule = {
                prodSeqid: item.prodSeqid,
                prodId: item.prodId,
                prodName: item.prodName,
                actNotes: item.actNotes,
                rate: item.rate + '%',
                voteCount: item.voteCount,
                pictureName: item.pictureName,
                pictureUrl: item.pictureUrl,
                pictureList: [],
                showMessage: false,
                message: ''
              }
              ruleArr.push(rule)
            })
            this.ruleForm = {
              rules: ruleArr
            }
          }
        })
        .catch(() => { })
    },
    // 图片预览
    previewImg(url) {
      if (!url) {
        this.$message.info('还没有上传的图片！')
        return
      }
      this.pictureUrl = url
      this.imgShow = true
    }
  },
  created() {
    if (this.type !== 'add') {
      this.getVoteActProd()
    }
  },
  watch: {
    type(value) {
      if (!value) {
        this.$nextTick(() => {
          this.$refs['ruleForm'].clearValidate()
          this.ruleForm = {
            rules: [
              {
                prodId: '',
                prodName: '',
                rate: '',
                voteCount: ''
              }
            ]
          }
        })
      } else if (value !== 'add') {
        this.getVoteActProd()
      } else if (value === 'add') {
        this.resetRuleForm()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.rule-form {
  .rule-form-title {
    display: flex;
    align-items: center;
    color: #111111;
    margin-bottom: 25px;

    .line {
      width: 2px;
      height: 12px;
      margin-right: 5px;
      background-color: #80a639;
    }
  }

  .rule-form-row {
    display: flex;
    align-items: center;

    .rule-form-num {
      height: 45px;
      margin-right: 20px;

      .text {
        font-size: 12px;
        color: #676666;
      }

      .number {
        width: 20px;
        height: 20px;
        font-size: 10px;
        color: #ffffff;
        margin-left: 6px;
        text-align: center;
        line-height: 20px;
        display: inline-block;
        border-radius: 4px;
        background-color: #80a639;
      }
    }

    .el-form-item {
      /deep/ .el-input {
        width: 130px;
      }

      /deep/ .el-form-item__label {
        padding-right: 10px;
      }

      /deep/ .el-input-group__append {
        padding: 4px;
      }

      &:nth-child(2),
      &:nth-child(3),
      &:nth-child(4) {
        margin-right: 40px;
      }

      .el-icon-khz {
        width: 16px;
        height: 19px;
        background: url(../imgs/khz.png) center no-repeat;
        background-size: cover;
        position: relative;
        top: 3px;
        cursor: pointer;
      }
    }

    .el-icon-remove {
      font-size: 20px;
      line-height: 26px;
      color: #ff0000;
      margin-left: 15px;
      cursor: pointer;
      margin-bottom: 18px;
    }
  }

  .rule-form-add {
    width: 72px;
    display: flex;
    align-items: center;
    color: #80a639;
    cursor: pointer;

    /deep/ .el-icon-tjzb {
      width: 11px;
      height: 11px;
      background: url(../imgs/tjzb.png) center no-repeat;
      background-size: cover;
      margin-right: 5px;
    }
  }

  .rule-form-notice {
    color: #ff0000;
    margin: 60px 0;

    p {
      margin: 0;
    }

    p:not(:first-child) {
      margin-left: 28px;
    }
  }
}
.img-view {
  // width: 240px;
  // height: 160px;
  background-color: aliceblue;
}
.special-fromItem {
  margin-left: 0;
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  margin-right: 20px;
  width: 160px;
}
.rule-form-notice {
  color: #ff0000;
  margin-bottom: 60px;

  p {
    margin: 0 0;
  }

  p:not(:first-child) {
    margin-left: 28px;
  }
}
</style>
