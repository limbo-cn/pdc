<template>
  <div>
    <q-card-section :class="{'title-section-dark':$q.dark.isActive,'title-section-light':!$q.dark.isActive}">
      <div class="row items-center">
        <q-btn-dropdown flat :color="$q.dark.isActive?'primary':'positive'" :label="$t('frontView')">
          <q-list>
            <q-item clickable v-close-popup @click="handleSwitch(`SideView`)">
              <q-item-section>
                <q-item-label>{{$t('sideView')}}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="handleSwitch(`TopView`)">
              <q-item-section>
                <q-item-label>{{$t('topView')}}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="handleSwitch(`ThreeView`)">
              <q-item-section>
                <q-item-label>{{$t('threeView')}}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-space />
        <q-checkbox :color="$q.dark.isActive?'primary':'positive'" v-show="!$q.platform.is.mobile  && isMovableAreaEnabled" v-model="enableLenShiftH" :label="$t('changeLenShiftH')" />
        <q-checkbox :color="$q.dark.isActive?'primary':'positive'" v-show="!$q.platform.is.mobile  && isMovableAreaEnabled" v-model="enableLenShiftV" :label="$t('changeLenShiftV')" />
      </div>
    </q-card-section>
    <q-separator />
    <div class="col viewWrapper" id="frontview-wrapper">
      <!-- <q-resize-observer @resize="onResize" /> -->
      <canvas id="frontView" />
      <q-badge v-show="!$q.platform.is.mobile && isMovableAreaEnabled" class="angle-text" :class="{light:!$q.dark.isActive}" :color="$q.dark.isActive?'primary':'positive'">{{$t('lensShift')}} </q-badge>
      <q-btn v-show="!$q.platform.is.mobile && isMovableAreaEnabled" flat round :color="$q.dark.isActive?'primary':'positive'" icon="refresh" @click="setDefault" :disable="!isMovableAreaEnabled" style="position: absolute;right:0;bottom:100px;opacity: 0.8" />
      <div class="movable-area" v-show="!$q.platform.is.mobile && isMovableAreaEnabled" :style="{cursor:isMovableAreaEnabled?'pointer':'not-allowed'}" @click="changeLenShift" @mousedown="mousedownArea" @mousemove.stop="mousemoveArea">
        <q-tooltip anchor="top middle" self="top middle" :offset="[0, 50]">
          {{`${$t('horizontal')}:${lensShiftH}% ${$t('vertical')}:${lensShiftV}%`}}
        </q-tooltip>
        <div class="axis-h" :style="{ top: axisTop }"></div>
        <div class="axis-v" :style="{ left: axisLeft }"></div>
        <div class="hitPoint" :style="{ top: hitTop , left : hitLeft }"></div>
      </div>
      <div class="tip_area">
        <p>
          <q-icon name="lens" size="sm" style="color:#c0c3c0;margin:0 5px;opacity:0.5" />
          <span>{{$t('availableArea')}}</span>

          <q-icon class="rotate-90" @click="setCenter" name="vertical_align_center" size="sm" :color="$q.dark.isActive?'primary':'positive'" style="margin:0 5px 0 20px;cursor:pointer" />
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { toFixedNumber } from 'src/helper/common'
import { mapMutations, mapActions } from 'vuex'

import FrontView from '../../views/frontView/frontView'

export default {
  name: 'FrontView',
  created() {
    document.addEventListener('mouseup', this.mouseUpArea)
  },
  beforeDestroy() {
    document.removeEventListener('mouseup', this.mouseUpArea)
  },
  mounted() {
    const wrapperRect = document.querySelector('#frontview-wrapper').getBoundingClientRect()
    this.view = new FrontView('frontView')
    this.view.renderCanvas(wrapperRect.width, wrapperRect.height)
  },
  data() {
    return {
      view: null,
      dragPoint: false
    }
  },
  computed: {
    lensShiftH: {
      get() {
        return toFixedNumber(this.$store.state.lens.lensShiftH, 2)
      },
      set(val) {
        this.SET_LENS_SHIFT_H(val)
      }
    },
    lensShiftV: {
      get() {
        return toFixedNumber(this.$store.state.lens.lensShiftV, 2)
      },
      set(val) {
        this.SET_LENS_SHIFT_V(val)
      }
    },
    enableLenShiftH: {
      get() {
        return this.$store.state.lens.enableLenShiftH
      },
      set(val) {
        this.SET_ENABLE_LENS_SHIFT_H(val)
      }
    },
    enableLenShiftV: {
      get() {
        return this.$store.state.lens.enableLenShiftV
      },
      set(val) {
        this.SET_ENABLE_LENS_SHIFT_V(val)
      }
    },
    minLensShiftH() {
      return this.$store.state.lens.minLensShiftH
    },
    maxLensShiftH() {
      return this.$store.state.lens.maxLensShiftH
    },
    minLensShiftV() {
      return this.$store.state.lens.minLensShiftV
    },
    maxLensShiftV() {
      return this.$store.state.lens.maxLensShiftV
    },
    axisTop() {
      if (this.maxLensShiftV === this.minLensShiftV) {
        return `${(100 * 0.5) - 1}px`
      }
      return `${100 * (this.maxLensShiftV / (this.maxLensShiftV - this.minLensShiftV)) - 1}px`
    },
    axisLeft() {
      if (this.maxLensShiftH === this.minLensShiftH) {
        return `${(120 * 0.5) - 1}px`
      }
      return `${120 * (-this.minLensShiftH / (this.maxLensShiftH - this.minLensShiftH)) - 1}px`
    },
    hitTop() {
      if (this.maxLensShiftV === this.minLensShiftV) {
        return `${(100 * 0.5) - 7.5}px`
      }
      return `${100 * ((this.maxLensShiftV - this.lensShiftV) / (this.maxLensShiftV - this.minLensShiftV)) - 7.5}px`
    },
    hitLeft() {
      if (this.maxLensShiftV === this.minLensShiftV) {
        return `${(120 * 0.5) - 7.5}px`
      }
      return `${120 * ((this.lensShiftH - this.minLensShiftH) / (this.maxLensShiftH - this.minLensShiftH)) - 7.5}px`
    },
    isMovableAreaEnabled() {
      if (!this.enableLenShiftH && !this.enableLenShiftV) {
        return false
      }
      if (this.maxLensShiftH === this.minLensShiftH && this.maxLensShiftV === this.minLensShiftV) {
        return false
      }
      return true
    }
  },
  methods: {
    ...mapMutations('lens', ['SET_LENS_SHIFT_H', 'SET_LENS_SHIFT_V', 'SET_ENABLE_LENS_SHIFT_H', 'SET_ENABLE_LENS_SHIFT_V']),
    ...mapMutations('projector', ['SET_FROM_LEFTSIDE']),
    ...mapMutations('common', ['SET_FULL_SCREEN_VIEW']),
    ...mapActions('common', ['switchViews']),
    onResize() {
      if (!this.view) { return }
      const wrapperRect = document.querySelector('#frontview-wrapper').getBoundingClientRect()
      this.view.renderCanvas(wrapperRect.width, wrapperRect.height)
    },
    handleSwitch(view) {
      this.switchViews({ view1: 'FrontView', view2: view })
    },
    setDefault() {
      this.enableLenShiftH && (this.lensShiftH = 0)
      this.enableLenShiftV && (this.lensShiftV = 0)
      this.$root.$emit('setProjectorProp')
    },
    mousedownArea() {
      this.dragPoint = true
    },
    mouseUpArea() {
      this.dragPoint = false
    },
    mousemoveArea(e) {
      this.dragPoint && this.changeLenShift(e)
    },
    changeLenShift(e) {
      this.enableLenShiftH && (this.lensShiftH = e.offsetX / 120 * (this.maxLensShiftH - this.minLensShiftH) + this.minLensShiftH)
      this.enableLenShiftV && (this.lensShiftV = this.maxLensShiftV - e.offsetY / 100 * (this.maxLensShiftV - this.minLensShiftV))
      this.$root.$emit('setProjectorProp')
    },
    setCenter() {
      this.SET_FROM_LEFTSIDE(this.$store.state.room.width / 2)
      this.$root.$emit('setProjectorProp')
    }
  }
}
</script>
<style lang="scss" scoped>
.movable-area{
  position: absolute;
  right: 0;
  bottom: 0;
  background-color: rgba($color: #90ff86, $alpha: 0.2);
  height: 100px;
  width: 120px;
  .axis-h{
    position: absolute;
    width: 100%;
    height: 0px;
    border: 1px solid #bde2ff;
    pointer-events: none;
  }
  .axis-v{
    position: absolute;
    width: 0px;
    height: 100%;
    border: 1px solid #bde2ff;
    pointer-events: none;
  }
  .hitPoint{
    position:absolute;
    width: 15px;
    height: 15px;
    background-color: #ffe433;
    border-radius: 50%;
    pointer-events: none;
  }
}
.angle-text{
    right: 40px;
    opacity: 0.8;
    position: absolute;
    bottom: 113px;
    color: black;
}
.light{
  color: white
}
.tip_area{
  position: absolute;
  display: flex;
  left: 0;
  top: 0;
  height: 30px;
  padding: 0 10px;
  background-color:  rgba(179, 224, 167, 0.2);
  p{
    margin:auto
  }
}
</style>
