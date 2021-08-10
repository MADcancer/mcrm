<template>
  <el-card class="groupCustomerQuery box-card">
    <div style="height: 60px">
      <el-form ref="form" :model="form" label-width="0">
        <el-col :span="6">
          <el-form-item>
            <el-input placeholder="集团客户名称" v-model="form.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item style="text-align: right">
            <el-button type="primary">查询</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </div>
    <div class="line"></div>
    <el-row style="margin-bottom: 10px">
      <el-col :span="12">
        <el-button
          type="primary"
          :disabled="!mainTableCheck"
          @click="goGroupView"
        >
          集团视图
        </el-button>
      </el-col>
    </el-row>
    <el-table
      :data="tableData"
      ref="mainTable"
      stripe
      style="width: 100%"
      @selection-change="tableRowClick"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column prop="date" label="序号"> </el-table-column>
      <el-table-column prop="date" label="集团客户名称"> </el-table-column>
      <el-table-column prop="date" label="集团类型"> </el-table-column>
      <el-table-column prop="date" label="成员数量"> </el-table-column>
      <el-table-column prop="date" label="创建人"> </el-table-column>
      <el-table-column prop="date" label="创建时间"> </el-table-column>
      <el-table-column prop="date" label="修改人"> </el-table-column>
      <el-table-column prop="date" label="修改时间"> </el-table-column>
    </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="current"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400"
      >
      </el-pagination>
  </el-card>
</template>
<script>
import API from '@/api'
export default {
  name: 'groupCustomerQuery',
  data() {
    return {
      form: { name: '' },
      current: 1,
      size: 100,
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
        },
        {
          date: '2016-05-04',
          name: '王小虎',
        },
        {
          date: '2016-05-01',
          name: '王小虎',
        },
        {
          date: '2016-05-03',
          name: '王小虎',
        },
      ],
      mainTableCheck: null,
    }
  },
  methods: {
    // 重置
    resetForm() {
      this.form = { name: '' }
    },
    // 表格size修改
    handleSizeChange() {},
    // 表格page修改
    handleCurrentChange() {},
    // 表格选择行
    tableRowClick(val) {
      this.mainTableCheck = val[0]
      if (val.length > 1) {
        this.$refs.mainTable.clearSelection()
        this.$refs.mainTable.toggleRowSelection(val.pop())
      }
    },
    goGroupView() {
      this.$router.push({ name: 'groupView' })
    },
  },
}
</script>
<style scoped>
.groupCustomerQuery {
  min-width: 1130px;
  height: 100%;
  background-color: #fff;
  padding-bottom: 40px;
}
.line {
  width: 100%;
  height: 2px;
  background-color: #eeeeee;
  margin-bottom: 20px;
}
.el-table /deep/ .el-table__header-wrapper .el-checkbox {
  display: none !important;
}
</style>