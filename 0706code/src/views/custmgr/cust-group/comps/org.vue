<template>
  <el-dialog
    title="选择机构"
    :visible.sync="orgVisible"
    width="600px"
    :before-close="cancel"
  >
    <div v-loading="waitLoading">
      <el-tree
        ref="tree"
        :data="orgData"
        :props="defaultProps"
        show-checkbox
        node-key="id"
        :check-strictly="true"
        :default-expanded-keys="['706660888']"
        :default-checked-keys="orgCheckedIds"
        @check="check"
      >
      </el-tree>
      <div class="org-dialog-btns">
        <el-button type="primary" @click="handleOrgAdd">添 加</el-button>
        <el-button @click="cancel">返 回</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import API from '@/api'
export default {
  props: {
    orgVisible: {
      type: Boolean
    },
    orgNo: {
      type: String
    }
  },
  data() {
    return {
      waitLoading: false,
      orgData: [],
      orgCheckedIds: [],
      orgName: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  watch: {
    orgVisible(value) {
      if (value) {
        this.getOrgTree()
      }
    }
  },
  methods: {
    // 请求机构树数据
    getOrgTree() {
      this.waitLoading = true
      API.activity
        .getOrgTreeData()
        .then(res => {
          this.waitLoading = false
          if (res.data.data && res.data.data.length > 0) {
            res.data.data[0].disabled = true
            if (
              res.data.data[0].children &&
              res.data.data[0].children.length > 0
            ) {
              if (this.orgCheckedIds.length > 0) {
                var checkedIndex = 0
                res.data.data[0].children.forEach(item => {
                  if (item.id === this.orgCheckedIds[0]) {
                    checkedIndex = 1
                  }
                })
                if (checkedIndex === 1) {
                  res.data.data[0].children.forEach(item => {
                    item.disabled = false
                    if (item.children && item.children.length > 0) {
                      item.children.forEach(ele => {
                        ele.disabled = true
                      })
                    }
                  })
                } else {
                  res.data.data[0].children.forEach(item => {
                    item.disabled = true
                    if (item.children && item.children.length > 0) {
                      item.children.forEach(ele => {
                        ele.disabled = false
                      })
                    }
                  })
                }
              } else {
                res.data.data[0].children.forEach(item => {
                  item.disabled = false
                  if (item.children && item.children.length > 0) {
                    item.children.forEach(ele => {
                      ele.disabled = false
                    })
                  }
                })
              }
            }
            this.orgData = res.data.data
          }
          this.orgCheckedIds = this.orgNo ? this.orgNo.split(',') : []
        })
        .catch(() => {
          this.waitLoading = false
        })
    },
    // 机构树选择
    check(data, node) {
      // console.log('data', data)
      // console.log('node', node)
      if (data.children) {
        this.orgData[0].children.forEach(ele => {
          ele.children.forEach(item => {
            item.disabled = true
          })
        })
      } else {
        this.orgData[0].children.forEach(ele => {
          ele.disabled = true
        })
      }
      if (node.checkedKeys.length === 0) {
        this.orgData[0].children.forEach(ele => {
          ele.disabled = false
          ele.children.forEach(item => {
            item.disabled = false
          })
        })
      }
    },
    handleOrgAdd() {
      var checkedIds = this.$refs.tree.getCheckedKeys()
      var checkedNodes = this.$refs.tree.getCheckedNodes()
      var checkedNames = []
      checkedNodes.forEach(item => {
        checkedNames.push(item.label)
      })
      this.orgCheckedIds = checkedIds
      this.orgName = checkedNames.join(';')
      // this.basicInfoForm.orgName = checkedNames.join(';')
      // this.basicInfoForm.orgNo = checkedIds.toString()
      this.cancel('add')
    },
    cancel(type) {
      let org = {}
      if (type === 'add') {
        org = {
          orgName: this.orgName,
          orgNo: this.orgCheckedIds.toString()
        }
      }
      this.$emit('cancelOrg', { type: type, orgInfo: org })
    }
  },
  create() {}
}
</script>

<style lang="scss" scoped></style>
