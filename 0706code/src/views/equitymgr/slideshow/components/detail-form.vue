<template>
  <div class="detail-dialog">
    <el-dialog title="轮播图详情" :visible.sync="dialogVisible" width="1150px" :before-close="handleClose">
      <div v-loading="waitLoading">
        <div class="detail-row">
          <div class="detail-item">
            <span class="detail-item-label">活动名称：</span>
            <el-input disabled v-model="slideInfo.actName" />
          </div>
          <div class="detail-item">
            <span class="detail-item-label">活动渠道：</span>
            <el-select disabled v-model="slideInfo.actChannel">
              <el-option v-for="(item,index) in $root.selectOption.channel" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </div>
        </div>
        <div class="detail-row">
          <div class="detail-item">
            <span class="detail-item-label">活动开始时间：</span>
            <el-input disabled v-model="slideInfo.actBegtime" />
          </div>
          <div class="detail-item">
            <span class="detail-item-label">活动结束时间：</span>
            <el-input disabled v-model="slideInfo.actEndtime" />
          </div>
        </div>
        <div class="detail-row">
          <div class="detail-item">
            <span class="detail-item-label">活动状态：</span>
            <el-select disabled v-model="slideInfo.actStatus">
              <el-option v-for="item in actStatusOptions" :key="item.key" :label="item.name" :value="item.key" />
            </el-select>
          </div>
          <div class="detail-item">
            <span class="detail-item-label">轮播图状态：</span>
            <el-select disabled v-model="slideInfo.slideshowStatus">
              <el-option v-for="item in slideOptions" :key="item.key" :label="item.name" :value="item.key" />
            </el-select>
          </div>
        </div>
        <div class="detail-row">
          <div class="detail-item">
            <span class="detail-item-label">轮播图顺序：</span>
            <el-input disabled v-model="slideInfo.slideshowOrder" />
          </div>
        </div>
        <div class="detail-row">
          <div class="detail-item-title">
            <span class="detail-item-label">图片标题文字：</span>
            <el-input disabled v-model="slideInfo.pictureTitleText" />
          </div>
        </div>
        <div class="detail-row">
          <div class="detail-item-title">
            <span class="detail-item-label">轮播图片：</span>
            <img :src="`${baseUrl}/${slideInfo.pictureUrl}`" alt="轮播图">
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import API from '@/api'
  import { baseUrl } from '@/utils'
  const actChannelOptions = [{
    key: '1',
    name: '财富'
  }, {
    key: '2',
    name: '直销'
  }, {
    key: '3',
    name: '信用卡'
  }]
  const actStatusOptions = [{
    key: '1',
    name: '草稿'
  }, {
    key: '2',
    name: '同意'
  }, {
    key: '3',
    name: '下线'
  }, {
    key: '4',
    name: '上线'
  }, {
    key: '5',
    name: '待审批'
  }, {
    key: '6',
    name: '驳回'
  }, {
    key: '7',
    name: '已结束'
  }]
  const slideOptions = [{
    key: '1',
    name: '草稿'
  }, {
    key: '2',
    name: '同意'
  }, {
    key: '3',
    name: '下线'
  }, {
    key: '4',
    name: '上线'
  }, {
    key: '5',
    name: '待审批'
  }, {
    key: '6',
    name: '驳回'
  }]
  export default {
    props: {
      // 客户号
      id: {
        type: String
      },
      // 弹框显隐
      dialogVisible: {
        type: Boolean
      }
    },
    data() {
      return {
        baseUrl: baseUrl(),
        waitLoading: false,
        actChannelOptions,
        actStatusOptions,
        slideOptions,
        slideInfo: {
          actName: '',
          actChannel: '',
          actBegtime: '',
          actEndtime: '',
          actStatus: '',
          slideshowStatus: '',
          slideshowOrder: '',
          pictureTitleText: '',
          pictureUrl: ''
        }
      }
    },
    methods: {
      handleClose(done) {
        this.$emit('onCancel')
      }
    },
    watch: {
      dialogVisible(value) {
        if (value) {
          this.$nextTick(() => {
            this.waitLoading = true
            API.slide.getSlideDetailData({
              id: this.id
            }).then(response => {
              this.waitLoading = false
              var resData = response.data.data
              this.slideInfo = {
                actName: resData.actName,
                actChannel: resData.actChannel,
                actBegtime: resData.actBegtime,
                actEndtime: resData.actEndtime,
                actStatus: resData.actStatus,
                slideshowStatus: resData.slideshowStatus,
                slideshowOrder: resData.slideshowOrder,
                pictureTitleText: resData.pictureTitleText,
                pictureUrl: resData.pictureUrl
              }
            }).catch(response => {
              this.waitLoading = false
              this.$message({
                message: response.msg,
                type: 'warning'
              })
            })
          })
        } else {
          this.slideInfo = {
            actName: '',
            actChannel: '',
            actBegtime: '',
            actEndtime: '',
            actStatus: '',
            slideshowStatus: '',
            slideshowOrder: '',
            pictureTitleText: '',
            pictureUrl: ''
          }
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .detail-dialog {
    .detail-row {
      display: flex;
      margin-bottom: 20px;

      .detail-item {
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

        /deep/ .el-input {
          width: 260px;

          /deep/ .el-input__inner {
            height: 26px;
          }
        }
      }

      .detail-item:first-child {
        margin-right: 67px;
      }

      .detail-item-title {
        /deep/ .el-input {
          width: 700px;

          /deep/ .el-input__inner {
            height: 26px;
          }
        }

        img {
          width: 700px;
          height: 240px;
        }
      }

      .detail-item-label {
        width: 100px;
        margin-right: 10px;
        display: inline-block;
        text-align: right;
      }
    }
  }
</style>
