<template>
  <q-dialog :value="showDialog" @hide="hideDialog" full-width full-height>
    <q-layout view="hHh lpR fFf" container :class="{ 'bg-grey-10': $q.dark.isActive, 'bg-white': !$q.dark.isActive }" style="max-width:1200px !important">
      <q-header>
        <div style="height:8px" class="delta-gradient-bg"></div>
        <q-toolbar class="shadow-2"
          :style="{ background: $q.dark.isActive ? '#222222' : '#ffffff', color: $q.dark.isActive ? '#ffffff' : '#222222' }">
          <q-toolbar-title>{{ $t('chooseLens') }}</q-toolbar-title>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-toolbar>
      </q-header>

      <q-page-container>
        <q-page>
          <div class="q-pa-md row items-start q-gutter-sm col">
            <q-card class="my-card" v-for="item in projectorLens" :key="item['Part Name']" @click="chooseLens(item)" >
              <q-img :src="item.img" :img-style="{ 'background-size': 'contain' }" style="height:120px" />
              <q-card-section class="q-pa-sm">
                <div class="text-h6">{{ item['Part Name'] }}
                  <q-badge :color="$q.dark.isActive ? 'primary' : 'positive'"
                    :text-color="$q.dark.isActive ? 'black' : 'white'"
                    v-if="selectedLens && selectedLens['Part Name'] === item['Part Name']">
                    {{ $t('current') }}
                  </q-badge>
                </div>
                <div class="text-body2"
                  :class="{ 'text-grey-4': $q.dark.isActive, 'text-grey-8': !$q.dark.isActive }">
                  <span class="text-body2" v-if="item['Throw Ratio']">{{ `${$t('throwRatio')}: ${item['Throw Ratio'].min}-${item['Throw Ratio'].max}` }}</span><br />
                  <span class="text-body2" v-if="item.Distance">{{ `${$t('distance')}: ${item.Distance.min}-${item.Distance.max}
                                      ${$t('m')}`
                  }}</span><br />
                </div>
              </q-card-section>
            </q-card>
          </div>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'Choose-Lens',
  props: ['showDialog'],
  data() {
    return {
      lensImgCache: {}
    }
  },
  computed: {
    selectedLens() {
      return this.$store.getters['dataSource/selectedLens']
    },
    projectorLens() {
      const modelName = this.$store.state.dataSource.selectedModelName
      const model = this.$store.state.dataSource.projectorModels.projectorModels.find(o => o.ModelName === modelName)
      if (!model || !model['Optional Lens']) {
        return []
      }
      const lenNames = model['Optional Lens']
      const lens = lenNames.map(lenName => this.$store.state.dataSource.projectorLens.optionalLens.find(o => o['Part Name'] === lenName))
      .filter(o => o !== undefined).sort((a, b) => (a['Throw Ratio'].min - b['Throw Ratio'].min))
      lens.forEach(o => {
        if (!this.lensImgCache[o['Part Name']]) {
          this.lensImgCache[o['Part Name']] = require(`../assets/${o.Picture}`)
        }
        o.img = this.lensImgCache[o['Part Name']]
      })
      return lens
    }
  },
  methods: {
    ...mapMutations('dataSource', ['SET_SELECTED_LENS_NAME']),
    hideDialog() {
      this.$emit('update:showDialog', false)
    },
    chooseLens(lens) {
      this.SET_SELECTED_LENS_NAME(lens['Part Name'])
      window._hmt && window._hmt.push(['_trackEvent', 'Choose Lens', 'Click', lens['Part Name']])
      window.gtag('event', `Chooselens-${lens['Part Name']}`)
      this.$emit('update:showDialog', false)
    }
  }
}
</script>
<style lang="scss">
.my-card {
  width: 100%;
  max-width: 250px;
  cursor: pointer;
}
</style>
