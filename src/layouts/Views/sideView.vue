<template>
  <div>
    <q-card-section :class="{ 'title-section-dark': $q.dark.isActive, 'title-section-light': !$q.dark.isActive }">
      <div class="row items-center">
        <q-btn-dropdown flat :color="$q.dark.isActive ? 'primary' : 'positive'" :label="$t('sideView')">
          <q-list>
            <q-item clickable v-close-popup @click="handleSwitch(`FrontView`)">
              <q-item-section>
                <q-item-label>{{ $t('frontView') }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="handleSwitch(`TopView`)">
              <q-item-section>
                <q-item-label>{{ $t('topView') }}</q-item-label>
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
          v-model="enableAngleV" :label="$t('changeAngle')" />
      </div>
    </q-card-section>
    <q-separator />
    <div class="col viewWrapper" id="sideview-wrapper">
      <!-- <q-resize-observer @resize="onResize" /> -->
      <canvas id="sideView" />
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
          {{ $t('verticalAngle') }} </q-badge>
        <q-slider class="slider" :color="$q.dark.isActive ? 'primary' : 'positive'" :disable="!enableAngleV"
          :label-text-color="$q.dark.isActive ? 'black' : 'white'" @input="changeAngleV" v-model="angleV" :min="-90"
          :max="90" vertical label reverse label-always :label-value="`${angleV}°`" />
        <q-btn :disable="!enableAngleV" flat round
          :icon="$q.dark.isActive ? `img:${iconRefresh_white}` : `img:${iconRefresh}`" @click="setDefaultV" />
      </div>
      <div class="alert_area" v-show="isOverAngle">
        <q-icon name="warning" size="xs" style="margin-left: 5px;" />
        <p>
          {{ $t('alertMessage') }}
        </p>
      </div>
    </div>

  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'

import SideView from '../../views/sideView/sideView'

export default {
  name: 'SideView',
  mounted() {
    const wrapperRect = document.querySelector('#sideview-wrapper').getBoundingClientRect()
    this.view = new SideView('sideView')
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
    angleV: {
      get() {
        return this.$store.state.projector.angleV
      },
      set(val) {
        this.SET_ANGLE_V(val)
      }
    },
    enableAngleV: {
      get() {
        return this.$store.state.projector.enableAngleV
      },
      set(val) {
        this.SET_ENABLE_ANGLE_V(val)
      }
    },
    isOverAngle() {
      return this.angleV > 30 || this.angleV < -30
    }
  },
  methods: {
    ...mapMutations('projector', ['SET_ANGLE_V', 'SET_ENABLE_ANGLE_V']),
    ...mapMutations('common', ['SET_FULL_SCREEN_VIEW']),
    ...mapActions('common', ['switchViews']),
    onResize() {
      if (!this.view) { return }
      const wrapperRect = document.querySelector('#sideview-wrapper').getBoundingClientRect()
      this.view.renderCanvas(wrapperRect.width, wrapperRect.height)
    },
    setDefaultV() {
      this.angleV = 0
      this.$root.$emit('setProjectorProp')
    },
    changeAngleV() {
      this.$root.$emit('setProjectorProp')
    },
    handleSwitch(view) {
      this.switchViews({ view1: 'SideView', view2: view })
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

.alert_area {
  position: absolute;
  display: flex;
  left: 0;
  bottom: 0;
  color: #ff8c8c;

  p {
    margin: 0 5px;
  }
}
</style>
