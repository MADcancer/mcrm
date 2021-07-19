<template>
  <div>
    <nav class="site-navbar" :class="navbarClasses">
      <div class="site-navbar__header">
        <div class="site-navbar-left">
          <h1 class="site-navbar__brand" @click="$router.push({ name: 'home' })">
            <a class="site-navbar__brand-lg" href="javascript:;"
              >苏州银行积分权益平台</a
            >
            <a class="site-navbar__brand-mini" href="javascript:;">Madp</a>
          </h1>
          <!-- <el-menu
            :default-active="activeIndex"
            class="el-menu-demo"
            mode="horizontal"
            background-color="#5C8A06"
            text-color="#fff"
            active-text-color="#333333"
            style="display:flex"
            @select="handleSelect"
          >
            <el-menu-item
              v-for="parent in $store.state.menuNavList"
              :key="parent.menuId"
              :index="'' + parent.menuId"
              >{{ parent.name }}</el-menu-item
            >
          </el-menu> -->
        </div>
        <div class="user">
          <span>欢迎您</span>
          <span class="el-dropdown-link">
              {{$store.state.user.roleName}}
          </span>
          <el-dropdown>
            <span class="el-dropdown-link">
              {{$store.state.user.name}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="updatePasswordHandle()">修改密码</el-dropdown-item>
              <el-dropdown-item @click.native="logoutHandle()">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </nav>
    <!-- <nav class="sub-navbar" v-if="$store.state.subMenuNavList && $store.state.subMenuNavList.length > 0">
      <el-menu
        :default-active="subActiveIndex"
        class="el-menu-demo"
        mode="horizontal"
        background-color="#80A639"
        text-color="#fff"
        active-text-color="#fff"
        style="border-bottom: none"
      >
        <el-menu-item
          v-for="menu in $store.state.subMenuNavList"
          :key="menu.menuId"
          :index="menu.menuId + ''"
          @click="gotoRoute(menu.url)"
          >{{ menu.name }}</el-menu-item
        >
      </el-menu>
    </nav> -->
    <!-- 弹窗, 修改密码 -->
    <update-password
      v-if="updatePassowrdVisible"
      ref="updatePassowrd"
    ></update-password>
  </div>
</template>

<script>
import UpdatePassword from './update-password'
import API from '@/api'
import { mapMutations } from 'vuex'
import { getRouteNameByUrl } from '@/utils'
import isEmpty from 'lodash/isEmpty'
export default {
  data() {
    return {
      updatePassowrdVisible: false,
      activeIndex: '',
      subActiveIndex: '',
      menuNavList: this.$store.state.menuNavList,
      role: {
        1003: '财富积分管理员',
        1004: '财富积分业务员',
        2003: '直销积分管理员',
        2004: '直销积分业务员',
        3003: '信用卡积分管理员',
        3004: '信用卡积分业务员'
      }
    }
  },
  components: {
    UpdatePassword
  },
  computed: {
    navbarClasses() {
      let type = this.$store.state.navbarLayoutType
      return [
        !/\S/.test(type) || type === 'default' ? '' : `site-navbar--${type}`
      ]
    }
  },
  watch: {
    $route: 'gotoRouteHandle'
  },
  methods: {
    // 切换侧边栏, 水平折叠收起状态
    switchSidebarCollapseHandle() {
      this.SWITCH_SIDEBAR_COLLAPSE({
        collapse: !this.$store.state.sidebarCollapse
      })
    },
    // 修改密码
    updatePasswordHandle() {
      this.updatePassowrdVisible = true
      this.$nextTick(() => {
        this.$refs.updatePassowrd.init()
      })
    },
    // 退出
    logoutHandle() {
      this.$confirm(`确定进行[退出]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          API.common.logout().then(({ data }) => {
            if (data && data.code === 0) {
              this.DELETE_CONTENT_TABS()
              this.$cookie.delete('token')
              this.$router.replace({ name: 'login' })
            }
          })
        })
        .catch(() => {})
    },
    // 跳转
    gotoRoute(url) {
      this.$router.push({name: getRouteNameByUrl(url)})
      // console.log(this.$store.state.subMenuNavList)
    },
    // 获取菜单导航列表 / 权限
    getMenuNavList() {
      API.menu.nav().then(({ data }) => {
        if (data && data.code === 0) {
          this.UPDATE_MENU_NAV_LIST(data.data.menuList)
          this.activeIndex = data.data.menuList[0].menuId.toString()
          sessionStorage.setItem(
            'permissions',
            JSON.stringify(data.data.permissions || '[]')
          )
          this.gotoRouteHandle(this.$route)
        } else {
          this.UPDATE_MENU_NAV_LIST([])
          sessionStorage.setItem('permissions', '[]')
        }
      })
    },
    handleSelect(key) {
      this.subActiveIndex = ''
      this.$store.state.menuNavList.map(menu => {
        if (key === String(menu.menuId)) {
          let subMenu = menu.list
          this.UPDATE_SUB_MENU_NAV_LIST(subMenu)
          if (subMenu.length > 0) {
            if (isEmpty(this.$store.state.contentTabs)) {
              this.SET_CONTENT_LAYOUT_PADDING({ top: '100px' })
            } else {
              this.SET_CONTENT_LAYOUT_PADDING({ top: '150px' })
            }
          } else {
            // 直接跳转
            this.$router.push(menu.url)
            if (isEmpty(this.$store.state.contentTabs)) {
              this.SET_CONTENT_LAYOUT_PADDING({ top: '50px' })
            } else {
              this.SET_CONTENT_LAYOUT_PADDING({ top: '100px' })
            }
          }
        }
      })
    },
    // 路由操作
    gotoRouteHandle(route) {
      if (route.meta && route.meta.isTab) {
        var tab = this.$store.state.contentTabs.filter(
          item => item.name === route.name
        )[0]
        // tab不存在, 先添加
        if (isEmpty(tab)) {
          var menuNav = this.getMenuNavByRouteName(
            route.name,
            this.$store.state.menuNavList
          )
          if (!isEmpty(menuNav)) {
            tab = {
              id: menuNav.parentId,
              menuId: menuNav.menuId,
              name: route.name,
              title: menuNav.name,
              type:
                (window.SITE_CONFIG.nestIframeRouteNameList || []).indexOf(
                  route.name
                ) !== -1
                  ? 'iframe'
                  : 'module',
              url: menuNav.url
            }
            this.ADD_CONTENT_TAB(tab)
          } else {
            return console.error('未能找到可用tab标签页！')
          }
        }
        this.activeIndex = tab.id + ''
        // 选择二级菜单
        this.handleSelect(this.activeIndex)
        this.subActiveIndex = tab.menuId + ''
        this.UPDATE_CONTENT_TABS_ACTIVE_NAME({ name: route.name })
      }
    },
    // 获取菜单导航, 根据路由名称
    getMenuNavByRouteName (name, menuNavList) {
      var temp = []
      for (var i = 0; i < menuNavList.length; i++) {
        if (menuNavList[i].list && menuNavList[i].list.length >= 1) {
          temp = temp.concat(menuNavList[i].list)
        } else if (getRouteNameByUrl(menuNavList[i].url) === name) {
          return menuNavList[i]
        }
      }
      return temp.length >= 1 ? this.getMenuNavByRouteName(name, temp) : []
    },
    ...mapMutations([
      'SWITCH_SIDEBAR_COLLAPSE',
      'DELETE_CONTENT_TABS',
      'SET_CONTENT_LAYOUT_PADDING',
      'ADD_CONTENT_TAB',
      'UPDATE_CONTENT_TABS_ACTIVE_NAME',
      'UPDATE_SUB_MENU_NAV_LIST',
      'UPDATE_MENU_NAV_LIST'
    ])
  },
  created() {
    this.getMenuNavList()
  }
}
</script>
<style lang="scss" scoped>
.site-navbar__header {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.site-navbar-left {
  display: flex;
  flex: 1;
}
.user {
  display: flex;
  align-items: center;
  color: #ffffff;
  span {
    color: #ffffff;
    padding-right: 10px;
    &:hover {
      cursor: pointer;
    }
  }
}
.site-navbar {
  /deep/ .is-active {
    background-color: #ffffff !important;
    border-bottom-color: transparent;
  }
}
/deep/ .el-menu-item,
/deep/ .el-submenu {
  height: 52px;
  display: flex;
  align-items: center;
  // font-size: 16px;
}
.sub-navbar {
  position: fixed;
  top: 50px;
  right: 0;
  left: 0;
  z-index: 1030;
  height: 50px;
  /deep/ .is-active {
    background-color: #80a639 !important;
    border-bottom-color: transparent;
  }
  /deep/ .el-menu-item:nth-child(1) {
    margin-left: 10px;
  }
  /deep/ .el-menu-item {
    // border-bottom: none;
  }
}
</style>
