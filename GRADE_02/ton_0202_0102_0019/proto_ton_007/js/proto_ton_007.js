document.addEventListener("DOMContentLoaded", init);

function init() {
    const gate = document.querySelector("#gate") ?? document.createElement("div");
    const quizStartBtn = document.querySelector("#quizStartBtn") ?? document.createElement("div");
    const quizSliderBtns = document.querySelectorAll(".quizSlider-btn")  ?? document.createElement("div");
    const quizSliderPrevBtn = document.querySelector(".quizSlider-btn.btn-prev") ?? document.createElement("div");
    const quizSliderNextBtn = document.querySelector(".quizSlider-btn.btn-next") ?? document.createElement("div");
    const quizSlides = document.querySelectorAll("#quizSliderContainer > li") ?? document.createElement("div");
    const Buttons = document.querySelectorAll("button, a") ?? document.createElement("div");
    const btnCheckAnswer = document.querySelector(".btn-checkAnswer") ?? document.createElement("div");
    const btnReplay = document.querySelector(".btn-replay") ?? document.createElement("div");
    const quizHeaderNum = document.querySelector("#quizHeaderNum") ?? document.createElement("div");
    const quizHeaderCurrentIdx = quizHeaderNum.querySelector(".quizHeader-current-idx") ?? document.createElement("div");
    const quizHeaderTotalIdx = quizHeaderNum.querySelector(".quizHeader-total-idx") ?? document.createElement("div");
    const eraserDropDown = document.querySelector("#eraserDropDown") ?? document.createElement("div");
    const dropdownContent = eraserDropDown.querySelector(".dropdown-content") ?? document.createElement("div");
    const EraseSizebtns = dropdownContent.querySelectorAll("button[data-size]") ?? document.createElement("div");
    const paintArea = document.querySelectorAll('.paintArea') ?? document.createElement("div");
    const answerImg = document.querySelectorAll('.answerImg') ?? document.createElement("div");
    const settingsBtn = document.querySelector('#settings') ?? document.createElement("div");
    const settingWrap = document.querySelector(".settingWrap") ?? document.createElement("div");
    const soundControls = document.querySelector("#soundControls") ?? document.createElement("div");
    const backSoundControl = soundControls.querySelector("#backSoundControl") ?? document.createElement("div");
    const effectSoundControl = soundControls.querySelector("#effectSoundControl") ?? document.createElement("div");
    const goGatePageBtn = document.querySelector("#goGatePageBtn") ?? document.createElement("div");
    const maxQuizIdx = quizSlides.length; // 슬라이드 갯수
    let quizCurrentIdx = 0; // 슬라이드 현재 idx
    let contexts = []; // 캔버스 컨텍스트 모음
    let isDrawing = false; // 그리기 상태
    let eraseSize = 0;
    let isPlayingBackSound = true; // 배경음 재생 여부
    let isPlayingEffectSound = true; // 효과음 재생 여부

    const backAudio = new Audio("./proto_ton_007/media/backSound.wav"); // 배경음

    const clickAudio = new Audio("./proto_ton_007/media/click.wav"); // 클릭음
    const correctAudio = new Audio("./proto_ton_007/media/correct.wav"); // 정답음
    const eraseAudio = new Audio("./proto_ton_007/media/erase.wav"); // 지우개

    getCanvasContexts();
    initFillCanvas();
    showCurrentQuizIdx(quizCurrentIdx);
    showSlideQuiz(quizCurrentIdx);
    soundControlInitConfig();

    goGatePageBtn.addEventListener("click", goGatePageBtnHandler);

    backSoundControl.addEventListener("click",backSoundController);
    
    effectSoundControl.addEventListener("click", effectSoundControlHandler);

    settingsBtn.addEventListener("click", settingsBtnHandler);

    settingWrap.addEventListener("mouseleave", settingLeaveHandler);

    EraseSizebtns.forEach(btn => {
        btn.addEventListener("click", EraseSizebtnsHandler);
    });

    eraserDropDown.addEventListener("click", eraserDropDownHandler);

    paintArea.forEach((canvas,idx) => {

        /** 캔버스 마우스 다운 */
        canvas.addEventListener("mousedown", e=>{
            isDrawing = true;
            draw(e,idx);
        });

        /** 캔버스 터치 시작 */
        canvas.addEventListener("touchstart", e=>{
            isDrawing = true;
            draw(e,idx);
        });

        /** 캔버스 마우스 이동 */
        canvas.addEventListener("mousemove", e=>{
            if(isDrawing) {
                draw(e,idx);
            }
        });

        /** 캔버스 터치 이동 */
        canvas.addEventListener("touchmove", e=>{
            if(isDrawing) {
                draw(e,idx);
            }
        });

        /** 캔버스 마우스 업 */
        canvas.addEventListener("mouseup", ()=>{
            isDrawing = false;
            contexts[idx].beginPath();
        });

        /** 캔버스 터치 종료 */
        canvas.addEventListener("touchend", ()=>{
            isDrawing = false;
            contexts[idx].beginPath();
        });

        /** 캔버스 마우스 나가기 */
        canvas.addEventListener("mouseleave", ()=>{
            isDrawing = false;
        });

        /** 캔버스 마우스 들어올 때 */
        canvas.addEventListener("mouseenter", e=>{
            if(e.buttons === 1) {
                isDrawing = true;
            }
        });

    });

    btnReplay.addEventListener("click", btnReplayHandler);

    btnCheckAnswer.addEventListener("click", btnCheckAnswerHandler);

    Buttons.forEach(btn => {
        btn.addEventListener("click",()=>{
            clickSound(isPlayingEffectSound);
        });
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
     * 다시 하기
     */
    function btnReplayHandler() {
        paintArea.forEach(el => el.classList.remove("hide"));
        btnCheckAnswer.classList.remove("hide");
        btnReplay.classList.add("hide");

        answerImg[quizCurrentIdx].querySelector(".answer").classList.remove("show");
        //getCanvasContexts();
        initFillCanvas();
    }

    /**
     * 처음 화면으로
    */
    function goGatePageBtnHandler() {
        soundControlInitConfig();
        backSound(false);
        closeSetting();
        
        quizCurrentIdx = 0;
        showSlideQuiz(quizCurrentIdx);
        showCurrentQuizIdx(quizCurrentIdx);
        eraserDropDown.classList.remove("active");
        paintArea.forEach(el => el.classList.remove("hide"));
        btnCheckAnswer.classList.remove("hide");
        btnReplay.classList.add("hide");
        answerImg.forEach(el => {
            el.querySelector(".answer").classList.remove("show");
        });
        //getCanvasContexts();
        initFillCanvas();

        openGate();
    }
    
    /**
     * 정답 확인
     */
    function btnCheckAnswerHandler() {
        correctSound(isPlayingEffectSound);
        btnReplay.classList.remove("hide");
        paintArea[quizCurrentIdx].classList.add("hide");
        answerImg[quizCurrentIdx].querySelector(".answer").classList.add("show");
        this.classList.add("hide");
    }

    /**
     * 지우개 사이즈 이벤트
     */
    function EraseSizebtnsHandler() {
        EraseSizebtns.forEach(btn => {
            btn.classList.remove("active");
        });
        this.classList.add("active");
        for(let i = 0; i < contexts.length; i++) {
            eraseSize = this.dataset.size;
        }
    }

    /**
     * 지우개 드롭다운
     */
    function eraserDropDownHandler() {
        if(this.classList.contains("active")) {
            this.classList.remove("active");
        }else {
            this.classList.add("active");
        }
    }

    /**
     * 지우개
     * @param {Event} e 
     * @param {number} idx 
     */
    function draw(e, idx) {
        if(!isDrawing) return;
        let x,y;
        let rect = paintArea[idx].getBoundingClientRect();

        if(e.type == "touchmove" || e.type == "touchstart") {
            x = (e.touches[0].clientX - rect.left) / rect.width * paintArea[idx].width;
            y = (e.touches[0].clientY - rect.top) / rect.height * paintArea[idx].height;
        }else {
            x = (e.clientX - rect.left) / rect.width * paintArea[idx].width;
            y = (e.clientY - rect.top) / rect.height * paintArea[idx].height;
        }
        
        if (e.buttons === 1) {
            contexts[idx].lineWidth = eraseSize;
            contexts[idx].lineCap = 'round';
            contexts[idx].globalCompositeOperation = "destination-out";

            contexts[idx].lineTo(x, y);
            contexts[idx].stroke();
            contexts[idx].beginPath();
            contexts[idx].moveTo(x, y);
            eraseSound(isPlayingEffectSound);
        }

    }

    /**
     * 캔버스 색상 초기 설정
     */
   function initFillCanvas() {
        for(let i = 0; i < contexts.length; i++) {
            fillCanvas(i,"#ddd");
        }
    }

    /**
     * 캔버스 색상 채우기
     * @param {number} idx 
     * @param {string} color 
     */
    function fillCanvas(idx,color) {
        contexts[idx].globalCompositeOperation = "source-over";
        contexts[idx].fillStyle = color;
        contexts[idx].fillRect(0,0,paintArea[idx].width,paintArea[idx].height);
    }

    /**
     * 퀴즈 초기 시작 이벤트
     */
    function quizStartBtnHandler() {
        goGatePageBtn.classList.remove("hide");
        EraseSizebtns.forEach(btn => {
            if(btn.classList.contains("active")) {
                eraseSize = btn.dataset.size;
            }
        });
        initFillCanvas();
        closeSetting();
        hideGate();
        backSound(isPlayingBackSound);
    }

    /**
     * 퀴즈 슬라이드 버튼 클릭 이벤트 (다음,이전)
     */
    function quizSliderBtnsHandler(){
        btnCheckAnswer.classList.remove("hide");
        btnReplay.classList.add("hide");
        paintArea.forEach(el => el.classList.remove("hide"));
        answerImg.forEach(el => el.querySelector(".answer").classList.remove("show"));
        initFillCanvas();

        if(this.classList.contains("btn-prev")) { // 이전 버튼
            --quizCurrentIdx;
            showSlideQuiz(quizCurrentIdx);
            showCurrentQuizIdx(quizCurrentIdx);
        }else if(this.classList.contains("btn-next")) { // 다음 버튼
            quizSliderNextBtn.classList.remove("emphasize");
            ++quizCurrentIdx;
            showSlideQuiz(quizCurrentIdx);
            showCurrentQuizIdx(quizCurrentIdx);
        }
    }

    /**
     * 헤더 문제 수
     * @param {number} idx 
     */
    function showCurrentQuizIdx(idx) {
        idx += 1;

        quizHeaderTotalIdx.textContent = maxQuizIdx;
        quizHeaderCurrentIdx.textContent = idx;
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
     * 캔버스 컨텍스트 받아오기
     */
     function getCanvasContexts() {
        contexts = [];
        paintArea.forEach((canvas,idx) => {
            let context = canvas.getContext("2d");
            
            contexts.push(context);
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
     * 지우개 사운드
     * @param {boolean} play 
    */
   function eraseSound(play) {
       if(play) {
           eraseAudio.loop = false;
           eraseAudio.play();
        }else {
            eraseAudio.pause();
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