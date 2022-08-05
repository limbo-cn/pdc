<template>
  <div>
    <q-card-section :class="{ 'title-section-dark': $q.dark.isActive, 'title-section-light': !$q.dark.isActive }">
      <div class="row items-center">
        <q-btn-dropdown flat :color="$q.dark.isActive ? 'primary' : 'positive'" :label="$t('topView')">
          <q-list>
            <q-item clickable v-close-popup @click="handleSwitch(`SideView`)">
              <q-item-section>
                <q-item-label>{{ $t('sideView') }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="handleSwitch(`FrontView`)">
              <q-item-section>
                <q-item-label>{{ $t('frontView') }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="handleSwitch(`ThreeView`)">
              <q-item-section>
                <q-item-label>{{ $t('threeView') }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-space />
        <q-checkbox :color="$q.dark.isActive ? 'primary' : 'positive'" v-show="!$q.platform.is.mobile"
          v-model="enableAngleH" :label="$t('changeAngle')" />
      </div>
    </q-card-section>
    <q-separator />
    <div class="col viewWrapper" id="topview-wrapper">
      <!-- <q-resize-observer @resize="onResize" /> -->
      <canvas id="topView" />
      <div class="tip_area">
        <p>
          <q-icon name="lens" style="color:rgb(231 231 231);margin:0 5px;font-size: 14px;" />
          <span style="font-size: 12px;">{{ $t('availableArea') }}</span>
          {{ ` ` }}
          <q-icon name="lens" style="color:rgb(255 165 129);margin:0 5px;font-size: 14px;" />
          <span style="font-size: 12px;">{{ $t('otherSide') }}</span>
        </p>
      </div>
      <div class="tool_area" v-show="!$q.platform.is.mobile">
        <q-badge class="angle-text" :text-color="$q.dark.isActive ? 'white' : 'black'" color="transparent">
          {{ $t('horizontalAngle') }} </q-badge>
        <q-slider class="slider" :disable="!enableAngleH" :color="$q.dark.isActive ? 'primary' : 'positive'"
          :label-text-color="$q.dark.isActive ? 'black' : 'white'" @input="changeAngleH" v-model="angleH" :min="-90"
          :max="90" vertical label reverse label-always :label-value="`${angleH}°`" />
        <q-btn flat round :color="$q.dark.isActive ? 'primary' : 'positive'"
          :icon="$q.dark.isActive ? `img:${iconRefresh_white}` : `img:${iconRefresh}`" @click="setDefaultH" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'

import TopView from '../../views/topView/topView'

export default {
  name: 'TopView',
  mounted() {
    const wrapperRect = document.querySelector('#topview-wrapper').getBoundingClientRect()
    this.view = new TopView('topView')
    this.view.renderCanvas(wrapperRect.width, wrapperRect.height)
  },
  data() {
    return {
      view: null,
      iconRefresh: require('../../assets/icons/icon_refresh.svg'),
      iconRefresh_white: require('../../assets/icons/icon_refresh_white.svg')
    }
  },
  computed: {
    angleH: {
      get() {
        return this.$store.state.projector.angleH
      },
      set(val) {
        this.SET_ANGLE_H(val)
      }
    },
    enableAngleH: {
      get() {
        return this.$store.state.projector.enableAngleH
      },
      set(val) {
        this.SET_ENABLE_ANGLE_H(val)
      }
    },
    isOverAngle() {
      return this.angleH > 30 || this.angleH < -30
    }
  },
  methods: {
    ...mapMutations('projector', ['SET_ANGLE_H', 'SET_ENABLE_ANGLE_H']),
    ...mapMutations('common', ['SET_FULL_SCREEN_VIEW']),
    ...mapActions('common', ['switchViews']),
    onResize() {
      if (!this.view) { return }
      const wrapperRect = document.querySelector('#topview-wrapper').getBoundingClientRect()
      this.view.renderCanvas(wrapperRect.width, wrapperRect.height)
    },
    setDefaultH(val) {
      this.angleH = 0
      this.$root.$emit('setProjectorProp')
    },
    changeAngleH() {
      this.$root.$emit('setProjectorProp')
    },
    handleSwitch(view) {
      this.switchViews({ view1: 'TopView', view2: view })
    }
  }
}
</script>
<style lang="scss" scoped>
.tool_area {
  height: 100%;
  width: 40px;
  top: 0;
  right: 0;
  display: flex;
  position: absolute;

  .angle-text {
    right: 10px;
    opacity: 0.8;
    position: absolute;
    top: 5%;
    color: black;
  }

  .slider {
    margin: auto -25px;
    opacity: 0.8;
    height: 70%;
    position: absolute;
    top: 15%;
  }

  button {
    margin: auto -25px;
    opacity: 0.8;
    position: absolute;
    top: 85%
  }
}

.tip_area {
  position: absolute;
  display: flex;
  left: 0;
  top: 0;
  height: 30px;
  p {
    margin: 0
  }
}
</style>
