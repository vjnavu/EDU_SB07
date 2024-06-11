

function SMVideoPlayer(_param){
    /*
    * *** param
    * */
    var videoEl = _param.videoEl[0];   //비디오 객체
    var controllContainer = _param.controllerContainer;     //컨트롤러가 들어갈 컨테이너

    var onVideoStart = _param.onVideoStart;     //영상 재생 이벤트 발생
    var onVideoEnd = _param.onVideoEnd;         //영상 종료 이벤트 발생

    var zoom = (_param.containerZoom) ? _param.containerZoom : 1;   //상위 컨테이너에 스케일이 적용된 경우 스케일값 저장

    var volume = 0.5;

    var thumbVideoEl;

    init();


    /*
    * ************************************************ init 함수 ************************************************
    * */
    function init(){
        createElement();
        setVideoEvent();
        setListener();
        setVolumeGauge();
        setSeekBar();
        setTimelineThumb();

        setInitPlayer();
    }



    /*
    * ************************************************ 비디오 컨트롤러 html 생성 ************************************************
    * */
    function createElement(){
        var contorllerHtml = '<div class="smVideoController">' +
            '                            <div class="controlButtons">' +
            '                                <div class="playToggle">' +
            '                                    <div class="btnPlayVideo"></div>' +
            '                                    <div class="btnPauseVideo"></div>' +
            '                                </div>' +
            '                                <div class="btnStopVideo"></div>' +
            '                                <div class="volumeToggle">' +
            '                                    <div class="btnVolume"></div>' +
            '                                    <div class="btnMute"></div>' +
            '                                </div>' +
            '                                <div class="volumeGauge">' +
            '                                    <span></span>' +
            '                                    <span></span>' +
            '                                    <span></span>' +
            '                                    <span></span>' +
            '                                    <span></span>' +
            '                                    <span></span>' +
            '                                    <span></span>' +
            '                                    <span></span>' +
            '                                    <span></span>' +
            '                                    <span></span>' +
            '                                </div>' +
            '                            </div>' +
            '                            <div class="seekArea">' +
            '                                <div class="track">' +
            '                                    <div class="trace"></div>' +
            '                                    <div class="seekBar"></div>' +
            '                                    <div class="sceneView">' +
            '                                        <video src=""></video>' +
            '                                    </div>' +
            '                                </div>' +
            '                            </div>' +
            '                            <div class="timeArea">' +
            '                                <div class="currentTime">00:00</div>' +
            '                                <div class="vBar"></div>' +
            '                                <div class="totalTime">00:00</div>' +
            '                            </div>' +
            '                            <div class="playSpeedArea">' +
            '                                <div class="currentSpeed">1.0X</div>' +
            '                                <ul class="speedSelector">' +
            '                                    <li data-value="2.0">2.0X</li>' +
            '                                    <li data-value="1.5">1.5X</li>' +
            '                                    <li data-value="1.2">1.2X</li>' +
            '                                    <li data-value="1" class="on">1.0X</li>' +
            '                                    <li data-value="0.7">0.7X</li>' +
            '                                </ul>' +
            '                            </div>' +
            '                            <div class="screenModeToggle">' +
            '                                <div class="normalScreen"></div>' +
            '                                <div class="fullScreen"></div>' +
            '                            </div>' +
            '                        </div>' +
            '                        <div class="smPlayerCloseBtn" title="닫기"></div>';


        controllContainer.append(contorllerHtml);
    }



    /*
    * *** 플레이어 초기 상태 설정
    * */
    function setInitPlayer(){
        //초기 볼륨설정
        setVideoVolume(volume, true);

        controllContainer.css("display", "block");

        //시간 설정
        controllContainer.find(".smVideoController .timeArea .totalTime").text(getFormedTime(videoEl.duration));

        thumbVideoEl = controllContainer.find(".smVideoController .sceneView video")[0];
        thumbVideoEl.currentTime = 0;
    }



    /*
    * ************************************************ 이벤트 리스너 ************************************************
    * */
    function setListener(){
        /*플레이, 일시정지 버튼*/
        controllContainer.find(".smVideoController .playToggle").on("click", function(){
            if($(this).hasClass("play") == true){
                pauseVideo();
            }else{
                playVideo();
            }
        });


        /*정지 버튼*/
        controllContainer.find(".smVideoController .btnStopVideo").on("click", function(){
            stopVideo();
        });


        /*볼륨, 음소거 버튼*/
        controllContainer.find(".smVideoController .volumeToggle").on("click", function(){
            if($(this).hasClass("mute") == true){
                $(this).removeClass("mute");
                controllContainer.find(".smVideoController .volumeGauge").removeClass("mute");

                videoEl.muted = false;
            }else{
                $(this).addClass("mute");
                controllContainer.find(".smVideoController .volumeGauge").addClass("mute");

                videoEl.muted = true;
            }
        });


        /*재생속도*/
        controllContainer.find(".smVideoController .playSpeedArea .currentSpeed").on("click", function(){
            if($(".smVideoController .playSpeedArea").hasClass("on") == true){
                $(".smVideoController .playSpeedArea").removeClass("on");
            }else{
                $(".smVideoController .playSpeedArea").addClass("on");
            }
        });

        controllContainer.find(".smVideoController .playSpeedArea .speedSelector > li").on("click", function(){
            $(".smVideoController .playSpeedArea .speedSelector > li").removeClass("on");
            $(this).addClass("on");

            videoEl.playbackRate = $(this).attr("data-value");

            controllContainer.find(".smVideoController .playSpeedArea .currentSpeed").text($(this).text());
            $(".smVideoController .playSpeedArea").removeClass("on");
        });


        /*스크린모드*/
        controllContainer.find(".smVideoController .screenModeToggle").on("click", function(){
            if($(this).hasClass("full") == true){
                $(this).removeClass("full");
                videoEl.exitFullscreen();
            }else{
                $(this).addClass("full");
                videoEl.requestFullscreen();
            }
        });


        document.addEventListener("fullscreenchange", function () {
            if(document.fullscreen == false){
                controllContainer.find(".screenModeToggle").removeClass("full");
            }
        }, false);


        /**/
        controllContainer.on("mouseenter", function(){
            controllContainer.find(".smVideoController").show();
        });
        controllContainer.on("mouseleave", function(){
            controllContainer.find(".smVideoController").hide();
        });

        /*$(videoEl).on("mouseover", function(){
            controllContainer.find(".smVideoController").stop().fadeIn();
        });
        $(videoEl).on("mouseout", function(){
            controllContainer.find(".smVideoController").stop().fadeOut();
        });*/


        /*닫기버튼*/
        controllContainer.find(".smPlayerCloseBtn").on("click", function(){
            stopVideo();
            controllContainer.removeClass("started");
            $(this).hide();
        });
    }






    /*
    * ************************************************ 비디오 컨트롤 함수 ************************************************
    * */

    /*
    * *** 영상 재생
    * */
    function playVideo(){
        controllContainer.find(".smVideoController .playToggle").addClass("play");

        videoEl.play();
    }


    /*
    * *** 영상 일시정지
    * */
    function pauseVideo(){
        controllContainer.find(".smVideoController .playToggle").removeClass("play");

        videoEl.pause();
    }


    /*
    * *** 영상 정지
    * */
    function stopVideo(){
        videoEl.pause();
        videoEl.currentTime = 0;

        controllContainer.find(".smVideoController .playToggle").removeClass("play");
    }




    /*
    * ************************************************ 탐색바 설정 ************************************************
    * */

    var isSeekBarDown = false;

    function setSeekBar(){

        /*탐색바 마우스 업, 다운, 오버*/
        controllContainer.find(".smVideoController .track").on("mousedown", function(e){
            $("body").on("mousemove", mouseMoveSeekBar);

            var downX = (e.pageX - $(this).offset().left) / zoom;
            controllContainer.find(".smVideoController .track .seekBar").css("left", downX);
            controllContainer.find(".smVideoController .track .trace").css("width", downX);

            //클릭한 지점에 해당하는 비디오 시간 설정
            pauseVideo();
            videoEl.currentTime = videoEl.duration * (controllContainer.find(".smVideoController .track .trace").width() / controllContainer.find(".smVideoController .track").width())
            videoTimeUpdate();

            isSeekBarDown = true;
        });

        $("body").on("mouseup", function(){
            $("body").off("mousemove");

            if(isSeekBarDown == true){
                playVideo();
            }

            isSeekBarDown = false;
        });

        controllContainer.find(".smVideoController .track").on("mouseover", function(e){
            $(this).on("mousemove", overMove);
        });

        controllContainer.find(".smVideoController .track").on("mouseout", function(){
            $(this).off("mousemove");
        });



        /*마우스 다운 후 무브 시*/
        function mouseMoveSeekBar(e){
            var moveX = (e.pageX - controllContainer.find(".smVideoController .track").offset().left) / zoom;
            if(moveX >= 0 && moveX <= controllContainer.find(".smVideoController .track").width()){
                controllContainer.find(".smVideoController .track .seekBar").css("left", moveX);
                controllContainer.find(".smVideoController .track .trace").css("width", moveX);
            }

            //console.log(moveX)

            //현재 탐색바에 해당하는 비디오 시간 설정
            pauseVideo();
            videoEl.currentTime = videoEl.duration * (controllContainer.find(".smVideoController .track .trace").width() / controllContainer.find(".smVideoController .track").width())
            videoTimeUpdate();
        }

        /*마우스 오버 후 무브 시*/
        function overMove(e){
            var overX = (e.pageX - controllContainer.find(".smVideoController .track").offset().left) / zoom;
            controllContainer.find(".smVideoController .track .sceneView").css("left", overX);

            thumbVideoEl.currentTime = videoEl.duration * (overX / controllContainer.find(".smVideoController .track").width());
        }
    }



    /*
    * ************************************************ 볼륨게이지 설정 ************************************************
    * */
    function setVolumeGauge(){
        var isDonw = false;

        /*볼륨게이지 마우스 업, 다운, 오버*/
        controllContainer.find(".smVideoController .volumeGauge").on("mousedown", function(){
            isDonw = true;
        });

        $("body").on("mouseup", function(){
            isDonw = false;
        });

        controllContainer.find(".smVideoController .volumeGauge span").on("mouseover", function(){
            if(isDonw == true){
                var volumeCnt = $(this).index()+1;
                controllContainer.find(".smVideoController .volumeGauge span").removeClass("on");
                for(var i=1; i<=volumeCnt; i++){
                    controllContainer.find(".smVideoController .volumeGauge span").eq(i-1).addClass("on");
                }

                setVideoVolume(volumeCnt/10);
            }
        });

    }


    function setVideoVolume(_volume, _markVolumeGauge = false){
        videoEl.volume = _volume;

        if(_markVolumeGauge == true){
            controllContainer.find(".smVideoController .volumeGauge span").removeClass("on");
            for(var i=1; i<=_volume*10; i++){
                controllContainer.find(".smVideoController .volumeGauge span").eq(i-1).addClass("on");
            }
        }
    }



    /*
    * ************************************************ 탐색바 썸네일 ************************************************
    * */
    function setTimelineThumb(){
        var videoSrc = $(videoEl).find("source").attr("src") || $(videoEl).attr("src")
        controllContainer.find(".smVideoController .sceneView video").attr("src", videoSrc);
    }



    /*
    * ************************************************ 비디오 이벤트 ************************************************
    * */
    function setVideoEvent(){
        /*
        * *** 비디오 재생
        * */
        videoEl.addEventListener("play", function(){

        });


        /*
        * *** 비디오 ended
        * */
        videoEl.addEventListener("ended", function(){
            stopVideo();
        });


        /*
        * *** 비디오 timeupdate
        * */
        videoEl.addEventListener("timeupdate", videoTimeUpdate);
    }



    /*
    * ************************************************ 비디오 이벤트 핸들러 ************************************************
    * */

    /*
    * *** 영상 재생 시간 업데이트 시
    * */
    function videoTimeUpdate(e){
        //현재 시간
        controllContainer.find(".smVideoController .timeArea .currentTime").text(getFormedTime(videoEl.currentTime));

        //탐색바 상태
        var moveX = controllContainer.find(".smVideoController .track").width() * (videoEl.currentTime / videoEl.duration)
        controllContainer.find(".smVideoController .track .seekBar").css("left", moveX);
        controllContainer.find(".smVideoController .track .trace").css("width", moveX);
    }




    /*
    * ************************************************ 유틸함수 ************************************************
    * */

    /*
    * *** 시간을 분:초 형태로 반환
    * */
    function getFormedTime(_time){
        var time = Math.floor(_time);

        var min = Math.floor(time / 60);
        var sec = time % 60;

        min = (min >= 10) ? min : "0"+min;
        sec = (sec >= 10) ? sec : "0"+sec;

        return min+":"+sec;
    }



    /*
    * ************************************************ 퍼블릭 함수 ************************************************
    * */

    /*
    * *** 비디오 재생
    * */
    this.play = function(){
        playVideo();

        controllContainer.find(".smPlayerCloseBtn").show();
        controllContainer.addClass("started");
    }


    /*
    * *** 비디오 정지
    * */
    this.stop = function(){
        stopVideo();
    }


    /*
    * *** 비디오 일시정지
    * */
    this.pause = function(){
        pauseVideo();
    }


    /*
    * *** 비디오 재생 이벤트
    * */
    this.onStart = function(){
        if(typeof onVideoStart == "function"){
            onVideoStart();
        }
    }


    /*
    * *** 비디오 정지 이벤트
    * */
    this.onEnd = function(){
        if(typeof onVideoEnd == "function"){
            onVideoEnd();
        }
    }

}




























