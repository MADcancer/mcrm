<template>
  <div class="credit-box mt-16">
    <div class="credit-total">
      <div class="title">
        <div class="title-text">授信总额（元）：20亿</div>
      </div>
      <div class="content-container mt-16">
        <div class="left">
          <div style="margin:0 auto;">
            <div class="credit-one">
              <span>授信主题A </span>
              <span>10亿</span>
            </div>
          </div>
          <div class="y-divider"></div>
          <!--画一个无底边部的边框-->
          <div class="tree-divider">
            <div class="tree-left">
              <div class="tree-item-title">
                <span>授信分项1</span>
                <span>5亿</span>
              </div>
              <div class="tree-item">业务1</div>
              <div class="tree-item">业务2</div>
              <div class="tree-item">业务3</div>
              <div class="tree-item">业务4</div>
            </div>
            <div class="tree-right">
              <div class="tree-item-title">
                <span>授信分项2</span>
                <span>3亿</span>
              </div>
              <div class="tree-item">业务5</div>
              <div class="tree-item">业务6</div>
              <div class="tree-item">业务7</div>
            </div>
          </div>
        </div>
        <div class="right">
          <el-table
            :data="tableData"
            style="width: 100%"
            :header-row-class-name="'self-header-2'">
            <el-table-column
              prop="number"
              label="序号"
              width="50">
            </el-table-column>
            <el-table-column
              prop="customerNo"
              label="客户编号"
              width="100">
            </el-table-column>
            <el-table-column
              prop="customerName"
              label="客户名称"
              width="100">
            </el-table-column>
            <el-table-column
              prop="creditVarieties"
              label="授信品种"
              width="100">
            </el-table-column>
            <el-table-column
              prop="currency"
              label="币种"
              width="50">
            </el-table-column>
            <el-table-column
              prop="creditLines"
              label="授信额度（元）">
            </el-table-column>
            <el-table-column
              prop="creditPeriod"
              label="授信总额度（元）">
            </el-table-column>
            <el-table-column
              prop="creditPeriod"
              label="授信期限（月）">
            </el-table-column>
            <el-table-column
              prop="date"
              label="生效日期">
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div class="credit-total mt-16">
      <div class="title">
        <div class="title-text">用信余额（元）：8.3亿</div>
      </div>
      <div class="letter-table mt-16">
        <el-table
          :data="tableData"
          style="width: 100%"
          :header-row-class-name="'self-header-2'">
          <el-table-column
            prop="number"
            label="序号"
            width="50">
          </el-table-column>
          <el-table-column
            prop="customerNo"
            label="客户编号"
            width="100">
          </el-table-column>
          <el-table-column
            prop="customerName"
            label="客户名称"
            width="100">
          </el-table-column>
          <el-table-column
            prop="creditVarieties"
            label="授信品种"
            width="100">
          </el-table-column>
          <el-table-column
            prop="currency"
            label="币种"
            width="50">
          </el-table-column>
          <el-table-column
            prop="creditLines"
            label="授信额度（元）">
          </el-table-column>
          <el-table-column
            prop="creditPeriod"
            label="授信总额度（元）">
          </el-table-column>
          <el-table-column
            prop="creditPeriod"
            label="授信期限（月）">
          </el-table-column>
          <el-table-column
            prop="date"
            label="生效日期">
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
      tableData: [
        {
          number: '1',
          customerNo: 'xxxxxx',
          customerName: 'xxxxxx',
          creditVarieties: 'xxxxxx',
          currency: 'xxx',
          creditLines: 'xxxxxx',
          creditPeriod: 'xxxxxx',
          date: 'xxxxxx'
        }, {
          number: '2',
          customerNo: 'xxxxxx',
          customerName: 'xxxxxx',
          creditVarieties: 'xxxxxx',
          currency: 'xxx',
          creditLines: 'xxxxxx',
          creditPeriod: 'xxxxxx',
          date: 'xxxxxx'
        }, {
          number: '3',
          customerNo: 'xxxxxx',
          customerName: 'xxxxxx',
          creditVarieties: 'xxxxxx',
          currency: 'xxx',
          creditLines: 'xxxxxx',
          creditPeriod: 'xxxxxx',
          date: 'xxxxxx'
        }, {
          number: '4',
          customerNo: 'xxxxxx',
          customerName: 'xxxxxx',
          creditVarieties: 'xxxxxx',
          currency: 'xxx',
          creditLines: 'xxxxxx',
          creditPeriod: 'xxxxxx',
          date: 'xxxxxx'
        }, {
          number: '5',
          customerNo: 'xxxxxx',
          customerName: 'xxxxxx',
          creditVarieties: 'xxxxxx',
          currency: 'xxx',
          creditLines: 'xxxxxx',
          creditPeriod: 'xxxxxx',
          date: 'xxxxxx'
        }, {
          number: '6',
          customerNo: 'xxxxxx',
          customerName: 'xxxxxx',
          creditVarieties: 'xxxxxx',
          currency: 'xxx',
          creditLines: 'xxxxxx',
          creditPeriod: 'xxxxxx',
          date: 'xxxxxx'
        }
      ]
    }
  },
  mounted() {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.credit-box {
  display: flex;
  flex-direction: column;
  .credit-total {
    height: 440px;
    box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.06);
    margin: 0 2px 12px 2px;
    padding: 8px 16px;
    border-radius: 8px;
    .content-container {
      display: flex;
      .left {
        flex: 3;
        margin-top: 30px;
        min-width: 400px;
        .credit-one {
          width: 120px;
          height: 40px;
          background: #F0BC3E;
          border-radius: 6px;
          margin: 0 auto;
          line-height: 40px;
          text-align: center;
          span:nth-of-type(1) {
            color: #FFFFFF;
            font-size: 14px;
          }
          span:nth-of-type(2) {
            color: #333333;
            font-size: 16px;
          }
        }
        .y-divider {
          width:1px;
          height:30px;
          background: #dddddd;
          margin:0 auto;
        }
        .tree-divider {
          width:255px;
          height:37px;
          border-top:1px solid #dddddd;
          margin:0 auto;
          position: relative;
          .tree-left {
            position: absolute;
            left: -50px;
            top: 36px;
            display: flex;
            border-radius: 6px;
            line-height: 40px;
            text-align: center;
            display: flex;
            flex-direction: column;
            border: 1px solid #dddddd;
            &:after {
              content: '';
              position: absolute;
              height: 37px;
              width: 1px;
              background: #dddddd;
              top: -37px;
              left: calc(50% - 2px);
            }
          }
          .tree-right {
            position: absolute;
            right: -50px;
            top: 36px;
            display: flex;
            border-radius: 6px;
            line-height: 40px;
            text-align: center;
            display: flex;
            flex-direction: column;
            border: 1px solid #dddddd;
            &:after {
              content: '';
              position: absolute;
              height: 37px;
              width: 1px;
              background: #dddddd;
              top: -37px;
              left: calc(50% + 2px);
            }
          }
        }
      }
      .right {
        flex: 5;
        overflow: hidden;
      }
    }
  }
}
.tree-item-title {
  padding: 0 5px;
  height: 40px;
  background: #F0BC3E;
  border-radius: 6px;
  line-height: 40px;
  text-align: center;
  span:nth-of-type(1) {
    color: #FFFFFF;
    font-size: 14px;
  }
  span:nth-of-type(2) {
    color: #333333;
    font-size: 16px;
  }
}

.tree-item {
  width: 80px;
  margin: 0 10px;
  height: 40px;
  line-height: 40px;
  border-top: 1px solid #dddddd;
  text-align: center;
  &:nth-of-type(2) {
    border-top: none;
  }
}
</style>
