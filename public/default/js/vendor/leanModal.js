(function ($) {
    $.fn.extend({
        leanModal: function (options) {
            var defaults = {
                top: 100,
                overlay: 0.5,
                closeButton: null
			},
				overlay = $('<div id="overlay"></div>'),
				closeModal = function (modalID) {
					$('#overlay').fadeOut(200);
					$(modalID).css({ 'display' : 'none' });
				};

            $('BODY').append(overlay);

            options =  $.extend(defaults, options);

            return this.each(function () {

                var o = options;

                $(this).click(function (e) {
					var modalID = $(this).attr('href'),
						modalHeight = $(modalID).outerHeight(),
						modalWidth = $(modalID).outerWidth();

					$('#overlay').click(function () {
						closeModal(modalID);
					});
					$(o.closeButton).click(function () {
						closeModal(modalID);
					});
					// Esc key handle;
					$(document).keyup(function (e) {
						if (e.keyCode === 27) {
							closeModal(modalID);
						}
					});

					$('#overlay').css({ 'display' : 'block', opacity : 0 });
					$('#overlay').fadeTo(200, o.overlay);

					$(modalID).css({
						display: 'block',
						position: 'fixed',
						opacity: 0,
						zIndex: 9999,
						top: (typeof o.top === 'string') ? o.top : o.top + 'px',
						left: 50 + '%',
						marginLeft: -(modalWidth / 2) + 'px',
						marginTop: -(modalHeight / 2) + 'px'
					});

					$(modalID).fadeTo(200, 1);

					e.preventDefault();
				});
            });
        }
    });
}(jQuery));