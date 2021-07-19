<template>
  <el-dialog
    title="选择人才卡"
    :visible.sync="cardVisible"
    width="600px"
    :before-close="cancel"
  >
    <div>
      <el-tree
        :data="data"
        :props="props"
        node-key="value"
        show-checkbox
        ref="tree"
        @check-change="handleCheckChange"
      >
      </el-tree>
      <div style="margin-top: 20px">
        <el-button type="primary" @click="handleCardAdd">添 加</el-button>
        <el-button @click="cancel">返 回</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    cardVisible: {
      type: Boolean
    },
    certYcCity: {
      type: String
    },
    certYcDistrict: {
      type: String
    }
  },
  data() {
    return {
      data: [],
      props: {
        children: 'children',
        label: 'label'
      }
    }
  },
  watch: {
    cardVisible(value) {
      if (value) {
        let certYcCity = this.certYcCity
        let certYcDistrict = this.certYcDistrict
        certYcCity = certYcCity === null ? '' : certYcCity
        certYcDistrict = certYcDistrict === null ? '' : certYcDistrict
        let checkeIds = `${certYcCity},${certYcDistrict}`
        this.$nextTick(() => {
          this.$refs.tree.setCheckedKeys(checkeIds.split(','))
        })
      }
    }
  },
  methods: {
    handleCheckChange() {},
    handleCardAdd() {
      // let certYcDistrict = this.$refs.tree.getCheckedNodes().filter(item => item.type && item.type === 'cert_yc_district')
      // let certYcCity = this.$refs.tree.getCheckedNodes().filter(item => item.type && item.type === 'cert_yc_city')
      this.$emit('cancelCard', {
        checkedNodes: this.$refs.tree
          .getCheckedNodes()
          .filter(item => item.id !== 2 && item.id !== 1),
        type: 'add'
      })
    },
    cancel() {
      this.$emit('cancelCard', {})
    }
  },
  created() {
    let certYcDistrict = {
      id: 1,
      label: '区级人才卡',
      children: this.$root.selectOption.certYcDistrict
    }
    let certYcCity = {
      id: 2,
      label: '市级人才卡',
      children: this.$root.selectOption.certYcCity
    }
    this.data = [certYcDistrict, certYcCity]
  }
}
</script>

<style style="scss" scoped></style>
