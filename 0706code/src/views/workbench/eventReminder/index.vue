<template>
  <div class="">
    <div style="width: 100%; height: 30px">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/workbench' }">
          工作台
        </el-breadcrumb-item>
        <el-breadcrumb-item>事件提醒</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-card class="eventReminder box-card">
      <div slot="header" class="clearfix">
        <span>事件提醒</span>
      </div>
      <div style="height: 190px">
        <el-form ref="form" :model="form" label-width="160px">
          <el-col :span="12">
            <el-form-item label="提醒开始时间">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="form.startDate"
                style="width: 100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="提醒开始到期时间">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="form.endDate"
                style="width: 100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户名称">
              <el-input v-model="form.name" suffix-icon="el-icon-search">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="提醒类别">
              <el-select v-model="form.category" style="width: 100%">
                <el-option label="类别一" value="1"></el-option>
                <el-option label="类别二" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否已读">
              <el-radio-group v-model="form.isRead">
                <el-radio label="是"></el-radio>
                <el-radio label="否"></el-radio>
              </el-radio-group>
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
      <el-table :data="tableData" stripe style="width: 100%" header-row-class-name="tableHeader">
        <el-table-column prop="date" label="是否已读"> </el-table-column>
        <el-table-column prop="date" label="客户名称"> </el-table-column>
        <el-table-column prop="date" label="提醒名称"> </el-table-column>
        <el-table-column prop="date" label="提醒开始日期"> </el-table-column>
        <el-table-column prop="date" label="提醒开始到期日期">
        </el-table-column>
        <el-table-column prop="date" label="提醒内容"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">
              查看
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
          :total="400000"
          background
        >
        </el-pagination>
      </div>
      <el-dialog
        title="提醒详情页面"
        :visible.sync="dialogVisible"
        width="80%"
        :before-close="handleClose"
      >
        <div class="remindDetailDiv">
          <div class="grey">
            <div>是否已读</div>
            <div>是</div>
          </div>
          <div class="grey">
            <div>客户名称</div>
            <div>中航工业集团财务有限公司</div>
          </div>
          <div>
            <div>提醒名称</div>
            <div>客户关系变更提醒</div>
          </div>
          <div>
            <div>提醒开始日期</div>
            <div>2020.20.20</div>
          </div>
          <div class="grey">
            <div>提醒内容</div>
            <div>客户关系变更提醒</div>
          </div>
          <div class="grey">
            <div>拜访内容</div>
            <div>2020.20.20</div>
          </div>
          <div style="width: 100%">
            <div>备注</div>
            <div>备注</div>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">关闭</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>

export default {
  name: 'eventReminder',
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
    // 表格 查看 按钮
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
  created() {},
}
</script>
<style scoped>
@import '../../../css/standard.css';
.eventReminder {
  min-width: 1130px;
  height: 100%;
  background-color: #fff;
  padding-bottom: 40px;
  border-radius: 8px;
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
.remindDetailDiv {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}
.remindDetailDiv > div {
  min-height: 60px;
  line-height: 60px;
  width: 49%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 16px;
}
.remindDetailDiv > div > div:nth-child(1) {
  width: 160px;
  text-align: right;
  padding-right: 20px;
  box-sizing: border-box;
}
.remindDetailDiv > div > div:nth-child(2) {
  text-align: left;
  padding-left: 20px;
  box-sizing: border-box;
}
.grey {
  background-color: #f4f4f5;
}
</style>