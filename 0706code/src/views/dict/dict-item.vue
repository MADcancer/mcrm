<template>
  <div class="dict-item">
    <el-dialog
      width="800px"
      title="字典项管理"
      :close-on-click-modal="false"
      :visible.sync="visible">
      <div>
        <el-form :inline="true">
          <el-form-item>
            <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
          </el-form-item>
        </el-form>
        <el-table
          :data="dataList"
          border
          v-loading="dataListLoading"
          style="width: 100%;">
          <el-table-column
            prop="id"
            header-align="center"
            align="center"
            label="编号">
          </el-table-column>
          <el-table-column
            prop="type"
            header-align="center"
            align="center"
            label="类型">
          </el-table-column>
          <el-table-column
            prop="value"
            header-align="center"
            align="center"
            label="数据值">
          </el-table-column>
          <el-table-column
            prop="label"
            header-align="center"
            align="center"
            label="标签名">
          </el-table-column>
          <el-table-column
            prop="description"
            header-align="center"
            align="center"
            label="描述">
          </el-table-column>
          <el-table-column
            prop="sort"
            header-align="center"
            align="center"
            label="排序">
          </el-table-column>
          <el-table-column
            prop="remarks"
            header-align="center"
            align="center"
            label="备注信息">
          </el-table-column>
          <el-table-column
            fixed="right"
            header-align="center"
            align="center"
            width="150"
            label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row)">修改</el-button>
              <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <!-- 弹窗, 新增 / 修改 () -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="fetchList"></add-or-update>
  </div>
</template>

<script>
  import API from '@/api'
  import AddOrUpdate from './dict-item-add-or-update'
  export default {
    data () {
      return {
        visible: false,
        dataList: [],
        dataListLoading: false,
        addOrUpdateVisible: false,
        currentDict: undefined
      }
    },
    components: {
      AddOrUpdate
    },
    methods: {
      /**
       * 根据字典ID获取字典项列表
       * @param dictId
       */
      fetchList (dictId) {
        if (dictId) {
          // 根据ID查询字典项数据
          API.dict.listItem(dictId).then(({data}) => {
            if (data && data.code === 0) {
              this.dataList = data.data
            }
          })
        }
      },
      init (dict) {
        this.visible = true
        this.currentDict = dict
        this.$nextTick(() => {
          this.fetchList(dict.id)
        })
      },
      addOrUpdateHandle (item) {
        if (typeof (item) === 'undefined') {
          item = {
            type: this.currentDict.type,
            dictId: this.currentDict.id
          }
        }
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(item)
        })
      },
      // 删除
      deleteHandle (id) {
        this.$confirm(`确定对[id=${id}]进行删除操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          API.dict.delItem(id).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.fetchList(this.currentDict.id)
                }
              })
            }
          }).catch((error) => {
            this.$message.error(error.msg)
          })
        })
      }
    }
  }
</script>
