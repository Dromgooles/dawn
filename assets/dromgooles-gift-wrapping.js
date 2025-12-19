/**
 * Gift Wrapping - Dromgoole's Custom Component
 * Adds/removes a gift wrapping product to cart when checkbox is toggled
 */

class GiftWrapping extends HTMLElement {
  constructor() {
    super();
    this.checkbox = this.querySelector('#gift-wrapping-checkbox');
    this.giftMessageWrapper = this.querySelector('#gift-message-wrapper');
    this.giftMessageInput = this.querySelector('#gift-message');
    this.charCountSpan = this.querySelector('#gift-message-count');

    // Get data attributes (set by Liquid)
    this.giftWrappingVariantId = this.checkbox?.dataset.variantId;
    this.giftWrappingProductHandle = this.checkbox?.dataset.productHandle;
    this.giftWrappingProductId = this.checkbox?.dataset.productId;

    // Flag to prevent re-triggering when we programmatically update checkbox
    this.isUpdating = false;

    this.init();
  }

  init() {
    if (!this.checkbox) return;

    // If we don't have a variant ID from Liquid, fetch it immediately
    if (!this.giftWrappingVariantId && this.giftWrappingProductHandle) {
      this.fetchVariantId();
    }

    // Add checkbox event listener
    this.checkbox.addEventListener('change', this.handleCheckboxChange.bind(this));

    // Add character count listener for gift message
    if (this.giftMessageInput) {
      this.giftMessageInput.addEventListener('input', this.updateCharCount.bind(this));
      this.updateCharCount();

      // Debounced update of gift message property when user types
      this.giftMessageInput.addEventListener(
        'input',
        this.debounce(() => {
          if (this.checkbox.checked) {
            this.updateGiftMessage();
          }
        }, 1000)
      );
    }

    // Subscribe to cart updates (for when user manually adds/removes gift wrapping)
    this.subscribeToCartUpdates();
  }

  subscribeToCartUpdates() {
    // Subscribe to Dawn's pub/sub cart update events
    if (typeof subscribe === 'function' && typeof PUB_SUB_EVENTS !== 'undefined') {
      subscribe(PUB_SUB_EVENTS.cartUpdate, this.onCartUpdate.bind(this));
    }
  }

  onCartUpdate(event) {
    // Check if the cart data includes gift wrapping
    const cartData = event?.cartData;
    if (!cartData || !cartData.items) return;

    const hasGiftWrapping = cartData.items.some((item) => {
      return (
        String(item.variant_id) === String(this.giftWrappingVariantId) || item.handle === this.giftWrappingProductHandle
      );
    });

    // Update checkbox state if it doesn't match cart state
    if (this.checkbox.checked !== hasGiftWrapping) {
      this.isUpdating = true;
      this.checkbox.checked = hasGiftWrapping;

      // Update gift message visibility
      if (this.giftMessageWrapper) {
        this.giftMessageWrapper.classList.toggle('hidden', !hasGiftWrapping);
        if (!hasGiftWrapping && this.giftMessageInput) {
          this.giftMessageInput.value = '';
          this.updateCharCount();
        }
      }

      this.isUpdating = false;
    }
  }

  fetchVariantId() {
    fetch(`/products/${this.giftWrappingProductHandle}.js`)
      .then((response) => response.json())
      .then((product) => {
        if (product.variants && product.variants.length > 0) {
          this.giftWrappingVariantId = String(product.variants[0].id);
          this.checkbox.dataset.variantId = this.giftWrappingVariantId;
        }
      })
      .catch((error) => {
        console.error('Error fetching gift wrapping product:', error);
      });
  }

  handleCheckboxChange(event) {
    // Ignore if we're programmatically updating the checkbox
    if (this.isUpdating) return;

    const isChecked = event.target.checked;

    // Show/hide gift message section
    if (this.giftMessageWrapper) {
      this.giftMessageWrapper.classList.toggle('hidden', !isChecked);

      if (!isChecked && this.giftMessageInput) {
        this.giftMessageInput.value = '';
        this.updateCharCount();
      }
    }

    // Add or remove gift wrapping from cart
    if (isChecked) {
      this.addGiftWrappingToCart();
    } else {
      this.removeGiftWrappingFromCart();
    }
  }

  addGiftWrappingToCart() {
    // If we don't have a variant ID, fetch it first then add
    if (!this.giftWrappingVariantId && this.giftWrappingProductHandle) {
      fetch(`/products/${this.giftWrappingProductHandle}.js`)
        .then((response) => response.json())
        .then((product) => {
          if (product.variants && product.variants.length > 0) {
            this.giftWrappingVariantId = String(product.variants[0].id);
            this.submitAddForm();
          } else {
            console.error('No variants found for gift wrapping product');
            this.checkbox.checked = false;
          }
        })
        .catch((error) => {
          console.error('Error fetching gift wrapping product:', error);
          this.checkbox.checked = false;
        });
      return;
    }

    this.submitAddForm();
  }

  submitAddForm() {
    if (!this.giftWrappingVariantId) {
      console.error('Gift wrapping variant ID not found');
      this.checkbox.checked = false;
      return;
    }

    // Get the gift message (if any)
    const giftMessage = this.giftMessageInput ? this.giftMessageInput.value.trim() : '';

    // Build the request body with line item properties
    const body = {
      items: [
        {
          id: parseInt(this.giftWrappingVariantId),
          quantity: 1,
          properties: {},
        },
      ],
    };

    // Only add gift message property if there's a message
    if (giftMessage) {
      body.items[0].properties['Gift Message'] = giftMessage;
    }

    fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          // Error occurred
          console.error('Error adding gift wrapping:', data.description);
          this.checkbox.checked = false;
          if (this.giftMessageWrapper) {
            this.giftMessageWrapper.classList.add('hidden');
          }
        } else {
          // Success - reload to show updated cart
          window.location.href = '/cart';
        }
      })
      .catch((error) => {
        console.error('Error adding gift wrapping to cart:', error);
        this.checkbox.checked = false;
        if (this.giftMessageWrapper) {
          this.giftMessageWrapper.classList.add('hidden');
        }
      });
  }

  updateGiftMessage() {
    // Update the gift message property on the existing line item
    const giftMessage = this.giftMessageInput ? this.giftMessageInput.value.trim() : '';

    // First get the cart to find the gift wrapping line item
    fetch('/cart.js')
      .then((response) => response.json())
      .then((cart) => {
        const giftItem = cart.items.find((item) => {
          return (
            String(item.variant_id) === String(this.giftWrappingVariantId) ||
            item.handle === this.giftWrappingProductHandle
          );
        });

        if (giftItem) {
          // Update the line item with new properties
          const updates = {
            id: giftItem.key,
            quantity: giftItem.quantity,
            properties: {
              'Gift Message': giftMessage || '',
            },
          };

          return fetch('/cart/change.js', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updates),
          });
        }
      })
      .then((response) => {
        if (response && response.json) {
          return response.json();
        }
      })
      .catch((error) => {
        console.error('Error updating gift message:', error);
      });
  }

  removeGiftWrappingFromCart() {
    // Get the cart and find the gift wrapping line item key
    fetch('/cart.js')
      .then((response) => response.json())
      .then((cart) => {
        const giftItem = cart.items.find((item) => {
          return (
            String(item.variant_id) === String(this.giftWrappingVariantId) ||
            item.handle === this.giftWrappingProductHandle
          );
        });

        if (giftItem) {
          // Submit a form to update cart - this guarantees page refresh
          const form = document.createElement('form');
          form.method = 'POST';
          form.action = '/cart/change';

          const idInput = document.createElement('input');
          idInput.type = 'hidden';
          idInput.name = 'id';
          idInput.value = giftItem.key;
          form.appendChild(idInput);

          const qtyInput = document.createElement('input');
          qtyInput.type = 'hidden';
          qtyInput.name = 'quantity';
          qtyInput.value = '0';
          form.appendChild(qtyInput);

          document.body.appendChild(form);
          form.submit();
        } else {
          // Item not found, just reload to sync state
          window.location.href = '/cart';
        }
      })
      .catch((error) => {
        console.error('Error removing gift wrapping:', error);
        this.checkbox.checked = true;
      });
  }

  updateCharCount() {
    if (!this.giftMessageInput || !this.charCountSpan) return;
    this.charCountSpan.textContent = this.giftMessageInput.value.length;
  }

  debounce(fn, delay) {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
  }
}

if (!customElements.get('gift-wrapping')) {
  customElements.define('gift-wrapping', GiftWrapping);
}
