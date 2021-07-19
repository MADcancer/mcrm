<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="角色ID" prop="roleId">
        <el-input v-model="dataForm.roleId" placeholder="角色ID" maxlength="4" :disabled="disabled"></el-input>
      </el-form-item>
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="dataForm.roleName" placeholder="角色名称"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
      </el-form-item>
      <el-form-item label="角色渠道" prop="roleChannel">
        <el-select v-model="dataForm.roleChannel" placeholder="请选择">
          <el-option 
            v-for="(item,index) in $root.selectOption.channel" 
            :key="index" 
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="角色类型" prop="roleType">
        <el-select v-model="dataForm.roleType" placeholder="请选择">
          <el-option label="请选择" value="">
          </el-option>
          <el-option label="管理员" value="0">
          </el-option>
          <el-option label="业务员" value="1">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item size="mini" label="授权">
        <el-tree
          :data="menuList"
          :props="menuListTreeProps"
          node-key="menuId"
          ref="menuListTree"
          :default-expand-all="true"
          show-checkbox>
        </el-tree>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确认</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import API from '@/api'
  import { treeDataTranslate } from '@/utils'
  export default {
    data () {
      var roleIdValidate = (rule, value, callback) => {
      if (value && !/^[1-9]\d{3}$/.test(value)) {
        callback(new Error('角色ID为非0开头的4位数字'))
      } else {
        callback()
      }
    }
      return {
        visible: false,
        disabled: false,
        menuList: [],
        menuListTreeProps: {
          label: 'name',
          children: 'children'
        },
        dataForm: {
          id: 0,
          roleType: '',
          roleChannel: '',
          roleId: '',
          roleName: '',
          remark: ''
        },
        dataRule: {
          roleId: [
            { required: true, message: '角色ID不能为空', trigger: 'blur' },
            { validator: roleIdValidate, trigger: 'blur' }
          ],
          roleName: [
            { required: true, message: '角色名称不能为空', trigger: 'blur' }
          ],
          roleChannel: [
            { required: true, message: '角色渠道不能为空', trigger: 'blur' }
          ],
          roleType: [
            { required: true, message: '角色类型不能为空', trigger: 'blur' }
          ]
        },
        tempKey: '' // 临时key, 用于解决tree半选中状态项不能传给后台接口问题. # 待优化
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        API.menu.list().then(({data}) => {
          this.menuList = treeDataTranslate(data, 'menuId')
          console.log(this.menuList)
        }).then(() => {
          this.visible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
            this.$refs.menuListTree.setCheckedKeys([])
          })
        }).then(() => {
          if (this.dataForm.id) {
            this.disabled = true
            API.role.info(this.dataForm.id).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.roleId = data.data.roleId
                this.dataForm.roleName = data.data.roleName
                this.dataForm.remark = data.data.remark
                this.dataForm.roleChannel = data.data.roleChannel
                this.dataForm.roleType = data.data.roleType
                let idx = data.data.menuIdList.indexOf(this.tempKey)
                if (idx !== -1) {
                  data.data.menuIdList.splice(idx, data.data.menuIdList.length - idx)
                }
                let menuIdList = data.data.menuIdList
                // 去掉父节点
                data.data.parentIdList.forEach((id, index) => {
                  menuIdList = menuIdList.filter(item => item !== id)
                })
                this.$refs.menuListTree.setCheckedKeys(menuIdList)
              }
            })
          } else {
            this.disabled = false
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            // let menuIdList = this.$refs.menuListTree.getCheckedKeys()
            // let delId = this.unique(this.$refs.menuListTree.getCheckedNodes().map((item) => {
            //   return item.parentId
            // }))

            // delId.forEach((id, index) => {
            //   menuIdList = menuIdList.filter(item => item !== id)
            // })
            var params = {
              'roleId': this.dataForm.roleId,
              'roleType': this.dataForm.roleType,
              'roleChannel': this.dataForm.roleChannel,
              'roleName': this.dataForm.roleName,
              'remark': this.dataForm.remark,
              'menuIdList': [].concat(this.$refs.menuListTree.getCheckedKeys(), this.$refs.menuListTree.getHalfCheckedKeys())
            }
            var tick = !this.dataForm.id ? API.role.add(params) : API.role.update(params)
            tick.then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              }
            }).catch((error) => {
              this.$message.error(error.msg)
            })
          }
        })
      },
      unique(arr) {
        return Array.from(new Set(arr))
      }
    }
  }
</script>
