function fishingGame(){var e=document.querySelector(".warning_btn"),o=document.querySelector(".basicSlider_btn.next"),n=document.querySelector(".fishing .homeIcon");e.addEventListener("click",warningPop),o.addEventListener("click",fakeBoxclose),n.addEventListener("click",fishingReset)}function warningPop(){var e=document.querySelector(".warning_pop");e.classList.add("on"),setTimeout(function(){e.classList.remove("on")},1500)}function fakeBoxclose(){document.querySelector(".warning_btn").classList.remove("off"),document.querySelector(".charImg").classList.remove("success"),document.querySelector(".fakeBox").classList.remove("on")}function fishingReset(){document.querySelector(".intro.fishing").classList.remove("on"),document.querySelector(".fishing .gate_container").classList.remove("off");var e=document.querySelector(".fakeBox"),o=document.querySelector(".totalAnswer"),n=o.querySelectorAll("li");e.classList.remove("on"),n.forEach(function(e){o.removeChild(e)}),$pm.array.inPage.slider.forEach(function(e){e.reset()}),document.querySelectorAll(".js-dragObj").forEach(function(e){console.log(e),e.classList.contains("dragAnswer")&&e.classList.remove("dragAnswer")})}