<template>
  <q-header reveal :style="{ background: $q.dark.isActive ? '#1e1f26' : 'white' }">
    <div style="height:8px" class="delta-gradient-bg"></div>
    <q-toolbar class="shadow-2">
      <q-btn flat dense round :color="$q.dark.isActive ? 'white' : 'green'" icon="menu" aria-label="Menu"
        v-show="!leftDrawerOpen && $q.platform.is.mobile" @click="leftDrawerOpen = !leftDrawerOpen" />

      <img :src="$q.dark.isActive ? logo_white : logo" :style="{ background: !$q.dark.isActive ? 'white' : '' }"
        class="rounded-borders" style="height: 40px;padding: 2px; max-width: 150px;" />
      <q-toolbar-title>
        <div v-show="!$q.platform.is.mobile" style="font-weight:bold"
          :style="{ color: $q.dark.isActive ? 'white' : '#595959' }">Projection Distance Calculator</div>
      </q-toolbar-title>

      <q-btn flat round :icon="$q.dark.isActive ? `img:${iconRefresh_white}` : `img:${iconRefresh}`"
        @click="refreshViews">
        <q-tooltip>{{ $t('refresh') }}</q-tooltip>
      </q-btn>
      <q-btn flat round :icon="$q.dark.isActive ? `img:${iconGuide_white}` : `img:${iconGuide}`" @click="userGuide">
        <q-tooltip>{{ $t('guide') }}</q-tooltip>
      </q-btn>
      <q-btn flat round :icon="$q.dark.isActive ? `img:${iconHistory_white}` : `img:${iconHistory}`"
        v-show="!$q.platform.is.mobile" @click="showHistory = true">
        <q-tooltip>{{ $t('snapshot') }}</q-tooltip>
      </q-btn>
      <q-btn flat round :icon="$q.dark.isActive ? `img:${iconPDF_white}` : `img:${iconPDF}`" @click="showDlgPDF = true">
        <q-tooltip>{{ $t('pdf') }}</q-tooltip>
      </q-btn>

      <q-btn flat round :icon="$q.dark.isActive ? `img:${iconLanguage_white}` : `img:${iconLanguage}`">
        <q-tooltip>{{ $t('language') }}</q-tooltip>
        <q-menu>
          <q-list>
            <q-item clickable v-close-popup @click="changeLanguage(`en-us`)">
              <q-item-section>English</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="changeLanguage(`cn-zh`)">
              <q-item-section>简体中文</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="changeLanguage(`cn-tw`)">
              <q-item-section>繁體中文</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="changeLanguage(`fr`)">
              <q-item-section>Français</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="changeLanguage(`es`)">
              <q-item-section>Español</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="changeLanguage(`de`)">
              <q-item-section>Deutsche</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="changeLanguage(`it`)">
              <q-item-section>Italiana</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="changeLanguage(`ja`)">
              <q-item-section>日本語</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="changeLanguage(`kr`)">
              <q-item-section>한국어</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="changeLanguage(`vi`)">
              <q-item-section>Tiếng Việt</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>

      <q-btn flat round :icon="$q.dark.isActive ? `img:${iconTheme_white}` : `img:${iconTheme}`" @click="toggleTheme">
        <q-tooltip>{{ $t('theme') }}</q-tooltip>
      </q-btn>
      <q-btn flat round :icon="$q.fullscreen.isActive ? $q.dark.isActive ? `img:${iconZoomout_white}` : `img:${iconZoomout}` : $q.dark.isActive ?
      `img:${iconZoomin_white}` : `img:${iconZoomin}`" v-show="!$q.platform.is.mobile" @click="$q.fullscreen.toggle()">
        <q-tooltip>{{ $t('fullscreen') }}</q-tooltip>
      </q-btn>
    </q-toolbar>

    <DlgPDF :showDialog.sync="showDlgPDF" />
    <History :showDialog.sync="showHistory" />
  </q-header>
</template>

<script>
import { mapMutations } from 'vuex'
import { i18n } from '../boot/i18n'
import { GetQueryString } from 'src/helper/common'
import DlgPDF from '../components/ExportPDF'
import History from '../components/History'

export default {
  name: 'Header',
  components: {
    DlgPDF,
    History
  },
  mounted() {
    this.changeLanguage(GetQueryString('lan'))
  },
  data() {
    return {
      showDlgPDF: false,
      showHistory: false,
      logo: require('../assets/Vivitek Logo.svg'),
      logo_white: require('../assets/Vivitek Logo_white.svg'),
      iconRefresh: require('../assets/icons/icon_refresh.svg'),
      iconRefresh_white: require('../assets/icons/icon_refresh_white.svg'),
      iconGuide: require('../assets/icons/icon_um.svg'),
      iconGuide_white: require('../assets/icons/icon_um_white.svg'),
      iconHistory: require('../assets/icons/icon_history.svg'),
      iconHistory_white: require('../assets/icons/icon_history_white.svg'),
      iconPDF: require('../assets/icons/icon_pdf.svg'),
      iconPDF_white: require('../assets/icons/icon_pdf_white.svg'),
      iconLanguage: require('../assets/icons/icon_language.svg'),
      iconLanguage_white: require('../assets/icons/icon_language_white.svg'),
      iconTheme: require('../assets/icons/icon_color.svg'),
      iconTheme_white: require('../assets/icons/icon_color_white.svg'),
      iconZoomout: require('../assets/icons/icon_zoom_out.svg'),
      iconZoomout_white: require('../assets/icons/icon_zoom_out_white.svg'),
      iconZoomin: require('../assets/icons/icon_zoom_in.svg'),
      iconZoomin_white: require('../assets/icons/icon_zoom_in_white.svg')
    }
  },
  computed: {
    leftDrawerOpen: {
      get() {
        return this.$store.state.common.leftDrawerOpen
      },
      set(val) {
        this.SET_LEFT_DRAWER_OPEN(val)
      }
    }
  },
  methods: {
    ...mapMutations('common', ['SET_LEFT_DRAWER_OPEN']),
    changeLanguage(lan) {
      i18n.locale = lan
      switch (lan) {
        case 'en-us': import('quasar/lang/en-us').then(lang => { this.$q.lang.set(lang.default) }); break
        case 'cn-zh': import('quasar/lang/zh-hans').then(lang => { this.$q.lang.set(lang.default) }); break
        case 'cn-tw': import('quasar/lang/zh-hant').then(lang => { this.$q.lang.set(lang.default) }); break
        case 'fr': import('quasar/lang/fr').then(lang => { this.$q.lang.set(lang.default) }); break
        case 'es': import('quasar/lang/es').then(lang => { this.$q.lang.set(lang.default) }); break
        case 'de': import('quasar/lang/de').then(lang => { this.$q.lang.set(lang.default) }); break
        case 'it': import('quasar/lang/it').then(lang => { this.$q.lang.set(lang.default) }); break
        case 'ja': import('quasar/lang/ja').then(lang => { this.$q.lang.set(lang.default) }); break
        case 'kr': import('quasar/lang/ko-kr').then(lang => { this.$q.lang.set(lang.default) }); break
        case 'vi': import('quasar/lang/vi').then(lang => { this.$q.lang.set(lang.default) }); break
        default: i18n.locale = 'en-us'; break
      }
      this.$root.$emit('resetUnitLabel')
    },
    refreshViews() {
      this.$root.$emit('resetPosition')
    },
    userGuide() {
      window.open(`${location.href}guide/User's Manual.pdf`)
    },
    toggleTheme() {
      this.$q.dark.toggle()
      this.$root.$emit('resizeRoom')
      this.$root.$emit('setTheme')
    }
  }
}
</script>
