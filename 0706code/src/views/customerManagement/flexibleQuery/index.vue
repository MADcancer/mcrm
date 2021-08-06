<template>
  <el-card class="flexibleQuery box-card">
    <div slot="header" class="clearfix">
      <span>灵活查询</span>
    </div>
    <div class="cardContent">
      <div class="cardContentLeft">
        <div class="searchInputDiv">
          <el-input
            placeholder="搜索"
            size="medium"
            suffix-icon="el-icon-search"
            v-model="cardInput"
          >
          </el-input>
        </div>
        <div>
          <el-tree
            style="background-color: #fafbfc; margin-top: 20px"
            :data="treeData"
            :props="defaultProps"
            show-checkbox
            :filter-node-method="filterNode"
            @check="handleNodeCheck"
            ref="tree"
            node-key="id"
            :default-expanded-keys="[10, 20, 30, 40, 50]"
          ></el-tree>
        </div>
      </div>
      <div class="cardContentRight">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>客户基本信息</span>
          </div>
          <div
            v-for="(item, index) in queryList"
            :key="index"
            class="queryCondition"
          >
            <div class="queryConditionTitle">
              <div class="queryConditionTitleLeft">
                <div class="greenBox"></div>
                <div>{{ item.label }}</div>
              </div>
              <div>
                <el-button type="danger" size="medium" @click="delQuery(index)"
                  >删除</el-button
                >
              </div>
            </div>
            <div class="queryConditionContent">
              <el-form label-width="80px">
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="属性名称">
                      <el-input v-model="name"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="操作符">
                      <el-input v-model="name"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="属性值">
                      <el-input v-model="name"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="条件关系">
                      <el-select v-model="relationship" style="width:100%">
                        <el-option label="与" value="1"></el-option>
                        <el-option label="或" value="2"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
            <div class="splitLine" v-if="index < queryList.length - 1">
              <div></div>
              <img
                src="/static/img/customerManagement/link.png"
                alt=""
                srcset=""
              />
              <div></div>
            </div>
          </div>
          <div class="queryResult">
            <div>筛选条数</div>
            <div><el-input v-model="queryResultNum"></el-input></div>
            <el-button type="danger">查询结果</el-button>
            <el-button type="success">保存</el-button>
            <el-button @click="reset">重置</el-button>
          </div>
        </el-card>
      </div>
    </div>
  </el-card>
</template>
<script>
import API from '@/api'
export default {
  name: 'flexibleQuery',
  data() {
    return {
      cardInput: '',
      treeData: [
        {
          label: '客户基本信息',
          id: 10,
          children: [
            {
              label: '客户编号',
              id: 11,
            },
            {
              label: '客户名称',
              id: 12,
            },
            {
              label: '客户类型',
              id: 13,
            },
            {
              label: '统一社会信用代码',
              id: 14,
            },
            {
              label: '法定代表人',
              id: 15,
            },
          ],
        },
        {
          label: '客户业务信息（元）',
          id: 20,
        },
        {
          label: '归属信息',
          id: 30,
        },
        {
          label: '标签',
          id: 40,
        },
        {
          label: '客户持有产品',
          id: 50,
        },
      ],
      defaultProps: {
        children: 'children',
        label: 'label',
      },
      name: '',
      relationship: '1',
      queryList: [],
      queryResultNum: 0,
    }
  },
  watch: {
    cardInput(val) {
      this.$refs.tree.filter(val)
    },
  },
  methods: {
    // tree过滤
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // tree点击node
    handleNodeCheck(data1, data2) {
      let checkArr = this.$refs.tree.getCheckedNodes(true, false)
      this.queryList = checkArr
    },
    // 删除查询条件
    delQuery(index) {
      this.queryList.splice(index, 1)
      this.$refs.tree.setCheckedNodes(this.queryList)
    },
    // 重置
    reset() {
      this.queryList = []
      this.$refs.tree.setCheckedNodes([])
      this.queryResultNum = 0
    },
  },
}
</script>
<style scoped>
.flexibleQuery {
  min-width: 1130px;
  height: 100%;
  background-color: #fff;
  padding-bottom: 40px;
}
.cardContent {
  width: 100%;
  display: flex;
  align-content: flex-start;
  justify-content: space-between;
}
.cardContentLeft {
  width: 270px;
  min-height: 600px;
  box-sizing: border-box;
  background: #fafbfc;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  border-radius: 4px;
}
.cardContentRight {
  min-width: 800px;
  width: 100%;
  margin: 0 20px;
  min-height: 600px;
  box-sizing: border-box;
}
.searchInputDiv {
  padding: 10px;
  box-sizing: border-box;
  border-bottom: 1px solid #eee;
}
.queryConditionTitle {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.queryConditionTitleLeft {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.greenBox {
  width: 4px;
  height: 16px;
  background-color: #79ac43;
  margin-right: 8px;
}
.queryConditionContent {
  width: 100%;
  margin-top: 20px;
}
.splitLine {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}
.splitLine > div {
  width: 49%;
  height: 2px;
  background-color: #ededed;
}
.splitLine > img {
  width: 16px;
  height: 16px;
}
.queryResult {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.queryResult > div {
  margin-right: 10px;
}
.queryResult > div:nth-child(2) {
  width: 60px;
}
</style>