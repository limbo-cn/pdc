<template>
  <q-card>
    <q-card-section style="padding:6px">
      <div class="q-gutter-sm row">
        <q-input dense :color="$q.dark.isActive?'primary':'positive'" :readonly="isReadOnly" :value="screenDiagonal" :disable="!enableScreenSize" @input="changeScreenDiagonal" :title="`${screenDiagonal}${$t('inch')}`" type="number" step="1" :suffix="$t('inch')" style="width:95%">
          <template v-slot:prepend>
            <div class="text-subtitle2">
              {{$t('diagonal')}}:
            </div>
          </template>
          <template v-slot:after>
            <q-toggle v-model="enableScreenSize" @input="changeEnableScreenSize" checked-icon="check" color="positive" unchecked-icon="clear" />
          </template>
        </q-input>

        <q-select dense :color="$q.dark.isActive?'primary':'positive'" :disable="!enableScreenSize" v-model="aspectRatio" @input="changeAspectRatio" :options="aspectRatios" option-value="value" option-label="label" emit-value map-options style="width:95%" behavior="menu">
          <template v-slot:prepend>
            <div class="text-subtitle2">
              {{$t('aspectRatio')}}:
            </div>
          </template>
        </q-select>

        <q-input dense :color="$q.dark.isActive?'primary':'positive'" :readonly="isReadOnly" :value="screenWidth" @input="changeScreenWidth" :disable="!enableScreenSize" :title="`${screenWidth}${unitLabel}`" type="number" step="0.1" :suffix="unitLabel" style="width: 185px">
          <template v-slot:prepend>
            <div class="text-subtitle2">
              {{$t('width')}}:
            </div>
          </template>
        </q-input>

        <q-input dense :color="$q.dark.isActive?'primary':'positive'" :readonly="isReadOnly" :value="screenHeight" @input="changeScreenHeight" :disable="!enableScreenSize" :title="`${screenHeight}${unitLabel}`" type="number" step="0.1" :suffix="unitLabel" style="width: 185px">
          <template v-slot:prepend>
            <div class="text-subtitle2">
              {{$t('height')}}:
            </div>
          </template>
        </q-input>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { calcFromScreenMax, calcFromScreenMin, toFixedNumber } from '../../helper/common'
import { unitRatio } from '../../helper/enum'
import { mapMutations } from 'vuex'
import bus from '../../helper/bus'
import { setUSTThrowRatio } from 'src/helper/UST'

export default {
  name: 'LeftSide-ScreenSize',
  created() {
    this.$root.$on('setDefaultDiagonal', this.setDefaultDiagonal)
    bus.$on('setDefaultDiagonal', this.setDefaultDiagonal)
  },
  beforeDestroy() {
    this.$root.$off('setDefaultDiagonal', this.setDefaultDiagonal)
    bus.$off('setDefaultDiagonal', this.setDefaultDiagonal)
  },
  data() {
    return {
      aspectRatios: [
        { label: '16:9', value: 16 / 9 },
        { label: '16:10', value: 16 / 10 },
        { label: '4:3', value: 4 / 3 }
      ]
    }
  },
  computed: {
    screenWidth() {
      const width = this.$store.state.screen.width
      return toFixedNumber(width * this.$store.state.common.unitRatio, 3)
    },
    screenHeight() {
      const height = this.$store.state.screen.height
      return toFixedNumber(height * this.$store.state.common.unitRatio, 3)
    },
    screenDiagonal() {
      return toFixedNumber(this.$store.state.screen.diagonal * unitRatio.inch, 3) // inch
    },
    enableScreenSize: {
      get() {
        return !this.$store.state.screen.lockScreenSize
      },
      set(val) {
        this.SET_LOCK_SCREENSIZE(!val)
      }
    },
    aspectRatio: {
      get() {
        return this.$store.state.screen.currentAspectRatio
      },
      set(val) {
        this.SET_CURRENT_ASPECT_RATIO(val)
      }
    },
    isReadOnly() {
      return this.$store.state.screen.currentAspectRatio !== this.$store.state.screen.aspectRatio
    },
    unitLabel() {
      return this.$store.state.common.unitLabel
    }
  },
  methods: {
    ...mapMutations('projector', ['SET_FROM_SCREEN', 'SET_THROW_RATIO']),
    ...mapMutations('screen', ['SET_CURRENT_ASPECT_RATIO', 'SET_LOCK_SCREENSIZE']),
    changeEnableScreenSize() {
      this.SET_THROW_RATIO(this.$store.state.projector.throwRatioMin)
      this.changeScreenWidth(this.$store.state.screen.width)
    },
    changeScreenWidth(val) {
      const screenWidth = val / this.$store.state.common.unitRatio
      const fromScreen = this.$store.state.projector.throwRatio * screenWidth
      this.setFromScreen(fromScreen)
    },
    changeScreenHeight(val) {
      const screenHeight = val / this.$store.state.common.unitRatio
      const screenWidth = screenHeight * this.aspectRatio
      const fromScreen = this.$store.state.projector.throwRatio * screenWidth
      this.setFromScreen(fromScreen)
    },
    changeScreenDiagonal(val) {
      setUSTThrowRatio(val)
      val = val / unitRatio.inch
      const aspectAngle = Math.atan(this.aspectRatio)
      const screenWidth = val * Math.sin(aspectAngle)
      const fromScreen = this.$store.state.projector.throwRatio * screenWidth
      this.setFromScreen(fromScreen)
    },
    setFromScreen(val) {
      val += this.$store.state.screen.screenOffset
      const maxFromScreen = Math.min(calcFromScreenMax(), this.$store.getters['projector/distance'].max + this.$store.state.screen.screenOffset)
      const minFromScreen = calcFromScreenMin() + this.$store.state.screen.screenOffset
      val < minFromScreen && (val = minFromScreen)
      val > maxFromScreen && (val = maxFromScreen)
      this.SET_FROM_SCREEN(val)
      this.$root.$emit('setProjectorProp')
    },
    changeAspectRatio() {
      this.SET_FROM_SCREEN(this.$store.state.projector.fromScreen + 0.001)
      this.$nextTick(() => { // to trigger watch
        this.SET_FROM_SCREEN(this.$store.state.projector.fromScreen - 0.001)
      })
      this.$root.$emit('setProjectorProp')
    },
    setDefaultDiagonal() {
      this.changeScreenDiagonal(this.$store.state.projector.defaultDiagonal)
    }
  }
}
</script>
<style lang="scss">

</style>
