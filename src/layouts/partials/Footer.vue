<template>
  <footer class="bg-gray-100 border-t border-gray-300">
      <div class="container mx-auto flex py-8">
        <div class="w-full mx-auto flex flex-wrap">
          <div class="flex w-full">
            <div class="px-8">
                <h3 class="font-bold text-gray-900">
                  <font-awesome :icon="['fas', 'heart']" class="mr-1" size="xs"></font-awesome>
                  Sponsor
                </h3>
                <ul class="flex flex-wrap">
                  <li v-for="edge in $static.allSponsors.edges" :key="edge.node.id"
                      class="m-4 text-xs text-gray-600">
                    <a v-bind:href="edge.node.url">
                      <img v-bind:src="edge.node.avatarUrl"
                            class="mx-auto mb-1 w-10 h-10 rounded-full"/>
                      {{ edge.node.login }}
                    </a>
                  </li>
                </ul>
            </div>
          </div>

          <div class="flex w-full">
            <div class="px-8">
                <h3 class="font-bold text-gray-900">Contributors</h3>
                <ul class="flex flex-wrap">
                  <li v-for="edge in $static.allContributors.edges" :key="edge.node.id"
                      class="m-4 text-xs text-gray-600">
                    <a v-bind:href="edge.node.url">
                      <img v-bind:src="edge.node.avatar_url"
                            class="mx-auto mb-1 w-10 h-10 rounded-full"/>
                      {{ edge.node.name }}
                    </a>
                  </li>
                </ul>
            </div>
          </div>
        </div>
      </div>
  </footer>
</template>

<static-query>
query {
  allContributors (sortBy: "contribution"){
    edges{
      node{
        id
        name
        avatar_url
        url
      }
    }
  }
  allSponsors {
    edges {
      node {
        id
        login
        avatarUrl
        url
      }
    }
  }
}
</static-query>

<script>
export default {
  components: {
  }
}
</script>

<style>
</style>