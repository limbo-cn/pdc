<template>
  <q-card>
    <q-card-section style="padding:6px">
      <div class="q-gutter-sm row">
        <q-input dense :color="$q.dark.isActive?'primary':'positive'" v-model.number="fromScreen" :disable="!enableFromScreen" :title="`${fromScreen}${unitLabel}`" type="number" step="0.100" style="width: 90%" @input="changeFromScreen" :suffix="unitLabel">
          <template v-slot:prepend>
            <div class="text-subtitle2">
              {{$t('fromScreen')}}:
            </div>
          </template>
          <template v-slot:after>
            <q-toggle v-show="!$q.platform.is.mobile" v-model="enableFromScreen" checked-icon="check" color="green" unchecked-icon="clear" />
          </template>
        </q-input>

        <q-input dense :color="$q.dark.isActive?'primary':'positive'" v-model.number="fromLeftSide" :disable="!enableFromLeftside" :title="`${fromLeftSide}${unitLabel}`" type="number" step="0.100" style="width: 90%" @input="changeFromLeftSide" :suffix="unitLabel">
          <template v-slot:prepend>
            <div class="text-subtitle2">
              {{$t('fromLeft')}}:
            </div>
          </template>
          <template v-slot:after>
            <q-toggle v-show="!$q.platform.is.mobile" v-model="enableFromLeftside" checked-icon="check" color="green" unchecked-icon="clear" />
          </template>
        </q-input>

        <q-input dense :color="$q.dark.isActive?'primary':'positive'" v-model.number="fromFloor" :disable="!enableFromFloor" :title="`${fromFloor}${unitLabel}`" type="number" step="0.100" style="width: 90%" @input="changeFromFloor" :suffix="unitLabel">
          <template v-slot:prepend>
            <div class="text-subtitle2">
              {{$t('fromFloor')}}:
            </div>
          </template>
          <template v-slot:after>
            <q-toggle v-show="!$q.platform.is.mobile" v-model="enableFromFloor" checked-icon="check" color="green" unchecked-icon="clear" />
          </template>
        </q-input>

        <q-input dense :color="$q.dark.isActive?'primary':'positive'" v-model.number="angleV" @input="changeAngleV" :disable="!enableAngleV" :title="`${angleV}°`" type="number" max="90" min="-90" step="1.000" suffix="°" style="width: 90%">
          <template v-slot:prepend>
            <div class="text-subtitle2">
              {{$t('verticalAngle')}}:
            </div>
          </template>
          <template v-slot:append>
            <q-btn @click="setDefaultAngleV" :disable="!enableAngleV" round flat icon="refresh" :color="$q.dark.isActive?'primary':'positive'" />
          </template>
          <template v-slot:after>
            <q-toggle v-show="!$q.platform.is.mobile" v-model="enableAngleV" checked-icon="check" color="green" unchecked-icon="clear" />
          </template>
        </q-input>

        <q-input dense :color="$q.dark.isActive?'primary':'positive'" v-model.number="angleH" @input="changeAngleH" :disable="!enableAngleH" :title="`${angleH}°`" type="number" max="90" min="-90" step="1.000" suffix="°" style="width: 90%">
          <template v-slot:prepend>
            <div class="text-subtitle2">
              {{$t('horizontalAngle')}}:
            </div>
          </template>
          <template v-slot:append>
            <q-btn @click="setDefaultAngleH" :disable="!enableAngleH" round flat icon="refresh" :color="$q.dark.isActive?'primary':'positive'" />
          </template>
          <template v-slot:after>
            <q-toggle v-show="!$q.platform.is.mobile" v-model="enableAngleH" checked-icon="check" color="green" unchecked-icon="clear" />
          </template>
        </q-input>

        <q-input dense :color="$q.dark.isActive?'primary':'positive'" v-model.number="lensShiftH" @input="changeLenShiftH" v-show="isSupportLenShiftH" :disable="!enableLenShiftH" :title="`${lensShiftH}%`" :max="maxLensShiftH" :min="minLensShiftH" type="number" step="1.000" suffix="%" style="width: 90%">
          <template v-slot:prepend>
            <div class="text-subtitle2">
              {{$t('lensShiftH')}}:
            </div>
          </template>
          <template v-slot:append>
            <q-btn @click="setDefaultLensShiftH" :disable="!enableLenShiftH" round flat icon="refresh" :color="$q.dark.isActive?'primary':'positive'" />
          </template>
          <template v-slot:after>
            <q-toggle v-show="!$q.platform.is.mobile" v-model="enableLenShiftH" :disable="!isSupportLenShiftH" checked-icon="check" color="green" unchecked-icon="clear" />
          </template>
        </q-input>

        <q-input dense :color="$q.dark.isActive?'primary':'positive'" v-model.number="lensShiftV" @input="changeLenShiftV" v-show="isSupportLenShiftV" :disable="!enableLenShiftV" :title="`${lensShiftV}%`" :max="maxLensShiftV" :min="minLensShiftV" type="number" step="1.000" suffix="%" style="width: 90%">
          <template v-slot:prepend>
            <div class="text-subtitle2">
              {{$t('lensShiftV')}}:
            </div>
          </template>
          <template v-slot:append>
            <q-btn @click="setDefaultLensShiftV" :disable="!enableLenShiftV" round flat icon="refresh" :color="$q.dark.isActive?'primary':'positive'" />
          </template>
          <template v-slot:after>
            <q-toggle v-show="!$q.platform.is.mobile" v-model="enableLenShiftV" :disable="!isSupportLenShiftV" checked-icon="check" color="green" unchecked-icon="clear" />
          </template>
        </q-input>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { calcFromScreenMax, calcFromScreenMin, toFixedNumber } from 'src/helper/common'
import { mapMutations } from 'vuex'
import { setUSTThrowRatioByFromScreen } from 'src/helper/UST'

export default {
  name: 'LeftSide-Position',
  created() {
    this.$root.$on('resetPosition', this.resetPosition)
    this.$root.$on('arrowUp', this.arrowUp)
    this.$root.$on('arrowDown', this.arrowDown)
    this.$root.$on('arrowLeft', this.arrowLeft)
    this.$root.$on('arrowRight', this.arrowRight)
  },
  beforeDestroy() {
    this.$root.$off('resetPosition', this.resetPosition)
    this.$root.$off('arrowUp', this.arrowUp)
    this.$root.$on('arrowDown', this.arrowDown)
    this.$root.$off('arrowLeft', this.arrowLeft)
    this.$root.$on('arrowRight', this.arrowRight)
  },
  data() {
    return {}
  },
  computed: {
    fromLeftSide: {
      get() {
        return toFixedNumber(this.$store.state.projector.fromLeftside * this.$store.state.common.unitRatio, 3)
      },
      set(val) {
        this.SET_FROM_LEFTSIDE(val / this.$store.state.common.unitRatio)
      }
    },
    enableFromLeftside: {
      get() {
        return this.$store.state.projector.enableFromLeftside
      },
      set(val) {
        this.SET_ENABLE_FROM_LEFTSIDE(val)
      }
    },
    enableFromFloor: {
      get() {
        return this.$store.state.projector.enableFromFloor
      },
      set(val) {
        this.SET_ENABLE_FROM_FLOOR(val)
      }
    },
    enableFromScreen: {
      get() {
        return this.$store.state.projector.enableFromScreen
      },
      set(val) {
        this.SET_ENABLE_FROM_SCREEN(val)
      }
    },
    fromFloor: {
      get() {
        return toFixedNumber(this.$store.state.projector.fromFloor * this.$store.state.common.unitRatio, 3)
      },
      set(val) {
        this.SET_FROM_FLOOR(val / this.$store.state.common.unitRatio)
      }
    },
    fromScreen: {
      get() {
        return toFixedNumber((this.$store.state.projector.fromScreen - this.$store.state.screen.screenOffset) * this.$store.state.common.unitRatio, 3)
      },
      set(val) {
        this.SET_FROM_SCREEN(val / this.$store.state.common.unitRatio + this.$store.state.screen.screenOffset)
      }
    },
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
    lensShiftH: {
      get() {
        return toFixedNumber(this.$store.state.lens.lensShiftH, 3)
      },
      set(val) {
        this.SET_LENS_SHIFT_H(val)
      }
    },
    lensShiftV: {
      get() {
        return toFixedNumber(this.$store.state.lens.lensShiftV, 3)
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
    isSupportLenShiftH() {
      return this.$store.state.lens.maxLensShiftH !== this.$store.state.lens.minLensShiftH
    },
    minLensShiftH() {
      return this.$store.state.lens.minLensShiftH
    },
    maxLensShiftH() {
      return this.$store.state.lens.maxLensShiftH
    },
    enableLenShiftV: {
      get() {
        return this.$store.state.lens.enableLenShiftV
      },
      set(val) {
        this.SET_ENABLE_LENS_SHIFT_V(val)
      }
    },
    isSupportLenShiftV() {
      return this.$store.state.lens.maxLensShiftV !== this.$store.state.lens.minLensShiftV
    },
    minLensShiftV() {
      return this.$store.state.lens.minLensShiftV
    },
    maxLensShiftV() {
      return this.$store.state.lens.maxLensShiftV
    },
    unitLabel() {
      return this.$store.state.common.unitLabel
    }
  },
  watch: {
    fromScreen(val) {
      if (this.$store.state.screen.lockScreenSize) { // 锁定的情况下不需要更新width
        return
      }
      const fromScreen = val / this.$store.state.common.unitRatio
      setUSTThrowRatioByFromScreen(fromScreen)
      let screenWidth = fromScreen / this.$store.state.projector.throwRatio
      let screenHeight = screenWidth / this.$store.state.screen.aspectRatio
      if (this.$store.state.screen.currentAspectRatio < this.$store.state.screen.aspectRatio) {
        screenWidth = screenWidth * this.$store.state.screen.currentAspectRatio / this.$store.state.screen.aspectRatio
      }
      if (this.$store.state.screen.currentAspectRatio > this.$store.state.screen.aspectRatio) {
        screenHeight = screenHeight * this.$store.state.screen.aspectRatio / this.$store.state.screen.currentAspectRatio
      }
      const screenDiagonal = Math.sqrt(Math.pow(screenWidth, 2) + Math.pow(screenHeight, 2))
      this.SET_WIDTH(screenWidth)
      this.SET_HEIGHT(screenHeight)
      this.SET_DIAGONAL(screenDiagonal)
    }
  },
  methods: {
    ...mapMutations('projector', ['SET_FROM_LEFTSIDE', 'SET_FROM_FLOOR', 'SET_FROM_SCREEN', 'SET_THROW_RATIO', 'SET_ANGLE_H', 'SET_ANGLE_V',
      'SET_ENABLE_ANGLE_H', 'SET_ENABLE_ANGLE_V', 'SET_ENABLE_FROM_LEFTSIDE', 'SET_ENABLE_FROM_FLOOR', 'SET_ENABLE_FROM_SCREEN']),
    ...mapMutations('lens', ['SET_LENS_SHIFT_H', 'SET_LENS_SHIFT_V', 'SET_ENABLE_LENS_SHIFT_H', 'SET_ENABLE_LENS_SHIFT_V']),
    ...mapMutations('screen', ['SET_WIDTH', 'SET_HEIGHT', 'SET_DIAGONAL']),
    resetPosition() {
      this.fromLeftSide = this.$store.state.room.width / 2 * this.$store.state.common.unitRatio
      this.fromFloor = this.$store.state.room.height / 2 * this.$store.state.common.unitRatio
      this.angleH = 0
      this.angleV = 0
      this.lensShiftH = 0
      this.lensShiftV = 0
      this.$root.$emit('setDefaultDiagonal')
      this.$root.$emit('setProjectorProp')
    },
    changeFromScreen(val) {
      const maxFromScreen = Math.min(this.$store.getters['projector/distance'].max * this.$store.state.common.unitRatio,
        (calcFromScreenMax() - this.$store.state.screen.screenOffset) * this.$store.state.common.unitRatio)
      const minFromScreen = calcFromScreenMin() * this.$store.state.common.unitRatio
      val = +val
      val < minFromScreen && (this.fromScreen = minFromScreen)
      val > maxFromScreen && (this.fromScreen = maxFromScreen)
      this.$root.$emit('setProjectorProp')
    },
    changeFromFloor(val) {
      const maxFromFloor = this.$store.state.room.height * this.$store.state.common.unitRatio
      val = +val
      val < 0 && (this.fromFloor = 0)
      val > maxFromFloor && (this.fromFloor = maxFromFloor)
      this.$root.$emit('setProjectorProp')
    },
    changeFromLeftSide(val) {
      const maxFromLeftSide = this.$store.state.room.width * this.$store.state.common.unitRatio
      val = +val
      val < 0 && (this.fromLeftSide = 0)
      val > maxFromLeftSide && (this.fromLeftSide = maxFromLeftSide)
      this.$root.$emit('setProjectorProp')
    },
    changeAngleH(val) {
      val < -90 && (this.angleH = -90)
      val > 90 && (this.angleH = 90)
      this.$root.$emit('setProjectorProp')
    },
    changeAngleV(val) {
      val < -90 && (this.angleV = -90)
      val > 90 && (this.angleV = 90)
      this.$root.$emit('setProjectorProp')
    },
    changeLenShiftH(val) {
      val < this.$store.state.lens.minLensShiftH && (this.lensShiftH = this.$store.state.lens.minLensShiftH)
      val > this.$store.state.lens.maxLensShiftH && (this.lensShiftH = this.$store.state.lens.maxLensShiftH)
      this.$root.$emit('setProjectorProp')
    },
    changeLenShiftV(val) {
      val < this.$store.state.lens.minLensShiftV && (this.lensShiftV = this.$store.state.lens.minLensShiftV)
      val > this.$store.state.lens.maxLensShiftV && (this.lensShiftV = this.$store.state.lens.maxLensShiftV)
      this.$root.$emit('setProjectorProp')
    },
    setDefaultAngleH(val) {
      this.angleH = 0
      this.$root.$emit('setProjectorProp')
    },
    setDefaultAngleV(val) {
      this.angleV = 0
      this.$root.$emit('setProjectorProp')
    },
    setDefaultLensShiftH(val) {
      this.lensShiftH = 0
      this.$root.$emit('setProjectorProp')
    },
    setDefaultLensShiftV(val) {
      this.lensShiftV = 0
      this.$root.$emit('setProjectorProp')
    },
    arrowUp() {
      switch (this.$store.state.common.selectedView) {
        case 'SideView': this.increaseFromFloor(); break
        case 'FrontView': this.increaseFromFloor(); break
        case 'TopView': this.increaseFromLeftSide(); break
      }
    },
    arrowDown() {
      switch (this.$store.state.common.selectedView) {
        case 'SideView': this.decreaseFromFloor(); break
        case 'FrontView': this.decreaseFromFloor(); break
        case 'TopView': this.decreaseFromLeftSide(); break
      }
    },
    arrowLeft() {
      switch (this.$store.state.common.selectedView) {
        case 'SideView': this.decreaseFromScreen(); break
        case 'FrontView': this.decreaseFromLeftSide(); break
        case 'TopView': this.decreaseFromScreen(); break
      }
    },
    arrowRight() {
      switch (this.$store.state.common.selectedView) {
        case 'SideView': this.increaseFromScreen(); break
        case 'FrontView': this.increaseFromLeftSide(); break
        case 'TopView': this.increaseFromScreen(); break
      }
    },
    increaseFromFloor() {
      this.fromFloor += (0.02 * this.$store.state.common.unitRatio)
      this.changeFromFloor(this.fromFloor)
    },
    decreaseFromFloor() {
      this.fromFloor -= (0.02 * this.$store.state.common.unitRatio)
      this.changeFromFloor(this.fromFloor)
    },
    increaseFromScreen() {
      this.fromScreen += (0.02 * this.$store.state.common.unitRatio)
      this.changeFromScreen(this.fromScreen)
    },
    decreaseFromScreen() {
      this.fromScreen -= (0.02 * this.$store.state.common.unitRatio)
      this.changeFromScreen(this.fromScreen)
    },
    increaseFromLeftSide() {
      this.fromLeftSide += (0.02 * this.$store.state.common.unitRatio)
      this.changeFromLeftSide(this.fromLeftSide)
    },
    decreaseFromLeftSide() {
      this.fromLeftSide -= (0.02 * this.$store.state.common.unitRatio)
      this.changeFromLeftSide(this.fromLeftSide)
    }
  }
}
</script>
<style lang="scss">

</style>
