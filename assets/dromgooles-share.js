/**
 * Dromgoole's Share Button Enhancement
 *
 * Handles:
 * 1. Custom dromgooles-share component with native share + copy fallback
 * 2. Legacy share-button enhancement with error handling
 *
 * This script supports both the new custom share component and Dawn's share-button.
 */

(function () {
  'use strict';

  /**
   * Initialize custom Dromgoole's share components
   */
  function initDromgoolesShare() {
    const shareContainers = document.querySelectorAll('.dromgooles-share');

    shareContainers.forEach((container) => {
      const nativeButton = container.querySelector('.dromgooles-share__native');
      const details = container.querySelector('.dromgooles-share__details');
      const copyButton = container.querySelector('.dromgooles-share__copy');
      const message = container.querySelector('.dromgooles-share__message');

      if (!nativeButton || !details) return;

      // Check if native share is available
      if (navigator.share) {
        // Show native button, hide details fallback
        nativeButton.classList.remove('hidden');
        details.classList.add('hidden');

        // Native share click handler
        nativeButton.addEventListener('click', async () => {
          const shareUrl = nativeButton.dataset.shareUrl || window.location.href;
          const shareTitle = nativeButton.dataset.shareTitle || document.title;

          try {
            await navigator.share({
              url: shareUrl,
              title: shareTitle,
            });
          } catch (err) {
            // AbortError = user cancelled, which is fine
            if (err.name !== 'AbortError') {
              console.warn('Share failed:', err.name, err.message);
            }
          }
        });
      }

      // Copy button handler (for fallback)
      if (copyButton) {
        copyButton.addEventListener('click', () => {
          const targetId = copyButton.dataset.copyTarget;
          const input = document.getElementById(targetId);

          if (input) {
            input.select();
            input.setSelectionRange(0, 99999); // For mobile

            navigator.clipboard
              .writeText(input.value)
              .then(() => {
                // Show success message
                if (message) {
                  message.classList.remove('hidden');
                  setTimeout(() => {
                    message.classList.add('hidden');
                  }, 2000);
                }
              })
              .catch((err) => {
                console.warn('Copy failed:', err);
                // Fallback: execCommand (deprecated but works)
                document.execCommand('copy');
                if (message) {
                  message.classList.remove('hidden');
                  setTimeout(() => {
                    message.classList.add('hidden');
                  }, 2000);
                }
              });
          }
        });
      }
    });
  }

  /**
   * Initialize legacy Dawn share-button components
   */
  function initLegacyShareButtons() {
    const shareButtons = document.querySelectorAll('share-button');

    shareButtons.forEach((shareButton) => {
      const nativeButton = shareButton.querySelector('button.share-button__button');
      const details = shareButton.querySelector('details');

      if (!nativeButton || !details) return;

      // If navigator.share exists, Dawn's share.js hides the details and shows the button
      // But we need to add proper error handling
      if (navigator.share && details.hasAttribute('hidden')) {
        // Clone and replace the button to remove Dawn's event listener
        const newButton = nativeButton.cloneNode(true);
        nativeButton.parentNode.replaceChild(newButton, nativeButton);

        // Add our enhanced click handler
        newButton.addEventListener('click', async (e) => {
          e.preventDefault();

          const urlInput = shareButton.querySelector('input');
          const shareUrl = urlInput ? urlInput.value : document.location.href;

          try {
            await navigator.share({
              url: shareUrl,
              title: document.title,
            });
          } catch (err) {
            // AbortError means user cancelled the share sheet - that's fine
            if (err.name !== 'AbortError') {
              console.warn('Share failed:', err.name, err.message);
            }
          }
        });
      }
    });
  }

  /**
   * Main initialization
   */
  function init() {
    initDromgoolesShare();
    initLegacyShareButtons();
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // Small delay to ensure other scripts have run
    setTimeout(init, 100);
  }
})();
