document.addEventListener("DOMContentLoaded", init);

function init() {
    const gate = document.querySelector("#gate") ?? document.createElement("div");
    const quizStartBtn = document.querySelector("#quizStartBtn") ?? document.createElement("div");
    const selectCellbtns = document.querySelectorAll(".btn-select-mode") ?? document.createElement("div");
    const wordCount = document.querySelector("#wordCount") ?? document.createElement("div");
    const wordRemain = wordCount.querySelector(".remain") ?? document.createElement("div");
    const wordTotal = wordCount.querySelector(".total") ?? document.createElement("div");
    const pickArea = document.querySelector(".pickArea") ?? document.createElement("div");
    const btnPickWord = pickArea.querySelector(".btn-pickWord") ?? document.createElement("div");
    const pickAreaWordCount = pickArea.querySelector(".pickArea-wordCount") ?? document.createElement("div");
    const popups = document.querySelectorAll(".popup") ?? document.createElement("div");
    const popupCloseBtns = document.querySelectorAll(".btn-closePopup") ?? document.createElement("div");
    const backgroundDark = document.querySelector(".background-dark") ?? document.createElement("div");
    const wordList = document.querySelector("#wordList") ?? document.createElement("div");
    const wordArea = document.querySelector("#wordArea") ?? document.createElement("div");
    const Buttons = document.querySelectorAll("button, a") ?? document.createElement("div");
    const btnPopAlarm = document.querySelector(".btn-popAlarm") ?? document.createElement("div");
    const settingsBtn = document.querySelector('#settings') ?? document.createElement("div");
    const settingWrap = document.querySelector(".settingWrap") ?? document.createElement("div");
    const soundControls = document.querySelector("#soundControls") ?? document.createElement("div");
    const backSoundControl = soundControls.querySelector("#backSoundControl") ?? document.createElement("div");
    const effectSoundControl = soundControls.querySelector("#effectSoundControl") ?? document.createElement("div");
    const goGatePageBtn = document.querySelector("#goGatePageBtn") ?? document.createElement("div");

    // const bingoModeContents1 = ["예시단어예시단어<br>예시단어예시단어", "예시단어예시단어<br>예시단어예시단어", "예시단어예시단어<br>예시단어예시단어", "예시단어예시단어<br>예시단어예시단어", "예시단어예시단어<br>예시단어예시단어", "예시단어예시단어<br>예시단어예시단어", "예시단어예시단어<br>예시단어예시단어", "예시단어예시단어<br>예시단어예시단어", "예시단어예시단어<br>예시단어예시단어", "예시단어예시단어<br>예시단어예시단어", "예시단어예시단어<br>예시단어예시단어", "예시단어예시단어<br>예시단어예시단어"]; // 3x4 예시 단어
    // const bingoModeContents2 = ["예시단어예시단어<br>예시단어예시단어", "예시단어예시단어<br>예시단어예시단어", "예시단어예시단어<br>예시단어예시단어", "예시단어예시단어<br>예시단어예시단어", "예시단어예시단어<br>예시단어예시단어", "예시단어예시단어<br>예시단어예시단어", "예시단어예시단어<br>예시단어예시단어", "예시단어예시단어<br>예시단어예시단어", "예시단어예시단어<br>예시단어예시단어", "예시단어예시단어<br>예시단어예시단어", "예시단어예시단어<br>예시단어예시단어", "예시단어예시단어<br>예시단어예시단어", "예시단어예시단어<br>예시단어예시단어", "예시단어예시단어<br>예시단어예시단어", "예시단어예시단어<br>예시단어예시단어", "예시단어예시단어<br>예시단어예시단어", "예시단어예시단어<br>예시단어예시단어", "예시단어예시단어<br>예시단어예시단어", "예시단어예시단어<br>예시단어예시단어", "예시단어예시단어<br>예시단어예시단어"]; // 4x5 예시 단어
    let bingoMode = 0; // 빙고 모드
    let pickedModeWordTotal = 0; // 선택한 빙고 단어 총 갯수
    let remainingWordCnt = 0; // 남은 빙고 단어 갯수
    let isPlayingBackSound = true; // 배경음 재생 여부
    let isPlayingEffectSound = true; // 효과음 재생 여부
    const backAudio = new Audio("./media/proto_ton_009/backSound.wav"); // 배경음

    const clickAudio = new Audio("./media/proto_ton_009/click.wav"); // 클릭음
    const shootingstarAudio = new Audio("./media/proto_ton_009/shootingstar.wav"); // 별똥별
    const dolphinAudio = new Audio("./media/proto_ton_009/dolphin.wav"); // 돌고래

    /* bingoModeDefault(bingoMode); */

    soundControlInitConfig();

    goGatePageBtn.addEventListener("click", goGatePageBtnHandler);

    backSoundControl.addEventListener("click", backSoundController);

    effectSoundControl.addEventListener("click", effectSoundControlHandler);

    settingsBtn.addEventListener("click", settingsBtnHandler);

    settingWrap.addEventListener("mouseleave", settingLeaveHandler);

    Buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            clickSound(isPlayingEffectSound);
        });
    });

    popupCloseBtns.forEach(btn => {
        btn.addEventListener("click", popupCloseBtnsHandler);
    });

    btnPickWord.addEventListener("click", pickWord);

    quizStartBtn.addEventListener("click", quizStartBtnHandler);

    selectCellbtns.forEach(btn => {
        btn.addEventListener("click", selectCellbtnsHandler);
    });

    /**
     * 세팅 마우스 아웃
     * @param {Event} e 
     * @returns 
     */
    function settingLeaveHandler(e) {
        if (!e.target.classList.contains("active")) return;

        settingWrap.classList.remove("active");
    }

    /**
     * 팝업 닫기 버튼
    */
    function popupCloseBtnsHandler() {
        this.closest(".popbox").querySelector(".popCloseBtn").remove();
        closePopup();
    }

    /**
     * 처음 화면으로
    */
    function goGatePageBtnHandler() {
        soundControlInitConfig();
        backSound(false);
        closeSetting();

        bingoMode = 0;
        selectCellbtns.forEach(el => {
            el.classList.remove("active");
        });
        btnPickWord.classList.remove("hide");
        wordList.className = "";
        gate.classList.remove("hide");
        pickArea.classList.remove("moved");
        btnPickWord.textContent = "단어 뽑기";
        pickArea.classList.remove("hide");
        pickAreaWordCount.classList.add("hide");
        while (wordArea.firstChild) {
            wordArea.removeChild(wordArea.firstChild);
        }
        shuffleWords(bingoMode);
        removeExampleWordList();
        closePopup();

        openGate();
    }

    /**
     * 예시 단어 리스트 출력
     */
    function showExampleWordList() {
        let liFragment = document.createDocumentFragment();

        if (bingoMode == 1) {
            wordList.classList.add("col4");
            shuffleWords(bingoMode).forEach((item, idx) => {
                const li = document.createElement("li");
                // li.textContent = item;
                li.innerHTML = item;
                liFragment.appendChild(li);
            });
        } else if (bingoMode == 2) {
            wordList.classList.add("col5");
            shuffleWords(bingoMode).forEach((item, idx) => {
                const li = document.createElement("li");
                //li.textContent = item;
                li.innerHTML = item;
                liFragment.appendChild(li);
            });
        }

        wordList.appendChild(liFragment);
    }

    /**
     * 예시 단어 리스트 삭제
     */
    function removeExampleWordList() {
        while (wordList.firstChild) {
            wordList.removeChild(wordList.firstChild);
        }
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
     * 단어 뽑기
     */
    function pickWord() {
        let imageUrl;
        const Words = wordArea.querySelectorAll("li");

        setRemainWord();
        pickAreaWordCount.classList.remove("hide");

        if (pickedModeWordTotal - remainingWordCnt - 1 >= 1) {
            Words[pickedModeWordTotal - remainingWordCnt - 2].classList.add("end");
        }

        if (this.dataset.sound == "shootingstar") {
            shootingstarSound(isPlayingEffectSound);

            if (pickedModeWordTotal - remainingWordCnt == 1) {
                imageUrl = `url('./common/images/proto_ton_009/star_come.gif?random=${Math.random()}')`;
                setTimeout(() => {
                    Words[pickedModeWordTotal - remainingWordCnt - 1].style.backgroundImage = imageUrl;
                    Words[pickedModeWordTotal - remainingWordCnt - 1].classList.add("active");
                }, 800);
            } else {
                imageUrl = `url('./common/images/proto_ton_009/star_out.gif?random=${Math.random()}')`;
                setTimeout(() => {
                    imageUrl = `url('./common/images/proto_ton_009/star_come.gif?random=${Math.random()}')`;
                    Words[pickedModeWordTotal - remainingWordCnt - 1].style.backgroundImage = imageUrl;
                }, 800);
                setTimeout(() => {
                    Words[pickedModeWordTotal - remainingWordCnt - 1].classList.add("active");
                }, 1600);
            }
        } else if (this.dataset.sound == "dolphin") {
            dolphinSound(isPlayingEffectSound);
            if (pickedModeWordTotal - remainingWordCnt == 1) {
                imageUrl = `url('./common/images/proto_ton_009/dolphine1_come.gif?random=${Math.random()}')`;
            } else if (pickedModeWordTotal - remainingWordCnt == 2) {
                imageUrl = `url('./common/images/proto_ton_009/dolphine1_out_dolphine2_come.gif?random=${Math.random()}')`;
            } else if (pickedModeWordTotal - remainingWordCnt == 3) {
                imageUrl = `url('./common/images/proto_ton_009/dolphine2_out_dolphine3_come.gif?random=${Math.random()}')`;
            } else if (pickedModeWordTotal - remainingWordCnt == 4) {
                imageUrl = `url('./common/images/proto_ton_009/dolphine3_out_dolphine1_come.gif?random=${Math.random()}')`;
            } else if (pickedModeWordTotal - remainingWordCnt == 5) {
                imageUrl = `url('./common/images/proto_ton_009/dolphine1_out_dolphine2_come.gif?random=${Math.random()}')`;
            } else if (pickedModeWordTotal - remainingWordCnt == 6) {
                imageUrl = `url('./common/images/proto_ton_009/dolphine2_out_dolphine3_come.gif?random=${Math.random()}')`;
            } else if (pickedModeWordTotal - remainingWordCnt == 7) {
                imageUrl = `url('./common/images/proto_ton_009/dolphine3_out_dolphine1_come.gif?random=${Math.random()}')`;
            } else if (pickedModeWordTotal - remainingWordCnt == 8) {
                imageUrl = `url('./common/images/proto_ton_009/dolphine1_out_dolphine2_come.gif?random=${Math.random()}')`;
            } else if (pickedModeWordTotal - remainingWordCnt == 9) {
                imageUrl = `url('./common/images/proto_ton_009/dolphine2_out_dolphine3_come.gif?random=${Math.random()}')`;
            } else if (pickedModeWordTotal - remainingWordCnt == 10) {
                imageUrl = `url('./common/images/proto_ton_009/dolphine3_out_dolphine1_come.gif?random=${Math.random()}')`;
            } else if (pickedModeWordTotal - remainingWordCnt == 11) {
                imageUrl = `url('./common/images/proto_ton_009/dolphine1_out_dolphine2_come.gif?random=${Math.random()}')`;
            } else if (pickedModeWordTotal - remainingWordCnt == 12) {
                imageUrl = `url('./common/images/proto_ton_009/dolphine2_out_dolphine3_come.gif?random=${Math.random()}')`;
            } else if (pickedModeWordTotal - remainingWordCnt == 13) {
                imageUrl = `url('./common/images/proto_ton_009/dolphine3_out_dolphine1_come.gif?random=${Math.random()}')`;
            } else if (pickedModeWordTotal - remainingWordCnt == 14) {
                imageUrl = `url('./common/images/proto_ton_009/dolphine1_out_dolphine2_come.gif?random=${Math.random()}')`;
            } else if (pickedModeWordTotal - remainingWordCnt == 15) {
                imageUrl = `url('./common/images/proto_ton_009/dolphine2_out_dolphine3_come.gif?random=${Math.random()}')`;
            } else if (pickedModeWordTotal - remainingWordCnt == 16) {
                imageUrl = `url('./common/images/proto_ton_009/dolphine3_out_dolphine1_come.gif?random=${Math.random()}')`;
            } else if (pickedModeWordTotal - remainingWordCnt == 17) {
                imageUrl = `url('./common/images/proto_ton_009/dolphine1_out_dolphine2_come.gif?random=${Math.random()}')`;
            } else if (pickedModeWordTotal - remainingWordCnt == 18) {
                imageUrl = `url('./common/images/proto_ton_009/dolphine2_out_dolphine3_come.gif?random=${Math.random()}')`;
            } else if (pickedModeWordTotal - remainingWordCnt == 19) {
                imageUrl = `url('./common/images/proto_ton_009/dolphine3_out_dolphine1_come.gif?random=${Math.random()}')`;
            } else if (pickedModeWordTotal - remainingWordCnt == 20) {
                imageUrl = `url('./common/images/proto_ton_009/dolphine1_out_dolphine2_come.gif?random=${Math.random()}')`;
            }

            setTimeout(() => {
                Words[pickedModeWordTotal - remainingWordCnt - 1].classList.add("active");
            }, 1000);
        }

        Words[pickedModeWordTotal - remainingWordCnt - 1].style.backgroundImage = imageUrl;

        if (pickedModeWordTotal - remainingWordCnt == 1) {
            pickArea.classList.add("moved");
            btnPickWord.textContent = "다른 단어 뽑기";
        }

        pickArea.classList.add("hide");

        if (this.dataset.sound == "dolphin") {
            setTimeout(() => {
                pickArea.classList.remove("hide");
                if (remainingWordCnt == 0) {
                    btnPickWord.classList.add("hide");
                }
                Words[pickedModeWordTotal - remainingWordCnt - 1].style = "";
            }, 1000);
        } else if (this.dataset.sound == "shootingstar") {
            if (pickedModeWordTotal - remainingWordCnt == 1) {
                setTimeout(() => {
                    pickArea.classList.remove("hide");
                    Words[pickedModeWordTotal - remainingWordCnt - 1].style = "";
                }, 800);
            } else {
                setTimeout(() => {
                    pickArea.classList.remove("hide");
                    if (remainingWordCnt == 0) {
                        btnPickWord.classList.add("hide");
                    }
                    Words[pickedModeWordTotal - remainingWordCnt - 1].style = "";
                }, 1600);
            }
        }
    }

    /**
     * 빙고 단어 셔플
     * @param {number} num 
     */
    function shuffleWords(num) {
        let arr = [];
        if (num == 1) {
            arr = [...bingoModeContents1.sort(() => Math.random() - 0.5)];
        } else if (num == 2) {
            arr = [...bingoModeContents2.sort(() => Math.random() - 0.5)];
        }
        return arr;
    }

    /**
     * 퀴즈 시작 버튼 이벤트
     */
    function quizStartBtnHandler() {
        if (bingoMode == 0) {
            btnPopAlarm.click();
            return;
        }

        showExampleWordList();
        setTotalWord();
        setWordAreaContents();
        goGatePageBtn.classList.remove("hide");
        gate.classList.add("hide");
        pickAreaWordCount.classList.add("hide");
        closePopup();
        closeSetting();
        backSound(isPlayingBackSound);
    }

    /**
     * 뽑기 단어 출력
     */
    function setWordAreaContents() {
        let liFragment = document.createDocumentFragment();

        if (bingoMode == 1) {
            shuffleWords(bingoMode).forEach((item, idx) => {
                const li = document.createElement("li");
                if (wordArea.classList.contains("dolphinArea")) {
                    li.classList.add("dolphin");
                } else if (wordArea.classList.contains("shootingStarArea")) {
                    li.classList.add("shootingStar");
                }
                //li.textContent = item;
                li.innerHTML = item;
                liFragment.appendChild(li);
            });
        } else if (bingoMode == 2) {
            shuffleWords(bingoMode).forEach((item, idx) => {
                const li = document.createElement("li");
                if (wordArea.classList.contains("dolphinArea")) {
                    li.classList.add("dolphin");
                } else if (wordArea.classList.contains("shootingStarArea")) {
                    li.classList.add("shootingStar");
                }
                //li.textContent = item;
                li.innerHTML = item;
                liFragment.appendChild(li);
            });
        }

        wordArea.appendChild(liFragment);
    }

    /**
     * 뽑기 단어 삭제
     */
    function removeWordAreaContents() {
        while (wordList.firstChild) {
            wordList.removeChild(wordList.firstChild);
        }
    }

    /**
     * 단어 남은 갯수 설정
     */
    function setRemainWord() {
        wordRemain.textContent = --remainingWordCnt;
    }

    /**
     * 단어 총 갯수 설정
     */
    function setTotalWord() {
        if (bingoMode == 1) {
            pickedModeWordTotal = bingoModeContents1.length;
        } else if (bingoMode == 2) {
            pickedModeWordTotal = bingoModeContents2.length;
        }

        wordTotal.textContent = pickedModeWordTotal;
        remainingWordCnt = pickedModeWordTotal;
    }

    /**
     * 빙고 모드 선택 버튼 이벤트
     */
    function selectCellbtnsHandler() {
        bingoMode = this.dataset.bingoMode;

        selectCellbtns.forEach(btn => {
            if (btn.dataset.bingoMode == bingoMode) {
                btn.classList.add("active");
            } else {
                btn.classList.remove("active");
            }
        });

    }

    /**
     * 빙고 모드 기본 설정
     * @param {number} mode 
     */
    function bingoModeDefault(mode) {
        selectCellbtns.forEach(btn => {
            if (btn.dataset.bingoMode == mode) {
                btn.classList.add("active");
            }
        })
    }

    /**
      * 세팅 버튼
     */
    function settingsBtnHandler() {
        if (settingWrap.classList.contains("active")) {
            settingWrap.classList.remove("active");
        } else {
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
        if (gate.classList.contains("hide")) {
            backSound(isPlayingBackSound);
        } else {
            backSound(false);
        }
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
     * 별똥별 소리
     * @param {boolean} play 
     */
    function shootingstarSound(play) {
        if (play) {
            shootingstarAudio.loop = false;
            shootingstarAudio.currentTime = 0;
            shootingstarAudio.play();
        } else {
            shootingstarAudio.pause();
        }
    }

    /**
     * 돌고래 소리
     * @param {boolean} play 
     */
    function dolphinSound(play) {
        if (play) {
            dolphinAudio.loop = false;
            dolphinAudio.currentTime = 0;
            dolphinAudio.play();
        } else {
            dolphinAudio.pause();
        }
    }

    /**
     * 배경음
     * @param {boolean} play 
    */
    function backSound(play) {
        if (play) {
            backAudio.loop = true;
            backAudio.volume = 0.5;
            backAudio.currentTime = 0;
            backAudio.play();
        } else {
            backAudio.pause();
        }
    }
}