(function($){
    var Flider = function(container, options){
        var defaults = {
            effect : 'fade',
            duration: 100,
            autoPlay: true,
            delay: 1000,
            controls: false

        };

        var slides = container.children();
        var currentSlide = slides.first();

        container.css('position', 'relative');
        slides.css({
            'position': 'absolute',
            'z-index': '-1',
            'display': 'none',
            'top': 0,
            'left': 0,
            //'background-color': 'white'

        });
        currentSlide.css({
            'position': 'relative',
            'z-index': '1',
            'display': 'block'
        });

        var changeSlide = function(nextSlide, complete){
            nextSlide.css({
                'z-index': '0'
                //'display': 'block'
            });
            nextSlide.fadeIn({
                duration: options.duration,

            });
            currentSlide.fadeOut({
                duration: options.duration,
                complete: function(){
                    nextSlide.css({
                        'position': 'relative',
                        'z-index': '1'
                    });
                    currentSlide.css({
                        'position': 'absolute',
                        'z-index': '-1'
                    });

                    currentSlide = nextSlide;
                    if(complete)
                        complete();
                }
            });
        };

        options = $.extend(defaults,options);

        var prev = function(complete){

            var nextSlide = currentSlide.prev();
            if(nextSlide.length == 0){
                nextSlide = slides.last();
            }
            changeSlide(nextSlide,complete);
        };

        var next = function(complete){

            var nextSlide = currentSlide.next();
            if(nextSlide.length == 0){
                nextSlide = slides.first();
            }
            changeSlide(nextSlide,complete);
        };


        var autoPlay = null;
        var play = function(){
            next(function(){
                autoPlay = setTimeout(play,options.delay);
            });
        };

        var prevButton = $('<a href="#" >Prev</a>');
        var nextButton = $('<a href="#" >Next</a>');

        prevButton.click(function(){
            prev();
            return false;
        });
        nextButton.click(function(){
            next();
            return false;
        });
        if(options.controls) {
            container.append(prevButton, nextButton);
        }


        if(options.autoPlay){
            clearTimeout(autoPlay);
            autoPlay = setTimeout(play,options.delay);
        }

    };

    $.fn.flider = function(options){
        return this.each(function(){
            var container = $(this);
            var slider = new Flider(container, options);
            container.data('flider', slider);
            return container;
        });
    };

})(jQuery);