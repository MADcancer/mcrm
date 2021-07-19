<template>
  <div class="img-info">
    <div>
      <div class="preview-img">
        <div>
          <div>列表预览图</div>
          <img :src="`${baseUrl}/${imgInfo.listPreviewUrl}`" />
        </div>
        <span>{{imgInfo.prodName}}</span>
      </div>
      <div class="arrow-img">
        <img src="~@/assets/img/arrow.png" />
      </div>
      <div class="detail-img">
        <div>商品轮播图</div>
        <el-carousel indicator-position="outside">
          <el-carousel-item v-for="item in imgInfo.slideList" :key="item.url">
            <img :src="`${baseUrl}/${item.url}`" />
          </el-carousel-item>
        </el-carousel>
        <div>
          <img src="~@/assets/img/logo.png" /><span>上下拖动预览详情图</span>
        </div>
        <div class="detail">
          <div>{{imgInfo.prodName}}</div>
          <img v-if="imgInfo.detailPicture1Url" :src="`${baseUrl}/${imgInfo.detailPicture1Url}`" />
          <img v-if="imgInfo.detailPicture2Url" :src="`${baseUrl}/${imgInfo.detailPicture2Url}`" />
          <img v-if="imgInfo.detailPicture3Url" :src="`${baseUrl}/${imgInfo.detailPicture3Url}`" />
          <img v-if="imgInfo.detailPicture4Url" :src="`${baseUrl}/${imgInfo.detailPicture4Url}`" />
          <img v-if="imgInfo.detailPicture5Url" :src="`${baseUrl}/${imgInfo.detailPicture5Url}`" />
        </div>
      </div>
    </div>
    <div class="message">
      注：1、“列表浏览图”最多添加1张；<br>
      2、“详情图”最多添加5张。<br>
      3、“商品轮播图”最多添加5张。<br>
      4、列表预览图宽240像素， 高160像素。<br />
      5、详情图宽750像素，高不限。<br />
      6、商品轮播图宽750像素，高530像素。<br />
    </div>
  </div>
</template>
<script>
import { baseUrl } from '@/utils'
export default {
  props: {
    imgInfo: {
      type: Object
    }
  },
  watch: {},
  data() {
    return {
      baseUrl: baseUrl()
    }
  },
  methods: {
    // cancel() {
    // this.$emit('cancel', { type: 'info' })
    // }
  }
}
</script>
<style lang="scss" scoped>
.img-info {
  > div:nth-child(1) {
    display: flex;
    justify-content: space-between;
  }
  .preview-img, .detail-img .detail {
    height: 500px !important;
    width: 430px;
    overflow-y: auto;
    img {
      width: 100%;
    }
  }
  .preview-img {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 240px;
      height: 160px;
    }
    span {
      padding-left: 10px;
    }
  }
  .arrow-img {
    width: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 40px;
      height: 27px;
    }
  }
  .detail-img {
    text-align: center;
    > div:nth-child(1) {
      padding-bottom: 16px;
      img {
        width: 30px;
        margin-right: 10px;
      }
    }
    > div:nth-child(2) {
      img {
        width: 100%;
      }
    }
  }
  .el-carousel__item h3 {
    color: #475669;
    font-size: 18px;
    opacity: 0.75;
    line-height: 300px;
    margin: 0;
  }
  .message {
    color: #FF0000;
    font-size: 12px;
    padding: 38px 0 58px 0;
  }
}
</style>
