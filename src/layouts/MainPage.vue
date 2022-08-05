<template>
  <q-page-container>
    <q-page :style-fn="stylePage">
      <div class="card-wrapper row fit">
        <q-resize-observer @resize="onResize" />
        <q-card :class="`view-card view-card-${layoutModel}`" bordered v-for="item in views" :key="item">
          <keep-alive>
            <component :is="item" :ref="item" @resize="onResize"></component>
          </keep-alive>
        </q-card>
      </div>
      <div class="absolute" style="top: 50%; left: 0px">
        <q-btn dense size="sm" round :color="$q.dark.isActive ? 'secondary' : 'positive'" icon="arrow_right"
          @click="leftDrawerOpen = true" v-show="!leftDrawerOpen" />
      </div>
      <q-page-sticky position="right" :offset="[10, 0]" v-show="$q.platform.is.mobile">
        <q-btn @click="scrollUp" round color="secondary" icon="arrow_back" class="rotate-90 q-ma-xs q-mb-lg" />
        <br />
        <q-btn @click="scrollDown" round color="secondary" icon="arrow_forward" class="rotate-90 q-ma-xs q-mt-lg" />
      </q-page-sticky>
    </q-page>
  </q-page-container>
</template>

<script>
import bus from '../helper/bus'
import { mapMutations } from 'vuex'
import { scroll } from 'quasar'

import SideView from './Views/SideView'
import FrontView from './Views/FrontView'
import TopView from './Views/TopView'
import ThreeView from './Views/ThreeView'

const { getScrollTarget, setScrollPosition, getScrollPosition } = scroll

export default {
  name: 'MainPage',
  components: {
    SideView,
    FrontView,
    TopView,
    ThreeView
  },
  created() {
    this.$root.$on('resizeRoom', this.resizeRoom)
    this.$root.$on('setTheme', this.setTheme)
    this.$root.$on('setProjectorProp', this.setProjectorProp)
    bus.$on('setProjectorProp', this.setProjectorProp)
    this.$root.$on('setEnableThreeControl', this.setEnableThreeControl)
    this.$root.$on('generatePDF', this.generatePDF)
    window.addEventListener('keydown', this.keyPress)
  },
  beforeDestroy() {
    this.$root.$off('resizeRoom', this.resizeRoom)
    this.$root.$off('setTheme', this.setTheme)
    this.$root.$off('setProjectorProp', this.setProjectorProp)
    bus.$off('setProjectorProp', this.setProjectorProp)
    this.$root.$off('setEnableThreeControl', this.setEnableThreeControl)
    this.$root.$on('generatePDF', this.generatePDF)
    window.removeEventListener('keydown', this.keyPress)
  },
  data() {
    return {
    }
  },
  computed: {
    views() {
      return this.$store.state.common.views
    },
    layoutModel() {
      return this.$store.state.common.layoutModel
    },
    leftDrawerOpen: {
      get() {
        return this.$store.state.common.leftDrawerOpen
      },
      set(val) {
        this.SET_LEFT_DRAWER_OPEN(val)
      }
    }
  },
  watch: {
    layoutModel() {
      this.onResize()
    }
  },
  methods: {
    ...mapMutations('pdf', ['SET_SIDEVIEW_IMAGE', 'SET_FRONTVIEW_IMAGE', 'SET_TOPVIEW_IMAGE', 'SET_THREEVIEW_IMAGE']),
    ...mapMutations('common', ['SET_LEFT_DRAWER_OPEN']),
    stylePage(offset, height) {
      return { height: `${height - offset}px` }
    },
    onResize() {
      this.$nextTick(() => {
        const height = Array.prototype.find.call(document.querySelectorAll('.view-card'), dom => dom.clientHeight > 0).clientHeight
        document.querySelectorAll('.viewWrapper').forEach(dom => {
          dom.style.height = `${height - 50}px`
        })
        this.$refs.TopView[0].onResize()
        this.$refs.FrontView[0].onResize()
        this.$refs.SideView[0].onResize()
        this.$refs.ThreeView[0].onResize()
      })
    },
    resizeRoom() {
      this.$refs.ThreeView[0].view.resizeRoom()
      this.$refs.TopView[0].view.renderCanvas()
      this.$refs.FrontView[0].view.renderCanvas()
      this.$refs.SideView[0].view.renderCanvas()
      this.setProjectorProp()
    },
    setTheme() {
      this.$refs.ThreeView[0].view.setTheme()
    },
    setProjectorProp() {
      // var a = new Date().getTime()
      this.$refs.ThreeView[0].view.setProjectorProp()
      // console.log(new Date().getTime() - a)
      this.$refs.SideView[0].view.setProjectorProp()
      this.$refs.FrontView[0].view.setProjectorProp()
      this.$refs.TopView[0].view.setProjectorProp()
    },
    setEnableThreeControl(val) {
      this.$refs.ThreeView[0].view.setEnableTransformControl(val)
    },
    generatePDF() {
      this.SET_SIDEVIEW_IMAGE(this.$refs.SideView[0].view.getDataUrl())
      this.SET_FRONTVIEW_IMAGE(this.$refs.FrontView[0].view.getDataUrl())
      this.SET_TOPVIEW_IMAGE(this.$refs.TopView[0].view.getDataUrl())
      this.SET_THREEVIEW_IMAGE(this.$refs.ThreeView[0].view.getDataUrl())
    },
    keyPress(e) {
      if (e.code === 'ArrowUp') {
        e.preventDefault()
        this.$root.$emit('arrowUp')
      } else if (e.code === 'ArrowDown') {
        e.preventDefault()
        this.$root.$emit('arrowDown')
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault()
        this.$root.$emit('arrowLeft')
      } else if (e.code === 'ArrowRight') {
        e.preventDefault()
        this.$root.$emit('arrowRight')
      }
    },
    scrollUp() {
      const el = document.querySelector('.q-page')
      const target = getScrollTarget(el)
      const position = getScrollPosition(target)
      setScrollPosition(target, position - 350, 100)
    },
    scrollDown() {
      const el = document.querySelector('.q-page')
      const target = getScrollTarget(el)
      const position = getScrollPosition(target)
      setScrollPosition(target, position + 350, 100)
    }
  }
}
</script>
<style lang="scss" scoped>
.card-wrapper {
  min-height: 800px;
  padding-bottom: 30px;

  @media screen and (min-width: 800px) {
    min-width: 1000px;
  }
}

.view-card {
  margin: 5px;
}

.view-card-fullscreen {
  width: 100%;
  height: 100%;
}

.view-card-grid {
  width: calc(50% - 10px);
  height: calc(50% - 10px);

  @media screen and (max-width: 800px) {
    width: calc(100% - 10px);
  }
}

.view-card-list {
  width: calc(100% - 10px);
  height: calc(50% - 10px);
}

.view-card-fullscreen {
  width: calc(100% - 10px);
  height: calc(100% - 10px);
}
</style>
<style>
.viewWrapper {
  position: relative;
  width: 100%;
  height: 340px;
}

.title-section-dark {
  padding: 2px 16px;
  background-color: #445a4d;
}

.title-section-light {
  padding: 2px 16px;
  background-color: #f2f2f2;
}

.delta-gradient-bg {
  background-image: url('../assets/gradient.svg');
  background-size: cover;
}

.delta-gradient-bg-2 {
  background-image: url('../assets/gradient_2.svg');
  background-size: cover;
}

</style>
