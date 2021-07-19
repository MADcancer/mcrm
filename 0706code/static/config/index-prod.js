/**
 * 生产环境
 */
;(function () {
  window.SITE_CONFIG = {}

  // api接口请求地址
  // window.SITE_CONFIG['baseUrl'] = 'http://39.100.207.76:9999/madp-edas'
  window.SITE_CONFIG['baseUrl'] = 'http://20.15.73.115:80/ms'

  window.SITE_CONFIG['isSupp'] = '0'
  // 嵌套iframe地址
  window.SITE_CONFIG['nestIframeUrl'] = 'http://demo.renren.io/renren-fast'
  window.SITE_CONFIG['nestIframeRouteNameList'] = ['sql']

  // 静态资源文件夹名称
  window.SITE_CONFIG['staticFileName'] = ''
  // cdn地址
  window.SITE_CONFIG['cdnUrl'] = './' + window.SITE_CONFIG.staticFileName
})()
