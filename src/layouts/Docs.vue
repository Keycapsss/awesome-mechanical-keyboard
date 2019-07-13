<template>
  <Layout>
      <!-- Sidebar Nav -->
      <div v-if="links" class="w-full lg:w-1/5 p-6 pl-0 text-gray-800 leading-normal"> 
        <template v-for="(group, i1) in links">
          <!-- Section headline not needed -->
          <!-- <p class="font-bold py-2 lg:pb-6 text-gray-700"
            :key="`title-${i1}`">
            {{ group.title }}
          </p> -->
          <!-- Fake dropdown field as menu toggle for mobile view -->
          <div class="block lg:hidden sticky inset-0">
            <button id="side-nav-toggle"
                    class="flex w-full justify-end px-3 py-3 bg-white lg:bg-transparent border rounded border-gray-500 hover:border-primary appearance-none focus:outline-none">
              <svg class="fill-current h-3 float-right" 
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </button>
          </div>          
          <div id="menu-content"
              class="w-full sticky inset-0 h-64 lg:h-auto overflow-x-hidden overflow-y-auto lg:overflow-y-hidden lg:block mt-0 border border-gray-400 rounded-b lg:border-transparent bg-white shadow lg:shadow-none lg:bg-transparent z-20"
              :class="{hidden: !showDropdownMenu}">
            <ul class="list-reset ml-2 lg:ml-0">
              <li v-for="(item, i2) in group.items"
                  class="">
                <g-link :to="item.link" :key="`link-${i1}-${i2}`"
                        class="block my-2 pl-0 align-middle border-transparent lg:border-secondary lg:hover:border-secondary-light">
                  {{ item.title }}
                </g-link>
                <!-- Submenu -->
                <ul v-if="item.link === currentPath && subtitles && subtitles.length" :key="`submenu-${i1}-${i2}`"
                    class="ml-0">
                  <li v-for="subtitle in subtitles"
                      class="block py-2 pl-4 align-middle hover:text-primary-dark border-transparent lg:border-l-4 lg:border-primary lg:hover:border-secondary">
                    <g-link :to="item.link + subtitle.anchor"
                            class="hover:text-primary">
                      {{ subtitle.value }}
                    </g-link>
                  </li>
                </ul>
                <!-- /Submenu -->
              </li>
            </ul>
          </div>
        </template>
      </div>
      <!-- /Sidebar Nav -->
      <!-- Content -->
      <div class="w-full lg:w-4/5 lg:p-8 lg:mt-0 leading-normal bg-white lg:border-l border-gray-300">
        <slot />
        <hr class="mt-10 border-b border-gray-400">
        <p>
          <a :href="editLink" target="_blank">
            <font-awesome :icon="['fab', 'github']" class="mr-1"/>
            <span>Edit this page on GitHub</span>
          </a>
        </p>
      </div>
      <!-- /Content -->
      <!--Back link -->
      <div class="w-full lg:w-4/5 lg:ml-auto text-base">        
        <nav class="flex">
          <div class="flex-grow text-left pl-10 py-6">
            <g-link v-if="previousPage" :to="previousPage.link"
                    class="text-base md:text-sm font-bold text-gray-400">
              <span class="text-base font-bold">&lt;</span>
              {{ previousPage.title }}
            </g-link>
          </div>
          <div class="flex-grow text-right pr-8 py-6">
            <g-link v-if="nextPage" :to="nextPage.link"
                    class="text-base md:text-sm font-bold text-gray-400">
              {{ nextPage.title }}
              <span class="text-base font-bold">&gt;</span>
            </g-link>
          </div>
        </nav>
      </div>    
  </Layout>
</template>

<script>
export default {
  data () {
    return {
      showDropdownMenu: false
    }
  },
  methods: {
  },
  mounted: function () {
    const that = this
    
    // Attach event listener to the root vue element
    this.$el.addEventListener('click', function (ev) {
      if (ev.target.id === 'side-nav-toggle') {        
        // click on the sidebar menu fake dropdown in mobile view
        that.showDropdownMenu = !that.showDropdownMenutrue

      } else {
        // click not on the sidebar menu fake dropdown in mobile view
        that.showDropdownMenu = false
      }
    })
  },
  props: {
    subtitles: Array,
    links: Array
  },
  computed: {
    currentPath () {
      return this.$route.path
    },
    editLink () {
      let path = this.currentPath
      if((path.match(new RegExp("/", "g")) || []).length == 1) path = path + '/README'
      return `https://github.com/BenRoe/awesome-mechanical-keyboard/blob/master${path}.md`
    },
    items () {
      return this.links.reduce((acc, group) => (acc.push(...group.items), acc), [])
    },
    currentIndex () {
      return this.items.findIndex(item => item.link === this.$route.path)
    },
    nextPage () {
      return this.items[this.currentIndex + 1]
    },
    previousPage () {
      return this.items[this.currentIndex - 1]
    }
  }
}
</script>

