const { colors } = require('./configs/tailwind.colors');

module.exports = {
  prefix: '',
  // Intellij (for example Webstorm) does not suggest Tailwind classes when 'jit' is used.
  // A trick is to use a ternary expression like: TAILWIND_MODE ? 'jit' : ''
  mode: process.env.TAILWIND_MODE ? 'jit' : 'aot',
  purge: {
    content: [
      './apps/**/*.html',
      './apps/**/*.ts',
      './apps/**/*.scss',
      './libs/**/*.html',
      './libs/**/*.ts',
      './libs/**/*.scss',
    ],
  },
  darkMode: false,
  theme: {
    screens: {
      sm: '600px',
      md: '1024px',
      lg: '1440px',
      xl: '1920px',
    },
    colors,
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
  corePlugins: {},
};
