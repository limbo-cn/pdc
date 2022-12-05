<template>
  <q-drawer v-model="leftDrawerOpen" show-if-above bordered :width="$q.platform.is.mobile ? 300 : 400"
    :side="isDP?'right':'left'">
    <q-scroll-area class="fit">
      <q-list>
        <div>
          <q-expansion-item dense :header-class="$q.dark.isActive ? 'left-header-dark' : 'left-header-light'"
            default-opened expand-icon-toggle expand-icon-class="hidden">
            <template v-slot:header>
              <q-item-section>
                {{ $t('projector') }}
              </q-item-section>
              <q-item-section avatar>
                <q-btn size="sm" flat round icon="search" @click="showDlgChooseProjector = true" />
              </q-item-section>
              <q-item-section avatar v-if="$q.platform.is.mobile" @click="leftDrawerOpen = false">
                <q-btn size="sm" flat round icon="close" @click="leftDrawerOpen = false" />
              </q-item-section>
            </template>
            <Projector />
          </q-expansion-item>
          <q-expansion-item dense :header-class="$q.dark.isActive ? 'left-header-dark' : 'left-header-light'"
            default-opened expand-icon-toggle>
            <template v-slot:header>
              <q-item-section>
                {{ $t('optionalLens') }}
              </q-item-section>
              <q-item-section avatar v-if="selectedLens">
                <q-btn size="sm" flat round icon="search" @click="showDlgChooseLens = true" />
              </q-item-section>
            </template>
            <Lens />
          </q-expansion-item>
        </div>
        <q-expansion-item dense :header-class="$q.dark.isActive ? 'left-header-dark' : 'left-header-light'"
          default-opened :label="$t('basicSettings')">
          <BasicSettings />
        </q-expansion-item>
        <q-expansion-item dense :header-class="$q.dark.isActive ? 'left-header-dark' : 'left-header-light'"
          default-opened :label="$t('roomSize')">
          <RoomSize />
        </q-expansion-item>
        <q-expansion-item dense :header-class="$q.dark.isActive ? 'left-header-dark' : 'left-header-light'"
          default-opened expand-icon-toggle>
          <template v-slot:header>
            <q-item-section>
              {{ $t('screenSize') }}
            </q-item-section>
            <q-toggle v-model="enableScreenSize" @input="changeEnableScreenSize" checked-icon="lock_open"
              unchecked-icon="lock" color="positive" />
          </template>
          <ScreenSize ref="screensize" />
        </q-expansion-item>
        <q-expansion-item dense :header-class="$q.dark.isActive ? 'left-header-dark' : 'left-header-light'"
          default-opened :label="$t('screenPosition')">
          <ScreenPosition />
        </q-expansion-item>
        <q-expansion-item dense :header-class="$q.dark.isActive ? 'left-header-dark' : 'left-header-light'"
          default-opened :label="$t('projectorPosition')">
          <Position />
        </q-expansion-item>
        <q-expansion-item dense :header-class="$q.dark.isActive ? 'left-header-dark' : 'left-header-light'"
          default-opened :label="$t('ambientLightSettings')">
          <Ambient :isFloatingAmbient.sync="isFloatingAmbient" @changeArrowtop="changeArrowtop" />
        </q-expansion-item>
      </q-list>
    </q-scroll-area>

    <div class="absolute" style="top: 50%; right: -14px">
      <q-btn dense size="sm" round :color="$q.dark.isActive ? 'secondary' : 'positive'" icon="arrow_left"
        @click="leftDrawerOpen = false" />
    </div>

    <div class="absolute" style="bottom: 10px; left: 5px" v-show="isFloatingAmbient">
      <div class="row q-pt-sm q-pl-sm q-pr-sm row q-gutter-md">
        <div class="col" style="margin:15px 5px;position: relative">
          <div class="q-pa-sm text-h6" style="position:absolute;top:0;left:0;color:white">
            {{ambientLabel}}
          </div>
          <div class="q-pa-xs" style="position:absolute;top:0;right:0;">
            <q-btn round flat color="white" icon="close" @click="isFloatingAmbient = false" />
          </div>
          <img src="../../assets/projection_best.jpg" v-show="arrowTop<12"
            style="background-size:contain;width:100%;height:100%" usemap="#projectionMap" />
          <img src="../../assets/projection_good.jpg" v-show="arrowTop>=12 && arrowTop<33"
            style="background-size:contain;width:100%;height:100%" usemap="#projectionMap" />
          <img src="../../assets/projection_enough.jpg" v-show="arrowTop>=33 && arrowTop<53"
            style="background-size:contain;width:100%;height:100%" usemap="#projectionMap" />
          <img src="../../assets/projection_limit.jpg" v-show="arrowTop>=53 && arrowTop<73"
            style="background-size:contain;width:100%;height:100%" usemap="#projectionMap" />
          <img src="../../assets/projection_low.jpg" v-show="arrowTop>=73"
            style="background-size:contain;width:100%;height:100%" usemap="#projectionMap" />
          <div class="row" style="height: 10px;position: absolute;top: 100%;width: 100%;">
            <div class="col" style="height:100%;background-color:rgb(218, 227, 243)" />
            <div class="col" style="height:100%;background-color:rgb(180, 199, 231)" />
            <div class="col" style="height:100%;background-color:rgb(143, 170, 220)" />
            <div class="col" style="height:100%;background-color:rgb(47, 85, 151)" />
            <div class="col" style="height:100%;background-color:rgb(32, 56, 100)" />
            <div style="position: absolute;height: 100%;background:#1bff61;width: 6px;" :style="{left:`${arrowTop}%`}">
              <div style="color:#1bff61;position: absolute;top: -20px;left: -3px;">⏷</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <DlgChooseProjector :showDialog.sync="showDlgChooseProjector" />
    <DlgChooseLens :showDialog.sync="showDlgChooseLens" />
  </q-drawer>
</template>

<script>
import { mapMutations } from 'vuex'

import Projector from './Projector'
import Lens from './Lens'
import RoomSize from './RoomSize'
import BasicSettings from './BasicSettings'
import ScreenSize from './ScreenSize'
import ScreenPosition from './ScreenPosition'
import Position from './Position'
import Ambient from './Ambient'

import DlgChooseProjector from '../../components/DlgChooseProjector'
import DlgChooseLens from '../../components/DlgChooseLens'

export default {
  name: 'LeftSide',
  components: {
    Projector,
    Lens,
    BasicSettings,
    RoomSize,
    ScreenSize,
    ScreenPosition,
    Position,
    Ambient,
    DlgChooseProjector,
    DlgChooseLens
  },
  data() {
    return {
      showDlgChooseProjector: true,
      showDlgChooseLens: false,
      arrowTop: 5,
      isFloatingAmbient: false
    }
  },
  computed: {
    isDP() {
      return this.$store.state.dataSource.isDP
    },
    leftDrawerOpen: {
      get() {
        return this.$store.state.common.leftDrawerOpen
      },
      set(val) {
        this.SET_LEFT_DRAWER_OPEN(val)
      }
    },
    selectedLens() {
      return this.$store.getters['dataSource/selectedLens']
    },
    enableScreenSize: {
      get() {
        return !this.$store.state.screen.lockScreenSize
      },
      set(val) {
        this.SET_LOCK_SCREENSIZE(!val)
      }
    },
    ambientLabel() {
      if (this.arrowTop < 12) {
        return this.$t('high')
      } else if (this.arrowTop < 33) {
        return this.$t('bright')
      } else if (this.arrowTop < 53) {
        return this.$t('suitable')
      } else if (this.arrowTop < 73) {
        return this.$t('limit')
      }

      return this.$t('tooLow')
    }
  },
  methods: {
    ...mapMutations('common', ['SET_LEFT_DRAWER_OPEN']),
    ...mapMutations('screen', ['SET_LOCK_SCREENSIZE']),
    changeEnableScreenSize() {
      this.$refs.screensize.changeEnableScreenSize()
    },
    changeArrowtop(val) {
      this.arrowTop = val
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ .left-header {
  background-color: #445a4d;
  font-size: 16px;
}

/deep/ .left-header-dark {
  background-color: #445a4d;
  font-size: 16px;
  padding: 10px 16px;
}

/deep/ .left-header-light {
  background-color: #f2f2f2;
  font-size: 16px;
  padding: 10px 16px;
}
</style>
