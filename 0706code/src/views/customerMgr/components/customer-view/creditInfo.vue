<template>
  <div class="credit-box mt-16">
    <div class="credit-total">
      <div class="title">
        <div class="title-text">授信总额（元）：{{creditInfo.creditAmt | moneyFormat}}</div>
      </div>
      <div class="content-container mt-16">
        <div class="left" :style="{minHeight: minHeight}" v-if="Object.keys(creditInfo).length">
          <div style="margin:0 auto;">
            <div class="credit-one">
              <span>{{creditInfo.busiTypeName}}</span>
              <span>{{creditInfo.creditAmt | moneyFormat}}</span>
            </div>
          </div>
          <div class="y-divider"></div>
          <!--画一个无底边部的边框-->
          <div class="tree-divider" :style="{width: overWidth, marginLeft: creditInfo.list.length > 2 ? '50px' : ''}" v-if="creditInfo.list.length > 1">
            <div class="tree-box" v-for="(item, index) in creditInfo.list" :style="setPosition(index)">
              <div class="tree-item-title">
                <span>{{item.busiTypeName}}</span>
                <span>{{item.creditAmt | moneyFormat}}</span>
              </div>
              <div class="tree-item" v-for="busItem in item.list">{{ item.busiTypeName }}</div>
            </div>
          </div>
        </div>
        <div v-else class="left"></div>
        <div class="right">
          <el-table
            :data="creditList"
            style="width: 100%"
            :header-row-class-name="'self-header-2'">
            <el-table-column
              prop="number"
              label="序号"
              width="50">
            </el-table-column>
            <el-table-column
              prop="custNo"
              label="客户编号"
              width="100">
            </el-table-column>
            <el-table-column
              prop="custName"
              label="客户名称"
              width="100">
            </el-table-column>
            <el-table-column
              prop="busiTypeName"
              label="授信品种"
              width="100">
            </el-table-column>
            <el-table-column
              prop="busiCurrency"
              label="币种"
              width="50">
            </el-table-column>
            <el-table-column
              label="授信额度（元）">
              <template slot-scope="scope">
                <span>{{ scope.row.busiAmt | moneyFormat }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="授信总额度（元）">
              <template slot-scope="scope">
                <span>{{ scope.row.creditAmt | moneyFormat }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="termMonth"
              label="授信期限（月）">
            </el-table-column>
            <el-table-column
              prop="occurDt"
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
            prop="custNo"
            label="客户编号">
          </el-table-column>
          <el-table-column
            prop="custName"
            label="客户名称">
          </el-table-column>
          <el-table-column
            prop="busiAmt"
            label="用信金额">
          </el-table-column>
          <el-table-column
            prop="busiCurrency"
            label="币种">
          </el-table-column>
          <el-table-column
            prop="busiType"
            label="公贷产品名称">
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api'
import { Constants } from '../../constants'

export default {
  props: {
    socCode: {
      type: String
    }
  },
  data() {
    return {
      tableData: [],
      creditInfo: {},
      overWidth: '255px',
      minHeight: '',
      creditList: []
    }
  },
  mounted() {
  },
  created() {
    this.getCreditTree()
    this.getCreditList()
    this.getCreditListCg()
  },
  methods: {
    setPosition(index) {
      let left = index !== this.creditInfo.list.length - 1 ? (150 * index - 50 + 'px') : ''
      let right = index === this.creditInfo.list.length - 1 ? '-50px' : ''
      return {left, right}
    },
    getCreditTree() {
      let params = {
        creditObj: '1',
        socCode: this.socCode
      }
      api.customerView.getCreditTree(params).then(({ data }) => {
        if (data && data.code === Constants.HTTP_SUCCESS) {
          console.log('getCreditTree', data)
          this.creditInfo = data.data[0] || {}
          if (this.creditInfo.list) {
            if (this.creditInfo.list.length > 2) {
              this.overWidth = (this.creditInfo.list.length - 1) * 150 + 'px'
            }
            this.minHeight = this.getMinHeight()
          }
        }
      })
    },
    getMinHeight() {
      let heightNum = 0
      for (const item of this.creditInfo.list) {
        let number = 40
        if (item.list) {
          item.list.forEach(() => {
            number += 40
          })
          heightNum = heightNum > number ? heightNum : number
        }
      }
      return heightNum + 110 + 'px'
    },
    getCreditList() {
      let params = {
        creditObj: '1',
        socCode: this.socCode,
        current: 1,
        size: 6
      }
      this.creditList = []
      api.customerView.getCreditList(params).then(({ data }) => {
        if (data && data.code === Constants.HTTP_SUCCESS) {
          console.log('getCreditList', data)
          if (data.data && Array.isArray(data.data.records)) {
            data.data.records.forEach((item, index) => {
              item.number = (data.data.current - 1) * data.data.size + index + 1
            })
            this.creditList = data.data.records
          }
        }
      })
    },
    getCreditListCg() {
      let params = {
        detailType: 1,
        socCode: this.socCode,
        current: 1,
        size: 6
      }
      this.creditList = []
      api.customerView.getCreditListCg(params).then(({ data }) => {
        if (data && data.code === Constants.HTTP_SUCCESS) {
          console.log('getCreditListCg', data)
          if (data.data && Array.isArray(data.data.records)) {
            data.data.records.forEach((item, index) => {
              item.number = (data.data.current - 1) * data.data.size + index + 1
            })
            this.tableData = data.data.records
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.credit-box {
  display: flex;
  flex-direction: column;
  .credit-total {
    box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.06);
    margin: 0 2px 12px 2px;
    padding: 8px 16px 40px;
    border-radius: 8px;
    .content-container {
      display: flex;
      .left {
        flex: 3;
        margin-top: 30px;
        min-width: 400px;
        overflow-x: auto;
        overflow-y: hidden;
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
          .tree-box {
            position: absolute;
            top: 36px;
            display: flex;
            border-radius: 6px;
            line-height: 40px;
            text-align: center;
            display: flex;
            flex-direction: column;
            border: 1px solid #dddddd;
            box-sizing: border-box;
            &:after {
              content: '';
              position: absolute;
              height: 37px;
              width: 1px;
              background: #dddddd;
              top: -37px;
              left: 50%;
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
