<template>
  <el-dialog
    width="600px"
    title="页面设置"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <div class="modelboxGroup">
      <el-checkbox
        class="modelbox"
        v-for="item of modelList"
        v-model="item.checked"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        @change="checkModelHandle(item)"
        border
      ></el-checkbox>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      selectedList: [
        'dataStatistics',
        'distribution',
        'bankAssets',
        'creditInfo',
        'guestTop',
        'revenueReport',
        'usedCredit',
      ],
      modelList: [
        {
          checked: true,
          value: 'dataStatistics',
          label: '数据统计',
        },
        {
          checked: true,
          value: 'distribution',
          label: '客户数量分布',
        },
        {
          checked: true,
          value: 'bankAssets',
          label: '全行资产分布图',
        },
        {
          checked: true,
          value: 'creditInfo',
          label: '授信信息',
        },
        {
          checked: true,
          value: 'guestTop',
          label: '客户TOP10',
        },
        {
          checked: true,
          value: 'revenueReport',
          label: '营收报表',
        },
        {
          checked: true,
          value: 'usedCredit',
          label: '授信使用',
        },
      ],
    }
  },
  methods: {
    checkModelHandle(item) {
      console.log(item)
      if (item.checked) {
        this.selectedList.push(item.value)
      } else {
        this.removeByValue(item.value)
      }
      this.$emit('modelDataList')
    },
    removeByValue(val) {
      this.selectedList.splice(
        this.selectedList.findIndex((e) => e === val),
        1
      )
    },
  },
}
</script>
<style lang="scss">
.modelboxGroup {
  width: 100%;
  height: 100px;
  display: flex;
  flex-wrap: wrap;
}
.modelbox {
  margin-left: 5px !important;
}
</style>
