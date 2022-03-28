<template>
  <q-header reveal :style="{ background: $q.dark.isActive ? '#1e1f26' : 'white' }">
    <q-toolbar class="shadow-2">
      <q-btn
        flat
        dense
        round
        :color="$q.dark.isActive ? 'white' : 'green'"
        icon="menu"
        aria-label="Menu"
        v-show="!leftDrawerOpen"
        @click="leftDrawerOpen = !leftDrawerOpen"
      />

      <img
        :src="$q.dark.isActive ? logo_white : logo"
        :style="{ background: !$q.dark.isActive ? 'white' : '' }"
        class="rounded-borders"
        style="height: 40px;padding: 2px; max-width: 150px;"
      />
      <q-toolbar-title>
        <div
          v-show="!$q.platform.is.mobile"
          style="font-weight:bold"
          :style="{ color: $q.dark.isActive ? 'white' : '#45ba55' }"
        >Projector Distance Calculator</div>
      </q-toolbar-title>

      <q-btn
        flat
        round
        :color="$q.dark.isActive ? 'white' : 'green'"
        icon="refresh"
        @click="refreshViews"
      />
      <q-btn
        flat
        round
        :color="$q.dark.isActive ? 'white' : 'green'"
        icon="help_outline"
        @click="userGuide"
      />
      <q-btn
        flat
        round
        :color="$q.dark.isActive ? 'white' : 'green'"
        icon="history"
        v-show="!$q.platform.is.mobile"
        @click="showHistory = true"
      />
      <q-btn
        flat
        round
        :color="$q.dark.isActive ? 'white' : 'green'"
        icon="picture_as_pdf"
        @click="showDlgPDF = true"
      />

      <q-btn flat round :color="$q.dark.isActive ? 'white' : 'green'" icon="language">
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
            <q-item clickable v-close-popup @click="changeLanguage(`jpn`)">
              <q-item-section>日本語</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="changeLanguage(`kr`)">
              <q-item-section>한국어</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="changeLanguage(`viet`)">
              <q-item-section>Tiếng Việt</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>

      <q-btn
        flat
        round
        :color="$q.dark.isActive ? 'white' : 'green'"
        icon="brightness_medium"
        @click="toggleTheme"
      />
      <q-btn
        flat
        round
        :color="$q.dark.isActive ? 'white' : 'green'"
        v-show="!$q.platform.is.mobile"
        @click="$q.fullscreen.toggle()"
        :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
      />
    </q-toolbar>

    <DlgPDF :showDialog.sync="showDlgPDF" />
    <History :showDialog.sync="showHistory" />
  </q-header>
</template>

<script>
import { mapMutations } from 'vuex'
import { i18n } from '../boot/i18n'
import DlgPDF from '../components/ExportPDF'
import History from '../components/History'

export default {
  name: 'Header',
  components: {
    DlgPDF,
    History
  },
  data() {
    return {
      showDlgPDF: false,
      showHistory: false,
      logo: require('../assets/Vivitek Logo.png'),
      logo_white: require('../assets/Vivitek Logo_white.png')
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
        case 'jpn': import('quasar/lang/ja').then(lang => { this.$q.lang.set(lang.default) }); break
        case 'kr': import('quasar/lang/ko-kr').then(lang => { this.$q.lang.set(lang.default) }); break
        case 'viet': import('quasar/lang/vi').then(lang => { this.$q.lang.set(lang.default) }); break
      }
      this.$root.$emit('resetUnitLabel')
    },
    refreshViews() {
      this.$root.$emit('resetPosition')
    },
    userGuide() {
      window.open(`${location.origin}/guide/User's Manual.pdf`)
    },
    toggleTheme() {
      this.$q.dark.toggle()
      this.$root.$emit('resizeRoom')
      this.$root.$emit('setTheme')
    }
  }
}
</script>
