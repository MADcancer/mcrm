<template>
  <div class="product-info">
    <el-dialog
      title="商品详情"
      :visible.sync="dialogInfoVisible"
      width="1000px"
      :before-close="cancel"
    >
      <div class="info" style="width: 100%" v-loading="waitLoading">
        <el-steps
          :space="100"
          :active="step"
          align-center
          style="width:100%"
        >
          <el-step
            title="基本信息"
            @click.native="clickStep(1)"
            :class="['step', step !== 1 ? 'unfinish' : '']"
          ></el-step>
          <el-step
            title="图片预览"
            @click.native="clickStep(2)"
            :class="['step', step !== 2 ? 'unfinish' : '']"
          ></el-step>
          <el-step
            title="券码信息"
            v-if="steps === 4"
            @click.native="clickStep(3)"
            :class="['step', step !== 3 ? 'unfinish' : '']"
          ></el-step>
          <el-step
            title="短信模板"
            v-if="steps > 2"
            @click.native="clickStep(steps)"
            :class="['step', step !== steps ? 'unfinish' : '']"
          ></el-step>
        </el-steps>
        <div v-if="step === 1">
          <basic-info :infoForm="basicInfo"></basic-info>
        </div>
        <div v-if="step === 2">
          <img-info :imgInfo='imgs'></img-info>
        </div>
        <div v-if="steps === 4 && step === 3">
          <code-info :step="step" :prodId="prodId"></code-info>
        </div>
        <div v-if="steps > 2 && step === steps">
          <msg-info :msgInfo="prodMsg"></msg-info>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import API from '@/api'
import basicInfo from './basic-info'
import imgInfo from './img-info'
import codeInfo from './code-info'
import msgInfo from './msg-info'
export default {
  components: { basicInfo, msgInfo, imgInfo, codeInfo },
  props: {
    dialogInfoVisible: {
      type: Boolean
    },
    prodId: {
      type: String
    }
  },
  watch: {
    dialogInfoVisible(value) {
      if (value) {
        // 获取数据
        this.waitLoading = true
        API.product
          .getProdOne({ prodId: this.prodId })
          .then(res => {
            this.waitLoading = false
            res.data.data.prodInfo.unitCost = res.data.data.prodInfo.unitCost.toFixed(2)
            res.data.data.prodInfo.showPrice = res.data.data.prodInfo.showPrice.toFixed(2)
            this.basicInfo = res.data.data.prodInfo
            if (this.basicInfo.ifThanks === '0') {
              this.steps = 4
            } else if ((this.basicInfo.prodType === '2' && this.basicInfo.isMsg === '0') ||
              (this.basicInfo.prodType === '1' && this.basicInfo.ifThanks === '3')) {
              this.steps = 3
            } else {
              this.steps = 2
            }
            this.prodMsg = res.data.data.prodMsg

            // 轮播图
            this.imgs = Object.assign(res.data.data.prodImg, {prodName: this.basicInfo.prodName})
            this.setSlideList()
          })
          .catch(() => {
            this.waitLoading = false
          })
        this.step = 1
      }
    }
  },
  data() {
    return {
      basicInfo: {},
      imgs: {},
      prodMsg: {},
      step: 1,
      steps: 2,
      slideList: [],
      waitLoading: false
    }
  },
  methods: {
    setSlideList() {
      this.slideList = []
      if (this.imgs.slideshow1Url) {
        this.slideList.push({name: this.imgs.slideshow1Name, url: this.imgs.slideshow1Url})
      }
      if (this.imgs.slideshow2Url) {
        this.slideList.push({name: this.imgs.slideshow2Name, url: this.imgs.slideshow2Url})
      }
      if (this.imgs.slideshow3Url) {
        this.slideList.push({name: this.imgs.slideshow3Name, url: this.imgs.slideshow3Url})
      }
      if (this.imgs.slideshow4Url) {
        this.slideList.push({name: this.imgs.slideshow4Name, url: this.imgs.slideshow4Url})
      }
      if (this.imgs.slideshow5Url) {
        this.slideList.push({name: this.imgs.slideshow5Name, url: this.imgs.slideshow5Url})
      }
      this.imgs.slideList = this.slideList
    },
    clickStep(val) {
      this.step = val
    },
    cancel() {
      this.$emit('cancel', { type: 'info' })
    }
  }
}
</script>
<style lang="scss" scoped>
.product-info {
  /deep/ .el-step {
    width: 10%;
    max-width: unset !important;
  }
  .info {
    width: 100%;
  }
  .step:hover {
    cursor: pointer;
  }
  .unfinish {
    /deep/ .is-finish {
      color: #606266;
      border-color: #606266;
    }
  }
}
</style>
