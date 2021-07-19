<template>
  <div class="cust-group">
    <el-dialog
      :title="type === 'detail' ? '订单取消审批详情' : '订单取消审批'" 
      :visible.sync="dialogGroupVisible"
      width="900px"
      :before-close="cancel"
    >
      <div style="width: 100%" v-loading="vloading">
        <div class="info">
          <el-table
            :data="datas.records"
            border
            height="400px"
            style="width: 100%"
            :header-cell-style="{
              background: '#80A639',
              'font-weight': '400',
              color: '#FFFFFF'
            }"
          >
            <el-table-column
              label="订单号"
              prop="id"
              header-align="center"
              align="center"
            >
            </el-table-column>
            <el-table-column
              label="交易时间"
              prop="transTime"
              header-align="center"
              align="center"
            >
            </el-table-column>
            <el-table-column
              label="活动渠道"
              header-align="center"
              align="center"
            >
              <template slot-scope="scope">
                {{ $root.selectOption.channelObj[scope.row.scoreChannel] }}
              </template>
            </el-table-column>
            <el-table-column
              prop="productName"
              label="商品名称"
              header-align="center"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="prizeCount"
              label="兑换数量"
              header-align="center"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="merName"
              label="供应商名称"
              header-align="center"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="custMobile"
              label="联系电话"
              header-align="center"
              align="center"
            >
            </el-table-column>
          </el-table>
          <v-pagination
            :total="page.total"
            :currentPageNum="page.current"
            :currentPageSize="page.size"
            @pageChange="pageChange"
          ></v-pagination>
          <div class="applyInfo">
            <div class="info">
              <div>
                <span>申请人工号：</span>
                <div>{{ info.applyEmpNo }}</div>
              </div>
              <div>
                <span>申请类型：</span>
                <div>{{ applyType[info.applyType] }}</div>
              </div>
              <div>
                <span>申请人：</span>
                <div>{{ info.applyPerson }}</div>
              </div>
              <div>
                <span>申请时间：</span>
                <div>{{ info.createDate }}</div>
              </div>
            </div>
            <!-- <div style="display: flex">
              <span style="width: 22%; display: block;float: left">申请原因：</span>
              <el-input
                v-model="datas.reason"
                type="textarea"
                :rows="5"
                disabled
              ></el-input>
            </div> -->
          </div>
        </div>

        <div class="operate" v-if="type !== 'detail'">
          <div style="margin-right: 20px">审批操作</div>
          <div>
            <span style="margin-right: 20px">审批状态</span>
            <div style="width: 30%">
              <el-radio-group v-model="infoForm.approveStatus" @change="changeStatus" :disabled="type==='info'">
                <el-radio label="3">同意</el-radio>
                <el-radio label="4">不同意</el-radio> 
              </el-radio-group>
            </div>
            <div style="display: flex; width: 60%">
              <el-form
                :model="infoForm"
                :rules="infoForm.approveStatus === '4' ? rules: {}"
                ref="infoForm"
                label-width="100px"
                style="width: 100%"
                :disabled="type==='info'"
              >
                <el-form-item label="审批意见：" prop="approveNotes">
                  <el-input
                    v-model="infoForm.approveNotes"
                    type="textarea"
                    :rows="3"
                    maxlength="100"
                  ></el-input>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
        <div class="approveInfo" style="margin-bottom: 20px" v-if="type === 'info'">
          <div>
            审批人工号：<span style="padding-left: 10px">{{info.approveEmpNo}}</span>
          </div>
          <div>
            审批人：<span style="padding-left: 10px">{{info.approvePerson}}</span>
          </div>
          <div>
            审批时间：<span style="padding-left: 10px">{{info.approveTime && info.approveTime.substring(0,11)}}</span>
          </div>
        </div>
        <div
          slot="footer"
          class="dialog-footer"
          style="text-align: center; margin-top: 0px"
          v-if="type === 'edit'"
        >
          <el-button type="primary" @click="save">提交</el-button>
          <el-button @click="cancel">取消</el-button>
        </div>
      </div>
      <el-dialog
        class="notice-dialog cus-confirm"
        title="提示"
        :visible.sync="noticeDialogVisible"
        width="300px"
        append-to-body
      >
        <span>是否确认提交？</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleConfirm" :loading="loading"
            >确 认</el-button
          >
          <el-button @click="noticeDialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import API from '@/api'
import vPagination from '@/components/pagination/pagination'
export default {
  components: { vPagination },
  props: {
    dialogGroupVisible: {
      type: Boolean
    },
    info: {
      type: Object
    },
    type: {
      type: String
    }
  },
  watch: {
    dialogGroupVisible(value) {
      if (value) {
        // 初始化数据
        this.infoForm = {
          approveStatus: this.type === 'edit' ? '3' : this.info.approveStatus,
          approveNotes: this.type === 'edit' ? '' : this.info.approveNotes
        }

        // 获取详情
        this.getInfo()

        // 移除所有表单项的校验
        this.$nextTick(() => {
          if (this.$refs['infoForm']) {
            this.$refs['infoForm'].clearValidate()
          }
        })
      }
    }
  },
  computed: {
    setTypes() {
      if (this.datas.frzType) {
        let types = []
        this.datas.frzType.split(',').map((type) => {
          types.push(this.types[type])
        })
        return types.join(' ')
      }
    }
  },
  data() {
    return {
      datas: {
        records: []
      },
      page: {
        total: 0,
        current: 1,
        size: 10
      },
      infoForm: {
        approveStatus: '3',
        approveNotes: ''
      },
      applyType: [
        '',
        '积分冻结',
        '积分解冻',
        '积分调增',
        '积分调减',
        '移入黑名单',
        '移出黑名单',
        '新增',
        '修改',
        '删除'
      ],
      types: [
        '',
        '金融资产',
        '新客奖励',
        '基金定投',
        '绑定快捷支付',
        '代发工资',
        '代收业务'
      ],
      noticeDialogVisible: false,
      loading: false,
      vloading: false,
      rules: {
        approveNotes: [
          { required: true, message: '请填写审批意见', trigger: 'blur' }
        ]
      },
      custLevel: ['零', '一', '二', '三', '四', '五', '六']
    }
  },
  methods: {
    changeStatus() {
      if (this.$refs['infoForm']) {
        this.$refs['infoForm'].clearValidate()
      }
    },
    getInfo() {
      this.vloading = true
      API.report
        .getOrderCancelList({
          batchNo: this.info.applyObjId,
          ...this.page
        })
        .then(res => {
          this.vloading = false
          this.page.total = res.data.data.total
          this.datas = res.data.data
        })
        .catch(() => {
          this.vloading = false
          this.searchLoading = false
          this.resetLoading = false
        })
    },
    // 分页
    pageChange (val) {
      this.page.page = val.page
      this.page.limit = val.limit
      this.getInfo()
    },
    save() {
      this.$refs['infoForm'].validate(valid => {
        if (!valid) {
          return false
        }
        this.noticeDialogVisible = true
      })
    },
    handleConfirm() {
      this.loading = true
      API.home
        .approveOperation(
          Object.assign(this.infoForm, {
            id: this.info.id,
            approveEmpNo: this.$store.state.user.id,
            approvePerson: this.$store.state.user.name
          })
        )
        .then(res => {
          this.loading = false
          this.$message.success('操作成功！')
          this.noticeDialogVisible = false
          this.cancel()
        })
        .catch((error) => {
          this.loading = false
          this.noticeDialogVisible = false
          this.$message.error(error.msg)
        })
    },
    cancel() {
      this.$emit('cancel', { idx: 16 })
    }
  }
}
</script>

<style lang="scss" scoped>
.cust-group {
  /deep/ .el-pagination {
    padding: 0;
  }
  /deep/ .el-table__header-wrapper {
    height: 36px;
    display: flex;
    align-items: center;
  }
  .applyInfo {
    display: flex;
    margin-top: 43px;
    > div {
      width: 50%;
    }
    .info {
      > div {
        display: flex;
        margin-bottom: 20px;
      }
      span:nth-child(1) {
        display: block;
        width: 160px;
      }
    }
    /deep/ .el-textarea {
      width: 78%;
    }
  }
  .approveInfo {
    display: flex;
    >div {
      width: 33%;
    }
  }
  .operate {
    padding: 20px 0;
    border-top: 1px solid #dddddd;
    > div:nth-child(1) {
      color: #333333;
      font-weight: bold;
      padding-bottom: 22px;
    }
    > div:nth-child(2) {
      display: flex;
    }
  }
}
</style>
