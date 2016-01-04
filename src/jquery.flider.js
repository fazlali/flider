(function($){
    var Flider = function(wrapper, options){
        var slides = wrapper.children();
        var container =$('<div class="flider-container"></div>');
        container.append(slides);
        wrapper.append(container);
        wrapper.addClass('flider').css('z-index',0);

        var defaults = {
            effect : 'fade',
            duration: 100,
            autoPlay: true,
            delay: 1000,
            controls: false,
            onHoverPause: true,
            pager: false,
            pagerPosition: top

        };

        var currentSlide = slides.first();

        container.css({
            'position': 'relative',
            'overflow': 'hidden'
        });
        slides.css({
            'position': 'absolute',
            'z-index': '-1',
            'display': 'none',
            'width': '100%',
            'top': 0
        });
        currentSlide.css({
            'position': 'relative',
            'z-index': '1',
            'display': 'block'
        });

        var changeSlide = function(nextSlide, complete){

            if(nextSlide.is(currentSlide)){
                return;
            }

            nextSlide.css({
                'z-index': '0'
                //'display': 'block'
            });
            nextSlide.fadeIn({
                duration: options.duration

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
        if(options.controls) {

            var prevButton = $('<a href="#" >Prev</a>');
            var nextButton = $('<a href="#" >Next</a>');
            var controls = $('<div class="controls"></div>');
            controls.append(prevButton, nextButton);
            wrapper.append(controls);

            prevButton.click(function () {
                prev();
                return false;
            });

            nextButton.click(function () {
                next();
                return false;
            });
        }


        if(options.autoPlay){
            clearTimeout(autoPlay);
            autoPlay = setTimeout(play,options.delay);
        }

        //if(options.onHoverPause){
        //    wrapper.mousehover(function(){
        //
        //    });
        //}

        if(options.pager){
            var pager = $('<ul class="flider-pager"></ul>');
            slides.each(function(index, item){
                var slide = $(item);
                var title =  index + 1;
                if(slide.children('.flide-title').length) {

                    title = slide.children('.flide-title').html();
                    slide.children('.flide-title').remove();
                }
                var pointer = $('<a href="#">' + title + '</a>');
                pointer.click(function (e) {
                    changeSlide(slide);
                    return false;
                });
                var li =$('<li></li>');
                li.append(pointer);
                pager.append(li);
            });
            switch (options.pagerPosition){
                case 'bottom':
                    wrapper.append(pager);
                    break;
                default:
                    wrapper.prepend(pager);
                    break;
            }
        }

    };

    $.fn.flider = function(options){
        return this.each(function(){
            var wrapper = $(this);
            var slider = new Flider(wrapper, options);
            wrapper.data('flider', slider);
            return wrapper;
        });
    };

})(jQuery);