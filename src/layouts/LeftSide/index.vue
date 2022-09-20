<template>
  <q-drawer v-model="leftDrawerOpen" show-if-above bordered :width="$q.platform.is.mobile ? 300 : 400">
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
          <Ambient />
        </q-expansion-item>
      </q-list>
    </q-scroll-area>

    <div class="absolute" style="top: 50%; right: -14px">
      <q-btn dense size="sm" round :color="$q.dark.isActive ? 'secondary' : 'positive'" icon="arrow_left"
        @click="leftDrawerOpen = false" />
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
      showDlgChooseLens: false
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
    }
  },
  methods: {
    ...mapMutations('common', ['SET_LEFT_DRAWER_OPEN']),
    ...mapMutations('screen', ['SET_LOCK_SCREENSIZE']),
    changeEnableScreenSize() {
      this.$refs.screensize.changeEnableScreenSize()
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
