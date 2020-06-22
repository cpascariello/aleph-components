(function ($) {
  $(document).ready(function () {
    var $window = $(window),
      $body = $('body'),
      $sidebar = $('.sidebar'),
      $navbar = $('.navbar');

    //
    // Sidebar (Offcanvas)
    //

    $('.sidebar-toggler').click(toggleSidebar);
    $sidebar.find('.close').click(toggleSidebar);

    function toggleSidebar(e) {
      e.preventDefault();
      e.stopPropagation();

      var bodyClass = 'oc-sidebar-visible';
      if ($sidebar.hasClass('sidebar--left')) {
        bodyClass = 'oc-sidebar-visible-left';
      }

      $body.toggleClass(bodyClass);
      $body.addClass('oc-sidebar-transition');

      setTimeout(function () {
        $body.removeClass('oc-sidebar-transition');
      }, 350);
    }

    //
    // Navbar :: Sticky
    //

    if ($navbar.length && $navbar.hasClass('shards-navbar--sticky')) {
      // Make shadow class
      var shadowSize = $navbar.data('navbar-sticky-shadow-size') || 'large';
      var shadowWeight = $navbar.data('navbar-sticky-shadow-weight') || '2';
      var shadowClass = "box-shadow-" + shadowSize + "--" + shadowWeight;

      // If the value `none` is used for either shadow size or weight
      // remove the shadows altogether.
      if (shadowSize === "none" || shadowWeight === "none") {
        shadowClass = "";
      }

      // Make sticky header placeholder
      var navbarHeight = $navbar.outerHeight();
      var placeholderClass = 'sr-sticky-header-placeholder';
      var placeholder = '<div class="' + placeholderClass + '" style="display: block; height: ' + navbarHeight + 'px"></div>';

      $(window).scroll(throttle(function () {
        makeStickyHeader(shadowClass, placeholder);
      }, 200));
    }

    function makeStickyHeader(shadowClass, placeholder) {
      if ($window.scrollTop() > 1) {
        $navbar.addClass('persistent ' + shadowClass);
        if (!$('.' + placeholderClass).length) {
          $navbar.after(placeholder);
        }
        return;
      }
      $navbar.removeClass('persistent ' + shadowClass);
      $('.' + placeholderClass).remove();
    }

    //
    // Navbar :: Slide In (on load)
    //

    if ($navbar.hasClass('shards-navbar--slide')) {
      var timeout = $navbar.data('slide-timeout') || 500;
      setTimeout(function () {
        $navbar.addClass('shards-navbar--slide-visible');
      }, timeout);
    }


    //
    // YouTube Video Loading
    //

    $('.play-button').on('click', function () {
      var $parent = $(this).parent('.media-element-wrapper');
      var videoID = $parent.data('videoid');

      if (!videoID) {
        return;
      }

      $parent.addClass('media-element-wrapper--loaded');

      var iframe = document.createElement("iframe");

      iframe.setAttribute("frameborder", "0");
      iframe.setAttribute("allowfullscreen", "");
      iframe.setAttribute("src", "https://www.youtube.com/embed/" + videoID + "?rel=0&showinfo=0&autoplay=1");
      this.innerHTML = "";

      $parent.append(iframe);
    });


    //
    // Owl Carousel
    //

    var $owlCarousel = $('.owl-carousel');

    if ($owlCarousel.length) {
      $owlCarousel.each(function () {
        var owlSize = $(this).data('owl-carousel-size') || '1';
        var owlDots = Boolean($(this).data('owl-carousel-dots'));
        var owlNav = Boolean($(this).data('owl-carousel-nav'));
        var owlMargin = $(this).data('owl-carousel-margin');
        var owlLoop = Boolean($(this).data('owl-carousel-loop'));
        var owlAutoplay = Boolean($(this).data('owl-carousel-autoplay'));
        var owlRewind = Boolean($(this).data('owl-carousel-rewind')) || true;

        var config = {
          items: owlSize,
          responsive: {
            980: {
              items: owlSize,
            },
            0: {
              items: 1,
              nav: false,
              dots: false
            }
          }
        };

        if (owlDots) config.dots = owlDots;
        if (owlNav) config.nav = owlNav;
        if (owlMargin) config.margin = parseFloat(owlMargin);
        if (owlLoop) config.loop = owlLoop;
        if (owlAutoplay) config.autoplay = owlAutoplay;
        if (owlRewind) config.rewind = owlRewind;

        $(this).owlCarousel(config);
      });
    }


    //
    // Galleries
    //

    var $shardsGallery = $('.shards-gallery');

    if ($shardsGallery.length) {
      $shardsGallery.each(function () {
        $(this).magnificPopup({
          delegate: '.shards-gallery__image',
          type: 'image',
          gallery: {
            enabled: true
          }
        });
      })
    }


    //
    // Counters
    //

    var $counters = $('.shards-counter');

    if ($counters.length && window.ProgressBar) {
      $counters.each(function () {
        if (!$(this).hasClass('shards-counter--progress')) {
          return;
        }

        // Parse data values
        var counterType = $(this).data('counter-type') || 'circle';
        var counterColor = $(this).data('counter-color');
        var counterStrokeWidth = $(this).data('counter-stroke-width');
        var counterTrailWidth = $(this).data('counter-trail-width');
        var counterTrailColor = $(this).data('counter-trail-color');
        var counterEasing = $(this).data('counter-easing');
        var counterFill = $(this).data('counter-fill');
        var counterDuration = $(this).data('counter-duration');

        // Prepare the progress type.
        var progressTypes = ['Circle', 'SemiCircle', 'Line'];
        var progressType = upFirst(snakeToCamel(counterType));

        // Check if the progress type is valid.
        if (progressTypes.indexOf(progressType) === -1) {
          throw new Error('Shards Pro: The `counter-type` must be either: ' + progressTypes.join(', ') + '!');
        }

        // Prepare the children items.
        $(this).find('.counter-item').each(function (idx) {
          var counterId = 'sc-progress--' + idx;
          var $counterItemContainer = $(this).find('.counter-item__container');
          $counterItemContainer.attr('id', counterId);
          $counterItemContainer.addClass('counter-item__type-' + counterType);

          var counterValue = Number($(this).data('counter-value') || '0');
          var counterTextValue = $(this).data('counter-text-value') || '0';

          var config = {};

          if (counterColor) config.color = counterColor;
          if (counterStrokeWidth) config.strokeWidth = Number(counterStrokeWidth);
          if (counterTrailWidth) config.trailWidth = Number(counterTrailWidth);
          if (counterTrailColor) config.trailColor = counterTrailColor;
          if (counterFill) config.fill = counterFill;
          if (counterEasing) config.easing = counterEasing;
          if (counterDuration) config.duration = Number(counterDuration);

          config.text = {
            value: counterTextValue
          };

          config.step = function (state, circle) {
            var value = Math.round(circle.value() * 100);
            if (value === 0) {
              circle.setText('');
            } else {
              circle.setText(value);
            }
          }

          new ProgressBar[progressType]('#' + counterId, config).animate(counterValue);
        });

      });
    }

  });
})(jQuery);


//
// Utility Functions
//

// Uppercase first letter
function upFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// snake-case to camelCase
function snakeToCamel(string) {
  return string.replace(/([-_][a-z])/ig, function (found) {
    return found.toUpperCase().replace('-', '').replace('_', '');
  });
};

// Throttle
function throttle(fn, threshhold, scope) {
  threshhold || (threshhold = 250);
  var last,
    deferTimer;
  return function () {
    var context = scope || this;
    var now = +new Date,
      args = arguments;
    if (last && now < last + threshhold) {
      clearTimeout(deferTimer);
      deferTimer = setTimeout(function () {
        last = now;
        fn.apply(context, args);
      }, threshhold);
    } else {
      last = now;
      fn.apply(context, args);
    }
  };
}
