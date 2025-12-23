/**
 * Gift Card Line Item Properties - Dromgoole's Custom Component
 *
 * Duplicates gift card recipient form data as visible line item properties
 * so they display on orders and packing slips (not just in the cart).
 *
 * The standard Shopify gift card recipient form uses special property names
 * that get processed for email delivery but don't show as line item properties.
 * This component mirrors those values to display properties.
 */

if (!customElements.get('gift-card-properties')) {
  customElements.define(
    'gift-card-properties',
    class GiftCardProperties extends HTMLElement {
      constructor() {
        super();

        // Get section ID from data attribute
        this.sectionId = this.dataset.sectionId;

        // Get all the recipient form fields
        this.recipientCheckbox = document.querySelector(`#Recipient-checkbox-${this.sectionId}`);
        this.recipientEmail = document.querySelector(`#Recipient-email-${this.sectionId}`);
        this.recipientName = document.querySelector(`#Recipient-name-${this.sectionId}`);
        this.recipientMessage = document.querySelector(`#Recipient-message-${this.sectionId}`);
        this.recipientSendOn = document.querySelector(`#Recipient-send-on-${this.sectionId}`);

        // Prefix original Shopify properties with underscore to hide them
        this.prefixOriginalProperties();
        
        // Create hidden inputs for line item properties
        this.createHiddenFields();
        
        // Listen for changes on all fields
        if (this.recipientCheckbox) {
          this.recipientCheckbox.addEventListener('change', this.updateHiddenFields.bind(this));
        }
        if (this.recipientEmail) {
          this.recipientEmail.addEventListener('input', this.updateHiddenFields.bind(this));
        }
        if (this.recipientName) {
          this.recipientName.addEventListener('input', this.updateHiddenFields.bind(this));
        }
        if (this.recipientMessage) {
          this.recipientMessage.addEventListener('input', this.updateHiddenFields.bind(this));
        }
        if (this.recipientSendOn) {
          this.recipientSendOn.addEventListener('input', this.updateHiddenFields.bind(this));
        }
      }
      
      prefixOriginalProperties() {
        // Add underscore prefix to original Shopify properties to hide them
        // (properties starting with _ are filtered out in Dawn templates)
        if (this.recipientEmail) {
          this.recipientEmail.name = 'properties[_Recipient email]';
        }
        if (this.recipientName) {
          this.recipientName.name = 'properties[_Recipient name]';
        }
        if (this.recipientMessage) {
          this.recipientMessage.name = 'properties[_Message]';
        }
        if (this.recipientSendOn) {
          this.recipientSendOn.name = 'properties[_Send on]';
        }
      }

      createHiddenFields() {
        // Create hidden inputs that will become line item properties
        this.hiddenEmail = document.createElement('input');
        this.hiddenEmail.type = 'hidden';
        this.hiddenEmail.name = 'properties[Gift Card Recipient Email]';
        this.hiddenEmail.disabled = true;

        this.hiddenName = document.createElement('input');
        this.hiddenName.type = 'hidden';
        this.hiddenName.name = 'properties[Gift Card Recipient Name]';
        this.hiddenName.disabled = true;

        this.hiddenMessage = document.createElement('input');
        this.hiddenMessage.type = 'hidden';
        this.hiddenMessage.name = 'properties[Gift Card Message]';
        this.hiddenMessage.disabled = true;

        this.hiddenSendOn = document.createElement('input');
        this.hiddenSendOn.type = 'hidden';
        this.hiddenSendOn.name = 'properties[Gift Card Send On]';
        this.hiddenSendOn.disabled = true;

        // Append to the component
        this.appendChild(this.hiddenEmail);
        this.appendChild(this.hiddenName);
        this.appendChild(this.hiddenMessage);
        this.appendChild(this.hiddenSendOn);
      }

      updateHiddenFields() {
        // Only enable and populate if checkbox is checked
        const isChecked = this.recipientCheckbox && this.recipientCheckbox.checked;

        if (isChecked) {
          // Enable fields and copy values
          if (this.recipientEmail && this.recipientEmail.value) {
            this.hiddenEmail.value = this.recipientEmail.value;
            this.hiddenEmail.disabled = false;
          } else {
            this.hiddenEmail.disabled = true;
          }

          if (this.recipientName && this.recipientName.value) {
            this.hiddenName.value = this.recipientName.value;
            this.hiddenName.disabled = false;
          } else {
            this.hiddenName.disabled = true;
          }

          if (this.recipientMessage && this.recipientMessage.value) {
            this.hiddenMessage.value = this.recipientMessage.value;
            this.hiddenMessage.disabled = false;
          } else {
            this.hiddenMessage.disabled = true;
          }

          if (this.recipientSendOn && this.recipientSendOn.value) {
            this.hiddenSendOn.value = this.recipientSendOn.value;
            this.hiddenSendOn.disabled = false;
          } else {
            this.hiddenSendOn.disabled = true;
          }
        } else {
          // Disable all hidden fields when checkbox is unchecked
          this.hiddenEmail.disabled = true;
          this.hiddenName.disabled = true;
          this.hiddenMessage.disabled = true;
          this.hiddenSendOn.disabled = true;
        }
      }
    },
  );
}
