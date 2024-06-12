window.addEventListener("load", () => {
    const audio = document.querySelector("#music");
    const beat1 = document.querySelector("#beat1");
    const beat2 = document.querySelector("#beat2");
    const beat3 = document.querySelector("#beat3");
    const beat4 = document.querySelector("#beat4");
    const beat5 = document.querySelector("#beat5");
    const beat6 = document.querySelector("#beat6");
    const btnPlayAll = document.querySelector(".btn-playAll");
    const btnPlayMeasure = document.querySelector(".btn-playMeasure");
    const btnPlay = document.querySelector(".btn-music-play");
    const btnProgressbar = document.querySelector(".btn-musicProgressbar");
    const btnReset = document.querySelector(".btn-music-reset");
    const btnPrev = document.querySelector(".btn-measurePrev");
    const btnNext = document.querySelector(".btn-measureNext");
    const btnInfinite = document.querySelector(".btn-musicInfinite");
    const btnPitchDown = document.querySelector(".btn-pitchDown");
    const btnPitchUp = document.querySelector(".btn-pitchUp");
    const measureCurrentIdx = document.querySelector(".measure-currentIdx");
    const measureTotal = document.querySelector(".measure-total");
    const measures = document.querySelectorAll(".measure");
    const measuresLi = document.querySelectorAll(".measure > ul > li");
    const btnSpeedDefault = document.querySelector(".btn-speedDefault");
    const btnSpeedFast = document.querySelector(".btn-speedFast");
    const btnSpeedSlow = document.querySelector(".btn-speedSlow");
    const btnDropdown = document.querySelectorAll(".dropdown");
    const dropdownBtns = document.querySelectorAll(".dropdown > ul button");
    const countDown = document.querySelector("#countDown");
    const buttons = document.querySelectorAll("button, a");
    const btnRemovePoint = document.querySelector(".btn-removePoint");
    const sheetBody = document.querySelector(".sheet-body");

    // 소절 싱크
    const measureArr = [
        /* 1소절 */
        [
            2.0, 0.3, 0.2, 0.3, 0.3,
            0.2, 0.4, 0.2,
            0.1, 0.3, 0.2, 1.1,
            0.6, 0.2, 0.2, 0.4,
            0.3, 0.4,
            0.2, 0.5, 0.6
        ], // 9s
        /* 2소절 */
        [
            0.4, 0.2, 0.2, 0.5,
            0.3, 0.2, 0.3,
            0.3, 0.2, 0.3, 0.9,
            0.5, 0.4, 0.9,
            0.5, 0.5, 0.2, 0.5
        ], // 7.3s
        /* 3소절 */
        [
            0.5, 0.3, 0.2, 0.2,
            0.2, 0.2, 0.2, 0.2,
            0.5, 0.3, 1,
            0.6, 0.2, 0.2,
            0.3, 0.2, 0.3, 0.2,
            0.8, 0.9
        ], // 7.5s
        /* 4소절 */
        [
            0.5, 0.3, 0.3,
            0.2, 0.2, 0.3, 0.3,
            0.8, 0.8,
            0.6, 0.3, 0.2, 0.3,
            0.3, 0.3,
            0.3, 0.5, 0.8
        ], // 7.3s
        /* 5소절 */
        [
            0.5, 0.3, 0.5, 0.3,
            0.3, 0.2, 0.3, 0.2,
            0.3, 0.3, 0.4,
            0.6, 0.2, 0.5, 0.3,
            0.5, 0.2, 0.2, 0.3,
            0.2, 0.2, 0.6
        ], // 7.4s
        /* 6소절 */
        [
            0.5, 0.2, 0.5, 0.5,
            0.4, 0.4, 0.2,
            0.4, 0.6,
            0.6, 0.1, 0.2, 0.2,
            0.2, 0.2, 0.5,
            0.5, 0.5, 0.7
        ], // 7.4s
        /* 7소절 */
        [
            2, 0.3, 0.2, 0.4, 0.3,
            0.2, 0.4, 0.2,
            0.1, 0.3, 0.2, 1.1,
            0.6, 0.2, 0.2, 0.4,
            0.3, 0.4,
            0.2, 0.5, 0.7
        ], // 9.2s
        /* 8소절 */
        [
            0.6, 0.2, 0.2, 0.4,
            0.2, 0.3, 0.2,
            0.2, 0.2, 0.2, 1.1,
            0.4, 0.4, 0.3,
            0.2, 0.2, 0.2, 0.2,
            0.4, 0.5, 2
        ], // 8.8s
    ];

    // 글자 on 시간 처리
    let $delaySum = 0;

    $(document).find(".measure").each(function (e) {
        let $delay = measureArr[e];

        $(this).find("li").each(function (e) {
            $delaySum = $delaySum + $delay[e];

            $(this).attr("data-play", $delaySum);
            $(this).attr("data-delay", $delay[e]);

            let $tplay = Number($(this).data("play"));
            let $tdelay = Number($(this).data("delay"));

            $(this).attr("data-stime", Number($tplay - $tdelay));
            $(this).attr("data-etime", Number($tplay));

            $delaySum = $delaySum;
        });
    });

    // 2소절씩 노출
    const measuresData = $(document).find(".sheet-body").data("measure-line");
    const measuresGroup = $(document).find(".sheet-body > .measure");
    if (measuresData == 2) {
        let length = measuresGroup.length;

        for (i = 0; i < length; i += 2) {
            measuresGroup.slice(i, i + 2).wrapAll('<div class="sheet-group"></div>');
        }
    }
    const sheetGroups = document.querySelectorAll(".sheet-group");

    /* 상태 */
    let isPlaying = false; // 재생중 : true, 정지,중단 : false
    let isSpeed = "default"; // default, slow, fast
    let isMr = "ar"; // 노래듣기 : ar , 반주듣기 : mr
    /* // 상태 */

    let countVar = 0;
    let countNum = 6;
    let currentMeasure = 0;
    let totalMeasure = measures.length;
    const measureTimeObj = {};
    let startVar = 0;
    let measurePauseTime;
    let audioLoopStart;
    let audioLoopRunning;
    let audioLoopEnd;
    let audioDuration = audio.duration;
    let adjustedCurTime = audio.currentTime / audio.playbackRate; // 속도 조절된 현재 시간
    let adjustedDuration = audioDuration / audio.playbackRate; // 속도 조절된 음성 총 시간
    let progressbarPer = (adjustedCurTime / adjustedDuration) * 100; // 속도 조절된 프로그레스바 비율
    let startTime = [];
    let runningTime = [];
    let endTime = [];
    let groupStartTime = [];
    let groupEndTime = [];

    /* let sumOfArray = measureArr[0].reduce((accumulator,currentValue) => accumulator + currentValue, 0); */

    /* let sumOfArray = 0;
    measureArr.forEach((el,idx)=>{
        let sumArr = el.reduce((accumulator,currentValue) => accumulator + currentValue, 0);
        sumOfArray += sumArr;
    }); */

    // 소절 총 합한 시간 < 오디오 전체 시간 으로 설정해야함
    /* console.log(`더한 시간(${sumOfArray}) < 총시간(${audio.duration})`); */

    // 소절 인포
    measureTotal.textContent = totalMeasure;
    measureCurrentIdx.textContent = currentMeasure + 1;
    //audio.addEventListener("timeupdate",audioTimeupdate);
    btnRemovePoint.addEventListener("click", btnRemovePointHandler);
    btnPrev.addEventListener("click", btnPrevHandler);
    btnNext.addEventListener("click", btnNextHandler);
    btnSpeedDefault.addEventListener("click", btnSpeedDefaultHandler);
    btnSpeedSlow.addEventListener("click", btnSpeedSlowHandler);
    btnSpeedFast.addEventListener("click", btnSpeedFastHandler);
    btnPlayAll.addEventListener("click", btnPlayAllHandler);
    btnPlayMeasure.addEventListener("click", btnPlayMeasureHandler);
    btnInfinite.addEventListener("click", btnInfiniteHandler);
    btnPlay.addEventListener("click", btnPlayHandler);
    btnReset.addEventListener("click", btnResetHandler);
    btnPitchUp.addEventListener("click", btnPitchUpHandler);
    btnPitchDown.addEventListener("click", btnPitchDownHandler);
    dropdownBtns.forEach(el => {
        el.addEventListener("click", dropdownBtnsHandler);
    });
    btnDropdown.forEach(el => {
        el.addEventListener("click", btnDropdownHandler);
    });
    btnProgressbar.addEventListener("input", btnProgressbarHandler);
    buttons.forEach(el => {
        el.addEventListener("click", buttonsHandler);
    });

    showCurrentLyrics(currentMeasure);

    /**
     * 현재 가사 보여주기
    */
    function showCurrentLyrics(idx) {
        sheetGroups.forEach(el => {
            el.classList.remove("on")
        });
        measures.forEach(el => {
            el.classList.remove("view")
        });
        /* sheetGroups[Math.floor(idx/2)].classList.add("on"); */
        measures[idx].classList.add("view");
    }

    /**
     * 가사 포인트
     */
    function btnRemovePointHandler() {
        if (this.classList.contains("active")) {
            this.classList.remove("active");
            sheetBody.classList.add("showPoint");
        } else {
            this.classList.add("active");
            sheetBody.classList.remove("showPoint");
        }
    }

    /**
     * 버튼 클릭음
     */
    function buttonsHandler() {
        efSound("./media/click.mp3");
    }

    /**
     * 음악 재생
    */
    function music(time) {
        let musicChkTime = time;
        audioTimeupdate(musicChkTime);
        // 가사 그룹 활성화
        if (measuresData == 2) {
            measuresLi.forEach((el, idx) => {
                let $sheetGroups = el.closest(".sheet-group");
                let $groupTime = [...sheetGroups].indexOf($sheetGroups);

                if (groupStartTime[$groupTime] < musicChkTime && musicChkTime <= groupEndTime[$groupTime]) {
                    $sheetGroups.classList.add("on");
                } else {
                    $sheetGroups.classList.remove("on");
                }
            });
        }
        // 가사 소절 활성화
        measuresLi.forEach((el, idx) => {
            let $measure = el.closest(".measure");
            let $measureTime = [...measures].indexOf(el.closest(".measure"));

            if (startTime[$measureTime] < musicChkTime && musicChkTime <= endTime[$measureTime]) {
                $measure.classList.add("view");
            } else {
                $measure.classList.remove("view");
            }
        });
        // 가사 색 변경
        measuresLi.forEach((el, idx) => {
            if (musicChkTime > el.dataset.stime && musicChkTime <= el.dataset.etime) {
                el.classList.add("active");
            } else {
                el.classList.remove("active");
            }
            /*
            if (el.dataset.play < musicChkTime) {
                el.classList.add("active");
            }
            */
        });
        // 페이지 변경
        measures.forEach((el, idx) => {
            if (el.classList.contains("view")) {
                let $pageNum = idx;

                measureCurrentIdx.textContent = $pageNum + 1;
            }
        });
        if (audio.paused || time == audioDuration) {
            audio.currentTime = 0;
            measureCurrentIdx.textContent = 1;
            isPlaying = false;
        }
        // 박자
        measuresLi.forEach((el, idx) => {
            if (el.dataset.stime <= musicChkTime && musicChkTime <= el.dataset.etime) {
                if (el.classList.contains("tBeat") && el.classList.contains("active")) {
                    el.click(() => {
                        return false
                    });
                }
            }
        });
        if (audio.loop) {
            if (audio.currentTime <= 0) {
                measuresLi.forEach((el, idx) => {
                    el.classList.remove("active");
                });
            }
        }
    }

    /**
     * 기본 상태
     */
    function calcRate() {
        let startVar = 0;
        let endVar = 0;
        measureArr.forEach((arr, idx) => {
            endVar = startVar;
            for (const el of arr) {
                endVar += el;
            }
            measureTimeObj[`section${idx}Start`] = startVar;
            measureTimeObj[`section${idx}End`] = endVar;
            measureTimeObj[`section${idx}RunningTime`] = (endVar - startVar);

            startVar = endVar;

            startTime.push(measureTimeObj[`section${idx}Start`] / audio.playbackRate);
            runningTime.push(measureTimeObj[`section${idx}RunningTime`] / audio.playbackRate);
            endTime.push(measureTimeObj[`section${idx}End`] / audio.playbackRate);
        });

        if (measuresData == 2) {
            startTime.map(function (sl, j) {
                if (j % 2) {
                    return sl;
                }
                groupStartTime.push(sl);
            });
            endTime.map(function (el, k) {
                if (k % 2 == 0) {
                    return el;
                }
                groupEndTime.push(el);
            });
        }
    }
    calcRate();

    /**
     * 프로그레스바
     */
    function btnProgressbarHandler() {
        progressbarPer = btnProgressbar.value;
        adjustedDuration = audioDuration / audio.playbackRate;
        let newCurrentTime = (progressbarPer / 100) * adjustedDuration;

        audio.currentTime = newCurrentTime * audio.playbackRate;

        if (audio.paused) {
            /* audio.play();
            isPlaying = true;
            btnPlay.classList.add("active"); */
            $(document).find(".btn-music-play").trigger("click");
        }

        measuresLi.forEach((el, idx) => {
            el.classList.remove("active");

            if (el.classList.contains("tBeat")) {
                el.setAttribute("onclick", `beat${el.dataset.beat}.play(); this.onclick=null;`);
            }
        });
    }

    // 카운트다운
    setInterval(() => {
        if (audio.currentTime <= 0.1) {
            countNum = 5;
        }
        if (isPlaying && audio.currentTime <= 2) {
            ++countVar;
            if (countVar % Math.floor(100 / audio.playbackRate) == 0) {
                countDown.dataset.countDown = --countNum;
            }
        } else if (audio.currentTime >= 3) {
            countDown.dataset.countDown = 5;
        }

        if (isPlaying) {
            music(audio.currentTime);
        } else {
            btnPlay.classList.remove("active");
        }

        if (measureCurrentIdx.textContent <= 1) {
            btnPrev.classList.add("disabled");
        } else {
            btnPrev.classList.remove("disabled");
        }
        if (measureCurrentIdx.textContent >= totalMeasure) {
            btnNext.classList.add("disabled");
        } else {
            btnNext.classList.remove("disabled");
        }
    }, 0);

    /**
     * 오디오 상태 관리
     */
    function audioTimeupdate(time) {
        let audioTimeChk = time;
        adjustedCurTime = audioTimeChk / audio.playbackRate;
        adjustedDuration = audioDuration / audio.playbackRate;
        progressbarPer = (adjustedCurTime / adjustedDuration) * 100;

        btnProgressbar.value = progressbarPer;

        if (currentMeasure >= totalMeasure - 1) {
            btnNext.classList.add("disabled");
        } else {
            btnNext.classList.remove("disabled");
        }

        if (audioTimeChk == audioDuration) {
            console.log(1111);
        }

        if (audio.loop && audio.currentTime >= adjustedDuration) {
            isPlaying = true;
            measuresLi.forEach((el, idx) => {
                el.classList.remove("active");
            });
        }
    }

    /**
     * 이전 소절
     */
    function btnPrevHandler() {
        currentMeasure = Number(measureCurrentIdx.textContent) - 1;

        if (currentMeasure >= 1) {
            --currentMeasure;
            measurePauseTime = false;
            measureCurrentIdx.textContent = currentMeasure + 1;

            if (currentMeasure <= 0) {
                btnPrev.classList.add("disabled");
            } else {
                btnPrev.classList.remove("disabled");
            }

            audioLoopStart = measureTimeObj[`section${currentMeasure}Start`];
            audioLoopRunning = measureTimeObj[`section${currentMeasure}RunningTime`];
            audioLoopEnd = measureTimeObj[`section${currentMeasure}End`];

            audio.currentTime = audioLoopStart;

            measuresLi.forEach((el, idx) => {
                el.classList.remove("active");

                if (el.classList.contains("tBeat")) {
                    el.setAttribute("onclick", `beat${el.dataset.beat}.play(); this.onclick=null;`);
                }
            });
            showCurrentLyrics(currentMeasure);
        }
    }
    /**
     * 다음 소절
    */
    function btnNextHandler() {
        currentMeasure = Number(measureCurrentIdx.textContent) - 1;

        if (currentMeasure < totalMeasure - 1) {
            ++currentMeasure;
            measurePauseTime = false;
            measureCurrentIdx.textContent = currentMeasure + 1;

            if (currentMeasure >= totalMeasure - 1) {
                btnNext.classList.add("disabled");
            } else {
                btnNext.classList.remove("disabled");
            }

            audioLoopStart = measureTimeObj[`section${currentMeasure}Start`];
            audioLoopRunning = measureTimeObj[`section${currentMeasure}RunningTime`];
            audioLoopEnd = measureTimeObj[`section${currentMeasure}End`];

            audio.currentTime = audioLoopStart;

            measuresLi.forEach((el, idx) => {
                el.classList.remove("active");

                if (el.classList.contains("tBeat")) {
                    el.setAttribute("onclick", `beat${el.dataset.beat}.play(); this.onclick=null;`);
                }
            });
            showCurrentLyrics(currentMeasure);
        }
    }

    /**
     * 기본 속도
    */
    function btnSpeedDefaultHandler() {
        isSpeed = "default";
        audio.playbackRate = 1;
    }

    /**
     * 속도 빠르게
    */
    function btnSpeedFastHandler() {
        isSpeed = "fast";
        audio.playbackRate = 1.3;
    }

    /**
     * 속도 느리게
    */
    function btnSpeedSlowHandler() {
        isSpeed = "slow";
        audio.playbackRate = 0.7;
    }

    /**
     * 노래 듣기
    */
    function btnPlayAllHandler() {
        isMr = "ar";
        currentMeasure = 0;
        measureCurrentIdx.textContent = currentMeasure + 1;
        audio.currentTime = 0;
        audio.loop = false;
        btnInfinite.classList.remove("active");
        btnPlay.classList.remove("active");

        audioLoopStart = 0;
        audioLoopEnd = audioDuration;

        audioTimeupdate(audio.currentTime);
        audio.pause();
        isPlaying = false;

        audio.setAttribute("src", "../../media/proto_ton_005/ar.mp3");

        measuresLi.forEach((el, idx) => {
            el.classList.remove("active");

            if (el.classList.contains("tBeat")) {
                el.setAttribute("onclick", `beat${el.dataset.beat}.play(); this.onclick=null;`);
            }
        });
        showCurrentLyrics(currentMeasure);
    }

    /**
     * 반주 듣기
    */
    function btnPlayMeasureHandler() {
        isMr = "mr";
        currentMeasure = 0;
        measureCurrentIdx.textContent = currentMeasure + 1;
        audio.currentTime = 0;
        audio.loop = false;
        btnInfinite.classList.remove("active");
        btnPlay.classList.remove("active");

        audioLoopStart = 0;
        audioLoopEnd = audioDuration;

        audioTimeupdate(audio.currentTime);
        audio.pause();
        isPlaying = false;

        audio.setAttribute("src", "../../media/proto_ton_005/mr.mp3");

        measuresLi.forEach((el, idx) => {
            el.classList.remove("active");

            if (el.classList.contains("tBeat")) {
                el.setAttribute("onclick", `beat${el.dataset.beat}.play(); this.onclick=null;`);
            }
        });
        showCurrentLyrics(currentMeasure);
    }

    /**
     * 음 내리기
    */
    function btnPitchDownHandler() {
        btnPitchUp.classList.remove("active");
        if (isPlaying) {
            if (this.classList.contains("active")) {
                this.classList.remove("active");
                audio.pause();
                const stopTime = audio.currentTime;
                audio.setAttribute("src", `../../media/proto_ton_005/${isMr}.mp3`);
                audio.currentTime = stopTime;

                audio.play();
            } else {
                this.classList.add("active");
                audio.pause();
                const stopTime = audio.currentTime;
                audio.setAttribute("src", `../../media/proto_ton_005/${isMr}_down.mp3`);
                audio.currentTime = stopTime;

                audio.play();
            }
        } else {
            if (this.classList.contains("active")) {
                this.classList.remove("active");
                const stopTime = audio.currentTime;
                audio.setAttribute("src", `../../media/proto_ton_005/${isMr}.mp3`);
                audio.currentTime = stopTime;
            } else {
                this.classList.add("active");
                const stopTime = audio.currentTime;
                audio.setAttribute("src", `../../media/proto_ton_005/${isMr}_down.mp3`);
                audio.currentTime = stopTime;
            }
        }

        if (isSpeed == "fast") {
            audio.playbackRate = 1.3;
        } else if (isSpeed == "slow") {
            audio.playbackRate = 0.7;
        } else {
            audio.playbackRate = 1;
        }
    }

    /**
     * 음 올리기
     */
    function btnPitchUpHandler() {
        btnPitchDown.classList.remove("active");
        if (isPlaying) {
            if (this.classList.contains("active")) {
                this.classList.remove("active");
                audio.pause();
                const stopTime = audio.currentTime;
                audio.src = `../../media/proto_ton_005/${isMr}.mp3`;
                audio.currentTime = stopTime;
                audio.play();
            } else {
                this.classList.add("active");
                audio.pause();
                const stopTime = audio.currentTime;
                audio.src = `../../media/proto_ton_005/${isMr}_up.mp3`;
                audio.currentTime = stopTime;
                audio.play();
            }
        } else {
            if (this.classList.contains("active")) {
                this.classList.remove("active");
                const stopTime = audio.currentTime;
                audio.src = `../../media/proto_ton_005/${isMr}.mp3`;
                audio.currentTime = stopTime;
            } else {
                this.classList.add("active");
                const stopTime = audio.currentTime;
                audio.src = `../../media/proto_ton_005/${isMr}_up.mp3`;
                audio.currentTime = stopTime;
            }
        }

        if (isSpeed == "fast") {
            audio.playbackRate = 1.3;
        } else if (isSpeed == "slow") {
            audio.playbackRate = 0.7;
        } else {
            audio.playbackRate = 1;
        }
    }

    /**
     * 반복재생
     */
    function btnInfiniteHandler() {
        if (this.classList.contains("active")) {
            this.classList.remove("active");
            audio.loop = false;
        } else {
            this.classList.add("active");
            audio.loop = true;
        }

        measuresLi.forEach((el, idx) => {
            el.classList.remove("active");

            if (el.classList.contains("tBeat")) {
                el.setAttribute("onclick", `beat${el.dataset.beat}.play(); this.onclick=null;`);
            }
        });
    }

    /**
     * 리셋
     */
    function btnResetHandler() {
        isPlaying = false;
        audio.pause();
        audio.currentTime = 0;
        btnProgressbar.value = 0;
        measurePauseTime = false;
        audio.loop = false;
        btnInfinite.classList.remove("active");
        btnPlay.classList.remove("active");
        currentMeasure = 0;
        measureCurrentIdx.textContent = currentMeasure + 1;

        measuresLi.forEach((el, idx) => {
            el.classList.remove("active");

            if (el.classList.contains("tBeat")) {
                el.setAttribute("onclick", `beat${el.dataset.beat}.play(); this.onclick=null;`);
            }
        });
        showCurrentLyrics(currentMeasure);
    }

    /**
     * 플레이 & 정지
     */
    function btnPlayHandler() {
        measuresLi.forEach((el, idx) => {
            el.classList.remove("active");

            if (el.classList.contains("tBeat")) {
                el.setAttribute("onclick", `beat${el.dataset.beat}.play(); this.onclick=null;`);
            }
        });

        audioLoopEnd = measureTimeObj[`section${measureTotal.textContent - 1}End`];
        audioTimeupdate(audio.currentTim);

        if (audio.paused) {
            audio.play();
            audio.addEventListener("timeupdate", e => {
                if (audio.currentTime >= audioLoopEnd) {
                    if (audio.loop) {
                        measuresLi.forEach((el, idx) => {

                            if (el.classList.contains("tBeat")) {
                                el.setAttribute("onclick", `beat${el.dataset.beat}.play(); this.onclick=null;`);
                            }
                        });
                        audio.play();
                    } else {
                        currentMeasure = 0;
                        audio.currentTime = 0;
                        measureCurrentIdx.textContent = currentMeasure + 1;
                        btnProgressbar.value = 0;
                        isPlaying = false;
                        showCurrentLyrics(currentMeasure);
                        audio.pause();
                    }
                }
            }, false);

            isPlaying = true;
            this.classList.add("active");
        } else {
            audio.pause();
            isPlaying = false;
            this.classList.remove("active");
        }
    }

    /**
     * 드롭다운 off, 텍스트 교체
     */
    function dropdownBtnsHandler() {
        this.closest(".dropdown").querySelector(".label").textContent = this.textContent;
    }

    /**
     * 드롭다운 on
     */
    function btnDropdownHandler() {
        efSound("./media/click.mp3")
        if (this.classList.contains("on")) {
            this.classList.remove("on");
        } else {
            this.classList.add("on");
        }
    }

    let audioObj = {};

    function efSound(src) {
        var efAudio = new Audio();
        var efPlay = function () {
            efAudio.removeEventListener('loadeddata', efPlay);
            efAudio.play();
            audioObj.playingObj = efAudio;
        };
        efAudio.src = src;
        efAudio.addEventListener('loadeddata', efPlay);
        efAudio.load();
    }
});