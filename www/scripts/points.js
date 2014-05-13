'use strict';

function soloPointsInit() {
  var zindex = 50,
    score = 0;
  // Create your interaction code here
  $("#pinboard div.actif").each(function () {
    var widthCard = $("#pinboard div.actif").width(),
      heightCard = $("#pinboard div.actif").width(),
      widthArea = $("#pinboard").width(),
      heightArea = $("#pinboard").height(),
      xpos = Math.floor(Math.random()) + (widthArea / 2) - (widthCard / 2),
      ypos = Math.floor(Math.random()) + (heightArea / 2) - (heightCard / 2),
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
      if (ui.draggable[0].classList[1] === 'printemps') {
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
      if (ui.draggable[0].classList[1] === 'ete') {
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
      if (ui.draggable[0].classList[1] === 'automne') {
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
      if (ui.draggable[0].classList[1] === 'hiver') {
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
