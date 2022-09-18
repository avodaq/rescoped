# Themed Components

## 0. First things first

- To use other colors then primary, accent and warn we created the color extend thing. You can configure and use it like show below.
- You need to import the colorExtend directive from: `libs/directives/color-extend`

## 1. Example color-extend-config.scss

```
@use '../color-extend/index' as ce;

// define light palette
$extended-palette-light: (
  passive: hsl(0, 0%, 73%),
  success: hsl(140, 40%, 50%),
  contrast: (
    passive: rgba(black, 0.87),
    success: white,
  ),
);

// define dark palette
$extended-palette-dark: (
  passive: hsl(0, 0%, 43%),
  success: hsl(90, 40%, 40%),
  contrast: (
    passive: rgba(black, 0.87),
    success: white,
  ),
);

// create light styles
@include ce.createColorExtension($extended-palette-light);

// create dark styles
body.dark {
  @include ce.createColorExtension($extended-palette-dark);
}

```

## 2. Import your color-extend-config.scss into your app.

We import it in `../theming/_index.scss` and this `_index.scss` is included in our `package.json` as symlink.

## 3. Use the colorExtend directive on all styled components

```
// Example use color
<mat-checkbox colorExtend="success">Test</mat-checkbox>
<button mat-flat-button colorExtend="success">Test</button>

```

That's it!
