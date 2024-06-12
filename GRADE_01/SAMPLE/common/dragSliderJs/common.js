var isIPad = navigator.userAgent.match(/iPad/i) != null;

var isMobile;
var isAndroid;
var downEvent, moveEvent, upEvent, clickEvent, overEvent, outEvent;

if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) ) {
    isMobile = true;
    downEvent = "touchstart";
    moveEvent = "touchmove";
    upEvent = "touchend";
    clickEvent = "click";
}else {
    isMobile = false;
    downEvent = "mousedown";
    moveEvent = "mousemove";
    overEvent = "mouseover";
    outEvent = "mouseout";
    upEvent = "mouseup";
    clickEvent = "click";
};

if(/Android/i.test(navigator.userAgent)){
    isAndroid = true;
};

var factor = 1;

var titleUp, titleDown;
var snd = [];
var snd2 = [];
var resetSound; // 사운드 리셋
var resetAllSound; // 전체 사운드 리셋
var sndBasePath = "./DVD/media/sound/";
var closeZoom; // 줌버튼 끄기
var soundEnd; // 사운드 끝날 때
var allSound; // 전체 사운드
var aniVideo;
var groupPlay = false;
var guide = false; // 가이드 말풍선
$(function(){
    $('input[type=text]').each(function(){
        if( !$(this).hasClass('canTab') )
        $(this).attr('tabindex','-1');
        $(this).attr('autocomplete','off');
    });
    $('textarea').each(function(){
        if( !$(this).hasClass('canTab') )
        $(this).attr('tabindex','-1');
        $(this).attr('autocomplete','off');
    });

    /* 컨텐츠 위 아래 슬라이드 버튼 */
    if( $('.openDiv').length != 0 )
    var openDivH = $('.openDiv').css('height');

    if( navigator.userAgent.indexOf('Chrome') != -1 ){
        // setTimeout(function(){openDivH = $('.openDiv').css('height');}, 100);
        window.onload = function(){openDivH = $('.openDiv').css('height');};
    };

    $('.openBtn .downBtn .arrow').addClass('arrow1');
    $('.downBtn').on('click', function(){
        new Audio('./DVD/media/sound/effect/click.mp3').play();
        $('.arrow').removeClass('arrow1');
        $('.arrow').removeClass('arrowON1');
        if( $(this).hasClass('upBtn') ){
            $(this).removeClass('upBtn');
            $('.scrollBox').stop().animate({'top':'0px'}, 500);
            $('.arrow').removeClass('arrowON');

            setTimeout( function(){ $('.arrow').addClass('arrow1'); }, 500 );
            if( titleUp != null ) titleUp();
        } else {
            $(this).addClass('upBtn');
            $('.scrollBox').stop().animate({'top': '-' + openDivH}, 500);
            $('.arrow').addClass('arrowON');

            setTimeout( function(){ $('.arrow').addClass('arrowON1'); }, 500 );
            if( titleDown != null ) titleDown();
        }
    }); 
    
    $('.arrow').on(overEvent, function(){
        if( $(this).hasClass('arrow1') ){
            $(this).addClass('arrow1ON');
        } else if ( $(this).hasClass('arrowON1') ){
            $(this).addClass('arrowON1ON');
        }
    }).on(outEvent, function(){
        if( $(this).hasClass('arrow1ON') ){
            $(this).removeClass('arrow1ON');
        } else if ( $(this).hasClass('arrowON1ON') ){
            $(this).removeClass('arrowON1ON');
        }
    });
    /* 컨텐츠 위 아래 슬라이드 버튼 */



    /* 컨텐츠 탭 버튼 */
    $("div.tabContent").hide(); // 전부 숨기고 
    $("div.tabContent").eq(0).show(); // 맨 처음 tab 에 해당하는 본문은 default 로 보여준다 
    $("div.tabInContent").hide(); // 전부 숨기고 
    $("div.tabInContent").eq(0).show(); // 맨 처음 tab 에 해당하는 본문은 default 로 보여준다 

    $("li.tab-nav").on('click', function(){ // 클릭 이벤트 
        if( !$(this).hasClass('selected') ){
            soundEnd();
            new Audio('./DVD/media/sound/effect/button_sound.mp3').play();
            var mvDiv = $(this).children("a").attr("type");

            if( $(this).parent().attr('id') == 'tabIn-tabs' ){
                $("div.tabInContent").hide();
                $("#tabIn-tabs").find(".tab-nav").removeClass("selected");
                $("#tabIn-tabs").find(".tab-nav").removeClass("zindex");
            } else {
                $("div.tabContent").hide();
                $("#menu-tabs > ul").find(".tab-nav").removeClass("selected");
                $("#menu-tabs > ul").find(".tab-nav").removeClass("zindex");
            }
            $("div" + mvDiv).show();
            $(this).addClass("selected");
            $(this).addClass("zindex");
            
            $('.retryBtn').click();
        }
    });
    /* 컨텐츠 탭 버튼 */



    /* 버튼 오버 및 사운드 이벤트 */
    $('.hoverBtn').on(overEvent, function(){
        var thisClass = $(this).attr('data-hover');
        $(this).addClass(thisClass + 'ON');
    }).on(outEvent, function(){
        var thisClass = $(this).attr('data-hover');
        $(this).removeClass(thisClass + 'ON');
    }); // 오버 이벤트

    $('.hoverBtn').on('click', function(e){
        if( e.originalEvent != null && ((e.originalEvent.isTrusted === true && e.originalEvent.isPrimary === undefined) || e.originalEvent.isPrimary === true) ) {
            if( !$(this).hasClass('thisNoSound') )
            new Audio('./DVD/media/sound/effect/click.mp3').play();
        };
    });
    $('.slideDot').on('click', function(e){
        new Audio('./DVD/media/sound/effect/click.mp3').play();
    });
    /* 버튼 오버 및 사운드 이벤트 */



    /* 정답, 리셋 버튼 확인 (생각열기) */
    /*
    $('.mouse').each(function(idx){
        $(this).on('click', function(){
            $(this).hide();
            $(this).parent().find('.answer').show();
            $(this).parent().find('.retryBtn').show();

            // 인풋 기억
            if( $('.reInput').eq(idx).children()[0] == null ){
                $('.reInput').eq(idx).css('opacity',0);
                $('.reInput').eq(idx).attr('disabled',true);
            } else {
                $('.reInput').eq(idx).find('input[type=text]').css('opacity',0);
                $('.reInput').eq(idx).find('input[type=text]').attr('disabled',true);
                $('.reInput').eq(idx).find('textarea').css('opacity',0);
                $('.reInput').eq(idx).find('textarea').attr('disabled',true);

                $('.reInput').eq(idx).find('input[type=checkbox]').prop('checked', '');
                $('.reInput').eq(idx).find('input[type=radio]').prop('checked', '');
                $('.reInput').eq(idx).find('label').css('pointer-events', 'none');
                $('.reInput').eq(idx).find('.answerCheck').prop('checked', 'checked');
            }

            soundEnd();
        });
    });
    */ // 마우스 클릭
    
    $('.retryBtn').each(function(idx){
        $(this).on('click', function(e){
            if( !$(this).hasClass('noHide') )
            $(this).hide();
            $(this).parent().find('.answer').hide();
            $(this).parent().find('.mouse').show();

            $('.textarea_back .textarea').eq(idx).css('opacity',1);
            $('.textarea_back .textarea').eq(idx).attr('disabled',false);
            $('.textarea_back').eq(idx).find('.answer').hide();
            $('.textarea_back').eq(idx).find('.exImg').hide();
            $('.textarea_back').eq(idx).hide();
            $('.checkBtn').eq(idx).show();
            $('.writeBtn').eq(idx).removeClass('showText');

            // 인풋 기억
            if( $('.reInput').eq(idx).children()[0] == null ){
                $('.reInput').eq(idx).css('opacity',1);
                $('.reInput').eq(idx).attr('disabled',false);
            } else {
                $('.reInput').eq(idx).find('input[type=text]').css('opacity',1);
                $('.reInput').eq(idx).find('input[type=text]').attr('disabled',false);
                $('.reInput').eq(idx).find('textarea').css('opacity',1);
                $('.reInput').eq(idx).find('textarea').attr('disabled',false);

                $('.reInput').eq(idx).find('input[type=checkbox]').prop('checked', '');
                $('.reInput').eq(idx).find('input[type=radio]').prop('checked', '');
                $('.reInput').eq(idx).find('label').css('pointer-events', 'auto');
            };

            if( closeZoom )
            closeZoom();

            soundEnd();
        });
    }); // 다시하기

    $('.checkBtn').each(function(idx){
        $(this).on('click', function(e){
            $(this).hide();
            $('.retryBtn').eq(idx).show();
            $('.textarea_back .textarea').eq(idx).attr('disabled',true);
            $('.textarea_back .textarea').eq(idx).css('opacity',0);
            $('.textarea_back').eq(idx).find('.answer').show();
            $('.textarea_back').eq(idx).find('.exImg').show();
            $('.textarea_back').eq(idx).show();
            $('.writeBtn').eq(idx).removeClass('showText');

            if( closeZoom )
            closeZoom();

            soundEnd();
        });
    }); // 체크

    var saveText = []; 
    $('.textarea_back .textarea').each(function(idx){
        $(this).on('keyup', function(){
            saveText[idx] = $(this).val();
        });
    }); // 생각열기 textarea text 기억하기

    $('.writeBtn').each(function(idx){ 
        $(this).on('click', function(){
            if( $(this).hasClass('showText') ){
                $(this).removeClass('showText')
                $('.textarea_back').eq(idx).hide();
            } else {
                $(this).addClass('showText')
                $('.textarea_back').eq(idx).show();
                $('.textarea_back .textarea').eq(idx).css('opacity',1);
                $('.textarea_back .textarea').eq(idx).attr('disabled',false);
                $('.textarea_back').eq(idx).find('.answer').hide();
                $('.textarea_back').eq(idx).find('.exImg').hide();
            };
            $('.retryBtn').eq(idx).hide();
            $('.checkBtn').eq(idx).show();

            if( closeZoom )
            closeZoom();

            soundEnd();
        });
    }); // 쓰기
    /* 정답, 리셋 버튼 확인 (생각열기) */



    /* 돋보기 기능 */
    var zoomIn = false;
    $('.zoomBtn').on('click', function(){
        if( zoomIn ){
            closeZoom();
        } else {
            zoomIn = true;
            $(".magnifier").show();
            var target = $(this).parent('.magnify').find('img'); 
            var zoom = target.attr('data-zoom');
            var magnifier = $(this).parent('.magnify').find('.magnifier');    
            var zoomBtnX = Number($(this).parent('.magnify').parent().find('.zoomBtn').css('left').replace('px', ''));
            var zoomBtnY = Number($(this).parent('.magnify').parent().find('.zoomBtn').css('top').replace('px', ''));

            $(this).parent('.magnify').find('.magnifier').css({
                "background": "url('" + target.attr("src") + "') no-repeat", 
                "background-size": target.width() * zoom + "px " + target.height() * zoom + "px",
                "background-position": -(zoomBtnX * zoom - magnifier.width() /2) + "px " + -(zoomBtnY * zoom - magnifier.height() /2)+ "px",
                "left": (zoomBtnX - magnifier.width() /2) + 'px',
                "top": (zoomBtnY - magnifier.height() /2) + 'px'});

            $(".magnifyBox").on(moveEvent, magnify);
        };
        soundEnd();
    }); // 돋보기 클릭

    function magnify(e) { 
        var target = $(this).find('img'); 
        var zoom = target.attr('data-zoom');
        var magnifier = $(this).find('.magnifier');

        var zoomBtnX = Number($(this).parent().find('.zoomBtn').css('left').replace('px', ''));
        var zoomBtnY = Number($(this).parent().find('.zoomBtn').css('top').replace('px', ''));

        $(this).find('.magnifier').css({
            "background": "url('" + target.attr("src") + "') no-repeat", 
            "background-size": target.width() * zoom + "px " + target.height() * zoom + "px",
            "background-position": -(zoomBtnX * zoom - magnifier.width() /2) + "px " + -(zoomBtnY * zoom - magnifier.height() /2)+ "px",
            "left": (zoomBtnX - magnifier.width() /2) + 'px',
            "top": (zoomBtnY - magnifier.height() /2) + 'px'});
    
            var mouseX = (isMobile ? e.touches[0].pageX : e.pageX) - $(this).offset().left;
            var mouseY = (isMobile ? e.touches[0].pageY : e.pageY) - $(this).offset().top;
    
        if( zoomIn ){
            if (mouseX < $(this).width() && mouseY < $(this).height() && mouseX > 0 && mouseY > 0) {
                magnifier.fadeIn(100);
            } else {
                magnifier.fadeOut(100); 
            }
        }
    
        if (magnifier.is(":visible")) { 
            var rx = -(mouseX * zoom - magnifier.width() /2 ); 
            var ry = -(mouseY * zoom - magnifier.height() /2 ); 
    
            var px = mouseX - magnifier.width() / 2; 
            var py = mouseY - magnifier.height() / 2;

            magnifier.css({
                left: px,
                top: py,
                backgroundPosition: rx + "px " + ry + "px"
            });
        };

        closeZoom = function(){
            zoomIn = false;
            $(".magnifier").hide();
        }
    }; // 돋보기 기능
    /* 돋보기 기능 */

    

    /* 팝업 온/오프 기능 */
    $('.popupOpen').on('click', function(){
        var popup = $(this).attr('data-popup');
        $('.openPopup' + popup).stop().animate({'top':0}, 500);

        $('.openPopup' + popup + ' .answer').hide();
        $('.openPopup' + popup + ' .mouse').show();
        $('.openPopup' + popup + ' .retryBtn').hide();

        $('.retryBtn').click();

        if( closeZoom )
        closeZoom();

        soundEnd();
    });
    $('.popupClose').on('click', function(){
        if( !$(this).hasClass('noAction') ){
            if( $(this).parent().hasClass('popup') ){
                $(this).parent().parent().stop().animate({'top':'-100%'}, 500);
            } else if( $(this).parent().hasClass('videoWrap') ) {
                $(this).parent().hide();
            } else {
                $(this).parent().stop().animate({'top':'-100%'}, 500);
            };
        };
        if( closeZoom )
        closeZoom();
    }); // 팝업 오픈 클로즈
    /* 팝업 온/오프 기능 */



    /* 사운드 기능 */
    var sndText;
    $(".sndPlay").each(function(idx){
        $(this).on('click', function(){
            if( $(this).hasClass('soundBtnMute') ){
                soundEnd();
                return false;
            };
            if( $(this).attr('data-snd') )
            sndText = $(this).attr('data-snd').split(',');
            $('.sndText').each(function(){
                if(sndText[0] == $(this).attr('data-idx'))
                $(this).click();
            });

            groupPlay = true;
            if( $(this).hasClass('soundBtn') )
            $(this).addClass('soundBtnMute');
        });
    });

    $('.sndText').on(overEvent, function(){
        if( !$(this).hasClass('noClick'))
        $(this).addClass('textHover');
    }).on(outEvent, function(){
        if( !$(this).hasClass('playing') )
        $(this).removeClass('textHover');
    }); // 사운드 텍스트 오버 이벤트

    $('.sndText').each(function(index){
        var idx;
        if( $(this).attr('data-idx') ){
            idx = Number($(this).attr('data-idx'));
        } else {
            idx = index;
        };
        var mp3 = $.parseJSON( $(this).attr( "data-mp3" ) ).mp3;
        snd[idx] = [];
        snd[idx].count = 0;
        for( var i = 0; i < mp3.length; i++ ){
            snd[idx][i] = new Audio();
            snd[idx][i].src = sndBasePath + mp3[i];

            snd[idx][i].addEventListener('ended', function() {
                if( !$(this).hasClass('thisClick') ){
                    snd[idx][snd[idx].count].pause();
                    snd[idx][snd[idx].count].currentTime = 0;
                    
                    if( snd[idx].count >= snd[idx].length - 1 ) {
                        if( sndText != undefined ){
                            if(sndText[1] != null ){
                                if( idx < Number(sndText[1]) ){
                                    $('.sndText').each(function(){
                                        if((idx+1) == $(this).attr('data-idx'))
                                        $(this).click();
                                    });
                                } else {
                                    if( soundEnd != null ) soundEnd();
                                }
                            } else {
                                if( soundEnd != null ) soundEnd();
                            };
                        } else {
                            if( soundEnd != null ) soundEnd();
                        };
                    }else {
                        snd[idx].count++;
                        snd[idx][snd[idx].count].play();
                    };
                };
            });
        };

        if( !$(this).hasClass('noClick') )
        $(this).css('cursor','pointer');
        $(this).on('click', function(e){
            if( e.originalEvent != null && ((e.originalEvent.isTrusted === true && e.originalEvent.isPrimary === undefined) || e.originalEvent.isPrimary === true) ) {
                $(this).addClass('thisClick');
                sndText = null;
            } else {
                $(this).removeClass('thisClick');
            } // 직접 클릭 or 트리거 addClass

            if( $(this).hasClass('thisClick') && $(this).hasClass('noClick') ){
                return false;
            }
            
            resetAllSound(groupPlay, guide);
            resetSound();

            $(this).addClass('playing');
            $(this).addClass('textHover');
            snd[idx][0].play();
        });
    }); // 사운드 텍스트 클릭 이벤트
    /* 사운드 기능 */



    /* 전체 사운드 기능 */
    var saveTime;
    var endTime = false;
    
    // 생각열기 애니 비디오
    if( $('#aniVideo')[0] != null )
    aniVideo = $('#aniVideo').get(0);

    $('.playFirstBtn').on('click', function(){
        $('.audioBtnWrap').show();
        $('.audioPlayBtn').click();
    });
    $(".audioPlayBtn").each(function(idx){
        $(this).on('click', function(){
            endTime = false;
            var i = idx;
            $('.playFirstBtn').hide();
            if( $(this).hasClass('audioPauseBtn') ){
                $(this).removeClass('audioPauseBtn');
                $(this).removeClass('audioPauseBtnON');
                $(this).attr('data-hover','audioPlayBtn');

                if( snd2[i] != null ){
                    var index;
                    $('.storyBox > p').each(function(){
                        if( $(this).hasClass('playing') )
                        index = $(this).index();
                    })
                    snd2[i][index].pause();
                    $( snd2[i][index].sndBtns ).find('.under').stop( true );
                    $( snd2[i][index].sndBtns ).find('.under').addClass('paused');
                    saveTime = snd2[i][index].currentTime;
                };

                if( aniVideo )
                aniVideo.pause();
            } else {    
                $(this).addClass('audioPauseBtn');
                $(this).attr('data-hover','audioPauseBtn')
                $('.sndPlay').removeClass('soundBtnMute');

                if( aniVideo )
                aniVideo.play();

                resetSound();
                if( allSound != null ){
                    if( snd2[i] != null ){
                        var index;
                        $('.storyBox > p').each(function(){
                            if( $(this).hasClass('playing') && !$(this).hasClass('thisClick') ){
                                index = $(this).index();
                            }
                        });
                        if( index == null ){
                            $('.storyBox > p').eq(0).click();
                        } else {
                            $('.storyBox > p').eq(index).click();
                        }
                    } else {
                        $('.storyBox > p').eq(0).click();
                    };
                };
            }
        });
    }); // 전체 사운드 클릭
    $(".audioStopBtn").on('click', function(){
        resetAllSound();
        soundEnd();
    }); // 정지 클릭
    if( aniVideo )
    aniVideo.addEventListener('ended', function(){
        resetAllSound();
    }); // 애니 비디오 끝났을 시

    if( aniVideo && isMobile )
    $('#aniVideo').attr('preload','metadata');

    $('.storyBox').each(function(idx){
        if( allSound ){
            snd2[idx] = [];
            for( var i = 0; i < $(this).children().length; i++ ){
                snd2[idx][i] = new Audio();
                snd2[idx][i].src = sndBasePath + allSound[i];
                snd2[idx][i].sndBtns = $('.storyBox > p').eq(i);
            
                snd2[idx][i].addEventListener('canplay', function() {
                    if( !$( this.sndBtns ).attr( "data-duration" ) ) {
                        $( this.sndBtns ).attr( "data-duration", Math.floor( this.duration * 1000 ) );
                    };
        
                    $( this ).off( "canplay" );
                }); // 플레이 가능할 시
            };
        };
       
        $(this).find('p').on('click', function(e){
            var index = $(this).index();
            resetSound();
            if( $('.storyBox').hasClass('pointer') ){
                $('.storyBox > p').removeClass('textHover');
                $('.storyBox > p').removeClass('playing');
            }

            if( e.originalEvent != null && ((e.originalEvent.isTrusted === true && e.originalEvent.isPrimary === undefined) || e.originalEvent.isPrimary === true) ) {
                resetAllSound();
                $(this).addClass('thisClick');
            } else {
                for( var i = 0 ; i < snd2.length ; i++ ) {
                    if( snd2[ i ] != null ) {
                        for (var s = 0; s < snd2[i].length; s++) {
                            if (snd2[i][s] != undefined ) {
                                if( s != index ){
                                    snd2[i][s].pause();
                                    snd2[i][s].currentTime = 0;
                                };
                            }
                        };
                    };
                };
                $(this).removeClass('thisClick');
            } // 직접 클릭 or 트리거 addClass

            snd2[idx][index].play();
            $(this).addClass('textHover');
            $(this).addClass('playing');

            snd2[idx][index].addEventListener('ended', function() {
                if( snd2[idx] != undefined ){
                    snd2[idx][index].pause();
                    snd2[idx][index].currentTime = 0;
                    if( $('.storyBox').hasClass('pointer') ){
                        $('.storyBox > p').eq(index).removeClass('textHover');
                        $('.storyBox > p').eq(index).removeClass('playing');
                    }

                    if( !$('.storyBox > p').eq(index).hasClass('thisClick') ){
                        $('.storyBox > p').eq(index).removeClass('thisClick');
                        if( $('.storyBox > p').eq(index).next().length == 0 ){
                            resetAllSound();
                        } else {
                            $('.storyBox > p').eq(index).next().click();
                        }
                    }
                    $( this.sndBtns ).find('.under').stop( true );
                    $( this.sndBtns ).find('.under').css('width','0%');
                };
            }); // 끝났을 시
            snd2[idx][index].addEventListener('timeupdate', function() {
                if( this.paused == false && $(this.sndBtns).find('.under').css('width') == '0px'){
                    $(this.sndBtns).find('.under').animate({'width':'100%'}, Number($(this.sndBtns).attr( "data-duration" )));
                };
            }); // 재생 중 (첫 소절 duration 못 불러와서)
            snd2[idx][index].addEventListener('play', function() {
                if( $(this.sndBtns).find('.under').hasClass('paused') ){
                    $(this.sndBtns).find('.under').animate({'width':'100%'}, Number($(this.sndBtns).attr( "data-duration" )) - (saveTime * 1000));
                    $( this.sndBtns ).find('.under').removeClass('paused');
                } else if( $(this.sndBtns).attr( "data-duration" ) ){
                    $(this.sndBtns).find('.under').animate({'width':'100%'}, Number($(this.sndBtns).attr( "data-duration" )));
                };
            }); // 플레이 시
        });
    });

    $('.storyBox > p').on(overEvent, function(){
        $(this).addClass('textHover');
    }).on(outEvent, function(){
        if( !$(this).hasClass('playing') )
        $(this).removeClass('textHover');
    }); // 사운드 텍스트 오버 이벤트
    /* 전체 사운드 기능 */



    /* 페이지 탭 이동 */
    $('.GOPAGE').each(function(idx){
        $(this).on('click', function(){
            soundEnd();
            new Audio('./DVD/media/sound/effect/button_sound.mp3').play();
            if( idx == 0 ){
                $('#container2').show();
                $('#container').hide();
                $('#container .textarea_back').parent().find('.retryBtn').click();
            } else if( idx == 1 ){
                $('#container2').hide();
                $('#container').show();
                $('#container2 .textarea_back').parent().find('.retryBtn').click();
            };

            if( closeZoom )
            closeZoom();

            $('.retryBtn').click();
        });
    }); // 페이지 탭 이동
    /* 페이지 탭 이동 */



    /* 화살표 애니 */
    $('.defaultAni').each(function(idx){
        $(this).on('click', function(){
            if( isMobile ) $('.hoverAni').eq(idx).click();
        });

        $(this).on(overEvent, function(){
            if( !$('.hoverAni').eq(idx).hasClass('finish_play') ){
                $('.hoverAni').eq(idx).show();
                $(this).hide();
                $('.charClick').eq(idx).addClass('charClickON');
            }
        }); // 애니 오버시
    }); // 기본 애니

    $('.hoverAni').each(function(idx){
        $(this).on('click', function(){
            if( $(this).hasClass('onePlay') ) $(this).addClass('finish_play');
            $(this).hide();
            $('.defaultAni').eq(idx).hide();
            $('.charClick').eq(idx).hide();
            $('.sndBalloon').eq(idx).show();
            $('.moveAni').eq(idx).show();
        }); // 애니 클릭시

        $(this).on(overEvent, function(){
            $('.charClick').eq(idx).addClass('charClickON');
        }).on(outEvent, function(){
            $(this).hide();
            if( !$('.moveAni').eq(idx).is(':visible') )
            $('.defaultAni').eq(idx).show();
            $('.charClick').eq(idx).removeClass('charClickON');
        }); // 애니 오버시
    }); // 오버 애니

    $('.charClick').each(function(idx){
        $(this).on(overEvent, function(){
            $('.hoverAni').eq(idx).show();
            $('.defaultAni').eq(idx).hide();
            $(this).addClass('charClickON');
        }).on(outEvent, function(){
            $('.hoverAni').eq(idx).hide();
            if( !$('.moveAni').eq(idx).is(':visible') )
            $('.defaultAni').eq(idx).show();
            $(this).removeClass('charClickON');
        }); // 화살표 오버시

        $(this).on('click', function(){
            $('.hoverAni').eq(idx).click();
        }); // 화살표 클릭시
    }); // 화살표 애니
    /* 화살표 애니 */



    /* 슬라이드 화살표 fade */
    // if(!isMobile)
    // $('.slideView').parent().parent().each(function(){
    //     if( $(this).find('.leftBtn')[0] != null ){
    //         $(this).find('.leftBtn').hide();
    //         $(this).find('.rightBtn').hide();
    //         $(this).find('.popupClose').hide();
    //     };

    //     $(this).on(overEvent, function(){
    //         if( $(this).find('.leftBtn')[0] != null ){
    //             $(this).find('.leftBtn').stop().fadeIn(500);
    //             $(this).find('.rightBtn').stop().fadeIn(500);
    //             $(this).find('.popupClose').stop().fadeIn(500);
    //         };
    //     }).on(outEvent,function(){
    //         if( $(this).find('.leftBtn')[0] != null ){
    //             $(this).find('.leftBtn').stop().fadeOut(500);
    //             $(this).find('.rightBtn').stop().fadeOut(500);
    //             $(this).find('.popupClose').stop().fadeOut(500);
    //         };
    //     });
    // });
    /* 슬라이드 화살표 fade */



    /* 말풍선 애니 */
    $('.guideChar > .sndText').each(function(idx){
        var hover = $(this).attr('data-hover');
        $(this).on('click', function(){
            if( $(this).hasClass('playingSnd') ){
                soundEnd();
            } else {
                $(this).parent().find('.guideChar_balloon').show();
                $(this).parent().find('.guideClick').hide();
                $(this).addClass('playingSnd');
                guide = true;
            };
        }); // 애니 클릭시

        $(this).on(overEvent, function(){
            $(this).addClass(hover + 'ON');
            $(this).parent().find('.guideClick').addClass('guideClickON');
        }).on(outEvent, function(){
            $(this).removeClass(hover + 'ON');
            $(this).parent().find('.guideClick').removeClass('guideClickON');
        }); // 애니 오버시
    }); // 오버 애니

    $('.guideClick').each(function(idx){
        $(this).on('click', function(){
            $(this).parent().find('.sndText').click();
        }); // 애니 클릭시

        $(this).on(overEvent, function(){
            var hover = $(this).parent().find('.sndText').attr('data-hover');
            $(this).parent().find('.sndText').addClass(hover + 'ON');
            $(this).addClass('guideClickON');
        }).on(outEvent, function(){
            var hover = $(this).parent().find('.sndText').attr('data-hover');
            $(this).parent().find('.sndText').removeClass(hover + 'ON');
            $(this).removeClass('guideClickON');
        }); // 애니 오버시
    }); // 화살표 애니
    /* 말풍선 애니 */



    /* 버튼 클릭시 음원 초기화 */
    $('.leftBtn').on('click', function(){
        soundEnd();
    });
    $('.leftBtn2').on('click', function(){
        soundEnd();
    });
    $('.rightBtn').on('click', function(){
        soundEnd();
    });
    $('.rightBtn2').on('click', function(){
        soundEnd();
    });
    $('.slideDot').on('click', function(){
        soundEnd();
    });
    /* 버튼 클릭시 음원 초기화 */



    /* pdf */
    $('.hoverBtn').on('click', function(){
        if( $(this).attr('data-link') ){
            var links = $(this).attr('data-link');

            if (window.jj && jj.native && jj.native.explorer) window.jj.native.exe('../' + links);
            else window.open('../' + links, "_blank");
        };
    });
    /* pdf */



    /* 직지 뷰어에서 스와이프 기능 x */
    var CanDragZone = document.getElementsByClassName('CanDragZone')[0];
    if( CanDragZone != null )
    CanDragZone.addEventListener('pointerup', function(e){ 
        e.stopPropagation(); 
    }); 
    var controls = document.getElementsByClassName('control')[0];
    if( controls != null )
    controls.addEventListener('pointerup', function(e){ 
        e.stopPropagation(); 
    });   
    /* 직지 뷰어에서 스와이프 기능 x */
}); // end
resetSound = function(){
    // $('.sndPlay').removeClass('soundBtnMute');
    $('.sndText').removeClass('playing');
    $('.sndText').removeClass('textHover');
    $('.sndText').removeClass('thisClick');

    if( closeZoom )
    closeZoom();

    for( var i = 0 ; i < snd.length ; i++ ) {
        if( snd[ i ] != null ) {
            for (s in snd[i]) {
                if (snd[i][s] != undefined && snd[i][s].paused == false) {
                    snd[i][s].pause();
                    snd[i][s].currentTime = 0;
                }
            };
        };
    };
} // 사운드 리셋
resetAllSound = function(groupPlay, guide){
    $('.audioBtnWrap').hide();
    $('.playFirstBtn').show();

    $('.storyBox > p').find('.under').css('width','0%');
    $('.storyBox > p').find('.under').stop( true );
    $('.storyBox > p').find('.under').removeClass('paused');
    $('.storyBox > p').removeClass('textHover');
    $('.storyBox > p').removeClass('playing');

    $('.audioPlayBtn').removeClass('audioPauseBtn');
    $('.audioPlayBtn').removeClass('audioPlayBtnON');
    $('.audioPlayBtn').attr('data-hover','audioPlayBtn');

    for( var i = 0 ; i < snd2.length ; i++ ) {
        if( snd2[ i ] != null ) {
            for (s in snd2[i]) {
                if (snd2[i][s] != undefined && snd2[i][s].paused == false ) {
                    snd2[i][s].pause();
                    snd2[i][s].currentTime = 0;
                }
            };
        };
    };

    if(!groupPlay)
    $('.hoverAni').each(function(idx){
        if( !$(this).hasClass('onePlay') ){
            $('.charClick').eq(idx).show();
            $('.charClick').eq(idx).addClass('blink');
        }
        $('.moveAni').eq(idx).hide();
        $('.sndBalloon').eq(idx).hide();

        if( !$('.hoverAni').eq(idx).is(':visible') )
        $('.defaultAni').eq(idx).show();
        // $('.defaultAni').eq(idx).css('cursor','auto');
    });

    $('.guideChar_balloon').hide();
    $('.guideClick').show();
    if(!guide)
    $('.guideChar > .sndText').removeClass('playingSnd');

    if( aniVideo ){
        aniVideo.currentTime = 0;
        aniVideo.pause();

        // if( isMobile )

    }
}
soundEnd = function(){
    for( var i = 0 ; i < snd.length ; i++ ) {
        if( snd[ i ] != null ) {
            snd[i].count = 0;
            for (var s = 0; s < snd[i].length; s++) {
                if (snd[i][s] != undefined && snd[i][s].paused == false) {
                    snd[i][s].pause();
                    snd[i][s].currentTime = 0;
                }
            };
        };
    }; // 모든 소리 정지

    for( var i = 0 ; i < snd2.length ; i++ ) {
        if( snd2[ i ] != null ) {
            for (s in snd2[i]) {
                if (snd2[i][s] != undefined ) {
                    snd2[i][s].pause();
                    snd2[i][s].currentTime = 0;
                }
            };
        };
    };

    $('.sndPlay').removeClass('soundBtnMute');
    
    $('.audioBtnWrap').hide();
    $('.playFirstBtn').show();

    $('.storyBox > p').removeClass('textHover');
    $('.storyBox > p').find('.under').css('width','0%');
    $('.storyBox > p').find('.under').stop( true );
    $('.storyBox > p').find('.under').removeClass('paused');

    $('.audioPlayBtn').removeClass('audioPauseBtn');
    $('.audioPlayBtn').removeClass('audioPlayBtnON');
    $('.audioPlayBtn').attr('data-hover','audioPlayBtn');

    $('.sndText').removeClass('playing');
    $('.sndText').removeClass('textHover');
    $('.sndText').removeClass('thisClick');

    $('.hoverAni').each(function(idx){
        if( !$(this).hasClass('onePlay') ){
            $('.charClick').eq(idx).show();
            $('.charClick').eq(idx).addClass('blink');
        }
        $('.moveAni').eq(idx).hide();
        $('.sndBalloon').eq(idx).hide();

        if( !$('.hoverAni').eq(idx).is(':visible') )
        $('.defaultAni').eq(idx).show();
        // $('.defaultAni').eq(idx).css('cursor','auto');
    });
    
    $('.guideChar_balloon').hide();
    $('.guideClick').show();
    $('.guideChar > .sndText').removeClass('playingSnd');

    if( aniVideo ){
        aniVideo.currentTime = 0;
        aniVideo.pause();

        // if( isMobile )

    }

    groupPlay = false;
    guide = false;
} // 사운드 종료