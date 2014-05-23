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
    stop: handleDrop
  });

  function handleDrop(e, obj) {
    if (obj.activeDropRegions[0]) {
      var dropTargetId = obj.activeDropRegions[0][0].id,
        dragElClass = obj.$el[0].classList[1];
      if (dropTargetId === dragElClass) {
        getpoint(5);
      } else {
        getpoint(-3);
      }
      obj.$el[0].remove();
      checkStillDiv();
    }
  }

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
      $(document).trigger('startPoints');
    });
  }
}
