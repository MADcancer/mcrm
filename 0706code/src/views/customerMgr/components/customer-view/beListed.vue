<template>
  <div class="be-listed mt-16">
    <div class="title">
      <div class="title-text">上市信息</div>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%;margin-top:24px"
      :header-row-class-name="'self-header'"
      :row-class-name="tableRowClassName">
      <el-table-column
        prop="date"
        label="股票代码">
      </el-table-column>
      <el-table-column
        prop="method"
        label="股票类型">
      </el-table-column>
      <el-table-column
        prop="institution"
        label="股票名称">
      </el-table-column>
      <el-table-column
        prop="result"
        label="上市时间">
      </el-table-column>
      <el-table-column
        prop="result"
        label="交易所名称">
      </el-table-column>
      <el-table-column
        prop="result"
        label="币种">
      </el-table-column>
      <el-table-column
        prop="result"
        label="发型股票总金额（元）">
      </el-table-column>
      <el-table-column
        prop="result"
        label="发行总股数">
      </el-table-column>
      <el-table-column
        prop="result"
        label="流通股票总金额（元）">
      </el-table-column>
      <el-table-column
        prop="result"
        label="流通总股数">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    socCode: {
      type: String
    }
  },
  data() {
    return {
      isSupp: window.SITE_CONFIG['isSupp'] === '1',
      tableData: []
    }
  },
  mounted() {
  },
  methods: {
    tableRowClassName({row, rowIndex}) {
      if (rowIndex % 2) {
        return 'light-row self-row'
      }
      return 'self-row'
    }
  }
}
</script>

<style lang="scss" scoped>
.be-listed {
  display: flex;
  flex-direction: column;
}
</style>
