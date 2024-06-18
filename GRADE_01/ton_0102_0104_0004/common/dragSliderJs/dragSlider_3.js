var slideDraw = [1];
let count3 = 0;

$(document).on("click", ".page_3 .dapCheckBtn", function () {
  if ($(this).hasClass("daps")) {
    $(".clone").remove();
    //$(".dragList3").css("top", "0");
    $(".dragList3 img").removeClass("dragged");
    $(this).removeClass("daps");
  } else {
    $(".page_3 .innerPage").each(function () {
      if ($(this).css("display") == "block") {
        let ans = $(this).find(".dragBox").attr("ans");
        $(".drag").each(function () {
          if ($(this).attr("id") == ans) {
            let clone = $(this).clone();
            $(clone).addClass("clone");
            $(clone).css("top", "17px");
            $(clone).css("left", "-252px");
            $(clone).css("z-index", "0");
            $(".slideWrap3").append(clone);
            $(this).addClass("dragged");
          }
        });
      }
    });
    $(this).addClass("daps");
  }
});
$(function () {
  // tạo ảnh trong drag box
  $(function () {
    for (let i = 1; i <= 6; i++) {
      let imgArr = [];
      imgArr[i] = new Image();
      imgArr[i].src = "images/proto_so_004/drag_item_0" + i + ".png";

      $(imgArr[i]).addClass("drag");
      $(imgArr[i]).addClass("drag3" + i);
      $(imgArr[i]).attr("id", "drag3_" + i);
      $(imgArr[i]).appendTo(".dragList3");

      let imgWidth, imgHeight;
      let index;
      imgArr[i].onload = function () {
        let ex = this.width / this.height;
        imgWidth = this.width / 1;
        imgHeight = imgWidth;
        index = Number($(this).index()) + 1;

        $(".drag3" + index).css("top", (index - 1) * 140 + "px");
      };
      // console.log(imgArr[i]);
    }
  });

  /////////드래그 앤 드랍//////////////
  // Kéo - Thả
  $(function () {
    let dragClick = { x: 0, y: 0 };
    let org_pos = { x: 0, y: 0 };
    let factor = 1;
    function drop_item_add(item) {
      $(item).droppable({
        tolerance: "pointer",
        drop: function (event, ui) {
          let drag_item = ui.draggable;
          let drop_item = $(this);

          if ($(drag_item).attr("id") != $(this).attr("ans")) {
            efSound("media/incorrect.mp3");
            return;
          } else {
            $(drag_item).addClass("dragged");
            efSound("media/correct.mp3");
          }

          if ($(ui.helper).hasClass("clone")) {
          } else {
            let $clone = ui.helper.clone();

            $(".slideWrap3").append($clone);
            $($clone).addClass("clone");
            $($clone).css("top", "17px");
            $($clone).css("left", "-252px");
            $($clone).css("z-index", "0");

            $(this)
              .parents(".CanDragZone")
              .find(".dapCheckBtn")
              .addClass("daps");
          }
        },
      });
    }
    // drag
    function drag_item_add(item) {
      $(item).draggable({
        appendTo: ".slideWrap3",
        helper: "clone",
        start: function (event, ui) {
          dragClick.x = event.clientX;
          dragClick.y = event.clientY;
          org_pos.y = $(event.currentTarget).css("top");
          org_pos.x = $(event.currentTarget).css("left");
          $(this).attr("data-starty", $(this).css("top"));
          $(this).attr("data-startx", $(this).css("left"));
          $(item).css("z-index", 2);
          $(this).hide();
        },
        stop: function (event, ui) {
          if (!$(ui.helper).hasClass("not-drag")) {
            $(ui.helper).css("bottom", org_pos.y);
            $(ui.helper).css("left", org_pos.x);
            $(ui.helper).css("transform", "");
            $(item).css("z-index", 1);
          }

          if (
            $(this)
              .attr("class")
              .indexOf($(".dragBox").attr("data-savedragid")) == -1
          )
            $(this).show();
        },
        drag: function (event, ui) {
          let original = ui.originalPosition;
          ui.position = {
            left: (event.clientX - dragClick.x + original.left) / factor,
            top: (event.clientY - dragClick.y + original.top) / factor,
          };
        },
        scroll: false,
      });
    }
    $(".page_3 .drag").each(function () {
      drag_item_add(this);
    });
    $(".page_3 .dragBox").each(function () {
      drop_item_add(this);
    });

    /*
    $(".CanDragZone").on("click", ".clone", function () {
      let split = $(this).attr("class").split(" ")[1];
      $("." + split).show();
      // $(".opacityCir").hide();
      $("." + split).removeClass("not-drag");
      $("." + split).draggable({ disabled: false });
      $(this).remove();

      $(".dragBox").attr("data-savedragid", "");
    });
    */
  });
}); // end

$(function () {
  let $slideWrap3 = $(".slideWrap3");
  let $slide = $slideWrap3.find(".dragList3");
  let $upBtn = $slideWrap3.find(".up");
  let $downBtn = $slideWrap3.find(".down");

  let slidePos = 280;

  $upBtn.on("click", function () {
    if (count > 0) {
      efSound("./media/click.mp3");
      $downBtn.removeClass("none");
      count--;
    }
    slide();
  });

  $downBtn.on("click", function () {
    if (count < 2) {
      efSound("./media/click.mp3");
      $upBtn.removeClass("none");
      count++;
    }
    slide();
  });

  function slide() {
    // console.log(count);
    if (count == 0) $upBtn.addClass("none");
    if (count == 2) $downBtn.addClass("none");
    $slide.stop().animate({ top: -slidePos * count }, 500);
  } // 슬라이드
}); // end
