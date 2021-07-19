<template>
  <div class="score-rule">
    <el-tabs
      v-model="ruleType"
      @tab-click="handleClick"
      style="text-align: center"
      v-loading="vloading"
    >
      <!-- 金融资产 -->
      <el-tab-pane label="金融资产" name="01">
        <div class="tab">
          <div v-if="type == 'show'">
            <div class="title">
              金融资产积分规则
            </div>
            <div
              v-for="(data, index) in datas"
              :key="index"
              class="tab-row"
            >
              <div>
                月日均余额每满{{ data.para1 }}万元，每月给予{{
                  data.para2
                }}积分，积分按月统计，并于次月累计至客户积分账户；
              </div>
            </div>
          </div>
          <div v-if="type === 'edit' && ruleType === '01'" style="width: 95%">
            <div class="title">
              金融资产积分规则
            </div>
            <div
              v-for="(data, index) in datas"
              :key="index"
              class="tab-row"
            >
              <div>
                月日均余额每满
                <span style="position: relative">
                  <el-input
                    placeholder=""
                    v-model="data.para1"
                    @blur="checkAccount(index, 'para1', 'msg1')"
                    style="padding: 0 10px"
                  />
                  <span class="msg">{{ data.msg1 }}</span> </span
                >万元，每月给予
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
                积分，积分按月统计，并于次月累计至客户积分账户；
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <!-- 新客奖励 -->
      <el-tab-pane label="新客奖励" name="02" class="reward-tab">
        <div class="tab">
          <div v-if="type == 'show'">
            <div class="title">
              新客奖励积分规则
            </div>
            <div
              v-for="(data, index) in rewardDatas"
              :key="index"
              class="tab-row"
              >
              <div>
                首次成为{{
                  options[data.para1]
                }}客户奖励{{
                  data.para2
                }}积分，并于次月累计至客户积分账户。
              </div>
            </div>
          </div>
          <div v-if="type === 'edit' && ruleType === '02'" style="width: 95%">
            <div class="title">
              新客奖励积分规则
            </div>
            <div  
              v-for="(data, index) in rewardDatas"
              :key="index"
              class="tab-row">
              <div>
                首次成为
                <el-select
                  v-model.number="data.para1"
                  placeholder=""
                  style="padding: 0 10px"
                  disabled
                >
                  <!-- <el-option label="请选择" value=""></el-option> -->
                  <el-option label="一星" :value="1"></el-option>
                  <el-option label="二星" :value="2"></el-option>
                  <el-option label="三星" :value="3"></el-option>
                  <el-option label="四星" :value="4"></el-option>
                  <el-option label="五星" :value="5"></el-option>
                  <el-option label="六星" :value="6"></el-option> </el-select
                >客户，给予
                <span style="position: relative">
                  <el-input
                    placeholder=""
                    v-model="data.para2"
                    @blur="checkIntegral(index, 'para2', 'msg2')"
                    maxlength="16"
                    style="padding: 0 10px"
                  />
                  <span class="msg">{{ data.msg2 }}</span> </span
                >积分；并于次月累计至客户积分账户。
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <!-- 交易类积分规则 -->
      <el-tab-pane label="交易类" name="03" class="transaction-tab">
        <div class="tab">
          <div v-if="type == 'show'">
            <div class="title">
              交易类积分规则
            </div>
            <div class="tab-row">
              <div>
                当年累计定投扣款{{
                  datas && datas[0] && datas[0].para1
                }}次以上，且累计扣款金额{{
                  datas && datas[0] && datas[0].para2
                }}元以上，给予{{
                  datas && datas[0] && datas[0].para3
                }}积分，积分按年统计，并于次年1月30日前累积至客户积分账户。
              </div>
            </div>
          </div>
          <div v-if="type === 'edit' && ruleType === '03'" style="width: 95%">
            <div class="title">
              交易类积分规则
            </div>
            <div class="tab-row">
              <div>
                当年累计基金定投扣款
                <span style="position: relative">
                  <el-input
                    v-model="datas[0].para1"
                    placeholder=""
                    @blur="checkIntegral(0, 'para1', 'msg1')"
                    maxlength="16"
                    style="padding: 0 10px"
                  />
                  <span class="msg">{{ datas[0].msg1 }}</span>
                </span>
                次以上，且累计扣款金额
                <span style="position: relative">
                  <el-input
                    placeholder=""
                    v-model="datas[0].para2"
                    @blur="checkAccount(0, 'para2', 'msg2')"
                    style="padding: 0 10px"
                  />
                  <span class="msg">{{ datas[0].msg2 }}</span>
                </span>
                元以上，给予
                <span style="position: relative">
                  <el-input
                    v-model="datas[0].para3"
                    placeholder=""
                    @blur="checkIntegral(0, 'para3', 'msg3')"
                    maxlength="16"
                  />
                  <span class="msg">{{ datas[0].msg3 }}</span>
                </span>
                积分，积分按年统计，并于次年1月30日前累积至客户积分账户
              </div>
            </div>
          </div>
        </div>
        <div class="info">
          注：1、周投/日投扣款成功当月结算一次；<br /><span
            style="padding-left: 30px"
            >2、单个客户每年仅认定一次。</span
          >
        </div>
      </el-tab-pane>
      <!-- 绑定快捷支付积分规则 -->
      <el-tab-pane label="绑定快捷支付" name="04">
        <div class="tab">
          <div v-if="type == 'show'">
            <div class="title">
              绑定快捷支付积分规则
            </div>
            <div v-for="(data, index) in datas" :key="index" class="tab-row">
              <div>
                借记卡绑定{{
                  bindTypes[index].value
                }}，并在一个自然年度内消费月数>={{ data.para1 }}，给予{{
                  data.para2
                }}积分，积分于达标后次年首月累计至客户积分账户；
              </div>
            </div>
          </div>
          <div v-if="type === 'edit' && ruleType === '04'" style="width: 95%">
            <div class="title">
              绑定快捷支付积分规则
            </div>
            <div v-for="(data, index) in datas" :key="index" class="tab-row">
              <div>
                借记卡绑定{{
                  bindTypes[index].value
                }}，并在一个自然年度内消费月数>=
                <span style="position: relative">
                  <el-input
                    placeholder=""
                    v-model="data.para1"
                    @blur="checkIntegral(index, 'para1', 'msg1')"
                    maxlength="16"
                    style="padding: 0 10px"
                  />
                  <span class="msg">{{ data.msg1 }}</span>
                </span>
                ，每月给予
                <span style="position: relative">
                  <el-input
                    placeholder=""
                    v-model="data.para2"
                    @blur="checkIntegral(index, 'para2', 'msg2')"
                    maxlength="16"
                    style="padding: 0 10px"
                  />
                  <span class="msg">{{ data.msg2 }}</span>
                </span>
                积分，积分于达标后次年首月累计至客户积分账户；
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <!-- 代收积分规则 -->
      <el-tab-pane label="代收业务" name="05">
        <div class="tab">
          <div v-if="type == 'show'">
            <div class="title">
              代收积分规则
            </div>
            <div class="tab-row">
              <div>
                在苏州银行主动签约代收业务，并在签约一年内发生{{
                  datas && datas[0] && datas[0].para1
                }}次（含）以上扣费，给予{{
                  datas && datas[0] && datas[0].para2
                }}积分，积分按月统计，并于达标后次月累计至客户积分账户。
              </div>
            </div>
          </div>
          <div v-if="type === 'edit' && ruleType === '05'" style="width: 95%">
            <div class="title">
              代收积分规则
            </div>
            <div class="tab-row">
              <div>
                在苏州银行主动签约代收业务，并在签约一年内发生
                <span style="position: relative">
                  <el-input
                    v-model="datas[0].para1"
                    placeholder=""
                    @blur="checkIntegral(0, 'para1', 'msg1')"
                    maxlength="16"
                    style="padding: 0 10px"
                  />
                  <span class="msg">{{ datas[0].msg1 }}</span>
                </span>
                次（含）以上扣费，给予
                <span style="position: relative">
                  <el-input
                    placeholder=""
                    v-model="datas[0].para2"
                    @blur="checkIntegral(0, 'para2', 'msg2')"
                    maxlength="16"
                    style="padding: 0 10px"
                  />
                  <span class="msg">{{ datas[0].msg2 }}</span>
                </span>
                积分；积分按月统计，并于达标后次月累计至客户积分账户。
              </div>
            </div>
          </div>
        </div>
        <div class="info">
          注：1、“代收业务”包括水费、电费、燃气费、通讯费、有线电视费、学费、物业费、党费的收费委托业务；<br />
          <span style="padding-left: 30px"
            >2、“扣费”指主动签约后系统自动发起并成功的代扣费行为。</span
          >
        </div>
      </el-tab-pane>
      <!-- 代发积分规则 -->
      <el-tab-pane label="代发工资" name="06">
        <div class="tab">
          <div v-if="type == 'show'">
            <div class="title">
              代发积分规则
            </div>
            <div class="tab-row">
              <div>
                当季度每月在苏州银行均有代发工资，每月给予{{
                  datas && datas[0] && datas[0].para1
                }}积分，每季度每个客户{{
                  datas && datas[0] && datas[0].para2
                }}积分封顶，积分按季统计，并于下一季度首月累积至客户积分账户。
              </div>
            </div>
          </div>
          <div v-if="type === 'edit' && ruleType === '06'" style="width: 95%">
            <div class="title">
              代发积分规则
            </div>
            <div class="tab-row">
              <div>
                当季度每月在苏州银行均有代发工资，每月给予
                <span style="position: relative">
                  <el-input
                    v-model="datas[0].para1"
                    placeholder=""
                    @blur="checkIntegral(0, 'para1', 'msg1')"
                    maxlength="16"
                    style="padding: 0 10px"
                  />
                  <span class="msg">{{ datas[0].msg1 }}</span>
                </span>
                积分，每季度每个客户
                <span style="position: relative">
                  <el-input
                    placeholder=""
                    v-model="datas[0].para2"
                    @blur="checkIntegral(0, 'para2', 'msg2')"
                    style="padding: 0 10px"
                  />
                  <span class="msg">{{ datas[0].msg2 }}</span>
                </span>
                积分封顶，积分按季统计，并于下一季度首月累积至客户积分账户。
              </div>
            </div>
          </div>
        </div>
        <div class="info">
          注：1、代发工资业务指企业代发行为，不含社保代发； <br />
          <span style="padding-left: 30px"
            >2、持续代发工资指当个季度每月均有代发工资业务发生；</span
          >
        </div>
      </el-tab-pane>
      <!-- 人才卡 -->
      <el-tab-pane label="人才卡" name="16">
        <div class="tab">
          <div v-if="type == 'show'">
            <div class="title">
              人才卡发放规则
            </div>
            <div 
            v-for="(data, index) in datas"
            :key="index"
            class="tab-row">
              <div>
                 {{ dataTypes[index] }}人才卡首次添加积分值{{
                  data.para2
                }}分。
              </div>
            </div>
          </div>
          <div v-if="type === 'edit' && ruleType === '16'" style="width: 95%">
            <div class="title">
              人才卡发放规则
            </div>
            <div 
              v-for="(data, index) in datas"
              :key="index"
              class="tab-row">
              <div>
                {{ dataTypes[index] }}人才卡首次添加积分值
                <span style="position: relative">
                  <el-input
                    v-model="data.para2"
                    placeholder=""
                    @blur="checkIntegral(index, 'para2', 'msg1')"
                    maxlength="16"
                    style="padding: 0 10px"
                  />
                  <span class="msg">{{ data.msg1 }}</span>
                </span>
                分
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <!-- 生日赠送积分 -->
      <el-tab-pane label="生日赠送积分" name="19" class="reward-tab">
        <div class="tab">
          <div v-if="type == 'show'">
            <div class="title">
              生日赠送积分规则
            </div>
            <div
              v-for="(data, index) in rewardDatas"
              :key="index"
              class="tab-row"
              >
              <div>
                生日当天{{
                  options[data.para1]
                }}客户赠送{{
                  data.para2
                }}积分，并于生日当天累计至客户积分账户。
              </div>
            </div>
          </div>
          <div v-if="type === 'edit' && ruleType === '19'" style="width: 95%">
            <div class="title">
              生日赠送积分规则
            </div>
            <div  
              v-for="(data, index) in rewardDatas"
              :key="index"
              class="tab-row">
              <div>
                生日当天
                <el-select
                  v-model.number="data.para1"
                  placeholder=""
                  style="padding: 0 10px"
                  disabled
                >
                  <!-- <el-option label="请选择" value=""></el-option> -->
                  <el-option label="一星" :value="1"></el-option>
                  <el-option label="二星" :value="2"></el-option>
                  <el-option label="三星" :value="3"></el-option>
                  <el-option label="四星" :value="4"></el-option>
                  <el-option label="五星" :value="5"></el-option>
                  <el-option label="六星" :value="6"></el-option> </el-select
                >客户，赠送
                <span style="position: relative">
                  <el-input
                    placeholder=""
                    v-model="data.para2"
                    @blur="checkIntegral(index, 'para2', 'msg2')"
                    maxlength="16"
                    style="padding: 0 10px"
                  />
                  <span class="msg">{{ data.msg2 }}</span> </span
                >积分；并于生日当天累计至客户积分账户。
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <!-- 社保卡营销 -->
      <!-- <el-tab-pane label="社保卡营销" name="20">
        <div class="tab">
          <div v-if="type == 'show'">
            <div class="title">
              社保卡营销规则
            </div>
            <div class="tab-row">
              <div>
                于{{datas}}至{{datas}}，在网点申办省社保卡激活金融账户且首次开通手机银行的客户，给予财富积分{{datas && datas[0] && datas[0].para1}}分，T+1日生效。
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane> -->
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
      if (value === 'rule') {
        this.getScoreByType()
      }
    }
  },
  data() {
    return {
      type: 'show',
      ruleType: '01',
      vloading: false,
      financeTypes: [
        { key: '01001', value: '金融资产' },
        { key: '01002', value: '存款' },
        { key: '01003', value: '理财' },
        { key: '01004', value: '基金' },
        { key: '01006', value: '信托' },
        { key: '01007', value: '资管' },
        { key: '01008', value: '保险' },
        { key: '01005', value: '保险' }
      ],
      bindTypes: [
        { key: '04001', value: '微信' },
        { key: '04002', value: '支付宝' },
        { key: '04003', value: '美团' },
        { key: '04004', value: '滴滴' },
        { key: '0404005', value: '苏宁快捷支付' }
      ],
      dataTypes: ['市级', '区级'],
      // value: '',
      options: ['', '一星', '二星', '三星', '四星', '五星', '六星'],
      // 列表数据
      datas: [],
      // 新客奖励&生日赠送
      rewardDatas: [],
      loading: false
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
      this.vloading = true
      // check是否有msg
      let params = this.ruleType === '02' || this.ruleType === '19' ? this.rewardDatas : this.datas
      for (let index in params) {
        if (params[index].msg1 || params[index].msg2 || params[index].msg3) {
          return
        }
      }
      this.loading = true
      // 保存
      API.scorerule
        .update(params)
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
        .getScoreByType(this.ruleType, this.$store.state.user.channel)
        .then(res => {
          res.data.data.forEach(data => {
            data.modifyEmpNo = this.$store.state.user.id
            data.modifyEmpName = this.$store.state.user.name
          })
          if (this.ruleType === '02' || this.ruleType === '19') {
            this.rewardDatas = res.data.data
          } else {
            this.datas = res.data.data
          }
          this.vloading = false
          this.type = 'show'
        }).catch((error) => {
          this.vloading = false
          this.type = 'show'
          this.$message.error(error.msg)
        })
    },

    // check 金额 index: 数据索引 paramIndex: para1 or para2 or para3
    checkAccount(index, param, msg) {
      this.setMessage(index, msg, '')
      let value = String(
        this.ruleType === '02' || this.ruleType === '19'
          ? this.rewardDatas[index][param]
          : this.datas[index][param]
      )
      // 保证输入的第一个不是小数点
      value = value.replace(/^\./g, '')
      // 输入小数点只能是一个
      value = value
        .replace('.', '$#$')
        .replace(/\./g, '')
        .replace('$#$', '.')
      this.$set(
        this.ruleType === '02' || this.ruleType === '19' ? this.rewardDatas[index] : this.datas[index],
        param,
        value
      )
      // 提示
      if (!value) {
        this.setMessage(index, msg, '数据不能为空')
        return
      }
      if (!/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(value)) {
        this.setMessage(index, msg, '必须为正数')
        return
      }
      if (
        value !== '' &&
        String(value).split('.')[1] &&
        String(value).split('.')[1].length > 2
      ) {
        this.setMessage(index, msg, '最多保留小数点后2位')
        return
      }
      if (
        value !== '' &&
        String(value).split('.')[0] &&
        String(value).split('.')[0].length > 16
      ) {
        this.setMessage(index, msg, '整数部分最多16位')
      }
    },

    // check 积分
    checkIntegral(index, param, msg) {
      this.setMessage(index, msg, '')
      let value =
        this.ruleType === '02' || this.ruleType === '19'
          ? this.rewardDatas[index][param]
          : this.datas[index][param]
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
        this.ruleType === '02' || this.ruleType === '19' ? this.rewardDatas[index] : this.datas[index],
        msg,
        content
      )
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
  width: 140px;
}

.info {
  text-align: left;
  padding: 60px 0 0 60px;
  display: block;
}
</style>
