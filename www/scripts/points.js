'use strict';

function soloPointsInit() {
  var zindex = 50,
    score = 0;
  // Create your interaction code here
  $("#pinboard div.actif").each(function () {
    var xpos = Math.floor(Math.random()),
      ypos = Math.floor(Math.random()),
      rotation = Math.floor(Math.random() * 15);
    if (Math.floor(Math.random() * 11) > 5) {
      rotation = rotation * -1;
    }
    $(this).data("rotation", rotation);
    $(this).delay(0).animate({
      top: ypos,
      left: xpos
    }).css({
      webkitTransform: "rotate(" + rotation + "deg)",
      MozTransform: "rotate(" + rotation + "deg)",
      msTransform: "rotate(" + rotation + "deg)",
      transform: "rotate(" + rotation + "deg)"
    });
  }).draggable({
    start: function () {
      zindex = zindex + 1;
      $(this).css({
        zIndex: zindex
      });
    },
    stop: function () {
      var rotation = Math.floor(Math.random() * 15);
      if (Math.floor(Math.random() * 11) > 5) {
        rotation = rotation * -1;
      }
      $(this).data("rotation", rotation);
      $(this).css({
        webkitTransform: "rotate(" + rotation + "deg)",
        MozTransform: "rotate(" + rotation + "deg)",
        msTransform: "rotate(" + rotation + "deg)",
        transform: "rotate(" + rotation + "deg)"
      });
    },
    containment: "#pinboard"
  });

  $("#spring").droppable({
    drop: function (event, ui) {
      if (ui.draggable[0].classList[1] === '1') {
        getpoint(5);
      } else {
        getpoint(-3);
      }
      ui.draggable.remove();
      checkStillDiv();
    }
  });

  $("#summer").droppable({
    drop: function (event, ui) {
      if (ui.draggable[0].classList[1] === '2') {
        getpoint(5);
      } else {
        getpoint(-3);
      }
      ui.draggable.remove();
      checkStillDiv();
    }
  });

  $("#autumn").droppable({
    drop: function (event, ui) {
      if (ui.draggable[0].classList[1] === '3') {
        getpoint(5);
      } else {
        getpoint(-3);
      }
      ui.draggable.remove();
      checkStillDiv();
    }
  });

  $("#winter").droppable({
    drop: function (event, ui) {
      if (ui.draggable[0].classList[1] === '4') {
        getpoint(5);
      } else {
        getpoint(-3);
      }
      ui.draggable.remove();
      checkStillDiv();
    }
  });

  function getpoint(points) {
    score += points;
    $('#score').html(score);
  }

  function checkStillDiv() {
    if (!$('#pinboard div.actif')[0]) {
      endGamePoints();
    }
  }

  function endGamePoints() {
    $("#pinboard").html($('#game-over-template').html());
    $("#finalScore").html(score);
    $('#btnRestartGame').addClass('points');
    $(document).one('click', '.points', function () {
      $("#pinboard").html($('#solo-game-template').html());
      soloPointsInit();
    });
  }
}
