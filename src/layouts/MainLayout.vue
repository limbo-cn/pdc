<template>
  <q-layout view="HHH LpR LFF">
    <Header />
    <LeftSide />
    <Footer />
    <MainPage />
  </q-layout>
</template>

<script>
import Header from './Header'
import LeftSide from './LeftSide/Index'
import Footer from './Footer'
import MainPage from './MainPage'

export default {
  name: 'MainLayout',
  components: { Header, LeftSide, Footer, MainPage },
  data() {
    return {
    }
  }
}
</script>
