$( document ).ready(function() {
    $('.top.child').on('mouseenter', function () {
		$(this).children().slideDown();
	});
	$('.dropdown, .top.child').on('mouseleave', function () {
		$('.dropdown', this).stop(true).slideUp();
	});
	$('.top.child').on('tap', function () {
		$(this).children().slideDown();
	});
	$('.mobiletoggle').on('click', function () {
		$('nav').toggleClass('active');
	});
	$('.mobiletoggle').on('tap', function () {
		$('nav').toggleClass('active');
	});
});