<template>
  <el-card class="customerManagement box-card">
    <div slot="header" class="clearfix">
      <span>客户查询</span>
    </div>
    <div style="height: 190px">
      <el-form ref="form" :model="form" label-width="160px">
        <el-col :span="12">
          <el-form-item label="客户名称">
            <el-input v-model="form.name"> </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户类型">
            <el-select v-model="form.category" style="width: 100%">
              <el-option label="大型银行" value="1"></el-option>
              <el-option label="股份制商业银行" value="2"></el-option>
              <el-option label="城市商业银行" value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="统一社会信用代码证号">
            <el-input v-model="form.name"> </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否关注">
            <el-radio-group v-model="form.idFollow">
              <el-radio label="是"></el-radio>
              <el-radio label="否"></el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item style="text-align: right">
            <el-button type="primary">查询</el-button>
            <el-button @click="resetForm">重置</el-button>
            <el-button
              type="primary"
              @click="followFun"
              :disabled="!multipleSelection.length"
            >
              关注
            </el-button>
            <el-button
              type="primary"
              @click="cancelFollowFun"
              :disabled="!multipleSelection.length"
            >
              取消关注
            </el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </div>
    <div class="line"></div>
    <el-table
      :data="tableData"
      stripe
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column prop="date" label="客户编号"> </el-table-column>
      <el-table-column prop="date" label="统一社会信用代码证号" width="200">
      </el-table-column>
      <el-table-column prop="date" label="客户名称"> </el-table-column>
      <el-table-column prop="date" label="客户类型"> </el-table-column>
      <el-table-column prop="date" label="资产余额（万元）"> </el-table-column>
      <el-table-column prop="date" label="负债余额（万元）"> </el-table-column>
      <el-table-column prop="date" label="是否关注"> </el-table-column>
    </el-table>
    <div class="block">
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
    </div>
  </el-card>
</template>
<script>
import API from '@/api'
export default {
  name: 'customerManagement',
  computed: {
    // 是否是管理员
    isAdmin() {
      return this.$store.state.user.roleId.toString().indexOf('03') !== -1
    },
  },
  data() {
    return {
      form: {
        idFollow: '是',
        name: '',
        category: '',
        startDate: '',
        endDate: '',
      },
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
      multipleSelection: [],
    }
  },
  methods: {
    // 表格size修改
    handleSizeChange() {},
    // 表格page修改
    handleCurrentChange() {},
    // 表格 查看 按钮
    // 重置
    resetForm() {
      this.form = {
        idFollow: '是',
        name: '',
        category: '',
        startDate: '',
        endDate: '',
      }
    },
    // 表格切换选中状态
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    followFun() {
      if (this.multipleSelection.length == 0) {
        this.$message.error('请选择至少一条数据')
      } else {
        this.$alert('是否关注', '关注', {
          confirmButtonText: '确定',
          callback: (action) => {
            this.$message({
              type: 'info',
              message: `关注成功`,
            })
          },
        })
      }
    },
    cancelFollowFun() {
      if (this.multipleSelection.length == 0) {
        this.$message.error('请选择至少一条数据')
      } else {
        this.$alert('是否取消关注', '取消关注', {
          confirmButtonText: '确定',
          callback: (action) => {
            this.$message({
              type: 'info',
              message: `取消关注成功`,
            })
          },
        })
      }
    },
  },
  created() {},
}
</script>
<style scoped>
.customerManagement {
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
</style>