<template>
  <div class="slide-dialog">
    <el-dialog title="上线轮播图" :visible.sync="dialogVisible" width="542px" :before-close="handleClose">
      <div>
        <el-radio-group v-model="radio">
          <el-radio v-for="item in radioOptions" :key="item.key" :label="item.value" :value="item.value" :disabled="item.disabled"></el-radio>
        </el-radio-group>
        <div class="slide-dialog-btns">
          <el-button type="primary" :loading="btnStatus" @click="handleSubmit">提交</el-button>
          <el-button :disabled="btnStatus" @click="handleClose">取消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import API from '@/api'
  export default {
    props: {
      type: {
        type: String
      },
      // 弹框显隐
      dialogVisible: {
        type: Boolean
      }
    },
    data() {
      return {
        radio: '',
        btnStatus: false,
        radioOptions: [{
          key: 1,
          value: 1
        }, {
          key: 2,
          value: 2
        }, {
          key: 3,
          value: 3
        }, {
          key: 4,
          value: 4
        }, {
          key: 5,
          value: 5
        }]
      }
    },
    methods: {
      handleSubmit() {
        if (!this.radio) {
          this.$message({
            message: '请选择轮播图顺序!',
            type: 'warning'
          })
          return
        }
        this.btnStatus = true
        var obj = {
          slideshowOrder: this.radio
        }
        this.$emit('handleConfirm', obj)
      },
      handleClose() {
        this.$emit('onCancel')
      }
    },
    watch: {
      dialogVisible(value) {
        if (value) {
          API.slide.postSlideOrderSearchData(this.$store.state.user.channel).then(response => {
            var slideData = response.data.data.data
            var slideArr = []
            Object.keys(slideData).forEach(key => {
              var slideObj = {}
              if (key === 'order1') {
                slideObj.key = 1
                slideObj.value = 1
                // eslint-disable-next-line
                slideObj.disabled = slideData[key] === 1 ? true : false
              } else if (key === 'order2') {
                slideObj.key = 2
                slideObj.value = 2
                // eslint-disable-next-line
                slideObj.disabled = slideData[key] === 1 ? true : false
              } else if (key === 'order3') {
                slideObj.key = 3
                slideObj.value = 3
                // eslint-disable-next-line
                slideObj.disabled = slideData[key] === 1 ? true : false
              } else if (key === 'order4') {
                slideObj.key = 4
                slideObj.value = 4
                // eslint-disable-next-line
                slideObj.disabled = slideData[key] === 1 ? true : false
              } else {
                slideObj.key = 5
                slideObj.value = 5
                // eslint-disable-next-line
                slideObj.disabled = slideData[key] === 1 ? true : false
              }
              slideArr.unshift(slideObj)
            })
            this.radioOptions = slideArr
          }).catch(() => {})
        } else {
          this.radio = ''
          this.btnStatus = false
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .slide-dialog {
    .slide-dialog-btns {
      margin-top: 20px;
      display: flex;
      justify-content: center;
    }
  }
</style>
