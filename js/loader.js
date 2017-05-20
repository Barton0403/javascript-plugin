import jQuery from 'jquery';

(($) => {
  $(window).on('load', () => {
    $('.loader').removeClass('loading');
  });
})(jQuery);
