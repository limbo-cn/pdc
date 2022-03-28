<template>
  <q-card>
    <q-card-section style="padding:6px">
      <div class="q-gutter-sm row">
        <q-input dense :color="$q.dark.isActive?'primary':'positive'" v-model.number="screenOffset" :disable="isUST" @input="changeScreenOffset" :title="`${screenOffset}${unitLabel}`" type="number" step="0.1" :suffix="unitLabel" style="width: 90%">
          <template v-slot:prepend>
            <div class="text-subtitle2">
              {{$t('screenOffset')}}:
            </div>
          </template>
        </q-input>
        <q-input dense :color="$q.dark.isActive?'primary':'positive'" v-model.number="fromFloor" readonly :title="`${fromFloor}${unitLabel}`" type="number" :suffix="unitLabel" style="width: 90%">
          <template v-slot:prepend>
            <div class="text-subtitle2">
              {{$t('fromFloor')}}:
            </div>
          </template>
        </q-input>
        <q-input dense :color="$q.dark.isActive?'primary':'positive'" v-model.number="fromLeft" readonly :title="`${fromLeft}${unitLabel}`" type="number" :suffix="unitLabel" style="width: 90%">
          <template v-slot:prepend>
            <div class="text-subtitle2">
              {{$t('fromLeft')}}:
            </div>
          </template>
        </q-input>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { toFixedNumber } from 'src/helper/common'

export default {
  name: 'LeftSide-ScreenPosition',
  data() {
    return {
    }
  },
  computed: {
    isUST() {
      return this.$store.state.projector.isUST
    },
    fromLeft() {
      return toFixedNumber(this.$store.state.screen.fromLeft * this.$store.state.common.unitRatio, 3)
    },
    fromFloor() {
      return toFixedNumber(this.$store.state.screen.fromFloor * this.$store.state.common.unitRatio, 3)
    },
    screenOffset: {
      get() {
        return toFixedNumber(this.$store.state.screen.screenOffset * this.$store.state.common.unitRatio, 3)
      },
      set(val) {
        let screenOffset = val / this.$store.state.common.unitRatio
        if (screenOffset < 0) {
          screenOffset = 0
        }
        if (screenOffset > this.$store.state.room.depth / 2) {
          screenOffset = this.$store.state.room.depth / 2
        }
        this.$store.commit('screen/SET_SCREEN_OFFSET', screenOffset)
      }
    },
    unitLabel() {
      return this.$store.state.common.unitLabel
    }
  },
  watch: {
    isUST(val) {
      val && (this.screenOffset = 0)
      this.changeScreenOffset()
    }
  },
  methods: {
    changeScreenOffset() {
      this.$root.$emit('resizeRoom')
    }
  }
}
</script>
<style lang="scss">

</style>
