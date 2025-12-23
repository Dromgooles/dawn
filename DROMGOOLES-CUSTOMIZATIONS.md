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
- `assets/dromgooles-*.js` - Custom JavaScript modules
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

---

## Custom Assets

### CSS

| File | Purpose |
|------|---------|
| `dromgooles.css` | Main custom CSS overrides (1000+ lines) |
| `dromgooles-brands-index.css` | Alphabetical brand index navigation styles |
| `dromgooles-gift-wrapping.css` | Gift wrapping checkbox and message styling |

### JavaScript

| File | Purpose |
|------|---------|
| `dromgooles-brands-index.js` | iOS Contacts-style A-Z navigation for brands menu |
| `dromgooles-share.js` | Enhanced share button with native share + copy fallback |
| `dromgooles-product-slideshow.js` | Product gallery slider button state fixes |
| `dromgooles-gift-wrapping.js` | Gift wrapping add-to-cart functionality |
| `dromgooles-gift-card-properties.js` | Duplicates gift card recipient data to line item properties |

---

## Custom Sections

### dromgooles-header.liquid

**Block-based custom header** allowing drag-and-drop reordering of header elements.

**Features:**
- Block-based architecture (drawer, search, logo, account, cart)
- Each element has position setting (left/center/right)
- Account icon always visible on mobile
- Drawer-only navigation (simplified from Dawn's multi-menu options)

### dromgooles-main-product.liquid

**Extended product page section** with placeholder image support.

**Customizations:**
- Always renders 2-column layout (no empty state)
- Uses `dromgooles-product-media-gallery` for placeholder fallback
- Loads `dromgooles-product-slideshow.js` for slideshow layout
- Integrates Back in Stock notification support

### dromgooles-cart-gift-wrapping.liquid

**Gift wrapping add-on section** for cart pages.

**Features:**
- Checkbox to add gift wrapping product to cart
- Optional gift message textarea with character count
- Real-time cart updates via AJAX
- Persists gift message as line item property

### dromgooles-slideshow.liquid

**Enhanced slideshow section** with:
- Clickable slide media (entire slide as link)
- Custom aspect ratio controls (desktop and mobile)
- Wide banner support (16:5 aspect ratio for category headers)

### dromgooles-collection-grid.liquid

**Advanced collection grid** with:
- Per-block custom background colors and gradients
- Border radius control for circular color swatches
- Custom title text and color overrides
- Hide title option for logo-only displays
- Image style options (contain/cover)

### dromgooles-collection-product-grid.liquid

**Collection product grid** that uses `dromgooles-card-product` snippet (no sale badges).

### dromgooles-featured-collection.liquid

**Extended featured collection section** with:
- Header alignment options (left/center/right)
- Custom heading and button color overrides
- Uses `dromgooles-card-product` snippet (no sale badges)

### dromgooles-related-products.liquid

**Product recommendations ("You may also like")** without sale badges.

### dromgooles-main-search.liquid

**Search results page** using custom product cards without sale badges.

### dromgooles-promo-banner.liquid

**Promotional banner section** with:
- Full-width or boxed layout options
- Background image with overlay opacity
- Gradient background support
- Configurable button styles (solid/outline)

### dromgooles-footer.liquid

**Custom footer** with block-based columns for menus, brand info, and newsletter signup.

### dromgooles-multicolumn.liquid

**Multi-column content layout** section.

### dromgooles-color-swatches.liquid

**Color swatch display** for collection landing pages.

---

## Custom Snippets

### Core Snippets

| Snippet | Purpose |
|---------|---------|
| `dromgooles-styles.liquid` | Loads custom CSS with deferred loading |
| `dromgooles-placeholder-image.liquid` | Renders `coming_soon.jpg` for products without images |

### Product Components

| Snippet | Purpose |
|---------|---------|
| `dromgooles-card-product.liquid` | Product card with sale badge removed (sold-out badge retained) |
| `dromgooles-card-collection.liquid` | Collection card component |
| `dromgooles-product-media-gallery.liquid` | Product gallery with placeholder fallback and slideshow layout |
| `dromgooles-buy-buttons.liquid` | Buy buttons that hide when sold out (for Back in Stock integration) |
| `dromgooles-back-in-stock-helper.liquid` | Exposes inventory data for Back in Stock app |

### Share Components

| Snippet | Purpose |
|---------|---------|
| `dromgooles-share.liquid` | Fully customizable share button with native share + copy fallback |
| `dromgooles-share-button.liquid` | Wrapper for Dawn share button with enhanced error handling |

### Header Components

| Snippet | Purpose |
|---------|---------|
| `dromgooles-header-drawer.liquid` | Header drawer/hamburger menu block |
| `dromgooles-header-search.liquid` | Header search block |
| `dromgooles-header-logo.liquid` | Header logo block |
| `dromgooles-header-account.liquid` | Header account icon block |
| `dromgooles-header-cart.liquid` | Header cart icon block |

---

## Collection Templates

Custom landing page templates for featured collections. These templates disable the default product grid and banner, providing a rich editorial experience with:
- Hero slideshow banners
- Shop-by collections (colors, brands, types)
- Promotional CTAs
- Related category navigation

| Template | Collection Handle | Description |
|----------|-------------------|-------------|
| `collection.fountain-pens.json` | fountain-pens | Comprehensive landing with brands, colors, fill systems, price ranges |
| `collection.rollerballs.json` | rollerballs | Rollerball pen landing page with brands and color selection |
| `collection.ballpoints.json` | ballpoints | Ballpoint pen landing page with brands and color selection |
| `collection.bottled-ink.json` | bottled-ink | Ink collection with 12 color swatches and ink brand navigation |
| `collection.stationery.json` | stationery | Fine stationery with sealing wax and desk accessories |
| `collection.notebooks.json` | notebooks | Notebooks and paper products |
| `collection.calendars-agendas.json` | calendars-agendas | Planners and calendars |
| `collection.calligraphy.json` | calligraphy | Calligraphy supplies |
| `collection.accessories.json` | accessories | Pen accessories and cases |
| `collection.all-products.json` | all-products | All products listing |

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

---

## Brand Colors & CSS Custom Properties

### Brand Colors

| Color | Hex | RGB | Usage |
|-------|-----|-----|-------|
| Orange | #c06014 | 192, 96, 20 | Primary accent, buttons |
| Blue | #0b3c5d | 11, 60, 93 | Secondary accent |
| Gray | #d1d1d1 | 209, 209, 209 | Background variation |
| White | #ffffff | 255, 255, 255 | Primary background |
| Text | #121212 | 18, 18, 18 | Body text |

### CSS Custom Properties

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

---

## CSS Organization (dromgooles.css)

The main CSS file is organized into these sections:

1. **CSS Custom Property Extensions** - Brand colors as CSS variables
2. **Typography Utilities** - Text alignment, font weight helpers
3. **Header Navigation Customizations** - Search/drawer container positioning
4. **Color Background Utilities** - Product color coding backgrounds
5. **Border Radius Utilities** - Rounded corner helpers
6. **Layout & Spacing Utilities** - Flexbox, display, gap helpers
7. **Card & Product Grid Customizations** - Product card styling
8. **Header Enhancements** - Non-invasive header improvements
9. **Slider & Carousel Fixes** - Z-index and positioning fixes
10. **Footer Customizations** - Responsive image handling
11. **Component-Specific Overrides** - Modal, quick-add, price styling
12. **Responsive Adjustments** - Mobile/tablet specific styles

---

## Utility Classes

### Color Backgrounds
```html
<div class="color-background-orange">Orange background</div>
<div class="color-background-blue">Blue background</div>
<div class="color-background-gold">Gold product swatch</div>
```

### Text Alignment
```html
<div class="text-left">Left aligned</div>
<div class="text-center">Center aligned</div>
<div class="text-right">Right aligned</div>
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

---

## Theme Settings (config/settings_data.json)

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

---

## App Integrations

### Back in Stock Notifications

The theme includes helper snippets for Back in Stock app integration:

- `dromgooles-back-in-stock-helper.liquid` - Exposes inventory data
- `dromgooles-buy-buttons.liquid` - Hides buy buttons when sold out

### Gift Card Properties

`dromgooles-gift-card-properties.js` duplicates gift card recipient form data as visible line item properties so they appear on orders and packing slips.

---

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

---

## Files NOT to Modify

These Dawn base files should never be edited directly:
- `assets/base.css`
- `assets/global.js`
- `layout/theme.liquid` (except the one render line)
- `config/settings_schema.json`
- Any file without `dromgooles-` prefix

---

## Future Customizations

When adding new customizations:

1. Create files with `dromgooles-` prefix
2. Add CSS to `assets/dromgooles.css`
3. Create new snippets as `snippets/dromgooles-*.liquid`
4. Create new sections as `sections/dromgooles-*.liquid`
5. Document changes in this README

---

## File Summary

### Custom Assets (8 files)
- `dromgooles.css`
- `dromgooles-brands-index.css`
- `dromgooles-brands-index.js`
- `dromgooles-gift-wrapping.css`
- `dromgooles-gift-wrapping.js`
- `dromgooles-gift-card-properties.js`
- `dromgooles-product-slideshow.js`
- `dromgooles-share.js`

### Custom Sections (13 files)
- `dromgooles-cart-gift-wrapping.liquid`
- `dromgooles-collection-grid.liquid`
- `dromgooles-collection-product-grid.liquid`
- `dromgooles-color-swatches.liquid`
- `dromgooles-featured-collection.liquid`
- `dromgooles-footer.liquid`
- `dromgooles-header.liquid`
- `dromgooles-main-product.liquid`
- `dromgooles-main-search.liquid`
- `dromgooles-multicolumn.liquid`
- `dromgooles-promo-banner.liquid`
- `dromgooles-related-products.liquid`
- `dromgooles-slideshow.liquid`

### Custom Snippets (14 files)
- `dromgooles-back-in-stock-helper.liquid`
- `dromgooles-buy-buttons.liquid`
- `dromgooles-card-collection.liquid`
- `dromgooles-card-product.liquid`
- `dromgooles-header-account.liquid`
- `dromgooles-header-cart.liquid`
- `dromgooles-header-drawer.liquid`
- `dromgooles-header-logo.liquid`
- `dromgooles-header-search.liquid`
- `dromgooles-placeholder-image.liquid`
- `dromgooles-product-media-gallery.liquid`
- `dromgooles-share-button.liquid`
- `dromgooles-share.liquid`
- `dromgooles-styles.liquid`

---

*Last Updated: December 2025*
*Dawn Version: 15.4.1*
