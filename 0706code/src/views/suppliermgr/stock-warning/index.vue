<template>
  <div v-loading="vloading" class="stock-warning">
    <div class="stock-form">
      <el-form
        size="mini"
        :model="data"
        :rules="rules"
        label-width="200px"
        class="demo-dynamic"
      >
        <el-form-item label="权益上线活动库存少于" prop="para1">
          <el-input v-model="data.para1" @blur="inputBlur($event, 'para1')"></el-input>
          <span class="input-text">%时，给业务人员发送预警提示</span>
        </el-form-item>
        <el-form-item label="抽奖上线活动库存少于" prop="para2">
          <el-input v-model="data.para2" @blur="inputBlur($event, 'para2')"></el-input>
          <span class="input-text">%时，给业务人员发送预警提示</span>
        </el-form-item>
        <el-form-item label="主题上线活动库存少于" prop="para3">
          <el-input v-model="data.para3" @blur="inputBlur($event, 'para3')"></el-input>
          <span class="input-text">%时，给业务人员发送预警提示</span>
        </el-form-item>
      </el-form>
    </div>
    <div class="search-btns">
      <el-button
        type="primary"
        icon="el-icon-query"
        @click="onSaveBtn"
        :loading="saveLoading"
        >保存</el-button
      >
    </div>
  </div>
</template>

<script>
import API from '@/api'
export default {
  data() {
    var validateNum = (rule, value, callback) => {
      if (!/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(value)) {
        return callback(new Error('请输入正数！'))
      }
      if (
        value !== '' &&
        String(value).split('.')[1] &&
        String(value).split('.')[1].length > 2
      ) {
        return callback(new Error('最多保留小数点后2位！'))
      }
      if (
        value !== '' &&
        String(value).split('.')[0] &&
        String(value).split('.')[0].length > 2
      ) {
        return callback(new Error('整数部分最多2位！'))
      }
      return callback()
    }
    return {
      data: {
        para1: '',
        para2: '',
        para3: ''
      },
      rules: {
        para1: [
          {
            required: true,
            message: '请输入',
            trigger: 'blur'
          },
          {
            validator: validateNum,
            trigger: 'blur'
          }
        ],
        para2: [
          {
            required: true,
            message: '请输入',
            trigger: 'blur'
          },
          {
            validator: validateNum,
            trigger: 'blur'
          }
        ],
        para3: [
          {
            required: true,
            message: '请输入',
            trigger: 'blur'
          },
          {
            validator: validateNum,
            trigger: 'blur'
          }
        ]
      },
      saveLoading: false,
      vloading: true,
      showPage: true
    }
  },
  methods: {
    inputBlur(e, arg) {
      let value = e.target.value
      // 保证输入的第一个不是小数点
      value = value.replace(/^\./g, '')
      // 输入小数点只能是一个
      value = value
        .replace('.', '$#$')
        .replace(/\./g, '')
        .replace('$#$', '.')
      this.data[arg] = value
    },
    onSaveBtn() {
      // 保存
      this.vloading = true
      this.saveLoading = true
      let param = []
      param.push(this.data)
      API.scorerule
        .update(param)
        .then(res => {
          this.getScoreByType()
          this.saveLoading = false
          this.vloading = false
          this.$message.success('操作成功!')
        })
        .catch(() => {
          this.saveLoading = false
          this.vloading = false
          this.$message.error('操作失败!')
        })
    },
    // 查询积分配置
    getScoreByType() {
      this.vloading = true
      API.scorerule
        .getScoreByType('18', this.$store.state.user.channel)
        .then(res => {
          res.data.data.forEach(data => {
            data.modifyEmpNo = this.$store.state.user.id
            data.modifyEmpName = this.$store.state.user.name
          })
          this.data = res.data.data[0]
          this.vloading = false
        })
        .catch(error => {
          this.vloading = false
          this.$message.error(error.msg)
        })
    }
  },
  mounted() {
    this.getScoreByType()
  }
}
</script>
<style lang="scss" scoped>
.stock-warning {
  // text-align: center;
  .stock-form {
    display: flex;
    justify-content: center;
  }
  /deep/ .el-form-item__content {
    display: flex;
  }
  /deep/ .el-input--mini {
    width: 100px;
  }
  .input-text {
    margin-left: 10px;
  }
  .search-btns {
    text-align: center;
  }
}
</style>
