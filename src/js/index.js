import $ from "jquery";


$( document ).ready(function() {

    // Стили хедера при прокрутке страницы
    let header = $('.header');
    function checkScrollTop (){
        if($(window).scrollTop() > 0) {
            header.addClass('scrolled');
        } else {
            header.removeClass('scrolled');
        }
    }
    checkScrollTop();
    $(window).scroll(function() {
        checkScrollTop ()
    });

    // Открытие меню
    $(".header").on("click",".header__btn-burger", function(){
        $(".header__btn-burger").toggleClass('opened');
        $(".header__backdrop").fadeToggle(300);
        $(".header__toggle-menu").slideToggle(300);
    });

    // Закрытие меню по клику вне меню
    $(document).click(function (e) {
        if ($(e.target).closest(".header__toggle-menu, .header__btn-burger").length) {
            return;
        }
        if ($(window).width() < 1200){
            $(".header__btn-burger").removeClass('opened');
            $(".header__backdrop").fadeOut(300);
            $(".header__toggle-menu").slideUp(300);
        }
    });


});
$( window ).on( "load", function() {
    // Анимация панели
    $('.entry__animation_show').addClass("animation_end");
} );
