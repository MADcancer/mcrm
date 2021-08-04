<template>
  <div
    class="site-wrapper"
    :class="siteWarpperClasses"
    v-loading.fullscreen.lock="loading"
    element-loading-text="拼命加载中">
    <template v-if="!loading">
      <navbar />
      <sidebar />
      <div class="site-content__wrapper" :style="siteContentWarpperStyles">
        <main class="site-content" :class="{ 'site-content--tabs': routeIsTab }">
          <el-card v-if="!routeIsTab" :body-style="contentViewStyles">
            <keep-alive>
              <router-view></router-view>
            </keep-alive>
          </el-card>
          <!-- tab标签页, 内容展示方式 -->
          <content-tabs v-else></content-tabs>
        </main>
      </div>
    </template>
  </div>
</template>

<script>
import Navbar from './navbar'
import Sidebar from './sidebar'
import ContentTabs from './content-tabs'
import API from '@/api'
import { mapMutations } from 'vuex'
export default {
  data() {
    return {
      loading: true
    }
  },
  components: {
    Navbar,
    Sidebar,
    ContentTabs
  },
  computed: {
    contentPadding() {
      return this
    },
    siteWarpperClasses() {
      return [
        { 'site-sidebar--collapse': this.$store.state.sidebarCollapse }
      ]
    },
    siteContentWarpperStyles() {
      return [
        {
          'minHeight': this.$store.state.documentClientHeight + 'px',
          'marginLeft': '230px'
        }
      ]
    },
    routeIsTab() {
      return this.$route.meta && this.$route.meta.isTab
    },
    contentViewStyles() {
      var height = this.$store.state.documentClientHeight
      height -= 50 // site-topbar
      height -= 2  // el-card border-top border-bottom
      height += 'px'
      return [
        { height }
      ]
    }
  },
  created() {
    this.getUserInfo()
    this.init()
  },
  mounted() {
    this.resetDocumentClientHeight()
    window.onresize = () => {
      this.resetDocumentClientHeight()
    }
  },
  methods: {
    // 挂载下拉框数据
    init: function () {
      var that = this
      API.common.getAllDictItem().then(res => {
        var channelData = res.data.data['积分渠道']
        channelData.unshift({
          value: '',
          label: '请选择'
        })
        var itemObj = {}
        res.data.data['积分渠道'].map(item => {
          itemObj[item.value] = item.label
        })
        that.$root.selectOption = {
          channel: channelData,
          channelObj: itemObj,
          condition: res.data.data['condition'],
          certYcDistrict: res.data.data['cert_yc_district'],
          certYcCity: res.data.data['cert_yc_city'],
          conSys: res.data.data['conSys'],
          pointsType: res.data.data['pointsType'],
          dbsPointsSubType: res.data.data['dbsPointsSubType'],
          nbsPointsSubType: res.data.data['nbsPointsSubType'],
          dbsFinacProdCode: res.data.data['dbsFinacProdCode'],
          pointsSubType: res.data.data['pointsSubType'],
          tdtsmst: res.data.data['tdtsmst'],
          jobType: res.data.data['jobType'],
          actType: res.data.data['actType']
        }
      }).catch(res => {
        this.$message.error(res.message)
      })
    },
    // 重置窗口可视高度
    resetDocumentClientHeight() {
      this.UPDATE_DOCUMENT_CLIENT_HEIGHT({ height: document.documentElement['clientHeight'] })
    },
    // 获取当前管理员信息
    getUserInfo() {
      API.user.info().then(({ data }) => {
        if (data && data.code === 0) {
          this.loading = false
          this.DELETE_CONTENT_TABS()
          this.UPDATE_USER_ID({ id: data.data.userId })
          this.UPDATE_USER_NAME({ name: data.data.username })
          this.UPDATE_USER_ROLE_ID({ roleId: data.data.roleIdList && data.data.roleIdList[0] })
          this.UPDATE_USER_ROLE_NAME({ roleName: data.data.roleName })
          this.UPDATE_USER_CHANNEL({ channel: data.data.channel })
        }
      })
    },
    ...mapMutations(['UPDATE_DOCUMENT_CLIENT_HEIGHT', 'UPDATE_USER_ID', 'UPDATE_USER_NAME', 'UPDATE_USER_ROLE_ID', 'UPDATE_USER_ROLE_NAME', 'UPDATE_USER_CHANNEL', 'DELETE_CONTENT_TABS'])
  }
}
</script>
