<template>
  <div class="info-form">
    <el-form :model="basicInfoForm" ref="basicInfoForm" :rules="rules" label-width="170px" class="demo-dynamic" size="mini"
      label-position="right">
        <el-form-item label="票选活动名称:" prop="actName">
          <el-input :disabled="type === 'detail'"  maxlength="60" placeholder="请输入活动名称" v-model="basicInfoForm.actName"></el-input>
        </el-form-item>
        <el-form-item label="活动渠道:" prop="actChannel">
          <el-select disabled v-model="basicInfoForm.actChannel" placeholder="请选择">
            <el-option v-for="(item,index) in $root.selectOption.channel" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动开始日期:" prop="actBegtime" :key="basicInfoForm.actBegtime">
          <el-date-picker :disabled="type === 'detail'" v-model="basicInfoForm.actBegtime" type="date" value-format="yyyy/MM/dd" format="yyyy/MM/dd"
            placeholder="请选择活动开始日期" :picker-options="pickerOptions" :editable="false">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="活动结束日期:" prop="actEndtime" :key="basicInfoForm.actEndtime">
          <el-date-picker :disabled="type === 'detail'" v-model="basicInfoForm.actEndtime" type="date" value-format="yyyy/MM/dd" format="yyyy/MM/dd"
            placeholder="请选择活动结束日期" :picker-options="pickerOptions" :editable="false">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="活动细则:">
          <el-input :disabled="type === 'detail'"  type="textarea"  maxlength="500" :rows="8"  placeholder="请输入活动细则" v-model="basicInfoForm.actNotes"></el-input>
        </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import API from '@/api'
  import vPagination from '@/components/pagination/pagination'
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
        if (new Date(value).getTime() < new Date(new Date().toLocaleDateString()).getTime()) {
          callback(new Error('活动开始日期不能早于当前日期!'))
        } else {
          callback()
        }
      }
      var validateActTime = (rule, value, callback) => {
        if (new Date(value).getTime() <= new Date(this.basicInfoForm.actBegtime).getTime()) {
          callback(new Error('结束日期必须大于开始日期!'))
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
        basicInfoForm: {
          actName: '',
          actChannel: this.$store.state.user.channel,
          actBegtime: '',
          actEndtime: '',
          actNotes: ''
        },
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 10 // 每页显示多少条
        },
        groupTableData: [],
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
          actBegtime: [{
            required: true,
            message: '请选择活动开始日期',
            trigger: 'blur'
          }, {
            validator: validateActBeginTime,
            trigger: 'blur'
          }],
          actEndtime: [{
            required: true,
            message: '请选择活动结束日期',
            trigger: 'blur'
          }, {
            validator: validateActTime,
            trigger: 'blur'
          }]
        },
        waitLoading: false
      }
    },
    methods: {
      typeChange() {
        this.$emit('typeChange', true)
      },
      // 加载抽奖活动基本信息
      getLotteryActBase() {
        this.$emit('handleLoading', true)
        API.voteact.queryVoteAct({
          actId: this.actId
        }).then(response => {
          var data = response.data.data
          this.basicInfoForm = {
            actName: data.actName,
            actChannel: data.actChannel,
            actBegtime: data.actBegtime,
            actEndtime: data.actEndtime,
            actNotes: data.actNotes
          }
          this.$emit('handleLoading', false)
        }).catch(() => {
          this.$emit('handleLoading', false)
        })
      },
      handleNextStep() {
        this.$refs['basicInfoForm'].validate((valid) => {
          if (valid) {
            this.$emit('handleNext', this.basicInfoForm)
          } else {
            return false
          }
        })
      }
    },
    created() {
      if (this.type === 'edit' || this.type === 'detail' || this.type === 'copy') {
        this.getLotteryActBase()
      }
    },
    watch: {
      type(value) {
        if (!value) {
          this.$nextTick(() => {
            this.$refs['basicInfoForm'].resetFields()
            this.basicInfoForm = {
              actName: '',
              actChannel: this.$store.state.user.channel,
              actBegtime: '',
              actEndtime: '',
              actNotes: ''
            }
          })
        } else if (value === 'edit' || value === 'detail' || this.type === 'copy') {
          this.getLotteryActBase()
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

    /deep/ .el-form-item__label {
      padding-right: 10px;
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
