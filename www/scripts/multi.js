$(document).ready(function () {
  'use strict';
  var zindex = 50,
    score = 0,

    //SOCKET IO
    // On demande le pseudo de l'utilisateur
    socket = io.connect(),
    pseudo = prompt('Votre pseudo ?') || 'Utilisateur';

  // On se connecte au serveur
  $('#scores').prepend("<div class='pseudo'>" + pseudo + "</div>");

  // On previent l'adversaires.
  socket.emit('register', pseudo);

  // On recupere le nom de l'adversaires (si il est deja connecté)
  socket.on('getUsers', function (users) {
    users.forEach(function (opponentDatas, index, array) {
      $('#scores').append('<div class="score" id="' + opponentDatas.id + '">' + opponentDatas.score + '</div>');
      $('#' + opponentDatas.id + '').prepend('<div class="pseudo" id="scoreOpponent">' + opponentDatas.name + '</div>');
    });
  });

  //on ecoute l'arrivé d'un autre joueur.
  socket.on('userConnected', function (opponentDatas) {
    $('#scores').append('<div class="score" id="' + opponentDatas.id + '">' + opponentDatas.score + '</div>');
    $('#' + opponentDatas.id + '').prepend('<div class="pseudo" id="scoreOpponent">' + opponentDatas.name + '</div>');
  });

  //on ecoute le depart de la partie.
  socket.on('usersReady', function () {
    $('#wrapper').hide();
  });

  //on ecoute les actions de l'adversaires (refreshScore)
  socket.on('refreshScore', function (opponentDatas) {
    $('#' + opponentDatas.id + '').html('<div class="score" id="' + opponentDatas.id + '">' + opponentDatas.score + '</div>');
    $('#' + opponentDatas.id + '').prepend('<div class="pseudo" id="scoreOpponent">' + opponentDatas.name + '</div>');
  });

  //on ecoute si un joueur a terminé.
  socket.on('stopGame', function (datas) {
    endGame(datas);
  });

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
    socket.emit('getPoint', score);
    $('#score').html(score);
  }

  function checkStillDiv() {
    if (!$('#pinboard div.actif')[0]) {
      socket.emit('endGame');
    }
  }

  function endGame(datas) {

    $("#pinboard").html($('#game-over-template').html());
    $("#finalScore").html("My score : " + score);

    $("#classement").prepend('<h2>Classement</h2>');

    datas.forEach(function (opponentDatas, index, array) {
      $('#classement').append('<div class="score" id="' + opponentDatas.id + '">' + opponentDatas.score + '</div>');
      $('#' + opponentDatas.id + '').prepend('<div class="pseudo" id="scoreOpponent">' + opponentDatas.name + '</div>');
    });

    $(document).on('click', '#btnRestartGame', function () {
      //$("#pinboard").html($('#multi-game-template').html());
      document.location.reload();
    });
  }
});
