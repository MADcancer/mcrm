<template>
  <div class="score-rule">
    <!-- <el-tabs type="border-card" v-model="type" @tab-click="handleClick"> -->
    <el-tabs type="border-card" v-model="type">
      <el-tab-pane label="财富积分规则维护" name="rule">
        <score-rule :name="type"></score-rule>
      </el-tab-pane>
      <el-tab-pane label="平台积分折算率维护" name="convert">
        <score-convert :name="type"></score-convert>
      </el-tab-pane>
      <el-tab-pane label="积分说明维护" name="info">
        <v-info :name="type"></v-info>
      </el-tab-pane>
      <el-tab-pane label="星级说明维护" name="level">
        <v-info :name="type"></v-info>
      </el-tab-pane>
      <el-tab-pane label="旺季营销规则" name="market">
        <peak-marketing :name="type"></peak-marketing>
      </el-tab-pane>
      <el-tab-pane label="企业网银渠道" name="bank">
        <score-bank :name="type"></score-bank>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import scoreRule from './comps/score-rule'
import scoreConvert from './comps/score-convert'
import scoreBank from './comps/score-bank'
import vInfo from './comps/info'
import peakMarketing from './comps/peak-marketing'
export default {
  // components: { scoreRule, scoreConvert, quillEditor },
  components: { scoreRule, scoreConvert, vInfo, peakMarketing, scoreBank },
  data() {
    return {
      type: 'rule'
    }
  },
  methods: {
    created() {
      // this.qryScoreDescByChannel()
    }
  }
}
</script>

<style lang="scss" scoped>
.score-rule {
  /deep/ .el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
    color: #ffffff;
    background-color: #80a639;
    border-right-color: #80a639;
    border-left-color: #80a639;
  }
  /deep/ .el-tabs--border-card > .el-tabs__content {
    padding: 30px 48px;
  }
}
</style>
