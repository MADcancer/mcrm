<template>
  <div class="workbench">
    <div class="cardsDiv">
      <div class="card eventReminder">
        <div class="cardTitle">
          <div>
            <div></div>
            <div>
              事件提醒（待阅读<span style="color: #f5874a">{{
                eventReminderUnReadNum
              }}</span
              >）
            </div>
          </div>
          <div @click="goEventReminder">查看更多></div>
        </div>
        <div
          class="cardContent"
          v-for="(item, index) in eventReminderList"
          :key="index"
        >
          <div>{{ item }}</div>
          <div>2020-20-20</div>
        </div>
      </div>
      <div class="card notice">
        <div class="cardTitle">
          <div>
            <div></div>
            <div>
              公告（待阅读<span style="color: #f5874a">{{
                noticeUnReadNum
              }}</span
              >）
            </div>
          </div>
          <div @click="goNoticeManagement">查看更多></div>
        </div>
        <div
          class="cardContent"
          v-for="(item, index) in eventReminderList"
          :key="index"
        >
          <div>{{ item }}</div>
          <div>2020-20-20</div>
        </div>
      </div>
      <div class="card myProcess">
        <div class="cardTitle">
          <div>
            <div></div>
            <div>
              我的流程（待审批<span style="color: #f5874a">{{
                myProcessUnReadNum
              }}</span
              >）
            </div>
          </div>
          <div @click="goMyProcess">查看更多></div>
        </div>
        <div
          class="cardContent"
          v-for="(item, index) in eventReminderList"
          :key="index"
        >
          <div>{{ item }}</div>
          <div>2020-20-20</div>
        </div>
      </div>
      <div class="card riskLimits">
        <div class="cardTitle">
          <div>
            <div></div>
            <div>风险限额</div>
          </div>
          <div @click="goRiskLimits">查看更多></div>
        </div>
        <div
          class="cardContent"
          v-for="(item, index) in eventReminderList"
          :key="index"
        >
          <div>{{ item }}</div>
          <div>2020-20-20</div>
        </div>
      </div>
    </div>
    <div class="productOfferDiv">
      <div class="productOfferTitle">产品报价</div>
      <div class="productOfferContent">
        <div class="echartsDiv">
          <div class="echartsDivTitle">
            <div>总部FTP价格</div>
            <div>
              <el-button type="success" size="small" plain>模板下载</el-button>
              <el-button type="success" size="small" plain @click="upFTPPrice"
                >上传</el-button
              >
              <el-select
                style="margin-left: 10px"
                v-model="productValue"
                placeholder="产品分类"
                size="small"
              >
                <el-option
                  v-for="item in productList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="echartsDivContent">
            <div id="echarts" style="width: 800px; height: 400px"></div>
            <div class="radioDiv">
              <el-radio-group v-model="radioValue" size="mini">
                <el-radio-button label="0/N"></el-radio-button>
                <el-radio-button label="7D"></el-radio-button>
                <el-radio-button label="14D"></el-radio-button>
                <el-radio-button label="21D"></el-radio-button>
                <el-radio-button label="1M"></el-radio-button>
                <el-radio-button label="3M"></el-radio-button>
                <el-radio-button label="6M"></el-radio-button>
                <el-radio-button label="9M"></el-radio-button>
                <el-radio-button label="1Y"></el-radio-button>
              </el-radio-group>
            </div>
          </div>
        </div>
        <div class="tableDiv">
          <el-table
            :data="FTPTableData"
            border
            style="width: 100%"
            header-cell-style="background-color:#f2f2f2;text-align:center;"
            cell-style="text-align:center;"
          >
            <el-table-column prop="term" label="期限" width="60">
            </el-table-column>
            <el-table-column prop="price" label="总部FTP价格">
            </el-table-column>
            <el-table-column prop="referent" label="参考对象" width="80">
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <el-dialog
      title="上传FTP价格"
      :visible.sync="dialogVisible"
      width="60%"
      :before-close="handleClose"
    >
      <div>
        <el-col :span="24">
          <el-input
            style="width: 100%"
            placeholder="请输入FTP价格"
            v-model="FTPPrice"
            size="medium"
          >
          </el-input>
        </el-col>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">
          提交
        </el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import API from '@/api'
import filters from '@/filters'
import * as echarts from 'echarts'
export default {
  name: 'workbench',
  computed: {
    // 是否是管理员
    isAdmin() {
      return this.$store.state.user.roleId.toString().indexOf('03') !== -1
    },
  },
  data() {
    return {
      eventReminderList: [1, 2, 3],
      noticeList: [1, 2, 3],
      myProcessList: [1, 2, 3],
      riskLimitsList: [1, 2, 3],
      eventReminderUnReadNum: 1,
      noticeUnReadNum: 2,
      myProcessUnReadNum: 3,
      dialogVisible: false,
      FTPPrice: 0,
      FTPTableData: [
        {
          term: '0/N',
          price: '7D',
          referent: 'FTP001',
        },
        {
          term: '7D',
          price: '2.10',
          referent: 'FTP007',
        },
        {
          term: '14D',
          price: '2.10',
          referent: 'FTP014',
        },
        {
          term: '21D',
          price: '2.10',
          referent: '7D',
        },
        {
          term: '1M',
          price: '7D',
          referent: '7D',
        },
        {
          term: '3M',
          price: '2.10',
          referent: '同业存单',
        },
        {
          term: '6M',
          price: '2.10',
          referent: '同业存单',
        },
        {
          term: '9M',
          price: '2.10',
          referent: '同业存单',
        },
        {
          term: '1Y',
          price: '2.10',
          referent: '同业存单',
        },
      ],
      productList: [
        { value: 0, label: '0/N' },
        { value: 1, label: '7D' },
        { value: 2, label: '14D' },
        { value: 3, label: '21D' },
        { value: 4, label: '1M' },
        { value: 5, label: '3M' },
        { value: 6, label: '6M' },
        { value: 7, label: '9M' },
        { value: 8, label: '1Y' },
      ],
      productValue: '',
      radioValue: 0,
    }
  },
  methods: {
    // 跳转 事件提醒
    goEventReminder() {
      this.$router.push({ name: 'eventReminder' })
    },
    // 跳转 公告管理
    goNoticeManagement() {
      this.$router.push({ name: 'noticeManagement' })
    },
    // 跳转 我的流程
    goMyProcess() {
      this.$router.push({ name: 'myProcess' })
    },
    // 跳转 风险限额
    goRiskLimits() {
      this.$router.push({ name: 'riskLimits' })
    },
    // 初始化 FTP报价图表
    initFTPOffer() {
      var chartDom = document.getElementById('echarts')
      var myChart = echarts.init(chartDom)
      var option
      option = {
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: [150, 230, 224, 218, 135, 147, 260],
            type: 'line',
          },
        ],
      }

      option && myChart.setOption(option, true)
    },
    // 上传
    upFTPPrice() {
      this.dialogVisible = true
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.initFTPOffer() //加载总部FTP报价
    })
  },
}
</script>
<style scoped>
.workbench {
  min-width: 1130px;
  height: 100%;
}
.cardsDiv {
  width: 100%;
  height: 507px;
  display: flex;
  align-content: space-between;
  justify-content: space-between;
  flex-wrap: wrap;
}
.card {
  min-width: 560px;
  width: 49%;
  height: 240px;
  box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.06);
  background-color: #fff;
  border-radius: 1px;
  box-sizing: border-box;
  padding: 0px 24px 22px 24px;
}
.cardTitle {
  width: 100%;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.cardTitle > div:nth-child(1) {
  font-size: 18px;
  font-weight: 400;
}
.cardTitle > div:nth-child(2) {
  color: #999999;
  font-size: 14px;
  cursor: pointer;
}
.cardContent {
  width: 100%;
  height: 43px;
  border-bottom: 1px solid #eeeeee;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  margin-top: 10px;
  cursor: pointer;
}
.card > .cardContent:nth-child(2) {
  margin-top: 0;
}
.productOfferDiv {
  width: 100%;
  min-height: 644px;
  background-color: #fff;
  box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.06);
  border-radius: 8px;
  margin-top: 21px;
  margin-bottom: 40px;
  padding-top: 13px;
}
.productOfferTitle {
  color: #333333;
  font-size: 16px;
  margin-left: 20px;
}
.productOfferContent {
  width: 100%;
  min-height: 600px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
}
.echartsDiv {
  width: 790px;
  min-height: 600px;
  margin-top: 30px;
}
.echartsDivTitle {
  width: 100%;
  height: 66px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.echartsDivContent {
  width: 100%;
  min-height: 400px;
}
.radioDiv {
  display: flex;
  align-items: center;
  justify-content: center;
}
.tableDiv {
  min-width: 260px;
  width: 100%;
  margin-left: 24px;
  min-height: 600px;
  margin-top: 30px;
}
</style>