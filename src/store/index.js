import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import dataSource from './modules/dataSource'
import common from './modules/common'
import room from './modules/room'
import screen from './modules/screen'
import projector from './modules/projector'
import lens from './modules/lens'
import coordinate from './modules/coordinate'
import ambient from './modules/ambient'
import pdf from './modules/pdf'
import history from './modules/history'

Vue.use(Vuex)

const historyState = createPersistedState({
  paths: ['history']
})

const Store = new Vuex.Store({
  modules: {
    dataSource,
    common,
    room,
    screen,
    projector,
    lens,
    coordinate,
    ambient,
    pdf,
    history
  },

  plugins: [historyState],
  // enable strict mode (adds overhead!)
  // for dev mode only
  strict: process.env.DEBUGGING
})

export default Store
