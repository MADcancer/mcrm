<template>
  <div class="group-info">
    <el-dialog
      title="客户组详情"
      :visible.sync="dialogInfoVisible"
      width="900px"
      :before-close="cancel"
    >
      <!-- 基本信息 -->
      <div v-if="step == 1" class="info">
        <el-steps :space="100" :active="step" align-center style="width: 300px; margin: 0 auto">
					<el-step title="基本信息" @click.native="clickStep(1)" class="step"></el-step>
					<el-step title="名单列表" @click.native="clickStep(2)" class="step unfinish"></el-step>
				</el-steps>
        <div class="inline">
          <span>客户组名称：</span><el-input v-model="currentGroup.groupName" disabled></el-input>
        </div>
        <div class="inline">
          <span>客户组说明：</span><el-input
            v-model="currentGroup.groupDesc"
            type="textarea"
            disabled
          ></el-input>
        </div>
        <div class="inline">
          <span>客户组类型：</span><el-input
            v-model="groupType[currentGroup.groupType]"
            disabled
          ></el-input>
        </div>
        <div class="inline" v-if="currentGroup.groupType === '1' && setCustLevel.length !== 0">
          <span>客户等级：</span><el-select v-model="setCustLevel" multiple placeholder="请选择" disabled>
            <el-option
              v-for="item in custLevels"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="inline" v-if="currentGroup.groupType === '1' && currentGroup.orgName">
          <span>机构：</span><el-tooltip class="item" effect="dark" :content="currentGroup.orgName" placement="top-start">
            <el-input v-model="currentGroup.orgName" disabled></el-input>
          </el-tooltip>
        </div>
        <div class="inline" v-if="currentGroup.groupType === '1' && currentGroup.cardName">
          <span>人才卡：</span><el-tooltip class="item" effect="dark" :content="currentGroup.cardName" placement="top-start">
            <el-input v-model="currentGroup.cardName" disabled></el-input>
          </el-tooltip>
        </div>
      </div>
      <!-- 名单列表 -->
      <div v-else style="width: 100%">
        <el-steps :space="100" :active="step" align-center style="width: 300px; margin: 0 auto">
					<el-step title="基本信息" @click.native="clickStep(1)" class="step unfinish"></el-step>
					<el-step title="名单列表" @click.native="clickStep(2)" class="step"></el-step>
				</el-steps>
        <div style="text-align:center" class="info info2">
          客户号
          <el-input v-model="custNo" style="margin-left: 23px"></el-input>
        </div>
        <div class="search">
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="search"
            :loading="searchLoading"
            >查询</el-button
          >
          <el-button icon="el-icon-refresh-right" @click="reset" :loading="resetLoading"
            >重置</el-button
          >
        </div>
        <el-table
          :data="infoList"
          height="250"
          border
          style="width: 100%"
          :header-cell-style="{
            background: '#80A639',
            'font-weight': '400',
            color: '#ffffff'
          }"
        >
          <el-table-column label="客户号" header-align="center" align="center" prop="custNo">
          </el-table-column>
          <el-table-column
            prop="custName"
            label="客户姓名"
            header-align="center"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="scoreChannel"
            label="积分渠道"
            header-align="center"
            align="center"
          >
            <template slot-scope="scope">
              {{ $root.selectOption.channelObj[scope.row.scoreChannel] }}
            </template>
          </el-table-column>
          <el-table-column
            prop="bvCdNames"
            label="卡种"
            header-align="center"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="talentLevel"
            label="人才标志"
            header-align="center"
            align="center"
          >
          </el-table-column>
        </el-table>
        <v-pagination
          :total="page.total"
          :currentPageNum="page.page"
          :currentPageSize="page.limit"
          :pagerCount="5"
          @pageChange="pageChange"
        ></v-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import vPagination from '@/components/pagination/pagination'
import API from '@/api'
export default {
  components: { vPagination },
  props: {
    dialogInfoVisible: {
      type: Boolean
    },
    currentGroup: {
      type: Object
    }
  },
  watch: {
    dialogInfoVisible (value) {
      if (value) {
        // 初始化表单
        this.custNo = ''
        this.getCustGroup(1)
      }
    }
  },
  data () {
    return {
      step: 1,
      page: {
        total: 0,
        page: 1,
        limit: 10
      },
      custNo: '',
      infoList: [],
      searchLoading: false,
      resetLoading: false,
      groupType: ['导入名单', '筛选条件', '代发薪','社保卡营销'],
      areaCards: [],
      cityCards: [],
      custLevels: [
        {
          value: '',
          label: '请选择'
        }, {
          value: '0',
          label: '零星'
        }, {
          value: '1',
          label: '一星'
        }, {
          value: '2',
          label: '二星'
        }, {
          value: '3',
          label: '三星'
        }, {
          value: '4',
          label: '四星'
        }, {
          value: '5',
          label: '五星'
        }, {
          value: '6',
          label: '六星'
        }
      ]
    }
  },
  computed: {
    setCustLevel() {
      return this.currentGroup.custLevel === null ? [] : this.currentGroup.custLevel.split(',')
    },
    setAreaCard() {
      return !this.currentGroup.certYcDistrict || this.currentGroup.certYcDistrict === null ? [] : this.currentGroup.certYcDistrict.split(',')
    },
    setCityCard() {
      return !this.currentGroup.certYcCity || this.currentGroup.certYcCity === null ? [] : this.currentGroup.certYcCity.split(',')
    }
  },
  methods: {
    // 检索
    search () {
      this.searchLoading = true
      this.getCustGroup(1)
    },
    // 获取数据
    getCustGroup (page = this.page.page) {
      this.page.page = page
      API.custgroup.qryCustList({
        custNo: this.custNo.trim(),
        groupNo: this.currentGroup.groupNo,
        ...this.page
      }).then(res => {
        this.searchLoading = false
        this.resetLoading = false
        this.page.total = res.data.data.totalCount
        this.infoList = res.data.data.list
      }).catch(() => {
        this.searchLoading = false
        this.resetLoading = false
      })
    },
    // 重置
    reset () {
      this.custNo = ''
      this.resetLoading = true
      this.getCustGroup(1)
    },
    // 分页
    pageChange (val) {
      this.page.page = val.page
      this.page.limit = val.limit
      this.getCustGroup()
    },
    clickStep(val) {
      this.step = val
    },
    cancel () {
      this.$emit('cancel', { type: 'info' })
      setTimeout(() => {
        this.step = 1
      }, 350)
    }
  }
}
</script>

<style lang="scss" scoped>
.group-info {
  /deep/ .el-step {
    width: 50%;
    max-width: unset !important;
  }
  .info {
    /deep/ .el-input,
    /deep/ .el-textarea {
      width: 370px;
    }
    .inline {
      padding-bottom: 20px;
      span {
        width: 100px;
        display: inline-block;
      } 
    }
  }
  .info2 {
    /deep/ .el-input,
    /deep/ .el-textarea {
      width: 240px;
    }
  }
  .step:hover {
		cursor: pointer;
	}
	.unfinish {
		/deep/ .is-finish {
			color: #606266;
			border-color: #606266
		}
	}
  .search {
    margin-top: 16px;
    margin-bottom: 24px;
    text-align: center;
  }
}
</style>
