var slideDraw = [1];
let count = 0;

$(document).on("click", ".page_1 .dapCheckBtn", function () {
  if ($(this).hasClass("daps")) {
    $(".clone").remove();
    //$(".dragList").css("top", "0");
    $(".dragList img").removeClass("dragged");
    $(this).removeClass("daps");
  } else {
    $(".page_1 .innerPage").each(function () {
      if ($(this).css("display") == "block") {
        let ans = $(this).find(".dragBox").attr("ans");
        $(".drag").each(function () {
          if ($(this).attr("id") == ans) {
            let clone = $(this).clone();
            $(clone).addClass("clone");
            $(clone).css("top", "17px");
            $(clone).css("left", "-352px");
            $(clone).css("z-index", "0");
            $(".slideWrap").append(clone);
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
      $(imgArr[i]).addClass("drag" + i);
      $(imgArr[i]).attr("id", "drag1_" + i);
      $(imgArr[i]).appendTo(".dragList");

      let imgWidth, imgHeight;
      let index;
      imgArr[i].onload = function () {
        let ex = this.width / this.height;
        imgWidth = this.width / 1;
        imgHeight = imgWidth;
        index = Number($(this).index()) + 1;

        $(".drag" + index).css("top", (index - 1) * 300 + "px");
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

            $(".slideWrap").append($clone);
            $($clone).addClass("clone");
            $($clone).css("top", "17px");
            $($clone).css("left", "-352px");
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
        appendTo: ".slideWrap",
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
    $(".page_1 .drag").each(function () {
      drag_item_add(this);
    });
    $(".page_1 .dragBox").each(function () {
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
  let $slideWrap = $(".slideWrap");
  let $slide = $slideWrap.find(".dragList");
  let $upBtn = $slideWrap.find(".up");
  let $downBtn = $slideWrap.find(".down");

  let slidePos = 300;

  $upBtn.on("click", function () {
    if (count > 0) {
      efSound("./media/click.mp3");
      $downBtn.removeClass("none");
      count--;
    }
    slide();
  });

  $downBtn.on("click", function () {
    if (count < 5) {
      efSound("./media/click.mp3");
      $upBtn.removeClass("none");
      count++;
    }
    slide();
  });

  function slide() {
    // console.log(count);
    if (count == 0) $upBtn.addClass("none");
    if (count == 5) $downBtn.addClass("none");
    $slide.stop().animate({ top: -slidePos * count }, 500);
  } // 슬라이드
}); // end
