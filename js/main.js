(function () {
  "use strict";
  var $ = jQuery;

  // main
  $(function () {
    init();
  });

  // lifecycle

  // This is meant to be called only once
  function init() {
    initSlickCarousel();
    initMobileNav();
    initCarousel();
    initCustomForms();
  }

  // General inits
  function initSlickCarousel() {
    $('.info-slider').slick({
      slidesToShow: 3,
      arrows: false,
      infinite: false,
      responsive: [{
        breakpoint: 768,
        settings: {
          slidesToScroll: 1,
          slidesToShow: 1
        }
      }]
    });
  }

  function initMobileNav() {
    $('body').mobileNav({
      menuActiveClass: 'nav-active',
      menuOpener: '.nav-opener'
    });
    $('body').mobileNav({
      menuActiveClass: 'filter-active',
      menuOpener: '.filter-by'
    });
    $('body').mobileNav({
      menuActiveClass: 'research-active',
      menuOpener: '.research-opener'
    });
    $('.autocomplete').mobileNav({
      menuActiveClass: 'auto-active',
      menuOpener: '.opener',
      hideOnClickOutside: true,
      menuDrop: '.drop'
    });
  }

  function initCarousel() {
    $('.testimonial-slider').scrollGallery({
      mask: '.mask',
      slider: '.slideset',
      slides: '.slide',
      stretchSlideToMask: true
    });
  }

  function initCustomForms() {
    jcf.setOptions('Select', {
      wrapNative: false,
      wrapNativeOnMobile: false,
    });
    jcf.replaceAll();
  }

}());
