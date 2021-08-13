<template>
  <div>
    <div class="customer-info">
      <div class="title">
        基本信息
      </div>
      <div class="row">
        <div class="col">
          <div class="label-cell">客户类型</div>
          <div class="content-cell"></div>
        </div>
        <div class="col">
          <div class="label-cell">法人机构</div>
          <div class="content-cell">xxxx</div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="label-cell">英文名称</div>
          <div class="content-cell"></div>
        </div>
        <div class="col">
          <div class="label-cell">客户名称</div>
          <div class="content-cell"></div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="label-cell">客户编号</div>
          <div class="content-cell">{{customerDetail.custNo}}</div>
        </div>
        <div class="col">
          <div class="label-cell">人行划分范围</div>
          <div class="content-cell"></div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="label-cell">人行划分类型</div>
          <div class="content-cell"></div>
        </div>
        <div class="col">
          <div class="label-cell">银监划分范围</div>
          <div class="content-cell"></div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="label-cell">银监划分类型</div>
          <div class="content-cell"></div>
        </div>
        <div class="col">
          <div class="label-cell">统一社会信用代码</div>
          <div class="content-cell"></div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="label-cell">批准机构</div>
          <div class="content-cell"></div>
        </div>
        <div class="col">
          <div class="label-cell">企业划型</div>
          <div class="content-cell"></div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="label-cell">行政区域</div>
          <div class="content-cell"></div>
        </div>
        <div class="col">
          <div class="label-cell">国际行业代码</div>
          <div class="content-cell"></div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="label-cell">组织机构代码</div>
          <div class="content-cell"></div>
        </div>
        <div class="col">
          <div class="label-cell">营业执照号码</div>
          <div class="content-cell"></div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="label-cell">法定代表人</div>
          <div class="content-cell"></div>
        </div>
        <div class="col">
          <div class="label-cell">成立时间</div>
          <div class="content-cell"></div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="label-cell">注册资本（元）</div>
          <div class="content-cell">{{customerDetail.regCapi}}</div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="label-cell">注册地址</div>
          <div class="content-cell"></div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="label-cell">通讯地址</div>
          <div class="content-cell"></div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="label-cell">邮政编码</div>
          <div class="content-cell"></div>
        </div>
        <div class="col">
          <div class="label-cell">经营范围</div>
          <div class="content-cell"></div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="label-cell">联系人</div>
          <div class="content-cell"></div>
        </div>
        <div class="col">
          <div class="label-cell">电话</div>
          <div class="content-cell"></div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="label-cell">手机</div>
          <div class="content-cell"></div>
        </div>
        <div class="col">
          <div class="label-cell">传真</div>
          <div class="content-cell"></div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="label-cell">E-mail</div>
          <div class="content-cell"></div>
        </div>
        <div class="col">
          <div class="label-cell">联系人所在部门</div>
          <div class="content-cell"></div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="label-cell">行业投向分类（一级）</div>
          <div class="content-cell"></div>
        </div>
        <div class="col">
          <div class="label-cell">行业投向分类（二级）</div>
          <div class="content-cell"></div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="label-cell">行业投向分类（三级）</div>
          <div class="content-cell"></div>
        </div>
        <div class="col">
          <div class="label-cell">是否上市</div>
          <div class="content-cell"></div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="label-cell">特殊行业</div>
          <div class="content-cell"></div>
        </div>
        <div class="col">
          <div class="label-cell">所属部门</div>
          <div class="content-cell"></div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="label-cell">行业备注</div>
          <div class="content-cell"></div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="label-cell">最近一期经审计净资产（元）</div>
          <div class="content-cell"></div>
        </div>
        <div class="col">
          <div class="label-cell">对应日期</div>
          <div class="content-cell"></div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="label-cell">最近一期经审计净利润（元）</div>
          <div class="content-cell"></div>
        </div>
        <div class="col">
          <div class="label-cell">对应日期</div>
          <div class="content-cell"></div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="label-cell">最近一期经审计总资产（元）</div>
          <div class="content-cell"></div>
        </div>
        <div class="col">
          <div class="label-cell">对应日期</div>
          <div class="content-cell"></div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="label-cell">备注</div>
          <div class="content-cell"></div>
        </div>
      </div>
    </div>
    <div class="customer-table">
      <div class="title">评级信息</div>
      <el-table
        :data="custGradeList"
        style="width: 100%"
        :header-row-class-name="'self-header'"
        :row-class-name="tableRowClassName">
        <el-table-column
          prop="gradeDt"
          label="评级日期"
          width="180">
        </el-table-column>
        <el-table-column
          prop="gradeResult"
          label="评级结果"
          width="180">
        </el-table-column>
        <el-table-column
          prop="gradeOrg"
          label="评级机构">
        </el-table-column>
        <el-table-column
          prop="gradeRemark"
          label="评级原因">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import api from '@/api'
import { Constants } from '../../constants'

export default {
  data() {
    return {
      custGradeList: [],
      customerDetail: {}
    }
  },
  methods: {
    getCustomerDetail() {
      let params = {
        socCode: '10000'
      }
      api.customerView.getCustomerDetail(params).then(({data}) => {
        if (data && data.code === Constants.HTTP_SUCCESS) {
          console.log('getCustomerDetail', data)
          this.customerDetail = data.data || {}
        }
      })
    },
    getCustGradeList() {
      let params = {
        current: 1,
        deptCode: '',
        size: 1000,
        socCode: '10000'
      }
      api.customerView.getCustGradeList(params).then(({data}) => {
        if (data && data.code === Constants.HTTP_SUCCESS) {
          console.log('CustGradeList', data)
          this.custGradeList = data.data.records
        }
      })
    },
    tableRowClassName({row, rowIndex}) {
      if (rowIndex % 2) {
        return 'light-row self-row'
      }
      return 'self-row'
    }
  },
  created() {
    this.getCustGradeList()
    this.getCustomerDetail()
  }
}
</script>

<style lang="scss" scoped>
.customer-info {
  display: flex;
  flex-direction: column;
  padding-top: 32px;
  .title {
    margin-bottom: 16px;
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #707070;
  }
}
.customer-table {
  display: flex;
  flex-direction: column;
  margin-top: 79px;
  .title {
    margin-bottom: 24px;
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #707070;
  }
}
.row {
  display: flex;
  height: 40px;
  .col {
    display: flex;
    align-items: center;
    flex: 1;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    margin-left: 16px;
    .label-cell {
      text-align: right;
      line-height: 40px;
      color: #707070;
      width: 200px;
      flex-shrink: 0;
    }
    .content-cell {
      margin-left: 32px;
      text-align: left;
      line-height: 40px;
      color: #4A4A4A;
    }
    &:first-of-type {
      margin-left: 0;
    }
  }
  &:nth-of-type(even) {
    .col {
      background: #F4F4F5;
    }
  }
}
</style>
