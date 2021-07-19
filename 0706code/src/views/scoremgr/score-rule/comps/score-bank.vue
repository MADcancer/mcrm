<template>
  <div class="score-rule">
    <el-tabs
      v-model="ruleType"
      @tab-click="handleClick"
      style="text-align: center"
      v-loading="vloading"
    >
      <!-- 登录 -->
      <el-tab-pane label="登录" name="21">
        <div class="tab">
          <div v-if="type == 'show'">
            <div class="title">
              登录积分规则
            </div>
            <div
              v-for="(data, index) in datas"
              :key="index"
              class="tab-row"
            >
              <div>
                操作员登录成功，对应的客户登录次数计一次，给予{{data.para3}}积分
              </div>
            </div>
          </div>
          <div v-if="type === 'edit' && ruleType === '21'" style="width: 95%">
            <div class="title">
              登录资产积分规则
            </div>
            <div
              v-for="(data, index) in datas"
              :key="index"
              class="tab-row"
            >
              <div>
                操作员登录成功，对应的客户登录次数计一次，给予
                <span style="position: relative">
                  <el-input
                    placeholder=""
                    v-model="data.para3"
                    @blur="checkIntegral(index, 'para3', 'msg3')"
                    maxlength="16"
                    style="padding: 0 10px"
                  />
                  <span class="msg">{{ data.msg3 }}</span>
                </span>
                积分
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <!-- 账单查询 -->
      <el-tab-pane label="账单查询" name="22">
        <div class="tab">
          <div v-if="type == 'show'">
            <div class="title">
              账单查询规则
            </div>
            <div
              v-for="(data, index) in datas"
              :key="index"
              class="tab-row"
            >
              <div>
                操作员点击“账户查询”菜单，查询笔数计一次，给予{{data.para3}}积分
              </div>
            </div>
          </div>
          <div v-if="type === 'edit' && ruleType === '22'" style="width: 95%">
            <div class="title">
              账单查询规则
            </div>
            <div
              v-for="(data, index) in datas"
              :key="index"
              class="tab-row"
            >
              <div>
                操作员点击“账户查询”菜单，查询笔数计一次，给予
                <span style="position: relative">
                  <el-input
                    placeholder=""
                    v-model="data.para3"
                    @blur="checkIntegral(index, 'para3', 'msg3')"
                    maxlength="16"
                    style="padding: 0 10px"
                  />
                  <span class="msg">{{ data.msg3 }}</span>
                </span>
                积分
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <!-- 转账笔数规则 -->
      <el-tab-pane label="转账笔数" name="23">
        <div class="tab">
          <div v-if="type == 'show'">
            <div class="title">
              转账笔数规则
            </div>
            <div
              v-for="(data, index) in datas"
              :key="index"
              class="tab-row"
            >
              <div>
                转账交易成功，转账笔数计一次，给予{{data.para3}}积分
              </div>
            </div>
          </div>
          <div v-if="type === 'edit' && ruleType === '23'" style="width: 95%">
            <div class="title">
              转账笔数规则
            </div>
            <div
              v-for="(data, index) in datas"
              :key="index"
              class="tab-row"
            >
              <div>
                转账交易成功，转账笔数计一次，给予
                <span style="position: relative">
                  <el-input
                    placeholder=""
                    v-model="data.para3"
                    @blur="checkIntegral(index, 'para3', 'msg3')"
                    maxlength="16"
                    style="padding: 0 10px"
                  />
                  <span class="msg">{{ data.msg3 }}</span>
                </span>
                积分
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <!-- 转账金额规则 --> 
      <el-tab-pane label="转账金额" name="24">
        <div class="tab">
          <div v-if="type == 'show'">
            <div class="title">
              转账金额规则
            </div>
            <div
              v-for="(data, index) in datas"
              :key="index"
              class="tab-row"
            >
              <div v-if="data.para1 === null">
                转账交易成功，金额为{{data.para2}}（含）万以内，给予{{data.para3}}积分
              </div>
              <div v-else-if="data.para2 === null">
                转账交易成功，金额为{{data.para1}}万以上，给予{{data.para3}}积分
              </div>
              <div v-else>
                转账交易成功，金额为{{data.para1}}-{{data.para2}}（含）万，给予{{data.para3}}积分
              </div>
            </div>
          </div>
          <div v-if="type === 'edit' && ruleType === '24'" style="width: 95%">
            <div class="title">
              转账金额规则
            </div>
            <div
              v-for="(data, index) in datas"
              :key="index"
              class="tab-row"
            >
              <div v-if="data.para1 === null">
                转账交易成功，金额为
                <span style="position: relative">
                  <el-input
                    placeholder=""
                    v-model="data.para2"
                    @blur="checkIntegral(index, 'para2', 'msg2')"
                    maxlength="16"
                    style="padding: 0 10px"
                  />
                  <span class="msg">{{ data.msg2 }}</span>
                </span>
                （含）万以内，给予
                <span style="position: relative">
                  <el-input
                    placeholder=""
                    v-model="data.para3"
                    @blur="checkIntegral(index, 'para3', 'msg3')"
                    maxlength="16"
                    style="padding: 0 10px"
                  />
                  <span class="msg">{{ data.msg3 }}</span>
                </span>
                积分
              </div>
              <div v-else-if="data.para2 === null">
                转账交易成功，金额为
                <span style="position: relative">
                  <el-input
                    placeholder=""
                    v-model="data.para1"
                    @blur="checkIntegral(index, 'para1', 'msg1')"
                    maxlength="16"
                    style="padding: 0 10px"
                  />
                  <span class="msg">{{ data.msg1 }}</span>
                </span>
                万以上，给予
                <span style="position: relative">
                  <el-input
                    placeholder=""
                    v-model="data.para3"
                    @blur="checkIntegral(index, 'para3', 'msg3')"
                    maxlength="16"
                    style="padding: 0 10px"
                  />
                  <span class="msg">{{ data.msg3 }}</span>
                </span>
                积分
              </div>
              <div v-else>
                转账交易成功，金额为
                <span style="position: relative">
                  <el-input
                    placeholder=""
                    v-model="data.para1"
                    @blur="checkIntegral(index, 'para1', 'msg1')"
                    maxlength="16"
                    style="padding: 0 10px"
                  />
                  <span class="msg">{{ data.msg1 }}</span>
                </span>
                -
                <span style="position: relative">
                  <el-input
                    placeholder=""
                    v-model="data.para2"
                    @blur="checkIntegral(index, 'para2', 'msg2')"
                    maxlength="16"
                    style="padding: 0 10px"
                  />
                  <span class="msg">{{ data.msg2 }}</span>
                </span>
                （含）万，给予
                <span style="position: relative">
                  <el-input
                    placeholder=""
                    v-model="data.para3"
                    @blur="checkIntegral(index, 'para3', 'msg3')"
                    maxlength="16"
                    style="padding: 0 10px"
                  />
                  <span class="msg">{{ data.msg3 }}</span>
                </span>
                积分
                <i @click="deleteRow(index)" class="el-icon-remove"></i>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <!-- 代发笔数规则 -->
      <el-tab-pane label="代发笔数" name="25">
        <div class="tab">
          <div v-if="type == 'show'">
            <div class="title">
              代发笔数规则
            </div>
            <div
              v-for="(data, index) in datas"
              :key="index"
              class="tab-row"
            >
              <div v-if="data.para1 === null">
                成功代发笔数为{{data.para2}}笔（含）以内，给予{{data.para3}}积分
              </div>
              <div v-else-if="data.para2 === null">
                成功代发笔数为{{data.para1}}笔（含）以上，给予{{data.para3}}积分
              </div>
              <div v-else>
                成功代发笔数为{{data.para1}}-{{data.para2}}（含）笔，给予{{data.para3}}积分
              </div>
            </div>
          </div>
          <div v-if="type === 'edit' && ruleType === '25'" style="width: 95%">
            <div class="title">
              代发笔数规则
            </div>
            <div
              v-for="(data, index) in datas"
              :key="index"
              class="tab-row"
            >
              <div v-if="data.para1 === null">
                成功代发笔数为
                <span style="position: relative">
                  <el-input
                    placeholder=""
                    v-model="data.para2"
                    @blur="checkIntegral(index, 'para2', 'msg2')"
                    maxlength="16"
                    style="padding: 0 10px"
                  />
                  <span class="msg">{{ data.msg2 }}</span>
                </span>
                笔（含）以上，给予
                <span style="position: relative">
                  <el-input
                    placeholder=""
                    v-model="data.para3"
                    @blur="checkIntegral(index, 'para3', 'msg3')"
                    maxlength="16"
                    style="padding: 0 10px"
                  />
                  <span class="msg">{{ data.msg3 }}</span>
                </span>
                积分
              </div>
              <div v-else-if="data.para2 === null">
                成功代发笔数为
                <span style="position: relative">
                  <el-input
                    placeholder=""
                    v-model="data.para1"
                    @blur="checkIntegral(index, 'para1', 'msg1')"
                    maxlength="16"
                    style="padding: 0 10px"
                  />
                  <span class="msg">{{ data.msg1 }}</span>
                </span>
                笔（含）以上，给予
                <span style="position: relative">
                  <el-input
                    placeholder=""
                    v-model="data.para3"
                    @blur="checkIntegral(index, 'para3', 'msg3')"
                    maxlength="16"
                    style="padding: 0 10px"
                  />
                  <span class="msg">{{ data.msg3 }}</span>
                </span>
                积分
              </div>
              <div v-else>
                成功代发笔数为
                <span style="position: relative">
                  <el-input
                    placeholder=""
                    v-model="data.para1"
                    @blur="checkIntegral(index, 'para1', 'msg1')"
                    maxlength="16"
                    style="padding: 0 10px"
                  />
                  <span class="msg">{{ data.msg1 }}</span>
                </span>
                -
                <span style="position: relative">
                  <el-input
                    placeholder=""
                    v-model="data.para2"
                    @blur="checkIntegral(index, 'para2', 'msg2')"
                    maxlength="16"
                    style="padding: 0 10px"
                  />
                  <span class="msg">{{ data.msg2 }}</span>
                </span>
                （含）笔，给予
                <span style="position: relative">
                  <el-input
                    placeholder=""
                    v-model="data.para3"
                    @blur="checkIntegral(index, 'para3', 'msg3')"
                    maxlength="16"
                    style="padding: 0 10px"
                  />
                  <span class="msg">{{ data.msg3 }}</span>
                </span>
                积分
                <i @click="deleteRow(index)" class="el-icon-remove"></i>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <!-- 代发金额规则 -->
      <el-tab-pane label="代发金额" name="26">
        <div class="tab">
          <div v-if="type == 'show'">
            <div class="title">
              代发金额规则
            </div>
            <div
              v-for="(data, index) in datas"
              :key="index"
              class="tab-row"
            >
              <div v-if="data.para1 === null">
                代发金额为{{data.para2}}万（含）以内，给予{{data.para3}}积分
              </div>
              <div v-else-if="data.para2 === null">
                代发金额为{{data.para1}}万以上，给予{{data.para3}}积分
              </div>
              <div v-else>
                代发金额为{{data.para1}}-{{data.para2}}（含）万，给予{{data.para3}}积分
              </div>
            </div>
          </div>
          <div v-if="type === 'edit' && ruleType === '26'" style="width: 95%">
            <div class="title">
              代发金额规则
            </div>
            <div
              v-for="(data, index) in datas"
              :key="index"
              class="tab-row"
            >
              <div v-if="data.para1 === null">
                代发金额为
                <span style="position: relative">
                  <el-input
                    placeholder=""
                    v-model="data.para2"
                    @blur="checkIntegral(index, 'para2', 'msg2')"
                    maxlength="16"
                    style="padding: 0 10px"
                  />
                  <span class="msg">{{ data.msg2 }}</span>
                </span>
                万（含）以内，给予
                <span style="position: relative">
                  <el-input
                    placeholder=""
                    v-model="data.para3"
                    @blur="checkIntegral(index, 'para3', 'msg3')"
                    maxlength="16"
                    style="padding: 0 10px"
                  />
                  <span class="msg">{{ data.msg3 }}</span>
                </span>
                积分
              </div>
              <div v-else-if="data.para2 === null">
                代发金额为
                <span style="position: relative">
                  <el-input
                    placeholder=""
                    v-model="data.para1"
                    @blur="checkIntegral(index, 'para1', 'msg1')"
                    maxlength="16"
                    style="padding: 0 10px"
                  />
                  <span class="msg">{{ data.msg1 }}</span>
                </span>
                万以上，给予
                <span style="position: relative">
                  <el-input
                    placeholder=""
                    v-model="data.para3"
                    @blur="checkIntegral(index, 'para3', 'msg3')"
                    maxlength="16"
                    style="padding: 0 10px"
                  />
                  <span class="msg">{{ data.msg3 }}</span>
                </span>
                积分
              </div>
              <div v-else>
                代发金额为
                <span style="position: relative">
                  <el-input
                    placeholder=""
                    v-model="data.para1"
                    @blur="checkIntegral(index, 'para1', 'msg1')"
                    maxlength="16"
                    style="padding: 0 10px"
                  />
                  <span class="msg">{{ data.msg1 }}</span>
                </span>
                -
                <span style="position: relative">
                  <el-input
                    placeholder=""
                    v-model="data.para2"
                    @blur="checkIntegral(index, 'para2', 'msg2')"
                    maxlength="16"
                    style="padding: 0 10px"
                  />
                  <span class="msg">{{ data.msg2 }}</span>
                </span>
                （含）万，给予
                <span style="position: relative">
                  <el-input
                    placeholder=""
                    v-model="data.para3"
                    @blur="checkIntegral(index, 'para3', 'msg3')"
                    maxlength="16"
                    style="padding: 0 10px"
                  />
                  <span class="msg">{{ data.msg3 }}</span>
                </span>
                积分
                <i @click="deleteRow(index)" class="el-icon-remove"></i>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <!-- 银企对账笔数规则 -->
      <el-tab-pane label="银企对账笔数" name="27">
        <div class="tab">
          <div v-if="type == 'show'">
            <div class="title">
              银企对账笔数规则
            </div>
            <div 
            v-for="(data, index) in datas"
            :key="index"
            class="tab-row">
              <div>
                 {{ dataTypes[index] }}对账交易提交成功，给予{{
                  data.para3
                }}积分。
              </div>
            </div>
          </div>
          <div v-if="type === 'edit' && ruleType === '27'" style="width: 95%">
            <div class="title">
              银企对账笔数规则
            </div>
            <div 
              v-for="(data, index) in datas"
              :key="index"
              class="tab-row">
              <div>
                {{ dataTypes[index] }}对账交易提交成功，给予
                <span style="position: relative">
                  <el-input
                    v-model="data.para3"
                    placeholder=""
                    @blur="checkIntegral(index, 'para3', 'msg3')"
                    maxlength="16"
                    style="padding: 0 10px"
                  />
                  <span class="msg">{{ data.msg3 }}</span>
                </span>
                积分
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-button
        v-if="type == 'edit'&&canAddRuleType.includes(ruleType)"
        @click="addRule"
        style="margin-top: 90px"
        icon="el-icon-circle-plus"
      >添加规则
      </el-button>
      <el-button
        v-if="isAuth('sys:rule:save')"
        type="primary"
        @click="cancel"
        v-show="type == 'edit'"
        :loading="loading"
        icon="el-icon-document"
        style="margin-top: 90px"
        >取消</el-button
      >
      <el-button
        v-if="isAuth('sys:rule:save')"
        type="primary"
        @click="save"
        v-show="type == 'edit'"
        :loading="loading"
        icon="el-icon-document"
        style="margin-top: 90px"
        >保存</el-button
      >
      <el-button
        v-if="isAuth('sys:rule:save')"
        type="primary"
        @click="type = 'edit'"
        v-show="type == 'show'"
        icon="el-icon-edit"
        style="margin-top: 90px"
        >修改</el-button
      >
    </el-tabs>
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
      if (value === 'bank') {
        this.getScoreByType()
      }
    }
  },
  data() {
    return {
      type: 'show',
      ruleType: '21',
      vloading: false,
      dataTypes: ['企业网银', '微信', '手机银行'],
      datas: [],
      loading: false,
      canAddRuleType: ['24', '25', '26'] // 能够编辑的tab集合
    }
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event)
      this.getScoreByType()
    },

    // 取消
    cancel() {
      this.getScoreByType()
    },

    // 保存
    save() {
      if (this.canAddRuleType.includes(this.ruleType)) { // 新增规则额外校验
        this.datas.map((item, index) => {
          if (index !== 0 && index !== this.datas.length - 1) {
            this.checkIntegral(index, 'para1', 'msg1')
            this.checkIntegral(index, 'para2', 'msg2')
            this.checkIntegral(index, 'para3', 'msg3')
            if (this.datas[index]['para1'] > this.datas[index]['para2']) {
              this.setMessage(index, 'msg2', '范围最大值不能小于最小值')
            }
          }
        })
      }
      // check是否有msg
      let params = [...this.datas]
      for (let index in params) {
        if (params[index].msg1 || params[index].msg2 || params[index].msg3) {
          return
        }
      }
      params.sort((a, b) => {
        return a['para1'] - b['para1']
      })
      this.vloading = true
      this.loading = true
      // 保存
      API.scorerule
        .updateWy(params)
        .then(res => {
          this.getScoreByType()
          this.loading = false
          this.type = 'show'
          this.$message.success('操作成功!')
        })
        .catch(() => {
          this.loading = false
          this.vloading = false
          this.$message.error('操作失败!')
        })
    },

    // 查询积分配置
    getScoreByType() {
      this.vloading = true
      this.msg = ''
      API.scorerule
        .getScoreByTypeWy(this.ruleType, this.$store.state.user.channel) // 企业网银渠道写死为5
        .then(res => {
          res.data.data.forEach(data => {
            data.modifyEmpNo = this.$store.state.user.id
            data.modifyEmpName = this.$store.state.user.name
          })
          this.datas = res.data.data
          this.vloading = false
          this.type = 'show'
        }).catch((error) => {
          this.vloading = false
          this.type = 'show'
          this.$message.error(error.msg)
        })
    },

    // check 积分
    checkIntegral(index, param, msg) {
      this.setMessage(index, msg, '')
      let value = this.datas[index][param]
      if (!(value + '')) {
        this.setMessage(index, msg, '数据不能为空')
        return
      }
      if (!/^[+]{0,1}(\d+)$/.test(value)) {
        this.setMessage(index, msg, '请输入整数')
      }
    },
    // 设置message
    setMessage(index, msg, content) {
      this.$set(
        this.datas[index],
        msg,
        content
      )
    },
    // 删除规则
    deleteRow(idx) {
      this.datas.splice(idx, 1)
    },
    // 增加规则
    addRule() {
      const item = {
        ruletype: this.ruleType,
        para1: this.datas[this.datas.length - 2] ? this.datas[this.datas.length - 2].para2 : '',
        para2: '',
        para3: '',
        scoreChannel: this.$store.state.user.channel
      }
      this.datas.splice(-1, 0, item)
    }
  },

  created() {
    // 获取积分配置
    this.getScoreByType()
  }
}
</script>

<style lang="scss" scoped>
.tab {
  margin-bottom: 10px;
  > div {
    width: 840px;
    margin: 0 auto;
    border: 1px solid #d9d9d9;
    position: relative;
    > div {
      // min-height: 44px;
      padding: 10px;
      color: #262626;
    }
  }
  .tab-row {
    width: 100%;
    border-top: 1px solid #d9d9d9;
    > div {
      text-align: left;
      display: inline-block;
    }
  }
  .tab-row:nth-child(2n + 1) {
    background-color: #f3f3f3;
  }
  .title {
    background: #da8b04;
    color: #ffffff;
  }
}

.score-rule {
  /deep/ .el-input {
    width: 120px;
  }
  /deep/ .el-input__inner {
    height: 30px;
    line-height: 30px;
  }
}
.msg {
  color: red !important;
  position: absolute;
  top: 20px;
  left: 10px;
  width: 180px;
}
/deep/ .el-icon-remove {
  color: red;
  font-size: 16px;
  cursor: pointer;
  position: relative;
  left: 10px;
}
.info {
  text-align: left;
  padding: 60px 0 0 60px;
  display: block;
}
</style>
