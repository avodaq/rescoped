// todo: deprecated!!! Remove this entirely, was replaced by "gradient-linear-progress". Also remove gradient-progress-bar directive.

# How to config and import the gradient-progress-bar

## 0. First things first

- All gradients from our 9 colors are visually balanced, so that all gradients are as even as possible. Therefore, we need
  to import in the `progress-bar-background-light` or `progress-bar-background-dark` not only the color (`$cyan`) but also it's visual lightness (`$cyan-lightness`).
- You can create any color combination from these 9 colors:
  - red, orange, yellow, green, cyan, lightblue, blue, purple and pink
- To implement the respective color-branding of an app, create a `gradient-progress-bar-config.scss` in your
  `apps/mynewapp/styles` folder and configure like so:

## 1. Example gradient-progress-bar-config.scss

```
@use 'sass:map'; // import map from sass functions
@use '../gradient-progress-bar/index' as gpb; // import the gradient-progress-bar mixins

// define gradient, background color and color-lightness for the light theme
@include gpb.bg-gradient-light('cyan-purple', map.get(gpb.$all-gradients, 'cyan-purple'));
@include gpb.progress-bar-background-light('cyan-purple', gpb.$cyan, gpb.$cyan-lightness);

// use -dark mixins and define the same for the dark theme
body.dark {
  @include gpb.bg-gradient-dark('cyan-purple', map.get(gpb.$all-gradients, 'cyan-purple'));
  @include gpb.progress-bar-background-dark('cyan-purple', gpb.$cyan, gpb.$cyan-lightness);
}

```

- `cyan-purple` in this example are the gradient colors from left to right
- For light theme use `bg-gradient-light` and `progress-bar-background-light `
- For dark theme use `bg-gradient-dark` and `progress-bar-background-dark`
- Replace `cyan-purple` with your apps gradient colors (from left to right): e.g. `red-blue`
- Replace `$cyan` and `$cyan-lightness` with your gradients first color: e.g. `$red` and `$red-lightness`

## 2. Import your `gradient-progress-bar-config.scss` into your app.

We import it in `../theming/_index.scss` and this `_index.scss` is included in our `package.json` as symlink.

## 3. Use the avoGradientProgressBar directive on your mat-progress-bar

Your css ist ready to be used within your markup. Use the `avoGradientProgressBar` directive on
every `<mat-progress-bar>`. Use the `mat-progress-bar` "color" input to define your color-gradient.

```
<mat-progress-bar color="green-lightblue" mode="indeterminate" avoGradientProgressBar></mat-progress-bar>
```

That's it!
