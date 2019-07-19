// Server API makes it possible to hook into various parts of Gridsome
// on server-side and add custom data to the GraphQL data layer.
// Learn more: https://gridsome.org/docs/server-api

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

// const axios = require('axios')
const path = require('path')
const fs = require('fs-extra')
const yaml = require('js-yaml')

module.exports = function (api) {
  api.loadSource(async store => {
    
    // updates
    const updatesPath = path.join(__dirname, 'src/data/rss.yaml')
    const updatesRaw = await fs.readFile(updatesPath, 'utf8')
    const updatesJson = yaml.safeLoad(updatesRaw)
    const updates = store.addContentType({
      typeName: 'Updates',
      route: '/updates/:title'
    })

    updatesJson.forEach((update, index) => {
      updates.addNode({
        ...update,
        index
      })
    })
    
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
