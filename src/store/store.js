import Vue from 'vue'
import Vuex from 'vuex'
import * as data from '@/store/modules/data.js'
import * as interaction from '@/store/modules/interaction.js'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: { data, interaction }
})
