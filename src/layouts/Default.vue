<template>
  <div class="content-wrapper">
    <Header />

    <div class="container w-full flex flex-wrap mx-auto px-4">
      <slot/>
    </div>

    <Footer />

  </div>
</template>

<static-query>
query {
  metaData {
    siteName
  }
}
</static-query>

<script>
import Header from './partials/Header'
import Footer from './partials/Footer'

export default {
  components: {
    Header,
    Footer,
  }
};
</script>