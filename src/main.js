// This is the main.js file. Import global CSS and scripts here.
// The Client API can be used here. Learn more: gridsome.org/docs/client-api

// Add global components
import './assets/css/tailwind.css'
import DefaultLayout from '~/layouts/Default.vue'
import DocsLayout from '~/layouts/Docs.vue'

export default function (Vue, { router, head, isClient }) {
  // Set default layout as a global component
  Vue.component('Layout', DefaultLayout)
  Vue.component('DocsLayout', DocsLayout)
  // router.options.linkActiveClass = 'is-active'
}


