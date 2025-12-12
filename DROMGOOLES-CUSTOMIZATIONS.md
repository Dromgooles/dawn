# Dromgoole's Theme Customizations

This document describes the customizations made to the Dawn 15.4.1 theme for Dromgoole's Fine Writing Instruments.

## Philosophy

All customizations follow an **overlay/override approach** to ensure:
- Clean upstream upgrades from Shopify's Dawn theme
- No merge conflicts when pulling latest Dawn updates
- Clear separation between Dawn base code and Dromgoole's customizations

## File Naming Convention

All custom files use the `dromgooles-` prefix:
- `assets/dromgooles.css` - Custom CSS overrides
- `assets/dromgooles.js` - Custom JavaScript (when needed)
- `snippets/dromgooles-*.liquid` - Custom Liquid snippets
- `sections/dromgooles-*.liquid` - Custom sections

## Installation

### Required Modification to theme.liquid

Add **ONE line** to `layout/theme.liquid` after the base.css stylesheet tag (around line 259):

```liquid
{{ 'base.css' | asset_url | stylesheet_tag }}
{% render 'dromgooles-styles' %}  <!-- ADD THIS LINE -->
```

This is the **only** modification needed to any Dawn base file.

## Custom Files

### assets/dromgooles.css

Contains all CSS customizations organized into sections:

1. **CSS Custom Property Extensions** - Brand colors as CSS variables
2. **Typography Utilities** - Text alignment, font weight helpers
3. **Color Background Utilities** - Product color coding backgrounds
4. **Border Radius Utilities** - Rounded corner helpers
5. **Layout & Spacing Utilities** - Flexbox, display, gap helpers
6. **Card & Product Grid Customizations** - Product card styling
7. **Header Enhancements** - Non-invasive header improvements
8. **Slider & Carousel Fixes** - Z-index and positioning fixes
9. **Footer Customizations** - Responsive image handling
10. **Component-Specific Overrides** - Modal, quick-add, price styling
11. **Responsive Adjustments** - Mobile/tablet specific styles

### snippets/dromgooles-styles.liquid

Loader snippet that includes the custom CSS with proper deferred loading.

### config/settings_data.json

Contains Dromgoole's brand settings:

- **Color Schemes:**
  - scheme-1: Default (white background)
  - scheme-2: Gray background (#d1d1d1)
  - scheme-5: Orange accent (#c06014)
  - scheme-6: Blue accent (#0b3c5d)

- **Typography:**
  - Body font: Lato
  - Header font: Lato

- **Logo:**
  - Width: 250px

## Brand Colors

| Color | Hex | RGB | Usage |
|-------|-----|-----|-------|
| Orange | #c06014 | 192, 96, 20 | Primary accent, buttons |
| Blue | #0b3c5d | 11, 60, 93 | Secondary accent |
| Gray | #d1d1d1 | 209, 209, 209 | Background variation |
| White | #ffffff | 255, 255, 255 | Primary background |
| Text | #121212 | 18, 18, 18 | Body text |

## CSS Custom Properties

Use these in custom sections/snippets:

```css
/* Brand colors (RGB triplet for rgba() usage) */
var(--dromgooles-orange)    /* 192, 96, 20 */
var(--dromgooles-blue)      /* 11, 60, 93 */
var(--dromgooles-gray)      /* 209, 209, 209 */

/* Direct hex values */
var(--dromgooles-orange-hex)  /* #c06014 */
var(--dromgooles-blue-hex)    /* #0b3c5d */
var(--dromgooles-gray-hex)    /* #d1d1d1 */

/* Example usage */
.my-element {
  background-color: rgba(var(--dromgooles-orange), 0.1);
  border-color: var(--dromgooles-blue-hex);
}
```

## Utility Classes

### Color Backgrounds
```html
<div class="color-background-orange">Orange background</div>
<div class="color-background-blue">Blue background</div>
<div class="color-background-gold">Gold product swatch</div>
```

### Layout
```html
<div class="d-flex justify-between align-center gap-2">
  Flexbox layout with gap
</div>
```

### Responsive Visibility
```html
<div class="small-hide">Hidden on mobile</div>
<div class="large-up-hide">Hidden on desktop</div>
```

## Upgrading Dawn

When upgrading the base Dawn theme:

1. Backup `config/settings_data.json`
2. Pull latest Dawn changes
3. Re-apply the single line in `theme.liquid`:
   ```liquid
   {% render 'dromgooles-styles' %}
   ```
4. Restore `settings_data.json` or merge new settings
5. Test all customizations

## Files NOT to Modify

These Dawn base files should never be edited directly:
- `assets/base.css`
- `assets/global.js`
- `layout/theme.liquid` (except the one render line)
- `config/settings_schema.json`
- Any file without `dromgooles-` prefix

## Future Customizations

When adding new customizations:

1. Create files with `dromgooles-` prefix
2. Add CSS to `assets/dromgooles.css`
3. Create new snippets as `snippets/dromgooles-*.liquid`
4. Create new sections as `sections/dromgooles-*.liquid`
5. Document changes in this README

---

*Last Updated: 2024*
*Dawn Version: 15.4.1*
