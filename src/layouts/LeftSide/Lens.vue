<template>
  <q-card flat bordered>
    <q-card-section horizontal>
      <q-card-section class="col-5 flex flex-center" style="padding:5px">
        <q-img v-if="selectedLens" :src="imgSrc" :img-style="{'background-size':'contain'}" style="height:100px;width:120px" />
        <q-img v-else :src="svgSrc" :img-style="{'background-size':'contain'}" style="height:100px;width:100px" />
      </q-card-section>
      <q-card-section class="q-pt-xs" style="padding:5px 0px 5px 10px;width:100%" v-if="selectedLens">
        <div class="text-overline">{{selectedLens['Lens Type']}} </div>
        <div class="text-h6 q-mt-none q-mb-xs">{{selectedLens['Part Name']}}</div>
        <div class="text-caption" style=" line-height: 1.1rem;" :class="{'text-grey-4':$q.dark.isActive,'text-grey-8':!$q.dark.isActive}">
          <span v-if="selectedLens['Throw Ratio']">{{ `${$t('throwRatio')}: ${selectedLens['Throw Ratio'].min}${selectedLens['Throw Ratio'].min === selectedLens['Throw Ratio'].max ?'':'-'}${selectedLens['Throw Ratio'].min === selectedLens['Throw Ratio'].max ?'':selectedLens['Throw Ratio'].max}` }}</span><br />
          <span v-if="selectedLens.Distance">{{ `${$t('distance')}: ${selectedLens.Distance.min}-${selectedLens.Distance.max} ${$t('m')}` }}</span><br />
          <span v-if="selectedLens.Offset !== null">{{ `${$t('offset')}: ${selectedLens.Offset} %` }}<br /></span>
        </div>
      </q-card-section>
      <q-card-section class="q-pt-xs" style="padding:5px 0px 5px 10px;width:100%" v-else>
        <div class="text-h6 q-mt-sm q-mb-xs text-weight-bolder">{{$t('fixed')}}</div>
        <div class="text-caption" style=" line-height: 1.1rem;" :class="{'text-grey-4':$q.dark.isActive,'text-grey-10':!$q.dark.isActive}">
          <span v-if="selectedProjector['Throw Ratio']">{{ `${$t('throwRatio')}: ${selectedProjector['Throw Ratio'].min}${selectedProjector['Throw Ratio'].min === selectedProjector['Throw Ratio'].max ?'':'-'}${selectedProjector['Throw Ratio'].min === selectedProjector['Throw Ratio'].max ?'':selectedProjector['Throw Ratio'].max}` }}<br /></span>
          <span v-if="selectedProjector.Distance">{{ `${$t('distance')}: ${selectedProjector.Distance.min}-${selectedProjector.Distance.max} ${$t('m')}` }}<br /></span>
          <span v-if="selectedProjector.Offset">{{ `${$t('offset')}: ${selectedProjector.Offset} %` }}<br /></span>
        </div>
      </q-card-section>
    </q-card-section>

    <q-separator />

  </q-card>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'LeftSide-Lens',
  data() {
    return {
      imgSrc: '',
      svgSrc: require('../../assets/Lens_fixed.svg')
    }
  },
  computed: {
    selectedLens() {
      return this.$store.getters['dataSource/selectedLens']
    },
    selectedProjector() {
      return this.$store.getters['dataSource/selectedProjector'] || {}
    }
  },
  watch: {
    selectedLens: {
      handler: 'selectLens',
      immediate: true
    }
  },
  methods: {
    ...mapMutations('projector', ['SET_THROW_RATIO_MIN', 'SET_THROW_RATIO', 'SET_THROW_RATIO_MAX', 'SET_IS_UST', 'SET_DISTANCE']),
    ...mapMutations('lens', ['SET_OFFSET']),
    selectLens(selectedLens) {
      if (!selectedLens) {
        return
      }
      selectedLens && (this.imgSrc = require(`../../assets/${selectedLens.Picture}`))
      if (selectedLens['Throw Ratio']) {
        this.SET_THROW_RATIO_MIN(selectedLens['Throw Ratio'].min)
        this.SET_THROW_RATIO_MAX(selectedLens['Throw Ratio'].max)
        this.SET_THROW_RATIO(selectedLens['Throw Ratio'].min)
      }
      this.SET_OFFSET(selectedLens.Offset)
      this.SET_DISTANCE(selectedLens.Distance)
      if (selectedLens.isUST) {
        this.SET_IS_UST(selectedLens.isUST)
      } else {
        this.SET_IS_UST(false)
      }

      this.$root.$emit('resizeRoom')
      this.$root.$emit('resetPosition')
    }
  }
}
</script>
<style lang="scss">

</style>
