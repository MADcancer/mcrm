<template>
  <div class="score-convert">
    <div>
      <img src="~@/assets/img/vip-logo.png" />
      <div><span>财富积分</span><span>×</span><span>财富积分折算率</span></div>
      <span style="position: relative">
        <el-input
          v-model="datas[0].para1"
          autocomplete="off"
          @blur="inputBlur(0, 'para1')"
          :disabled="$store.state.user.channel !== '1' || $store.state.user.roleId.toString().indexOf('03') === -1"
          style="padding: 0 10px"
        />
        <span class="msg">{{ datas[0].msg }}</span>
      </span>
      % = 平台积分
    </div>
    <div>
      <img src="~@/assets/img/huipu-logo.png" />
      <div><span>直销积分</span><span>×</span><span>直销积分折算率</span></div>
      <span style="position: relative">
        <el-input
          v-model="datas[1].para1"
          autocomplete="off"
          @blur="inputBlur(1)"
          :disabled="$store.state.user.channel !== '2' || $store.state.user.roleId.toString().indexOf('03') === -1"
          style="padding: 0 10px"
        />
        <span class="msg">{{ datas[1].msg }}</span>
      </span>
      % = 平台积分
    </div>
    <div>
      <img src="~@/assets/img/credit-logo.png" />
      <!-- <span>信用卡积分 ×  信用卡积分折算率</span> -->
      <div>
        <span>信用卡积分</span><span>×</span><span>信用卡积分折算率</span>
      </div>
      <span style="position: relative">
        <el-input
          v-model="datas[2].para1"
          autocomplete="off"
          @blur="inputBlur(2)"
          :disabled="$store.state.user.channel !== '3' || $store.state.user.roleId.toString().indexOf('03') === -1"
          style="padding: 0 10px"
        />
        <span class="msg">{{ datas[2].msg }}</span>
      </span>
      % = 平台积分
    </div>
    <el-button
      v-if="isAuth('sys:rule:save')"
      type="primary"
      @click="save"
      icon="el-icon-document"
      :loading="loading"
      style="margin-top: 90px"
      >保存</el-button
    >
  </div>
</template>

<script>
import API from '@/api'
export default {
  props: {
    name: {
      type: String
    }
  },
  watch: {
    name(value) {
      if (value === 'convert') {
        this.getScoreConvert()
      }
    }
  },
  data() {
    return {
      datas: [
        {
          converttype: '01',
          para1: ''
        },
        {
          converttype: '02',
          para1: ''
        },
        {
          converttype: '03',
          para1: ''
        }
      ],
      msg: '',
      loading: false
    }
  },

  methods: {
    getScoreConvert() {
      API.scorerule.getScoreConvert('all').then(res => {
        if (res.data.data.length > 0) {
          res.data.data.forEach(data => {
            data.modifyEmpNo = this.$store.state.user.id
            data.modifyEmpName = this.$store.state.user.name
            data.para1 = data.para1.toFixed(4)
          })
          this.datas = res.data.data
        } else {
          this.datas.forEach(data => {
            data.createEmpNo = this.$store.state.user.id
            data.createEmpName = this.$store.state.user.name
          })
        }
      })
    },

    inputBlur(index) {
      this.$set(this.datas[index], 'msg', '')
      // 保证输入的第一个不是小数点
      this.datas[index].para1 = this.datas[index].para1.replace(/^\./g, '')
      // 输入小数点只能是一个
      this.datas[index].para1 = this.datas[index].para1
        .replace('.', '$#$')
        .replace(/\./g, '')
        .replace('$#$', '.')
      // 校验
      if (!this.datas[index].para1) {
        this.$set(this.datas[index], 'msg', '数据不能为空')
        return
      }
      if (!/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(this.datas[index].para1)) {
        this.$set(this.datas[index], 'msg', '必须为正数')
        return
      }
      if (
        String(this.datas[index].para1).split('.')[1] &&
        String(this.datas[index].para1).split('.')[1].length > 4
      ) {
        this.$set(this.datas[index], 'msg', '最多保留小数点后4位')
        return
      }
      if (this.datas[index].para1 > 100) {
        this.$set(this.datas[index], 'msg', '折算率不能超过100%')
      }
    },

    // 保存
    save() {
      for (let index in this.datas) {
        if (this.datas[index].msg) {
          return
        }
      }

      // 显示到小数点后四位
      this.datas.forEach((data) => {
        console.log(data)
        data.para1 = Number(data.para1).toFixed(4)
      })

      this.loading = true
      API.scorerule.updateConvert(this.datas).then(() => {
        this.loading = false
        this.$message.success('操作成功!')
      })
    }
  },
  created() {
    // 获取积分配置
    this.getScoreConvert()
  }
}
</script>

<style lang="scss" scoped>
.score-convert {
  text-align: center;
  > div {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #262626;
    width: 568px;
    height: 50px;
    border: 1px solid #d9d9d9;
    margin: 0 auto;
    margin-top: 12px;
    img {
      width: 30px;
      height: 30px;
      margin-right: 12px;
    }
    > div {
      width: 200px;
      display: flex;
      justify-content: space-around;
    }
    /deep/ .el-input {
      width: 120px;
      input {
        height: 30px;
        line-height: 30px;
      }
    }
    /deep/ .el-input__inner {
      height: 30px;
      line-height: 30px;
    }
  }
  .msg {
    position: absolute;
    color: red;
    text-align: left;
    top: 26px;
    left: 10px;
    width: 140px;
  }
}
</style>
