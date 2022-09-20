<template>
  <q-dialog :value="showDialog" @hide="hideDialog" @show="show" full-height full-width>
    <q-layout v-if="showDialog" view="hHh lpR lFf" container
      :class="{ 'bg-grey-10': $q.dark.isActive, 'bg-white': !$q.dark.isActive }">
      <q-header>
        <div style="height:8px" class="delta-gradient-bg"></div>
        <q-toolbar class="shadow-2"
          :style="{ background: $q.dark.isActive ? '#222222' : '#ffffff', color: $q.dark.isActive ? '#ffffff' : '#222222' }">
          <q-btn flat @click="drawerLeft = !drawerLeft" round dense icon="menu" />
          <q-toolbar-title>{{ $t('historyTitle') }}</q-toolbar-title>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-toolbar>
      </q-header>

      <q-drawer show-if-above v-model="drawerLeft" side="left" bordered :width="400">
        <q-scroll-area class="fit">
          <q-list padding>
            <q-item v-if="currentItem" clickable :active="true" @click="selectedId = currentItem.uId">
              <q-item-section>
                <q-card class="item-card" :class="{ selected: selectedId === currentItem.uId }" bordered>
                  <q-img :src="currentItem.frontViewImage" :img-style="{ 'background-size': 'contain' }" />
                  <q-separator />
                  <q-item>
                    <q-item-section avatar>
                      <q-avatar rounded size="60px">
                        <q-img :src="currentItem.projectorImage" :img-style="{ 'background-size': 'contain' }" />
                      </q-avatar>
                    </q-item-section>

                    <q-item-section>
                      <q-input outlined :color="$q.dark.isActive ? 'primary' : 'positive'" v-model="currentName"
                        :label="$t('customName')" />
                    </q-item-section>

                    <q-item-section style="flex:40px">
                      <q-btn round :color="$q.dark.isActive ? 'primary' : 'positive'" flat label="" icon="add"
                        @click.prevent="addItem" />
                    </q-item-section>
                  </q-item>
                </q-card>
              </q-item-section>
            </q-item>
            <q-item v-for="history in historys" :key="history.uId" clickable :active="selectedId === history.uId"
              @click="selectedId = history.uId">
              <q-item-section>
                <q-card class="item-card" :class="{ selected: selectedId === history.uId }" bordered>
                  <q-img :src="history.frontViewImage"
                    :img-style="{ 'background-size': 'contain', 'background-color': history.isDark ? '#131417' : 'white' }" />
                  <q-separator />
                  <q-item>
                    <q-item-section avatar>
                      <q-avatar rounded size="60px">
                        <q-img :src="history.projectorImage" :img-style="{ 'background-size': 'contain' }" />
                      </q-avatar>
                    </q-item-section>

                    <q-item-section>
                      <q-item-label style="font-size:20px">{{ history.name }}</q-item-label>
                      <q-item-label style="font-size:14px" caption>{{ history.modelName }}</q-item-label>
                    </q-item-section>

                    <q-item-section style="flex:40px">
                      <q-btn :color="$q.dark.isActive ? 'primary' : 'positive'" round flat label=""
                        icon="delete_outline" @click.prevent="deleteItem(history.uId)" />
                    </q-item-section>
                    <!-- <q-item-section style="flex:40px">
                      <q-btn :color="$q.dark.isActive?'primary':'positive'" round flat label="" icon="compare_arrows" @click.prevent="updateItem(history.uId)" />
                    </q-item-section> -->
                    <q-item-section style="flex:40px">
                      <q-btn :color="$q.dark.isActive ? 'primary' : 'positive'" round flat label="" icon="check"
                        @click.prevent="loadItem(history.uId)" />
                    </q-item-section>
                  </q-item>
                </q-card>
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </q-drawer>

      <q-page-container style="min-width:1400px">
        <q-page>
          <template v-if="currentSelectedItem">
            <div class="text-h4 q-ml-lg q-pa-md">{{ currentSelectedItem.name }}
            </div>
            <div class="q-pa-sm row items-start q-gutter-sm">
              <div class="col-2">
                <div class="text-h6 text-center q-pa-md">{{ currentSelectedItem.modelName }}
                </div>
                <q-img :src="currentSelectedItem.projectorImage" :img-style="{ 'background-size': 'contain' }"
                  style="width:70%;margin-left:15%" />
                <template v-if="currentSelectedItem.lensImage">
                  <div class="text-h6 text-center q-pa-md">{{ currentSelectedItem.lensName }}
                  </div>
                  <q-img :src="currentSelectedItem.lensImage" :img-style="{ 'background-size': 'contain' }"
                    style="width:70%;margin-left:15%" />
                </template>
                <div class="text-overline text-center q-pt-lg q-pb-xs"> {{ $t('installation') }}:{{ Installation }}
                </div>
                <div class="text-overline text-center q-pb-xs"> {{ $t('diagonal') }}:{{ screenDiagonal }}''
                </div>
              </div>
              <div class="col">
                <div class="q-pa-sm row items-start q-gutter-sm">
                  <div class="col" style="margin:auto 20px">
                    <div class="text-h6 text-center">{{ $t('sideView') }}
                    </div>
                    <q-img :src="curSideViewImage"
                      :img-style="{ 'background-size': 'contain', 'background-color': currentSelectedItem.isDark ? '' : 'white' }"
                      style="width:100%" />
                  </div>
                  <div class="col" style="margin:auto 20px">
                    <div class="text-h6 text-center">{{ $t('frontView') }}
                    </div>
                    <q-img :src="curFrontViewImage"
                      :img-style="{ 'background-size': 'contain', 'background-color': currentSelectedItem.isDark ? '' : 'white' }"
                      style="width:100%" />
                  </div>
                </div>
                <div class="q-pa-sm row items-start q-gutter-sm">
                  <div class="col" style="margin:auto 20px">
                    <div class="text-h6 text-center">{{ $t('topView') }}
                    </div>
                    <q-img :src="curTopViewImage"
                      :img-style="{ 'background-size': 'contain', 'background-color': currentSelectedItem.isDark ? '' : 'white' }"
                      style="width:100%" />
                  </div>
                  <div class="col" style="margin:auto 20px">
                    <div class="text-h6 text-center">{{ $t('threeView') }}
                    </div>
                    <q-img :src="curThreeViewImage"
                      :img-style="{ 'background-size': 'contain', 'background-color': currentSelectedItem.isDark ? '' : 'white' }"
                      style="width:100%" />
                  </div>
                </div>
              </div>
            </div>
          </template>
        </q-page>
      </q-page-container>

      <q-footer style="background:#445a4d" v-show="false">
        <q-toolbar class="glossy">
          <q-space />
          <q-input outlined v-model="currentName" dense :label="$t('customName')"
            v-show="currentItem && selectedId === currentItem.uId" style="margin:auto 10px" />
          <q-btn flat :color="$q.dark.isActive ? 'primary' : 'positive'" icon="add" :label="$t('add')"
            v-show="currentItem && selectedId === currentItem.uId" @click="addItem" />
          <q-btn flat :color="$q.dark.isActive ? 'primary' : 'positive'" icon="delete_outline" :label="$t('delete')"
            v-show="!currentItem || selectedId !== currentItem.uId" @click="deleteItem(selectedId)" />
          <q-btn flat :color="$q.dark.isActive ? 'primary' : 'positive'" icon="check" :label="$t('load')"
            v-show="!currentItem || selectedId !== currentItem.uId" @click="loadItem(selectedId)" />
        </q-toolbar>
      </q-footer>

      <q-dialog v-model="showConfirmDelete" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar icon="delete_outline" :color="$q.dark.isActive ? 'primary' : 'positive'" text-color="black" />
            <span class="q-ml-sm">{{ $t('confirmDeleteMessage') }}</span>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat :label="$t('cancel')" :color="$q.dark.isActive ? 'primary' : 'positive'" v-close-popup />
            <q-btn flat :label="$t('yes')" :color="$q.dark.isActive ? 'primary' : 'positive'"
              @click="confirmDeleteItem" />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="showConfirmUpdate" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar icon="compare_arrows" :color="$q.dark.isActive ? 'primary' : 'positive'" text-color="black" />
            <span class="q-ml-sm">{{ $t('confirmUpdateMessage') }}</span>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat :label="$t('cancel')" :color="$q.dark.isActive ? 'primary' : 'positive'" v-close-popup />
            <q-btn flat :label="$t('yes')" :color="$q.dark.isActive ? 'primary' : 'positive'"
              @click="confirmUpdateItem" />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="showAlertMax">
        <q-card>

          <q-card-section class="q-pt-none">
            {{ $t('maximumCount') }}
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat :label="$t('yes')" :color="$q.dark.isActive ? 'primary' : 'positive'" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

    </q-layout>
  </q-dialog>
</template>

<script>
import { mapMutations } from 'vuex'
import _ from 'lodash'
import { toFixedNumber } from 'src/helper/common'
import { installationType, unitRatio } from 'src/helper/enum'

export default {
  name: 'History',
  props: ['showDialog'],
  data() {
    return {
      drawerLeft: true,
      selectedId: 0,
      currentItem: null,
      currentName: '',
      showConfirmDelete: false,
      showConfirmUpdate: false,
      uIdToOpr: 0,
      showAlertMax: false
    }
  },
  computed: {
    historys() {
      const historys = _.cloneDeep(this.$store.state.history.historys)
      historys.forEach(o => {
        o.frontViewImage = localStorage.getItem(`${o.uId}-frontViewImage`)
      })
      return historys
    },
    currentSelectedItem() {
      if (this.selectedId === this.currentItem?.uId) {
        return this.currentItem
      }
      return this.historys.find(o => o.uId === this.selectedId)
    },
    curSideViewImage() {
      return localStorage.getItem(`${this.currentSelectedItem.uId}-sideViewImage`) || this.currentItem.sideViewImage
    },
    curFrontViewImage() {
      return localStorage.getItem(`${this.currentSelectedItem.uId}-frontViewImage`) || this.currentItem.frontViewImage
    },
    curTopViewImage() {
      return localStorage.getItem(`${this.currentSelectedItem.uId}-topViewImage`) || this.currentItem.topViewImage
    },
    curThreeViewImage() {
      return localStorage.getItem(`${this.currentSelectedItem.uId}-threeViewImage`) || this.currentItem.threeViewImage
    },
    sideViewImage() {
      return this.$store.state.pdf.sideViewImage
    },
    frontViewImage() {
      return this.$store.state.pdf.frontViewImage
    },
    topViewImage() {
      return this.$store.state.pdf.topViewImage
    },
    threeViewImage() {
      return this.$store.state.pdf.threeViewImage
    },
    screenDiagonal() {
      if (!this.currentSelectedItem) {
        return 0
      }
      return toFixedNumber(this.currentSelectedItem.screen.diagonal * unitRatio.inch, 3) // inch
    },
    Installation() {
      if (!this.currentSelectedItem) {
        return 0
      }
      return this.currentSelectedItem.common.installation === installationType.desktop ? this.$t('desktop') : this.$t('ceiling')
    }
  },
  methods: {
    ...mapMutations('history', ['ADD_ITEM', 'DELETE_ITEM', 'UPDATE_ITEM']),
    ...mapMutations('dataSource', ['SET_SELECTED_MODEL_NAME', 'SET_SELECTED_LENS_NAME']),
    ...mapMutations('common', ['SET_COMMON_HISTORY']),
    ...mapMutations('room', ['SET_ROOM_HISTORY']),
    ...mapMutations('lens', ['SET_LENS_HISTORY']),
    ...mapMutations('projector', ['SET_PROJECTOR_HISTORY']),
    ...mapMutations('screen', ['SET_SCREEN_HISTORY']),
    ...mapMutations('ambient', ['SET_AMBIENT_HISTORY']),
    hideDialog() {
      this.selectedId = 0
      this.currentItem = null
      this.$emit('update:showDialog', false)
    },
    show() {
      this.$root.$emit('generatePDF') // to generate image
      this.initCurrentItem()
    },
    initCurrentItem() {
      const uId = new Date().getTime()

      const sideViewImage = _.cloneDeep(this.sideViewImage)
      const frontViewImage = _.cloneDeep(this.frontViewImage)
      const topViewImage = _.cloneDeep(this.topViewImage)
      const threeViewImage = _.cloneDeep(this.threeViewImage)

      const item = {
        uId: uId,
        name: this.$t('currentSnapshot'),
        modelName: _.cloneDeep(this.$store.state.dataSource.selectedModelName),
        lensName: _.cloneDeep(this.$store.state.dataSource.selectedLensName),
        projectorImage: _.cloneDeep(require(`../assets/${this.$store.getters['dataSource/selectedProjector'].Picture}`)),
        lensImage: _.cloneDeep(this.$store.getters['dataSource/selectedLens'] ? require(`../assets/${this.$store.getters['dataSource/selectedLens'].Picture}`) : null),
        sideViewImage: sideViewImage,
        frontViewImage: frontViewImage,
        topViewImage: topViewImage,
        threeViewImage: threeViewImage,
        common: _.cloneDeep(this.$store.state.common),
        room: _.cloneDeep(this.$store.state.room),
        lens: _.cloneDeep(this.$store.state.lens),
        projector: _.cloneDeep(this.$store.state.projector),
        screen: _.cloneDeep(this.$store.state.screen),
        ambient: _.cloneDeep(this.$store.state.ambient),
        isDark: this.$q.dark.isActive
      }

      this.currentName = ''
      this.currentItem = item
      this.selectedId = this.currentItem.uId
    },
    addItem() {
      if (!this.currentName) {
        return
      }
      if (this.historys.length >= 10) {
        this.showAlertMax = true
        return
      }

      localStorage.setItem(`${this.currentItem.uId}-sideViewImage`, this.currentItem.sideViewImage)
      localStorage.setItem(`${this.currentItem.uId}-frontViewImage`, this.currentItem.frontViewImage)
      localStorage.setItem(`${this.currentItem.uId}-topViewImage`, this.currentItem.topViewImage)
      localStorage.setItem(`${this.currentItem.uId}-threeViewImage`, this.currentItem.threeViewImage)

      this.currentItem.sideViewImage = `${this.currentItem.uId}-sideViewImage`
      this.currentItem.frontViewImage = `${this.currentItem.uId}-frontViewImage`
      this.currentItem.topViewImage = `${this.currentItem.uId}-topViewImage`
      this.currentItem.threeViewImage = `${this.currentItem.uId}-threeViewImage`

      this.currentItem.name = this.currentName
      this.ADD_ITEM(this.currentItem)
      this.currentItem = null
    },
    loadItem(uId) {
      const history = this.historys.find(o => o.uId === uId)
      if (!history) {
        return
      }

      this.SET_SELECTED_MODEL_NAME(history.modelName)
      this.SET_SELECTED_LENS_NAME(history.lensName)

      setTimeout(() => {
        this.SET_COMMON_HISTORY(history.common)
        this.SET_ROOM_HISTORY(history.room)
        this.SET_LENS_HISTORY(history.lens)
        this.SET_PROJECTOR_HISTORY(history.projector)
        this.SET_SCREEN_HISTORY(history.screen)
        this.SET_AMBIENT_HISTORY(history.ambient)
        this.$root.$emit('setProjectorProp')
        this.hideDialog()
      }, 0)
    },
    updateItem(uId) {
      this.showConfirmUpdate = true
      this.uIdToOpr = uId
    },
    confirmUpdateItem() {
      localStorage.removeItem(`${this.uIdToOpr}-sideViewImage`)
      localStorage.removeItem(`${this.uIdToOpr}-frontViewImage`)
      localStorage.removeItem(`${this.uIdToOpr}-topViewImage`)
      localStorage.removeItem(`${this.uIdToOpr}-threeViewImage`)

      localStorage.setItem(`${this.currentItem.uId}-sideViewImage`, this.currentItem.sideViewImage)
      localStorage.setItem(`${this.currentItem.uId}-frontViewImage`, this.currentItem.frontViewImage)
      localStorage.setItem(`${this.currentItem.uId}-topViewImage`, this.currentItem.topViewImage)
      localStorage.setItem(`${this.currentItem.uId}-threeViewImage`, this.currentItem.threeViewImage)

      this.currentItem.sideViewImage = `${this.currentItem.uId}-sideViewImage`
      this.currentItem.frontViewImage = `${this.currentItem.uId}-frontViewImage`
      this.currentItem.topViewImage = `${this.currentItem.uId}-topViewImage`
      this.currentItem.threeViewImage = `${this.currentItem.uId}-threeViewImage`

      const newItem = _.cloneDeep(this.currentItem)
      newItem.name = this.currentSelectedItem.name
      this.UPDATE_ITEM({ oldUid: this.uIdToOpr, newItem: newItem })
      this.currentItem = null
      this.showConfirmUpdate = false
    },
    deleteItem(uId) {
      this.showConfirmDelete = true
      this.uIdToOpr = uId
    },
    confirmDeleteItem() {
      localStorage.removeItem(`${this.uIdToOpr}-sideViewImage`)
      localStorage.removeItem(`${this.uIdToOpr}-frontViewImage`)
      localStorage.removeItem(`${this.uIdToOpr}-topViewImage`)
      localStorage.removeItem(`${this.uIdToOpr}-threeViewImage`)

      this.DELETE_ITEM(this.uIdToOpr)
      this.showConfirmDelete = false
    }
  }
}
</script>
<style lang="scss" scoped>
.item-card {
  width: 100%;
}

.selected {
  border-color: #90e4a0;
  box-shadow: 0 0 10px rgba(150, 150, 150, 0.8);
}
</style>
