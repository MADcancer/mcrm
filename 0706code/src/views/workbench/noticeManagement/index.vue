<template>
  <el-card class="noticeManagement box-card">
    <div slot="header" class="clearfix">
      <span>公告管理</span>
    </div>
    <div style="height: 250px">
      <el-form ref="form" :model="form" label-width="160px">
        <el-col :span="12">
          <el-form-item label="公告标题">
            <el-input v-model="form.title"> </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="公告类型">
            <el-select v-model="form.category" style="width: 100%">
              <el-option label="类别一" value="1"></el-option>
              <el-option label="类别二" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="重要性">
            <el-select v-model="form.category" style="width: 100%">
              <el-option label="重要" value="1"></el-option>
              <el-option label="一般" value="2"></el-option>
              <el-option label="全部" value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发布日期">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="form.startDate"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="过期日">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="form.endDate"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="公告状态">
            <el-select v-model="form.category" style="width: 100%">
              <el-option label="类别一" value="1"></el-option>
              <el-option label="类别二" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item style="float: right">
            <el-button type="primary">查询</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </div>
    <div class="line"></div>
    <el-col :span="24">
      <el-button type="primary" @click="addNotic">新增公告</el-button>
    </el-col>
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="date" label="公告标题"> </el-table-column>
      <el-table-column prop="date" label="公告类型"> </el-table-column>
      <el-table-column prop="date" label="重要性"> </el-table-column>
      <el-table-column prop="date" label="发布日期"> </el-table-column>
      <el-table-column prop="date" label="过期日"> </el-table-column>
      <el-table-column prop="date" label="公告状态"> </el-table-column>
      <el-table-column prop="date" label="公告内容"> </el-table-column>
      <el-table-column prop="date" label="创建人"> </el-table-column>
      <el-table-column label="附件">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">
            附件链接
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
      title="新增公告"
      :visible.sync="dialogVisible"
      width="80%"
      :before-close="handleClose"
    >
      <div class="addNoticDiv">
        <el-form ref="form2" :model="form2" label-width="120px" size="medium">
          <el-col :span="12">
            <el-form-item label="公告标题">
              <el-input v-model="form2.title"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="公告内容">
              <el-input type="textarea" v-model="form2.content" rows="4">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发布日期">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="form2.startDate"
                style="width: 100%"
                readonly
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="过期日">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="form2.endDate"
                style="width: 100%"
                :picker-options="pickerOptions"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公告类型">
              <el-select v-model="form2.category" style="width: 100%">
                <el-option label="类别一" value="1"></el-option>
                <el-option label="类别二" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公告状态">
              <el-select v-model="form2.category" style="width: 100%">
                <el-option label="类别一" value="1"></el-option>
                <el-option label="类别二" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="重要性">
              <el-select v-model="form2.category" style="width: 100%">
                <el-option label="重要" value="1"></el-option>
                <el-option label="一般" value="2"></el-option>
                <el-option label="全部" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建人">
              <el-input v-model="form2.creater" disabled> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="选择附件">
              <el-upload
                class="avatar-uploader"
                action="https://jsonplaceholder.typicode.com/posts/"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img
                  v-if="form2.imageUrl"
                  :src="form2.imageUrl"
                  class="avatar"
                />
                <div v-else class="avatar-uploader-icon">
                  <img
                    src="/static/img/noticeManagement/uploadFile.png"
                    alt=""
                    srcset=""
                  />
                  <div>选择附件</div>
                  <div>txt,word,pdf；不超过5兆</div>
                </div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>
<script>
export default {
  name: 'noticeManagement',
  computed: {
    // 是否是管理员
    isAdmin() {
      return this.$store.state.user.roleId.toString().indexOf('03') !== -1
    },
  },
  data() {
    return {
      form: {
        title: '',
        startDate: '',
        endDate: '',
        category: '',
      },
      form2: {
        title: '',
        content: '',
        startDate: new Date(),
        endDate: '',
        creater: 'XXX',
        imageUrl: '',
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now()
        },
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
    // 表格 附件链接 按钮点击
    handleClick() {},
    // 添加公告
    addNotic() {
      this.dialogVisible = true
    },
    // 关闭弹窗
    handleClose(done) {
      done()
    },
    // 重置
    resetForm() {
      this.form = {
        title: '',
        startDate: '',
        endDate: '',
        category: '',
      }
    },
    // 上传成功
    handleAvatarSuccess() {},
    // 上传之前
    beforeAvatarUpload() {},
  },
  created() {
    
  },
}
</script>
<style scoped>
.noticeManagement {
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
.addNoticDiv {
  width: 100%;
}
.avatar-uploader /deep/ .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader /deep/ .el-upload:hover {
  border-color: #78b258;
}
.avatar-uploader-icon {
  font-size: 12px;
  line-height: 14px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
.avatar-uploader-icon > img {
  width: 90px;
  height: 80px;
  margin-top: 30px;
}
.avatar-uploader-icon > div:nth-child(2) {
  font-size: 14px;
  font-weight: 600;
  margin-top: 6px;
  margin-bottom: 6px;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>