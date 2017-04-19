import jQuery from 'jquery';

(($) => {
  $(window).on('load', () => {
    $('.loader').removeClass('loading');
    console.log(1);
  });
})(jQuery);
