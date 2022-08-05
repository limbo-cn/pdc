<template>
  <q-dialog id="dlg_choose_projector" :value="showDialog" @hide="hideDialog" full-width full-height>
    <q-layout view="hHh lpR fFf" container :class="{ 'bg-grey-10': $q.dark.isActive, 'bg-white': !$q.dark.isActive }">
      <q-header class="delta-gradient-bg" :style="{ background: $q.dark.isActive ? '#445a4d' : '' }">
        <q-toolbar>
          <q-btn flat @click="drawerLeft = !drawerLeft" round dense icon="menu" />
          <q-toolbar-title>{{ $t('chooseProjector') }}</q-toolbar-title>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-toolbar>
      </q-header>

      <q-drawer show-if-above v-model="drawerLeft" side="left" bordered :width="400">
        <q-scroll-area class="fit">
          <q-list padding>
            <q-item>
              <q-item-section>
                <div class="q-pa-sm row items-start q-gutter-sm">
                  <div class="col">
                    <q-input outlined :color="$q.dark.isActive ? 'primary' : 'positive'" dense debounce="150"
                      v-model="filter" :placeholder="$t('search')">
                      <template v-if="filter" v-slot:append>
                        <q-icon name="cancel" @click.stop="filter = ``" class="cursor-pointer" />
                      </template>
                      <q-icon slot="append" name="search" />
                    </q-input>
                  </div>
                </div>
                <div class="q-pa-sm row items-start q-gutter-sm">
                  <div class="col condition_dropdown" @click="showCondition = !showCondition">
                    {{ $t('installCondition') }}
                    <q-icon name="arrow_drop_down" v-show="!showCondition" />
                    <q-icon name="arrow_drop_up" v-show="showCondition" />
                  </div>
                </div>
                <div v-show="showCondition">
                  <div class="q-pa-sm row items-start q-gutter-sm">
                    <div class="col">
                      <q-field filled dense>
                        <template v-slot:control>
                          <q-checkbox :color="$q.dark.isActive ? 'primary' : 'positive'" v-model="conditionOptionalLens"
                            :label="$t('OptionalLensOnly')" />
                          <q-checkbox :color="$q.dark.isActive ? 'primary' : 'positive'" v-model="conditionLensShift"
                            :label="$t('LensShiftOnly')" />
                        </template>
                      </q-field>
                    </div>
                  </div>
                  <div class="q-pa-sm row items-start q-gutter-sm">
                    <div class="col">
                      <q-field filled dense>
                        <template v-slot:control>
                          <span class="text-subtitle2 text-grey-5"> {{ $t('unit') }}:</span>
                          <q-radio :color="$q.dark.isActive ? 'primary' : 'positive'" size="sm" v-model="conditionUnit"
                            v-for="optionUnit in optionUnits" :key="optionUnit.value" :val="optionUnit.value"
                            :label="optionUnit.label" />
                        </template>
                      </q-field>
                    </div>
                  </div>
                  <div class="q-pa-sm row items-start q-gutter-sm">
                    <div class="col">
                      <q-input filled dense :color="$q.dark.isActive ? 'primary' : 'positive'" :debounce="350"
                        v-model="conditionThrowDistance" type="number" step="0.100" :suffix="unitLabel">
                        <template v-slot:prepend>
                          <div class="text-subtitle2">
                            {{ $t('throwDistance') }}
                          </div>
                        </template>
                      </q-input>
                    </div>
                  </div>
                  <div class="q-pa-sm row items-start q-gutter-sm">
                    <div class="col">
                      <q-input filled dense :color="$q.dark.isActive ? 'primary' : 'positive'" :debounce="350"
                        type="number" step="0.100" v-model="conditionScreenSize"
                        :suffix="conditionScreen === 0 ? $t('inch') : unitLabel">
                        <template v-slot:prepend>
                          <div class="text-subtitle2">
                            {{ $t('screenSize') }}
                          </div>
                        </template>
                      </q-input>
                    </div>
                    <div class="col-4">
                      <q-select filled dense :color="$q.dark.isActive ? 'primary' : 'positive'"
                        v-model="conditionScreen" :options="optionsScreen" emit-value map-options option-value="value"
                        option-label="label" behavior="menu" />
                    </div>
                  </div>
                  <div class="q-pa-sm row items-start q-gutter-sm">
                    <div class="col">
                      <q-select dense filled :color="$q.dark.isActive ? 'primary' : 'positive'"
                        v-model="conditionAspectRatio" :options="aspectRatios" option-value="value" option-label="label"
                        emit-value map-options behavior="menu">
                        <template v-slot:prepend>
                          <div class="text-subtitle2">
                            {{ $t('aspectRatio') }}:
                          </div>
                        </template>
                      </q-select>
                    </div>
                  </div>
                </div>
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple @click="selectProjectorType({ Type: `all` })"
              :active-class="$q.dark.isActive ? '' : 'active-light'" :active="selectedType === `all`">
              <q-item-section avatar>
                <q-avatar :color="$q.dark.isActive ? 'primary' : 'positive'" text-color="white" icon="scatter_plot" />
              </q-item-section>
              <q-item-section>
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
            <q-table v-show="selectedType" :data="tableData" :columns="columns"
              @row-click="(evt, row, index) => { chooseModel(row.modelName) }" row-key="name" dense
              :pagination="initialPagination" color="amber">
              <!-- <template v-slot:top-left>
                <q-breadcrumbs v-show="selectedType">
                  <q-breadcrumbs-el :label="$t('projectorType')" />
                  <q-breadcrumbs-el
                    :label="selectedType === `all` ? `${$t('allProjector')} (${totalCount})` : `${selectedType} (${tableData.length})`" />
                </q-breadcrumbs>
              </template> -->
              <template v-slot:top-right v-if="$q.platform.is.mobile">
                <q-input outlined dense debounce="150" v-model="filter" :placeholder="$t('search')">
                  <template v-if="filter" v-slot:append>
                    <q-icon name="cancel" @click.stop="filter = ``" class="cursor-pointer" />
                  </template>
                  <q-icon slot="append" name="search" />
                </q-input>
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
import { unitRatio, unitType } from 'src/helper/enum'
import { mapMutations } from 'vuex'

export default {
  name: 'Choose-Projector',
  props: ['showDialog'],
  data() {
    return {
      drawerLeft: true,
      aspectRatios: [
        { label: '4:3', value: 4 / 3 },
        { label: '16:9', value: 16 / 9 },
        { label: '16:10', value: 16 / 10 }
      ],
      showCondition: false,
      conditionOptionalLens: false,
      conditionLensShift: false,
      conditionUnit: unitType.m,
      conditionThrowDistance: 0,
      conditionScreenSize: 0,
      conditionScreen: 0,
      conditionAspectRatio: 16 / 9,
      selectedType: 'all',
      initialPagination: {
        rowsPerPage: 30
      },
      filter: '',
      typeImgCache: {},
      projectorImgCache: {}
    }
  },
  mounted() {
    if (this.$route.params.modelname) {
      const modelName = this.$route.params.modelname.toUpperCase()
      const model = this.$store.state.dataSource.projectorModels.vvkProjectorModels.find(o => o.ModelName === modelName)
      if (model) {
        this.chooseModel(modelName)
      }
    }
  },
  computed: {
    optionUnits() {
      return [
        { label: this.$t('m'), value: unitType.m, ratio: unitRatio.m },
        { label: this.$t('cm'), value: unitType.cm, ratio: unitRatio.cm },
        { label: this.$t('mm'), value: unitType.mm, ratio: unitRatio.mm },
        { label: this.$t('inch'), value: unitType.inch, ratio: unitRatio.inch },
        { label: this.$t('feet'), value: unitType.feet, ratio: unitRatio.feet }
      ]
    },
    optionsScreen() {
      return [
        { label: this.$t('diagonal'), value: 0 },
        { label: this.$t('width'), value: 1 },
        { label: this.$t('height'), value: 2 }
      ]
    },
    unitLabel() {
      return this.optionUnits.find(o => o.value === this.conditionUnit)?.label
    },
    conditionThrowRatio() {
      const conditionUnitRatio = this.optionUnits.find(o => o.value === this.conditionUnit)?.ratio
      const throwDistance = this.conditionThrowDistance / conditionUnitRatio
      let screenWidth
      if (this.conditionScreen === 0) { // diagonal
        const diagonal = this.conditionScreenSize / unitRatio.inch
        const aspectAngle = Math.atan(this.conditionAspectRatio)
        screenWidth = diagonal * Math.sin(aspectAngle)
      } else if (this.conditionScreen === 1) { // width
        screenWidth = this.conditionScreenSize / conditionUnitRatio
      } else if (this.conditionScreen === 2) { // height
        screenWidth = this.conditionScreenSize / conditionUnitRatio * this.conditionAspectRatio
      }

      if (screenWidth === 0) {
        return 0
      }

      return throwDistance / screenWidth
    },
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
      return this.$store.state.dataSource.projectorModels.vvkProjectorModels.length
    },
    projectorTypes() {
      const types = this.$store.state.dataSource.projectorType.vvkProjectorTypes
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
        models = this.$store.state.dataSource.projectorModels.vvkProjectorModels
      } else {
        const modelNammes = this.$store.state.dataSource.projectorType.vvkProjectorTypes.find(o => o.Type === this.selectedType)?.Models
        modelNammes.forEach(modelName => {
          const model = this.$store.state.dataSource.projectorModels.vvkProjectorModels.find(o => o.ModelName === modelName)
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
      return _this.projectorModels.filter(o => o.ModelName.toUpperCase().includes(_this.filter.toUpperCase())).filter(o => {
        if (!this.showCondition) {
          return true
        }
        if (_this.conditionThrowRatio > 0) {
          if (!o['Throw Ratio']) {
            for (let i = 0; i < o['Optional Lens'].length; i++) {
              const lens = _this.$store.state.dataSource.projectorLens.vvkOptionalLens.find(ls => ls['Part Name'] === o['Optional Lens'][i])
              if (!lens) {
                continue
              } else if (lens['Throw Ratio'].max >= _this.conditionThrowRatio && lens['Throw Ratio'].min <= _this.conditionThrowRatio) {
                return true
              }
            }
            return false
          }
          return o['Throw Ratio'].max >= _this.conditionThrowRatio && o['Throw Ratio'].min <= _this.conditionThrowRatio
        }
        return true
      }).filter(o => {
        if (!this.showCondition) {
          return true
        }
        const conditionUnitRatio = _this.optionUnits.find(o => o.value === _this.conditionUnit)?.ratio
        const throwDistance = _this.conditionThrowDistance / conditionUnitRatio
        if (throwDistance > 0) {
          if (!o.Distance) {
            for (let i = 0; i < o['Optional Lens'].length; i++) {
              const lens = _this.$store.state.dataSource.projectorLens.vvkOptionalLens.find(ls => ls['Part Name'] === o['Optional Lens'][i])
              if (!lens) {
                continue
              } else if (lens.Distance.max >= throwDistance && lens.Distance.min <= throwDistance) {
                return true
              }
              return false
            }
          }
          return o.Distance.max >= throwDistance && o.Distance.min <= throwDistance
        }
        return true
      }).filter(o => {
        if (!this.showCondition || !this.conditionLensShift) {
          return true
        }
        return !!o['Lens Shift']
      }).filter(o => {
        if (!this.showCondition || !this.conditionOptionalLens) {
          return true
        }
        return !!o['Optional Lens']
      }).map(o => {
        return {
          image: o.img,
          modelName: o.ModelName,
          resolution: o.Resolution.Desc,
          brightness: o.Brightness.value,
          optionalLens: o['Optional Lens'] ? o['Optional Lens'].length : this.$t('fixed')
        }
      })
    }
  },
  methods: {
    ...mapMutations('dataSource', ['SET_SELECTED_MODEL_NAME', 'SET_SELECTED_LENS_NAME']),
    stylePage(offset, height) {
      return { height: `${height - offset}px` }
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
      const model = this.$store.state.dataSource.projectorModels.vvkProjectorModels.find(o => o.ModelName === modelName)
      this.SET_SELECTED_MODEL_NAME(model.ModelName)
      window._hmt && window._hmt.push(['_trackEvent', 'Choose Model', 'Click', model.ModelName])
      window.gtag('event', `ChooseModel-${model.ModelName}`)
      if (model['Optional Lens']) {
        this.SET_SELECTED_LENS_NAME(model['Optional Lens'][0])
      } else {
        this.SET_SELECTED_LENS_NAME(null)
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
