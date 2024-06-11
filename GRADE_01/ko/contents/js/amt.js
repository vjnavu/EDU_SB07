



// Universal Module Definition (UMD)
(function (global, factory) {
    typeof exports === "object" && typeof module !== "undefined"
        ? (module.exports = factory())
        : typeof define === "function" && define.amd
        ? define("amt", factory)
        : (function () {
              var current = global.amt;
              var exports = factory();
              global.amt = exports;
              exports.noConflict = function () {
                  global.amt = current;
                  return exports;
              };
          })();
})(this, function () {
    "use strict";

    
    console.log('amt');
    
    var amt = {};

    /**
     * Custom event 함수 등록
     */
    (function () {
        if (typeof window.CustomEvent === "function") {
            return false;
        }

        function CustomEvent(event, params) {
            params = params || { bubbles: false, cancelable: false, detail: undefined };
            var evt = document.createEvent("CustomEvent");
            evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
            return evt;
        }

        CustomEvent.prototype = window.Event.prototype;
        window.CustomEvent = CustomEvent;
    })();

    /**
     * Observer Pattern broadcast 등록
     */
    (function () {
        var listeners = {};
        var broadcaster = {};

        broadcaster.on = function (eventName, handler, context) {
            var array = listeners[eventName];
            if (array === undefined) {
                array = listeners[eventName] = [];
            }
            array.push({ handler: handler, context: context });
        };

        broadcaster.off = function (eventName, handler, context) {
            var array = listeners[eventName];
            if (array === undefined) {
                return;
            }
            for (var i = 0; i < array.length; ++i) {
                var listener = array[i];
                if (listener["handler"] === handler && listener["context"] === context) {
                    array.splice(i, 1);
                    return;
                }
            }
        };

        broadcaster.trigger = function (eventName, data) {
            var array = listeners[eventName];
            if (array === undefined) {
                return;
            }
            for (var i = 0; i < array.length; ++i) {
                var listener = array[i];
                listener["handler"].call(listener["context"], data);
            }
        };

        window.broadcaster = broadcaster;
    })();

    /**
     * Object 상속시 사용하는 super 메소드 등록
     * @param  {String} name
     * @return {Function}
     * TweenMax, anime 라이브러리와 충돌남
     */
    // Object.prototype.super = function (name) {
    //     var that = this;
    //     var method = that[name];
    //     return function () {
    //         return method.apply(that, arguments);
    //     };
    // };

    /**
     * Array의 indexOf 함수를 NodeList에 추가
     */
    NodeList.prototype.indexOf = Array.prototype.indexOf;

    /**
     * 디바이스가 터치 이벤트를 지원하는지 확인
     */
    amt.isTouchSupported = function () {
        return "ontouchstart" in window || navigator.maxTouchPoints;
        return "ontouchstart" in window || navigator.msMaxTouchPoints > 0;
    };

    /**
     * 디바이스의 터치 이벤트 지원 유뮤에 따라 이벤트 맵핑
     */
    
    
    //amt.mouseTouchEvent = amt.isTouchSupported()  
    amt.mouseTouchEvent = false    
        ? {
            down: "touchstart",
            move: "touchmove",
            up: "touchend",
            over: "touchstart",
            out: "touchend",
            click: "touchend"
          }
        : {
              down: "mousedown",
              move: "mousemove",
              up: "mouseup",
              over: "mouseover",
              out: "mouseout",
              click: "click"
          };

    /**
     * element의 global offset
     * @param  {Node} element
     * @return {Object}
     */
    amt.getGlobalOffset = function (element) {
        var offset = {
            x: 0,
            y: 0
        };
        do {
            offset.x += element.offsetLeft;
            offset.y += element.offsetTop;
        } while ((element = element.offsetParent));
        return offset;
    };

    /**
     * 특정 container 기준 element의 offset
     * @param  {Node} element
     * @param  {Node} container
     * @return {Object}
     */
    amt.getOffsetInContainer = function (element, container, center) {
        var offset = {
            x: 0,
            y: 0
        };
        if(center) {
            offset.x += element.offsetWidth / 2;
            offset.y += element.offsetHeight / 2;
        }
        do {
            if (element === container) {
                return offset;
            }
            offset.x += element.offsetLeft;
            offset.y += element.offsetTop;
        } while ((element = element.offsetParent));
        return offset;
    };

    /**
     * DOM 객체를 찾는다.
     * @param  {String} selector
     * @param  {Node} scope
     * @return {Node}
     */
    amt.get = function (selector, scope) {
        if (!selector) throw new Error("selector 필수!!");
        return scope ? scope.querySelector(selector) : document.querySelector(selector);
    };

    /**
     * 모든 DOM 객체를 찾는다.
     * @param  {String} selector
     * @param  {Node} scope
     * @return {NodeList}
     */
    amt.getAll = function (selector, scope) {
        if (!selector) throw new Error("selector 필수!!");
        return scope ? scope.querySelectorAll(selector) : document.querySelectorAll(selector);
    };

    /**
     * target의 type을 확인
     * @param  {*} target
     * @return {String} target의 type string
     */
    amt.getType = function (target) {
        return Object.prototype.toString.call(target).slice(8, -1);
    };

    /**
     * target에 custom event를 dispatch한다
     * @param  {Node} target
     * @param  {String} eventName
     * @return {Object} data
     */
    amt.sendMessage = function (target, eventName, data) {
        var customEvent = new CustomEvent(eventName, {
            detail: data
        });
        target.dispatchEvent(customEvent);
    };

    return amt;
});
