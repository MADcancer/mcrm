<template>
  <div class="code-info">
    <el-table
      :data="datas"
      border
      style="width: 100%"
      v-if="datas.length === 0"
    >
    </el-table>
    <div v-else class="code">
      <div v-for="(data, idx) in datas" :key="idx">
        <el-input v-model="data.ticketCode" placeholder="请输入供应商名称" disabled></el-input>
      </div>
    </div>
  </div>
</template>
<script>
import API from '@/api'
export default {
  props: {
    step: {
      type: Number
    },
    prodId: {
      type: String
    }
  },
  watch: {
    'step': {
      deep: true,
      immediate: true,
      handler: function(value) {
        if (value === 3) {
          API.product.getCode({prodId: this.prodId}).then((res) => {
            console.log(res.data)
            this.datas = res.data.data
          })
        }
      }
    }
  },
  data() {
    return {
      datas: [],
      page: {
        total: 0,
        current: 1,
        size: 10
      }
    }
  },
  methods: {
    // cancel() {
    //   this.$emit('cancel', { type: 'info' })
    // }
  }
}
</script>
<style lang="scss" scoped>
.code-info {
  /deep/ .has-gutter {
    display: none;
  }
  .code {
    display: flex;
    flex-wrap: wrap;
    width: 86%;
    margin: 0 auto;
    max-height: 400px;
    overflow-y: auto;
    >div {
      width: 197px;
      height: 26px;
      padding-right: 18px;
      margin-bottom: 10px;
    }
  }
}
</style>
