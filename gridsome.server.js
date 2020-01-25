// Server API makes it possible to hook into various parts of Gridsome
// on server-side and add custom data to the GraphQL data layer.
// Learn more: https://gridsome.org/docs/server-api

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

const { GraphQLClient } = require('graphql-request')

const axios = require('axios')

module.exports = function (api) {
  api.loadSource(async actions => {
    
    const graphqlClient = new GraphQLClient(process.env.GITHUB_API_V4_URL, {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_AUTH_TOKEN}`,
      },
    })
    
    // get repo's commit history via graphql for the rss feed and
    // news page
    const commitHistoryQuery = `
      {
        repository(owner: "benroe", name: "awesome-mechanical-keyboard") {
          ref(qualifiedName: "master") {
            target {
              ... on Commit {
                history(first: 30) {
                  edges {
                    node {
                      oid
                      committedDate
                      messageHeadline
                      messageBody
                      author {
                        date
                        name
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }`
    const commitMessages = actions.addCollection({
      typeName: 'CommitMessages'
    })
    const commitMessagesData = await graphqlClient.request(commitHistoryQuery)

    // add each node the the collection
    commitMessagesData.repository.ref.target.history.edges.forEach(function(item) { 
      const coHeadline = item.node.messageHeadline
      // add only commit messages which are relevant for website user
      if(coHeadline.startsWith('feat') || coHeadline.startsWith('docs')) {
        commitMessages.addNode({
          id: item.node.oid,
          date: item.node.committedDate,
          message: item.node.messageHeadline,
          body: item.node.messageBody,
          author: item.node.author.name,
        })
      }
    }) 
    
    
    // get the sponsor list
    const sponsorsQuery = `
      {
        user(login: "BenRoe") {
          sponsorshipsAsMaintainer(first: 5) {
            edges {
              node {
                sponsor {
                  id
                  name
                  login
                  avatarUrl
                  url
                }
              }
            }
          }
        }
      }`
      const sponsors = actions.addCollection({
        typeName: 'Sponsors'
      })
      const sponsorsData = await graphqlClient.request(sponsorsQuery)
      
      // add each node the the collection
      sponsorsData.user.sponsorshipsAsMaintainer.edges.forEach(function(item) { 
        console.log(item.node.sponsor.login);
        
        sponsors.addNode({
          id: item.node.sponsor.id,
          login: item.node.sponsor.login,
          avatarUrl: item.node.sponsor.avatarUrl,
          url: item.node.sponsor.url,
        })
      }) 
    
    // Get contributor list and add to GraphQL
    const { data } = await axios.get('https://api.github.com/repos/BenRoe/awesome-mechanical-keyboard/contributors?q=contributions&order=desc') 
    const contributors = actions.addCollection({
      typeName: 'Contributors'
    })   
    
    for (const item of data) {
      contributors.addNode({
        id: item.id,
        name: item.login,
        avatar_url: item.avatar_url,
        url: item.html_url,
        contribution: item.contributions,
        path: '/contributor/' + item.login
      })
    }
    
    // const { data } = await axios.get('https://benroe.github.io/switch-database/mechanical-keyboard-switches.json')

    // const contentType = store.addContentType({
    //   typeName: 'Switches',
    //   route: '/switch/:id'
    // })

    // for (const item of data) {
    //   contentType.addNode({
    //     id: item.id,
    //     brand: item.brand,
    //     type: item.type,
    //     path: '/switch/' + item.id
    //   })
    // }
    
    // contentType.addNode({
    //   fields: {
    //     items: data.map(item => {
    //       // Reference a node with typeName 'Item'
    //       return store.createReference('Item', item.id)
    //     })
    //   }
    // })
    
  })
}
