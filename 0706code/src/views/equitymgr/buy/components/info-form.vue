<template>
  <div class="info-form">
    <el-form :model="basicInfoForm" ref="basicInfoForm" :rules="rules" label-width="160px" class="demo-dynamic" size="mini"
      label-position="left">
      <div class="info-form-row">
        <el-form-item label="活动名称:" prop="actName">
          <el-input :disabled="type === 'detail'"  maxlength="60" placeholder="请输入活动名称" v-model="basicInfoForm.actName"></el-input>
        </el-form-item>
        <el-form-item label="活动渠道:" prop="actChannel">
          <el-select disabled v-model="basicInfoForm.actChannel" placeholder="请选择">
            <el-option v-for="(item,index) in $root.selectOption.channel" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="info-form-row">
        <el-form-item label="活动开始时间:" prop="actBegtime" :key="basicInfoForm.actBegtime">
          <el-date-picker :disabled="type === 'detail'" v-model="basicInfoForm.actBegtime" type="date" value-format="yyyy/MM/dd" format="yyyy/MM/dd"
            placeholder="请选择活动开始时间" :picker-options="pickerOptions" :editable="false">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="活动结束时间:" prop="actEndtime" :key="basicInfoForm.actEndtime">
          <el-date-picker :disabled="type === 'detail'" v-model="basicInfoForm.actEndtime" type="date" value-format="yyyy/MM/dd" format="yyyy/MM/dd"
            placeholder="请选择活动结束时间" :picker-options="pickerOptions" :editable="false">
          </el-date-picker>
        </el-form-item>
      </div>
      <div class="info-form-row">
        <el-form-item label="抢购开始时间点:" prop="timeBuyBg" :key="basicInfoForm.timeBuyBg">
          <el-time-select :disabled="type === 'detail'" v-model="basicInfoForm.timeBuyBg" :picker-options="{start: '00:00',step: '01:00',end: '24:00'}"
            placeholder="选择时间点" :editable="false">
          </el-time-select>
        </el-form-item>
        <el-form-item label="抢购结束时间点:" prop="timeBuyEnd" :key="basicInfoForm.timeBuyEnd">
          <el-time-select :disabled="type === 'detail'" v-model="basicInfoForm.timeBuyEnd" :picker-options="{start: '00:00',step: '01:00',end: '24:00'}"
            placeholder="选择时间点" :editable="false">
          </el-time-select>
        </el-form-item>
      </div>
      <div class="info-form-row">
        <el-form-item label="抢购一次资格所需积分:" prop="buyScore">
          <el-input :disabled="type === 'detail'" placeholder="请输入"  maxlength="8" v-model="basicInfoForm.buyScore"></el-input>
        </el-form-item>
        <el-form-item label="参与活动对象:" prop="custType">
          <el-select :disabled="type === 'detail'" v-model="basicInfoForm.custType" placeholder="请选择">
            <el-option v-for="item in custTypeOptions" :key="item.key" :label="item.name" :value="item.key" />
          </el-select>
        </el-form-item>
      </div>
      <div class="info-form-row">
        <el-form-item v-if="basicInfoForm.custType === '1'" label="客户组:" prop="custGroupName">
          <el-input :disabled="true" placeholder="请查询" v-model="basicInfoForm.custGroupName">
            <i v-if="type !== 'detail'" slot="suffix" class="el-input__icon el-icon-khz" @click="handleSearchIcon('group')"></i>
          </el-input>
        </el-form-item>
        <el-form-item v-if="basicInfoForm.custType === '2'" label="机构:" prop="orgName">
          <el-input :disabled="true" placeholder="请查询" v-model="basicInfoForm.orgName">
            <i v-if="type !== 'detail'" slot="suffix" class="el-input__icon el-icon-khz" @click="handleSearchIcon('org')"></i>
          </el-input>
        </el-form-item>
      </div>
      <el-form-item label="备注:" prop="actNotes">
        <el-input :disabled="type === 'detail'" type="textarea"  maxlength="100" :rows="3" placeholder="请输入" v-model="basicInfoForm.actNotes"></el-input>
      </el-form-item>
    </el-form>
    <el-dialog class="group-dialog" title="查询" :visible.sync="groupDialogVisible" width="850px" append-to-body>
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
        <el-table class="group-dialog-table" :data="tableData" style="width: 100%" border :header-cell-style="{background:'#80A639',color:'#ffffff'}">
          <el-table-column label="选择" fixed width="60" align="center">
            <template slot-scope="scope">
              <el-radio v-model="radio" :label="scope.$index" @change="onTableSelect(scope.row)">&nbsp;</el-radio>
            </template>
          </el-table-column>
          <el-table-column prop="groupName" label="客户组名称" width="180" align="center">
          </el-table-column>
          <el-table-column prop="createDate" label="创建时间" width="160" align="center">
          </el-table-column>
          <el-table-column prop="createEmpNo" label="创建人工号" width="100" align="center">
          </el-table-column>
          <el-table-column prop="createEmpName" label="创建人" align="center">
          </el-table-column>
        </el-table>
        <v-pagination :total="page.total" :currentPageNum='page.currentPage' :currentPageSize='page.pageSize'
          @pageChange="pageChange"></v-pagination>
        <div class="group-dialog-btns">
          <el-button type="primary" @click="handleCustGroup">添 加</el-button>
          <el-button @click="groupDialogVisible = false">返 回</el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog class="org-dialog" title="机构选择"
      :visible.sync="orgDialogVisible" width="600px" append-to-body>
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
        >
        </el-tree>
        <div class="org-dialog-btns">
          <el-button type="primary" @click="handleOrgAdd">添 加</el-button>
          <el-button @click="orgDialogVisible = false">返 回</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import API from '@/api'
  import vPagination from '@/components/pagination/pagination'
  const actChannelOptions = [{
    key: '1',
    name: '财富'
  }, {
    key: '2',
    name: '直销'
  }, {
    key: '3',
    name: '信用卡'
  }]
  const custTypeOptions = [{
    key: '0',
    name: '无限制'
  }, {
    key: '1',
    name: '客户组'
  }, {
    key: '2',
    name: '机构'
  }]
  export default {
    components: {
      vPagination
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
      }
    },
    data() {
      var validateActBeginTime = (rule, value, callback) => {
        if (new Date(value).getTime() < Date.now() - 8.64e7) {
          callback(new Error('活动开始时间不能早于当前日期!'))
        } else {
          callback()
        }
      }
      var validateActTime = (rule, value, callback) => {
        if (new Date(value).getTime() < new Date(this.basicInfoForm.actBegtime).getTime()) {
          callback(new Error('活动结束时间不得早于开始时间!'))
        } else {
          callback()
        }
      }
      var validateDayTime = (rule, value, callback) => {
        var end = value.split(':')[0]
        var begin = this.basicInfoForm.timeBuyBg.split(':')[0]
        // if ((new Date(this.basicInfoForm.actBegtime).getTime() === new Date(this.basicInfoForm.actEndtime).getTime()) && (new Date().setHours(end) <= new Date().setHours(begin))) {
        if ((new Date().setHours(end) <= new Date().setHours(begin))) {
          callback(new Error('抢购结束时间点必须大于抢购开始时间点!'))
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
        custTypeOptions,
        basicInfoForm: {
          actName: '',
          actChannel: this.$store.state.user.channel,
          custType: '',
          custGroupId: '',
          custGroupName: '',
          orgNo: '',
          orgName: '',
          buyScore: '',
          actBegtime: '',
          actEndtime: '',
          timeBuyBg: '',
          timeBuyEnd: '',
          actNotes: ''
        },
        groupDialogVisible: false,
        orgDialogVisible: false,
        radio: '',
        selectId: '',
        selectName: '',
        searchParams: {
          groupName: '',
          scoreChannel: this.$store.state.user.channel
        },
        tableData: [],
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 10 // 每页显示多少条
        },
        rules: {
          actName: [{
            required: true,
            message: '请输入',
            trigger: 'blur'
          }, {
            min: 0,
            max: 60,
            message: '长度限制60字符内',
            trigger: 'blur'
          }],
          actChannel: [{
            required: true,
            message: '请选择',
            trigger: 'change'
          }],
          buyScore: [{
            required: true,
            message: '请输入',
            trigger: 'blur'
          }, {
            pattern: /^[1-9]\d*$/,
            message: '请输入正整数',
            trigger: 'blur'
          }, {
            min: 0,
            max: 8,
            message: '长度限制8字符内',
            trigger: 'blur'
          }],
          actBegtime: [{
            required: true,
            message: '请选择活动开始时间',
            trigger: 'blur'
          }, {
            validator: validateActBeginTime,
            trigger: 'blur'
          }],
          actEndtime: [{
            required: true,
            message: '请选择活动结束时间',
            trigger: 'blur'
          }, {
            validator: validateActTime,
            trigger: 'blur'
          }],
          timeBuyBg: [{
            required: true,
            message: '请选择抢购开始时间点',
            trigger: 'blur'
          }],
          timeBuyEnd: [{
            required: true,
            message: '请选择抢购结束时间点',
            trigger: 'blur'
          }, {
            validator: validateDayTime,
            trigger: 'blur'
          }],
          custType: [{
            required: true,
            message: '请选择客户类型',
            trigger: ['change']
          }],
          custGroupName: [{
            required: true,
            message: '请选择客户组',
            trigger: ['change']
          }],
          orgName: [{
            required: true,
            message: '请选择机构',
            trigger: ['change']
          }],
          actNotes: [{
            min: 0,
            max: 100,
            message: '长度限制100字符内',
            trigger: 'blur'
          }]
        },
        waitLoading: false,
        orgData: [],
        orgCheckedIds: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },
    methods: {
      // 加载抢购活动基本信息
      getBuyActBase() {
        this.$emit('handleLoading', true)
        API.buy.getBuyActBaseData({
          actId: this.actId
        }).then(response => {
          var data = response.data.data
          if (data.custType === '2') {
            this.orgCheckedIds = data.orgNo ? data.orgNo.split(',') : ''
          }
          this.basicInfoForm = {
            actName: data.actName,
            actChannel: data.actChannel,
            custType: data.custType,
            custGroupId: data.custGroupId,
            custGroupName: data.custGroupName,
            orgNo: data.orgNo,
            orgName: data.orgName ? data.orgName.split(',').join(';') : '',
            actBegtime: data.actBegtime,
            actEndtime: data.actEndtime,
            buyScore: String(data.buyScore),
            timeBuyBg: data.timeBuyBg,
            timeBuyEnd: data.timeBuyEnd,
            actNotes: data.actNotes
          }
          this.$emit('handleLoading', false)
        }).catch(() => {
          this.$emit('handleLoading', false)
        })
      },
      // 请求客户组数据
      getCustGroupTableList(page) {
        API.custgroup.getCustGroupPage(Object.assign({
          page: page.currentPage,
          limit: page.pageSize
        }, this.searchParams)).then(response => {
          this.tableData = response.data.data.list
          this.page.total = response.data.data.totalCount
        }).catch(() => {
          console.log('error')
        })
      },
      // 请求机构树数据
      getOrgTree() {
        this.waitLoading = true
        API.activity.getOrgTreeData().then(res => {
          this.waitLoading = false
          if (res.data.data && res.data.data.length > 0) {
            res.data.data[0].disabled = true
            if (res.data.data[0].children && res.data.data[0].children.length > 0) {
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
        }).catch(() => {
          this.waitLoading = false
        })
      },
      // 机构树选择
      check(data, node) {
        // console.log('data', data)
        // console.log('node', node)
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
        this.$refs['basicInfoForm'].validate((valid) => {
          if (valid) {
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
            this.$emit('handleNext', {actType: 1, ...this.basicInfoForm})
          } else {
            return false
          }
        })
      },
      handleSearchIcon(type) {
        if (type === 'group') {
          this.groupDialogVisible = true
        } else {
          this.orgDialogVisible = true
        }
      },
      // 查询
      onSearchBtn() {
        this.selectId = ''
        this.selectName = ''
        this.radio = ''
        this.page.currentPage = 1
        this.getCustGroupTableList(this.page)
      },
      // 查询重置
      onResetBtn() {
        this.selectId = ''
        this.selectName = ''
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
        this.selectId = ''
        this.selectName = ''
        this.radio = ''
        this.page.currentPage = page.page
        this.page.pageSize = page.limit
        this.getCustGroupTableList(this.page)
      },
      // 表格单选
      onTableSelect (row) {
        this.selectId = row.groupNo
        this.selectName = row.groupName
      },
      handleCustGroup() {
        if (!this.selectName) {
          this.$message({
            message: '请选择!',
            type: 'warning'
          })
        } else {
          this.basicInfoForm.custGroupId = this.selectId
          this.basicInfoForm.custGroupName = this.selectName
          this.groupDialogVisible = false
        }
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
    },
    created() {
      if (this.type !== 'add') {
        this.getBuyActBase()
      }
    },
    watch: {
      type(value) {
        if (value === '') {
          this.$nextTick(() => {
            this.$refs['basicInfoForm'].resetFields()
            this.basicInfoForm = {
              actName: '',
              actChannel: this.$store.state.user.channel,
              custType: '',
              custGroupId: '',
              custGroupName: '',
              orgNo: '',
              orgName: '',
              buyScore: '',
              actBegtime: '',
              actEndtime: '',
              timeBuyBg: '',
              timeBuyEnd: '',
              actNotes: ''
            }
          })
          this.orgCheckedIds = []
        }
        if (value && value !== 'add') {
          this.getBuyActBase()
        }
      },
      groupDialogVisible(value) {
        if (value) {
          this.page = {
            total: 0,
            currentPage: 1,
            pageSize: 10
          }
          this.tableData = []
          this.onResetBtn()
        }
      },
      orgDialogVisible(value) {
        if (value) {
          this.getOrgTree()
        } else {
          this.orgData = []
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
        }

        /deep/ .el-input__inner {
          height: 34px;
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
      }

      /deep/ .el-radio__label {
        display: none;
      }
    }
  }

  .org-dialog {
    .org-dialog-btns {
      margin-top: 20px;
    }
  }
</style>
