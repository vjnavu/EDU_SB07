
//audioPlayAble =  읽어보기 클릭시, 재생 불가능하게 하기 위한 변수
//tabFlag = 한페이지에 여러개 들어가거나, 탭에 나눠져서 들어 갈 경우를 판별하는 변수
var audioPlayAble = true;
var tabFlag = false;
var autoScrollIdx = new Array();
var idxd;
var aniId;
// 스크롤 속도
var audioSpeed = [];

// 한 HTML 문서안에 두개이상의 사운트 컨트롤러가 들어 갈 경우 사용
//audioSrc =  오디오 파일 경로
//hideObj 버튼 클릭시 사라질 영역
function createAudioTabPage(audioSrc){
	//여러개 생성을 알려주는 분기 처리
	tabFlag = true;
	var audioArea = QSAll('.audioArea'),
		hideObj = QSAll('.hide');

	for(var i = 0; i < audioArea.length ; i++){

		//오디오 엘리먼트 생성
		var audioController = createElement('div', audioArea[i], 'audioController audioObj_'+i),
			btnContainer = createElement('div', audioController, 'btnContainer btnContainer_'+i),
			buttonControll = createElement('div', audioController, 'buttonControll buttonControll_'+i),
			audioPause = createElement('div', buttonControll, 'audioPause audioPauseyBtn_'+i),
			audioStop = createElement('div', buttonControll, 'audioStop audioStopBtn_'+i);

		audioController.style.visibility ="visible";
		// audioSet.innerHTML = '<audio class="audioFile"><source src="media/'+audioSrc[i]+'" type="audio/mpeg"></audio>';
		//오디오 엘리먼트들 선택
		var audioFile = document.querySelectorAll('.audioFile');

		for(var j = 0 ; j < 3 ; j++){
			//버튼 생성
			var audioView = createElement('div',btnContainer,'audioPlay audioView_'+j);

			switch (j) {

				case 0:

					audioView.innerHTML = "함께 보기";

				break;

				case 1:
					audioView.innerHTML = "들어 보기";

				break;

				case 2:
					audioView.innerHTML = "읽어 보기";

				break;

			}
		  }
		  audioArea[i].innerHTML += '<audio class="audioFile aoudio_'+i+'"><source src="media/'+audioSrc[i]+'" type="audio/mpeg"></audio>';
		  var audioFile = document.querySelectorAll('.audioFile');

		  for(var j = 0 ; j < 3 ; j++){
			  //버튼 생성
			  var audioVieww = document.querySelectorAll('.audioView_'+j)[i];

			  switch (j) {

				  case 0:
					  audioVieww.addEventListener(GameManager.event.eventSelector('eventDown'),function(){
					  	efSound('./media/tab_click.mp3');
						  // idx = btnContainer_i 값을 인덱스 값으로 사용
						  var idx = parseInt(this.parentNode.classList[1].split('_')[1]);

							  //버튼 클릭시 이벤트 발생, 정지 및 hideObj를 보이게 처리
							  audioPlayAble = true;
							  audioFile[idx].pause();
							  audioFile[idx].currentTime = 0;
							  if(hideObj !== undefined){
								  hideObj[idx].style.visibility = 'visible';
							  }
							  QS('.isAudio.scroll-wrapper').style.visibility = 'visible';


					  },false);
				  break;

				  case 1:
					  audioVieww.addEventListener(GameManager.event.eventSelector('eventDown'),function(){
					  	efSound('./media/tab_click.mp3');
						  var idx = parseInt(this.parentNode.classList[1].split('_')[1]);

							//버튼 클릭시 이벤트 발생, 정지 및 hideObj를 안보이게 처리
							audioPlayAble = true;
							audioFile[idx].pause();
							audioFile[idx].currentTime = 0;
							if(hideObj !== undefined){
							  hideObj[idx].style.visibility = 'hidden';
							}
							QS('.isAudio.scroll-wrapper').style.visibility = 'hidden';


					  },false);
				  break;

				  case 2:
					  audioVieww.addEventListener(GameManager.event.eventSelector('eventDown'),function(){
					  	efSound('./media/tab_click.mp3');
						  var idx = parseInt(this.parentNode.classList[1].split('_')[1]);

								//재생 금지여부를 조정
								audioPlayAble = false;
								//버튼 클릭시 이벤트 발생, 재생 금지, 정지 및 hideObj를 보이게 처리
								audioFile[idx].pause();
								audioFile[idx].currentTime = 0;
								if(hideObj !== undefined){
								  hideObj[idx].style.visibility = 'visible';
								QS('.isAudio.scroll-wrapper').style.visibility = 'visible';
								}

				  		},false);
				 break;

			}
		}
	}

	//그외 오디오 컨트롤 관련 기능
	audioControll(audioSrc, audioArea);
	// // //탭 버튼 클릭시 오디오 재생 정지 기능
	// audioFn(audioArea, audioSrc, hideObj);
}

//여러개의 오디오 엘리먼트에 재생,일시정지,정지 기능 구현
function audioControll(audioSrc, target){
	//모든 오디오 엘리먼트 지정
	var audioArea = QSAll('.audioArea'),
		audioController = QSAll('.audioController'),
		audioSet = QSAll('.audioFile'),
		audioPause = QSAll('.audioPause'),
		audioStop = QSAll('.audioStop'),
		innerContent = QSAll('.isAudio.scroll-wrapper');
	for(var k = 0; k < target.length ; k++){
		var audioPlay = target[k].querySelectorAll('.audioPlay');
			idx = parseInt(target[k].querySelector('.btnContainer').classList[1].split('_')[1]);

		//재생과 관련된 기능
		for(var q = 0; q < audioPlay.length; q++){
			audioPlay[q].addEventListener(GameManager.event.eventSelector('eventDown'),function(){
				playAudio(audioSet, idx, this);
			},false);

			audioPlay[q].addEventListener(GameManager.event.eventSelector('eventDown'), autoScroll, false);
		}
		//일시정지 기능
		audioPause[k].addEventListener(GameManager.event.eventSelector('eventDown'),function(){

			for(var l = 0; l <audioSet.length;l++){
				audioSet[l].pause();
			}
			clearInterval(aniId);
		},false);

		//정지 기능
		audioStop[k].addEventListener(GameManager.event.eventSelector('eventDown'),function(){
			resetAudio();
		},false);

		audioSet[k].addEventListener('timeupdate', timeCheckFn, false);

	}
}
// play
function playAudio(audioSet, idx, target){

	//재생중인 모든 오디오 정지
	for(var l = 0; l <audioSet.length;l++){
		resetAudio();
	}

	// 재생 여부에따라 오디오 재생
	if(audioPlayAble === true){
		audioSet[idx].play();
	}
}
// reset
function resetAudio(){
	var audioArea = QSAll('.audioArea');

	for(var l = 0; l <audioArea.length;l++){
		if(audioArea[l].querySelector('.audioFile')){
			audioArea[l].querySelector('.audioFile').pause();
			audioArea[l].querySelector('.audioFile').currentTime = 0;
		}


		if (audioArea[l].getAttribute('data-scroll') == 'poetry') {
			clearInterval(aniId);
			var scrollOutWrap = QSAll('.isAudio.scroll-wrapper');
			for(n = 0; n < scrollOutWrap.length; n++){
				scrollOutWrap[n].querySelector('.poetArea').style.top = scrollOutWrap[n].clientTop + 'px';
				scrollOutWrap[n].querySelector('.scroll-element.scroll-y .scroll-bar').style.top = '0px';
			}
		}
	}
}
// timeCheck
function timeCheckFn(){
	if(this.duration == this.currentTime){ resetAudio(); }
}
function autoScroll (speed) {
	var	audioArea = QSAll('.audioArea'),
		audioSet = QSAll('.audioFile'),
		innerContent = QSAll('.isAudio.scroll-wrapper'),
		idx = parseInt(this.parentNode.classList[1].split('_')[1]);

	if (audioArea[idx].getAttribute('data-scroll') == 'poetry') { console.log( 'START AUTOSCROLL(POETRY)' );
		var duration = audioSet[idx].duration * audioSpeed,
			innerContentHeight = innerContent[idx].offsetHeight,
			childHeight = innerContent[idx].querySelector('.poetArea').offsetHeight,
			currentHeight = childHeight - innerContentHeight,
			moveHeight = currentHeight / duration * 30;
		var scrollbarHeight = innerContent[idx].querySelector('.scroll-element.scroll-y .scroll-element_track').offsetHeight,
			scrollbarHandleHeight = innerContent[idx].querySelector('.scroll-element.scroll-y .scroll-bar').offsetHeight,
			currentScrollHeight = scrollbarHeight - scrollbarHandleHeight,
			moveScrollHeight = currentScrollHeight / duration * 30;
		var ratio = setPosition(idx);


		animate({
			height : -(currentHeight * ratio),
			scrollHeight : currentScrollHeight * ratio,
			delay : 20,
			duration : duration + 100,
			delta : makeEaseOut(linear),
			step : function(delta) {
				if (this.height > -currentHeight) this.height = this.height - moveHeight;
				else this.height = -currentHeight;

				if (this.scrollHeight < currentScrollHeight) this.scrollHeight = this.scrollHeight + moveScrollHeight;
				else this.scrollHeight = currentScrollHeight;

				innerContent[idx].querySelector('.poetArea').style.top = this.height + 'px';
				innerContent[idx].querySelector('.scroll-element.scroll-y .scroll-bar').style.top = this.scrollHeight + 'px';

			}
		});
	} else if (audioArea[idx].getAttribute('data-scroll') == 'on') { console.log( 'START AUTOSCROLL' );
	} else { console.log( 'NO AUTOSCROLL' ); }

	var tab = QSAll('.tabContainer > li');
	for (var i = 0; i < tab.length; i++) {
		tab[i].addEventListener(GameManager.event.eventSelector('eventDown'), function(){
			resetAudio();
		})
	}
}

function setPosition (idx) {
	var audioSet = QSAll('.audioFile'),
		innerContent = QSAll('.isAudio'),
		scrollbarHeight = innerContent[idx].querySelector('.scroll-element.scroll-y .scroll-element_track').offsetHeight,
		scrollbarHandleHeight =innerContent[idx].querySelector('.scroll-element.scroll-y .scroll-bar').offsetHeight,
		currentScrollHeight = scrollbarHeight - scrollbarHandleHeight,
		moveScrollHeight = currentScrollHeight / audioSet[idx].duration * 20,
		ratio = 0;

	if (audioSet[idx].currentTime > 0) {
		ratio = (audioSet[idx].currentTime / audioSet[idx].duration);
	}
	return ratio;
}

//오다오가 있는 팝업창 생성시, 기존 오디오 영역 제거.
function removeAudio(){
	var audioObjx = document.querySelectorAll('.audioController');

	for(var x = 0; x < audioObjx.length; x++){

		audioObjx[x].remove();
	}
	audioPlayAble = true;
}

//오디오 영역 재생성
function setAudio(target,audioSrc,hideObj){

	audioPlayAble = true;

	if(tabFlag === true){

		createAudioTabPage(target,audioSrc,hideObj);

	}else if(tabFlag === false){

		createAudioCtrl(target,audioSrc,hideObj);
	}

}

//팝업 및 컨텐츠 초기화
if(QSAll('.popbox').length > 0){
	var popbox = document.querySelectorAll('.popbox');
	for(var i = 0; i < popbox.length; i++){
		if(popbox[i].querySelector('.audioArea') !== undefined){
			contentReset();
		}
	}
}

function contentReset(target){
	if(QSAll('.audioArea').length > 0){
		var audioArea = QSAll('.audioArea');
		for(var l = 0; l <audioArea.length;l++){
			if(audioArea[l].querySelector('.audioFile')){
				audioArea[l].querySelector('.audioFile').pause();
				audioArea[l].querySelector('.audioFile').currentTime = 0;
			}

			if (audioArea[l].getAttribute('data-scroll') == 'poetry') {
				clearInterval(aniId);
				var scrollOutWrap = QSAll('.isAudio.scroll-wrapper');
				for(n = 0; n < scrollOutWrap.length; n++){
					scrollOutWrap[n].querySelector('.poetArea').style.top = scrollOutWrap[n].clientTop + 'px';
					scrollOutWrap[n].querySelector('.scroll-element.scroll-y .scroll-bar').style.top = '0px';
				}
			}
		}
	}
 }
