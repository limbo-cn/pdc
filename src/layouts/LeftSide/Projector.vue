<template>
  <q-card flat bordered>
    <q-card-section horizontal>
      <q-card-section class="col-5 flex flex-center" style="padding:5px">
        <q-img class="rounded-borders" :src="imgSrc" :img-style="{'background-size':'contain'}" style="height:120px;width:150px" />
      </q-card-section>
      <q-card-section class="q-pt-xs" style="padding:5px 0px 5px 10px;width:100%">
        <div class="text-overline">{{selectedProjectorTypeName}} </div>
        <a :href="selectedProjector.URL" target="_blank" :style="{color:$q.dark.isActive?'white':'#009df7'}" class="text-h5 q-mt-xs q-mb-xs text-weight-bolder">{{selectedProjector.ModelName}}</a>
        <div class="text-caption" :class="{'text-grey-4':$q.dark.isActive,'text-grey-8':!$q.dark.isActive}">
          <span v-if="selectedProjector.Resolution"> {{ `${$t('resolution')}: ${selectedProjector.Resolution.Desc}(${selectedProjector.Resolution.width}*${selectedProjector.Resolution.height})` }}<br /></span>
          <span v-if="selectedProjector.Brightness"> {{ `${$t('brightness')}: ${selectedProjector.Brightness.value} ${selectedProjector.Brightness.unit}` }}<br /></span>
          <span v-if="selectedProjector['Contrast Ratio']"> {{ `${$t('contrastRatio')}: ${selectedProjector['Contrast Ratio']}` }}<br /></span>
          <span v-if="selectedProjector.Weight">{{ `${$t('weight')}: ${selectedProjector.Weight.value} ${selectedProjector.Weight.unit}` }}<br /></span>
        </div>
      </q-card-section>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'LeftSide-Projector',
  data() {
    return {
      imgSrc: ''
    }
  },
  computed: {
    selectedProjectorTypeName() {
      let tpyeName = ''
      this.$store.state.dataSource.projectorType.vvkProjectorTypes.forEach(o => {
        if (o.Models.includes(this.$store.state.dataSource.selectedModelName)) {
          tpyeName = o.Type
        }
      })
      return tpyeName
    },
    selectedProjector() {
      return this.$store.getters['dataSource/selectedProjector'] || {}
    }
  },
  watch: {
    selectedProjector: {
      handler: 'selectProjector',
      immediate: true
    }
  },
  methods: {
    ...mapMutations('projector', ['SET_THROW_RATIO_MIN', 'SET_THROW_RATIO', 'SET_THROW_RATIO_MAX', 'SET_IS_UST', 'SET_SIZE', 'SET_UST_TR', 'SET_DEFAULT_DIAGONAL', 'SET_DISTANCE']),
    ...mapMutations('lens', ['SET_OFFSET', 'SET_MIN_LENS_SHIFT_H', 'SET_MAX_LENS_SHIFT_H', 'SET_MIN_LENS_SHIFT_V', 'SET_MAX_LENS_SHIFT_V']),
    ...mapMutations('screen', ['SET_ASPECT_RATIO', 'SET_CURRENT_ASPECT_RATIO']),
    selectProjector(selectedProjector) {
      this.imgSrc = require(`../../assets/${selectedProjector.Picture}`)
      this.SET_OFFSET(selectedProjector.Offset)
      this.SET_ASPECT_RATIO(eval(selectedProjector.AspectRatio)) // it is dangerous but within my control >.<
      this.SET_CURRENT_ASPECT_RATIO(eval(selectedProjector.AspectRatio)) // it is dangerous but within my control >.<
      this.SET_DEFAULT_DIAGONAL(selectedProjector.defaultDiagonal)
      if (selectedProjector['Throw Ratio']) {
        this.SET_THROW_RATIO_MIN(selectedProjector['Throw Ratio'].min)
        this.SET_THROW_RATIO_MAX(selectedProjector['Throw Ratio'].max)
        this.SET_THROW_RATIO(selectedProjector['Throw Ratio'].min)
      }
      if (selectedProjector['Lens Shift']?.Horizontal?.min) {
        this.SET_MIN_LENS_SHIFT_H(selectedProjector['Lens Shift']?.Horizontal?.min)
      } else {
        this.SET_MIN_LENS_SHIFT_H(0)
      }
      if (selectedProjector['Lens Shift']?.Horizontal?.max) {
        this.SET_MAX_LENS_SHIFT_H(selectedProjector['Lens Shift']?.Horizontal?.max)
      } else {
        this.SET_MAX_LENS_SHIFT_H(0)
      }
      if (selectedProjector['Lens Shift']?.Vertical?.min) {
        this.SET_MIN_LENS_SHIFT_V(selectedProjector['Lens Shift']?.Vertical?.min)
      } else {
        this.SET_MIN_LENS_SHIFT_V(0)
      }
      if (selectedProjector['Lens Shift']?.Vertical?.max) {
        this.SET_MAX_LENS_SHIFT_V(selectedProjector['Lens Shift']?.Vertical?.max)
      } else {
        this.SET_MAX_LENS_SHIFT_V(0)
      }
      if (selectedProjector.isUST) {
        this.SET_IS_UST(selectedProjector.isUST)
      } else {
        this.SET_IS_UST(false)
      }
      if (selectedProjector.size) {
        this.SET_SIZE(selectedProjector.size)
      } else {
        this.SET_SIZE({ x: 0, y: 0 })
      }
      if (selectedProjector.ustTR) {
        this.SET_UST_TR(selectedProjector.ustTR)
      } else {
        this.SET_UST_TR(null)
      }
      if (selectedProjector.Distance) {
        this.SET_DISTANCE(selectedProjector.Distance)
      }
      this.$root.$emit('resizeRoom')
      this.$root.$emit('resetPosition')
    }
  }
}
</script>
<style lang="scss">
</style>
