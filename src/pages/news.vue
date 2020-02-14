<template>
  <Layout>
    <div class="w-full mx-auto">
      <h2 class="text-4xl font-bold mb-4">What is new on keebfol.io</h2>
      <div v-for="edge in $page.allCommitMessages.edges" :key="edge.node.id">
        <div class="mb-4">
        
          <div class="font-bold text-xl">
            {{ edge.node.message }}
          </div>
          
          <p v-if="edge.node.body" class="text-base whitespace-pre-line -mt-5">
            {{ edge.node.body }}
          </p>
          
          <div class="text-sm mt-1">
            <div class="text-gray-500 dark-mode:text-gray-600 leading-none">
              <font-awesome :icon="['fas', 'user-ninja']" class="mr-1 text-gray-300 dark-mode:text-gray-600"></font-awesome>
              {{ edge.node.author }}
              {{ edge.node.date }}
            </div>
          </div>
    
        </div>
      </div>
    </div>

  </Layout>
</template>

<page-query>
  query {
    allCommitMessages {
      edges {
        node {
          id
          date
          message
          body
          author
        }
      }
    }
  }
</page-query>

<script>
</script>