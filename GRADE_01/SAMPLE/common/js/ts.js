'use strict';

(function () {
  //////////////////////
  // DOM 생성 및 제거 //
  //////////////////////

  // createElement
  /*
  * name: ce,
  * description: HTML element 만드는 함수,
  * arguments:
  opts = {
      tag: 태그명 (type: string) (ex. "div"),
      id: id (type: string) (ex. "myId"),
      class: 부여할 클래스(들) (type: string) (ex. "class1 class2"),
      parent: append 될 부모 element (type: HTMLelement) (ex. document.getElementById("parentDiv")),
      attr: 속성들 (type: object) (ex. { src: "myImg.png", type: "text/css" }),
      insertBeforeRefEl: insertBefore 시 기준이 될 element (type: HTMLelement) (ex. document.getElementById("refDiv"))
  }
  */
  function ce(opts) {
    var element, classArray, classArrayLen;

    element = document.createElement(opts.tag);
    if (opts.id) element.setAttribute('id', opts.id);
    if (opts.class) {
      if (opts.class.indexOf(' ') > -1) {
        classArray = opts.class.split(' ');
        classArrayLen = classArray.length;
        for (var i = 0; i < classArrayLen; i++) {
          element.classList.add(classArray[i]);
        }
      } else {
        element.classList.add(opts.class);
      }
    }
    if (opts.parent) opts.parent.appendChild(element);
    if (opts.width) element.style.width = opts.width + 'px';
    if (opts.height) element.style.height = opts.height + 'px';
    if (opts.attr) {
      for (var attrName in opts.attr) {
        element.setAttribute(attrName, opts.attr[attrName]);
      }
    }
    if (opts.parent && opts.insertBeforeRefEl)
      opts.parent.insertBefore(element, opts.insertBeforeRefEl);
    return element;
  }

  // create svg element
  function ceSvg(tag, parent) {
    var svgElement = document.createElementNS(
      'http://www.w3.org/2000/svg',
      tag
    );
    if (parent) parent.appendChild(svgElement);
    return svgElement;
  }

  // remove element
  function re(element) {
    if (element) element.parentNode.removeChild(element);
  }

  // script file 로드
  function loadScriptFile(scriptSrc, callBack) {
    var script = document.createElement('script');
    script.src = scriptSrc;

    if (callBack) {
      script.onload = function (object) {
        callBack(object);
      };
    }
    document.body.appendChild(script);
  }

  // css file 로드
  function loadCssFile(cssSrc, callBack) {
    var css = document.createElement('link');
    css.setAttribute('rel', 'stylesheet');
    css.setAttribute('type', 'text/css');
    css.setAttribute('href', cssSrc);

    if (callBack) {
      css.onload = function () {
        callBack();
      };
    }
    document.head.appendChild(css);
  }

  ////////////////////////
  // DOM 선택(selector) //
  ////////////////////////

  // getElement(s)
  /*
  * name: getEl,
  * description: getElementById && getElementsByTagName && getElementsByClassName 합쳐놓은 함수,
  * arguments:
  [selector, parent]
  - selector: id인 경우 '#id', tag인 경우 'tagName', class인 경우 'className1 className2 ...'
  - parent: (optional) 부모 element, default: document
  */
  function getEl(selector) {
    var parentElement =
        arguments.length > 1 && arguments[1] !== undefined
          ? arguments[1]
          : document,
      index =
        arguments.length > 2 && arguments[2] !== undefined
          ? arguments[2]
          : null,
      result,
      len;

    if (typeof selector === 'string') {
      if (
        selector.indexOf(' ') > -1 ||
        selector.indexOf('>') > -1 ||
        selector.indexOf('[') > -1 ||
        selector.indexOf(']') > -1 ||
        selector.indexOf('.') > 0
      ) {
        result = qs(selector, parentElement, index);
        if (result == null) return;
      } else if (selector.indexOf('#') > -1) {
        result = parentElement.getElementById(
          selector.slice(1, selector.length)
        );
        index = null;
      } else if (selector.indexOf('.') > -1) {
        var classNameArray = selector.split('.');
        if (classNameArray.length === 1) {
          result = parentElement.getElementsByClassName(classNameArray[0]);
        } else {
          result = parentElement.getElementsByClassName(
            classNameArray.join(' ')
          );
        }
      } else {
        result = parentElement.getElementsByTagName(selector);
      }
    } else {
      console.error('$ts.getEl: ' + selector + '가 string이 아닙니다.');
      return;
    }

    if (result == null) {
      console.error('$ts.getEl: query에 해당하는 element 없음');
      return;
    } else {
      len = result.length;
      if (len) {
        var array = [];
        for (var i = 0; i < len; i++) {
          array.push(result[i]);
        }
        result = array;
      }

      return index || index === 0 ? result[index] : result;
    }
  }

  // querySelector & querySelectorAll
  function qs(query) {
    var parent =
        arguments.length > 1 && arguments[1] !== undefined
          ? arguments[1]
          : document,
      index =
        arguments.length > 2 && arguments[2] !== undefined
          ? arguments[2]
          : null,
      result = parent.querySelectorAll(query),
      len = result.length,
      array = [];

    switch (len) {
      case 0:
        /*console.error('$ts.qs: '+ query +'에 해당하는 element 없음');*/ result = null;
        break;
      // case 1 : result = result[0]; break;
      default:
        for (var i = 0; i < len; i++) array.push(result[i]);
        result = array;
        break;
    }

    // return (index || index === 0) ? result[index] : result;
    return result;
  }

  ///////////////////
  // DOM 속성 제어 //
  ///////////////////

  // class 추가
  function addClass(target, className) {
    className = className.split(' ');
    var len = className.length;

    if (!target) {
      console.error('$ts.addClass: target이 없습니다.');
    } else if (!target.length) {
      target = [target];
    }

    if (len === 0) {
      console.error('$ts.addClass: className이 없습니다.');
    } else {
      for (var j = 0; j < target.length; j++) {
        for (var i = 0; i < className.length; i++)
          target[j].classList.add(className[i]);
      }
    }
  }

  // class 제거
  function removeClass(target, className) {
    className = className.split(' ');
    var len = className.length;

    if (!target) {
      console.error('$ts.removeClass: target이 없습니다.');
    } else if (!target.length) {
      target = [target];
    }

    if (len === 0) {
      console.error('$ts.removeClass: className이 없습니다.');
    } else {
      for (var j = 0; j < target.length; j++) {
        for (var i = 0; i < className.length; i++)
          target[j].classList.remove(className[i]);
      }
    }
  }

  // class 판단
  function hasClass(target, className) {
    return target.classList.contains(className);
  }

  // inline style 추가
  function setStyles(target, styles) {
    for (var prop in styles) {
      target.style[prop] = styles[prop];
    }
  }

  //////////////
  // DOM 판단 //
  //////////////

  // document 또는 parent에 query에 해당하는 element가 있는가?
  function isThere(query) {
    var parent =
      arguments.length > 1 && arguments[1] !== undefined
        ? arguments[1]
        : document;

    return !!this.qs(query, parent);
  }

  // object가 빈 값인가?
  function isEmpty(object) {
    return (
      object === undefined ||
      object === null ||
      object.length === 0 ||
      Number.isNaN(object)
    );
  }

  ////////////////
  // DOM 이벤트 //
  ////////////////

  // down 이벤트 추가하기
  function addDownEvents(target, opts) {
    var className = opts && opts.className ? opts.className : 'clicked',
      addClass = this.addClass ? this.addClass : addClass,
      removeClass = this.removeClass ? this.removeClass : removeClass;

    function addEvent(eType, classType) {
      target.addEventListener(
        eType,
        function (e) {
          if (opts && opts.preventDefault) e.preventDefault();

          if (classType === 'add') {
            addClass(target, className);
            if (opts && opts.addCallback) opts.addCallback(target);
          } else {
            removeClass(target, className);
            if (opts && opts.removeCallback) opts.removeCallback(target);
          }
        },
        false
      );
    }

    addEvent('mousedown', 'add');
    addEvent('touchstart', 'add');
    addEvent('mouseleave', 'remove');
    addEvent('touchcancel', 'remove');
    addEvent('mouseup', 'remove');
    addEvent('touchend', 'remove');
  }

  // hover 이벤트 추가하기
  function addHoverEvents(target, opts) {
    var className = opts && opts.className ? opts.className : 'hover',
      addClass = this.addClass ? this.addClass : addClass,
      removeClass = this.removeClass ? this.removeClass : removeClass,
      isTouchDevice =
        'ontouchstart' in window ||
        (window.DocumentTouch && document instanceof DocumentTouch);

    function addEvent(eType, classType) {
      target.addEventListener(
        eType,
        function (e) {
          if (opts && opts.preventDefault) e.preventDefault();

          // 터치 디바이스에서 마우스 이벤트 실행 안함
          if (isTouchDevice && e.type == 'mouseover') return;

          if (classType === 'add') {
            addClass(target, className);
            if (opts && opts.addCallback) opts.addCallback(target);
          } else {
            removeClass(target, className);
            if (opts && opts.removeCallback) opts.removeCallback(target);
          }
        },
        false
      );
    }

    // addEvent('mouseenter', 'add');
    addEvent('mouseover', 'add');
    addEvent('touchstart', 'add');
    // addEvent('mouseleave', 'remove');
    addEvent('mouseout', 'remove');
    addEvent('touchend', 'remove');
  }

  // focus 이벤트 추가하기
  function addFocusEvents(target, opts) {
    var className = opts && opts.className ? opts.className : 'focused',
      addClass = this.addClass ? this.addClass : addClass,
      removeClass = this.removeClass ? this.removeClass : removeClass;

    function addEvent(eType, classType) {
      target.addEventListener(
        eType,
        function (e) {
          if (opts && opts.preventDefault) e.preventDefault();

          if (classType === 'add') {
            addClass(target, className);
            if (opts && opts.addCallback) opts.addCallback(target);
          } else {
            removeClass(target, className);
            if (opts && opts.removeCallback) opts.removeCallback(target);
          }
        },
        false
      );
    }

    addEvent('focus', 'add');
    addEvent('blur', 'remove');
  }

  //////////////
  // DOM ETC. //
  //////////////

  // getBoundingClineRect
  function getSize(target) {
    return target.getBoundingClientRect();
  }

  // getStyles
  function getStyles(target) {
    return window.getComputedStyle(target);
  }

  ///////////////////////////
  // number, array, string //
  ///////////////////////////

  // 천 단위마다 comma 찍는 함수
  function insertComma(text) {
    text = text.toString();
    var output = '';

    do {
      if (text.length % 3 != 0) {
        output += text.slice(0, text.length % 3) + ',';
        text = text.slice(text.length % 3, text.length);
      } else {
        output += text.slice(0, 3) + ',';
        text = text.slice(3, text.length);
      }
    } while (text.length >= 4);

    output += text;

    return output;
  }

  // 랜덤 숫자 만들기
  function getRandomNumber(max) {
    var min =
      arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    return Math.floor(Math.random() * max) + min;
  }

  // 랜덤 숫자 배열 만들기
  function makeRandomArray(min, length) {
    var randomNumber = 0,
      inspector = '',
      array = [];

    do {
      randomNumber = Math.floor(Math.random() * length) + min;
      if (inspector.indexOf(randomNumber) < 0) array.push(randomNumber);
      inspector += randomNumber.toString();
    } while (array.length !== length);

    return array;
  }

  // 배열 숫자 합치기
  function sumNumberArray(array) {
    return array.reduce(function (accumulator, currentValue) {
      return accumulator + currentValue;
    });
  }

  // array 순서 섞어주는 함수
  function stirArray(elements, length) {
    var numArray,
      newElements = [];
    numArray = length
      ? makeRandomArray(0, length)
      : makeRandomArray(0, elements.length);
    newElements = newElements.concat(elements);
    numArray.forEach(function (randomNumber, index) {
      newElements[index] = elements[randomNumber];
    });
    return newElements;
  }

  // 배열 여러 개 합치기
  function concatArrays(arrays) {
    var newArray = [];
    for (var i = 0; i < arrays.length; i++)
      newArray = newArray.concat(arrays[i]);
    return newArray;
  }

  ////////////////////////////////////////////
  // DOM 요소 target으로 만들어 method 활용 //
  ////////////////////////////////////////////

  function makeTarget(target) {
    var addClass = this.addClass,
      removeClass = this.removeClass,
      hasClass = this.hasClass,
      getSize = this.getSize,
      getStyles = this.getStyles;

    target.addClass = function (className) {
      addClass(target, className);
    };
    target.removeClass = function (className) {
      removeClass(target, className);
    };
    target.hasClass = function (className) {
      return hasClass(target, className);
    };

    Object.defineProperty(target, 'getSize', {
      get: function () {
        return getSize(target);
      },
    });
    Object.defineProperty(target, 'getStyles', {
      get: function () {
        return getStyles(target);
      },
    });

    return target;
  }

  ////////////////////////////////////
  // data(image, JSON 등) 제어 함수 //
  ////////////////////////////////////

  // load JSON
  function loadJSON(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType('application/json');
    rawFile.open('GET', file, true);
    rawFile.onreadystatechange = function () {
      if (rawFile.readyState === 4 && rawFile.status == '200') {
        callback(rawFile.responseText);
      }
    };
    rawFile.send(null);
  }

  window.$spriteCallBack = {};

  // img sprite (간단한)
  function imgSprite(target, imgArray, intervalTime, repeat) {
    this.target = target;
    this.imgArray = imgArray;
    this.intervalTime = intervalTime;
    this.repeat = repeat;
    this.len_imgArray = this.imgArray.length;
    this.imgSrcCnt = 0;
    this.intervalID = undefined;
    this.isWorking = false;

    this.start = function () {
      var self = this;

      if (this.isWorking) return;
      this.isWorking = true;

      this.intervalID = window.setInterval(function () {
        if (self.imgSrcCnt === self.len_imgArray) {
          self.imgSrcCnt = 0;
          if (self.repeat === null) self.stop();
        }
        self.changeSrc();

        self.imgSrcCnt++;
      }, self.intervalTime);
      if (window.$spriteCallBack && window.$spriteCallBack.play)
        window.$spriteCallBack.play(self);
    };

    this.changeSrc = function (index) {
      if (typeof index === 'number') {
        this.imgSrcCnt = index;
      }

      this.target.src = this.imgArray[this.imgSrcCnt].src;
    };

    this.stop = function () {
      if (!this.isWorking) return;

      window.clearInterval(this.intervalID);
      this.changeSrc(0);
      this.isWorking = false;

      if (window.$spriteCallBack && window.$spriteCallBack.stop)
        window.$spriteCallBack.stop(this);
    };
  }

  // img preload (간단한)
  function imgPreload(imgPath, imgCnt, fileType, callback) {
    var wrap,
      loadingContainer,
      preloadedImgsDiv,
      preloadedImgsArray,
      loadedCnt,
      imgTag,
      intervalID;

    wrap = $ts.getEl('#wrap');

    preloadedImgsDiv = $ts.getEl('#loadingContainer');
    preloadedImgsDiv.style.position = 'absolute';
    preloadedImgsDiv.style.top = '-1px';
    preloadedImgsDiv.style.left = '-1px';
    preloadedImgsDiv.style.width = '1px';
    preloadedImgsDiv.style.height = '1px';
    preloadedImgsDiv.style.overflow = 'hidden';

    preloadedImgsArray = [];

    loadedCnt = imgCnt;

    for (var i = 1; i <= imgCnt; i++) {
      imgTag = $ts.ce({ tag: 'img', parent: preloadedImgsDiv });

      imgTag.addEventListener('load', function (e) {
        loadedCnt--;
      });

      if (i < 10) {
        imgTag.src = imgPath + '/00' + i + '.' + fileType;
      } else if (i >= 100) {
        imgTag.src = imgPath + '/' + i + '.' + fileType;
      } else {
        imgTag.src = imgPath + '/0' + i + '.' + fileType;
      }

      preloadedImgsArray.push(imgTag);
    }

    intervalID = window.setInterval(function () {
      if (!loadedCnt) {
        window.clearInterval(intervalID);
        console.info('imgPreload: all imgs loaded...');
        if (callback) callback(preloadedImgsArray);

        window.$loadingData = false;
      } else {
        window.$loadingData = true;
        console.info('imgPreload: img is loading...');
      }
    });
  }

  // create audio
  var createAudio = (function () {
    return {
      set: function (src) {
        var audio = new Audio();
        audio.src = src;
        audio.load();
        return audio;
      },

      interval: function (req, callBack) {
        var ani;
        ani = setInterval(function () {
          if (req) {
            clearInterval(ani);
            if (callBack) callBack();
          }
        });
      },
    };
  })();
  // function  (src) {
  //     var audio = new Audio,
  //         source = document.createElement('source');

  //     audio.appendChild(source);

  //     source.src = src;
  //     audio.load();
  //     audio.preload = 'none';

  //     return audio;
  // }
  function mobileCheck() {
    let check = false;
    (function (a) {
      if (
        /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
          a
        ) ||
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
          a.substr(0, 4)
        )
      )
        check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
  }

  function mobileAndTabletCheck() {
    let check = false;
    (function (a) {
      if (
        /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
          a
        ) ||
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
          a.substr(0, 4)
        )
      )
        check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
  }

  var $ts = {
    // DOM 생성 및 제거
    ce: ce,
    ceSvg: ceSvg,
    re: re,
    loadScriptFile: loadScriptFile,
    loadCssFile: loadCssFile,

    // DOM 선택(selector)
    getEl: getEl,
    qs: qs,

    // DOM 속성 제어
    addClass: addClass,
    removeClass: removeClass,
    hasClass: hasClass,
    setStyles: setStyles,

    // DOM 판단
    isThere: isThere,
    isEmpty: isEmpty,

    // DOM 이벤트
    addDownEvents: addDownEvents,
    addHoverEvents: addHoverEvents,
    addFocusEvents: addFocusEvents,

    // DOM ETC.
    getSize: getSize,
    getStyles: getStyles,

    // number, array, string
    insertComma: insertComma,
    getRandomNumber: getRandomNumber,
    makeRandomArray: makeRandomArray,
    sumNumberArray: sumNumberArray,
    stirArray: stirArray,
    concatArrays: concatArrays,

    // DOM 요소 target으로 만들어 method 활용
    makeTarget: makeTarget,

    // data(image, JSON 등) 제어 함수
    loadJSON: loadJSON,
    imgSprite: imgSprite,
    imgPreload: imgPreload,

    // audio 생성
    createAudio: createAudio,

    isDevice: mobileCheck() || mobileAndTabletCheck(),

    get timeNow() {
      return new Date().getTime();
    },
  };

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = $ts;
  } else {
    window.$ts = $ts;
  }
  $ts.loadScriptFile('common/js/polyfills.js');
})();
