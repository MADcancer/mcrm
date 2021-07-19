<template>
  <div class="product-info">
    <!-- 基本信息 -->
    <el-form :model="infoForm" ref="infoForm" label-position="left">
      <div class="inline-form">
        <el-form-item label="供应商名称：" label-width="100px">
          <el-input
            v-model="infoForm.suppName"
            autocomplete="off"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="供应商渠道：" label-width="100px">
          <el-input
            v-model="$root.selectOption.channelObj[infoForm.suppChannel]"
            autocomplete="off"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="商品名称：" label-width="100px">
          <el-input
            v-model="infoForm.prodName"
            autocomplete="off"
            disabled
          ></el-input>
        </el-form-item>
      </div>
      <div class="inline-form">
        <el-form-item label="单位成本：" label-width="100px">
          <el-input
            v-model="infoForm.unitCost"
            autocomplete="off"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="市场价(元)：" label-width="100px">
          <el-input
            v-model="infoForm.showPrice"
            autocomplete="off"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="计量单位：" label-width="100px">
          <el-input
            v-model="infoForm.units"
            autocomplete="off"
            disabled
          ></el-input>
        </el-form-item>
      </div>
      <div class="inline-form">
        <el-form-item label="数量：" label-width="100px">
          <el-input
            v-model="infoForm.prodCnt"
            autocomplete="off"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item
          label="小苏通通知："
          label-width="110px"
          prop="ifMessage"
        >
          <el-select
            v-model="infoForm.ifMessage"
            placeholder=""
            disabled
          >
            <el-option label="是" value="0"></el-option>
            <el-option label="否" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品类型：" label-width="100px">
          <el-input
            v-model="prodType[infoForm.prodType]"
            autocomplete="off"
            disabled
          ></el-input>
        </el-form-item>
      
      </div>
      <div class="inline-form">
        <el-form-item
          label="是否发送短信："
          v-if="infoForm.prodType === '2'"
          label-width="110px"
          prop="isMsg"
        >
          <el-select
            v-model="infoForm.isMsg"
            placeholder=""
            disabled
          >
            <el-option label="请选择" value=""></el-option>
            <el-option label="是" value="0"></el-option>
            <el-option label="否" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="商品细类："
          v-else
          label-width="100px"
          prop="ifThanks"
          :style="{ visibility: infoForm.prodType === '1' ? 'visible' : 'hidden' }"
        >
          <el-select
            v-model="infoForm.ifThanks"
            placeholder=""
            disabled
          >
            <el-option label="请选择" value=""></el-option>
            <el-option label="券码" value="0"></el-option>
            <el-option label="谢谢惠顾" value="1"></el-option>
            <el-option label="积分" value="2"></el-option>
            <el-option label="苏惠保" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="是否发送短信："
          label-width="100px"
          :style="{ display: ifMsg ? 'block' : 'none' }"
        >
         <el-select
            v-model="infoForm.isMsg"
            placeholder=""
            disabled
          >
            <el-option label="是" value="0"></el-option>
            <el-option label="否" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="infoForm.prodType === '2'"
          label="是否发货："
          label-width="100px"
          prop="ifShipment"
        >
          <el-select
            v-model="infoForm.ifShipment"
            placeholder=""
            disabled
          >
            <el-option label="请选择" value=""></el-option>
            <el-option label="是" value="0"></el-option>
            <el-option label="否" value="1"></el-option>
          </el-select>
        </el-form-item>
        <div :style="{visibility: 'hidden', display: ifMsg ? 'none' : 'block'}">
          <el-form-item label-width="100px">
            <el-input></el-input>
          </el-form-item>
        </div>
      </div>
      <div>
        <el-form-item label="商品规格：" label-width="100px">
          <el-input
            type="textarea"
            :rows="4"
            v-model="infoForm.prodSpec"
            autocomplete="off"
            disabled
          ></el-input>
        </el-form-item>
      </div>
      <div>
        <el-form-item label="商品说明：" label-width="100px">
          <el-input
            type="textarea"
            :rows="4"
            maxlength="100"
            v-model="infoForm.notes"
            autocomplete="off"
            disabled
          ></el-input>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>
<script>
export default {
  props: {
    infoForm: {
      type: Object
    }
  },
  watch: {},
  data() {
    return {
      step: 1,
      prodType: ['', '虚拟', '实物']
    }
  },
  computed: {
    ifMsg() {
      console.log(this.infoForm.prodType === '1')
      return (this.infoForm.prodType === '1' &&
        (this.infoForm.ifThanks === '0' ||
        this.infoForm.ifThanks === '3'))
    }
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
.product-info {
  .inline-form {
    display: flex;
    justify-content: space-between;
    /deep/ .el-input {
      width: 200px;
    }
  }
  /deep/ .el-form-item__label {
    padding: 0;
  }
}
</style>
