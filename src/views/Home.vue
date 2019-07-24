<template>
  <div>
    <Workspace />
  </div>
</template>

<script>
import Vue from 'vue'

import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
Vue.use(Buefy)

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

import Workspace from '@/components/Workspace.vue'

export default {
  name: 'home',
  components: {
    Workspace
  }
}
</script>

<style></style>
