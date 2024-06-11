"use strict";
var canvas, stage, exportRoot, anim_container, dom_overlay_container, fnStartAnimation;

function init() {
    canvas = document.getElementById("canvas"), anim_container = document.getElementById("animation_container"), dom_overlay_container = document.getElementById("dom_overlay_container");
    var t = AdobeAn.getComposition("6A03B7EE62427B498A355E24B38AC187"), e = t.getLibrary(),
        n = new createjs.LoadQueue(!1);
    n.addEventListener("fileload", function (e) {
        handleFileLoad(e, t)
    }), n.addEventListener("complete", function (e) {
        handleComplete(e, t)
    });
    e = t.getLibrary();
    n.loadManifest(e.properties.manifest)
}

function handleFileLoad(e, t) {
    var n = t.getImages();
    e && "image" == e.item.type && (n[e.item.id] = e.result)
}

function handleComplete(e, t) {
    for (var n = t.getLibrary(), a = t.getSpriteSheet(), o = e.target, i = n.ssMetadata, r = 0; r < i.length; r++) a[i[r].name] = new createjs.SpriteSheet({
        images: [o.getResult(i[r].name)],
        frames: i[r].frames
    });
    exportRoot = new n.INDEX, stage = new n.Stage(canvas), fnStartAnimation = function () {
        stage.addChild(exportRoot), createjs.Ticker.setFPS(n.properties.fps), createjs.Ticker.addEventListener("tick", stage)
    }, AdobeAn.makeResponsive(!1, "both", !1, 1, [canvas, anim_container, dom_overlay_container]), AdobeAn.compositionLoaded(n.properties.id), fnStartAnimation()
}