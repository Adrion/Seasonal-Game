$(document).ready(function () {
  'use strict';
  var zindex = 50,
    score;
  // Create your interaction code here
  $("#pinboard div.actif").each(function () {
    // console.log($(window).height());
    // console.log($(document).height());
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

    containment: "#pinboard",
    scroll: false
  });

  $("#spring").droppable({
    accept: ".1",
    drop: function (event, ui) {
      ui.draggable.remove();
      checkStillDiv();
    }
  });

  $("#summer").droppable({
    accept: ".2",
    drop: function (event, ui) {
      ui.draggable.remove();
      checkStillDiv();
    }
  });

  $("#autumn").droppable({
    accept: ".3",
    drop: function (event, ui) {
      ui.draggable.remove();
      checkStillDiv();
    }
  });

  $("#winter").droppable({
    accept: ".4",
    drop: function (event, ui) {
      ui.draggable.remove();
      checkStillDiv();
    }
  });

  //Init Chrono
  chronoStart();

  function checkStillDiv() {
    if (!$('#pinboard div.actif')[0]) {
      endGame();
      //console.log("il en reste plus");
    }
  }

  function endGame() {
    chronoStop();
    score = $("#score").html();
    $("#pinboard").html($('#game-over-template').html());
    $("#finalScore").html(score);
    $(document).on('click', '#btnRestartGame', function () {
      $("#pinboard").html($('#soloTime-game-template').html());
    });
  }

});

/*jshint strict:false */

var startTime = 0,
  start,
  end = 0,
  diff = 0,
  timerID = 0;

function chrono() {
  end = new Date();
  diff = end - start;
  diff = new Date(diff);
  var msec = diff.getMilliseconds(),
    sec = diff.getSeconds(),
    min = diff.getMinutes(),
    hr = diff.getHours() - 1;
  if (min < 10) {
    min = "0" + min;
  }
  if (sec < 10) {
    sec = "0" + sec;
  }
  if (msec < 10) {
    msec = "00" + msec;
  } else if (msec < 100) {
    msec = "0" + msec;
  }
  //console.log(hr, min, sec, msec);
  $("#score").html(hr + ":" + min + ":" + sec + ":" + msec);
  timerID = setTimeout("chrono()", 10);
}

function chronoStart() {
  start = new Date();
  chrono();
}

function chronoContinue() {
  start = new Date() - diff;
  start = new Date(start);
  chrono();
}

function chronoReset() {
  document.getElementById("score").innerHTML = "0:00:00:000";
  start = new Date();
}

function chronoStopReset() {
  document.getElementById("score").innerHTML = "0:00:00:000";
  document.chronoForm.startstop.onclick = chronoStart;
}

function chronoStop() {
  clearTimeout(timerID);
}

//-----------------END CHRONO----------------
