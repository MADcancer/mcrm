<template>
  <div class="">
    <div style="width: 100%; height: 30px">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/workbench' }">
          工作台
        </el-breadcrumb-item>
        <el-breadcrumb-item>风险限额</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-card class="riskLimits">
      <div slot="header" class="clearfix">
        <span>风险限额</span>
      </div>
      <div>
        <el-table :data="tableData" stripe style="width: 100%">
          <el-table-column prop="date" label="监控指标名称"> </el-table-column>
          <el-table-column prop="name" label="监控结果"> </el-table-column>
          <el-table-column label="计算参数维护">
            <template slot-scope="scope">
              <el-button
                @click="handleClick(scope.row, scope)"
                type="text"
                size="small"
              >
                维护
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="current"
            :page-sizes="[10, 200, 300, 400]"
            :page-size="size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="400"
          >
          </el-pagination>
        </div>
      </div>
    </el-card>
    <el-dialog title="计算参数维护" :visible.sync="dialogVisible" width="60%">
      <div class="dialogDiv">
        <div>
          <el-form
            ref="dialogForm"
            :model="dialogForm"
            label-width="220px"
            size="medium"
          >
            <el-form-item
              :label="
                dialogIndex == 0
                  ? '全行总资产（人民币/元）'
                  : '核心一级资本净额'
              "
              v-if="dialogIndex == 0 || dialogIndex == 3"
            >
              <el-input v-model="dialogForm.name"></el-input>
            </el-form-item>
            <el-form-item
              :label="
                dialogIndex == 0
                  ? '全行表内特定目的载体投资业务'
                  : dialogIndex == 1
                  ? '全行表内非底层资产投资业务余额'
                  : dialogIndex == 2
                  ? '全行表内通道业务余额'
                  : dialogIndex == 3
                  ? '全行表内同业资产'
                  : '表内外除公募基金外的间接投资业务余额'
              "
            >
              <el-input
                type="textarea"
                v-model="dialogForm.desc"
                rows="6"
                readonly
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="dialogMaintain">维护</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="line"></div>
        <div>
          <el-input
            placeholder="输入产品名称进行过滤"
            v-model="treeFilterText"
            size="medium"
          >
          </el-input>
          <el-tree
            :data="treeData"
            :props="defaultProps"
            @check="handleNodeCheck"
            :show-checkbox="showCheckbox"
            :filter-node-method="filterNode"
            ref="tree"
            node-key="label"
          ></el-tree>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="choseDialog">取 消</el-button>
        <el-button type="primary" @click="choseDialog"> 提交 </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import filters from '@/filters'
export default {
  name: 'riskLimits',
  data() {
    return {
      size: 10,
      current: 1,
      tableData: [
        {
          date: '全行表内特定目的载体投资业务/全行总资产',
          name: '10%',
        },
        {
          date: '全行表内非底层资产投资业务余额',
          name: filters.moneyFormat(1000000),
        },
        {
          date: '全行表内通道业务余额',
          name: filters.moneyFormat(1000000),
        },
        {
          date: '全行表内同业资产/核心一级资本净额',
          name: filters.moneyFormat(1000000),
        },
        {
          date: '表内外除公募基金外的间接投资业务余额',
          name: filters.moneyFormat(1000000),
        },
      ],
      dialogVisible: false,
      dialogIndex: 0,
      form: {},
      treeData: [
        {
          label: '一级 1',
          id: 1,
          children: [
            {
              label: '二级 1-1',
              id: 2,
              children: [
                {
                  label: '三级 1-1-1',
                  id: 3,
                },
              ],
            },
          ],
        },
        {
          label: '一级 2',
          id: 4,
          children: [
            {
              label: '二级 2-1',
              id: 5,
              children: [
                {
                  label: '三级 2-1-1',
                  id: 6,
                },
              ],
            },
            {
              label: '二级 2-2',
              id: 7,
              children: [
                {
                  label: '三级 2-2-1',
                  id: 8,
                },
              ],
            },
          ],
        },
        {
          label: '一级 3',
          id: 9,
          children: [
            {
              label: '二级 3-1',
              id: 10,
              children: [
                {
                  label: '三级 3-1-1',
                  id: 11,
                },
              ],
            },
            {
              label: '二级 3-2',
              id: 12,
              children: [
                {
                  label: '三级 3-2-1',
                  id: 13,
                },
              ],
            },
          ],
        },
      ],
      defaultProps: {
        children: 'children',
        label: 'label',
      },
      treeFilterText: '',
      showCheckbox: false,
      dialogForm: {
        name: '',
        desc: '',
      },
    }
  },
  watch: {
    treeFilterText(val) {
      this.$refs.tree.filter(val)
    },
  },
  methods: {
    // 表格size修改
    handleSizeChange() {},
    // 表格page修改
    handleCurrentChange() {},
    // 表格 维护 按钮点击
    handleClick(row, scope) {
      this.dialogIndex = scope.$index
      this.dialogVisible = true
    },
    // 关闭弹框
    choseDialog() {
      this.$refs.tree.setCheckedKeys([])
      this.showCheckbox = false
      this.dialogForm.name = ''
      this.dialogForm.desc = ''
      this.treeFilterText = ''
      this.dialogVisible = false
    },
    // tree点击node
    handleNodeCheck(data1, data2) {
      let checkArr = this.$refs.tree.getCheckedNodes(true, false)
      let emptyArr = []
      checkArr.forEach((item, index) => {
        emptyArr.push(item.label)
      })
      this.dialogForm.desc = '包含以下明细产品：' + emptyArr.join('、')
    },
    // tree过滤
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 弹框内维护按钮点击
    dialogMaintain() {
      this.showCheckbox = true
    },
  },
}
</script>
<style scoped>
.riskLimits {
  width: 100%;
  margin-bottom: 20px;
}
.dialog-footer {
  text-align: right;
}
.dialogDiv {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.dialogDiv > div:nth-child(1) {
  width: 60%;
  height: 100%;
}
.line {
  width: 2px;
  height: 100%;
  margin: 0 20px;
  background-color: #e5e5e5;
}
.dialogDiv > div:nth-child(3) {
  width: 40%;
  height: 100%;
}
</style>