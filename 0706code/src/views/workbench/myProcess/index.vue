<template>
  <el-card class="myProcess box-card">
    <div slot="header" class="clearfix">
      <span>我的流程</span>
    </div>
    <div style="height: 190px">
      <el-form ref="form" :model="form" label-width="160px">
        <el-col :span="12">
          <el-form-item label="任务类型">
            <el-select v-model="form.category" style="width: 100%">
              <el-option label="类别一" value="1"></el-option>
              <el-option label="类别二" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="申请人">
            <el-input v-model="form.name"> </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="任务状态">
            <el-select v-model="form.category" style="width: 100%">
              <el-option label="类别一" value="1"></el-option>
              <el-option label="类别二" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="申请开始时间">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="form.startDate"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="申请结束时间">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="form.endDate"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item>
            <el-button type="primary">查询</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </div>
    <div class="line"></div>
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="date" label="客户号"> </el-table-column>
      <el-table-column prop="date" label="重要性"> </el-table-column>
      <el-table-column prop="date" label="客户名称"> </el-table-column>
      <el-table-column prop="date" label="申请内容"> </el-table-column>
      <el-table-column prop="date" label="申请人"> </el-table-column>
      <el-table-column prop="date" label="申请时间"> </el-table-column>
      <el-table-column prop="date" label="任务状态"> </el-table-column>
      <el-table-column prop="date" label="任务类型"> </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">
            操作
          </el-button>
        </template>
      </el-table-column>
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
    <el-dialog
      title="流程处理"
      :visible.sync="dialogVisible"
      width="60%"
      :before-close="handleClose"
    >
      <div>
        <el-form ref="form2" :model="form" label-width="160px" size="medium">
          <el-col :span="12">
            <el-form-item label="审批结论">
              <el-select v-model="form2.category" style="width: 100%">
                <el-option label="类别一" value="1"></el-option>
                <el-option label="类别二" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="审批意见">
              <el-input type="textarea" v-model="form2.content" rows="4">
              </el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false"
          >同意</el-button
        >
        <el-button @click="dialogVisible = false">拒绝</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>
<script>
export default {
  name: 'myProcess',
  computed: {
    // 是否是管理员
    isAdmin() {
      return this.$store.state.user.roleId.toString().indexOf('03') !== -1
    },
  },
  data() {
    return {
      form: {
        isRead: '是',
        name: '',
        category: '',
        startDate: '',
        endDate: '',
      },
      form2: {},
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
      dialogVisible: false,
    }
  },
  methods: {
    // 表格size修改
    handleSizeChange() {},
    // 表格page修改
    handleCurrentChange() {},
    handleClick() {
      this.dialogVisible = true
    },
    // 弹框关闭
    handleClose(done) {
      done()
    },
    // 重置
    resetForm() {
      this.form = {
        isRead: '是',
        name: '',
        category: '',
        startDate: '',
        endDate: '',
      }
    },
  },
  created() {
    
  },
}
</script>
<style scoped>
.myProcess {
  min-width: 1130px;
  height: 100%;
  background-color: #fff;
  padding-bottom: 40px;
}
.dialog-footer {
  text-align: right;
}
.line {
  width: 100%;
  height: 2px;
  background-color: #eeeeee;
  margin-bottom: 20px;
}
</style>