/**
 * Dromgoole's Product Slideshow Enhancement
 *
 * Fixes the slider button disabled states for the slideshow layout.
 * Dawn's SliderComponent uses scroll position calculations that can
 * be imprecise with scroll-snap, so we override the button state logic.
 *
 * Also positions arrow buttons relative to the actual image width
 * when "Constrain to screen height" is enabled.
 */

(function () {
  'use strict';

  // Only run on product pages with slideshow layout
  const productSection = document.querySelector('.product--slideshow');
  if (!productSection) return;

  const sliderComponent = productSection.querySelector('slider-component');
  if (!sliderComponent) return;

  const slider = sliderComponent.querySelector('[id^="Slider-"]');
  const prevButton = sliderComponent.querySelector('button[name="previous"]');
  const nextButton = sliderComponent.querySelector('button[name="next"]');
  const slides = sliderComponent.querySelectorAll('[id^="Slide-"]');

  if (!slider || !prevButton || !nextButton || slides.length < 2) return;

  // Check if constrain to viewport is enabled
  const hasConstrainHeight = sliderComponent.querySelector('.constrain-height') !== null;

  /**
   * Update button disabled states based on current slide position
   */
  function updateButtonStates() {
    const scrollPosition = slider.scrollLeft;
    const maxScroll = slider.scrollWidth - slider.clientWidth;

    // Check if at the beginning (with small tolerance for rounding)
    const isAtStart = scrollPosition <= 5;

    // Check if at the end (with small tolerance for rounding)
    const isAtEnd = scrollPosition >= maxScroll - 5;

    // Update prev button
    if (isAtStart) {
      prevButton.setAttribute('disabled', 'disabled');
    } else {
      prevButton.removeAttribute('disabled');
    }

    // Update next button
    if (isAtEnd) {
      nextButton.setAttribute('disabled', 'disabled');
    } else {
      nextButton.removeAttribute('disabled');
    }
  }

  /**
   * Position buttons relative to the actual image/media width
   * This handles the "Constrain to screen height" option
   */
  function positionButtons() {
    // Only reposition if constrain height is enabled
    if (!hasConstrainHeight) return;

    // Get all visible slides and find the one currently in view
    const allSlides = sliderComponent.querySelectorAll('.product__media-item');
    if (!allSlides.length) return;

    // Use the first slide as reference since all images should have similar dimensions
    const referenceSlide = allSlides[0];

    // Find the actual media container within the slide
    const mediaContainer = referenceSlide.querySelector('.product-media-container');
    if (!mediaContainer) return;

    // Find the actual image or media element
    const mediaElement =
      mediaContainer.querySelector('.product__media img') || mediaContainer.querySelector('.product__media');
    if (!mediaElement) return;

    // Get the bounding rectangles
    const sliderRect = slider.getBoundingClientRect();
    const mediaRect = mediaElement.getBoundingClientRect();

    // Calculate the horizontal offset (how much the image is inset from slider edges)
    const leftOffset = mediaRect.left - sliderRect.left;
    const rightOffset = sliderRect.right - mediaRect.right;

    // Only apply positioning if there's actual offset (image is narrower than container)
    if (leftOffset > 20 || rightOffset > 20) {
      const buttonInset = 16; // 1rem equivalent

      prevButton.style.left = `${Math.max(leftOffset + buttonInset, buttonInset)}px`;
      prevButton.style.right = 'auto';

      nextButton.style.right = `${Math.max(rightOffset + buttonInset, buttonInset)}px`;
      nextButton.style.left = 'auto';
    } else {
      // Reset to CSS defaults if image fills the container
      prevButton.style.left = '';
      prevButton.style.right = '';
      nextButton.style.left = '';
      nextButton.style.right = '';
    }
  }

  // Override the scroll event handling
  slider.addEventListener('scroll', debounce(updateButtonStates, 50));

  // Also update on resize
  window.addEventListener(
    'resize',
    debounce(function () {
      updateButtonStates();
      positionButtons();
    }, 100),
  );

  // Initial state
  updateButtonStates();

  // Position buttons after images load
  if (hasConstrainHeight) {
    window.addEventListener('load', positionButtons);
    // Also try after a short delay in case images are cached
    setTimeout(positionButtons, 200);
    // And again after layout settles
    setTimeout(positionButtons, 500);
  }

  /**
   * Simple debounce function
   */
  function debounce(fn, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
  }
})();
