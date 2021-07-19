<template>
  <div class="edit">
    <el-dialog
      title="权益订单信息"
      :visible.sync="dialogInfoVisible"
      width="700px"
      :before-close="cancel"
    >
      <div v-loading="waitLoading">
        <el-form
          label-position="left"
          label-width="120px"
          :model="editForm"
          ref="editForm"
        >
          <el-form-item label="下单时间：">
            <el-input
              v-model="editForm.createTime"
              autocomplete="off"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="活动名称：">
            <el-input
              v-model="editForm.actName"
              autocomplete="off"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="商品名称：">
            <el-input
              v-model="editForm.productName"
              autocomplete="off"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="收货人姓名：">
            <el-input
              v-model="editForm.custName"
              autocomplete="off"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="收货人电话：">
            <el-input
              v-model="editForm.custMobile"
              autocomplete="off"
              disabled
            ></el-input>
          </el-form-item>
           <el-form-item label="收货地址：">
            <el-input
              v-model="editForm.custAddress"
              autocomplete="off"
              disabled
            ></el-input>
          </el-form-item>
           <el-form-item label="物流公司：">
            <el-input
              v-model="editForm.logisticsName"
              autocomplete="off"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="物流单号：">
            <el-input
              v-model="editForm.logisticsNo"
              autocomplete="off"
              disabled
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import API from '@/api'
export default {
  props: {
    dialogInfoVisible: {
      type: Boolean
    },
    id: {
      type: String
    }
  },
  watch: {
    dialogInfoVisible(value) {
      if (value) {
        this.waitLoading = true
        API.report.qryEquityOrderOne(this.id).then(res => {
          this.waitLoading = false
          this.editForm = res.data.data
        }).catch(() => {
          this.waitLoading = false
        })
      }
    }
  },
  data() {
    return {
      editForm: {},
      waitLoading: false
    }
  },
  methods: {
    cancel() {
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="scss" scoped>
.edit {
  /deep/ .el-input,
  /deep/ .el-textarea {
    width: 260px;
  }
  /deep/ .el-form-item {
    margin-bottom: 14px;
  }
  .subject-img {
    display: flex;
    align-items: center;
    /deep/ .el-button {
      height: 24px;
      line-height: 1;
      display: inline-flex;
      align-items: center;
    }
  }
}
</style>
