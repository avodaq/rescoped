const { colors } = require('./configs/tailwind.colors');

module.exports = {
  prefix: '',
  // Intellij (for example Webstorm) does not suggest Tailwind classes when 'jit' is used.
  // A trick is to use a ternary expression like: TAILWIND_MODE ? 'jit' : ''
  mode: process.env.TAILWIND_MODE ? 'jit' : 'aot',
  content: ['./apps/**/*.{html,ts,scss}', './libs/**/*.{html,ts,scss}'],
  theme: {
    screens: {
      xs: '480px',
      sm: '600px',
      md: '1024px',
      lg: '1440px',
      xl: '1920px',
    },
    extend: { colors },
  },
  variants: {
    extend: {},
  },
  plugins: [],
  corePlugins: {},
};
