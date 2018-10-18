
$(document).ready(function () {
    var $body = $(document.body);

    $('.dropdown-toggle').dropdown();

    $('.menuTopItem')
      .on('shown.bs.dropdown', (function($body) {
        return function(e) {
          if ($body.hasClass("active-nav")) {
            $body.scrollTop($(this).position().top);
          }
        };
      })($body));

    $('.carousel').carousel({
        interval: 3000,
        pause: "hover"
     });

     // Toggle for nav menu
     $('.menu-button').click(function (e) {
         e.preventDefault();
         showMenu();
     });
     // Toggle for sidebar
     $('.sidebar-button').click(function (e) {
         e.preventDefault();
         showSidebar();
     });

   // add/remove classes everytime the window resize event fires
   jQuery(window).resize((function ($body) {
     var $menuButton   = $('.menu-button');
     var $menuTopItems = $('.menuTopItem');

     return function() {
       var menuButtonDisplay = $menuButton.css('display');

       if (menuButtonDisplay === 'block') {
          $body.addClass("small-screen");
       }
       else if (menuButtonDisplay === 'none') {
          $body.removeClass("active-sidebar active-nav small-screen");
          $menuTopItems.removeClass("open");
       }
     }
   })($body));
 });

 var showSidebar = function () {
     $('body').removeClass("active-nav").toggleClass("active-sidebar");
     $('.menu-button').removeClass("active-button");
     $('.sidebar-button').toggleClass("active-button");
 }

 var showMenu = function () {
     $('body').removeClass("active-sidebar").toggleClass("active-nav");
     $('.sidebar-button').removeClass("active-button");
     $('.menu-button').toggleClass("active-button");
 }

 // add/remove classes everytime the window resize event fires
 jQuery(window).resize(function () {
     var off_canvas_nav_display = $('.off-canvas-navigation').css('display');
     var menu_button_display = $('.menu-button').css('display');
     if (off_canvas_nav_display === 'block') {
         $("body").removeClass("three-column").addClass("small-screen");
     }
     if (off_canvas_nav_display === 'none') {
         $("body").removeClass("active-sidebar active-nav small-screen")
			.addClass("three-column");
     }

 });
