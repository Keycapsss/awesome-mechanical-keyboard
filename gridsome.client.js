import { config, library } from '@fortawesome/fontawesome-svg-core'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { faKeyboard } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import '@fortawesome/fontawesome-svg-core/styles.css'

// Make sure you tell Font Awesome to skip auto-inserting CSS into the <head>
config.autoAddCss = false;
library.add(faGithub, faKeyboard)

export default function (Vue) {
  Vue.component('font-awesome', FontAwesomeIcon)
}