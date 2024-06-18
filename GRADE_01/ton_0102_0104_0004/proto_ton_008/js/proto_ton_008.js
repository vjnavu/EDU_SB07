document.addEventListener("DOMContentLoaded", init);

function init() {
    const gate = document.querySelector("#gate") ?? document.createElement("div");
    const quizStartBtn = document.querySelector("#quizStartBtn") ?? document.createElement("div");
    const quizSliderBtns = document.querySelectorAll(".quizSlider-btn")  ?? document.createElement("div");
    const quizSliderPrevBtn = document.querySelector(".quizSlider-btn.btn-prev") ?? document.createElement("div");
    const quizSliderNextBtn = document.querySelector(".quizSlider-btn.btn-next") ?? document.createElement("div");
    const quizSlides = document.querySelectorAll("#quizSliderContainer > li") ?? document.createElement("div");
    const popups = document.querySelectorAll(".popup") ?? document.createElement("div");
    const popupCloseBtns = document.querySelectorAll(".btn-closePopup") ?? document.createElement("div");
    const backgroundDark = document.querySelector(".background-dark") ?? document.createElement("div");
    const currentChar = document.querySelector("#currentChar") ?? document.createElement("div");
    const Buttons = document.querySelectorAll("button") ?? document.createElement("div");
    const btnCheckAnswer = document.querySelector(".btn-checkAnswer") ?? document.createElement("div");
    const btnReplay = document.querySelector(".btn-replay") ?? document.createElement("div");
    const settingsBtn = document.querySelector('#settings') ?? document.createElement("div");
    const settingWrap = document.querySelector(".settingWrap") ?? document.createElement("div");
    const soundControls = document.querySelector("#soundControls") ?? document.createElement("div");
    const backSoundControl = soundControls.querySelector("#backSoundControl") ?? document.createElement("div");
    const effectSoundControl = soundControls.querySelector("#effectSoundControl") ?? document.createElement("div");
    const goGatePageBtn = document.querySelector("#goGatePageBtn") ?? document.createElement("div");

    const maxQuizIdx = quizSlides.length; // 슬라이드 갯수
    let quizCurrentIdx = 0; // 슬라이드 현재 idx
    let isPlayingBackSound = true; // 배경음 재생 여부
    let isPlayingEffectSound = true; // 효과음 재생 여부
    let animationTimeout;

    const backAudio = new Audio("./proto_ton_008/media/backSound.wav"); // 배경음

    const clickAudio = new Audio("./proto_ton_008/media/click.wav"); // 클릭음
    const correctAudio = new Audio("./proto_ton_008/media/correct.wav"); // 정답음

    showSlideQuiz(quizCurrentIdx);
    soundControlInitConfig();

    goGatePageBtn.addEventListener("click", goGatePageBtnHandler);

    backSoundControl.addEventListener("click",backSoundController);
    
    effectSoundControl.addEventListener("click", effectSoundControlHandler);

    settingsBtn.addEventListener("click", settingsBtnHandler);

    settingWrap.addEventListener("mouseleave", settingLeaveHandler);

    btnReplay.addEventListener("click", btnReplayHandler);

    btnCheckAnswer.addEventListener("click", btnCheckAnswerHandler);

    Buttons.forEach(btn => {
        btn.addEventListener("click",()=>{
            clickSound(isPlayingEffectSound);
        });
    });

    popupCloseBtns.forEach(btn => {
        btn.addEventListener("click", closePopup);
    });

    quizStartBtn.addEventListener("click",quizStartBtnHandler);

    quizSliderBtns.forEach(btn => {
        btn.addEventListener("click", quizSliderBtnsHandler);
    });

    /**
     * 세팅 마우스 아웃
     * @param {Event} e 
     * @returns 
     */
    function settingLeaveHandler(e) {
        if(!e.target.classList.contains("active")) return;

        settingWrap.classList.remove("active");
    }

    /**
     * 게이트로 이동
    */
    function toGate() {
        isPlayingBackSound = false;
        isPlayingEffectSound = true;
        backSound(isPlayingBackSound);
        clickSound(isPlayingEffectSound);
        closePopup();

        openGate();
        currentChar.className = "";
        btnCheckAnswer.classList.remove("hide");
        btnReplay.classList.add("hide");
        quizCurrentIdx = 0;
        showSlideQuiz(quizCurrentIdx);
    }

    /**
     * 정답 버튼
    */
    function btnCheckAnswerHandler() {
        correctSound(isPlayingEffectSound);
        btnReplay.classList.remove("hide");
        this.classList.add("hide");
    }

    /**
     * 다시하기 버튼
    */
    function btnReplayHandler() {        
        currentChar.className = "";
        btnCheckAnswer.classList.remove("hide");
        btnReplay.classList.add("hide");
        quizCurrentIdx = 0;
        showSlideQuiz(quizCurrentIdx);
        closePopup();
    }
    
    /**
     * 처음 화면으로
    */
    function goGatePageBtnHandler() {
        soundControlInitConfig();
        backSound(false);
        closeSetting();
        
        currentChar.className = "";
        btnCheckAnswer.classList.remove("hide");
        btnReplay.classList.add("hide");
        quizCurrentIdx = 0;
        showSlideQuiz(quizCurrentIdx);
        closePopup();

        openGate();
    }

    /**
     * 퀴즈 초기 시작 이벤트
     */
    function quizStartBtnHandler() {
        goGatePageBtn.classList.remove("hide");
        quizCurrentIdx = 0;
        showSlideQuiz(quizCurrentIdx);
        closeSetting();
        hideGate();
        backSound(isPlayingBackSound);
    }

    /**
     * 퀴즈 슬라이드 버튼 클릭 이벤트 (다음,이전)
     */
    function quizSliderBtnsHandler(){
        if(this.classList.contains("btn-prev")) { // 이전 버튼
            --quizCurrentIdx;
            showSlideQuiz(quizCurrentIdx);
            controlCurrentImage();
        }else if(this.classList.contains("btn-next")) { // 다음 버튼
            quizSliderNextBtn.classList.remove("emphasize");
            ++quizCurrentIdx;
            showSlideQuiz(quizCurrentIdx);
            controlCurrentImage();
            currentChar.classList.add("animation");
            if(animationTimeout) {
                clearTimeout(animationTimeout);
            }
            animationTimeout = setTimeout(() => {
                currentChar.classList.remove("animation");
            }, 2000);
        }
    }

    function controlCurrentImage() {
        currentChar.className = "";
        currentChar.classList.add(`pos-${quizCurrentIdx}`);
    }

    /**
     * 슬라이드
     * @param {number} idx 
     */
    function showSlideQuiz(idx) {
        
        // 이전, 다음 버튼 토글
        if(idx == 0) {
            quizSliderPrevBtn.classList.add("disable");
        }else {
            quizSliderPrevBtn.classList.remove("disable");
        }
        if(idx == maxQuizIdx -1) {
            quizSliderNextBtn.classList.add("disable");
        }else {
            quizSliderNextBtn.classList.remove("disable");
        }

        quizSlides.forEach((item, num) => { // 슬라이드 토글
            if(idx == num) {
                item.classList.add("show");
            }else {
                item.classList.remove("show");
            }
        });

    }

    /**
     * 게이트 숨기기
     */
    function hideGate() {
        gate.classList.add("hide");
    }

    /**
     * 게이트 오픈
     */
    function openGate() {
        gate.classList.remove("hide");
    }
    
    /**
     * 팝업 닫기
     */
    function closePopup() {
        backgroundDark.classList.add("hide");
        popups.forEach(popup => {
            popup.style = "";
        });
    }

    /**
     * 세팅 버튼
    */
   function settingsBtnHandler() {
        if(settingWrap.classList.contains("active")) {
            settingWrap.classList.remove("active");
        }else {
            settingWrap.classList.add("active");
        }
    }

    /**
     * 세팅 닫기
    */
    function closeSetting() {
        settingWrap.classList.remove("active");
    }

    /**
     * 사운드 컨트롤 설정
    */
    function soundControlInitConfig() {
        if(isPlayingBackSound) {
            backSoundControl.classList.add("active");
        }else {
            backSoundControl.classList.remove("active");
        }
        if(isPlayingEffectSound) {
            effectSoundControl.classList.add("active");
        }else {
            effectSoundControl.classList.remove("active");
        }

        goGatePageBtn.classList.add("hide");
    }

     /**
     * 배경음 컨트롤
    */
     function backSoundController() {
        if(this.classList.contains("active")) {
            this.classList.remove("active");
            isPlayingBackSound = false;
        }else {
            this.classList.add("active");
            isPlayingBackSound = true;
        }
        if(gate.classList.contains("hide")) {
            backSound(isPlayingBackSound);
        }else {
            backSound(false);
        }
    }

    /**
     * 효과음 컨트롤
    */
    function effectSoundControlHandler() {
        if(this.classList.contains("active")) {
            this.classList.remove("active");
            isPlayingEffectSound = false;
        }else {
            this.classList.add("active");
            isPlayingEffectSound = true;
        }
    }

    /**
     * 모든 버튼 클릭음
     * @param {boolean} play 
     */
    function clickSound(play) {
        if(play) {
            clickAudio.loop = false;
            clickAudio.play();
        }else {
            clickAudio.pause();
        }
    }
    
    /**
     * 정답 사운드
     * @param {boolean} play 
    */
   function correctSound(play) {
       if(play) {
            correctAudio.loop = false;
            correctAudio.play();
        }else {
            correctAudio.pause();
        }
    }

    /**
     * 배경음
     * @param {boolean} play 
     */
    function backSound(play) {
        if(play) {
            backAudio.loop = true;
            backAudio.currentTime = 0;
            backAudio.play();
        }else {
            backAudio.pause();
        }
    }
}