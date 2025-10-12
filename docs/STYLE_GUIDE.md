# 🎨 Guide de Style - DigicampMonitoring

## 📋 Table des Matières

1. [Principes de Design](#-principes-de-design)
2. [Palette de Couleurs](#-palette-de-couleurs)
3. [Typographie](#-typographie)
4. [Espacements](#-espacements)
5. [Composants](#-composants)
6. [Animations](#-animations)
7. [Responsive Design](#-responsive-design)
8. [Exemples SCSS](#-exemples-scss)

---

## 🎯 Principes de Design

### Design System

Notre application suit les principes de **Material Design 3** avec une touche moderne :

- ✨ **Minimaliste** : Interfaces épurées et claires
- 🎨 **Coloré** : Utilisation de gradients modernes
- 🚀 **Performant** : Animations fluides et réactives
- 📱 **Responsive** : Adaptation à tous les écrans
- ♿ **Accessible** : Contraste et lisibilité optimisés

### Philosophie

```
Simplicité > Complexité
Cohérence > Originalité
Performance > Effets superflus
Utilisabilité > Esthétique pure
```

---

## 🎨 Palette de Couleurs

### Couleurs Principales

#### Primary - Purple Gradient

```scss
// Variables SCSS
$primary-start: #667eea;
$primary-end: #764ba2;
$primary-gradient: linear-gradient(135deg, $primary-start 0%, $primary-end 100%);

// Utilisation
.primary-bg {
  background: $primary-gradient;
}

.primary-text {
  background: $primary-gradient;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

**Prévisualisation:**
- <span style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 8px 16px; border-radius: 4px;">Primary Gradient</span>

#### Secondary - Pink Gradient

```scss
$secondary-start: #f093fb;
$secondary-end: #f5576c;
$secondary-gradient: linear-gradient(135deg, $secondary-start 0%, $secondary-end 100%);
```

**Prévisualisation:**
- <span style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 8px 16px; border-radius: 4px;">Secondary Gradient</span>

#### Background Gradient

```scss
$bg-gradient: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
```

### Couleurs Sémantiques

```scss
// Success
$success: #4CAF50;
$success-light: #81C784;
$success-dark: #388E3C;

// Warning
$warning: #FF9800;
$warning-light: #FFB74D;
$warning-dark: #F57C00;

// Danger
$danger: #f5576c;
$danger-light: #E57373;
$danger-dark: #D32F2F;

// Info
$info: #2196F3;
$info-light: #64B5F6;
$info-dark: #1976D2;
```

### Couleurs Neutres

```scss
// Grays
$gray-50: #f8f9fa;
$gray-100: #f1f3f5;
$gray-200: #e9ecef;
$gray-300: #dee2e6;
$gray-400: #ced4da;
$gray-500: #adb5bd;
$gray-600: #6c757d;
$gray-700: #495057;
$gray-800: #343a40;
$gray-900: #212529;

// Black & White
$white: #ffffff;
$black: #000000;

// Text colors
$text-primary: #333333;
$text-secondary: #666666;
$text-muted: #999999;
```

### Couleurs de Statut (Projets)

```scss
$status-colors: (
  'en-cours': #2196F3,
  'termine': #4CAF50,
  'en-pause': #FF9800,
  'annule': #f5576c,
  'planifie': #9C27B0
);

// Utilisation
.status-badge {
  @each $status, $color in $status-colors {
    &.#{$status} {
      background-color: $color;
      color: white;
    }
  }
}
```

---

## 🔤 Typographie

### Famille de Polices

```scss
$font-family-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', 
                   'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 
                   'Fira Sans', 'Droid Sans', 'Helvetica Neue', 
                   sans-serif;

$font-family-monospace: 'Fira Code', 'Courier New', monospace;
```

### Tailles de Police

```scss
// Base
$font-size-base: 1rem; // 16px

// Scale
$font-size-xs: 0.75rem;   // 12px
$font-size-sm: 0.875rem;  // 14px
$font-size-md: 1rem;      // 16px
$font-size-lg: 1.125rem;  // 18px
$font-size-xl: 1.25rem;   // 20px
$font-size-2xl: 1.5rem;   // 24px
$font-size-3xl: 2rem;     // 32px
$font-size-4xl: 2.5rem;   // 40px

// Headings
$h1-size: $font-size-4xl;
$h2-size: $font-size-3xl;
$h3-size: $font-size-2xl;
$h4-size: $font-size-xl;
$h5-size: $font-size-lg;
$h6-size: $font-size-md;
```

### Poids de Police

```scss
$font-weight-light: 300;
$font-weight-normal: 400;
$font-weight-medium: 500;
$font-weight-semibold: 600;
$font-weight-bold: 700;
$font-weight-black: 900;
```

### Hauteur de Ligne

```scss
$line-height-tight: 1.25;
$line-height-normal: 1.5;
$line-height-relaxed: 1.75;
$line-height-loose: 2;
```

### Exemples d'Application

```scss
// Headings
h1, h2, h3, h4, h5, h6 {
  font-weight: $font-weight-bold;
  line-height: $line-height-tight;
  color: $text-primary;
  margin-bottom: 1rem;
}

h1 { font-size: $h1-size; }
h2 { font-size: $h2-size; }
h3 { font-size: $h3-size; }

// Body text
body {
  font-family: $font-family-base;
  font-size: $font-size-base;
  line-height: $line-height-normal;
  color: $text-primary;
}

// Small text
.text-sm {
  font-size: $font-size-sm;
}

.text-muted {
  color: $text-muted;
  font-size: $font-size-sm;
}
```

---

## 📏 Espacements

### Système d'Espacement (8pt Grid)

```scss
$spacing-base: 8px;

$spacing-0: 0;
$spacing-1: $spacing-base * 0.5;  // 4px
$spacing-2: $spacing-base * 1;    // 8px
$spacing-3: $spacing-base * 1.5;  // 12px
$spacing-4: $spacing-base * 2;    // 16px
$spacing-5: $spacing-base * 2.5;  // 20px
$spacing-6: $spacing-base * 3;    // 24px
$spacing-8: $spacing-base * 4;    // 32px
$spacing-10: $spacing-base * 5;   // 40px
$spacing-12: $spacing-base * 6;   // 48px
$spacing-16: $spacing-base * 8;   // 64px
$spacing-20: $spacing-base * 10;  // 80px
```

### Classes Utilitaires

```scss
// Margins
.m-0 { margin: $spacing-0; }
.m-1 { margin: $spacing-1; }
.m-2 { margin: $spacing-2; }
.m-4 { margin: $spacing-4; }

.mt-2 { margin-top: $spacing-2; }
.mb-4 { margin-bottom: $spacing-4; }
.ml-3 { margin-left: $spacing-3; }
.mr-3 { margin-right: $spacing-3; }

// Paddings
.p-0 { padding: $spacing-0; }
.p-2 { padding: $spacing-2; }
.p-4 { padding: $spacing-4; }

.pt-4 { padding-top: $spacing-4; }
.pb-4 { padding-bottom: $spacing-4; }
```

### Gaps (Flexbox/Grid)

```scss
.gap-1 { gap: $spacing-1; }
.gap-2 { gap: $spacing-2; }
.gap-4 { gap: $spacing-4; }
.gap-6 { gap: $spacing-6; }
```

---

## 🧩 Composants

### Cards

```scss
.card {
  background: $white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  padding: $spacing-6;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    transform: translateY(-4px);
  }

  &-header {
    font-size: $font-size-xl;
    font-weight: $font-weight-bold;
    margin-bottom: $spacing-4;
    color: $text-primary;
  }

  &-body {
    font-size: $font-size-md;
    color: $text-secondary;
    line-height: $line-height-relaxed;
  }
}
```

### Buttons

```scss
.btn {
  padding: $spacing-3 $spacing-6;
  border-radius: 8px;
  font-weight: $font-weight-semibold;
  font-size: $font-size-md;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: $spacing-2;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }

  // Primary button
  &-primary {
    background: $primary-gradient;
    color: $white;

    &:hover {
      opacity: 0.9;
    }
  }

  // Secondary button
  &-secondary {
    background: $secondary-gradient;
    color: $white;
  }

  // Outlined button
  &-outlined {
    background: transparent;
    border: 2px solid $primary-start;
    color: $primary-start;

    &:hover {
      background: $primary-start;
      color: $white;
    }
  }

  // Sizes
  &-sm {
    padding: $spacing-2 $spacing-4;
    font-size: $font-size-sm;
  }

  &-lg {
    padding: $spacing-4 $spacing-8;
    font-size: $font-size-lg;
  }
}
```

### Forms

```scss
.form-field {
  display: flex;
  flex-direction: column;
  gap: $spacing-2;
  margin-bottom: $spacing-4;

  label {
    font-weight: $font-weight-semibold;
    color: $text-primary;
    font-size: $font-size-sm;

    &.required::after {
      content: ' *';
      color: $danger;
    }
  }

  input,
  textarea,
  select {
    width: 100%;
    padding: $spacing-3;
    border: 2px solid $gray-300;
    border-radius: 8px;
    font-size: $font-size-md;
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      border-color: $primary-start;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    &.error {
      border-color: $danger;
    }
  }

  .error-message {
    color: $danger;
    font-size: $font-size-sm;
    display: flex;
    align-items: center;
    gap: $spacing-1;

    i {
      font-size: $font-size-xs;
    }
  }
}
```

### Badges/Tags

```scss
.badge {
  display: inline-flex;
  align-items: center;
  padding: $spacing-1 $spacing-3;
  border-radius: 20px;
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;

  &-success {
    background-color: rgba($success, 0.1);
    color: $success-dark;
  }

  &-warning {
    background-color: rgba($warning, 0.1);
    color: $warning-dark;
  }

  &-danger {
    background-color: rgba($danger, 0.1);
    color: $danger-dark;
  }

  &-info {
    background-color: rgba($info, 0.1);
    color: $info-dark;
  }
}
```

### Avatars

```scss
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: $font-weight-bold;
  background: $primary-gradient;
  color: $white;

  &-sm {
    width: 32px;
    height: 32px;
    font-size: $font-size-sm;
  }

  &-lg {
    width: 64px;
    height: 64px;
    font-size: $font-size-xl;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
}
```

### Tables

```scss
.table {
  width: 100%;
  border-collapse: collapse;

  thead {
    background: $gray-50;

    th {
      padding: $spacing-4 $spacing-6;
      text-align: left;
      font-weight: $font-weight-semibold;
      color: $text-primary;
      border-bottom: 2px solid $gray-200;
    }
  }

  tbody {
    tr {
      transition: background-color 0.3s ease;

      &:hover {
        background-color: $gray-50;
      }

      td {
        padding: $spacing-4 $spacing-6;
        border-bottom: 1px solid $gray-200;
        color: $text-secondary;
      }
    }
  }
}
```

---

## ✨ Animations

### Transitions

```scss
// Easing functions
$ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
$ease-out: cubic-bezier(0, 0, 0.2, 1);
$ease-in: cubic-bezier(0.4, 0, 1, 1);

// Durations
$duration-fast: 150ms;
$duration-normal: 300ms;
$duration-slow: 500ms;

// Standard transition
.transition {
  transition: all $duration-normal $ease-in-out;
}
```

### Keyframe Animations

```scss
// Slide Down
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-down {
  animation: slideDown $duration-slow $ease-out;
}

// Fade In
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn $duration-slow $ease-out;
}

// Pulse
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.pulse {
  animation: pulse 2s $ease-in-out infinite;
}

// Float
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.float {
  animation: float 3s $ease-in-out infinite;
}

// Stagger animations
.stagger-item {
  opacity: 0;
  animation: fadeIn $duration-slow $ease-out forwards;

  @for $i from 1 through 10 {
    &:nth-child(#{$i}) {
      animation-delay: #{$i * 0.1}s;
    }
  }
}
```

### Loading Animations

```scss
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid $gray-200;
  border-top-color: $primary-start;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
```

---

## 📱 Responsive Design

### Breakpoints

```scss
$breakpoints: (
  'xs': 0,
  'sm': 576px,
  'md': 768px,
  'lg': 992px,
  'xl': 1200px,
  'xxl': 1400px
);

// Mixin pour media queries
@mixin respond-to($breakpoint) {
  @if map-has-key($breakpoints, $breakpoint) {
    @media (min-width: map-get($breakpoints, $breakpoint)) {
      @content;
    }
  }
}

// Utilisation
.container {
  padding: $spacing-2;

  @include respond-to('md') {
    padding: $spacing-4;
  }

  @include respond-to('lg') {
    padding: $spacing-6;
  }
}
```

### Container

```scss
.container {
  width: 100%;
  margin: 0 auto;
  padding: 0 $spacing-4;

  @include respond-to('sm') {
    max-width: 540px;
  }

  @include respond-to('md') {
    max-width: 720px;
  }

  @include respond-to('lg') {
    max-width: 960px;
  }

  @include respond-to('xl') {
    max-width: 1600px;
  }
}
```

### Grid System

```scss
.grid {
  display: grid;
  gap: $spacing-4;
  grid-template-columns: 1fr;

  @include respond-to('md') {
    grid-template-columns: repeat(2, 1fr);
  }

  @include respond-to('lg') {
    grid-template-columns: repeat(3, 1fr);
  }

  @include respond-to('xl') {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

---

## 💻 Exemples SCSS

### Exemple Complet : Page de Projet

```scss
.project-page {
  min-height: 100vh;
  background: $bg-gradient;

  .navbar {
    background: $white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 0 $spacing-8;

    .brand {
      display: flex;
      align-items: center;
      gap: $spacing-3;

      .brand-icon {
        font-size: $font-size-3xl;
        background: $primary-gradient;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .brand-name {
        font-size: $font-size-xl;
        font-weight: $font-weight-bold;
        color: $text-primary;
      }
    }
  }

  .content {
    max-width: 1600px;
    margin: 0 auto;
    padding: $spacing-10 $spacing-8;

    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: $spacing-8;
      animation: slideDown $duration-slow $ease-out;

      h1 {
        font-size: $h1-size;
        font-weight: $font-weight-bold;
        color: $text-primary;
        display: flex;
        align-items: center;
        gap: $spacing-3;

        i {
          background: $primary-gradient;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }
    }

    .card {
      background: $white;
      border-radius: 16px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
      overflow: hidden;
      animation: fadeIn $duration-slow $ease-out;

      .card-toolbar {
        padding: $spacing-6 $spacing-8;
        border-bottom: 1px solid $gray-200;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .search {
          flex: 1;
          max-width: 400px;
        }
      }
    }
  }

  @include respond-to('md') {
    .content {
      padding: $spacing-10 $spacing-4;
    }
  }
}
```

### Exemple : Dialog Modal

```scss
.dialog {
  .dialog-header {
    background: $primary-gradient;
    color: $white;
    padding: $spacing-6;
    font-size: $font-size-xl;
    font-weight: $font-weight-bold;
  }

  .dialog-content {
    padding: $spacing-8;

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: $spacing-6;

      .full-width {
        grid-column: 1 / -1;
      }

      @include respond-to('md') {
        grid-template-columns: 1fr;
      }
    }
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: $spacing-3;
    padding: $spacing-6 $spacing-8;
    border-top: 1px solid $gray-200;
  }
}
```

---

## 🎯 Bonnes Pratiques

### 1. Nommage BEM

```scss
// Block
.card { }

// Element
.card__header { }
.card__body { }

// Modifier
.card--highlighted { }
.card__header--large { }
```

### 2. Variables

```scss
// ✅ Bon
$primary-color: #667eea;
$spacing-base: 8px;

// ❌ Mauvais
$blue: #667eea;
$gap: 8px;
```

### 3. Mixins Réutilisables

```scss
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

@mixin truncate-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@mixin gradient-text($gradient) {
  background: $gradient;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

### 4. Organisation des Fichiers

```
styles/
├── abstracts/
│   ├── _variables.scss
│   ├── _mixins.scss
│   └── _functions.scss
├── base/
│   ├── _reset.scss
│   └── _typography.scss
├── components/
│   ├── _buttons.scss
│   ├── _cards.scss
│   └── _forms.scss
├── layout/
│   ├── _navbar.scss
│   └── _grid.scss
└── main.scss
```

---

**Dernière mise à jour : 12 octobre 2025**
