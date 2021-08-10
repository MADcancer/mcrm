<template>
  <el-card class="groupView box-card">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="first">
        <el-form ref="formFirst" :model="formFirst" label-width="120px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="集团编号">
                <el-input v-model="formFirst.name" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="集团客户名称">
                <el-input v-model="formFirst.name" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="集团类型">
                <el-input v-model="formFirst.name" readonly></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="集团状态">
                <el-input v-model="formFirst.name" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="更新日期">
                <el-input v-model="formFirst.name" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="最近更新人">
                <el-input v-model="formFirst.name" readonly></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="创建日期">
                <el-input v-model="formFirst.name" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="创建人ID">
                <el-input v-model="formFirst.name" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="创建人姓名">
                <el-input v-model="formFirst.name" readonly></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="创建机构">
                <el-input v-model="formFirst.name" readonly></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="集团客户成员列表" name="second">
        <div style="height: 60px">
          <el-form ref="formSecond" :model="formSecond" label-width="0">
            <el-col :span="6">
              <el-form-item>
                <el-input
                  placeholder="集团客户名称"
                  v-model="formSecond.name"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="18">
              <el-form-item style="text-align: right">
                <el-button type="primary">查询</el-button>
                <el-button @click="resetFormSecond">重置</el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </div>
        <div class="line"></div>
        <el-row style="margin-bottom: 10px">
          <el-col :span="12">
            <el-button
              type="primary"
              :disabled="!mainTableSecondCheck"
              @click="goCustomerView"
            >
              客户视图
            </el-button>
          </el-col>
        </el-row>
        <el-table
          :data="tableDataSecond"
          ref="mainTableSecond"
          stripe
          style="width: 100%"
          @selection-change="tableSecondRowClick"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column prop="date" label="序号"> </el-table-column>
          <el-table-column prop="date" label="集团客户名称"> </el-table-column>
          <el-table-column prop="date" label="集团子公司名称">
          </el-table-column>
          <el-table-column prop="date" label="授信额度"> </el-table-column>
          <el-table-column prop="date" label="用信敞口余额"> </el-table-column>
          <el-table-column prop="date" label="用信额度占比"> </el-table-column>
          <el-table-column prop="date" label="关联关系"> </el-table-column>
        </el-table>
        <el-pagination
          @size-change="sizeSecondChange"
          @current-change="currentSecondChange"
          :current-page="currentSecond"
          :page-sizes="[100, 200, 300, 400]"
          :page-size="sizeSecond"
          layout="total, sizes, prev, pager, next, jumper"
          :total="400"
        >
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane label="集团客户业务" name="third">
        <el-table
          :data="tableDataThird"
          ref="mainTableThird"
          stripe
          style="width: 100%"
        >
          <el-table-column prop="date" label="序号"> </el-table-column>
          <el-table-column prop="date" label="成员名称"> </el-table-column>
          <el-table-column prop="date" label="负债余额"> </el-table-column>
          <el-table-column prop="date" label="资产余额"> </el-table-column>
          <el-table-column prop="date" label="衍生品余额"> </el-table-column>
          <el-table-column prop="date" label="授信额度"> </el-table-column>
          <el-table-column prop="date" label="用信敞口余额"> </el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button
                @click="showLiabilitiesInfo(scope.row)"
                type="text"
                size="small"
              >
                负债信息
              </el-button>
              <el-button
                @click="showAssetsInfo(scope.row)"
                type="text"
                size="small"
              >
                资产信息
              </el-button>
              <el-button
                @click="showCreditInfo(scope.row)"
                type="text"
                size="small"
              >
                授信信息
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="sizeThirdChange"
          @current-change="currentThirdChange"
          :current-page="currentThird"
          :page-sizes="[100, 200, 300, 400]"
          :page-size="sizeThird"
          layout="total, sizes, prev, pager, next, jumper"
          :total="400"
        >
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane label="集团客户持有产品" name="fourth">
        <el-table
          :data="tableDataFourth"
          ref="mainTableThird"
          stripe
          style="width: 100%"
        >
          <el-table-column prop="date" label="序号"> </el-table-column>
          <el-table-column prop="date" label="成员名称"> </el-table-column>
          <el-table-column prop="date" label="产品名称"> </el-table-column>
          <el-table-column prop="date" label="产品余额"> </el-table-column>
        </el-table>
        <el-pagination
          @size-change="sizeFourthChange"
          @current-change="currentFourthChange"
          :current-page="currentFourth"
          :page-sizes="[100, 200, 300, 400]"
          :page-size="sizeFourth"
          layout="total, sizes, prev, pager, next, jumper"
          :total="400"
        >
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      :title="dialogSecondTitle"
      :visible.sync="dialogSecondVisible"
      width="80%"
    >
      <div style="width: 100%">
        <el-table
          :data="tableDataDialogSecond"
          ref="mainTableThird"
          stripe
          style="width: 100%"
        >
          <el-table-column prop="date" label="序号"> </el-table-column>
          <el-table-column prop="date" v-if="dialogSecondTitle!='授信信息'" label="产品名称"> </el-table-column>
          <el-table-column prop="date" v-if="dialogSecondTitle!='授信信息'" label="币种"> </el-table-column>
          <el-table-column prop="date" v-if="dialogSecondTitle!='授信信息'" label="产品余额"> </el-table-column>
          <el-table-column prop="date" v-if="dialogSecondTitle=='授信信息'" label="客户名称"> </el-table-column>
          <el-table-column prop="date" v-if="dialogSecondTitle=='授信信息'" label="授信额度"> </el-table-column>
          <el-table-column prop="date" v-if="dialogSecondTitle=='授信信息'" label="授信到期日"> </el-table-column>
          <el-table-column prop="date" v-if="dialogSecondTitle=='授信信息'" label="授信品种"> </el-table-column>
          <el-table-column prop="date" v-if="dialogSecondTitle=='授信信息'" label="担保方式"> </el-table-column>
          <el-table-column prop="date" v-if="dialogSecondTitle=='授信信息'" label="授信合同"> </el-table-column>

        </el-table>
        <el-pagination
          @size-change="sizeDialogSecondChange"
          @current-change="currentDialogSecondChange"
          :current-page="currentDialogSecond"
          :page-sizes="[10, 200, 300, 400]"
          :page-size="sizeDialogSecond"
          layout="total, sizes, prev, pager, next, jumper"
          :total="400"
        >
        </el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSecondVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogSecondVisible = false">
          确 定
        </el-button>
      </div>
    </el-dialog>
  </el-card>
</template>
<script>
import API from '@/api'
export default {
  name: 'groupView',
  data() {
    return {
      activeName: 'first',
      /* first tabs */
      formFirst: {
        name: 'XXX1',
      },
      /* second tabs */
      formSecond: {
        name: '',
      },
      mainTableSecondCheck: null,
      tableDataSecond: [
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
      currentSecond: 1,
      sizeSecond: 10,
      /* third tabs */
      tableDataThird: [
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
      currentThird: 1,
      sizeThird: 10,
      tableDataDialogSecond: [
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
      currentDialogSecond: 1,
      sizeDialogSecond: 10,
      dialogSecondTitle: '',
      dialogSecondVisible: false,
      /* fourth tabs */
      tableDataFourth: [
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
      currentFourth: 1,
      sizeFourth: 10,
    }
  },
  methods: {
    /* first tabs */
    // 切换tabs
    handleClick(tab, event) {
      console.log(tab, event)
    },
    /* second tabs */
    // 重置
    resetFormSecond() {
      this.formSecond = {
        name: '',
      }
    },
    // tabs 2 table 选择
    tableSecondRowClick(val) {
      this.mainTableSecondCheck = val[0]
      if (val.length > 1) {
        this.$refs.mainTableSecond.clearSelection()
        this.$refs.mainTableSecond.toggleRowSelection(val.pop())
      }
    },
    sizeSecondChange() {},
    currentSecondChange() {},
    goCustomerView() {},
    /* third tabs */
    sizeThirdChange() {},
    currentThirdChange() {},
    showLiabilitiesInfo() {
      this.dialogSecondTitle = '负债信息'
      this.dialogSecondVisible = true
    },
    showAssetsInfo() {
      this.dialogSecondTitle = '资产信息'
      this.dialogSecondVisible = true
    },
    showCreditInfo() {
      this.dialogSecondTitle = '授信信息'
      this.dialogSecondVisible = true
    },
    sizeDialogSecondChange() {},
    currentDialogSecondChange() {},
    /* fourth tabs */
    sizeFourthChange() {},
    currentFourthChange() {},
  },
}
</script>
<style scoped>
.groupView {
  min-width: 1130px;
  height: 100%;
  background-color: #fff;
  padding-bottom: 40px;
}
.el-table /deep/ .el-table__header-wrapper .el-checkbox {
  display: none !important;
}
.dialog-footer {
  text-align: right;
}
</style>