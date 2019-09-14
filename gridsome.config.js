// This is where project configuration and plugin options are located.
// Learn more: https://gridsome.org/docs/config

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

module.exports = {
  siteName: 'Keebfol.io',
  siteDescription: 'Curated list of mechanical keyboard resources.',
  siteUrl: 'https://keebfol.io',
  chainWebpack(config) {
    config.mode('development')
    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .use('vue-svg-loader')
      .loader('vue-svg-loader')
  },
  plugins: [{
      use: 'gridsome-plugin-tailwindcss',
      options: {
        // tailwindConfig: './some/file/js',
        // purgeConfig: {},
        // presetEnvConfig: {},
        shouldPurge: false, // https://www.purgecss.com/with-postcss
        shouldImport: true, // https://github.com/postcss/postcss-import
        shouldTimeTravel: true, // https://github.com/csstools/postcss-preset-env
      }
    },
    {
      use: '@gridsome/source-filesystem',
      options: {
        index: ['README'],
        path: '**/*.md',
        baseDir: './docs',
        typeName: 'DocPage',
        remark: {
          autolinkHeadings: {
            content: {
              type: 'text',
              value: '#'
            }
          }
        }
      }
    },
    {
      use: 'gridsome-plugin-rss',
      options: {
        contentTypeName: 'Updates',
        feedOptions: {
          title: 'Keebfol.io - A Mechanical Keyboard Wiki',
          feed_url: 'https://keebfol.io/rss.xml',
          site_url: 'https://keebfol.io'
        },
        feedItemOptions: node => ({
          title: node.title,
          description: node.description,
          date: node.date,
          url: 'https://keebfol.io/' + node.url,
          guid: node.index
        }),
        output: {
          dir: './static/',
          name: 'rss.xml'
        }
      }
    },
    {
      use: 'gridsome-plugin-modal'
    }
  ],
  transformers: {
    remark: {
      externalLinksTarget: '_blank',
      externalLinksRel: ['nofollow', 'noopener', 'noreferrer'],
      anchorClassName: 'icon icon-link',
    }
  }
}