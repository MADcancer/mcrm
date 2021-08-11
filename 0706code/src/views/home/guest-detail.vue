<template>
  <el-dialog
    width="850px"
    title="客户明细"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <div class="guestTable">
      <el-table
        :data="tableData"
        style="width: 90%; font-size: 12px"
        max-height="400"
        :row-style="{ height: '0px' }"
        :header-cell-style="{ color: '#000', background: 'lightgray' }"
      >
        <el-table-column prop="custNo" label="客户编号"> </el-table-column>
        <el-table-column
          prop="socCode"
          width="150"
          label="统一社会信用代码证号"
        >
        </el-table-column>
        <el-table-column prop="custName" width="150" label="客户名称">
        </el-table-column>
        <el-table-column prop="custType" label="客户类型"> </el-table-column>
        <el-table-column prop="assetBal" width="120" label="资产余额（亿元）">
        </el-table-column>
        <el-table-column prop="debtBal" width="120" label="负债余额（亿元）">
        </el-table-column>
        <el-table-column prop="isFocus" label="是否关注"> </el-table-column>
      </el-table>
    </div>
  </el-dialog>
</template>

<script>
import API from '@/api'
export default {
  data() {
    return {
      visible: false,
      tableData: [
        {
          assetBal: 0,
          custName: '123',
          custNo: '123',
          custType: '123',
          debtBal: 0,
          isFocus: '是',
          proivince: '',
          socCode: '123',
        },
        {
          assetBal: 0,
          custCount: '',
          custName: '123',
          custNo: '123',
          custType: '123',
          debtBal: 0,
          isFocus: '否',
          proivince: '',
          socCode: '123',
        },
      ],
    }
  },
  methods: {
    getData(params) {
      const request = {
        proivince: params.name,
        roleId: '',
        userNo: '',
      }
      API.user
        .info()
        .then(({ data }) => {
          if (data && data.code === 0) {
            request.roleId = data.data.roleIdList && data.data.roleIdList[0]
            request.userNo = data.data.userNo
          }
        })
        .then(() => {
          console.log(request)
          API.cockpit.getCustInfoByPro(request).then(({ data }) => {
            if (data && data.code === 0) {
              this.tableData = data.data
            }
          })
        })
    },
  },
}
</script>
<style lang="scss">
.guestTable {
  display: flex;
  width: 100%;
  height: 400px;
}
</style>
