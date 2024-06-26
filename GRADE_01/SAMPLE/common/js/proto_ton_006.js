document.addEventListener("DOMContentLoaded", init);

function init() {
    const gate = document.querySelector("#gate") ?? document.createElement("div");
    const quizStartBtn = document.querySelector("#quizStartBtn") ?? document.createElement("div");
    const dropdownInput = document.querySelector(".dropdown-input") ?? document.createElement("div");
    const timerDropDown = document.querySelector("#timerDropDown") ?? document.createElement("div");
    const timerDropDownBtns = document.querySelectorAll("#timerDropDown [data-time]") ?? document.createElement("div");
    const quizSliderBtns = document.querySelectorAll(".quizSlider-btn") ?? document.createElement("div");
    const quizSliderPrevBtn = document.querySelector(".quizSlider-btn.btn-prev") ?? document.createElement("div");
    const quizSliderNextBtn = document.querySelector(".quizSlider-btn.btn-next") ?? document.createElement("div");
    const quizSlides = document.querySelectorAll("#quizSliderContainer > li") ?? document.createElement("div");
    const quizHeaderNum = document.querySelectorAll(".quizHeader-num") ?? document.createElement("div");
    const quizHeaderCurrentIdx = document.querySelectorAll(".quizHeader-current-idx") ?? document.createElement("div");
    const quizHeaderTotalIdx = document.querySelectorAll(".quizHeader-total-idx") ?? document.createElement("div");
    const timerArea = document.querySelector("#timerArea") ?? document.createElement("div");
    const timer = timerArea.querySelector("#timer") ?? document.createElement("div");
    const btnTimer = timerArea.querySelector("#btn-timer") ?? document.createElement("div");
    const backgroundPage = document.querySelector("#backgroundPage") ?? document.createElement("div");
    const backgroundContent = backgroundPage.querySelector(".background-content") ?? document.createElement("div");
    const selectQuizBtns = document.querySelectorAll("button[data-quiz-button]") ?? document.createElement("div");
    const initialQuizAnswerAreas = document.querySelectorAll(".initialQuiz-answerArea") ?? document.createElement("div");
    const initialQuizAnswerAreasInputs = document.querySelectorAll(".initialQuiz-answerArea input[type='text']") ?? document.createElement("div");
    const quizSoundBtns = document.querySelectorAll("button[data-quiz-sound]") ?? document.createElement("div");
    const btnCompliment = document.querySelector(".btn-compliment") ?? document.createElement("div");
    const settingsBtn = document.querySelector('#settings') ?? document.createElement("div");
    const settingPop = document.querySelector(".settingPop") ?? document.createElement("div");
    const soundControls = document.querySelector("#soundControls") ?? document.createElement("div");
    const backSoundControl = soundControls.querySelector("#backSoundControl") ?? document.createElement("div");
    const effectSoundControl = soundControls.querySelector("#effectSoundControl") ?? document.createElement("div");
    const goGatePageBtn = document.querySelector("#goGatePageBtn") ?? document.createElement("div");
    const timerAreaBeforeStyle = document.createElement("style");
    const maxQuizIdx = quizSlides.length; // 슬라이드 갯수
    const max = timerArea.clientWidth - btnTimer.clientWidth + 65; // 타이머 최대 이동 거리
    const Buttons = document.querySelectorAll("button, a") ?? document.createElement("div");
    let quizCurrentIdx = 0; // 슬라이드 현재 idx
    let timerMoveSize = -65; // 타이머 이동 px
    let timerText = 0; // 타이머 변동 값
    let terms = 0; // 타이머 이동 간격
    let inputTime = 0; // 입력받은 타이머 값
    let timerMoveInterval; // 타이머무브 인터벌
    let timerTimeInterval; // 타이머시간 인터벌
    let runningMiliSeconds = 0; // 타이머 밀리초
    let runningSeconds = 0; // 타이머 초
    let isPlayingBackSound = true; // 배경음 재생 여부
    let isPlayingEffectSound = true; // 효과음 재생 여부
    let currentBackIdx = 0; // 현재 배경음 index

    //const backAudio = new Audio(); // 배경음
    const backAudio = [
        new Audio("./media/proto_ton_006/timer.mp3"), // 5초 남기 전 배경음
        new Audio("./media/proto_ton_006/alarm.mp3"), // 5초 남은 후 배경음
    ]

    const clickAudio = new Audio("./media/proto_ton_006/click.wav"); // 클릭음
    const bombAudio = new Audio("./media/proto_ton_006/bomb.mp3"); // 폭탄 음성 로드
    const correctAudio = new Audio("./media/proto_ton_006/correct.mp3"); // 정답 음성 로드
    const incorrectAudio = new Audio("./media/proto_ton_006/incorrect.mp3"); // 정답 음성 로드

    const quizAudio = new Audio(); // 퀴즈 음성
    const quizAudioUrlList = [ // 퀴즈 음성들
        "./media/proto_ton_006/Dance-01.wav",
        "./media/proto_ton_006/Dance-02.wav",
        "./media/proto_ton_006/Dance-03.wav",
        "./media/proto_ton_006/Dance-04.wav",
        "./media/proto_ton_006/Dance-05.wav",
    ];

    soundControlInitConfig();

    goGatePageBtn.addEventListener("click", goGatePageBtnHandler);

    backSoundControl.addEventListener("click", backSoundController);

    effectSoundControl.addEventListener("click", effectSoundControlHandler);

    settingsBtn.addEventListener("click", settingsBtnHandler);

    Buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            clickSound(isPlayingEffectSound);
        });
    });

    btnCompliment.addEventListener("click", btnComplimentHandler);

    quizSoundBtns.forEach(item => {
        item.addEventListener("click", quizSoundBtnsHandler);
    })

    initialQuizAnswerAreas.forEach(area => {
        const inputs = area.querySelectorAll("input[data-answer]") ?? div.createElement("div");

        if (inputs.length >= 2) {
            inputs.forEach(input => {
                input.addEventListener("keyup", initialQuizHandlerTwoOrMore);
            });
        } else if (inputs.length == 1) {
            inputs.forEach(input => {
                input.addEventListener("keyup", initialQuizHandlerOne);
            });
        }
    });

    selectQuizBtns.forEach(btn => {
        btn.addEventListener("click", selectQuizHandler);
    });

    dropdownInput.addEventListener("input", timerInputValid);

    dropdownInput.addEventListener("click", dropdownInputHandler);

    timerDropDownBtns.forEach(btn => {
        btn.addEventListener("click", sendDropDownValue);
    });

    quizStartBtn.addEventListener("click", quizStartBtnHandler);

    quizSliderBtns.forEach(btn => {
        btn.addEventListener("click", quizSliderBtnsHandler);
    });

    btnTimer.addEventListener("click", btnTimerHandler);

    /**
     * 게이트 드롭다운
    */
    function dropdownInputHandler() {
        clickSound(isPlayingEffectSound);

        if (this.closest("#timerDropDown").classList.contains("active")) {
            this.closest("#timerDropDown").classList.remove("active");
        } else {
            this.closest("#timerDropDown").classList.add("active");
        }
    }

    /**
     * 처음 화면으로
    */
    function goGatePageBtnHandler() {
        isPlayingBackSound = true;
        isPlayingEffectSound = true;
        soundControlInitConfig();
        currentBackIdx = 0;
        backSound(false, currentBackIdx);
        closeSetting();

        quizCurrentIdx = 0;
        quizAudioStop();
        quizReset();
        quizAreaReset();
        quizSliderNextBtn.classList.remove("emphasize");
        gate.classList.remove("hide");

        openGate();
    }

    /**
     * 칭찬 스티커 버튼 이벤트
     */
    function btnComplimentHandler() {
        showBackgroundPage("compliment");
    }

    /**
     * 퀴즈 음성 실행
     * @param {number} idx 
     */
    function quizAudioStart(idx) {
        quizAudio.src = quizAudioUrlList[idx];
        quizAudio.loop = false;
        quizAudio.play();

        quizAudio.addEventListener("play", quizAudioPlay);
        quizAudio.addEventListener("pause", quizAudioPause);
        quizAudio.addEventListener("ended", quizAudioEnd);

        function quizAudioPlay() {
            quizSoundBtns.forEach(btn => {
                if (btn.dataset.quizSound == idx) {
                    btn.closest(".quizAnswer").querySelector(".soundEffect").classList.add("play");
                }
            });
        }

        function quizAudioPause() {
            quizSoundBtns.forEach(btn => {
                if (btn.dataset.quizSound == idx) {
                    btn.closest(".quizAnswer").querySelector(".soundEffect").classList.remove("play");
                }
            });
        }

        function quizAudioEnd() {
            quizSoundBtns.forEach(btn => {
                if (btn.dataset.quizSound == idx) {
                    btn.classList.remove("play");
                }
            });
        }
    }

    /**
     * 퀴즈 음성 정지
     */
    function quizAudioStop() {
        quizAudio.pause();

        quizSoundBtns.forEach(item => {
            item.classList.remove("play");
        });
    }

    /**
     * 퀴즈 음성 이벤트
     */
    function quizSoundBtnsHandler() {
        const idx = this.dataset.quizSound;

        if (this.classList.contains("play")) { // 정지
            this.classList.remove("play");
            quizAudioStop();
        } else { // 재생
            quizSoundBtns.forEach(item => {
                item.classList.remove("play");
            });
            this.classList.add("play");
            quizAudioStart(idx);
        }
    }

    /**
     * 퀴즈 정답 초기화 
    */
    function quizAreaReset() {
        selectQuizBtns.forEach(el => {
            el.classList.remove("disable");
        });
        initialQuizAnswerAreasInputs.forEach(el => {
            el.value = "";
            el.classList.remove("correct");
            el.classList.remove("incorrect");
            el.classList.remove("disable");
        });
    }

    /**
     * 퀴즈 이벤트 (초성 1글자)
     * enter 정답 제출
     */
    function initialQuizHandlerOne(e) {
        e.target.classList.remove("correct");
        e.target.classList.remove("incorrect");

        if (e.keyCode == 13) { // 엔터

            if (e.target.value == e.target.dataset.answer) { // 정답
                const siblingAnswers = this.closest(".quizArea").querySelectorAll("input[data-answer]");
                siblingAnswers.forEach(el => {
                    el.classList.add("disable");
                });
                showBackgroundPage("correct");
                e.target.classList.add("correct");
            } else { // 오답
                showBackgroundPage("incorrect");
                e.target.classList.add("incorrect");
            }
        }
    }

    /**
     * 퀴즈 이벤트 (초성 2글자 이상)
     * enter, 오른쪽, tab : 다음 영역 이동
     * 왼쪽 : 이전 영역 이동
     * 마지막 영역에서 enter : 정답 제출
     */
    function initialQuizHandlerTwoOrMore(e) {
        const thisParents = e.target.closest(".initialQuiz-answerArea");
        const thisInputs = thisParents.querySelectorAll("input[data-answer]");
        const total = thisInputs.length;
        const cursor = document.activeElement;
        const currentIdx = Array.from(thisInputs).indexOf(cursor);
        const userInputValues = []; // 사용자 입력값
        const correctAnswers = []; // 정답값
        let correctItems;

        this.classList.remove("correct");
        this.classList.remove("incorrect");

        for (el of thisInputs) {
            correctAnswers.push(el.dataset.answer.toLowerCase());
            userInputValues.push(el.value.toLowerCase());
        }

        if (e.keyCode == 13) { // 엔터

            if (currentIdx == total - 1) { // 정답제출

                for (let i = 0; i < thisInputs.length; i++) {

                    if (userInputValues[i] == correctAnswers[i]) {
                        thisInputs[i].classList.add("correct");
                    } else {
                        thisInputs[i].classList.add("incorrect");
                    }

                    correctItems = thisInputs[i].closest(".quizArea").querySelectorAll("input[data-answer].correct");
                }

                if (correctItems.length == thisInputs.length) { // 정답
                    correctItems.forEach(el => {
                        el.classList.add("disable");
                    });
                    showBackgroundPage("correct");
                } else { // 오답
                    showBackgroundPage("incorrect");
                }

            } else { // 오른쪽 이동
                thisInputs[currentIdx + 1].focus();
            }

        } else if (e.keyCode == 9) { // 탭

            if (currentIdx != total - 1) { // 오른쪽 이동
                thisInputs[currentIdx + 1].focus();
            }

        } else if (e.keyCode == 37) { // 왼쪽 방향키

            if (currentIdx != 0) { // 왼쪽 이동
                thisInputs[currentIdx - 1].focus();
            }

        } else if (e.keyCode == 39) { // 오른쪽 방향키

            if (currentIdx != total - 1) { // 오른쪽 이동
                thisInputs[currentIdx + 1].focus();
            }

        }
    }

    /**
     * 퀴즈 이벤트 (ox, 객관식)
     */
    function selectQuizHandler() {
        if (this.dataset.answer) { // 정답
            const siblingAnswers = this.closest(".quizArea").querySelectorAll("button[data-quiz-button]");
            siblingAnswers.forEach(el => {
                el.classList.add("disable");
            });
            showBackgroundPage("correct");
        } else { // 오답
            showBackgroundPage("incorrect");
        }
    }

    /**
     * 타이머 클릭 이벤트 (타이머 정지,시작)
     */
    function btnTimerHandler() {
        if (this.classList.contains("stop")) {
            quizStart();
        } else {
            quizStop();
        }
    }

    /**
     * 타이머 이동
     */
    function timerMove() {

        terms = max / inputTime / 100;
        timerMoveSize += terms;

        if (timerMoveSize >= max) {
            timer.style.left = `${max}px`;
            timerMoveInterval.stop();
            return;
        }

        timer.style.left = `${timerMoveSize}px`;
        timerAreaBeforeStyle.innerHTML = `#timerArea::before {
            width: ${timerMoveSize + 65}px;
        }`;
        document.head.appendChild(timerAreaBeforeStyle);

    }

    /**
     * 타이머 텍스트
     */
    function timerTime() {
        if (timerText <= 0) {
            timerTimeInterval.stop();
            showBackgroundPage("bomb");
            return;
        }

        runningMiliSeconds += 1;
        if (runningMiliSeconds >= 100) {
            runningMiliSeconds = 0;
            ++runningSeconds;
            timerText = inputTime - runningSeconds;
            btnTimer.textContent = timerText;
        }

        if (timerText <= 5) {
            if (isPlayingBackSound) {
                backAudio[0].pause();
                backAudio[1].play();
            } else {
                backAudio[0].pause();
                backAudio[1].pause();
            }
        } else {
            if (isPlayingBackSound) {
                backAudio[1].pause();
                backAudio[0].play();
            } else {
                backAudio[0].pause();
                backAudio[1].pause();
            }
        }

    }

    /**
     * 드롭다운 클릭 이벤트 (선택 값 인풋에 전달)
     */
    function sendDropDownValue() {
        clickSound(isPlayingEffectSound);

        dropdownInput.value = this.dataset.time;

        timerDropDown.classList.remove("active");
    }

    /**
     * 퀴즈 초기 시작 이벤트
     */
    function quizStartBtnHandler() {
        showCurrentQuizIdx(quizCurrentIdx);
        showSlideQuiz(quizCurrentIdx);
        setInputTime();
        timerMoveInterval = new timerFn(timerMove, 10);
        timerTimeInterval = new timerFn(timerTime, 10);
        currentBackIdx = 0;
        backSound(isPlayingBackSound, currentBackIdx);
        goGatePageBtn.classList.remove("hide");
        timerDropDown.classList.remove("active");
        closeSetting();
        hideGate();
    }

    /**
     * 퀴즈 재시작
    */
    function quizRestart() {
        btnTimer.textContent = inputTime;
        timerMoveInterval.restart(10);
        timerTimeInterval.restart(10);
        backSound(isPlayingBackSound, currentBackIdx);
        btnTimer.classList.remove("stop");
        btnTimer.classList.remove("disable");
    }

    /**
     * 퀴즈 초기화
     */
    function quizReset() {
        currentBackIdx = 0;
        backSound(false, currentBackIdx);
        btnTimer.textContent = inputTime;
        timerMoveInterval.reset();
        timerTimeInterval.reset();
        btnTimer.classList.remove("stop");
        btnTimer.classList.remove("disable");
    }

    /**
     * 퀴즈 시작
     */
    function quizStart() {
        timerMoveInterval.start();
        timerTimeInterval.start();
        btnTimer.classList.remove("stop");
        btnTimer.classList.remove("disable");

        if (timerText <= 5) {
            currentBackIdx = 1;
            backSound(isPlayingBackSound, currentBackIdx);
        } else {
            currentBackIdx = 0;
            backSound(isPlayingBackSound, currentBackIdx);
        }
    }

    /**
     * 퀴즈 정지
     */
    function quizStop() {
        timerMoveInterval.stop();
        timerTimeInterval.stop();
        btnTimer.classList.add("stop");
        backSound(false, currentBackIdx);
    }

    /**
     * 타이머 비활성화
     */
    function timerDisable() {
        btnTimer.classList.add("disable");
    }

    /**
     * 퀴즈 슬라이드 버튼 클릭 이벤트 (다음,이전)
     */
    function quizSliderBtnsHandler() {
        quizRestart();
        quizAreaReset();
        quizAudioStop();
        quizSliderNextBtn.classList.remove("emphasize");
        if (this.classList.contains("btn-prev")) { // 이전 버튼
            --quizCurrentIdx;
            showSlideQuiz(quizCurrentIdx);
            showCurrentQuizIdx(quizCurrentIdx);
        } else if (this.classList.contains("btn-next")) { // 다음 버튼
            ++quizCurrentIdx;
            showSlideQuiz(quizCurrentIdx);
            showCurrentQuizIdx(quizCurrentIdx);
        }
    }

    /**
     * 슬라이드
     * @param {number} idx 
     */
    function showSlideQuiz(idx) {

        // 이전, 다음 버튼 토글
        if (idx == 0) {
            quizSliderPrevBtn.classList.add("disable");
        } else {
            quizSliderPrevBtn.classList.remove("disable");
        }
        if (idx == maxQuizIdx - 1) {
            quizSliderNextBtn.classList.add("disable");
            btnCompliment.classList.add("show");
        } else {
            quizSliderNextBtn.classList.remove("disable");
            btnCompliment.classList.remove("show");
        }

        quizSlides.forEach((item, num) => { // 슬라이드 토글
            if (idx == num) {
                item.classList.add("show");
            } else {
                item.classList.remove("show");
            }
        });

    }

    /**
     * 헤더 문제 수
     * @param {number} idx 
     */
    function showCurrentQuizIdx(idx) {
        idx += 1;

        quizHeaderTotalIdx.forEach(el => {
            el.textContent = maxQuizIdx;
        })
        quizHeaderCurrentIdx.forEach(el => {
            el.textContent = idx;
        })
    }

    /**
     * 타이머 입력
     */
    function setInputTime() {
        inputTime = dropdownInput.value;
        timerText = inputTime;
        btnTimer.textContent = inputTime;
    }

    /**
     * 백그라운드 조작 (폭탄,정답,오답,칭찬)
     * @param {string} content 
     */
    function showBackgroundPage(content) {
        backSound(false, currentBackIdx);
        backAudio[0].pause();
        backAudio[1].pause();
        backgroundPage.classList.add("show");
        if (content == "bomb") { // 폭탄
            timerEndSound(isPlayingEffectSound);
            backgroundContent.classList.add("bomb");
            backgroundContent.style.backgroundImage = `url('./common/images/proto_ton_006/timeattack.gif?random=${Math.random()}')`;
            setTimeout(() => {
                backgroundContent.style = "";
                backgroundContent.classList.add("text");
            }, 2500);
            setTimeout(() => {
                backgroundContent.classList.remove("text");
                backgroundContent.classList.remove("bomb");
                backgroundPage.classList.remove("show");
                backgroundContent.classList.remove("animation");
                quizRestart();
            }, 4500);
        } else if (content == "correct") { // 정답
            correctNaraSound(isPlayingEffectSound);
            backgroundContent.classList.add("correct");
            quizSliderNextBtn.classList.add("emphasize");
            quizStop();
            timerDisable();
            setTimeout(() => {
                backgroundContent.classList.remove("correct");
                backgroundPage.classList.remove("show");
                backgroundContent.classList.remove("animation");
            }, 2000);
        } else if (content == "incorrect") { // 오답
            incorrectNaraSound(isPlayingEffectSound);
            backgroundContent.classList.add("incorrect");
            quizStop();
            setTimeout(() => {
                backgroundContent.classList.remove("incorrect");
                backgroundPage.classList.remove("show");
                backgroundContent.classList.remove("animation");
                quizStart();
            }, 2000);
        } else if (content == "compliment") { // 칭찬
            backgroundContent.classList.add("compliment");
            backgroundContent.style.backgroundImage = `url('./common/images/proto_ton_006/bear-compliment.gif?random=${Math.random()}')`;
            setTimeout(() => {
                backgroundContent.classList.remove("compliment");
                backgroundPage.classList.remove("show");
                backgroundContent.classList.remove("animation");
                backgroundContent.style = "";
            }, 3000);
        }

        backgroundContent.classList.add("animation");

        /* setTimeout(()=>{
            backgroundPage.classList.remove("show");
            backgroundContent.classList.remove("animation");
        },2000); */

    }

    /**
     * 타이머 시작, 중지, 초기화
     * @param {object} fn 
     * @param {number} t 
     */
    function timerFn(fn, t) {
        let timerObj = setInterval(fn, t);

        this.stop = function () {
            if (timerObj) {
                clearInterval(timerObj);
                timerObj = null;
            }
            return this;
        }

        this.start = function () {
            if (!timerObj) {
                this.stop();
                timerObj = setInterval(fn, t);
            }
            return this;
        }

        this.restart = function (newT = t) {
            t = newT;
            timerMoveSize = -65;
            timerText = inputTime;
            runningMiliSeconds = 0;
            runningSeconds = 0;
            return this.stop().start();
        }

        this.reset = function () {
            timerMoveSize = -65;
            timerText = inputTime;
            runningMiliSeconds = 0;
            runningSeconds = 0;
            return this.stop();
        }
    }

    /**
     * 드롭다운 입력란 검증 (숫자만 입력)
     */
    function timerInputValid() {
        this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
    }

    /**
     * 세팅 버튼
    */
    function settingsBtnHandler() {
        if (this.classList.contains("active")) {
            this.classList.remove("active");
            settingPop.classList.remove("show");
        } else {
            this.classList.add("active");
            settingPop.classList.add("show");
        }
    }

    /**
    * 세팅 닫기
   */
    function closeSetting() {
        settingsBtn.classList.remove("active");
        settingPop.classList.remove("show");
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
     * 사운드 컨트롤 설정
    */
    function soundControlInitConfig() {
        if (isPlayingBackSound) {
            backSoundControl.classList.add("active");
        } else {
            backSoundControl.classList.remove("active");
        }
        if (isPlayingEffectSound) {
            effectSoundControl.classList.add("active");
        } else {
            effectSoundControl.classList.remove("active");
        }

        goGatePageBtn.classList.add("hide");
    }

    /**
    * 배경음 컨트롤
   */
    function backSoundController() {
        if (this.classList.contains("active")) {
            this.classList.remove("active");
            isPlayingBackSound = false;
        } else {
            this.classList.add("active");
            isPlayingBackSound = true;
        }
        backSound(isPlayingBackSound, currentBackIdx);
    }

    /**
     * 효과음 컨트롤
    */
    function effectSoundControlHandler() {
        if (this.classList.contains("active")) {
            this.classList.remove("active");
            isPlayingEffectSound = false;
        } else {
            this.classList.add("active");
            isPlayingEffectSound = true;
        }
    }

    /**
     * 타이머 끝나면 나오는 소리
     * @param {boolean} play 
     */
    function timerEndSound(play) {
        if (play) {
            bombAudio.loop = false;
            bombAudio.currentTime = 0;
            bombAudio.duration = 3;
            bombAudio.play();
        } else {
            bombAudio.pause();
        }
    }

    /**
     * 정답 내래이션 소리
     * @param {boolean} play 
     */
    function correctNaraSound(play) {
        if (play) {
            correctAudio.loop = false;
            correctAudio.duration = 3;
            correctAudio.play();
        } else {
            correctAudio.pause();
        }
    }

    /**
     * 오답 내래이션 소리
     * @param {boolean} play 
    */
    function incorrectNaraSound(play) {
        if (play) {
            incorrectAudio.loop = false;
            incorrectAudio.duration = 3;
            incorrectAudio.play();
        } else {
            incorrectAudio.pause();
        }
    }

    /**
     * 모든 버튼 클릭음
     * @param {boolean} play 
    */
    function clickSound(play) {
        if (play) {
            clickAudio.loop = false;
            clickAudio.play();
        } else {
            clickAudio.pause();
        }
    }

    /* function backSound(play,idx) {
        backAudio.src = backUrls[idx];
        if(play) {
            backAudio.loop = true;
            backAudio.currentTime = 0;
            backAudio.play();
        }else {
            backAudio.pause();
        }
    } */

    /**
     * 배경음
     * @param {boolean} play 
     * @param {number} idx 
     */
    function backSound(play, idx) {
        if (backAudio[0].played) backAudio[0].pause();
        if (backAudio[1].played) backAudio[1].pause();

        if (play) {
            backAudio[idx].loop = true;
            backAudio[idx].currentTime = 0;
            backAudio[idx].play();
        } else {
            backAudio[idx].pause();
        }
    }
}