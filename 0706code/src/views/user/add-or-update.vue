<template>
  <el-dialog
    width="600px"
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      label-width="80px"
      @keyup.enter.native="dataFormSubmit()"
    >
      <el-form-item label="用户号" prop="userId">
        <el-input
          v-model="dataForm.userId"
          maxlength="7"
          placeholder="登录账户"
          :disabled="!!dataForm.id"
          style="width: 300px;"
        ></el-input>
      </el-form-item>
      <el-form-item label="用户名" prop="userName">
        <el-input
          v-model="dataForm.userName"
          placeholder="用户名"
          style="width: 300px;"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="密码"
        prop="password"
        :class="{ 'is-required': !dataForm.id }"
      >
        <el-input
          v-model="dataForm.password"
          type="password"
          placeholder="密码"
          style="width: 300px;"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="确认密码"
        prop="comfirmPassword"
        :class="{ 'is-required': !dataForm.id }"
      >
        <el-input
          v-model="dataForm.comfirmPassword"
          type="password"
          placeholder="确认密码"
          style="width: 300px;"
        ></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input
          v-model="dataForm.email"
          placeholder="邮箱"
          style="width: 300px;"
        ></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input
          v-model="dataForm.mobile"
          placeholder="手机号"
          style="width: 300px;"
        ></el-input>
      </el-form-item>
      <el-form-item label="角色" size="mini" prop="roleList">
        <!-- <el-checkbox-group v-model="dataForm.roleIdList" style="width: 300px;">
          <el-checkbox style="margin-left: 10px;" v-for="role in roleList" :key="role.roleId" :label="role.roleId">{{ role.roleName }}</el-checkbox>
        </el-checkbox-group> -->
        <el-radio-group v-model="dataForm.roleIdList" style="width: 300px;">
          <el-radio
            style="margin-left: 10px; width: 140px; margin-bottom: 5px"
            v-for="role in roleList"
            :key="role.roleId"
            :label="role.roleId"
            @change="roleChange"
            >{{ role.roleName }}</el-radio
          >
          <!-- <el-radio :label="6">备选项</el-radio>
          <el-radio :label="9">备选项</el-radio> -->
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="!!dataForm.roleIdList" label="机构" prop="orgName">
        <el-popover
          ref="menuListPopover"
          v-model="popoverShow"
          popper-class="spMenuPopover"
          placement="bottom-start"
          trigger="click"
          @show="popShow(dataForm.roleIdList)"
        >
          <el-tree
            v-loading="loading"
            :data="menuList"
            :props="menuListTreeProps"
            node-key="id"
            @node-click="selectedNode"
            ref="menuListTree"
            @current-change="menuListTreeCurrentChangeHandle"
            :current-node-key="dataForm.parentId"
            :default-expand-all="true"
            :highlight-current="true"
            :expand-on-click-node="false">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.orgName" v-popover:menuListPopover :readonly="true" placeholder="点击选择机构" class="menu-list__input"></el-input>
      </el-form-item>
      <el-form-item label="状态" size="mini" prop="status">
        <el-radio-group v-model="dataForm.status" style="width: 300px;">
          <el-radio :label="0">禁用</el-radio>
          <el-radio :label="1">正常</el-radio>
        </el-radio-group>
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
import { isEmail, isMobile } from '@/utils/validate'
// import { treeDataTranslate } from '@/utils'
export default {
  data() {
    var validateUserId = (rule, value, callback) => {
      if (value && !/^[0-9a-zA-Z]*$/.test(value)) {
        callback(new Error('只能输入字母或数字'))
      } else {
        callback()
      }
    }

    var validatePassword = (rule, value, callback) => {
      if (!this.dataForm.id && !/\S/.test(value)) {
        callback(new Error('密码不能为空'))
      } else {
        callback()
      }
    }
    var validateComfirmPassword = (rule, value, callback) => {
      if (!this.dataForm.id && !/\S/.test(value)) {
        callback(new Error('确认密码不能为空'))
      } else if (this.dataForm.password !== value) {
        callback(new Error('确认密码与密码输入不一致'))
      } else {
        callback()
      }
    }
    var validateEmail = (rule, value, callback) => {
      if (!isEmail(value)) {
        callback(new Error('邮箱格式错误'))
      } else {
        callback()
      }
    }
    var validateMobile = (rule, value, callback) => {
      if (!isMobile(value)) {
        callback(new Error('手机号格式错误'))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      roleList: [],
      dataForm: {
        id: 0,
        userId: '',
        userName: '',
        password: '',
        comfirmPassword: '',
        salt: '',
        email: '',
        mobile: '',
        // roleIdList: [],
        roleIdList: '',
        status: 1,
        orgName: '',
        parentId: ''
      },
      loading: false,
      dataRule: {
        userId: [
          { required: true, message: '用户号不能为空', trigger: 'blur' },
          { validator: validateUserId, trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        orgName: [
          { required: true, message: '机构不能为空', trigger: 'change' }
        ],
        password: [{ validator: validatePassword, trigger: 'blur' }],
        comfirmPassword: [
          { validator: validateComfirmPassword, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ]
      },
      menuList: [],
      menuListTreeProps: {
        label: 'label',
        children: 'children'
      },
      popoverShow: false
    }
  },
  methods: {
    init(id) {
      this.dataForm.id = id || 0
      API.role
        .select()
        .then(({ data }) => {
          this.roleList = data && data.code === 0 ? data.data : []
          this.dataForm.roleIdList = data.data[0].roleId
        })
        .then(() => {
          this.visible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
          })
        })
        .then(() => {
          if (this.dataForm.id) {
            API.user.info(id).then(({ data }) => {
              if (data && data.code === 0) {
                this.dataForm.userId = data.data.userId
                this.dataForm.userName = data.data.username
                this.dataForm.salt = data.data.salt
                this.dataForm.email = data.data.email
                this.dataForm.mobile = data.data.mobile
                // this.dataForm.roleIdList = data.data.roleIdList
                this.dataForm.roleIdList =
                  data.data.roleIdList.length > 0 ? data.data.roleIdList[0].toString() : ''
                this.dataForm.status = data.data.status
                this.dataForm.parentId = data.data.orgNo
                this.dataForm.orgName = data.data.orgName
              }
            })
          }
        })
    },
    popShow(roleId) {
      this.loading = true
      if (roleId === '9999') {
        API.user.findAllTreeSupp().then(res => {
          this.loading = false
          this.menuList = res.data.data[0].children
          this.$nextTick(() => {
            this.menuListTreeSetCurrentNode()
          })
        }).catch(err => {
          this.loading = false
          console.log(err)
        })
      } else {
        API.user.findAllTree().then(res => {
          this.loading = false
          this.menuList = res.data.data
          this.$nextTick(() => {
            this.menuListTreeSetCurrentNode()
          })
        }).catch(err => {
          this.loading = false
          console.log(err)
        })
      }
    },
    roleChange() {
      this.dataForm.parentId = ''
      this.dataForm.orgName = ''
    },
    // 菜单树设置当前选中节点
    menuListTreeSetCurrentNode() {
      this.$refs.menuListTree.setCurrentKey(this.dataForm.parentId)
      this.dataForm.orgName = (this.$refs.menuListTree.getCurrentNode() || {})['label']
    },
    menuListTreeCurrentChangeHandle (data, node) {
      this.dataForm.parentId = data.id
      this.dataForm.orgName = data.label
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          let roleList = []
          roleList.push(this.dataForm.roleIdList)
          var params = {
            userId: this.dataForm.userId || undefined,
            username: this.dataForm.userName,
            password: this.dataForm.password,
            salt: this.dataForm.salt,
            email: this.dataForm.email,
            mobile: this.dataForm.mobile,
            status: this.dataForm.status,
            roleIdList: roleList,
            orgNo: this.dataForm.parentId
          }

          var tick = !this.dataForm.id
            ? API.user.add(params)
            : API.user.update(params)
          tick
            .then(({ data }) => {
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
            })
            .catch(error => {
              this.$message.error(error.msg)
            })
        }
      })
    },
    selectedNode() {
      this.popoverShow = false
    }
  }
}
</script>
<style lang="scss">
.spMenuPopover {
  height: 600px;
  overflow-y: auto;
}
</style>
