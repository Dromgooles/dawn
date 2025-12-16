# Copilot Instructions for Dawn Theme

This is Shopify's Dawn theme (v15.4.1) - a reference implementation for Online Store 2.0 themes.

## Core Philosophy

Dawn follows a **"HTML-first, JavaScript-only-as-needed"** approach:
- Server-rendered HTML via Liquid templates (no client-side rendering frameworks)
- No external dependencies, frameworks, or polyfills
- Progressive enhancement over polyfills for browser compatibility
- Zero Cumulative Layout Shift (CLS) and no render-blocking JavaScript

## Architecture Overview

```
layout/theme.liquid     → Main HTML shell, loads global CSS/JS
sections/*.liquid       → Modular page sections with {% schema %} configs
snippets/*.liquid       → Reusable Liquid partials (render with {% render %})
templates/*.json        → JSON templates referencing sections
config/settings_*.json  → Theme-wide settings schema
assets/                 → CSS, JS, and static assets
locales/                → Translation files (t:key syntax)
```

## JavaScript Patterns

**Web Components Architecture** - All interactive elements use native Custom Elements:
```javascript
// Pattern: Guard against re-registration, extend HTMLElement
if (!customElements.get('product-form')) {
  customElements.define('product-form', class ProductForm extends HTMLElement { ... });
}
```

Key components in [../assets/global.js](../assets/global.js): `QuantityInput`, `MenuDrawer`, `ModalDialog`, `SliderComponent`, `VariantSelects`

**Pub/Sub Event System** ([../assets/pubsub.js](../assets/pubsub.js)):
```javascript
// Subscribe to cart updates across components
subscribe(PUB_SUB_EVENTS.cartUpdate, callback);
publish(PUB_SUB_EVENTS.cartError, { source: 'product-form', errors: response.errors });
```

Events: `cartUpdate`, `cartError`, `quantityUpdate` - used for cross-component communication.

## Liquid Conventions

**Section Schema Pattern** - Every section ends with JSON schema for theme editor:
```liquid
{% schema %}
{
  "name": "t:sections.header.name",
  "settings": [...],
  "blocks": [...]
}
{% endschema %}
```

**Snippet Parameters** - Document accepted parameters in comment blocks:
```liquid
{% comment %}
  Renders a product card
  Accepts:
  - card_product: {Object} Product Liquid object
  - show_vendor: {Boolean} Show vendor. Default: false
  Usage:
  {% render 'card-product', card_product: product %}
{% endcomment %}
```

**Translation Keys** - Use `t:` prefix for translatable strings in schemas, reference `locales/en.default.json`.

## CSS Conventions

- Component CSS files: `component-{name}.css` (e.g., `component-card.css`)
- Section CSS files: `section-{name}.css`
- CSS loaded conditionally via Liquid: `{{ 'component-price.css' | asset_url | stylesheet_tag }}`
- Non-critical CSS: `media="print" onload="this.media='all'"` for deferred loading
- CSS custom properties defined in [../layout/theme.liquid](../layout/theme.liquid) via color schemes

## Development Workflow

```bash
# Start development server
shopify theme dev

# Lint theme code
shopify theme check

# Pull latest Dawn updates
git fetch upstream && git pull upstream main
```

## Key Files Reference

| File | Purpose |
|------|---------|
| [../assets/global.js](../assets/global.js) | Core utilities, base web components |
| [../assets/pubsub.js](../assets/pubsub.js) | Event system for component communication |
| [../assets/product-form.js](../assets/product-form.js) | Add-to-cart functionality |
| [../sections/main-product.liquid](../sections/main-product.liquid) | Product page section (2000+ lines) |
| [../snippets/card-product.liquid](../snippets/card-product.liquid) | Reusable product card |
| [../config/settings_schema.json](../config/settings_schema.json) | Theme-wide settings |

## Performance Requirements

- All scripts use `defer="defer"` - never block rendering
- No DOM manipulation before user input
- Conditional asset loading based on feature usage
- Images: responsive `srcset` with appropriate `sizes` attribute

## Migration & Customization Guidelines

**Preserve upstream compatibility** - Do NOT modify base Dawn files unless absolutely necessary (e.g., store-specific JSON configs like `templates/*.json` or `config/settings_data.json`). This ensures clean `git pull upstream main` updates.

**Customization strategies (in order of preference):**
1. **New snippets** - Create `snippets/dromgooles-*.liquid` for new functionality
2. **New sections** - Create `sections/dromgooles-*.liquid` for store-specific sections
3. **CSS overrides** - Add `assets/dromgooles.css` loaded after base styles in `theme.liquid`
4. **JS extensions** - Create `assets/dromgooles.js` that extends existing web components or adds new ones

**Use modern Dawn constructs:**
- Leverage existing web components (`<product-form>`, `<cart-drawer>`, etc.) rather than duplicating
- Use the pub/sub system for cross-component communication instead of custom events
- Reference existing CSS custom properties from color schemes rather than hardcoding colors
- Use `{% render %}` for snippets (do not use the deprecated `{% include %}` construct)

**Stylesheet migration principles:**
- Migrate only CSS required for functionality, not cosmetic legacy styles
- Map old styles to Dawn's CSS custom properties where possible
- Avoid `!important` overrides; prefer specificity or CSS custom property redefinition
- Remove duplicate styles already provided by Dawn's `base.css` or component CSS

## File Identification & Naming

**Custom file naming** - Prefix ALL custom files with `dromgooles-`:
- `snippets/dromgooles-hero-banner.liquid`
- `sections/dromgooles-featured-products.liquid`
- `assets/dromgooles-styles.css`, `assets/dromgooles-scripts.js`

**Required header for modified Dawn files** - When you MUST modify a base Dawn file, add this header:
```liquid
{% comment %}
  CUSTOMIZED: [Brief description of changes]
  Author: Dromgoole's
  Modified: YYYY-MM-DD
  Original: Dawn v15.4.1
  
  Changes:
  - [List specific modifications]
{% endcomment %}
```

**Files safe to customize directly** (store-specific, not in upstream):
- `config/settings_data.json` - Store settings values
- `templates/*.json` - Page template configurations
- `locales/en.default.json` - Only for adding new keys (don't modify existing Dawn keys)

**Files to NEVER modify** (will cause merge conflicts):
- `layout/theme.liquid` - Add custom CSS/JS via snippets instead
- `assets/base.css`, `assets/global.js` - Core Dawn functionality
- `config/settings_schema.json` - Extend via `dromgooles-settings.liquid` snippet if needed

## Liquid Migration Patterns

**Replace deprecated patterns:**
```liquid
{% comment %} OLD - Don't use {% endcomment %}
{% include 'snippet-name' %}
{% include 'snippet' with product %}

{% comment %} NEW - Use these {% endcomment %}
{% render 'snippet-name' %}
{% render 'snippet', product: product %}
```

**Section rendering (Online Store 2.0):**
```liquid
{% comment %} OLD - Static sections {% endcomment %}
{% section 'header' %}

{% comment %} NEW - Use section groups in templates/*.json {% endcomment %}
{% sections 'header-group' %}
```

**Asset URLs:**
```liquid
{% comment %} OLD {% endcomment %}
{{ 'style.css' | asset_url | stylesheet_tag }}

{% comment %} NEW - With deferred loading for non-critical CSS {% endcomment %}
<link rel="stylesheet" href="{{ 'style.css' | asset_url }}" media="print" onload="this.media='all'">
```

## Liquid Whitespace Control

**Preventing unwanted whitespace** - Use `{%-` and `-%}` for tags, `{{-` and `-}}` for outputs when whitespace matters:

```liquid
{% comment %} BAD - Creates newlines before/after content {% endcomment %}
<div class="hours-box">
    {{ block.settings.hours }}
</div>

{% comment %} GOOD - No extra whitespace {% endcomment %}
<div class="hours-box">{{- block.settings.hours | strip -}}</div>
```

**Textarea content with intentional newlines** - Use `strip` + `newline_to_br`:
```liquid
{% comment %} Respects user's line breaks without adding extra whitespace {% endcomment %}
{{- block.settings.hours | strip | newline_to_br -}}
```

This is especially important for:
- Content boxes where leading/trailing space affects appearance
- Inline elements where whitespace creates unwanted gaps
- Any content from `textarea` schema fields

## Block-Based Section Architecture

**Prefer blocks over hardcoded settings** for flexible, reorderable content:

```liquid
{% comment %} BAD - Hardcoded structure {% endcomment %}
{% schema %}
{
  "settings": [
    { "id": "column_1_heading", ... },
    { "id": "column_2_heading", ... },
    { "id": "column_3_heading", ... }
  ]
}
{% endschema %}

{% comment %} GOOD - Block-based, reorderable {% endcomment %}
{% schema %}
{
  "blocks": [
    {
      "type": "column",
      "name": "Column",
      "settings": [
        { "id": "heading", ... }
      ]
    }
  ]
}
{% endschema %}
```

**Dynamic grid sizing** based on block count:
```liquid
{%- style -%}
  @media screen and (min-width: 750px) {
    .footer__columns {
      grid-template-columns: repeat({{ section.blocks.size | default: 1 }}, 1fr);
    }
  }
{%- endstyle -%}
```

**Block type limits** - Use `"limit": 1` for singleton blocks (e.g., brand info, newsletter):
```json
{
  "type": "brand",
  "name": "Brand info",
  "limit": 1,
  "settings": [...]
}
```

## Section Groups Configuration

**Footer/Header group JSON** - When using custom sections in groups, define blocks explicitly:

```json
{
  "name": "t:sections.footer.name",
  "type": "footer",
  "sections": {
    "footer": {
      "type": "dromgooles-footer",
      "blocks": {
        "brand": {
          "type": "brand",
          "settings": { ... }
        },
        "menu-1": {
          "type": "menu",
          "settings": { "heading": "Customer Service", "menu": "footer" }
        }
      },
      "block_order": ["brand", "menu-1", "menu-2", "newsletter"],
      "settings": { ... }
    }
  },
  "order": ["footer"]
}
```

## CSS Patterns for Flexible Layouts

**Multi-column content splitting** - Let content flow across columns:
```css
@media screen and (min-width: 750px) {
  .footer__menu ul {
    column-count: 2;
    column-gap: 2rem;
  }
  
  .footer__menu li {
    break-inside: avoid;  /* Prevent awkward breaks */
  }
}
```

**Single-block expansion** - When only one block exists, spread across available space:
```css
.columns--single .column {
  column-count: 3;
  column-gap: 3rem;
}
```

## Custom Dromgoole's Sections

| Section | Purpose | Key Features |
|---------|---------|--------------|
| `dromgooles-slideshow.liquid` | Homepage slideshow | `media_link` for clickable slides, custom aspect ratios (16:5 for banners) |
| `dromgooles-featured-collection.liquid` | Collection grid | Header alignment options (left/center/right) |
| `dromgooles-footer.liquid` | Site footer | Block-based columns (brand, menu, newsletter), dynamic grid |
| `dromgooles-main-product.liquid` | Product page | Custom product template with placeholder image fallback |
| `dromgooles-multicolumn.liquid` | Multi-column content | Flexible column layout section |

## Custom Dromgoole's Snippets

| Snippet | Purpose | Key Features |
|---------|---------|--------------|
| `dromgooles-styles.liquid` | CSS loader | Renders custom styles link in theme.liquid |
| `dromgooles-card-collection.liquid` | Collection card | Custom collection card component |
| `dromgooles-placeholder-image.liquid` | Image placeholder | Fallback for missing images |
| `dromgooles-product-media-gallery.liquid` | Product gallery wrapper | Wraps Dawn gallery with placeholder fallback using `coming_soon.jpg` asset |

## Custom Dromgoole's Assets

| Asset | Purpose | Key Features |
|-------|---------|--------------|
| `dromgooles.css` | Main custom styles | Global style overrides loaded via `dromgooles-styles.liquid` |
| `dromgooles-brands-index.css` | Brand index styles | Styles for alphabetical brand navigation in header drawer |
| `dromgooles-brands-index.js` | Brand index functionality | Letter-based scroll navigation with sibling height calculation for accurate positioning |
| `coming_soon.jpg` | Placeholder image | Product image fallback (use with `asset_url` filter) |

## Custom Locale Keys

Custom translation keys added to `locales/en.default.json`:
- `products.product.media.image_coming_soon` - Alt text for placeholder images

## Common Gotchas

1. **Textarea whitespace** - Always use `| strip | newline_to_br` for textarea content in tight containers
2. **Block order** - JSON `block_order` array must match block IDs exactly
3. **Schema validation** - Block `type` must match schema definition; header `content` max ~50 chars
4. **CSS z-index** - Slideshow overlays need z-index management for clickable elements
5. **Image aspect ratios** - Use `padding-bottom` percentage trick or `aspect-ratio` CSS property
6. **Remote assets** - Always use `| asset_url` filter for local assets; never hardcode CDN URLs
7. **Translation keys** - Add custom keys to `locales/en.default.json` before referencing with `| t`

## Theme Check & Known False Positives

Run `shopify theme check` regularly to catch issues. Some warnings are false positives in Dawn:

| Warning | Location | Explanation |
|---------|----------|-------------|
| `UndefinedObject: 'scheme_classes'` | `layout/theme.liquid`, `layout/password.liquid` | Dawn pattern - variable is built up in a loop |
| `UndefinedObject: 'continue'` | Product sections with complementary products | Valid Liquid keyword for paginated for-loops |
| `UnusedAssign: 'seo_media'` | Dawn's `main-product.liquid`, `featured-product.liquid` | Dawn core issue - safe to ignore in core files |
| `VariableName` warnings | Various Dawn core files | Dawn uses camelCase in some places |

**Fix custom file issues**, ignore Dawn core file warnings to avoid merge conflicts.
