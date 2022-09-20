<template>
  <q-card>
    <q-card-section style="padding:6px">
      <div class="q-gutter-sm row">
        <q-input dense :color="$q.dark.isActive?'primary':'positive'" :value="roomWidth" ref="roomWidthInput" :max="roomWidthMax" :min="roomWidthMin" @input="changeRoomWidth" :suffix="unitLabel" :title="`${roomWidth}${unitLabel}`" type="number" step="1" style="width: 185px">
          <template v-slot:prepend>
            <div class="text-subtitle2">
              {{$t('width')}}:
            </div>
          </template>
        </q-input>
        <q-input dense :color="$q.dark.isActive?'primary':'positive'" :value="roomHeight" ref="roomHeightInput" :max="roomHeightMax" :min="roomHeightMin" @input="changeRoomHeight" :suffix="unitLabel" :title="`${roomHeight}${unitLabel}`" type="number" step="1" style="width: 185px">
          <template v-slot:prepend>
            <div class="text-subtitle2">
              {{$t('height')}}:
            </div>
          </template>
        </q-input>
        <q-input dense :color="$q.dark.isActive?'primary':'positive'" :value="roomDepth" ref="roomDepthInput" :max="roomDepthMax" :min="roomDepthMin" @input="changeRoomDepth" :title="`${roomDepth}${unitLabel}`" type="number" step="1" :suffix="unitLabel" style="width: 185px">
          <template v-slot:prepend>
            <div class="text-subtitle2">
              {{$t('depth')}}:
            </div>
          </template>
        </q-input>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { toFixedNumber } from 'src/helper/common'
import { mapMutations } from 'vuex'

export default {
  name: 'LeftSide-RoomSize',
  data() {
    return {
    }
  },
  computed: {
    roomWidth() {
      return toFixedNumber(this.$store.state.room.width * this.$store.state.common.unitRatio, 3)
    },
    roomHeight() {
      return toFixedNumber(this.$store.state.room.height * this.$store.state.common.unitRatio, 3)
    },
    roomDepth() {
      return toFixedNumber(this.$store.state.room.depth * this.$store.state.common.unitRatio, 3)
    },
    unitLabel() {
      return this.$store.state.common.unitLabel
    },
    roomWidthMax() {
      return 30 * this.$store.state.common.unitRatio
    },
    roomWidthMin() {
      return 2 * this.$store.state.common.unitRatio
    },
    roomHeightMax() {
      return 50 * this.$store.state.common.unitRatio
    },
    roomHeightMin() {
      return 2 * this.$store.state.common.unitRatio
    },
    roomDepthMax() {
      return 60 * this.$store.state.common.unitRatio
    },
    roomDepthMin() {
      return 3 * this.$store.state.common.unitRatio
    }
  },
  methods: {
    ...mapMutations('room', {
      setRoomWidth: 'SET_WIDTH',
      setRoomHeight: 'SET_HEIGHT',
      setRoomDepth: 'SET_DEPTH'
    }),
    resizeRoom() {
      this.$root.$emit('resizeRoom')
    },
    changeRoomWidth(val) {
      const roomWidth = val / this.$store.state.common.unitRatio
      this.setRoomWidth(roomWidth)
      this.resizeRoom()
    },
    changeRoomHeight(val) {
      const roomHeight = val / this.$store.state.common.unitRatio
      this.setRoomHeight(roomHeight)
      this.resizeRoom()
    },
    changeRoomDepth(val) {
      const roomDepth = val / this.$store.state.common.unitRatio
      this.setRoomDepth(roomDepth)
      this.resizeRoom()
    }
  }
}
</script>
<style lang="scss">

</style>
