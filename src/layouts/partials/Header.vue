<template>
  <header class="bg-white">
    <nav id="header" class="w-full z-10 top-0 bg-white border-b border-gray-300">
      <div class="w-full container mx-auto flex flex-wrap items-center justify-between mt-0 py-4">
        <!-- Logo -->
        <div class="pl-4 flex items-center">
          <g-link to="/">
            <font-awesome
              :icon="['fas', 'keyboard']"
              class="mr-2 text-primary-light hover:text-primary"
              size="2x"
            ></font-awesome>
          </g-link>
          <g-link
            to="/"
            class="text-secondary group-hover:text-secondary-dark text-base no-underline hover:no-underline font-extrabold text-xl"
          >Keebfol.io</g-link>
        </div>
        <!-- Mobile Menu Button -->
        <div class="block lg:hidden pr-4">
          <button
            id="main-nav-toggle"
            class="flex items-center px-3 py-2 border rounded text-gray-500 border-gray-500 hover:text-primary hover:border-primary appearance-none focus:outline-none"
          >
            <svg
              class="fill-current h-3 w-3"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
          </button>
        </div>
        <!-- /Mobile Menu Button -->
        <div
          id="nav-content"
          class="w-full flex-grow lg:flex lg:content-center lg:items-center lg:w-auto lg:block mt-2 lg:mt-0 z-20"
          :class="{hidden: !showMobileMenu}"
        >
          <div class="flex-1 w-full mx-auto max-w-sm content-center py-4 lg:py-0">
            <div class="relative pull-right pl-4 pr-4 md:pr-0">
              <!-- <input type="search" placeholder="Search" class="w-full bg-gray-100 text-sm text-gray-800 transition border focus:outline-none focus:border-purple-500 rounded py-1 px-2 pl-10 appearance-none leading-normal">
                     <div class="absolute search-icon" style="top: 0.375rem;left: 1.75rem;">
                        <svg class="fill-current pointer-events-none text-gray-800 w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                           <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"></path>
                        </svg>
              </div>-->
            </div>
          </div>
          <ul class="list-reset lg:flex justify-end items-center">
            <li class="mr-3 py-2 lg:py-0">
              <g-link to="/" class="inline-block py-2 px-4">Open Source Projects</g-link>
            </li>
            <li class="mr-3 py-2 lg:py-0">
              <g-link to="/switch-database" class="inline-block py-2 px-4">Switch Database</g-link>
            </li>
            <li>
            <a href="/rss.xml" class="inline-block py-2 px-4">
              <font-awesome :icon="['fas', 'rss']"></font-awesome>
            </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
// import SearchInput from "../../components/SearchInput";

export default {
  components: {
    //  SearchInput
  },
  data() {
    return {
      showMobileMenu: false,
      theme: ""
    };
  },
  methods: {},
  mounted: function() {
    const that = this;

    // Attach event listener to the root vue element
    this.$el.addEventListener("click", function(ev) {
      if (ev.target.id === "main-nav-toggle") {
        // clicked on the nav button in mobile view
        that.showMobileMenu = !that.showMobileMenu;
      } else {
        // click somewhere else, not on the nav button
        that.showMobileMenu = false;
      }
    });
  }
};
</script>
