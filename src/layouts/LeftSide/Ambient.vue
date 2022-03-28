<template>
  <q-card>
    <q-card-section style="padding:6px">
      <div class="q-gutter-sm row">
        <q-select dense :color="$q.dark.isActive?'primary':'positive'" v-model="application" @input="changeApplication" :options="applicationOptions" option-value="value" option-label="label" emit-value map-options style="width: 90% " behavior="menu">
          <template v-slot:prepend>
            <div class="text-subtitle2">
              {{$t('application')}}:
            </div>
          </template>
        </q-select>

        <q-input dense :color="$q.dark.isActive?'primary':'positive'" v-model="roomBrightness" :title="`${roomBrightness}lx`" type="number" step="1.000" :suffix="`lx`" style="width: 50%">
          <template v-slot:prepend>
            <div class="text-subtitle2">
              {{$t('roomBrightness')}}:
            </div>
          </template>
        </q-input>

        <q-input dense :color="$q.dark.isActive?'primary':'positive'" v-model="screenGain" :title="screenGain" type="number" step="0.01" style="width: 40%">
          <template v-slot:prepend>
            <div class="text-subtitle2">
              {{$t('screenGain')}}:
            </div>
          </template>
        </q-input>
        <div class="text-body2" :class="{'text-grey-4':$q.dark.isActive,'text-grey-8':!$q.dark.isActive}">
          {{$t('brightnessOnScreen')}} (nit): {{toFixedNumber(brightnessOnScreenNit,3)}}<br />
          {{$t('brightnessOnScreen')}} (lx): {{toFixedNumber(brightnessOnScreenLx,3)}}<br />
          {{$t('actualContrast')}}: {{toFixedNumber(actualContrast,2)}}:1
        </div>
      </div>
      <div class="q-pa-sm row items-start q-gutter-sm">
        <div class="col-7">
          <div class="ambient_background" :style="`filter: contrast(${ambientFilter})`">
            <div class="ambient_screen">

            </div>
          </div>
        </div>
        <div class="col relative-position">
          <div class="ambient_ruler">
            <div class="ambient_ruler_block" style="filter: brightness(1);"></div>
            <div class="ambient_ruler_block" style="filter: brightness(0.8);"></div>
            <div class="ambient_ruler_block" style="filter: brightness(0.6);"></div>
            <div class="ambient_ruler_block" style="filter: brightness(0.4);"></div>
            <div class="ambient_ruler_block" style="filter: brightness(0.2);"></div>
            <div class="absolute" style="left:50px" :style="{top:`${arrowTop}%`}">
              <span>
                <q-icon name="arrow_left" />{{ambientLabel}}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="q-pa-sm row items-start q-gutter-sm">
          <img src="../../assets/projection_best.jpg" v-show="arrowTop<12" style="background-size:contain;width:95%" usemap="#projectionMap" />
          <img src="../../assets/projection_good.jpg" v-show="arrowTop>=12 && arrowTop<33" style="background-size:contain;width:95%" usemap="#projectionMap" />
          <img src="../../assets/projection_enough.jpg" v-show="arrowTop>=33 && arrowTop<53" style="background-size:contain;width:95%" usemap="#projectionMap" />
          <img src="../../assets/projection_limit.jpg" v-show="arrowTop>=53 && arrowTop<73" style="background-size:contain;width:95%" usemap="#projectionMap" />
          <img src="../../assets/projection_low.jpg" v-show="arrowTop>=73" style="background-size:contain;width:95%" usemap="#projectionMap" />
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { toFixedNumber } from 'src/helper/common'
import { mapMutations } from 'vuex'

export default {
  name: 'LeftSide-Ambient',
  data() {
    return {
      application: 0,
      toFixedNumber: toFixedNumber
    }
  },
  computed: {
    applicationOptions() {
      return [
        { label: this.$t('meetingRoom'), value: 0, brightness: 200 },
        { label: this.$t('classRoom'), value: 1, brightness: 300 },
        { label: this.$t('eventHall'), value: 2, brightness: 200 },
        { label: this.$t('living'), value: 3, brightness: 100 },
        { label: this.$t('theatre'), value: 4, brightness: 20 },
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
      const selectedProjector = this.$store.state.dataSource.projectorModels.vvkProjectorModels.find(o => o.ModelName === this.$store.state.dataSource.selectedModelName)
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
      let top = 90 - this.actualContrast * 5
      top < 0 && (top = 0)
      return top
    },
    ambientFilter() {
      return 1.2 - this.arrowTop / 100
    },
    ambientLabel() {
      if (this.arrowTop < 12) {
        return this.$t('best')
      } else if (this.arrowTop < 33) {
        return this.$t('good')
      } else if (this.arrowTop < 53) {
        return this.$t('enough')
      } else if (this.arrowTop < 73) {
        return this.$t('limit')
      }

      return this.$t('tooLow')
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
    }
  }
}
</script>
<style lang="scss" scoped>
.ambient_background{
  height: 150px;
  width: 220px;
  margin: auto;
  background: #73848b;
  display: flex;
  border-radius: 5px;
  border: 1px solid white;
}
.ambient_screen{
  height: 120px;
  width: 180px;
  margin: auto;
  background: #ffdd00;
  opacity: 1;
}
.ambient_ruler{
  width: 50px;
  height: 150px;
}
.ambient_ruler_block{
  background: yellow;
  height: 30px;
}
</style>
