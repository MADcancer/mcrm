<template>
  <div v-if="showPage">
    <el-form :inline="true" :model="requestParams" :rules="rules" class="demo-form">
      <el-form-item label="是否提醒" class="switch-width">
        <el-switch v-model="requestParams.ifRemind"></el-switch>
      </el-form-item>
      <el-form-item label="提前天数">
        <el-select v-model="requestParams.frontday">
          <el-option label="请选择" value></el-option>
          <el-option
            v-for="(item,index) in advanceDayList"
            :key="index"
            :label="(index+1)+'天'"
            :value="index+1"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="短信模板">
        <el-input v-model="infoForm.msgName" autocomplete="off" disabled>
          <img
            src="~@/assets/img/search-logo.png"
            slot="suffix"
            style="width:15px; height:18px; margin-bottom:2px"
            @click="searchSupplier"
          />
        </el-input>
      </el-form-item>
      <el-form-item label="虚拟商品">
        <el-tooltip class="item" effect="dark" :disabled="!infoForm.prodName" :content="infoForm.prodName" placement="top-start">
          <el-input v-model="infoForm.prodName" autocomplete="off" disabled>
            <img
              src="~@/assets/img/search-logo.png"
              slot="suffix"
              style="width:15px; height:18px; margin-bottom:2px"
              @click="searchProd"
            />
          </el-input>
        </el-tooltip>
      </el-form-item>
      <div class="search-btns">
        <el-button type="primary" v-if="isAuth('sys:custinfo:ifAdmin')" icon="el-icon-query" @click="onSaveBtn" :loading="saveLoading">保存</el-button>
      </div>
    </el-form>
    <!-- 选择短信模板 -->
    <v-info :dialogProdmsgVisible="dialogProdmsgVisible" @cancel="close"></v-info>
    <!-- 选择虚拟商品 -->
    <v-product :dialogProdVisible="dialogProdVisible" @cancel="close"></v-product>
  </div>
</template>

<script>
import vInfo from './comps/info'
import vProduct from './comps/product'
import API from '@/api'
export default {
  components: { vInfo, vProduct },
  data() {
    return {
      requestParams: {
        ifRemind: false,
        frontday: ''
      },
      rules: {},
      infoForm: {},
      dialogProdmsgVisible: false,
      dialogProdVisible: false,
      advanceDayList: new Array(15),
      saveLoading: false,
      showPage: true
    }
  },
  methods: {
    searchSupplier() {
      this.dialogProdmsgVisible = true
    },
    searchProd() {
      this.dialogProdVisible = true
    },
    // 关闭供应商弹框
    close(val) {
      if (val.type === 'prod') {
        this.dialogProdVisible = false
        if (val.info.length === 0) {
          this.infoForm.prodName = ''
          this.infoForm.prodId = ''
        }
        val.info.forEach((info, idx) => {
          if (idx === 0) {
            this.infoForm.prodName = info.prodName
            this.infoForm.prodId = info.prodId
          } else {
            this.infoForm.prodName = `${this.infoForm.prodName}, ${info.prodName}`
            this.infoForm.prodId = `${this.infoForm.prodId},${info.prodId}`
          }
        })
      } else {
        this.dialogProdmsgVisible = false
        this.infoForm.proId = val.info.smsTemplateId
        this.infoForm.msgName = val.info.smsTemplateName
        this.infoForm.proChannel = val.info.sentCon
      }
      // this.supplier = val.info
    },
    onSaveBtn() {
      var that = this
      let parama = {
        smsOpen: this.requestParams.ifRemind ? '1' : '0',
        smsTime: this.requestParams.frontday,
        smsTemplateId: this.infoForm.proId,
        smsTemplateName: this.infoForm.msgName,
        prodId: this.infoForm.prodId
      }
      if (!parama.smsTime) {
        this.$message.error('提前天数不能为空')
        return
      }
      this.saveLoading = true
      API.loseffect
        .updateTicket(parama)
        .then((res) => {
          that.$message({
            message: '保存成功',
            type: 'success'
          })
          that.saveLoading = false
          this.getInfo()
        })
        .catch((res) => {
          that.$message.error(res.message ? res.message : '保存失败')
          that.saveLoading = false
        })
    },
    async getInfo() {
      let res = await API.loseffect.getTicket()
      if (res.data.code === 0) {
        this.requestParams.ifRemind = res.data.data.smsOpen === '1'
        this.requestParams.frontday = res.data.data.smsTime
        this.infoForm.proId = res.data.data.smsTemplateId
        this.infoForm.msgName = res.data.data.smsTemplateName
        this.infoForm.prodName = res.data.data.prodName
        this.infoForm.prodId = res.data.data.prodId
      }
    }
  },
  mounted() {
    this.getInfo()
  }
}
</script>
<style lang="scss" scoped>
.demo-form {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.switch-width {
  margin-right: 173px;
}
</style>