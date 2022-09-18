# Styles

## First things first

### How the styles should be structured in a classic project.

In Angular the page-specific styles are imported in each component,
so we don't need to have a pages folder.

Because our only vendor is now tailwind, it's
more self explaining to just call the vendors folder "tailwind".

We also have folders (color-extend, gradient-progress-bar) that are imported
directly in Angular, but used in the theming folder.

```
|– 00 abstracts/
|   |– _variables.scss    # Sass Variables
|   |– _mixins.scss       # Sass Mixins
|
|– 01 vendors/
|   |– _bootstrap.scss    # Bootstrap
|
|– 02 base/
|   |– _reset.scss        # Reset/normalize
|   |– _typography.scss   # Typography rules
|
|– 03 layout/
|   |– _navigation.scss   # Navigation
|   |– _grid.scss         # Grid system
|   |– _header.scss       # Header
|   |– _footer.scss       # Footer
|   |– _sidebar.scss      # Sidebar
|   |– _forms.scss        # Forms
|
|– 04 components/
|   |– _buttons.scss      # Buttons
|   |– _carousel.scss     # Carousel
|   |– _cover.scss        # Cover
|   |– _dropdown.scss     # Dropdown
|
|– 05 pages/
|   |– _home.scss         # Home specific styles
|   |– _contact.scss      # Contact specific styles
|
|– 06 themes/
|   |– _theme.scss        # Default theme
|   |– _admin.scss        # Admin theme
|
– main.scss              # Main Sass input file
```

### How we import the styles

The example structure below shows a main.scss file. In Angular we import styles via each apps
`project.json` like so:

```
"styles": [
  "libs/styles/theming/_index.scss",
  "libs/styles/tailwind/_tailwindcss-base.scss",
  "libs/styles/tailwind/_tailwindcss-components.scss",
  "libs/styles/tailwind/_tailwindcss-utilities.scss",
  "libs/styles/base/_index.scss",
  "libs/components/src/spreadsheet/_cdk-spreadsheet.scss"
],
```

We use npm to [symlink](https://docs.npmjs.com/cli/v6/configuring-npm/package-json/#local-paths) (use as local dependencies) most of the styles into the node_modules folder. In the root package.json you find
the following: `"@rescoped/abstracts": "file:libs/styles/abstracts",`.

When `npm install` the symlinks are created and globally available in our monorepo. Import styles from abstracts like so: `@use '~@rescoped/abstracts/palettes' as avo_palettes; `
