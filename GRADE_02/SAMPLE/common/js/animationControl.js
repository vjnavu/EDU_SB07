setTimeout(function(){
    if(QS('#frameContainer').getAttribute('data-ani') == 'full') {
        var contents = document.querySelector('#frameContainer');
        animationIntro(contents);
    }else if(QSAll('.pageContainer > li .inContentsLink').length > 0){
        var contentsLink = document.querySelector('.inContentsLink');
        linkIntro(contentsLink)
    }else if(QSAll('.pageContainer > li .inContentsAni').length > 0){
        var contentsAni = document.querySelector('.inContentsAni');
        animationIntro(contentsAni);
	}
}, 100)


// ******************************************************************************
// Link영상 인트로

function linkIntro(target) {
    console.log(target)
    var aniContainer = createElement('div', target, 'aniContainer'),
        ani_popup = createElement('div', aniContainer, 'ani_popup'),
        ani_popup_sub = createElement('div', ani_popup, 'ani_popup_sub'),
        ani_popup_subTitle = createElement('div', ani_popup_sub, 'ani_popup_subTitle'),

        ani_mainBox = createElement('div',aniContainer,'ani_mainBox'),
        ani_playBtn = createElement('img',ani_mainBox,'ani_playBtn');
    	ani_playBtn.src = './common/images/animation/playAniBtn.png';

    if(ani_txtArray.length > 0){
        for(var i = 0; i < ani_txtArray.length; i++){
            ani_popup_subTitle.innerHTML += '<p>'+ ani_txtArray[i] +'</p>';
        }
        if(ani_txtArray.length == 1){
            ani_popup.classList.add('one');
        }
    }

    ani_popup_subTitle.classList.add('flowAni');

    ani_playBtn.addEventListener(gameManager.eventSelector.upEvent, startLinkFn);

    btn_mouseover();
}
function startLinkFn(){
    window.open(isMovieInfo.link, '_blank',"width=850,height=580");
}

// ******************************************************************************
// 애니메이션 full 단원 인트로

function animationIntro(target) {
		console.log(target)
    var aniContainer = createElement('div', target, 'aniContainer'),
		ani_popup = createElement('div', aniContainer, 'ani_popup'),
		ani_popup_sub = createElement('div', ani_popup, 'ani_popup_sub'),
		ani_popup_subTitle = createElement('div', ani_popup_sub, 'ani_popup_subTitle'),

		ani_mainBox = createElement('div',aniContainer,'ani_mainBox'),
		ani_playBtn = createElement('img',ani_mainBox,'ani_playBtn');
        ani_playBtn.src = './common/images/animation/playAniBtn.png';

        if(QS('#frameContainer').getAttribute('data-ani') == 'full') {

        // 상위 발문 추가
		var ani_TopContainer = createElement('div', aniContainer, 'ani_TopContainer'),
            ani_Top_icon = createElement('div', ani_TopContainer, 'ani_Top_icon'),
            ani_Top_sub = createElement('div', ani_TopContainer, 'ani_Top_sub');
            ani_Top_sub.innerHTML = '<p>'+ ani_txtArray[0] +'</p>';

			if(ani_IconText[0] == 'kor'){
                ani_Top_icon.classList.add('korean');
                var ani_Top_left = createElement('div', ani_Top_icon, 'left'),
                	ani_Top_left2 = createElement('div', ani_Top_icon, 'left2'),
                    ani_Top_middle = createElement('div', ani_Top_icon, 'middle'),
                    ani_Top_middle2 = createElement('div', ani_Top_icon, 'middle2'),
                    ani_Top_right = createElement('div', ani_Top_icon, 'right');

                if(ani_IconText.length == 3){
                    ani_Top_left2.innerHTML = '<span>'+ ani_IconText[1] +'</span>';
                    ani_Top_middle2.innerHTML = '<span>'+ ani_IconText[2] +'</span>';
                }else if(ani_IconText.length == 0 ||ani_IconText.length == 1){
                    ani_TopContainer.removeChild(ani_Top_icon);
                }else{
                    ani_Top_icon.classList.remove('korean');
                }
			}else{
				var ani_Top_left = createElement('div', ani_Top_icon, 'left'),
                    ani_Top_middle = createElement('div', ani_Top_icon, 'middle'),
                    ani_Top_right = createElement('div', ani_Top_icon, 'right');

                if(ani_IconText.length == 1){
                    ani_Top_middle.innerHTML = '<span>'+ ani_IconText[0] +'</span>';
                }else if(ani_IconText.length == 0){
                    ani_TopContainer.removeChild(ani_Top_icon);
                }else{
                    ani_Top_middle.innerHTML = '<span>'+ ani_IconText[0] +'</span><span>'+ ani_IconText[1] +'</span>';
                }
			}


            if(ani_txtArray.length < 2) {
                document.querySelector('.ani_TopContainer').style.display = 'none';
            }
            if(ani_txtArray.length < 2) {
                ani_popup_subTitle.innerHTML = ani_txtArray[0];
            } else {
                ani_popup_subTitle.innerHTML = ani_txtArray[1];
            }

        }else{

            if(ani_txtArray.length > 0){
                for(var i = 0; i < ani_txtArray.length; i++){
                    ani_popup_subTitle.innerHTML += '<p>'+ ani_txtArray[i] +'</p>';
                }
                if(ani_txtArray.length == 1){
                    ani_popup.classList.add('one');
                }
            }
		}

		ani_popup_subTitle.classList.add('flowAni');

		ani_playBtn.addEventListener(gameManager.eventSelector.upEvent, startAniFn);

	btn_mouseover();
}

function startAniFn() {

    efSound('./media/tab_click.mp3');
    if(QSAll('.inContentsAni').length > 0) {
        QS('#frameContainer').appendChild(QS('.animationContainer'));
        QS('#frameContainer').appendChild(QS('.animationControlsBox'));
        QS('.contentsBox').classList.add('displayN');

        if(QSAll('.wordAniContainer').length > 0){
        	QS('#contents').className = QS('#contents').className.replace('wordAniContainer','wordNone');
		}
		if(QSAll('.contentsTitle').length > 0){
            QS('.contentsTitle').classList.add('displayN');
		}
    }
    if(QSAll('.popBtn').length != 0){
        for(var i = 0; i < QSAll('.popBtn').length; i++){
            QSAll('.popBtn')[i].style.display = 'none';
        }
    }
    setTimeout(function () {
        if (window.location.href.indexOf('http')  > -1) {
            var parentDocument = parent.document.querySelector('iframe');
            parentDocument.parentNode.style.position = 'relative';
            parentDocument.parentNode.style.zIndex = 1000;
        }
    },100)

    document.querySelector('.ani_playBtn').style.pointerEvents = 'none';
    document.querySelector('.aniContainer').classList.add('opa_out');
    setTimeout(function () {

        document.querySelector('.animationControlsBox').style.display = 'block';
        document.querySelector('#mediafile2').play();
        document.querySelector('#play2').style.display = 'none';
        document.querySelector('#pause2').style.display = 'block';

        stateCont = true;

    }, 400);


}

// ******************************************************************************
// media control

function mediaElement(type, filesrc) {
	var frameContainer = document.querySelector("#frameContainer"),
		contents = document.querySelector("#contents"),
		contentsAni = document.querySelector(".inContentsAni");


    if(QS('#frameContainer').getAttribute('data-ani') == 'full') {
        createElement('div',contents,'animationContainer');
        createElement('div',contents,'animationControlsBox');
	}
    else {
        createElement('div',contentsAni,'animationContainer');
        createElement('div',contentsAni,'animationControlsBox');
    }

	var animationContainer = document.querySelector(".animationContainer");

	animationContainer.innerHTML += '<video id="mediafile2" preload="auto"><source src="'+ filesrc +'.mp4" type="video/mp4"></video>';
	var animationControlsBox = document.querySelector('.animationControlsBox');
	createElement('div',animationControlsBox,'animationControls');

	var animationControls = document.querySelector('.animationControls');


	// Progress Bar
	var progress = createElement('div',animationControls);
	progress.setAttribute('id','progress2');

	var progressBar = createElement('div',progress);
	progressBar.setAttribute('id','progressBar2');

	var timeBar = createElement('div',progressBar);
	timeBar.setAttribute('id','timeBar2');

	var thumb = createElement('div',timeBar,'');
	thumb.setAttribute('id','thumb2');

	// 재생시간
	var playTime = createElement('div',progress);
	playTime.setAttribute('id','playTime2');


	// 버튼
	var btnContainer = createElement('div',animationControls);
	btnContainer.setAttribute('id','btnContainer2');

	var play = createElement('div',btnContainer,'vbtn controllerBtn');
	play.setAttribute('id','play2');

	var pause = createElement('div',btnContainer,'vbtn controllerBtn');
	pause.setAttribute('id','pause2');

	var stop = createElement('div',btnContainer,'vbtn controllerBtn');
	stop.setAttribute('id','stop2');

	var muteOff = createElement('div',btnContainer,'vbtn soundBtn');
	muteOff.setAttribute('id','muteOff2');

	var muteOn = createElement('div',btnContainer,'vbtn soundBtn');
	muteOn.setAttribute('id','muteOn2');

	var closeOn = createElement('div',btnContainer,'vbtn soundBtn');
	closeOn.setAttribute('id','closeOn');
}
// ***********************************************************************
var playFlag = false;
var stateCont = false;
var timeCont = false;

function unitaniControl(type, filesrc) {

	mediaElement(type, filesrc);

	//*********************************************
	var mediafile = document.querySelector('#mediafile2'),
		playBtn = document.querySelector('#play2'),
		stopBtn = document.querySelector('#stop2'),
		pauseBtn = document.querySelector('#pause2'),
		timeBar =  document.querySelector('#timeBar2'),
		progressBar =  document.querySelector('#progressBar2'),
		thumb =  document.querySelector('#thumb2'),
		muteOff =  document.querySelector('#muteOff2'),
		muteOn =  document.querySelector('#muteOn2'),
		closeOn =  document.querySelector('#closeOn'),
		currentTime = document.querySelector('#currentTime2'),
		durationTime = document.querySelector('#durationTime2'),
		playVolume = document.querySelector('#playVolume2'),
		playTime = document.querySelector('#playTime2');
		// timeCont = false;
		// stateCont = false;
	// console.log('@ vdo on...');
	// volumeSlider();
	// 재생가능 여부 파악
	mediafile.oncanplay = function(){
		console.log('@ vdo canPlay...');
	};

	// 재생
	playBtn.addEventListener('mousedown', function() {
        efSound('./media/tab_click.mp3');
		mediafile.play();
		// mediafile.muted = true;
		this.style.display = 'none';
		pauseBtn.style.display = 'block';
		stateCont = true;
	}, false);

	// 일시정지
	pauseBtn.addEventListener('mousedown', function() {
        efSound('./media/tab_click.mp3');
		mediafile.pause();
		this.style.display = 'none';
		playBtn.style.display = 'block';
		stateCont = false;
	}, false);

	// 정지
	stopBtn.addEventListener('mousedown', function() {
        efSound('./media/tab_click.mp3');
		mediafile.pause();
		mediafile.currentTime = 0;
		pauseBtn.style.display = 'none';
		playBtn.style.display = 'block';
		stateCont = false;
	}, false);

	// 사운드 온
	muteOn.addEventListener(gameManager.eventSelector.downEvent, function() {
		efSound('./media/tab_click.mp3');
		mediafile.muted = true;
		this.style.display = 'none';
		muteOff.style.display = 'block';
	}, false);

	// 사운드 오프
	muteOff.addEventListener(gameManager.eventSelector.downEvent, function() {
		efSound('./media/tab_click.mp3');
		mediafile.muted = false;
		this.style.display = 'none';
		muteOn.style.display = 'block';
	}, false);

	// 팝업 닫기

	closeOn.addEventListener(gameManager.eventSelector.upEvent, function() {
        efSound('./media/tab_click.mp3');
		mediafile.pause();
		mediafile.currentTime = 0;
		mediafile.muted = false;
		pauseBtn.style.display = 'none';
		playBtn.style.display = 'block';
		stateCont = false;

		if(QSAll('.popBtn').length != 0){
			for(var i = 0; i < QSAll('.popBtn').length; i++){
				QSAll('.popBtn')[i].style.display = 'block';
			}
		}
		if(QSAll('.inContentsAni').length > 0){
            QS('.inContentsAni').appendChild(QS('.animationContainer'));
            QS('.inContentsAni').appendChild(QS('.animationControlsBox'));
            QS('.contentsBox').classList.remove('displayN');

            if(QSAll('.wordNone').length > 0){
                QS('#contents').className = QS('#contents').className.replace('wordNone','wordAniContainer');
            }
            if(QSAll('.contentsTitle').length > 0){
                QS('.contentsTitle').classList.remove('displayN');
            }
		}
		document.querySelector('.aniContainer').classList.remove('opa_out');
		document.querySelector('.animationControlsBox').style.display = 'none';

		document.querySelector('#muteOff2').style.display = 'none';
		document.querySelector('#muteOn2').style.display = 'block';

		document.querySelector('.ani_playBtn').style.pointerEvents = 'auto';

		if (window.location.href.indexOf('http')  > -1) {
			var parentDocument = parent.document.querySelector('iframe');
			parentDocument.parentNode.style.position = 'static';
			parentDocument.parentNode.style.zIndex = 1;
		}


	}, false);

	// ********************************************************
	//비디오 설정
	mediafile.addEventListener('loadedmetadata', function() {
		playTime.innerHTML = timeFormat(this.currentTime) + ' / ' + timeFormat(this.duration);
	}, false);


	var txtli = document.querySelector('.txtli');

	mediafile.addEventListener('timeupdate', function() {
		var percentageDuration = 100 * (this.currentTime / this.duration);
		timeBar.style.width = percentageDuration + '%';

		thumbMove();
		playTime.innerHTML = timeFormat(this.currentTime) + ' / ' + timeFormat(this.duration);

		if(this.currentTime == this.duration) {
			stateCont = false;
			mediafile.currentTime = 0;
			pauseBtn.style.display = 'none';
			playBtn.style.display = 'block';
			mediafile.pause();
		}

	}, false);


	mediafile.addEventListener('ended',function(){
		mediafile.pause();
		pauseBtn.style.display = 'none';
		playBtn.style.display = 'block';
	}, false);


	// *************************************************************
	// 재생바 클릭, 마우스 이동, 마우스 아웃
	var vdoWasPaused;

	progressBar.addEventListener(gameManager.eventSelector.downEvent, function(e) {

		mediafile.pause();
		var progressMove = mouseX(e);
		timeBar.style.width = progressMove +'%';
		thumbMove();
		timeCont = true;
	}, false);

	progressBar.addEventListener(gameManager.eventSelector.moveEvent, function(e) {
		if(timeCont) {
			mediafile.pause();
			var progressMove = mouseX(e);
			timeBar.style.width = progressMove+'%';
			thumbMove();
		}
	}, false);

	progressBar.addEventListener(gameManager.eventSelector.upEvent, function(e) {
		if(timeCont) {
			if(stateCont == true) {
				mediafile.play();
			} else {
				mediafile.pause();
			}

			timeCont = false;
			var progressMove = mouseX(e);
			timeBar.style.width = progressMove + '%';
			var currentTime = (progressMove * mediafile.duration) / 100;
			mediafile.currentTime = currentTime;
			thumbMove();
		}
	}, false);

	progressBar.addEventListener(gameManager.eventSelector.outEvent, function(e) {
		if(timeCont) {
			timeCont = false;
			mediafile.pause();
			var progressMove = mouseX(e);
			timeBar.style.width = progressMove+'%';
			var currentTime = (progressMove * mediafile.duration) / 100;
			mediafile.currentTime = currentTime;
			thumbMove();
		}
	}, false);

}

// ***********************************************************************
// 위치값을 찾아서 퍼센트(%) 반환
function mouseX (e) {
	e = e || window.event;

	var progressStyle = window.getComputedStyle(progressBar2, null),
		progressWidth = parseInt(progressStyle.width);

	ss = progressWidth * gameManager.zoomRate;
	rect = progressBar2.getBoundingClientRect();

	var position = e.pageX - rect.left;
	var percentage = 100 * (position / ss);

	if(percentage > 100) {
		percentage = 100;
	} else if(percentage < 0) {
		percentage = 0;
	}

	return percentage;
}


// thumb 버튼 이동
function thumbMove() {
	var progressStyle = window.getComputedStyle(progressBar2,null),
		progressWidth = parseInt(progressStyle.width),
		timeBarStyle = window.getComputedStyle(timeBar2,null),
		timeBarWidth = parseInt(timeBarStyle.width),
		thumbStyle = window.getComputedStyle(thumb2,null),
		thumbWidth = parseInt(thumbStyle.width);

	var calc = progressWidth * gameManager.zoomRate - timeBarWidth * gameManager.zoomRate;

	if(timeBarWidth > thumbWidth * 0.5) {
		thumb2.style.left = timeBarWidth- thumbWidth * 0.5 +'px';
	}
	else if(mediafile2.currentTime === 0) {
		thumb2.style.left = 0;
	}
}


// 현재시간/재생시간 업데이트
function timeFormat(seconds) {
	var m = Math.floor(seconds/60)<10 ? "0"+Math.floor(seconds/60) : Math.floor(seconds/60);
	var s = Math.floor(seconds-(m*60))<10 ? "0"+Math.floor(seconds-(m*60)) : Math.floor(seconds-(m*60));

	return m + ":" + s;
}



// ***********************************************************************
// 마우스 오버
function btn_mouseover() {
	var ani_playBtn = document.querySelector('.ani_playBtn');

	ani_playBtn.addEventListener('mouseover', function(e) {
		e.target.src = './common/images/animation/playAniBtn_over.png';
	});

	ani_playBtn.addEventListener('mouseout', function(e) {
		e.target.src = './common/images/animation/playAniBtn.png';
	});
}
