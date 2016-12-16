var el = $(".header"),
      pageHeight = document.documentElement.scrollHeight,
      viewportHeight = document.documentElement.clientHeight;

$(window).on('scroll', function (e) {
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    if ($(this).scrollTop() > 100 ) {
      el.addClass("header--gray");
    }
    else {
      el.removeClass("header--gray");
    }
})
