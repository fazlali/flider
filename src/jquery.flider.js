(function($){
    var Flider = function(wrapper, options){
        var slides = wrapper.children();
        var container =$('<div class="flider-container"></div>');
        container.append(slides);
        wrapper.append(container);
        wrapper.addClass('flider').css('z-index',0);

        var _this =this;
        var defaults = {
            effect : 'fade',
            duration: 100,
            autoPlay: true,
            delay: 1000,
            controls: false,
            onHoverPause: true,
            pager: false,
            pagerPosition: top,
            before: {
                do: function(slide,currentSlide,nextSlide){
                    slide.apply();
                },
                by: []

            },
            after: {
                do: function(currentSlide){

                },
                by: []

            }

        };
        options = $.extend(defaults,options);



        var changeSlide = function(nextSlide){

            if(nextSlide.is(currentSlide)){
                return;
            }

            nextSlide.css({
                'z-index': '0'
                //'display': 'block'
            });
            slides.each(function(index, slide){
                if($(slide) != nextSlide)
                    $(slide).data('pointer').removeClass('active').parent().removeClass('active');
            });
            nextSlide.data('pointer').addClass('active').parent().addClass('active');
            options.before.do.apply(_this,[
                function(){

                    switch(options.effect) {
                        case 'fade':

                            nextSlide.fadeIn({
                                duration: options.duration

                            });
                            currentSlide.fadeOut({
                                duration: options.duration,
                                complete: function () {
                                    nextSlide.css({
                                        'position': 'relative',
                                        'z-index': '1'
                                    });
                                    currentSlide.css({
                                        'position': 'absolute',
                                        'z-index': '-1'
                                    });

                                    currentSlide = nextSlide;
                                    options.after.do.apply(_this,[currentSlide].concat(options.after.by));

                                }
                            });

                            break;
                        case 'simple':

                            currentSlide.hide();
                            nextSlide.show();
                            currentSlide =nextSlide;
                            options.after.do.apply(_this,[currentSlide].concat(options.after.by));
                            break;

                    }
                },
                currentSlide,
                nextSlide
            ].concat(options.before.by));
        };


        var prev = function(){

            var nextSlide = currentSlide.prev();
            if(nextSlide.length == 0){
                nextSlide = slides.last();
            }
            changeSlide(nextSlide);
        };

        var next = function(){

            var nextSlide = currentSlide.next();
            if(nextSlide.length == 0){
                nextSlide = slides.first();
            }
            changeSlide(nextSlide);
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
                slide.data('pointer', pointer);
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

        var currentSlide = slides.first();
        switch(options.effect) {
            case 'fade':


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

                break;
            case 'simple':


                container.css({
                    'position': 'relative',
                    'overflow': 'hidden'
                });
                slides.css({
                    'display': 'none'
                });
                currentSlide.css({
                    'display': 'block'
                });

                break;
        }
        currentSlide.data('pointer').addClass('active').parent().addClass('active');


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