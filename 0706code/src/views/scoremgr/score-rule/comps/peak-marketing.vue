<template>
  <div class="tab">
    <div v-if="operateType == 'show'">
      <div v-for="(data, index) in datas" :key="index" class="tab-row">
        <div>
          {{ dataTypes[index] }}人才卡首次添加积分值{{ data.para2 }}分。
        </div>
      </div>
    </div>
    <div v-if="operateType === 'edit'" style="width: 100%">
      <el-form ref="editForm" :model="editForm" size="mini">
        <div
          class="tab-row"
          v-for="(data, index) in editForm.datas"
          :key="index"
        >
          <el-form-item
            label=""
            :prop="'datas.' + index + '.param2'"
            :rules="{ required: true, message: '请输入', trigger: 'change' }"
          >
            <el-select placeholder="请选择" v-model="data.param2">
              <el-option value="" label="请选择"></el-option>
              <el-option v-for="(item, index) in $root.selectOption.tdtsmst" :key="index" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item
            label="在"
            :prop="'datas.' + index + '.param3'"
            :rules="[
              { required: true, message: '请输入', trigger: 'change' },
              { validator: (rule, value, callback) => {
                checkDate(value, callback, index)
                }, trigger: 'change' }
            ]"
          >
            <el-date-picker
              v-model="data.param3"
              type="date"
              value-format="yyyy/MM/dd"
              format="yyyy/MM/dd"
              size="small"
              :editable="false"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item
            label="到"
            :prop="'datas.' + index + '.param4'"
            :rules="[
              { required: true, message: '请输入', trigger: 'change' },
              { validator: (rule, value, callback) => {
                checkDate(value, callback, index)
                }, trigger: 'change' }
            ]"
          >
            <el-date-picker
              v-model="data.param4"
              type="date"
              value-format="yyyy/MM/dd"
              format="yyyy/MM/dd"
              size="small"
              :editable="false"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item
            label="期间，交易金额每满"
            :prop="'datas.' + index + '.param5'"
            :rules="[
              { required: true, message: '请输入', trigger: 'blur' },
              { validator: checkIntegral, trigger: 'blur' }]"
          >
            <el-input
              v-model="data.param5"
              placeholder=""
              maxlength="16"
              style="padding: 0 10px"
            />
          </el-form-item>
          <el-form-item
            label="赠送"
            :prop="'datas.' + index + '.param6'"
            :rules="[
              { required: true, message: '请输入', trigger: 'blur' },
              { validator: checkIntegral, trigger: 'blur' }]"
          >
            <el-input
              v-model="data.param6"
              placeholder=""
              maxlength="16"
              style="padding: 0 10px"
            />
          </el-form-item>
          <el-form-item
            label="积分，单笔交易封顶"
            :prop="'datas.' + index + '.param7'"
            :rules="[
              { required: true, message: '请输入', trigger: 'blur' },
              { validator: checkIntegral, trigger: 'blur' }]"
          >
            <el-input
              v-model="data.param7"
              placeholder=""
              maxlength="16"
              style="padding: 0 10px"
            />
            </el-form-item
          >&nbsp;
          <span style="position: relative">
            积分
            <i class="el-icon-remove" v-if="index !== 0" @click="del(index)"></i>
          </span>
        </div>
      </el-form>
    </div>
    <el-button
      @click="add"
      style="margin-top: 90px"
      icon="el-icon-circle-plus"
      >添加规则</el-button
    >
    <div class="btn">
      <el-button
        type="primary"
        @click="save"
        v-show="operateType == 'edit'"
        :loading='loading'
        style="margin-top: 90px"
        >保存</el-button
      >
      <el-button
        type="primary"
        @click="publishDroolsRule"
        v-show="operateType == 'edit'"
        :loading='publishLoading'
        style="margin-top: 90px"
        >发布</el-button
      >
    </div>
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
      if (value === 'market') {
        this.getDroolsRule()
      }
    }
  },
  methods: {
    save() {
      this.$refs['editForm'].validate(valid => {
        if (valid) {
          this.updateDroolsRule()
        }
      })
    },
    // 保存
    updateDroolsRule() {
      this.loading = true
      this.editForm.datas.map((item, index) => {
        item.seqence = index + 1
      })
      API.scorerule.updateDroolsRule(this.editForm.datas).then(() => {
        this.loading = false
        this.$message.success('修改成功！')
      }).catch((error) => {
        this.loading = false
        this.$message.error(error.msg)
      })
    },
    // 查看
    getDroolsRule() {
      API.scorerule.getDroolsRule().then((res) => {
        this.editForm.datas = res.data.data
      }).catch(() => {
        this.$message.error('获取失败')
      })
    },
    // 发布
    publishDroolsRule() {
      this.publishLoading = true
      API.scorerule.publishDroolsRule().then(() => {
        this.publishLoading = false
        this.$message.success('发布成功！')
      }).catch(() => {
        this.publishLoading = false
        this.$message.error('发布失败！')
      })
    },
    // 添加规则
    add() {
      if (this.editForm.datas.length >= 10) {
        this.$message.warning('最多可添加10条规则！')
        return
      }
      this.editForm.datas.push({
        param2: '',
        param3: '',
        param4: '',
        param5: '',
        param6: '',
        param7: ''
      })
    },
    // 删除规则
    del(idx) {
      this.editForm.datas.splice(idx, 1)
    }
  },
  data() {
    var checkDate = (value, callback, index) => {
      let obj = this.editForm.datas[index]
      if (obj.param3 &&
          obj.param4 &&
          obj.param3 > obj.param4) {
        return callback(new Error('开始日期不能大于结束日期'))
      }
      return callback()
    }
    var checkIntegral = (rule, value, callback) => {
      if (!/^[+]{0,1}(\d+)$/.test(value)) {
        return callback(new Error('请输入整数'))
      }
      return callback()
    }
    return {
      checkDate,
      checkIntegral,
      operateType: 'edit',
      editForm: {
        datas: [
          {
            param2: '',
            param3: '',
            param4: '',
            param5: '',
            param6: '',
            param7: ''
          }
        ]
      },
      tdtsmst: {},
      publishLoading: false,
      loading: false
    }
  },
  created() {
    this.$root.selectOption.tdtsmst.map(item => {
      this.tdtsmst[item.value] = item.label
    })
  }
}
</script>
<style lang="scss" scoped>
.tab {
  /deep/ .el-input {
    width: 80px;
    padding: 0 !important;
  }
  /deep/ .el-date-editor {
    width: 140px;
  }
  /deep/ .el-form-item {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0;
  }
  /deep/ .el-select {
    .el-input {
      width: 110px;
    }
  }
  /deep/ .el-form-item__label {
    padding: 0 5px;
  }
  /deep/ .el-form-item.is-required .el-form-item__label:before {
    content: '';
  }
  margin-bottom: 10px;
  > div:nth-child(1) {
    border: 1px solid #d9d9d9;
  }
  .tab-row {
    width: 100%;
    padding: 14px 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    // position: relative;
  }
  .tab-row:nth-child(2n + 1) {
    background-color: #f3f3f3;
  }
  /deep/ .el-icon-remove {
    color: red;
    font-size: 20px;
    position: absolute;
    right: -30px;
    top: 0;
    cursor: pointer;
  }
  /deep/ .el-button {
    margin-top: 40px !important
  }
  .btn {
    text-align: center;
  }
}
</style>
