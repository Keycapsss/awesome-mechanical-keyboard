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
      <div class="w-full lg:w-4/5 lg:p-6 lg:mt-0 leading-normal bg-white">
        <slot />
        <!--Back link -->
        <div class="w-full lg:ml-auto mt-8 text-base">        
          <nav class="flex">
            <div class="flex-grow text-left">
              <g-link v-if="previousPage" :to="previousPage.link"
                      class="text-base md:text-sm font-bold text-gray-600">
                <font-awesome :icon="['fas', 'caret-left']" class="mr-1"/>
                {{ previousPage.title }}
              </g-link>
            </div>
            <div class="flex-grow text-right">
              <g-link v-if="nextPage" :to="nextPage.link"
                      class="text-base md:text-sm font-bold text-gray-600">
                {{ nextPage.title }}
                <font-awesome :icon="['fas', 'caret-right']" class="mr-1"/>
              </g-link>
            </div>
          </nav>
        </div>    
        <!-- /Content -->
        <!-- <hr class="mb-6 border-b border-gray-400"> -->
        <p class="mt-20">
          <a :href="editLink" target="_blank">
            <font-awesome :icon="['fab', 'github']" class="mr-1"/>
            <span>Edit this page on GitHub</span>
          </a>
        </p>
        <button v-on:click="modalShow">Suggest a Project</button>
<ClientOnly>    
<modal
  name="contact-form"
  :adaptive="true"
  :scrollable="true"
  height="auto"
>
  <div class="m-4">
    <div class="mb-4 font-bold text-xl text-center">
      Suggest new content
    </div>
    <div class="absolute top-0 right-0">
      <button v-on:click="modalHide">
        <font-awesome :icon="['far', 'window-close']" class="m-4"/>
      </button>
    </div>

    <form 
      name="newContent"
      method="post"
      v-on:submit.prevent="handleSubmit"
      action="/success/"
      data-netlify="true"
      data-netlify-honeypot="bot-field"
    > 

      <input type="hidden" name="form-name" value="newContent" />
      <p hidden>
        <label>
          Don’t fill this out: <input name="bot-field" />
        </label>
      </p>

      <div class="md:flex md:items-center mb-6">
        <div class="md:w-1/3 pb-2">
          <label for="name" class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
            Project Name
          </label>
        </div>
        <div class="md:w-2/3">
          <input type="text" name="name" v-model="formData.name" class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"/>
        </div>
      </div>

      <div class="md:flex md:items-center mb-6">
        <div class="md:w-1/3 pb-2">
          <label for="link" class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
            Link
          </label>
        </div>
        <div class="md:w-2/3">
          <input type="url" name="link" v-model="formData.link" class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"/>
        </div>
      </div>
      
      <div class="md:flex md:items-center mb-6">
        <div class="md:w-1/3 self-start">
          <label for="description" class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
            Short Description
          </label>
        </div>
        <div class="md:w-2/3">
          <textarea name="description" maxlength="300" v-model="formData.description" class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"></textarea>
        </div>
      </div>

      <div class="md:flex md:items-center">
        <div class="md:w-1/3"></div>
        <div class="md:w-1/3">
          <button type="submit" class="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded">Submit</button>
        </div>
      </div>
    
    </form>
  </div>
</modal>
</ClientOnly>  
      </div>
  </Layout>
</template>

<script>
export default {
  data () {
    return {
      showDropdownMenu: false,
      formData: {},
    }
  },
  methods: {
    modalShow () {
      if (process.isClient) {
      this.$modal.show('contact-form');
      }
    },
    modalHide () {
      if (process.isClient) {
      this.$modal.hide('contact-form');
      }
    },
    encode(data) {
      return Object.keys(data)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
        .join('&')
    },
    handleSubmit(e) {
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: this.encode({
          'form-name': e.target.getAttribute('name'),
          ...this.formData,
        }),
      })
      .then(() => this.$router.push('/success'))
      .catch(error => alert(error))
    }
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
      if((path.match(new RegExp("/(.+)", "g")) || []).length == 0) path = path + 'README'
      return `https://github.com/BenRoe/awesome-mechanical-keyboard/blob/master/docs${path}.md`
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

