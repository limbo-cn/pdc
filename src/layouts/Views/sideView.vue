<template>
  <div>
    <q-card-section :class="{'title-section-dark':$q.dark.isActive,'title-section-light':!$q.dark.isActive}">
      <div class="row items-center">
        <q-btn-dropdown flat :color="$q.dark.isActive?'primary':'positive'" :label="$t('sideView')">
          <q-list>
            <q-item clickable v-close-popup @click="handleSwitch(`FrontView`)">
              <q-item-section>
                <q-item-label>{{$t('frontView')}}</q-item-label>
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
        <q-checkbox :color="$q.dark.isActive?'primary':'positive'" v-show="!$q.platform.is.mobile" v-model="enableAngleV" :label="$t('changeAngle')" />
      </div>
    </q-card-section>
    <q-separator />
    <div class="col viewWrapper" id="sideview-wrapper">
      <!-- <q-resize-observer @resize="onResize" /> -->
      <canvas id="sideView" />
      <div class="tip_area">
        <p>
          <q-icon name="lens" size="sm" style="color:#c0c3c0;margin:0 5px;opacity:0.5" />
          <span>{{$t('availableArea')}}</span>
          {{` `}}
          <q-icon name="lens" size="sm" style="color:#fa846f;margin:0 5px" />
          <span>{{$t('otherSide')}}</span>
        </p>
      </div>
      <div class="tool_area" v-show="!$q.platform.is.mobile">
        <q-badge class="angle-text" :class="{light:!$q.dark.isActive}" :color="$q.dark.isActive?'primary':'positive'">{{$t('verticalAngle')}} </q-badge>
        <q-slider class="slider" :color="$q.dark.isActive?'primary':'positive'" :disable="!enableAngleV" :label-text-color="$q.dark.isActive?'black':'white'" @input="changeAngleV" v-model="angleV" :min="-90" :max="90" vertical label reverse label-always :label-value="`${angleV}°`" />
        <q-btn :disable="!enableAngleV" flat round :color="$q.dark.isActive?'primary':'positive'" icon="refresh" @click="setDefaultV" />
      </div>
      <div class="alert_area" v-show="isOverAngle">
        <q-icon name="warning" size="xs" style="margin-left: 5px;" />
        <p>
          {{$t('alertMessage')}}
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
      view: null
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
.tool_area{
  height: 100%;
  width: 40px;
  top: 0;
  right: 0;
  display: flex;
  position: absolute;
  .angle-text{
    right: 10px;
    opacity: 0.8;
    position: absolute;
    top: 5%;
    color: black;
  }
  .light{
    color: white
  }
  .slider{
    margin: auto -25px;
    opacity: 0.8;
    height: 70%;
    position: absolute;
    top: 15%;
  }
  button{
    margin: auto -25px;
    opacity: 0.8;
    position: absolute;
    top: 85%
  }
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
.alert_area{
    position: absolute;
    display: flex;
    left: 0;
    bottom: 0;
    color:#ff8c8c;
    p{
      margin: 0 5px;
    }
}
</style>
