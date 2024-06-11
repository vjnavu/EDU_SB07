"use strict";
!(function () {
  function s(t) {
    (this.container = t.container),
      (this.popupPages = t.popupPages),
      (this.btn = t.btn),
      (this.page = t.page),
      (this.idx = t.idx),
      (this.Mode = t.Mode),
      (this.autoMode = t.autoMode),
      (this.UIHidden = t.UIHidden),
      (this.callBack = t.callBack),
      (this.isOpened = !1),
      (this.closeInnerMode = t.closeInnerMode);
    var s,
      e = this;
    (this.set = function () {
      if (
        (this.btn.hasAttribute("data-popup-option") && this.addOption(),
          this.autoMode || this.closeInnerMode
            ? ((this.closeBtn = $ts.ce({ tag: "div", class: "popup_closeBtn", parent: $ts.getEl("[data-popup-inner]", this.page)[0] })), this.autoMode && this.open())
            : (this.closeBtn = $ts.ce({ tag: "div", class: "popup_closeBtn", parent: this.page })),
          1 < this.page.querySelectorAll(".popup_closeBtn").length)
      )
        for (var t = this.page.querySelectorAll(".popup_closeBtn"), s = 0; s < t.length; s++) 0 !== s && this.page.removeChild(t[s]);
      this.toggle ? this.btn.addEventListener("click", this.viewToggle.bind(this)) : this.btn.addEventListener("click", this.open.bind(this)),
        this.closeBtn.addEventListener("click", this.close.bind(this)),
        $ts.addHoverEvents(this.closeBtn, "preventDefault"),
        this.btn.addEventListener("click", window.$efSound.click),
        this.closeBtn.addEventListener("click", window.$efSound.click);

        console.log(this, this.closeBtn);
     
    }),
      (this.toggle = function () { }),
      (this.addOption = function () {
        var t = (t = this.btn.getAttribute("data-popup-option")).replace(/ /g, "").split(",");
        for (var s in t) this[t[s]] = !0;
      }),
      (this.open = function () {
        "pageChange" === this.Mode || "pageOff" === this.Mode ? this.pageOff() : (this.pageResetZIndex(), (this.page.style.zIndex = 1)),
          this.openGetSlideIndex(),
          (this.page.style.top = ""),
          (this.page.style.left = ""),
          (this.isOpened = !0),
          this.page.classList.add("on"),
          this.btn.classList.add("popupOn"),
          this.autoMode &&
          !this.btn.classList.contains("opened") &&
          (s = window.setInterval(function () {
            e.close();
          }, e.autoMode))
          // ,this.callBack && this.callBack.open && this.callBack.open(this);
      }),
      (this.close = function () {
        this.callBack && this.callBack.close && this.callBack.close(this),
          this.autoMode && !this.btn.classList.contains("opened") && (this.btn.classList.add("opened"), this.page.classList.add("openedPage")),
          clearInterval(s),
          (this.isOpened = !1),
          this.page.classList.remove("on"),
          this.btn.classList.remove("popupOn"),
          this.reset();
      }),
      (this.viewToggle = function () {
        this.isOpened ? this.close() : this.open();
      }),
      (this.reset = function () {
        this.callBack && this.callBack.reset && this.callBack.reset(this);
      }),
      (this.pageOff = function () {
        for (var t in $pm.array.popup) $pm.array.popup[t].close();
      }),
      (this.pageResetZIndex = function () {
        for (var t in this.popupPages) this.popupPages[t].style.zIndex = "";
      }),
      (this.containerOn = function () {
        this.container.classList.contains("on") || this.container.classList.add("on");
      }),
      (this.containerOff = function () {
        var t = 0;
        for (var s in this.popupPages) this.popupPages[s].classList.contains("on") && t++;
        0 === t && this.container.classList.remove("on");
      }),
      (this.openGetSlideIndex = function () {
        var t, s, e;
        this.btn.hasAttribute("data-slide") &&
          ((t = parseInt(this.btn.getAttribute("data-slide")) - 1),
            (s = parseInt(this.btn.getAttribute("data-slide-page")) - 1),
            (e = window.$pm.array.inPopup.slider[t]),
            setTimeout(function () {
              (e.idx = s), e.changeMoves();
            }));
      }),
      this.set();
  }
  window.$popup = function (t) {
    return new s(t);
  };
})();