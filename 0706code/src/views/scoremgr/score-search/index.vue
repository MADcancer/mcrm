<template>
  <div class="score-search" >
    <el-tabs type="border-card" v-model="name">
      <el-tab-pane label="客户综合积分查询" name="compre">
        <compre-search :name="name"></compre-search>
      </el-tab-pane>
      <el-tab-pane label="客户积分对账单" name="account">
        <account-search :name="name"></account-search>
      </el-tab-pane>
      <el-tab-pane label="客户积分兑换历史查询" name="history">
        <history-search :name="name"></history-search>
      </el-tab-pane>
      <el-tab-pane label="客户积分流水查询" name="pipeline">
        <pipeline-search :name="name"></pipeline-search>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import accountSearch from './account-search'
import compreSearch from './compre-search'
import historySearch from './history-search'
import pipelineSearch from './pipeline-search'
export default {
  components: { accountSearch, compreSearch, historySearch, pipelineSearch },
  data() {
    return {
      name: 'compre'
    }
  }
}
</script>

<style lang="scss" scoped>
.score-search {
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
