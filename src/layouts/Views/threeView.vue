<template>
  <div>
    <q-card-section :class="{ 'title-section-dark': $q.dark.isActive, 'title-section-light': !$q.dark.isActive }">
      <div class="row items-center">
        <q-btn-dropdown flat :color="$q.dark.isActive ? 'primary' : 'positive'" :label="$t('threeView')"
          :disable="layoutModel === 'grid'" :dropdown-icon="layoutModel === 'grid' ? 'none' : ''">
          <q-list>
            <q-item clickable v-close-popup @click="handleSwitch(`SideView`)">
              <q-item-section>
                <q-item-label>{{ $t('sideView') }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="handleSwitch(`FrontView`)">
              <q-item-section>
                <q-item-label>{{ $t('frontView') }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="handleSwitch(`TopView`)">
              <q-item-section>
                <q-item-label>{{ $t('topView') }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-space />
        <q-checkbox :color="$q.dark.isActive ? 'primary' : 'positive'" v-model="changeProjector"
          @input="changeChangeProjector" :label="$t('changeProjector')" />
      </div>
    </q-card-section>
    <q-separator />
    <div class="viewWrapper" id="threeView">
      <!-- <q-resize-observer @resize="onResize" /> -->
    </div>
  </div>
</template>

<script>
import ThreeView from '../../views/threeView/threeView'
import { mapActions, mapMutations } from 'vuex'

export default {
  name: 'ThreeView',
  mounted() {
    this.view = new ThreeView('#threeView')
    this.view.animate()
  },
  data() {
    return {
      view: null,
      changeProjector: true
    }
  },
  computed: {
    layoutModel() {
      return this.$store.state.common.layoutModel
    }
  },
  methods: {
    ...mapActions('common', ['switchViews']),
    ...mapMutations('common', ['SET_FULL_SCREEN_VIEW']),
    onResize() {
      if (!this.view) { return }
      const wrapperRect = document.querySelector('#threeView').getBoundingClientRect()
      this.view.setRendererSize(wrapperRect.width, wrapperRect.height - 1)
      this.$root.$emit('setProjectorProp')
    },
    handleSwitch(view) {
      this.switchViews({ view1: 'ThreeView', view2: view })
    },
    changeChangeProjector(val) {
      this.$root.$emit('setEnableThreeControl', val)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
