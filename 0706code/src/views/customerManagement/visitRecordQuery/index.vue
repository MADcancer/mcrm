<template>
  <div>
    <div style="width: 100%; height: 30px">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item> 拜访记录查询 </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-card class="visitRecordQuery box-card">
      <div slot="header" class="clearfix">
        <span>拜访记录查询</span>
      </div>
      <div style="height: 250px">
        <el-form ref="form" :model="form" label-width="160px">
          <el-col :span="12">
            <el-form-item label="统一社会信用证代码">
              <el-input v-model="form.name"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户名称">
              <el-input v-model="form.name"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户类型">
              <el-select v-model="form.category" style="width: 100%">
                <el-option label="类别一" value="1"></el-option>
                <el-option label="类别二" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="拜访方式">
              <el-select v-model="form.category" style="width: 100%">
                <el-option label="类别一" value="1"></el-option>
                <el-option label="类别二" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="拜访时间起">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="form.startDate"
                style="width: 100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="拜访时间止">
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
      <div>
        <el-button type="primary" @click="addVisitRecord">新增</el-button>
        <el-button plain type="primary" :disabled="!mainTableCheck"
          >修改</el-button
        >
        <el-button :disabled="!mainTableCheck">删除</el-button>
      </div>
      <el-table
        :data="tableData"
        ref="mainTable"
        stripe
        style="width: 100%"
        @selection-change="tableRowClick"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="date" label="统一社会信用证代码"> </el-table-column>
        <el-table-column prop="date" label="客户名称"> </el-table-column>
        <el-table-column prop="date" label="客户类型"> </el-table-column>
        <el-table-column prop="date" label="拜访方式"> </el-table-column>
        <el-table-column prop="date" label="拜访日期"> </el-table-column>
        <el-table-column prop="date" label="拜访内容"> </el-table-column>
        <el-table-column prop="date" label="我方人员"> </el-table-column>
        <el-table-column prop="date" label="对方人员"> </el-table-column>
        <el-table-column prop="date" label="登记人"> </el-table-column>
        <el-table-column prop="date" label="等级日期"> </el-table-column>
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
          :total="400"
        >
        </el-pagination>
      </div>
      <el-dialog
        title="拜访记录"
        :visible.sync="dialogVisible"
        width="80%"
        :before-close="handleClose"
      >
        <div class="remindDetailDiv">
          <div class="grey">
            <div>统一社会信用证代码</div>
            <div>1000</div>
          </div>
          <div class="grey">
            <div>客户名称</div>
            <div>宁波银行</div>
          </div>
          <div>
            <div>拜访方式</div>
            <div>当面拜访</div>
          </div>
          <div>
            <div>拜访日期</div>
            <div>2020.20.20</div>
          </div>
          <div class="grey">
            <div>拜访内容</div>
            <div>客户关系变更提醒</div>
          </div>
          <div>
            <div></div>
            <div></div>
          </div>
          <div>
            <div>我方人员</div>
            <div>XXX</div>
          </div>
          <div>
            <div>对方人员</div>
            <div>XXX</div>
          </div>
          <div class="grey">
            <div>登记人</div>
            <div>XXX</div>
          </div>
          <div class="grey">
            <div>登记部门</div>
            <div>XXX</div>
          </div>
          <div>
            <div>登记日期</div>
            <div>XXX</div>
          </div>
          <div>
            <div>修改日期</div>
            <div>XXX</div>
          </div>
          <div style="width: 100%">
            <div>附件</div>
            <div></div>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">关闭</el-button>
        </div>
      </el-dialog>
      <el-dialog
        title="新增拜访记录"
        :visible.sync="dialogVisible2"
        width="80%"
      >
        <div style="width: 100%">
          <el-form ref="form2" :model="form2" label-width="80px" size="medium">
            <el-row>
              <el-col :span="12">
                <el-form-item label="统一社会信用证代码">
                  <el-input v-model="form2.name"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="客户名称">
                  <el-input v-model="form2.name"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="客户类型">
                  <el-select
                    v-model="form2.region"
                    placeholder="请选择客户类型"
                    style="width: 100%"
                  >
                    <el-option label="客户类型一" value="shanghai"></el-option>
                    <el-option label="客户类型二" value="beijing"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="拜访方式">
                  <el-select
                    v-model="form2.region"
                    placeholder="请选择拜访方式"
                    style="width: 100%"
                  >
                    <el-option label="拜访方式一" value="shanghai"></el-option>
                    <el-option label="拜访方式二" value="beijing"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="客户类型">
                  <el-date-picker
                    type="date"
                    placeholder="拜访日期"
                    v-model="form2.date1"
                    style="width: 100%"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="拜访内容">
                  <el-input
                    type="textarea"
                    v-model="form.desc"
                    rows="4"
                    maxlength="3000"
                    show-word-limit
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="我方人员">
                  <el-input v-model="form2.name"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="对方人员">
                  <el-input v-model="form2.name"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="登记人">
                  <el-input v-model="form2.name"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="登记部门">
                  <el-input v-model="form2.name"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="登记日期">
                  <el-date-picker
                    type="date"
                    placeholder="登记日期"
                    v-model="form2.date1"
                    style="width: 100%"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="修改日期">
                  <el-date-picker
                    type="date"
                    placeholder="修改日期"
                    v-model="form2.date1"
                    style="width: 100%"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
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
            </el-row>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary">保存</el-button>
          <el-button @click="dialogVisible2 = false">关闭</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
import API from '@/api'
export default {
  name: 'visitRecordQuery',
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
      dialogVisible2: false,
      form2: {
        name: '',
        region: '',
        date1: '',
        desc: '',
        imageUrl: '',
      },
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
    // 查看
    handleClick(row) {
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
    // 新增按钮
    addVisitRecord() {
      this.dialogVisible2 = true
    },
    // 上传成功
    handleAvatarSuccess() {},
    // 上传之前
    beforeAvatarUpload() {},
  },
  created() {},
}
</script>
<style scoped>
.visitRecordQuery {
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
.el-table /deep/ .el-table__header-wrapper .el-checkbox {
  display: none !important;
}
</style>