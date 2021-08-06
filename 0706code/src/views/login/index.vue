<template>
<div>
  <div v-loading="vloading" v-if="vloading" style="width: 100%; height: 100%"></div>
  <div class="site-wrapper site-page--login" v-else>
    <div class="site-content__wrapper">
      <div class="site-content">
        <div class="brand-info">
          <h2 class="brand-info__text">苏州同业客户关系管理系统</h2>
        </div>
        <div class="login-main">
          <h3 class="login-title">用户登录</h3>
          <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" status-icon>
            <el-form-item prop="userNo">
              <el-input v-model="dataForm.userNo" placeholder="帐号"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="dataForm.password" type="password" placeholder="密码"></el-input>
            </el-form-item>
            <el-form-item prop="captcha">
              <el-row :gutter="20">
                <el-col :span="14">
                  <el-input v-model="dataForm.captcha" placeholder="验证码">
                  </el-input>
                </el-col>
                <el-col :span="10" class="login-captcha">
                  <img :src="captchaPath" @click="getCaptcha()" alt="">
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item>
              <el-button class="login-btn-submit" type="primary" @click="dataFormSubmit()">登录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
  import API from '@/api'
  import { getUUID, getRouteNameByUrl } from '@/utils'
  export default {
    data () {
      return {
        vloading: true,
        dataForm: {
          userNo: '',
          password: '',
          uuid: '',
          captcha: ''
        },
        dataRule: {
          userNo: [
            { required: true, message: '帐号不能为空', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '密码不能为空', trigger: 'blur' }
          ],
          captcha: [
            { required: true, message: '验证码不能为空', trigger: 'blur' }
          ]
        },
        captchaPath: ''
      }
    },
    created () {
      if (window.location.search && window.location.search.indexOf('ICMS_SSO_USER_TOKEN') !== -1) {
        window.location.replace(`/#/login${window.location.search}`)
        return
      }
      if (this.$route.query.ICMS_SSO_USER_TOKEN) {
        API.home.tokenLogin(this.$route.query.ICMS_SSO_USER_TOKEN).then(({data}) => {
          this.$cookie.set('token', data.data.token, { expires: `${data.data.expire || 0}s` })
          this.$router.replace({ name: 'home' })
          // this.vloading = false
        }).catch((error) => {
          this.vloading = false
          this.getCaptcha()
          this.$message.error(error.msg)
        })
      } else {
        this.vloading = false
        this.getCaptcha()
      }
    },
    methods: {
      // 提交表单
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            var params = {
              'userNo': this.dataForm.userNo,
              'password': this.dataForm.password,
              'uuid': this.dataForm.uuid,
              'captcha': this.dataForm.captcha,
              'isSupp': window.SITE_CONFIG['isSupp']
            }
            API.common.login(params).then(({data}) => {
              if (data && data.code === 0) {
                this.$cookie.set('token', data.data.token, { expires: `${data.data.expire || 0}s` })
                API.menu.nav().then(({ data }) => {
                  if (data && data.code === 0) {
                    this.$router.replace({ name: getRouteNameByUrl(data.data.menuList[0].list[0].url) })
                  }
                })
              } else {
                this.getCaptcha()
                this.$message.error(data.msg)
              }
            }).catch((error) => {
              this.getCaptcha()
              this.$message.error(error.msg)
            })
          }
        })
      },
      // 获取验证码
      getCaptcha () {
        this.dataForm.uuid = getUUID()
        this.captchaPath = API.common.captcha(this.dataForm.uuid)
      }
    }
  }
</script>

<style lang="scss">
  .site-wrapper.site-page--login {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    // background-color: rgba(38, 50, 56, .6);
    overflow: hidden;
    &:before {
      position: fixed;
      top: 0;
      left: 0;
      z-index: -1;
      width: 60%;
      height: 100%;
      content: "";
      background-image: url(~@/assets/img/login_bg.png);
      background-repeat: no-repeat;
      background-size: cover;
    }
    .site-content__wrapper {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      padding: 0;
      margin: 0;
      overflow-x: hidden;
      overflow-y: auto;
      background-color: transparent;
    }
    .site-content {
      min-height: 100%;
      padding: 30px 500px 30px 30px;
    }
    .brand-info {
      margin: 50px 100px 0 90px;
      color: #fff;
    }
    .brand-info__text {
      margin:  0;
      color: #80A638;
      font-size: 50px;
      font-weight: 400;
      text-transform : uppercase;
    }
    .brand-info__intro {
      margin: 10px 0;
      color: #80A638;
      font-size: 20px;
      line-height: 1.58;
      letter-spacing: 3.5px
      // opacity: .6;
    }
    .login-main {
      position: absolute;
      top: 0;
      right: 0;
      padding: 150px 60px 0 60px;
      width: 470px;
      min-height: 100%;
      background-color: #fff;
    }
    .login-title {
      font-size: 16px;
    }
    .login-captcha {
      overflow: hidden;
      > img {
        width: 100%;
        cursor: pointer;
      }
    }
    .login-btn-submit {
      width: 100%;
      margin-top: 38px;
    }
  }
</style>
