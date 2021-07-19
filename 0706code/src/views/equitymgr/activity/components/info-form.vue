<template>
  <div class="info-form">
    <el-form
      :model="basicInfoForm"
      ref="basicInfoForm"
      :rules="rules"
      label-width="120px"
      class="demo-dynamic"
      size="mini"
      label-position="left"
    >
      <div class="info-form-row">
        <el-form-item label="权益板块名称:" prop="boardName">
          <el-input :disabled="true" placeholder="请查询" v-model="basicInfoForm.boardName">
            <i
              v-if="!inputDisabled"
              slot="suffix"
              class="el-input__icon el-icon-khz"
              @click="handleSearchIcon('board')"
            ></i>
          </el-input>
          <router-link  :to="{path:'/equitymgr/board'}" target="_blank">
            <i v-if="!inputDisabled" class="el-icon-plus add-icon-style"></i>
          </router-link>
        </el-form-item>
        <el-form-item label="活动名称:" prop="actName">
          <el-input
            :disabled="inputDisabled"
            maxlength="60"
            placeholder="请输入活动名称"
            v-model="basicInfoForm.actName"
          ></el-input>
        </el-form-item>
      </div>
      <div class="info-form-row">
        <el-form-item label="活动渠道:" prop="actChannel">
          <el-select disabled v-model="basicInfoForm.actChannel" placeholder="请选择">
            <el-option
              v-for="(item,index) in $root.selectOption.channel"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动目标:" prop="actTarget">
          <el-select
            :disabled="inputDisabled"
            v-model="basicInfoForm.actTarget"
            placeholder="请选择"
          >
            <el-option
              v-for="item in actTargetOptions"
              :key="item.key"
              :label="item.name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
      </div>
      <div class="info-form-row">
        <el-form-item label="活动开始时间:" prop="actBegtime" :key="basicInfoForm.actBegtime">
          <el-date-picker
            :disabled="inputDisabled"
            v-model="basicInfoForm.actBegtime"
            type="date"
            value-format="yyyy/MM/dd"
            format="yyyy/MM/dd"
            placeholder="请选择活动开始时间"
            :picker-options="pickerOptions"
            :editable="false"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="活动结束时间:" prop="actEndtime" :key="basicInfoForm.actEndtime">
          <el-date-picker
            :disabled="inputDisabled"
            v-model="basicInfoForm.actEndtime"
            type="date"
            value-format="yyyy/MM/dd"
            format="yyyy/MM/dd"
            placeholder="请选择活动结束时间"
            :picker-options="pickerOptions"
            :editable="false"
          ></el-date-picker>
        </el-form-item>
      </div>
      <div class="info-form-row">
        <el-form-item label="活动频率:" prop="actRate">
          <el-select
            :disabled="inputDisabled"
            v-model="basicInfoForm.actRate"
            placeholder="请选择"
            @change="handleActRateChange"
          >
            <el-option
              v-for="item in actFreOptions"
              :key="item.key"
              :label="item.name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="每次具体时间:" prop="actTime">
          <el-input :disabled="true" placeholder="请查询" v-model="basicInfoForm.actTime">
            <i
              v-if="!inputDisabled"
              slot="suffix"
              class="el-input__icon el-icon-khz"
              @click="handleSearchIcon('time')"
            ></i>
          </el-input>
        </el-form-item>
      </div>
      <div class="info-form-row">
        <el-form-item label="参与活动对象:" prop="custType">
          <el-select
            :disabled="inputDisabled"
            v-model="basicInfoForm.custType"
            placeholder="请选择"
          >
            <el-option
              v-for="item in custTypeOptions"
              :key="item.key"
              :label="item.name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="basicInfoForm.custType === '1'" label="客户组:" prop="custGroupName">
          <el-input :disabled="true" placeholder="请查询" v-model="basicInfoForm.custGroupName">
            <i
              v-if="type !== 'detail'  && actStatus !== '4'"
              slot="suffix"
              class="el-input__icon el-icon-khz"
              @click="handleSearchIcon('group')"
            ></i>
          </el-input>
          <router-link :to="{path:'/custmgr/custgroup'}" target="_blank">
            <i v-if="!inputDisabled" class="el-icon-plus add-icon-style"></i>
          </router-link>
        </el-form-item>
        <el-form-item v-if="basicInfoForm.custType === '2'" label="机构:" prop="orgName">
          <el-input :disabled="true" placeholder="请查询" v-model="basicInfoForm.orgName">
            <i
              v-if="!inputDisabled"
              slot="suffix"
              class="el-input__icon el-icon-khz"
              @click="handleSearchIcon('org')"
            ></i>
          </el-input>
        </el-form-item>
      </div>
      <div class="info-form-row">
        <el-form-item label="活动顺序:" prop="sort">
          <el-input
            :disabled="inputDisabled"
            maxlength="6"
            placeholder="请输入活动顺序"
            v-model="basicInfoForm.sort"
          ></el-input>
        </el-form-item>
        <el-form-item label="每人兑换上限:" prop="actMaxAmout">
          <el-input
            :disabled="inputDisabled"
            maxlength="60"
            placeholder="请输入每人兑换上限值"
            v-model="basicInfoForm.actMaxAmout"
          ></el-input>
        </el-form-item>
      </div>
      <el-form-item label="备注:" prop="note">
        <el-input
          :disabled="inputDisabled"
          type="textarea"
          :rows="3"
          maxlength="100"
          placeholder="请输入"
          v-model="basicInfoForm.note"
        ></el-input>
      </el-form-item>
    </el-form>
    <v-board :boardDialogVisible="boardDialogVisible" @selected="selected"></v-board>
    <el-dialog
      class="group-dialog"
      title="查询"
      :visible.sync="groupDialogVisible"
      width="850px"
      append-to-body
    >
      <div style="width: 100%">
        <div class="group-dialog-search">
          <div class="search-input">
            <div class="search-input-label">客户组名称</div>
            <el-input placeholder="请输入客户组名称" v-model="searchParams.groupName"></el-input>
          </div>
          <div class="search-btns">
            <el-button type="primary" icon="el-icon-query" @click="onSearchBtn">查询</el-button>
            <el-button icon="el-icon-reset" @click="onResetBtn">重置</el-button>
          </div>
        </div>
        <el-table
          class="group-dialog-table"
          :data="groupTableData"
          style="width: 100%"
          border
          :header-cell-style="{ background: '#80A639', color: '#ffffff' }"
        >
          <el-table-column label="选择" fixed width="60" align="center">
            <template slot-scope="scope">
              <el-radio
                v-model="radio"
                :label="scope.$index"
                @change="onTableSelect(scope.row)"
              >&nbsp;</el-radio>
            </template>
          </el-table-column>
          <el-table-column prop="groupName" label="客户组名称" width="180" align="center"></el-table-column>
          <el-table-column prop="createDate" label="创建时间" width="160" align="center"></el-table-column>
          <el-table-column prop="createEmpNo" label="创建人工号" width="100" align="center"></el-table-column>
          <el-table-column prop="createEmpName" label="创建人" align="center"></el-table-column>
        </el-table>
        <v-pagination
          :total="page.total"
          :currentPageNum="page.currentPage"
          :currentPageSize="page.pageSize"
          @pageChange="pageChange"
        ></v-pagination>
        <div class="group-dialog-btns">
          <el-button type="primary" @click="handleCustGroupAdd">添 加</el-button>
          <el-button @click="groupDialogVisible = false">返 回</el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      class="time-dialog"
      :title="
        basicInfoForm.actRate === 'M'
          ? '每月具体时间'
          : basicInfoForm.actRate === 'W'
          ? '每周具体时间'
          : '每日具体时间'
      "
      :visible.sync="timeDialogVisible"
      width="874px"
      append-to-body
    >
      <div>
        <el-form
          :model="timeForm"
          ref="timeForm"
          :rules="timeRules"
          label-width="110px"
          class="demo-dynamic"
          size="mini"
          label-position="left"
        >
          <div class="time-row" v-if="basicInfoForm.actRate === 'M'">
            <el-form-item label="每月具体日期" prop="dateM">
              <el-select v-model="timeForm.dateM" placeholder="请选择">
                <el-option
                  v-for="item in monthOptions"
                  :key="item"
                  :label="item"
                  :value="item"
                  width="220px"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="time-row" v-if="basicInfoForm.actRate === 'W'">
            <el-form-item label="每周具体日期" prop="dateW">
              <el-select v-model="timeForm.dateW" placeholder="请选择" width="220px">
                <el-option
                  v-for="item in weekOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  width="220px"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="time-row-day">
            <el-form-item label="每日开始时间" prop="beginTimeD">
              <el-time-select
                v-model="timeForm.beginTimeD"
                :picker-options="{
                  start: '00:00',
                  step: '01:00',
                  end: '24:00'
                }"
                placeholder="选择时间点"
                :editable="false"
              ></el-time-select>
            </el-form-item>
            <div class="time-row-day-line">-</div>
            <el-form-item label="每日结束时间" prop="endTimeD">
              <el-time-select
                v-model="timeForm.endTimeD"
                :picker-options="{
                  start: '00:00',
                  step: '01:00',
                  end: '24:00'
                }"
                placeholder="选择时间点"
                :editable="false"
              ></el-time-select>
            </el-form-item>
          </div>
        </el-form>
        <div class="time-dialog-btns">
          <el-button type="primary" @click="handleTimeAdd">添 加</el-button>
          <el-button @click="timeDialogVisible = false">返 回</el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      class="org-dialog"
      title="机构选择"
      :visible.sync="orgDialogVisible"
      width="600px"
      append-to-body
    >
      <div v-loading="waitLoading">
        <el-tree
          ref="tree"
          :data="orgData"
          :props="defaultProps"
          show-checkbox
          node-key="id"
          :check-strictly="true"
          :default-expanded-keys="['706660888']"
          :default-checked-keys="orgCheckedIds"
          @check="check"
        ></el-tree>
        <div class="org-dialog-btns">
          <el-button type="primary" @click="handleOrgAdd">添 加</el-button>
          <!-- <el-button @click="resetChecked">清空</el-button> -->
          <el-button @click="orgDialogVisible = false">返 回</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import API from '@/api'
import vPagination from '@/components/pagination/pagination'
import vBoard from './board'
const actChannelOptions = [
  {
    key: '1',
    name: '财富'
  },
  {
    key: '2',
    name: '直销'
  },
  {
    key: '3',
    name: '信用卡'
  }
]
const actTargetOptions = [
  {
    key: '1',
    name: '新客获取'
  },
  {
    key: '2',
    name: '老客户营销'
  },
  {
    key: '3',
    name: '流失客户挽留'
  },
  {
    key: '4',
    name: '睡眠客户激活'
  }
]
const actFreOptions = [
  {
    key: 'D',
    name: '每日一次'
  },
  {
    key: 'W',
    name: '每周一次'
  },
  {
    key: 'M',
    name: '每月一次'
  }
]
const weekOptions = [
  {
    label: '周一',
    value: 1
  },
  {
    label: '周二',
    value: 2
  },
  {
    label: '周三',
    value: 3
  },
  {
    label: '周四',
    value: 4
  },
  {
    label: '周五',
    value: 5
  },
  {
    label: '周六',
    value: 6
  },
  {
    label: '周日',
    value: 7
  }
]
const monthOptions = [
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  '23',
  '24',
  '25',
  '26',
  '27',
  '28',
  '29',
  '30',
  '31'
]
const custTypeOptions = [
  {
    key: '0',
    name: '无限制'
  },
  {
    key: '1',
    name: '客户组'
  },
  {
    key: '2',
    name: '机构'
  }
]
export default {
  components: {
    vPagination,
    vBoard
  },
  props: {
    actId: {
      type: String
    },
    type: {
      type: String
    },
    active: {
      type: Number
    },
    actStatus: {
      type: String
    }
  },
  computed: {
    inputDisabled () {
      return this.type === 'detail' || (this.type === 'edit' && this.actStatus === '4')
    }
  },
  data() {
    var validateActBeginTime = (rule, value, callback) => {
      if (new Date(value).getTime() < Date.now() - 8.64e7 &&
       (this.type !== 'edit' || (this.type === 'edit' && this.actStatus !== '4'))) {
        callback(new Error('活动开始时间不能早于当前日期!'))
      } else {
        callback()
      }
    }
    var validateActTime = (rule, value, callback) => {
      if (
        new Date(value).getTime() <
        new Date(this.basicInfoForm.actBegtime).getTime()
      ) {
        callback(new Error('活动结束时间不得早于开始时间!'))
      } else {
        callback()
      }
    }
    var validateDayTime = (rule, value, callback) => {
      var end = value.split(':')[0]
      var begin = this.timeForm.beginTimeD.split(':')[0]
      if (new Date().setHours(end) <= new Date().setHours(begin)) {
        callback(new Error('结束时间必须大于开始时间!'))
      } else {
        callback()
      }
    }
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      actChannelOptions,
      actTargetOptions,
      actFreOptions,
      weekOptions,
      monthOptions,
      custTypeOptions,
      basicInfoForm: {
        boardId: '',
        boardName: '',
        actName: '',
        actChannel: this.$store.state.user.channel,
        custType: '',
        actMaxAmout: '',
        sort: '',
        custGroupId: '',
        custGroupName: '',
        orgNo: '',
        orgName: '',
        actBegtime: '',
        actEndtime: '',
        actTarget: '',
        actRate: '',
        actTime: '',
        note: ''
      },
      timeForm: {
        beginTimeD: '',
        endTimeD: '',
        dateW: '',
        dateM: ''
      },
      currentTimeForm: {
        beginTimeD: '',
        endTimeD: '',
        dateW: '',
        dateM: ''
      },
      groupDialogVisible: false,
      timeDialogVisible: false,
      orgDialogVisible: false,
      boardDialogVisible: false,
      selectGroupName: '',
      selectGroupId: '',
      radio: '',
      searchParams: {
        groupName: '',
        scoreChannel: this.$store.state.user.channel
      },
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10 // 每页显示多少条
      },
      groupTableData: [],
      rules: {
        boardName: [
          {
            required: true,
            message: '请选择权益板块',
            trigger: 'blur'
          }
        ],
        actName: [
          {
            required: true,
            message: '请输入',
            trigger: 'blur'
          },
          {
            min: 0,
            max: 60,
            message: '长度限制60字符内',
            trigger: 'blur'
          }
        ],
        actChannel: [
          {
            required: true,
            message: '请选择',
            trigger: 'change'
          }
        ],
        actBegtime: [
          {
            required: true,
            message: '请选择活动开始时间',
            trigger: 'blur'
          },
          {
            validator: validateActBeginTime,
            trigger: 'blur'
          }
        ],
        actEndtime: [
          {
            required: true,
            message: '请选择活动结束时间',
            trigger: 'blur'
          },
          {
            validator: validateActTime,
            trigger: 'blur'
          }
        ],
        actTarget: [
          {
            required: true,
            message: '请选择',
            trigger: 'change'
          }
        ],
        actRate: [
          {
            required: true,
            message: '请选择',
            trigger: 'change'
          }
        ],
        actTime: [
          {
            required: true,
            message: '请选择具体时间',
            trigger: ['blur', 'change']
          }
        ],
        custType: [
          {
            required: true,
            message: '请选择客户类型',
            trigger: ['change']
          }
        ],
        custGroupName: [
          {
            required: true,
            message: '请选择客户组',
            trigger: ['change']
          }
        ],
        orgName: [
          {
            required: true,
            message: '请选择机构',
            trigger: ['change']
          }
        ],
        sort: [
          {
            required: true,
            message: '请输入活动顺序',
            trigger: 'blur'
          },
          {
            pattern: /^([1-9]\d*)$/,
            message: '请输入正整数',
            trigger: 'blur'
          }
        ],
        actMaxAmout: [
          {
            pattern: /^([1-9]\d*)$/,
            message: '请输入正整数',
            trigger: 'blur'
          }
        ],
        note: [
          {
            min: 0,
            max: 100,
            message: '长度限制100字符内',
            trigger: 'blur'
          }
        ]
      },
      timeRules: {
        dateM: [
          {
            required: true,
            message: '请输入',
            trigger: 'blur'
          }
        ],
        dateW: [
          {
            required: true,
            message: '请输入',
            trigger: 'blur'
          }
        ],
        beginTimeD: [
          {
            required: true,
            message: '请输入',
            trigger: 'blur'
          }
        ],
        endTimeD: [
          {
            required: true,
            message: '请输入',
            trigger: 'blur'
          },
          {
            validator: validateDayTime,
            trigger: 'blur'
          }
        ]
      },
      waitLoading: false,
      orgData: [],
      orgCheckedIds: [], // tree默认展开id数组
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      weekday: ['', '一', '二', '三', '四', '五', '六', '日']
    }
  },
  methods: {
    // 加载权益活动基本信息
    getEquityActBase() {
      this.$emit('handleLoading', true)
      API.activity
        .getEquityActBaseData(this.actId)
        .then(response => {
          var data = response.data.data
          switch (data.actRate) {
            case 'M':
              data.actTime =
                '每月' +
                data.dateM +
                '日' +
                data.beginTimeD +
                '~' +
                data.endTimeD
              this.currentTimeForm = {
                beginTimeD: data.beginTimeD,
                endTimeD: data.endTimeD,
                dateW: '',
                dateM: data.dateM
              }
              break
            case 'W':
              data.actTime =
                '每周' +
                this.weekday[data.dateW] +
                data.beginTimeD +
                '~' +
                data.endTimeD
              this.currentTimeForm = {
                beginTimeD: data.beginTimeD,
                endTimeD: data.endTimeD,
                dateW: data.dateW,
                dateM: ''
              }
              break
            case 'D':
              data.actTime = '每日' + data.beginTimeD + '~' + data.endTimeD
              this.currentTimeForm = {
                beginTimeD: data.beginTimeD,
                endTimeD: data.endTimeD,
                dateW: '',
                dateM: ''
              }
              break
          }
          if (data.custType === '2') {
            this.orgCheckedIds = data.orgNo ? data.orgNo.split(',') : ''
          }
          this.basicInfoForm = {
            boardId: data.boardId,
            boardName: data.boardName,
            actName: data.actName,
            actChannel: data.actChannel,
            custType: data.custType,
            actMaxAmout: data.actMaxAmout,
            sort: data.sort,
            custGroupId: data.custGroupId,
            custGroupName: data.custGroupName,
            orgNo: data.orgNo,
            orgName: data.orgName ? data.orgName.split(',').join(';') : '',
            actBegtime: data.actBegtime,
            actEndtime: data.actEndtime,
            actTarget: data.actTarget,
            actRate: data.actRate,
            actTime: data.actTime,
            note: data.note
          }
          this.$emit('handleLoading', false)
        })
        .catch(() => {
          this.$emit('handleLoading', false)
        })
    },
    // 请求客户组数据
    getCustGroupTableList(page) {
      API.custgroup
        .getCustGroupPage(
          Object.assign(
            {
              page: page.currentPage,
              limit: page.pageSize
            },
            this.searchParams
          )
        )
        .then(response => {
          this.groupTableData = response.data.data.list
          this.page.total = response.data.data.totalCount
        })
        .catch(() => { })
    },
    // 请求机构树数据
    getOrgTree() {
      this.waitLoading = true
      API.activity
        .getOrgTreeData()
        .then(res => {
          this.waitLoading = false
          if (res.data.data && res.data.data.length > 0) {
            res.data.data[0].disabled = true
            if (
              res.data.data[0].children &&
              res.data.data[0].children.length > 0
            ) {
              if (this.orgCheckedIds.length > 0) {
                var checkedIndex = 0
                res.data.data[0].children.forEach(item => {
                  if (item.id === this.orgCheckedIds[0]) {
                    checkedIndex = 1
                  }
                })
                if (checkedIndex === 1) {
                  res.data.data[0].children.forEach(item => {
                    item.disabled = false
                    if (item.children && item.children.length > 0) {
                      item.children.forEach(ele => {
                        ele.disabled = true
                      })
                    }
                  })
                } else {
                  res.data.data[0].children.forEach(item => {
                    item.disabled = true
                    if (item.children && item.children.length > 0) {
                      item.children.forEach(ele => {
                        ele.disabled = false
                      })
                    }
                  })
                }
              } else {
                res.data.data[0].children.forEach(item => {
                  item.disabled = false
                  if (item.children && item.children.length > 0) {
                    item.children.forEach(ele => {
                      ele.disabled = false
                    })
                  }
                })
              }
            }
            this.orgData = res.data.data
          }
        })
        .catch(() => {
          this.waitLoading = false
        })
    },
    // 权益板块选择
    selected(val) {
      this.boardDialogVisible = false
      if (val.selectRow && val.selectRow.boardId) {
        this.basicInfoForm.boardId = val.selectRow.boardId
        this.basicInfoForm.boardName = val.selectRow.boardName
      }
    },
    // 机构树选择
    check(data, node) {
      if (data.children) {
        this.orgData[0].children.forEach(ele => {
          ele.children.forEach(item => {
            item.disabled = true
          })
        })
      } else {
        this.orgData[0].children.forEach(ele => {
          ele.disabled = true
        })
      }
      if (node.checkedKeys.length === 0) {
        this.orgData[0].children.forEach(ele => {
          ele.disabled = false
          ele.children.forEach(item => {
            item.disabled = false
          })
        })
      }
    },
    handleNextStep() {
      this.basicInfoForm = this.paramTrim(this.basicInfoForm)
      this.$refs['basicInfoForm'].validate(valid => {
        if (valid) {
          if (this.basicInfoForm.actRate === 'M') {
            this.currentTimeForm.dateW = ''
          } else if (this.basicInfoForm.actRate === 'W') {
            this.currentTimeForm.dateM = ''
          } else {
            this.currentTimeForm.dateM = ''
            this.currentTimeForm.dateW = ''
          }
          if (this.basicInfoForm.custType === '1') {
            this.basicInfoForm.orgNo = ''
            this.basicInfoForm.orgName = ''
            this.orgCheckedIds = []
          } else if (this.basicInfoForm.custType === '2') {
            this.basicInfoForm.custGroupId = ''
            this.basicInfoForm.custGroupName = ''
          } else {
            this.basicInfoForm.orgNo = ''
            this.basicInfoForm.orgName = ''
            this.orgCheckedIds = []
            this.basicInfoForm.custGroupId = ''
            this.basicInfoForm.custGroupName = ''
          }
          this.$emit(
            'handleNext',
            Object.assign(this.basicInfoForm, this.currentTimeForm)
          )
        } else {
          return false
        }
      })
    },
    handleSearchIcon(type) {
      if (type === 'board') {
        this.boardDialogVisible = true
      } else if (type === 'group') {
        this.groupDialogVisible = true
      } else if (type === 'time') {
        if (this.basicInfoForm.actRate) {
          this.timeDialogVisible = true
        } else {
          this.$message({
            message: '请先选择活动频率!',
            type: 'warning'
          })
        }
      } else {
        this.orgDialogVisible = true
      }
    },
    // 查询
    onSearchBtn() {
      this.selectGroupName = ''
      this.selectGroupId = ''
      this.radio = ''
      this.page.currentPage = 1
      this.getCustGroupTableList(this.page)
    },
    // 查询重置
    onResetBtn() {
      this.selectGroupName = ''
      this.selectGroupId = ''
      this.radio = ''
      this.searchParams = {
        groupName: '',
        scoreChannel: this.$store.state.user.channel
      }
      this.page.currentPage = 1
      this.getCustGroupTableList(this.page)
    },
    // 分页
    pageChange(page) {
      this.selectGroupName = ''
      this.selectGroupId = ''
      this.radio = ''
      this.page.currentPage = page.page
      this.page.pageSize = page.limit
      this.getCustGroupTableList(this.page)
    },
    // 表格单选
    onTableSelect(row) {
      this.selectGroupName = row.groupName
      this.selectGroupId = row.groupNo
    },
    handleActRateChange() {
      this.basicInfoForm.actTime = ''
    },
    handleCustGroupAdd() {
      if (!this.selectGroupName) {
        this.$message({
          message: '请选择客户组!',
          type: 'warning'
        })
      } else {
        this.basicInfoForm.custGroupName = this.selectGroupName
        this.basicInfoForm.custGroupId = this.selectGroupId
        this.groupDialogVisible = false
      }
    },
    handleTimeAdd() {
      this.$refs['timeForm'].validate(valid => {
        if (valid) {
          this.currentTimeForm = {
            beginTimeD: this.timeForm.beginTimeD,
            endTimeD: this.timeForm.endTimeD,
            dateW: this.timeForm.dateW,
            dateM: this.timeForm.dateM
          }
          if (this.basicInfoForm.actRate === 'M') {
            this.basicInfoForm.actTime =
              '每月' +
              this.currentTimeForm.dateM +
              '日' +
              this.currentTimeForm.beginTimeD +
              '~' +
              this.currentTimeForm.endTimeD
          } else if (this.basicInfoForm.actRate === 'W') {
            this.basicInfoForm.actTime =
              '每周' +
              this.currentTimeForm.dateW +
              '日' +
              this.currentTimeForm.beginTimeD +
              '~' +
              this.currentTimeForm.endTimeD
          } else {
            this.basicInfoForm.actTime =
              '每日' +
              this.currentTimeForm.beginTimeD +
              '~' +
              this.currentTimeForm.endTimeD
          }
          this.timeDialogVisible = false
        } else {
          return false
        }
      })
    },
    handleOrgAdd() {
      var checkedIds = this.$refs.tree.getCheckedKeys()
      var checkedNodes = this.$refs.tree.getCheckedNodes()
      if (checkedIds.length === 0) {
        this.$message({
          message: '请选择机构!',
          type: 'warning'
        })
      } else {
        var checkedNames = []
        checkedNodes.forEach(item => {
          checkedNames.push(item.label)
        })
        this.orgCheckedIds = checkedIds
        this.basicInfoForm.orgName = checkedNames.join(';')
        this.basicInfoForm.orgNo = checkedIds.toString()
        this.orgDialogVisible = false
      }
    }
    // resetChecked() {
    //   this.$refs.tree.setCheckedKeys([])
    //   this.orgData[0].children.forEach(ele => {
    //     ele.disabled = false
    //     ele.children.forEach(item => {
    //       item.disabled = false
    //     })
    //   })
    // }
  },
  created() {
    if (
      this.type === 'edit' ||
      this.type === 'detail' ||
      this.type === 'copy'
    ) {
      this.getEquityActBase()
    }
  },
  watch: {
    type(value) {
      if (!value) {
        this.$nextTick(() => {
          this.$refs['basicInfoForm'].resetFields()
          this.basicInfoForm = {
            boardId: '',
            boardName: '',
            actName: '',
            actChannel: this.$store.state.user.channel,
            custType: '',
            actMaxAmout: '',
            sort: '',
            custGroupId: '',
            custGroupName: '',
            orgNo: '',
            orgName: '',
            actBegtime: '',
            actEndtime: '',
            actTarget: '',
            actRate: '',
            actTime: '',
            note: ''
          }
          this.currentTimeForm = {
            beginTimeD: '',
            endTimeD: '',
            dateW: '',
            dateM: ''
          }
        })
        this.orgCheckedIds = []
      } else if (
        value === 'edit' ||
        value === 'detail' ||
        this.type === 'copy'
      ) {
        this.getEquityActBase()
      }
    },
    groupDialogVisible(value) {
      if (value) {
        this.getCustGroupTableList(this.page)
      } else {
        this.radio = ''
        this.selectGroupId = ''
        this.selectGroupName = ''
        this.searchParams = {
          groupName: '',
          scoreChannel: this.$store.state.user.channel
        }
        this.groupTableData = []
        this.page = {
          total: 0,
          currentPage: 1,
          pageSize: 10
        }
      }
    },
    orgDialogVisible(value) {
      if (value) {
        this.getOrgTree()
      } else {
        this.orgData = []
      }
    },
    timeDialogVisible(value) {
      if (value) {
        this.$nextTick(() => {
          this.$refs['timeForm'].resetFields()
          this.timeForm = {
            beginTimeD: '',
            endTimeD: '',
            dateW: '',
            dateM: ''
          }
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.info-form {
  .info-form-row {
    display: flex;

    .el-form-item:first-child {
      margin-right: 60px;
    }

    .el-icon-khz {
      width: 16px;
      height: 19px;
      background: url(../imgs/khz.png) center no-repeat;
      background-size: cover;
      position: relative;
      top: 3px;
      cursor: pointer;
    }
  }
}

.group-dialog {
  .group-dialog-search {
    .search-input {
      display: flex;
      justify-content: center;
      align-items: center;

      .search-input-label {
        width: 70px;
        margin-right: 16px;
      }

      .el-input {
        width: 248px;

        /deep/ .el-input__inner {
          height: 34px;
        }
      }
    }

    .search-btns {
      margin: 30px 0;
      display: flex;
      justify-content: center;
    }
  }

  .group-dialog-btns {
    display: flex;
    justify-content: center;
  }

  .el-button {
    height: 35px;
    display: flex;
    align-items: center;
    padding: 0 20px;

    /deep/ .el-icon-query {
      width: 18px;
      height: 18px;
      background: url(../imgs/search.png) center no-repeat;
      background-size: cover;
    }

    /deep/ .el-icon-reset {
      width: 15px;
      height: 19px;
      background: url(../imgs/reset.png) center no-repeat;
      background-size: cover;
    }
  }

  .group-dialog-table {
    /deep/ tr {
      height: 35px;

      /deep/ th,
      td {
        padding: 0;
      }

      /deep/ .el-radio__label {
        display: none;
      }
    }
  }
}

.time-dialog {
  .time-row-day {
    display: flex;

    .time-row-day-line {
      margin: 0 12px;
    }
  }

  /deep/ .el-input__inner {
    width: 220px;
  }

  .time-dialog-btns {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
}

.org-dialog {
  .org-dialog-btns {
    margin-top: 20px;
  }
}

.notice-dialog {
  /deep/ .el-dialog__header {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    background-color: #80a639;

    .el-dialog__title,
    .el-dialog__close {
      color: #ffffff;
    }
  }

  /deep/ .el-dialog__body {
    font-size: 20px;
    color: #000000;
  }
}

.add-icon-style {
  position: absolute;
  bottom: 6px;
  right: -16px;
  cursor: pointer;
}
</style>
