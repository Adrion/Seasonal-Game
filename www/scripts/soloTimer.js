'use strict';

function soloTimerInit() {
  var zindex = 50,
    score;

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
  }).pep({
    start: function () {
      zindex = zindex + 1;
      $(this).css({
        zIndex: zindex
      });
    },
    constrainTo: [0, 0, 0, 0],
    useCSSTranslation: false,
    droppable: $("#printemps, #ete,#hiver,#automne"),
    elementsWithInteraction: $("#spring, #summer,#winter,#autumn"),
    stop: handleDrop,
    rest: handleDrop
  });

  function handleDrop(e, obj) {
    if (obj.activeDropRegions[0]) {
      var dropTargetId = obj.activeDropRegions[0][0].id,
        dragElClass = obj.$el[0].classList[1];
      if (dropTargetId === dragElClass) {
        obj.$el[0].remove();
        checkStillDiv();
      }
    }
  }

  //Init Chrono
  chronoStart();

  function checkStillDiv() {
    if (!$('#pinboard div.actif')[0]) {
      endGameTimer();
    }
  }

  function endGameTimer() {
    chronoStop();
    score = $("#score").html();
    $("#pinboard").html($('#game-over-template').html());
    $('#btnRestartGame').addClass('timer');
    $("#finalScore").html(score);
    $(document).one('click', '.timer', function () {
      $(document).trigger('startTimer');
    });
  }

}

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
