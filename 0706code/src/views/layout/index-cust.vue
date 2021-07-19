<template>
  <div
    class="site-wrapper"
    :class="siteWarpperClasses"
    v-loading.fullscreen.lock="loading"
    element-loading-text="拼命加载中"
  >
    <template v-if="!loading">
      <div class="site-content__wrapper" :style="siteContentWarpperStyles">
        <main class="site-content">
           <keep-alive>
              <router-view></router-view>
            </keep-alive>
        </main>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: true
    }
  },
  components: {
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
          'paddingTop': this.$store.state.contentPaddingTop
        }
      ]
    }
  },
  created() {
  },
  mounted() {
    this.loading = false
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
.site-content__wrapper {
  padding: 50px;
}
</style>
