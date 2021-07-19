<template>
  <div class="stock-edit">
    <el-dialog
      title="添加库存"
      :visible.sync="dialogEditStockVisible"
      width="1050px"
      :before-close="cancel"
    >
      <div v-loading="vLoading" style="width: 100%">
        <el-form :model="editForm" :rules="rules" ref="editForm">
          <div
            v-for="(item, index) in editForm.prods"
            :key="index"
            class="item-row"
          >
            <el-form-item label="奖品名称：" label-width="120px">
              <el-input
                v-model="item.prodName"
                autocomplete="off"
                disabled
              ></el-input>
            </el-form-item>
            <el-form-item label="当前库存：" label-width="120px">
              <el-input
                v-model="item.prodStock"
                autocomplete="off"
                disabled
              ></el-input>
            </el-form-item>
            <el-form-item
              label="添加库存数量："
              label-width="120px"
              :prop="'prods.' + index + '.addStock'"
              :rules="[
                {
                  validator: (rule, value, callback) => {
                    checkCount(value, callback, index)
                  },
                  trigger: 'blur',
                },
              ]"
            >
              <el-input
                v-model="item.addStock"
                autocomplete="off"
                maxlength="6"
              ></el-input>
            </el-form-item>
            <el-form-item label="奖品库存：" label-width="120px">
              <el-input
                v-model="item.prodCnt"
                autocomplete="off"
                disabled
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align: center">
          <el-button type="primary" @click="save">提交</el-button>
          <el-button @click="cancel">取消</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 提示框 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogConfirmVisible"
      width="30%"
      class="cus-confirm"
    >
      <span>是否确认提交？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addProdCount" :loading="loading"
          >确 认</el-button
        >
        <el-button @click="dialogConfirmVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import API from '@/api'
export default {
  props: {
    dialogEditStockVisible: {
      type: Boolean
    },
    type: {
      type: String
    },
    actId: {
      type: String
    }
  },
  watch: {
    dialogEditStockVisible(value) {
      if (value) {
        // 初始化数据
        this.vLoading = true
        this.getProdData()
        // 移除所有表单项的校验
        this.$nextTick(() => {
          this.$refs['editForm'].clearValidate()
        })
      }
    }
  },
  data() {
    // 校验数量
    var checkCount = (value, callback, index) => {
      if (value && !/^[0-9]{1,}[\d]*$/.test(value)) {
        return callback(new Error('请输入正整数'))
      }
      if (parseInt(this.editForm.prods[index].prodCnt) < value) {
        return callback(new Error('不能超过奖品库存'))
      }
      return callback()
    }
    return {
      checkCount,
      editForm: { prods: [] },
      rules: {
        addStock: [{ validator: checkCount, trigger: 'blur' }]
      },
      vLoading: false,
      loading: false,
      dialogConfirmVisible: false
    }
  },
  computed: {},
  methods: {
    // 获取数据
    getProdData() {
      API.newlottery
      .getLotteryActProdData({
        actId: this.actId
      }).then((res) => {
        // 上线的肯定至少有一条
        this.vLoading = false
        this.editForm.prods = []
        res.data.data.forEach((ele) => {
          let tempEle = {}
          tempEle.id = ele.id
          tempEle.prodId = ele.prodId
          tempEle.prodName = ele.prodName
          tempEle.prodStock = ele.prodStock
          tempEle.prodCnt = ele.prodCnt
          tempEle.addStock = ele.addStock || ''
          this.editForm.prods.push(tempEle)
        })
      })
      .catch(() => {
        this.vLoading = false
      })
    },
    // 提交
    save() {
      this.$refs['editForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.dialogConfirmVisible = true
      })
    },
    // 增加库存
    addProdCount() {
      this.loading = true
      let param = []
      this.editForm.prods.forEach((ele) => {
        let tempEle = JSON.parse(JSON.stringify(ele))
        // 深度copy
        // let tempEle = {...ele}
        param.push(
          Object.assign(tempEle, { addStock: tempEle.addStock || '0' })
        )
      })
      API.newlottery
        .addLotteryActStock(param)
        .then(() => {
          this.loading = false
          this.dialogConfirmVisible = false
          this.$message.success('操作成功！')
          this.cancel()
        })
        .catch((error) => {
          this.loading = false
          // 再次获取 确保奖品库存最新
          this.getProdData()
          this.dialogConfirmVisible = false
          this.$message.warning(error.msg)
        })
    },
    cancel() {
      this.$emit('cancel', { type: this.type })
    }
  },
  created() {}
}
</script>

<style lang="scss" scoped>
.stock-edit {
  .item-row {
    display: flex;
  }
  /deep/ .el-input {
    width: 120px;
  }
}
</style>
