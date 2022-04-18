<template>
  <q-footer reveal :style="{background:$q.dark.isActive?'#1e1f26':'#3aaa35'}">
    <q-toolbar class="glossy" style="height:30px;min-height:30px;">
      <template v-if="!$q.platform.is.mobile">
        <q-btn
          flat
          dense
          @click="setLayoutModel('grid')"
          :class="{selected:layoutModel===`grid`}"
          icon="grid_view"
          class="text-caption"
        />
        <q-btn
          flat
          dense
          @click="setLayoutModel('list')"
          :class="{selected:layoutModel===`list`}"
          icon="format_line_spacing"
          class="text-caption"
        />
        <q-btn
          flat
          dense
          @click="setLayoutModel('fullscreen')"
          :class="{selected:layoutModel===`fullscreen`}"
          icon="crop_free"
          class="text-caption"
        />
      </template>

      <q-toolbar-title class="text-caption text-right">
        <q-btn flat dense icon="error_outline" class="text-caption">
          <q-tooltip>
            <ul>
              <li>{{$t('disclaimer1')}}</li>
              <li>{{$t('disclaimer2')}}</li>
              <li>{{$t('disclaimer3')}}</li>
              <li>{{$t('disclaimer4')}}</li>
            </ul>
          </q-tooltip>
        </q-btn>PJ-Calc v 1.2.4 © Copyright 2021 Vivitek. All Rights Reserved. |
        <a
          href="https://www.vivitek.eu/support/contact-support"
          target="_blank"
          class="text-white"
        >Contact Us</a>
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
  color: $primary !important;
}
</style>
