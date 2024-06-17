let count4 = 0;

$(document).on("click", ".page_4 .dapCheckBtn", function () {
  if ($(this).hasClass("daps")) {
    $(".clone").remove();
    //$(".dragList4").css("top", "0");
    $(".dragList4 img").removeClass("dragged");
    $(this).removeClass("daps");
  } else {
    $(".page_4 .innerPage").each(function () {
      if ($(this).css("display") == "block") {
        let ans = $(this).find(".dragBox").attr("ans");
        $(".drag").each(function () {
          if ($(this).attr("id") == ans) {
            let clone = $(this).clone();
            $(clone).addClass("clone");
            $(clone).css("top", "32px");
            $(clone).css("left", "-302px");
            $(clone).css("z-index", "0");
            $(".slideWrap4").append(clone);
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
      $(imgArr[i]).addClass("drag4" + i);
      $(imgArr[i]).attr("id", "drag4_" + i);
      $(imgArr[i]).appendTo(".dragList4");

      let imgWidth, imgHeight;
      let index;
      imgArr[i].onload = function () {
        let ex = this.width / this.height;
        imgWidth = this.width / 1;
        imgHeight = imgWidth;
        index = Number($(this).index()) + 1;

        $(".drag4" + index).css("left", (index - 1) * 250 + "px");
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

            $(".slideWrap4").append($clone);
            $($clone).addClass("clone");
            $($clone).css("top", "32px");
            $($clone).css("left", "-302px");
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
        appendTo: ".slideWrap4",
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
    $(".page_4 .drag").each(function () {
      drag_item_add(this);
    });
    $(".page_4 .dragBox").each(function () {
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
  let $slideWrap = $(".slideWrap4");
  let $slide = $slideWrap.find(".dragList4");
  let $nextBtn = $slideWrap.find(".next");
  let $prevBtn = $slideWrap.find(".prev");
  let slidePos = 500;

  $nextBtn.on("click", function () {
    if (count4 < 2) {
      efSound("./media/click.mp3");
      $prevBtn.removeClass("none");
      count4++;
    }
    slide2();
  }); // 슬라이드 왼쪽버튼 클릭

  $prevBtn.on("click", function () {
    if (count4 > 0) {
      efSound("./media/click.mp3");
      $nextBtn.removeClass("none");
      count4--;
    }
    slide2();
  }); // 슬라이드 오른쪽버튼 클릭
  function slide2() {
    // console.log(count2);
    if (count4 == 0) $prevBtn.addClass("none");
    if (count4 == 2) $nextBtn.addClass("none");
    $slide.stop().animate({ left: -slidePos * count4 }, 500);
  } // 슬라이드
});
