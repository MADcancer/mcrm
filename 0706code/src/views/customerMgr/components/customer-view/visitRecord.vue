<template>
  <div class="visit-record">
    <div class="title">
      <div class="title-text">拜访记录</div>
    </div>
    <div class="no-data" v-if="!tableData.length">暂无数据</div>
    <div class="visit-content" v-if="tableData.length">
      <div class="card-item" v-for="item in tableData">
        <div class="card-top">
          <i class="icon-phone-visit"></i>
          <div class="visit-name">
            <div>{{item.oppositeUser}}</div>
            <div>{{getServType(item.servType)}} <span style="padding: 0 5px">|</span> {{item.servDt | fomatData}}</div>
          </div>
        </div>
        <div class="divider-align"></div>
        <div class="card-middle">
          <div class="middle-title">
            <div class="title-text">交流内容</div>
            <div class="title-button">展开</div>
          </div>
          <div class="middle-content">{{item.servRemark}}</div>
        </div>
        <div class="divider-align"></div>
        <div class="card-bottom">
          <div class="bottom-people">
            <i class="icon-user"></i>
            <div>{{item.userNo}}</div>
          </div>
          <div class="visit-date">
            <i class="icon-date"></i>
            <div>{{item.createDt | fomatData}}</div>
          </div>
        </div>
      </div>
<!--      <div class="card-item">-->
<!--        <div class="card-top">-->
<!--          <i class="icon-face-visit"></i>-->
<!--          <div class="visit-name">-->
<!--            <div>赵又廷</div>-->
<!--            <div>当面拜访 | 2021-10-10</div>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="divider-align"></div>-->
<!--        <div class="card-middle">-->
<!--          <div class="middle-title">-->
<!--            <div class="title-text">交流内容</div>-->
<!--            <div class="title-button">展开</div>-->
<!--          </div>-->
<!--          <div class="middle-content">-->
<!--            在我们的日常生活中，做客拜访是最常见的联络感情、增进友谊的交际形式，拜访别人是生活中很重要的一个活动，所以在拜访别人之前，我们要做一些适当的准备，如首先我们一定要目的，明确拜访的时间等。今天和大家分享一点拜访礼仪的经验,做客拜访是最常见的联络感情在我们的日常生活中，做客拜访是最常见的联络感情、增进友谊的交际形式，拜访别人是生活中很重要的一个活动，所以在拜访别人之前，我们要做一些适当的准备，如首先我们一定要目的，明确拜访的时间等。今天和大家分享一点拜访礼仪的经验,做客拜访是最常见的联络感情-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="divider-align"></div>-->
<!--        <div class="card-bottom">-->
<!--          <div class="bottom-people">-->
<!--            <i class="icon-user"></i>-->
<!--            <div>高圆圆</div>-->
<!--          </div>-->
<!--          <div class="visit-date">-->
<!--            <i class="icon-date"></i>-->
<!--            <div>2021.10.10</div>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
<!--      <div class="card-item">-->
<!--        <div class="card-top">-->
<!--          <i class="icon-we-visit"></i>-->
<!--          <div class="visit-name">-->
<!--            <div>赵又廷</div>-->
<!--            <div>微信拜访 | 2021-10-10</div>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="divider-align"></div>-->
<!--        <div class="card-middle">-->
<!--          <div class="middle-title">-->
<!--            <div class="title-text">交流内容</div>-->
<!--            <div class="title-button">展开</div>-->
<!--          </div>-->
<!--          <div class="middle-content">-->
<!--            在我们的日常生活中，做客拜访是最常见的联络感情、增进友谊的交际形式，拜访别人是生活中很重要的一个活动，所以在拜访别人之前，我们要做一些适当的准备，如首先我们一定要目的，明确拜访的时间等。今天和大家分享一点拜访礼仪的经验,做客拜访是最常见的联络感情在我们的日常生活中，做客拜访是最常见的联络感情、增进友谊的交际形式，拜访别人是生活中很重要的一个活动，所以在拜访别人之前，我们要做一些适当的准备，如首先我们一定要目的，明确拜访的时间等。今天和大家分享一点拜访礼仪的经验,做客拜访是最常见的联络感情-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="divider-align"></div>-->
<!--        <div class="card-bottom">-->
<!--          <div class="bottom-people">-->
<!--            <i class="icon-user"></i>-->
<!--            <div>高圆圆</div>-->
<!--          </div>-->
<!--          <div class="visit-date">-->
<!--            <i class="icon-date"></i>-->
<!--            <div>2021.10.10</div>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
    </div>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page.sync="pagination.currentPage"
      :page-size="pagination.size"
      layout="prev, pager, next, jumper"
      :total="pagination.total">
    </el-pagination>
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
      pagination: {
        currentPage: 1,
        size: 8,
        total: 0
      }
    }
  },
  methods: {
    getCustServList() {
      let params = {
        // socCode: '10000',
        current: this.pagination.currentPage,
        size: this.pagination.size
      }
      this.tableData = []
      api.customerView.getCustServList(params).then(({ data }) => {
        if (data && data.code === Constants.HTTP_SUCCESS) {
          console.log('getCustServ', data)
          this.tableData = data.data ? data.data.records : []
          this.pagination.total = data.data.total
        }
      })
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.getCustServList()
    },
    getServType(servType) {
      if (this.$root.selectOption && this.$root.selectOption.servType) {
        return this.$root.selectOption.servType.find(e => servType === e.value).label
      }
      return servType
    }
  },
  created() {
    this.getCustServList()
  }
}
</script>

<style lang="scss" scoped>
.visit-record {
  background: #FFFFFF;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  padding: 16px 8px;
  .visit-content {
    display: flex;
    flex-wrap: wrap;
    .card-item {
      width: calc((100% - 48px)/4);
      height: 393px;
      background: #FFFFFF;
      box-shadow: 0px 4px 16px 0px rgba(1, 58, 129, 0.1);
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      margin-left: 16px;
      padding: 24px;
      &:nth-of-type(4n+1) {
        margin-left: 0;
      }
      &:nth-of-type(n+5) {
        margin-top: 16px;
      }
      .divider-align {
        flex-shrink: 0;
        height: 1px;
        margin: 16px 0;
        background: #EDEDED;
        border-radius: 4px;
      }
      .card-top {
        display: flex;
        .visit-name {
          display: flex;
          flex-direction: column;
          margin-left: 13px;
          div:nth-of-type(1) {
            font-size: 16px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #333333;
          }
          div:nth-of-type(2) {
            margin-top: 1px;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #707070;
          }
        }
      }
      .card-middle {
        display: flex;
        flex-direction: column;
        .middle-title {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          .title-text {
            color: #707070;
          }
          .title-button {
            color: #79AC43;
            cursor: pointer;
          }
        }
        .middle-content {
          margin-top: 8px;
          font-size: 14px;
          height: 160px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #666666;
          line-height: 20px;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 8;
          overflow: hidden;
        }
      }
      .card-bottom {
        display: flex;
        justify-content: space-around;
        .bottom-people {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          div {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #666666;
            line-height: 20px;
            margin-top: 4px;
          }
        }
        .visit-date {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          div {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #666666;
            line-height: 20px;
            margin-top: 4px;
          }
        }
      }
    }
  }
}
</style>
