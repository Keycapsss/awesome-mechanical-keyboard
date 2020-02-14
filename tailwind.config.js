module.exports = {
  theme: {
    extend: {
      screens: {
        'dark-mode': { raw: '(prefers-color-scheme: dark)' },
      },
      colors: {
        'primary': {
          light: '#4ECDC4',
          default: '#00B5A8',
          dark: '#0B4C51',
        },
        'secondary': {
          light: '#FF8C8C',
          default: '#FF6B6B',
          dark: '#DD3939',
        },
      },
      'highlight': {
        light: '#FFED96',
        default: '#FFE66D',
        dark: '#D6B513',
      },
    },
  },
  variants: {
    // Some useful comment
  },
  plugins: [
    // Some useful comment
  ]
}
