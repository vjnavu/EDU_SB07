document.addEventListener("DOMContentLoaded", init);

function init() {
    const gate = document.querySelector("#gate") ?? document.createElement("div");
    const quizStartBtn = document.querySelector("#quizStartBtn") ?? document.createElement("div");
    const popBtns = document.querySelectorAll("button[data-pop]") ?? document.createElement("div");
    const popups = document.querySelectorAll(".popup") ?? document.createElement("div");
    const popupCloseBtns = document.querySelectorAll(".btn-closePopup") ?? document.createElement("div");
    const backgroundDark = document.querySelector(".background-dark") ?? document.createElement("div");
    const roads = document.querySelectorAll(".roads > div") ?? document.createElement("div");
    const btnCheckAnswer = document.querySelector(".btn-checkAnswer") ?? document.createElement("div");
    const btnReplay = document.querySelector(".btn-replay") ?? document.createElement("div");
    const quizBtns = document.querySelectorAll(".quiz-btns") ?? document.createElement("div");
    const char = document.querySelector("#char") ?? document.createElement("div");
    const charMoveBtns = document.querySelectorAll("button[data-char-move]") ?? document.createElement("div");
    const btnQuizCheck = document.querySelectorAll(".btn-quizCheck") ?? document.createElement("div");
    const Buttons = document.querySelectorAll("button") ?? document.createElement("div");
    const backgroundPage = document.querySelector("#backgroundPage") ?? document.createElement("div");
    const backgroundContent = backgroundPage.querySelector(".background-content") ?? document.createElement("div");
    const settingsBtn = document.querySelector('#settings') ?? document.createElement("div");
    const settingPop = document.querySelector(".settingPop") ?? document.createElement("div");
    const soundControls = document.querySelector("#soundControls") ?? document.createElement("div");
    const backSoundControl = soundControls.querySelector("#backSoundControl") ?? document.createElement("div");
    const effectSoundControl = soundControls.querySelector("#effectSoundControl") ?? document.createElement("div");
    const goGatePageBtn = document.querySelector("#goGatePageBtn") ?? document.createElement("div");

    let charCurrentIdx = 0; // 현재 캐릭터 위치
    let quizCurrentIdx = 0; // 현재 문제 번호
    let isPlayingBackSound = true; // 배경음 재생 여부
    let isPlayingEffectSound = true; // 효과음 재생 여부

    const backAudio = new Audio("./media/proto_ton_010/backSound.wav"); // 배경음

    const clickAudio = new Audio("./media/proto_ton_010/click.wav"); // 클릭음
    const correctAudio = new Audio("./media/proto_ton_010/correct.wav"); // 정답음
    const incorrectAudio = new Audio("./media/proto_ton_010/incorrect.wav"); // 오답음
    const startAudio = new Audio("./media/proto_ton_010/start.wav"); // 시작음
    const endAudio = new Audio("./media/proto_ton_010/end.wav"); // 종료음

    resetRoad();
    resetCurrentQuiz();
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

    btnQuizCheck.forEach(btn => {
        btn.addEventListener("click", btnQuizCheckHandler);
    })

    charMoveBtns.forEach(btn => {
        btn.addEventListener("click", charMoveBtnsHandler);
    });

    btnCheckAnswer.addEventListener("click", btnCheckAnswerHandler);

    btnReplay.addEventListener("click", btnReplayHandler);

    popupCloseBtns.forEach(btn => {
        btn.addEventListener("click", closePopup);
    });

    quizStartBtn.addEventListener("click", quizStartBtnHandler);

    /**
     * 캐릭터 무브
     */
    function charMoveBtnsHandler() {
        char.className = "";
        ++charCurrentIdx;
        char.classList.add(`pos-${charCurrentIdx}`);

        roads.forEach((road, idx) => {
            if (idx + 1 == charCurrentIdx) {
                road.classList.remove("hide");
                if (idx - 1 < 0) return;
                quizBtns[idx - 1].querySelector("[data-correct='true']").classList.add("pass");
            }
        });

        if (this.classList.contains("btn-closePopup")) {
            ++quizCurrentIdx;
            showCurrentQuiz();
        }
    }

    /**
     * 현재 풀 문제 활성화
     */
    function showCurrentQuiz() {
        if (quizCurrentIdx == quizBtns.length) return;

        quizBtns[quizCurrentIdx].classList.add("active");
    }

    /**
     * 푼 문제 초기화
     */
    function btnQuizCheckHandler() {
        if (this.dataset.correct == "true") {
            correctSound(isPlayingEffectSound);
            this.closest(".quiz-btns").classList.remove("active");
        } else {
            incorrectSound(isPlayingEffectSound);
        }
    }

    /**
     * 정답 확인
     */
    function btnCheckAnswerHandler() {
        endSound(isPlayingEffectSound);
        btnReplay.classList.remove("hide");

        char.className = "";
        char.classList.add(`pos-${quizBtns.length + 1}`);

        quizBtns.forEach(el => {
            el.classList.remove("active");
        });

        btnQuizCheck.forEach(el => {
            if (JSON.parse(el.dataset.correct)) {
                el.classList.add("pass");
            }
        });

        roads.forEach((el, idx) => {
            if (idx == roads.length - 1) {
                el.classList.remove("hide");
            } else {
                el.classList.add("hide");
            }
        });

        this.classList.add("hide");

        showBackgroundPage();
    }

    /**
     * 다시 하기
     */
    function btnReplayHandler() {
        btnCheckAnswer.classList.remove("hide");
        btnReplay.classList.add("hide");
        quizCurrentIdx = 0;
        charCurrentIdx = 0;
        char.className = "";
        btnQuizCheck.forEach(el => {
            el.classList.remove("pass");
        });
        resetRoad();
        resetCurrentQuiz();
        closePopup();
    }

    /**
     * 처음 화면으로
     */
    function goGatePageBtnHandler() {
        isPlayingBackSound = true;
        isPlayingEffectSound = true;
        soundControlInitConfig();
        backSound(false);
        closeSetting();

        btnCheckAnswer.classList.remove("hide");
        btnReplay.classList.add("hide");
        quizCurrentIdx = 0;
        charCurrentIdx = 0;
        char.className = "";
        btnQuizCheck.forEach(el => {
            el.classList.remove("pass");
        });
        resetRoad();
        resetCurrentQuiz();
        closePopup();

        openGate();
    }

    /**
     * 현재 문제 초기화
     */
    function resetCurrentQuiz() {
        quizBtns.forEach((el, idx) => {
            if (idx == 0) {
                el.classList.add("active");
            }
        });
    }

    /**
     * 길 이미지 초기화
     */
    function resetRoad() {
        roads.forEach(el => {
            el.classList.add("hide")
        });
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
     * 퀴즈 시작 버튼 이벤트
     */
    function quizStartBtnHandler() {
        startSound(isPlayingEffectSound);
        backSound(isPlayingBackSound);
        goGatePageBtn.classList.remove("hide");
        gate.classList.add("hide");
        closeSetting();
        closePopup();
    }

    /**
     * 백그라운드 조작
     */
    function showBackgroundPage() {
        backgroundPage.classList.add("show");
        backgroundContent.classList.add("stamp");
        backgroundContent.classList.add("animation");

        setTimeout(() => {
            backgroundPage.classList.remove("show");
            backgroundContent.classList.remove("stamp");
            backgroundContent.classList.remove("animation");
        }, 3000);

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
     * 게이트 열기
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
        backSound(isPlayingBackSound);
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

    /**
     * 정답 사운드
     * @param {boolean} play 
     */
    function correctSound(play) {
        if (play) {
            correctAudio.loop = false;
            correctAudio.play();
        } else {
            correctAudio.pause();
        }
    }

    /**
     * 오답 사운드
     * @param {boolean} play 
     */
    function incorrectSound(play) {
        if (play) {
            incorrectAudio.loop = false;
            incorrectAudio.play();
        } else {
            incorrectAudio.pause();
        }
    }

    /**
     * 시작 사운드
     * @param {boolean} play 
     */
    function startSound(play) {
        if (play) {
            startAudio.loop = false;
            startAudio.play();
        } else {
            startAudio.pause();
        }
    }

    /**
     * 종료 사운드
     * @param {boolean} play 
     */
    function endSound(play) {
        if (play) {
            endAudio.loop = false;
            endAudio.play();
        } else {
            endAudio.pause();
        }
    }

    /**
     * 배경음
     * @param {boolean} play 
    */
    function backSound(play) {
        if (play) {
            backAudio.loop = true;
            backAudio.currentTime = 0;
            backAudio.play();
        } else {
            backAudio.pause();
        }
    }
}