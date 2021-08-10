<template>
  <div>
    <div class="bus-card mt-16">
      <div class="card-title">持有产品</div>
      <div class="card-content">
        <div class="card-item">
          <div class="card-img"></div>
          <div class="card-text mt-16">同业存放</div>
        </div>
        <div class="card-item">
          <div class="card-img"></div>
          <div class="card-text mt-16">同业拆借</div>
        </div>
      </div>
    </div>
    <div class="bus-table mt-16">
      <ul class="tab-title">
        <li  v-for="(tab, index) in tabData" :key="index" class="tab-card" :class="tab.active ? 'tab-active' : ''" @click="activeEvent(tab)">
          {{tab.text}}
        </li>
      </ul>
      <div class="tab-content">
        <el-table
          :data="tableData"
          style="width: 100%"
          :header-row-class-name="'self-header-2'">
          <el-table-column
            prop="productLabelTw"
            label="产品二级类目"
            width="180">
          </el-table-column>
          <el-table-column
            prop="productLabelTr"
            label="产品三级类目"
            width="180">
          </el-table-column>
          <el-table-column
            prop="productCode"
            label="产品编码">
          </el-table-column>
          <el-table-column
            prop="productName"
            label="产品名称">
          </el-table-column>
          <el-table-column
            prop="balance"
            label="余额">
          </el-table-column>
          <el-table-column
            prop="number"
            label="笔数">
          </el-table-column>
          <el-table-column
            prop="summary"
            label="汇总">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="120">
            <template slot-scope="scope">
              <el-button
                @click="deleteRow(scope.$index, tableData)"
                type="text"
                size="small">
                余额明细
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tabData: [
        {
          text: '资产',
          active: true,
          id: 'assets'
        }, {
          text: '负债',
          active: false,
          id: 'liabilities'
        }
      ],
      tabBar: {},
      tableData: []
    }
  },
  methods: {
    activeEvent(tab) {
      this.tabData.forEach(tabItem => {
        tabItem.active = false
      })
      tab.active = true
      this.tabBar = tab
    }
  }
}
</script>

<style lang="scss" scoped>
.bus-card {
  height: 240px;
  background: #FFFFFF;
  box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.06);
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  .card-title {
    font-size: 16px;
    font-family: PingFangSC-Medium;
    line-height: 22px;
    color: #333333;
  }
  .card-content {
    flex: 1;
    display: flex;
    .card-item {
      display: flex;
      align-items: center;
      flex-direction: column;
      margin-top: 51px;
      margin-left: 52px;
      margin-right: 20px;
      .card-img {
        width: 80px;
        height: 80px;
        background: #E78C57;
        border-radius: 50%;
      }
      .card-text {
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #333333;
      }
    }
  }
}
.bus-table {
  background: #FFFFFF;
  box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.06);
  border-radius: 8px;
  padding: 20px;
  .tab-title {
    display: flex;
    height: 32px;
    background: #FFFFFF;
    .tab-card {
      text-align: center;
      width: 100px;
      height: 32px;
      font-size: 16px;
      font-family: PingFangSC-Medium;
      line-height: 22px;
      color: #333333;
      border-bottom: 2px solid #dddddd;
      &.tab-active {
        border-bottom: 4px solid #F2B533;
      }
    }
  }
  .tab-content {
    margin-top: 8px;
  }
}
</style>
