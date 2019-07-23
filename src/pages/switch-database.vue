<template>
  <Layout>
    <div class="container-inner mx-auto py-16">
      <h2 class="text-4xl font-bold mb-16">Mechanical Keyboard Switch Database</h2>
      <div>
        <!-- <vue-good-table
          :columns="columns"
          :rows="switches"/> -->
        <ul>
          <li v-for="edge in $page.github.repository.ref.target.history.edges" :key="edge.node.oid">
          <!-- <g-link :to="`/products/${edge.node.handle}`"> -->
              {{ edge.node.message }}
            <!-- </g-link> -->
          </li>
        </ul>
      </div>
    </div>

  </Layout>
</template>

<page-query>
query allCommits {
  github {
    repository(name: "awesome-mechanical-keyboard", owner: "benroe") {
      ref(qualifiedName: "master") {
        target {
          ... on githubTypes_Commit {
            history(first: 10) {
              pageInfo {
                hasNextPage
              }
              edges {
                node {
                  messageHeadline
                  oid
                  message
                  comments(first: 5) {
                    edges {
                      node {
                        id
                        body
                        author {
                          login
                        }
                      }
                    }
                  }
                  author {
                    name
                    email
                    date
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</page-query>

<script>

export default {
  metaInfo: {
    title: 'Mechanical Keyboard Switch Database'
  },
  data(){
    return {
      switches: null,
    };
  }
}
</script>

