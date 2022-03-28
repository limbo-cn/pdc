<template>
  <div id="q-app">
    <router-view class="delta-font" />
  </div>
</template>
<script>
export default {
  name: 'App',
  created() {
    // this.$q.dark.set(true)
  }
}
</script>
<style lang="scss">
html{
  user-select: none;
}
</style>
