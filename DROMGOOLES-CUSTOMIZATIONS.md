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

## Assets

### assets/dromgooles-brands-index.js & assets/dromgooles-brands-index.css

iOS Contacts-style alphabetical grouping and quick letter navigation for the "All Brands" menu in the header drawer.

**Features:**
- Alphabetical letter navigation sidebar with smooth scrolling
- Real-time brand search input field (corner radius: 8px)
- Letter headers that stick to the top while scrolling
- Disabled letter buttons for unavailable sections
- Visual indicator showing current letter position
- Touch-friendly letter navigation with drag support
- Responsive design that hides letter bar on very small screens

**Note:** This script targets the menu link with ID `link-all-brands`, which corresponds to a menu item named "All Brands" in Shopify admin navigation.

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

### assets/dromgooles-share.js

Enhanced share button functionality that adds error handling for the native `navigator.share()` API. When native sharing fails (e.g., permission denied, unsupported context), it gracefully falls back to showing the copy-to-clipboard UI.

### assets/dromgooles-product-slideshow.js

Fixes product media gallery slider button states (prev/next disabled when at boundaries) and handles button positioning when the "Constrain to screen height" option is enabled.

### snippets/dromgooles-styles.liquid

Loader snippet that includes the custom CSS with proper deferred loading.

### snippets/dromgooles-share-button.liquid

Wrapper snippet that renders the standard Dawn share button while loading the enhanced share functionality script. Use this instead of `share-button` to get error handling on native share failures.

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

1. Back up `config/settings_data.json`
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

## Custom Sections

### dromgooles-slideshow.liquid

Enhanced slideshow section with:
- Clickable slide media (entire slide as link)
- Custom aspect ratio controls (desktop and mobile)
- Wide banner support (16:5 aspect ratio for category headers)

### dromgooles-collection-grid.liquid

Advanced collection grid with:
- Per-block custom background colors and gradients
- Border radius control for circular color swatches
- Custom title text and color overrides
- Hide title option for logo-only displays
- Image style options (contain/cover)

**Usage Examples:**
- Color swatches: 6-column circular items with background colors
- Brand logos: Standard cards with hidden titles
- Category navigation: Standard cards with visible titles

### dromgooles-promo-banner.liquid

Promotional banner section with:
- Full-width or boxed layout options
- Background image with overlay opacity
- Gradient background support
- Configurable button styles (solid/outline)
- Flexible text and button positioning

### dromgooles-footer.liquid

Custom footer with block-based columns for menus, brand info, and newsletter signup.

### dromgooles-multicolumn.liquid

Multi-column content layout section.

## Collection Templates

Custom landing page templates for featured collections. These templates disable the default product grid and banner, providing a rich editorial experience with:
- Hero slideshow banners
- Shop-by collections (colors, brands, types)
- Promotional CTAs
- Related category navigation

| Template | Collection Handle | Description |
|----------|-------------------|-------------|
| `collection.fountain-pens.json` | fountain-pens | Comprehensive landing with 14 sections: brands, colors, fill systems, price ranges |
| `collection.rollerballs.json` | rollerballs | Rollerball pen landing page with brands and color selection |
| `collection.ballpoints.json` | ballpoints | Ballpoint pen landing page with brands and color selection |
| `collection.bottled-ink.json` | bottled-ink | Ink collection with 12 color swatches and ink brand navigation |
| `collection.calendars-agendas-old.json` | calendars-agendas-old | Planners and calendars with type and brand navigation |
| `collection.notebook-accessories.json` | notebook-accessories | Notebooks and paper with FP-friendly paper emphasis |
| `collection.stationery.json` | stationery | Fine stationery with sealing wax and desk accessories |

### Template Structure Pattern

Each collection template follows this structure:
1. **banner** (disabled) - Default collection banner
2. **product-grid** (disabled) - Default product grid
3. **hero_slideshow** - Full-width category hero image
4. **shop_by_*sections** - Collection grids for navigation
5. **promo_banners** - Promotional CTAs between sections
6. **help_cta** - Rich text with contact information

### Assigning Templates

In Shopify Admin:
1. Go to Products → Collections
2. Select the collection
3. Under "Theme template", choose the matching template
4. Save

## Future Customizations

When adding new customizations:

1. Create files with `dromgooles-` prefix
2. Add CSS to `assets/dromgooles.css`
3. Create new snippets as `snippets/dromgooles-*.liquid`
4. Create new sections as `sections/dromgooles-*.liquid`
5. Document changes in this README

---

*Last Updated: 2025*
*Dawn Version: 15.4.1*
