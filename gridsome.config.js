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
  plugins: [
    {
      use: 'gridsome-plugin-tailwindcss'
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
