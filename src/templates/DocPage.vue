<template>
  <DocsLayout :subtitles="$page.doc.subtitles" :links="links">
    <div class="md content" v-html="$page.doc.content"></div>
  </DocsLayout>
</template>

<page-query>
query DocPage ($path: String!) {
  doc: docPage (path: $path) {
    path
    title
    content
    headings (depth: h1) {
      value
    }
    subtitles: headings (depth: h2) {
      value
      anchor
    }
  }
}
</page-query>

<script>
import links from '@/data/doc-links.yaml'

export default {
  computed: {
    links () {
      return links
    }
  },
  metaInfo () {
    const { title, headings } = this.$page.doc

    return {
      title: title || (headings.length ? headings[0].value : undefined)
    }
  }
}
</script>