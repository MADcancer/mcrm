<template>
  <el-card class="standingBook box-card">
    <div slot="header" class="clearfix">
      <span>台账管理</span>
    </div>
    <div style="height: 190px">
      <el-form ref="form" :model="form" label-width="160px">
        <el-col :span="12">
          <el-form-item label="选择模板">
            <el-select v-model="form.category" style="width: 100%">
              <el-option label="类别一" value="1"></el-option>
              <el-option label="类别二" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="上传人">
            <el-select v-model="form.category" style="width: 100%">
              <el-option label="类别一" value="1"></el-option>
              <el-option label="类别二" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="上传人所属机构">
            <el-select v-model="form.category" style="width: 100%">
              <el-option label="类别一" value="1"></el-option>
              <el-option label="类别二" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="上传时间">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="form.startDate"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态">
            <el-select v-model="form.category" style="width: 100%">
              <el-option label="类别一" value="1"></el-option>
              <el-option label="类别二" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
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
        <el-button type="primary">下载台账</el-button>
        <el-button type="primary">下载模板</el-button>
        <el-button type="primary">上传-全量更新</el-button>
        <el-button type="primary">上传-追加更新</el-button>
      </el-col>
      <el-col :span="12" style="text-align: right">
        <el-button type="primary" :disabled="!mainTableCheck"> 删除 </el-button>
        <el-button type="primary" :disabled="!mainTableCheck">
          同意导入
        </el-button>
        <el-button type="primary" :disabled="!mainTableCheck">
          拒绝导入
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
      <el-table-column prop="date" label="模板名称"> </el-table-column>
      <el-table-column prop="date" label="上传时间"> </el-table-column>
      <el-table-column prop="date" label="上传人"> </el-table-column>
      <el-table-column prop="date" label="上传人所属机构"> </el-table-column>
      <el-table-column prop="date" label="状态"> </el-table-column>
      <el-table-column prop="date" label="审批人"> </el-table-column>
      <el-table-column prop="date" label="上传内容"> </el-table-column>
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
</template>
<script>
import API from '@/api'
export default {
  name: 'standingBook',
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
      mainTableCheck: null,
      dialogVisible: false,
    }
  },
  methods: {
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
.standingBook {
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
.el-table /deep/ .el-table__header-wrapper .el-checkbox {
  display: none !important;
}
</style>