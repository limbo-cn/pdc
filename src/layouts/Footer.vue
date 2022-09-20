<template>
  <q-footer reveal>
    <q-toolbar class="shadow-2" :style="{ 'background-color': $q.dark.isActive ? '#222222' : '#ffffff' }"
      style="height:30px;min-height:30px;">
      <template v-if="!$q.platform.is.mobile">
        <q-btn flat dense @click="setLayoutModel('grid')"
          :icon="layoutModel === `grid` ? `img:${iconDiv4}` : `img:${iconDiv4_white}`">
          <q-tooltip>{{ $t('grid') }}</q-tooltip>
        </q-btn>
        <q-btn flat dense @click="setLayoutModel('list')"
          :icon="layoutModel === `list` ? `img:${iconDiv2}` : `img:${iconDiv2_white}`">
          <q-tooltip>{{ $t('list') }}</q-tooltip>
        </q-btn>
        <q-btn flat dense @click="setLayoutModel('fullscreen')"
          :icon="layoutModel === `fullscreen` ? `img:${iconDiv1}` : `img:${iconDiv1_white}`">
          <q-tooltip>{{ $t('fullscreen') }}</q-tooltip>
        </q-btn>
      </template>

      <q-toolbar-title class="text-caption text-right">
        <q-btn flat dense :icon="`img:${iconInfo}`" class="text-caption">
          <q-tooltip>
            <ul>
              <li>{{ $t('disclaimer1') }}</li>
              <li>{{ $t('disclaimer2') }}</li>
              <li>{{ $t('disclaimer3') }}</li>
              <li>{{ $t('disclaimer4') }}</li>
            </ul>
          </q-tooltip>
        </q-btn>
        <span :class="{ 'text-white': $q.dark.isActive, 'text-black': !$q.dark.isActive }"> PJ-Calc v 1.4.1 © Copyright
          2022 Vivitek. All Rights Reserved. |</span>
        <a href="https://www.vivitek.eu/support/contact-support" target="_blank"
          :class="{ 'text-white': $q.dark.isActive, 'text-black': !$q.dark.isActive }">Contact Us</a>
      </q-toolbar-title>
    </q-toolbar>
  </q-footer>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'Footer',
  computed: {
    layoutModel() {
      return this.$store.state.common.layoutModel
    }
  },
  data() {
    return {
      iconDiv4: require('../assets/icons/icon_4divisions_2.svg'),
      iconDiv4_white: require('../assets/icons/icon_4divisions_1.svg'),
      iconDiv2: require('../assets/icons/icon_2divisions_2.svg'),
      iconDiv2_white: require('../assets/icons/icon_2divisions_1.svg'),
      iconDiv1: require('../assets/icons/icon_1divisions_2.svg'),
      iconDiv1_white: require('../assets/icons/icon_1divisions_1.svg'),
      iconInfo: require('../assets/icons/icon_info.svg')
    }
  },
  methods: {
    ...mapMutations('common', ['SET_LAYOUT_MODEL']),
    setLayoutModel(name) {
      this.SET_LAYOUT_MODEL(name)
    }
  }
}
</script>
<style lang="scss" scoped>
.selected {
  color: $primary  !important;
}
</style>
