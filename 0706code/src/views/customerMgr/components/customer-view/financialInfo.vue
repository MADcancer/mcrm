<template>
  <div class="mt-16 financial">
    <div class="title">
      <div class="title-text">二级产品</div>
    </div>
    <div class="financial-table">
      <el-table
        :data="tableData"
        style="width: 100%"
        :header-row-class-name="'self-header-2'">
        <el-table-column
          prop="productLabelTw"
          label="报表期次"
          width="150">
        </el-table-column>
        <el-table-column
          prop="productLabelTr"
          label="报表类型"
          width="150">
        </el-table-column>
        <el-table-column
          prop="productCode"
          label="是否经审计"
          width="150">
        </el-table-column>
        <el-table-column
          prop="productName"
          label="审计单位"
          width="150">
        </el-table-column>
        <el-table-column
          prop="balance"
          label="登记人"
          width="150">
        </el-table-column>
        <el-table-column
          prop="number"
          label="登记时间"
          width="300">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small">
              资产负债表
            </el-button>
            <el-button
              type="text"
              size="small">
              利润表
            </el-button>
            <el-button
              type="text"
              size="small">
              现金流量表
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
      tableData: []
    }
  }
}
</script>

<style lang="scss" scoped>
.financial {
  background: #FFFFFF;
  box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  padding: 0 20px;
  .financial-table {
    margin-top: 20px;
  }
}
</style>
