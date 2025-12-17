/**
 * Dromgoole's Product Slideshow Enhancement
 *
 * Fixes the slider button disabled states for the slideshow layout.
 * Dawn's SliderComponent uses scroll position calculations that can
 * be imprecise with scroll-snap, so we override the button state logic.
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

  /**
   * Update button disabled states based on current slide position
   */
  function updateButtonStates() {
    const slideWidth = slides[0].offsetWidth;
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

  // Override the scroll event handling
  slider.addEventListener('scroll', debounce(updateButtonStates, 50));

  // Also update on resize
  window.addEventListener('resize', debounce(updateButtonStates, 100));

  // Initial state
  updateButtonStates();

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
