<template>
  <aside class="site-sidebar" :class="sidebarClasses">
    <div class="site-sidebar__inner">
      <el-menu
        :default-active="menuNavActiveName"
        :collapse="$store.state.sidebarCollapse"
        :collapseTransition="false"
        class="site-sidebar__menu"
      >
        <el-submenu
          v-for="menuNav in $store.state.menuNavList"
          :key="menuNav.menuId"
          :data-idx="menuNav.menuId + ''"
          :index="menuNav.menuId + ''"
        >
          <template slot="title">
            <icon-svg
              :name="menuNav.icon"
              class="site-sidebar__menu-icon"
            ></icon-svg>
            <span>{{ menuNav.name }}</span>
          </template>
          <el-menu-item
            v-for="item in menuNav.list"
            :key="item.menuId"
            :index="item.parentId + '-' + item.menuId"
            :data-idx="item.menuId + ''"
            @click="gotoRouteHandle(item.url)"
          >
            <icon-svg
              :name="item.icon"
              class="site-sidebar__menu-icon"
            ></icon-svg>
            <span>{{ item.name }}</span>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
  </aside>
</template>

<script>
import SubMenuNav from '@/components/sub-menu-nav'
import API from '@/api'
import { mapMutations } from 'vuex'
import { getRouteNameByUrl } from '@/utils'
import isEmpty from 'lodash/isEmpty'
export default {
  components: {
    SubMenuNav,
  },
  computed: {
    menuNavActiveName: {
      get() {
        let name = this.$store.state.menuNavActiveName
        return /\S/.test(name) ? name : '32-37'
      },
      set(name) {
        this.UPDATE_MENU_NAV_ACTIVE_NAME({ name })
      },
    },
    sidebarClasses() {
      let skin = this.$store.state.sidebarLayoutSkin
      return [
        !/\S/.test(skin) || skin === 'light' ? '' : `site-sidebar--${skin}`,
      ]
    },
  },
  watch: {
    $route: 'routeHandle',
  },
  created() {
    this.getMenuNavList().then(() => {
      this.routeHandle(this.$route)
    })
  },
  methods: {
    // 获取菜单导航列表 / 权限
    getMenuNavList() {
      return API.menu.nav().then(({ data }) => {
        if (data && data.code === 0) {
          this.UPDATE_MENU_NAV_LIST(data.data.menuList)
          sessionStorage.setItem(
            'permissions',
            JSON.stringify(data.data.permissions || '[]')
          )
        } else {
          this.UPDATE_MENU_NAV_LIST([])
          sessionStorage.setItem('permissions', '[]')
        }
      })
    },
    // 路由操作
    routeHandle(route) {
      if (route.meta && route.meta.isTab) {
        var tab = this.$store.state.contentTabs.filter(
          (item) => item.name === route.name
        )[0]
        // tab不存在, 先添加
        if (isEmpty(tab)) {
          var menuNav = this.getMenuNavByRouteName(
            route.name,
            this.$store.state.menuNavList
          )
          if (!isEmpty(menuNav)) {
            tab = {
              id: menuNav.menuId,
              name: route.name,
              title: menuNav.name,
              type:
                (window.SITE_CONFIG.nestIframeRouteNameList || []).indexOf(
                  route.name
                ) !== -1
                  ? 'iframe'
                  : 'module',
              url: menuNav.url,
            }
            this.ADD_CONTENT_TAB(tab)
          } else {
            return console.error('未能找到可用tab标签页！')
          }
        }
        this.menuNavActiveName = tab.id + '-' + tab.menuId
        this.UPDATE_CONTENT_TABS_ACTIVE_NAME({ name: route.name })
      }
    },
    // 跳转到菜单导航对应路由
    gotoRouteHandle(url) {
      var routeName = getRouteNameByUrl(url)
      if (/\S/.test(routeName)) {
        this.$router.push({ name: routeName })
      }
    },
    // 获取菜单导航, 根据路由名称
    getMenuNavByRouteName(name, menuNavList) {
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
      'UPDATE_MENU_NAV_LIST',
      'UPDATE_MENU_NAV_ACTIVE_NAME',
      'ADD_CONTENT_TAB',
      'UPDATE_CONTENT_TABS_ACTIVE_NAME',
    ]),
  },
}
</script>
