import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import VueLogger from 'vuejs-logger'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'
import './plugins/element.js'

// setup logging
const isProduction = process.env.NODE_ENV === 'production'
const options = {
  isEnabled: true,
  logLevel: isProduction ? 'error' : 'debug',
  stringifyArguments: false,
  showLogLevel: true,
  showMethodName: true,
  separator: '|',
  showConsoleColors: true
}
Vue.use(VueLogger, options)

// automatic global registration of components
const requireComponent = require.context('./components', false, /Base[A-Z]\w+\.(vue|js)$/)
requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName)
  const componentName = upperFirst(camelCase(fileName.replace(/^\.\/(.*)\.\w+$/, '$1')))
  Vue.component(componentName, componentConfig.default || componentConfig)
})
Vue.$log.debug('Registered global components: ', requireComponent.keys())

if (!isProduction) {
  Vue.config.productionTip = false
  Vue.config.devtools = true
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
