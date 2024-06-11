// ******************************************************************************
// media control
var mediaContainer = document.querySelectorAll('.mediaContainer');

// function mediaControlFn(){
//     for(var i = 0; i < mediaContainer.length; i++){
//         var type = mediaContainer[i].getAttribute('data-type');

//         if(type == 'vdo') {
//             mediaContainer[i].innerHTML += '<video class="mediafile" preload="auto"><source src="'+ fileSrc.folder + fileSrc.name[i] + '.mp4" type="video/mp4"></video>';
//         } else {
//             mediaContainer[i].innerHTML += '<audio class="mediafile"><source src="'+ fileSrc.folder + fileSrc.name[i] + '.mp3" type="audio/mpeg"></audio>';
//         }

//         var mediaControl = document.createElement('div');
//         mediaControl.className = 'mediaControl';
//         mediaContainer[i].appendChild(mediaControl);

//         var progress = document.createElement('div');
//         progress.className = 'progress';
//         progress.innerHTML ='<div class="progressBar"><input class="playBar playBar_'+(i+1)+'" type="range" min="0" max="100" value="0" step="1" /></div>';
//         mediaControl.appendChild(progress);

//         var curTime = document.createElement('div');
//         curTime.className = 'curTime';
//         mediaControl.appendChild(curTime);

//         var durTime = document.createElement('div');
//         durTime.className = 'durTime';
//         mediaControl.appendChild(durTime);

//         var mediaBtn = document.createElement('div');
//         mediaBtn.className = 'mediaBtn';
//         mediaBtn.innerHTML += '<div class="play"></div>';
//         mediaBtn.innerHTML += '<div class="stop"></div>';
//         mediaControl.appendChild(mediaBtn);

//         var playVolume = document.createElement('div');
//         playVolume.className = 'playVolume';
//         mediaControl.appendChild(playVolume);

//         var st = document.createElement('style');
//         st.className = 'splayBar';
//         document.head.appendChild(st);

//         mediaStart.start(mediaContainer[i]);

//         // input[type=range] : 스타일 시트 생성
//         var style = document.createElement('style');
//         document.head.appendChild(style);
//     }

//     	var str = '';

//     // input[type=range] : 브라우저 체크 및 스타일 적용
//     if(navigator.userAgent.indexOf('Edge') >= 0) {

//         str = 'input[type=range]::-webkit-slider-thumb {margin-bottom:-8px; -webkit-appearance:none;border:none;width:32px;height:32px;border-radius:50%;border: 2px solid #7d5811;box-shadow:2px 2px 4px rgba(0, 0, 0, 0.6);background: #fff url(../../include/images/audioControls/cursor.png); background-size: 100% 100%;margin-top:-8px;z-index:1000;}'

//         style.innerHTML = str;

//     }else {
//         var agent = navigator.userAgent.toLowerCase();
//         if(navigator.userAgent.indexOf('Chrome') != -1 ) {

//         }else if((navigator.appName == 'Netscape' && agent.indexOf('trident') != -1) || (agent.indexOf('msie') != -1)) {

//         }
//     }
// }

var mediaStart = {
  start: function (target) {
    return this.btn({
      target: target,
      media: target.querySelector('.mediafile'),
      mediaIdx: Array.prototype.indexOf.call(mediaContainer, target),
      play: target.querySelector('.play'),
      stop: target.querySelector('.stop'),
      curTime: target.querySelector('.curTime'),
      durTime: target.querySelector('.durTime'),
      playBar: target.querySelector('.playBar'),
      progressBar: target.querySelector('.progressBar'),
      stateCont: false,
      blockSeek: false,
    });
  },

  btn: function (obj) {
    var _this = this;
    obj.playBar.style.pointerEvents = 'auto';

    obj.play.addEventListener('mousedown', function () {
      efSound('./media/click.mp3');
      if (obj.play.classList.contains('show')) {
        obj.play.classList.remove('show');
        obj.media.pause();
        obj.stateCont = false;
      } else {
        obj.play.classList.add('show');
        obj.media.play();
        obj.stateCont = true;
      }
    });

    obj.stop.addEventListener('mousedown', function (e) {
      e.preventDefault();
      efSound('./media/click.mp3');
      if (obj.media.currentTime > 0) {
        obj.media.currentTime = 0;
      }
      obj.media.pause();
      obj.play.classList.remove('show');
      obj.stateCont = false;
    });

    obj.media.addEventListener(
      'loadedmetadata',
      function () {
        obj.curTime.innerHTML = _this.timeFormat(obj.media.currentTime) + ' / ';
        obj.durTime.innerHTML = _this.timeFormat(obj.media.duration);

        _this.ondurationchange(obj);
        obj.playBar.max = Math.round(obj.media.duration);
      },
      false
    );

    obj.media.addEventListener(
      'emptied',
      function () {
        _this.ondurationchange(obj);
      },
      false
    );

    obj.media.addEventListener(
      'timeupdate',
      function () {
        console.log('timeupdate');
        _this.onTimeUpdate(obj);
      },
      false
    );

    obj.media.addEventListener(
      'durationchange',
      function () {
        console.log('durationchange');
        _this.ondurationchange(obj);
        _this.onTimeUpdate(obj);
      },
      false
    );

    obj.playBar.addEventListener('mousedown', function () {
      _this.onSeek(this.value, obj);
    });

    obj.playBar.addEventListener(
      'change',
      function () {
        _this.onSeekRelease(this.value, obj);
        _this.controlSliders(obj);
      },
      false
    );

    obj.playBar.addEventListener('input', function () {
      _this.controlSliders(obj);
    });

    if (QSAll('.listenContainer').length > 0) {
      mediaStart.changeSound(obj);
    }
  },
  ondurationchange: function (obj) {
    if (obj.media.duration && !isNaN(obj.media.duration)) {
      if (obj.playBar) {
        obj.playBar.max = obj.media.duration;
        obj.playBar.disabled = false;
      } else {
        if (obj.playBar) obj.playBar.disabled = true;
      }
    }
  },
  onTimeUpdate: function (obj) {
    var syncWrap = document.querySelector('.syncWrap_' + (obj.mediaIdx + 1));
    var _this = this;

    /*	obj.playBar.style.width = 100 * (obj.media.currentTime / obj.media.duration) + '%';	*/
    if (!obj.blockSeek) {
      obj.playBar.value = obj.media.currentTime;
    }
    /*obj.playTime.innerHTML = '<span>'+  _this.timeFormat(obj.media.currentTime) + '</span> / <span>'
                                +  _this.timeFormat(obj.media.duration) + '</span>';*/
    obj.curTime.innerHTML = _this.timeFormat(obj.media.currentTime) + ' / ';
    obj.durTime.innerHTML = _this.timeFormat(obj.media.duration);

    var curT = Math.ceil(obj.media.currentTime * 1000) * 0.01;
    var durT = Math.ceil(obj.media.duration * 1000) * 0.01;

    if (Math.ceil(curT) == Math.ceil(durT)) {
      obj.play.classList.remove('show');
      obj.playBar.value = 0;
      obj.media.pause();
      obj.media.currentTime = 0;
    }

    if (syncWrap !== null) {
      _this.syncControl(obj.media, syncWrap, obj.mediaIdx + 1);
    }

    _this.controlSliders(obj);
  },

  controlSliders: function (obj) {
    var tracks = ['-webkit-slider-runnable-track'];

    var gradValue = Math.round(
      (obj.playBar.value / obj.playBar.getAttribute('max')) * 0.99 * 100
    );
    var grad =
      obj.target.getAttribute('data-type') == 'vdo'
        ? 'linear-gradient(90deg, #E94D40 ' +
          gradValue +
          '%, #c77321 ' +
          (gradValue + 0.99) +
          '%)'
        : 'linear-gradient(90deg, #E94D40 ' +
          gradValue +
          '%, #999999 ' +
          (gradValue + 0.99) +
          '%)';

    var styleString = '';

    for (var j = 0; j < tracks.length; j++) {
      styleString +=
        '.playBar.' +
        obj.playBar.classList[1] +
        '::' +
        tracks[j] +
        ' { background: ' +
        grad +
        '; }';
    }

    if (gradValue == 0) {
      styleString = '';
    }
    document.getElementsByClassName('splayBar')[
      obj.playBar.classList[1].split('_')[1] - 1
    ].textContent = styleString;
  },

  timeFormat: function (seconds) {
    var m =
      Math.floor(seconds / 60) < 10
        ? '0' + Math.floor(seconds / 60)
        : Math.floor(seconds / 60);
    var s =
      Math.floor(seconds - m * 60) < 10
        ? '0' + Math.floor(seconds - m * 60)
        : Math.floor(seconds - m * 60);
    return m + ':' + s;
  },

  onSeek: function (mValue, obj) {
    window.requestAnimationFrame(function () {
      obj.media.currentTime = obj.playBar.value;
    });

    var isPlaying =
      obj.media.currentTime > 0 &&
      !obj.media.paused &&
      !obj.media.ended &&
      obj.media.readyState > 2;

    if (!obj.blockSeek) {
      if (isPlaying) {
        obj.media.pause();
        obj.blockSeek = true;
      }
    }
  },

  onSeekRelease: function (mValue, obj) {
    window.requestAnimationFrame(function () {
      obj.media.currentTime = obj.playBar.value;
    });

    var isPlaying =
      obj.media.currentTime > 0 &&
      !obj.media.paused &&
      !obj.media.ended &&
      obj.media.readyState > 2;

    if (obj.blockSeek) {
      if (!isPlaying) {
        setTimeout(function () {
          obj.media.play();
        }, 150);
      }
    }
    obj.blockSeek = false;
  },

  syncControl: function (mediaFile, syncWrap, idx) {
    var sync = syncWrap.querySelectorAll('.sync'),
      syncSplit = syncWrap.querySelectorAll('.syncSplit'),
      curt = Number(mediaFile.currentTime).toFixed(3),
      numflag = isNaN(syncArray[idx][0]);

    for (var j = 0; j < syncArray[idx].length; j++) {
      var start,
        end,
        syncE = sync[j];
      if (numflag) {
        start = syncArray[idx][j].start;
        end = syncArray[idx][j].end;
      } else {
        start = syncArray[idx][j];
        end =
          syncArray[idx][j + 1] !== undefined
            ? syncArray[idx][j + 1]
            : mediaFile.duration;
      }

      if (start <= curt && curt < end) {
        if (syncWrap.getAttribute('data-type') == 'all') {
          for (var i = 0; i < sync.length; i++) {
            sync[i].classList.remove('active');
          }

          for (var i = 0; i < j + 1; i++) {
            sync[i].classList.add('active');
          }
        } else if (syncWrap.getAttribute('data-type') !== 'all') {
          for (var i = 0; i < sync.length; i++) {
            sync[i].classList.remove('active');
          }
        }

        if (syncSplit.length > 0) {
          for (var i = 0; i < syncSplit.length; i++) {
            var inSync = syncSplit[i].querySelectorAll('.sync');
            syncSplit[i].classList.remove('view');

            for (var k = 0; k < inSync.length; k++) {
              if (inSync[k] == syncE) {
                syncSplit[i].classList.add('view');
              }
            }
          }
          //syncE.parentNode.classList.add('view');
        }

        syncE.classList.add('active');
      } else if (start > curt || curt >= end) {
        syncE.classList.remove('active');
      } else if (curt == 0) {
        for (var i = 0; i < sync.length; i++) {
          sync[i].classList.remove('active');

          if (sync[i].classList.contains('first')) {
            sync[i].classList.add('active');
          }
        }
      }

      if (QSAll('.poetPageNum').length > 0) {
        if (syncWrap.classList.contains('poet')) {
          this.syncPage(syncWrap, sync, idx);
        }
      }
    }
  },
  syncPage: function (syncWrap, sync, idx) {
    var poetBox = QSAll('.poetContainer');
    for (var i = 0; i < poetBox.length; i++) {
      if (poetBox[i].querySelector('.poetPageNum') !== null) {
        var pageNum = poetBox[i].querySelector('.poetPageNum');
        for (var j = 0; j < sync.length; j++) {
          if (sync[j].classList.contains('active')) {
            pageNum.innerHTML =
              '<span>' +
              (j + 1) +
              '</span>/<span>' +
              syncWrap.querySelectorAll('.syncSplit').length +
              '</span>';
          }
        }
      }
    }
  },
  changeSound: function (obj) {
    var listenContainer = QSAll('.listenContainer'),
      syncWrap = document.querySelector('.syncWrap_' + (obj.mediaIdx + 1));

    for (var i = 0; i < listenContainer.length; i++) {
      var btn_song = listenContainer[i].querySelector('.songBtn'),
        btn_rhythm = listenContainer[i].querySelector('.rhythmBtn');
      btn_song.classList.add('active');
      if (listenContainer[i].querySelector('.changeBtn') !== null) {
        var btn_change = listenContainer[i].querySelector('.changeBtn');

        btn_change.addEventListener('click', function () {
          efSound('./media/click.mp3');
          allSoundReset();

          obj.media.src = changeSrc.folder + changeSrc.file[1] + '.mp3';
          this.style.pointerEvents = 'none';
          this.classList.add('active');
          btn_rhythm.classList.remove('active');
          btn_song.classList.remove('active');

          setTimeout(function () {
            syncWrap.querySelector('.changeText').innerHTML =
              changeSrc.changetext;
          }, 300);
        });
      }

      btn_song.addEventListener('click', function () {
        efSound('./media/click.mp3');
        allSoundReset();
        obj.media.src = changeSrc.folder + changeSrc.file[0] + '.mp3';
        this.classList.add('active');
        btn_rhythm.classList.remove('active');
        if (btn_change !== undefined) {
          btn_change.style.pointerEvents = 'auto';
          btn_change.classList.remove('active');

          setTimeout(function () {
            syncWrap.querySelector('.changeText').innerHTML =
              changeSrc.original;
          }, 300);
        }
      });
      btn_rhythm.addEventListener('click', function () {
        efSound('./media/click.mp3');
        allSoundReset();
        obj.media.src = changeSrc.folder + changeSrc.file[1] + '.mp3';
        this.classList.add('active');
        btn_song.classList.remove('active');

        if (btn_change !== undefined) {
          btn_change.classList.remove('active');
          btn_change.style.pointerEvents = 'auto';
        }
      });
    }
  },
};

// 음원 재생 버튼
function btnSoundplay() {
  var btnSounds = document.getElementsByClassName('btnSound');
  var btnSound = null;
  var soundIdx = null;
  var btnSndContainer = null;
  var sourceStr = '';
  var i = 0;

  for (i = 0; i < btnSounds.length; i++) {
    btnSound = btnSounds[i];
    soundIdx = btnSound.getAttribute('data-idx') - 1;
    btnSndContainer = createElement('audio', btnSound, 'btnSndContainer');
    sourceStr = '';

    btnSound.classList.add('play');

    sourceStr +=
      '<source src="' +
      btnSndInfo.adofolder +
      btnSndInfo.btnAudio[soundIdx] +
      '.mp3" type="audio/mpeg"></source>';
    btnSndContainer.innerHTML = sourceStr;

    btnSound.addEventListener('mousedown', startSound);
    btnSound
      .querySelector('audio')
      .addEventListener('timeupdate', checkTimeUpdate);
  }

  function checkTimeUpdate() {
    if (this.currentTime === this.duration) {
      this.parentNode.classList.add('play');
      this.parentNode.classList.remove('pause');
      $('.char').removeClass('gif');
    }
  }

  function startSound() {
    efSound('media/tab_click.mp3');
    if (this.classList.contains('play')) {
      for (i = 0; i < btnSounds.length; i++) {
        if (btnSounds[i].classList.contains('pause')) {
          btnSoundReset();
        }
      }
      this.classList.remove('play');
      this.classList.add('pause');
      this.querySelector('audio').play();
      $('.char').addClass('gif');
    } else {
      this.classList.add('play');
      this.classList.remove('pause');
      this.querySelector('audio').pause();
      $('.char').removeClass('gif');
    }
  }
}

function btnSoundReset() {
  var btnSounds = document.querySelectorAll('.btnSound');
  var btnSound = null;
  for (var i = 0; i < btnSounds.length; i++) {
    btnSound = btnSounds[i];
    btnSound.querySelector('audio').currentTime = 0;
    btnSound.querySelector('audio').pause();
    btnSound.classList.add('play');
    btnSound.classList.remove('pause');
  }
  $('.char').removeClass('gif');
}
