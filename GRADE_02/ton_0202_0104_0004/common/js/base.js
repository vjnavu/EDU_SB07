/*
	create date : 2016-05-19
	creator : saltgamer
*/
'use strict';

function loadScriptFile(scriptSrc, callBack) {
  var script = document.createElement('script');
  script.src = scriptSrc;

  if (callBack) {
    script.onload = function () {
      callBack();
    };
  }
  document.head.appendChild(script);
}

function runTextBook(callBack) {
  if (window.document) {
    window.addEventListener('load', completed, false);
  }
  function completed() {
    window.removeEventListener('load', completed, false);
    callBack();
  }
}
