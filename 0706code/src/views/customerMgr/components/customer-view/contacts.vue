<template>
  <div class="senior-executive mt-16">
    <div class="title">
      <div class="title-text">关键联系人</div>
      <el-button type="warning" size="small" @click="addContact()">新增</el-button>
    </div>
    <div class="no-data" v-if="!contactsList.length">暂无数据</div>
    <div v-if="contactsList.length" class="member-card" v-for="item in contactsList">
      <div class="member-name" @click="contactDetail(item)" style="cursor: pointer">
        <div class="name">{{item.primaryName}}</div>
        <div class="phone">{{item.mobile}}</div>
      </div>
      <div class="member-message">
        <div class="label">所属部门</div>
        <div class="value">{{item.keyDeptName}}</div>
      </div>
      <div class="member-message">
        <div class="label">职位</div>
        <div class="value">{{item.profession}}</div>
      </div>
      <div class="member-message">
        <div class="label">电话</div>
        <div class="value">{{item.phone}}</div>
      </div>
      <div class="member-message">
        <div class="label">QQ号</div>
        <div class="value">{{item.qq}}</div>
      </div>
      <div class="member-message">
        <div class="label">微信</div>
        <div class="value">{{item.wechat}}</div>
      </div>
      <div class="member-message">
        <div class="label">E-mail</div>
        <div class="value">{{item.mail}}</div>
      </div>
      <div class="member-message">
        <div class="label">生日</div>
        <div class="value">{{item.birthday}}</div>
      </div>
      <div class="member-message">
        <div class="label">邮编</div>
        <div class="value">{{item.postalCode}}</div>
      </div>
      <div class="member-message" style="width: 30px;flex: unset;margin-left: 0;cursor: pointer">
        <div class="label" @click="addContact(item)"><i class="el-icon-edit"></i></div>
        <div class="value" @click="deleteContact(item)"><i class="el-icon-delete"></i></div>
      </div>
    </div>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="pagination.currentPage"
      :page-size="pagination.size"
      layout="prev, pager, next, jumper"
      :total="pagination.total">
    </el-pagination>
    <el-dialog title="新增" width="800px" :visible.sync="dialogAddVisible">
      <div class="dialog-body">
        <div class="item-card">
          <div class="item-label">姓名</div>
          <el-input v-model="cmKeyPerson.primaryName"></el-input>
        </div>
        <div class="item-card">
          <div class="item-label">所属部门</div>
<!--          <el-input v-model="cmKeyPerson.keyDeptName" suffix-icon="el-icon-search"></el-input>-->
          <el-input v-model="cmKeyPerson.keyDeptName"></el-input>
        </div>
        <div class="item-card">
          <div class="item-label">职位</div>
          <el-input v-model="cmKeyPerson.profession"></el-input>
        </div>
        <div class="item-card">
          <div class="item-label">电话</div>
          <el-input v-model="cmKeyPerson.phone"></el-input>
        </div>
        <div class="item-card">
          <div class="item-label">手机</div>
          <el-input v-model="cmKeyPerson.mobile"></el-input>
        </div>
        <div class="item-card">
          <div class="item-label">微信</div>
          <el-input v-model="cmKeyPerson.wechat"></el-input>
        </div>
        <div class="item-card">
          <div class="item-label">E-mail</div>
          <el-input v-model="cmKeyPerson.mail"></el-input>
        </div>
        <div class="item-card">
          <div class="item-label">QQ号</div>
          <el-input v-model="cmKeyPerson.qq" type="number"></el-input>
        </div>
        <div class="item-card">
          <div class="item-label">生日</div>
          <el-date-picker
            v-model="cmKeyPerson.birthday"
            format="yyyy/MM/dd"
            value-format="yyyy/MM/dd"
            type="date">
          </el-date-picker>
        </div>
        <div class="item-card">
          <div class="item-label">邮编</div>
          <el-input v-model="cmKeyPerson.postalCode" type="number"></el-input>
        </div>
        <div class="item-col">
          <div class="item-label">通讯地址</div>
          <el-input v-model="cmKeyPerson.address"></el-input>
        </div>
        <div class="item-col" style="align-items: flex-start">
          <div class="item-label" style="padding-top: 5px">备注</div>
          <el-input v-model="cmKeyPerson.remark" type="textarea":rows="4"></el-input>
        </div>
      </div>
      <div slot="footer" class="dialog-self">
        <el-button type="success" @click="saveContact()">保存</el-button>
        <el-button @click="dialogAddVisible = false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="详情" width="800px" :visible.sync="dialogDetailVisible">
      <div class="dialog-body">
        <div class="row">
          <div class="col">
            <div class="label-cell">姓名</div>
            <div class="content-cell">{{cmKeyPerson.primaryName}}</div>
          </div>
          <div class="col">
            <div class="label-cell">所属部门</div>
            <div class="content-cell">{{cmKeyPerson.keyDeptName}}</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label-cell">职位</div>
            <div class="content-cell">{{cmKeyPerson.profession}}</div>
          </div>
          <div class="col">
            <div class="label-cell">电话</div>
            <div class="content-cell">{{cmKeyPerson.phone}}</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label-cell">手机</div>
            <div class="content-cell">{{cmKeyPerson.mobile}}</div>
          </div>
          <div class="col">
            <div class="label-cell">微信</div>
            <div class="content-cell">{{cmKeyPerson.wechat}}</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label-cell">E-mail</div>
            <div class="content-cell">{{cmKeyPerson.mail}}</div>
          </div>
          <div class="col">
            <div class="label-cell">QQ号</div>
            <div class="content-cell">{{cmKeyPerson.qq}}</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label-cell">生日</div>
            <div class="content-cell">{{cmKeyPerson.birthday}}</div>
          </div>
          <div class="col">
            <div class="label-cell">邮编</div>
            <div class="content-cell">{{cmKeyPerson.postalCode}}</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label-cell">通讯地址</div>
            <div class="content-cell">{{cmKeyPerson.address}}</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="label-cell">备注</div>
            <div class="content-cell">{{cmKeyPerson.remark}}</div>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-self">
        <el-button @click="dialogDetailVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api'
import { Constants } from '../../constants'

export default {
  props: {
    customerMessage: {
      type: Object
    },
    socCode: {
      type: String
    }
  },
  data() {
    return {
      dialogAddVisible: false,
      dialogDetailVisible: false,
      cmKeyPerson: {},
      defaultKeyPerson: {
        address: '',
        birthday: '',
        createDt: '',
        createUser: '',
        createUserName: '',
        custName: '',
        custNo: '',
        deptCode: '',
        id: '',
        keyDeptCode: '',
        keyDeptName: '',
        mail: '',
        mobile: '',
        phone: '',
        postalCode: '',
        primaryName: '',
        profession: '',
        qq: '',
        remark: '',
        socCode: '',
        updateDt: '',
        updateUser: '',
        updateUserName: '',
        wechat: ''
      },
      contactsList: [],
      pagination: {
        currentPage: 1,
        size: 10,
        total: 0
      },
      type: ''
    }
  },
  created() {
    this.getKeyPersonList()
  },
  mounted() {
  },
  methods: {
    addContact(item) {
      this.dialogAddVisible = true
      if (item) {
        this.type = 'modify'
        this.cmKeyPerson = JSON.parse(JSON.stringify(item))
      } else {
        this.type = 'create'
        this.cmKeyPerson = JSON.parse(JSON.stringify(this.defaultKeyPerson))
      }
    },
    deleteContact(item) {
      this.$alert('确定删除当前联系人吗', '删除', {
        confirmButtonText: '确定',
        callback: action => {
          if (action === 'confirm') {
            api.customerView.delKeyPerson({id: item.id}).then(({ data }) => {
              if (data && data.code === Constants.HTTP_SUCCESS) {
                this.$message('删除成功')
                this.getKeyPersonList()
              }
            })
          }
        }
      })
    },
    contactDetail(item) {
      this.dialogDetailVisible = true
      this.cmKeyPerson = JSON.parse(JSON.stringify(item))
    },
    saveContact() {
      if (!this.cmKeyPerson.primaryName) {
        this.$message('请输入联系人姓名')
        return
      }
      if (this.cmKeyPerson.phone) {
        // 电话的校验
        let myReg = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/
        if (!myReg.test(this.cmKeyPerson.phone)) {
          this.$message('您输入的电话号码格式不对，请重新输入')
          return
        }
      }
      if (this.cmKeyPerson.mobile) {
        // 手机号的校验
        let myReg = /^((13[0-9])|(15[^4])|(166)|(17[0-8])|(18[0-9])|(19[8-9])|(147,145))\d{8}$/
        if (!myReg.test(this.cmKeyPerson.mobile)) {
          this.$message('您输入的手机号码格式不对，请重新输入')
          return
        }
      }
      if (this.cmKeyPerson.mail) {
        // 邮箱的校验
        let myReg = /^([a-zA-Z\d])((\w|-)+\.?)+@([a-zA-Z\d]+\.)+[a-zA-Z]{2,6}$/
        if (!myReg.test(this.cmKeyPerson.mail)) {
          this.$message('您输入的邮箱格式不对，请重新输入')
          return
        }
      }
      if (this.cmKeyPerson.postalCode) {
        // 邮编的校验
        let myReg = /^[1-9]\d{5}$/g
        if (!myReg.test(this.cmKeyPerson.postalCode)) {
          this.$message('您输入的邮编格式不对，请重新输入')
          return
        }
      }
      this.cmKeyPerson.socCode = this.socCode
      if (this.type === 'create') {
        this.cmKeyPerson.createUser = this.$store.state.user.id
        this.cmKeyPerson.createUserName = this.$store.state.user.name
      } else {
        this.cmKeyPerson.updateUser = this.$store.state.user.id
        this.cmKeyPerson.updateUserName = this.$store.state.user.name
      }
      this.cmKeyPerson.deptCode = this.$store.state.user.userInfo.deptCode
      this.cmKeyPerson.custName = this.customerMessage.custName
      this.cmKeyPerson.custNo = this.customerMessage.custNo
      const loading = this.$loading({
        lock: true,
        text: '加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.5)'
      })
      api.customerView.updateKeyPerson(this.cmKeyPerson).then(({ data }) => {
        if (data && data.code === Constants.HTTP_SUCCESS) {
          console.log('updateKeyPerson', data)
          loading.close()
          this.dialogAddVisible = false
          this.getKeyPersonList()
        }
      })
    },
    getKeyPersonList() {
      let params = {
        socCode: '10000',
        current: this.pagination.currentPage,
        size: this.pagination.size
      }
      this.creditList = []
      api.customerView.getKeyPersonList(params).then(({ data }) => {
        if (data && data.code === Constants.HTTP_SUCCESS) {
          console.log('getKeyPersonList', data)
          this.contactsList = data.data ? data.data.records : []
          this.pagination.total = data.data.total
        }
      })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.getKeyPersonList()
    }
  }
}
</script>

<style lang="scss" scoped>
.senior-executive {
  display: flex;
  flex-direction: column;
  padding: 16px 8px;
  .member-card {
    display: flex;
    margin-top: 16px;
    background: #FFFFFF;
    box-shadow: 0px 4px 16px 0px rgba(1, 58, 129, 0.1);
    border-radius: 8px;
    .member-name {
      width: 133px;
      flex-shrink: 0;
      background: #79AC43;
      border-radius: 8px;
      padding: 18px 20px;
      .name {
        height: 25px;
        font-size: 18px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #FFFFFF;
        line-height: 25px;
      }
      .phone {
        margin-top: 8px;
        word-break: break-all;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #FFFFFF;
        line-height: 20px;
      }
    }
    .member-message {
      margin-left: 2%;
      padding: 18px 0;
      flex: 1;
      .label {
        height: 20px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
        line-height: 20px;
      }
      .value {
        margin-top: 12px;
        word-break: break-all;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
        line-height: 20px;
      }
    }
    .divider-vertical {
      flex-shrink: 0;
      margin: 20px 6px 20px 3%;
      width: 1px;
      height: 48px;
      background: #EDEDED;
      border-radius: 3px;
    }
  }
}
.dialog-body {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  .item-card {
    display: flex;
    width: 50%;
    align-items: center;
    padding-left: 20px;
    &:nth-of-type(n+3) {
      margin-top: 16px;
    }
    .item-label {
      text-align: right;
      width: 80px;
      padding-right: 10px;
      flex-shrink: 0;
    }
    .el-date-editor {
      flex: 1;
    }
  }
  .item-col {
    width: 100%;
    display: flex;
    align-items: center;
    margin-top: 16px;
    padding-left: 20px;
    .item-label {
      text-align: right;
      width: 80px;
      padding-right: 10px;
      flex-shrink: 0;
    }
  }
}
.dialog-self {
  text-align: right;
}


.row {
  display: flex;
  height: 40px;
  width: 100%;
  .col {
    display: flex;
    align-items: center;
    flex: 1;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    margin-left: 16px;
    .label-cell {
      text-align: right;
      line-height: 40px;
      color: #707070;
      width: 80px;
      flex-shrink: 0;
    }
    .content-cell {
      margin-left: 32px;
      text-align: left;
      line-height: 40px;
      color: #4A4A4A;
    }
    &:first-of-type {
      margin-left: 0;
    }
  }
  &:nth-of-type(odd) {
    .col {
      background: #F4F4F5;
    }
  }
}
</style>
