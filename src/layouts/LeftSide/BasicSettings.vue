<template>
  <q-card>
    <q-card-section style="padding:6px">
      <div class="q-gutter-sm row">
        <q-field dense borderless>
          <template v-slot:control>
            <span class="text-subtitle2 text-grey-5"> {{$t('unit')}}:</span>
            <q-radio size="sm" :color="$q.dark.isActive?'primary':'positive'" v-for="optionUnit in optionUnits" :key="optionUnit.value" @input="changeUnit" v-model="unit" :val="optionUnit.value" :label="optionUnit.label" />
          </template>
        </q-field>
        <q-field dense borderless>
          <template v-slot:control>
            <span class="text-subtitle2 text-grey-5"> {{$t('installation')}}:</span>
            <q-radio size="sm" :color="$q.dark.isActive?'primary':'positive'" v-for="optionInstallation in optionInstallations" :key="optionInstallation.value" @input="changeInstallation" v-model="installation" :val="optionInstallation.value" :label="optionInstallation.label" />
          </template>
        </q-field>
      </div>

    </q-card-section>
  </q-card>
</template>

<script>
import { mapMutations } from 'vuex'

import { unitType, installationType, unitRatio } from '../../helper/enum'

export default {
  name: 'LeftSide-BasicSettings',
  created() {
    this.$root.$on('resetUnitLabel', this.resetUnitLabel)
  },
  beforeDestroy() {
    this.$root.$off('resetUnitLabel', this.resetUnitLabel)
  },
  data() {
    return {
    }
  },
  computed: {
    optionUnits() {
      return [
        { label: this.$t('m'), value: unitType.m },
        { label: this.$t('cm'), value: unitType.cm },
        { label: this.$t('mm'), value: unitType.mm },
        { label: this.$t('inch'), value: unitType.inch },
        { label: this.$t('feet'), value: unitType.feet }
      ]
    },
    optionInstallations() {
      return [
        { label: this.$t('desktop'), value: installationType.desktop },
        { label: this.$t('ceiling'), value: installationType.ceiling }
      ]
    },
    unit: {
      get() {
        return this.$store.state.common.unit
      },
      set(val) {
        this.SET_UNIT(val)
      }
    },
    installation: {
      get() {
        return this.$store.state.common.installation
      },
      set(val) {
        this.SET_INSTALLATION(val)
      }
    }
  },
  methods: {
    ...mapMutations('common', ['SET_UNIT', 'SET_INSTALLATION', 'SET_UNIT_LABEL', 'SET_UNIT_RATIO']),
    changeInstallation() {
      this.$root.$emit('resizeRoom')
    },
    changeUnit(val) {
      if (val === unitType.m) {
        this.SET_UNIT_LABEL(this.$t('m'))
        this.SET_UNIT_RATIO(unitRatio.m)
      } else if (val === unitType.cm) {
        this.SET_UNIT_LABEL(this.$t('cm'))
        this.SET_UNIT_RATIO(unitRatio.cm)
      } else if (val === unitType.mm) {
        this.SET_UNIT_LABEL(this.$t('mm'))
        this.SET_UNIT_RATIO(unitRatio.mm)
      } else if (val === unitType.inch) {
        this.SET_UNIT_LABEL(this.$t('inch'))
        this.SET_UNIT_RATIO(unitRatio.inch)
      } else if (val === unitType.feet) {
        this.SET_UNIT_LABEL(this.$t('feet'))
        this.SET_UNIT_RATIO(unitRatio.feet)
      }
      this.$root.$emit('resizeRoom')
    },
    resetUnitLabel() {
      this.changeUnit(this.unit)
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
