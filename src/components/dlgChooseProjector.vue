<template>
  <q-dialog id="dlg_choose_projector" :value="showDialog" @hide="hideDialog" full-width full-height>
    <q-layout view="hHh lpR fFf" container :class="{ 'bg-grey-10': $q.dark.isActive, 'bg-white': !$q.dark.isActive }"
      style="max-width:1200px !important">
      <q-header>
        <div style="height:8px" class="delta-gradient-bg"></div>
        <q-toolbar class="shadow-2"
          :style="{ background: $q.dark.isActive ? '#222222' : '#ffffff', color: $q.dark.isActive ? '#ffffff' : '#222222' }">
          <q-btn flat @click="drawerLeft = !drawerLeft" round dense icon="menu" />
          <q-toolbar-title>{{ $t('chooseProjector') }}</q-toolbar-title>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-toolbar>
      </q-header>

      <q-drawer show-if-above v-model="drawerLeft" side="left" bordered :width="350">
        <q-scroll-area class="fit">
          <q-list padding>
            <q-item clickable v-ripple @click="selectProjectorType({ Type: `all` })"
              :active-class="$q.dark.isActive ? '' : 'active-light'" :active="selectedType === `all`">
              <q-item-section class="q-pl-lg">
                {{ $t('allProjector') }} ({{ totalCount }})
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple v-for="item in projectorTypes" :key="item.Type"
              @click="selectProjectorType(item)" :active-class="$q.dark.isActive ? '' : 'active-light'"
              :active="selectedType === item.Type">
              <q-item-section thumbnail>
                <q-img :src="item.img" :img-style="{ 'background-size': 'contain' }" style="height:80px;width:120px" />
              </q-item-section>
              <q-item-section>
                {{ item.Type }} ({{ item.Models.length }})
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </q-drawer>

      <q-page-container>
        <q-page :style-fn="stylePage">
          <q-scroll-area class="fit">
            <div>
              <div class="q-pa-sm row items-start q-gutter-sm">
                <q-field dense borderless>
                  <template v-slot:control>
                    <q-checkbox :color="$q.dark.isActive ? 'primary' : 'positive'" v-model="conditionOptionalLens"
                      :label="$t('OptionalLensOnly')" />
                    <q-checkbox :color="$q.dark.isActive ? 'primary' : 'positive'" v-model="conditionLensShift"
                      :label="$t('LensShiftOnly')" />
                  </template>
                </q-field>
              </div>
              <div class="q-pa-sm row items-start q-gutter-sm">
                <div class="col">
                  <q-input dense clearable :color="$q.dark.isActive ? 'primary' : 'positive'" :debounce="350" v-model="conditionModelName">
                    <template v-slot:prepend>
                      <div class="text-subtitle2">
                        {{ $t('modelName') }}
                      </div>
                    </template>
                  </q-input>
                </div>
                <div class="col">
                  <q-input dense clearable :color="$q.dark.isActive ? 'primary' : 'positive'" :debounce="350"
                    v-model="conditionThrowDistance" type="number" step="0.100" suffix="m">
                    <template v-slot:prepend>
                      <div class="text-subtitle2">
                        {{ $t('throwDistance') }}
                      </div>
                    </template>
                  </q-input>
                </div>
                <div class="col">
                  <q-select dense clearable :color="$q.dark.isActive ? 'primary' : 'positive'" v-model="conditionThrowRatio"
                    :options="throwRatioOptions" option-value="value" option-label="label" emit-value map-options
                    behavior="menu">
                    <template v-slot:prepend>
                      <div class="text-subtitle2">
                        {{ $t('throwRatio') }}:
                      </div>
                    </template>
                  </q-select>
                </div>
              </div>
              <div class="q-pa-sm row items-start q-gutter-sm">
                <div class="col">
                  <q-select dense clearable :color="$q.dark.isActive ? 'primary' : 'positive'" v-model="conditionAspectRatio"
                    :options="aspectRatios" behavior="menu">
                    <template v-slot:prepend>
                      <div class="text-subtitle2">
                        {{ $t('aspectRatio') }}:
                      </div>
                    </template>
                  </q-select>
                </div>
                <div class="col">
                  <q-select dense clearable :color="$q.dark.isActive ? 'primary' : 'positive'" v-model="conditionResolution"
                    :options="resolutionOptions" option-value="value" option-label="label" emit-value map-options
                    behavior="menu">
                    <template v-slot:prepend>
                      <div class="text-subtitle2">
                        {{ $t('resolution') }}:
                      </div>
                    </template>
                  </q-select>
                </div>
                <div class="col">
                  <q-select dense clearable :color="$q.dark.isActive ? 'primary' : 'positive'" v-model="conditionBrightness"
                    :options="brightnessOptions" option-value="value" option-label="label" emit-value map-options
                    behavior="menu">
                    <template v-slot:prepend>
                      <div class="text-subtitle2">
                        {{ $t('brightness') }}:
                      </div>
                    </template>
                  </q-select>
                </div>
              </div>
            </div>
            <q-table v-show="selectedType" :data="tableData" :columns="columns"
              @row-click="(evt, row, index) => { chooseModel(row.modelName) }" row-key="name" dense
              :pagination="initialPagination" color="positive">
              <!-- <template v-slot:top-left>
                <q-breadcrumbs v-show="selectedType">
                  <q-breadcrumbs-el :label="$t('projectorType')" />
                  <q-breadcrumbs-el
                    :label="selectedType === `all` ? `${$t('allProjector')} (${totalCount})` : `${selectedType} (${tableData.length})`" />
                </q-breadcrumbs>
              </template> -->
              <template v-slot:header-cell="props">
                <q-th :props="props" style="font-size: 16px; padding:10px 0">
                  {{ props.col.label }}
                </q-th>
              </template>
              <template v-slot:body-cell-image="props">
                <q-td :props="props">
                  <q-img :src="props.value" :img-style="{ 'background-size': 'contain' }"
                    style="height:100px;width:150px" />
                </q-td>
              </template>
            </q-table>
          </q-scroll-area>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script>
import {
  filterModelName, filterOptionalLens, filterLensShift, filterThrowDistance,
  filterThrowRatio, filterAspectRatio, filterResolution, filterBrightness
} from 'src/helper/common'
import { mapMutations } from 'vuex'

export default {
  name: 'Choose-Projector',
  props: ['showDialog'],
  data() {
    return {
      drawerLeft: true,
      aspectRatios: [
        { label: '4/3', value: 4 / 3 },
        { label: '16/9', value: 16 / 9 },
        { label: '16/10', value: 16 / 10 },
        { label: '19/10', value: 19 / 10 }
      ],
      conditionOptionalLens: false,
      conditionLensShift: false,
      conditionThrowDistance: '',
      conditionThrowRatio: '',
      throwRatioOptions: ['0-0.5', '0.5-1', '1-1.5', '1.5-2', '2-3', '3-5', '5-10'],
      conditionAspectRatio: '',
      conditionResolution: '',
      resolutionOptions: ['480p', '720p', '1080p', 'XGA', 'WXGA', 'WUXGA', '4K-UHD'],
      conditionBrightness: '',
      brightnessOptions: ['0-2000', '2000-4000', '4000-6000', '6000-8000', '8000-10000', '10000-15000', '15000-20000', '20000-30000'],
      selectedType: 'all',
      initialPagination: {
        rowsPerPage: 30
      },
      conditionModelName: '',
      typeImgCache: {},
      projectorImgCache: {}
    }
  },
  mounted() {
    if (this.$route.params.modelname) {
      const modelName = this.$route.params.modelname.toUpperCase()
      const model = this.$store.state.dataSource.projectorModels.projectorModels.find(o => o.ModelName === modelName)
      if (model) {
        this.chooseModel(modelName)
      }
    }
  },
  computed: {
    columns() {
      return [
        { name: 'image', label: this.$t('image'), field: 'image', align: 'center', style: 'min-width: 150px;width: 150px' },
        { name: 'modelName', label: this.$t('modelName'), field: 'modelName', align: 'center', sortable: true },
        { name: 'resolution', label: this.$t('resolution'), field: 'resolution', align: 'center', sortable: true },
        { name: 'brightness', label: `${this.$t('brightness')}(ANSI Lumen)`, field: 'brightness', align: 'center', sortable: true },
        { name: 'optionalLens', label: this.$t('optionalLens'), field: 'optionalLens', align: 'center', sortable: true }
      ]
    },
    totalCount() {
      return this.$store.state.dataSource.projectorModels.projectorModels.length
    },
    projectorTypes() {
      const types = this.$store.state.dataSource.projectorType.projectorTypes
      types.forEach(o => {
        if (!this.typeImgCache[o.Type]) {
          this.typeImgCache[o.Type] = require(`../assets/${o.Picture}`)
        }
        o.img = this.typeImgCache[o.Type]
      })
      return types
    },
    projectorModels() {
      if (this.selectedType === '') { return [] }
      let models = []
      if (this.selectedType === 'all') {
        models = this.$store.state.dataSource.projectorModels.projectorModels
      } else {
        const modelNammes = this.$store.state.dataSource.projectorType.projectorTypes.find(o => o.Type === this.selectedType)?.Models
        modelNammes.forEach(modelName => {
          const model = this.$store.state.dataSource.projectorModels.projectorModels.find(o => o.ModelName === modelName)
          model && models.push(model)
        })
      }
      models.forEach(o => {
        if (!this.projectorImgCache[o.ModelName]) {
          this.projectorImgCache[o.ModelName] = require(`../assets/${o.Picture}`)
        }
        o.img = this.projectorImgCache[o.ModelName]
      })
      return models
    },
    tableData() {
      const _this = this

      const modelsFiltered = _this.projectorModels
        .filter(o => !this.conditionModelName || filterModelName(o, this.conditionModelName))
        .filter(o => !this.conditionOptionalLens || filterOptionalLens(o))
        .filter(o => !this.conditionLensShift || filterLensShift(o))
        .filter(o => !this.conditionThrowDistance || filterThrowDistance(o, this.conditionThrowDistance))
        .filter(o => !this.conditionThrowRatio || filterThrowRatio(o, this.conditionThrowRatio))
        .filter(o => !this.conditionAspectRatio || filterAspectRatio(o, this.conditionAspectRatio.label))
        .filter(o => !this.conditionResolution || filterResolution(o, this.conditionResolution))
        .filter(o => !this.conditionBrightness || filterBrightness(o, this.conditionBrightness))
        .map(o => {
          return {
            image: o.img,
            modelName: o.ModelName,
            resolution: o.Resolution.Desc,
            brightness: o.Brightness.value,
            optionalLens: o['Optional Lens'] ? o['Optional Lens'].length : this.$t('fixed')
          }
        })

      return modelsFiltered
    }
  },
  methods: {
    ...mapMutations('dataSource', ['SET_SELECTED_MODEL_NAME', 'SET_SELECTED_LENS_NAME']),
    ...mapMutations('room', [
      'SET_WIDTH',
      'SET_HEIGHT',
      'SET_DEPTH'
    ]),
    stylePage(offset, height) {
      return { height: `${height - offset - 10}px` }
    },
    hideDialog() {
      this.$emit('update:showDialog', false)
    },
    selectProjectorType(item) {
      this.$q.platform.is.mobile && (this.drawerLeft = false)
      // this.drawerLeft = false
      this.selectedType = item.Type
    },
    chooseModel(modelName) {
      const model = this.$store.state.dataSource.projectorModels.projectorModels.find(o => o.ModelName === modelName)
      this.SET_SELECTED_MODEL_NAME(model.ModelName)
      window._hmt && window._hmt.push(['_trackEvent', 'Choose Model', 'Click', model.ModelName])
      window.gtag('event', `ChooseModel-${model.ModelName}`)
      if (model['Optional Lens']) {
        this.SET_SELECTED_LENS_NAME(model['Optional Lens'][0])
      } else {
        this.SET_SELECTED_LENS_NAME(null)
      }

      if (model.isUST) {
        this.SET_WIDTH(3)
        this.SET_HEIGHT(3)
        this.SET_DEPTH(3)
        this.$root.$emit('resizeRoom')
      }

      this.$emit('update:showDialog', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.condition_dropdown {
  cursor: pointer
}

.condition_dropdown:hover {
  color: $primary
}

.active-light {
  color: #14A028
}
</style>
<style lang="scss">
.choose-projector-table-header {
  font-size: 30px;
  color: red
}
</style>
