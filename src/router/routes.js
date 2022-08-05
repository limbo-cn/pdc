
import MainLayout from 'layouts/MainLayout'
// import SelectSoftware from 'layouts/SelectSoftware'
import Full from 'layouts/full'
import Full2 from 'layouts/full2'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', component: () => import('pages/Error404.vue') }
    ]
  },
  {
    path: '/index/:modelname?',
    component: MainLayout,
    children: [
      { path: '', component: () => import('pages/Error404.vue') }
    ]
  },
  {
    path: '/full',
    component: Full,
    children: [
      { path: '', component: () => import('pages/Error404.vue') }
    ]
  },
  {
    path: '/full2',
    component: Full2,
    children: [
      { path: '', component: () => import('pages/Error404.vue') }
    ]
  },
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
