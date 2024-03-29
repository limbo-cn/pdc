<template>
  <q-card>
    <q-card-section style="padding:6px">
      <div class="q-gutter-sm row">
        <q-select dense :color="$q.dark.isActive?'primary':'positive'" v-model="application" @input="changeApplication"
          :options="applicationOptions" option-value="value" option-label="label" emit-value map-options
          style="width: 90% " behavior="menu">
          <template v-slot:prepend>
            <div class="text-subtitle2">
              {{$t('application')}}:
            </div>
          </template>
        </q-select>

        <q-input dense :color="$q.dark.isActive?'primary':'positive'" v-model="roomBrightness"
          :title="`${roomBrightness}lx`" type="number" step="1.000" :suffix="`lx`" style="width: 50%">
          <template v-slot:prepend>
            <div class="text-subtitle2">
              {{$t('roomBrightness')}}:
            </div>
          </template>
        </q-input>

        <q-input dense :color="$q.dark.isActive?'primary':'positive'" v-model="screenGain" :title="screenGain"
          type="number" step="0.01" style="width: 40%">
          <template v-slot:prepend>
            <div class="text-subtitle2">
              {{$t('screenGain')}}:
            </div>
          </template>
        </q-input>
        <div class="text-body2" :class="{'text-grey-4':$q.dark.isActive,'text-grey-8':!$q.dark.isActive}">
          {{$t('brightnessOnScreen')}} (nit): {{toFixedNumber(brightnessOnScreenNit,0)}}<br />
          {{$t('brightnessOnScreen')}} (lx): {{toFixedNumber(brightnessOnScreenLx,0)}}<br />
          <!-- {{$t('actualContrast')}}: {{toFixedNumber(actualContrast,2)}}:1 -->
        </div>
      </div>

      <div class="row q-pt-sm q-pl-sm q-pr-sm row q-gutter-md"
        :style="{visibility:isFloatingAmbient?'hidden':'visible'}">
        <div class="col" style="margin:15px 5px;position: relative">
          <div class="q-pa-sm text-h6" style="position:absolute;top:0;left:0;color:white">
            {{ambientLabel}}
          </div>
          <div class="q-pa-xs" style="position:absolute;top:0;right:0;">
            <q-btn round flat color="white" icon="call_made" @click="clickFloating" />
          </div>
          <img src="../../assets/projection_best.jpg" v-show="arrowTop>80"
            style="background-size:contain;width:100%;height:100%" usemap="#projectionMap" />
          <img src="../../assets/projection_good.jpg" v-show="arrowTop>=60 && arrowTop<80"
            style="background-size:contain;width:100%;height:100%" usemap="#projectionMap" />
          <img src="../../assets/projection_enough.jpg" v-show="arrowTop>=40 && arrowTop<60"
            style="background-size:contain;width:100%;height:100%" usemap="#projectionMap" />
          <img src="../../assets/projection_limit.jpg" v-show="arrowTop>=20 && arrowTop<40"
            style="background-size:contain;width:100%;height:100%" usemap="#projectionMap" />
          <img src="../../assets/projection_low.jpg" v-show="arrowTop>=0  && arrowTop< 20"
            style="background-size:contain;width:100%;height:100%" usemap="#projectionMap" />
          <div class="row" style="height: 10px;position: absolute;top: 100%;width: 100%;">
            <div class="col" style="height:100%;background-color:rgb(32, 56, 100)" />
            <div class="col" style="height:100%;background-color:rgb(47, 85, 151)" />
            <div class="col" style="height:100%;background-color:rgb(143, 170, 220)" />
            <div class="col" style="height:100%;background-color:rgb(180, 199, 231)" />
            <div class="col" style="height:100%;background-color:rgb(218, 227, 243)" />
            <div style="position: absolute;height: 100%;background:#1bff61;width: 6px;" :style="{left:`${arrowTop}%`}">
              <div style="color:#1bff61;position: absolute;top: -20px;left: -3px;">⏷</div>
            </div>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { toFixedNumber } from 'src/helper/common'
import { mapMutations } from 'vuex'

export default {
  name: 'LeftSide-Ambient',
  props: ['isFloatingAmbient'],
  data() {
    return {
      application: 0,
      toFixedNumber: toFixedNumber
    }
  },
  computed: {
    applicationOptions() {
      return [
        { label: this.$t('theatre'), value: 4, brightness: 20 },
        { label: this.$t('living'), value: 3, brightness: 100 },
        { label: this.$t('eventHall'), value: 2, brightness: 200 },
        { label: this.$t('meetingRoom'), value: 0, brightness: 200 },
        { label: this.$t('classRoom'), value: 1, brightness: 300 },
        { label: this.$t('custom'), value: 5, brightness: 300 }
      ]
    },
    roomBrightness: {
      get() {
        return this.$store.state.ambient.roomBrightness
      },
      set(val) {
        this.SET_ROOM_BRIGHTNESS(val)
      }
    },
    screenGain: {
      get() {
        return this.$store.state.ambient.screenGain
      },
      set(val) {
        this.SET_SCREEN_GAIN(val)
      }
    },
    currentLuminous() {
      const selectedProjector = this.$store.state.dataSource.projectorModels.projectorModels.find(o => o.ModelName === this.$store.state.dataSource.selectedModelName)
      if (selectedProjector) {
        return selectedProjector.Brightness.value
      } else {
        return 0
      }
    },
    currentScreenAreaSize() {
      return this.$store.state.screen.width * this.$store.state.screen.height
    },
    brightnessOnScreenLx() {
      return this.currentLuminous / this.currentScreenAreaSize
    },
    brightnessOnScreenNit() {
      return this.brightnessOnScreenLx * this.screenGain / Math.PI
    },
    actualContrast() {
      return (this.brightnessOnScreenLx + this.roomBrightness) / this.roomBrightness
    },
    arrowTop() {
      let top = this.actualContrast * 6
      top < 0 && (top = 0)
      top > 100 && (top = 100)
      this.$emit('changeArrowtop', top)
      return top
    },
    ambientFilter() {
      return 1.2 - this.arrowTop / 100
    },
    ambientLabel() {
      if (this.arrowTop < 20) {
        return this.$t('tooLow')
      } else if (this.arrowTop < 40) {
        return this.$t('limit')
      } else if (this.arrowTop < 60) {
        return this.$t('suitable')
      } else if (this.arrowTop < 80) {
        return this.$t('bright')
      }

      return this.$t('high')
    }
  },
  methods: {
    ...mapMutations('ambient', ['SET_ROOM_BRIGHTNESS', 'SET_SCREEN_GAIN']),
    changeApplication(val) {
      const item = this.applicationOptions.find(o => o.value === val)
      if (!item) {
        return
      }
      this.roomBrightness = item.brightness
    },
    clickFloating() {
      this.$emit('update:isFloatingAmbient', true)
    }
  }
}
</script>
<style lang="scss" scoped>
.ambient_background {
  height: 150px;
  width: 220px;
  margin: auto;
  background: #73848b;
  display: flex;
  border-radius: 5px;
  border: 1px solid white;
}

.ambient_screen {
  height: 120px;
  width: 180px;
  margin: auto;
  background: #ffdd00;
  opacity: 1;
}

.ambient_ruler {
  width: 50px;
  height: 150px;
}

.ambient_ruler_block {
  background: yellow;
  height: 30px;
}
</style>
