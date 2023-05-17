# rescoped - gradient-linear-progress

### based on Material Design Progress Bar

---

**This documentation provides a step-by-step guide on how to use the `gradient-linear-progress` bar.
The `gradient-linear-progress` is designed using the Material Design guidelines and uses the Angular Material library.**

### Basic Usage

Note: This is not a directive. There is no need for JS, what will keep your app lightweight. You can use
your `<mat-progress-bar/>` as you are used to in Angular Material.

In your HTML template, use the following code example to add the `gradient-linear-progress` bar.

```html
<mat-progress-bar gradient-linear-progress></mat-progress-bar>
```

Import and configure the `gradient-linear-progress-config` mixin into your styles (I would reccomend your global styles
file).

```scss
@use '@rescoped/styles/5_theme/gradient-linear-progress' as glp;

@include glp.gradient-linear-progress-config($color-start: #ff0000, $color-end: #0000ff);
```

Note: The minimum configuration for the `gradient-linear-progress-config` mixin are two colors. The start and end color
of the gradient.

### Extended Usage

#### Center Color

In addition to the basic usage, you can further enhance the appearance of the gradient linear progress bar by adding an
optional third color, applied to the center of the gradient.

```scss
@use '@rescoped/styles/5_theme/gradient-linear-progress' as glp;

@include glp.gradient-linear-progress-config(
  $color-start: #ff0000,
  $color-end: #0000ff,
  $color-center: #00ff00
);
```

---

#### Gradient direction

You can change the direction of the gradient. By default we apply your color-start and color-end from left to right. By
setting `$direction: left` you apply the colors from right **to left**.

```scss
@use '@rescoped/styles/5_theme/gradient-linear-progress' as glp;

@include glp.gradient-linear-progress-config(
  $color-start: #ff0000,
  $color-end: #0000ff,
  $direction: left
);
```

Note: Material uses a border to style it's `<mat-progress-bar/>` and we use border-image-source: linear-gradient()
to apply our gradient. Unfortunately, this function does not yet support modern CSS logical properties and values. For
now we stick with left and right.

---

#### Enhance Colors Filter

Eenhance the colors by setting a saturation amount in the $saturate variable. This applies a filter to
`.mdc-linear-progress__bar-inner` and increases the color saturation of this element.

```scss
@use '@rescoped/styles/5_theme/gradient-linear-progress' as glp;

@include glp.gradient-linear-progress-config(
  $color-start: #ff0000,
  $color-end: #0000ff,
  $saturate: 1.35
);
```

---

#### Buffer Color

By default we use color-start to set the color of the buffer elements. But you can also change the buffer color by
defining the $color-buffer variable in your config.

```scss
@use '@rescoped/styles/5_theme/gradient-linear-progress' as glp;

@include glp.gradient-linear-progress-config(
  $color-start: #ff0000,
  $color-end: #0000ff,
  $color-buffer: #0000ff
);
```

---

#### Individual Selector

Apply an individual gradient to `<mat-progress-bar/>` by element selector:

```html
<div>
  <mat-progress-bar gradient-linear-progress></mat-progress-bar>
  <mat-progress-bar class="my-special-gradient" gradient-linear-progress></mat-progress-bar>
</div>
```

```scss
@use '@rescoped/styles/5_theme/gradient-linear-progress' as glp;

@include glp.gradient-linear-progress-config($color-start: #ff0000, $color-end: #0000ff);
@include glp.gradient-linear-progress-config(
  $color-start: #00ff00,
  $color-end: #ffff00,
  $unique-selector: '.my-special-gradient'
);
```

Note: you can use here any valid css selector like `[attribute]`, `.class`, `#id` etc.

---

#### Multiple Color Themes

Apply multiple different `gradient-linear-progress` bars within a theme like so:

```html
<div class="my-first-theme">
  <mat-progress-bar gradient-linear-progress></mat-progress-bar>
</div>

<div class="my-second-theme">
  <mat-progress-bar gradient-linear-progress></mat-progress-bar>
</div>
```

```scss
@use '@rescoped/styles/5_theme/gradient-linear-progress' as glp;

.my-first-theme {
  @include glp.gradient-linear-progress-config($color-start: #ff0000, $color-end: #0000ff);
}

.my-second-theme {
  @include glp.gradient-linear-progress-config($color-start: #00ff00, $color-end: #ffff00);
}
```

---

#### Everything you can configure

```scss
@use '@rescoped/styles/5_theme/gradient-linear-progress' as glp;

@include glp.gradient-linear-progress-config(
  $color-start: #ff0000,
  $color-end: #0000ff,
  $color-center: #ffff00,
  $color-buffer: #00ff00,
  $saturate: 1.35,
  $direction: left,
  $unique-selector: '.my-special-gradient'
);
```
