<template>
  <q-layout view="HHH LpR LFF">
    <q-header reveal :style="{ background: $q.dark.isActive ? '#1e1f26' : 'white' }">
      <q-toolbar class="shadow-2">
        <img
          :src="logo"
          :style="{ background: !$q.dark.isActive ? 'white' : '' }"
          class="rounded-borders"
          style="margin:auto;height:40px;padding:2px;max-width:150px;"
        />
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-page style="background-color: #eee;">
        <div class="q-pa-md row items-start justify-center q-gutter-lg">
          <q-card bordered>
            <q-card-section>
              <div class="text-h6 q-mb-xs text-center">Standard ( Single Projection )</div>
            </q-card-section>
            <q-img src="../assets/pdc.jpg" style="width: 700px;height:350px" />

            <!-- <q-card-section>
              <div class="text-overline text-orange-9">Overline</div>
              <div class="text-h5 q-mt-sm q-mb-xs">Title</div>
              <div
                class="text-caption text-grey"
              >Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
            </q-card-section>-->

            <q-card-actions class="justify-center">
              <q-btn flat color="positive" label="ENTER →" @click="openPdc" />
            </q-card-actions>
          </q-card>
          <q-card bordered>
            <q-card-section>
              <div class="text-h6 q-mb-xs text-center">Advanced ( Multi Projection )</div>
            </q-card-section>
            <q-img src="../assets/mps.jpg" style="width: 700px;;height:350px" />

            <!-- <q-card-section>
              <div class="text-overline text-orange-9">Overline</div>
              <div class="text-h5 q-mt-sm q-mb-xs">Title</div>
              <div
                class="text-caption text-grey"
              >Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
            </q-card-section>-->

            <q-card-actions class="justify-center">
              <q-btn flat color="positive" label="ENTER →" @click="openMps" />
            </q-card-actions>
          </q-card>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>

export default {
  name: 'SelectSoftware',
  components: {},
  data() {
    return {
      logo: require('../assets/Vivitek Logo.png')
    }
  },
  methods: {
    openPdc() {
      this.$router.push('/index')
    },
    openMps() {
      window.location.href = 'https://vivitek-multi-projection.github.io/'
    }
  }
}
</script>
