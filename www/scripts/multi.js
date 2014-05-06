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
    console.log(users);
    /*users.forEach(function (element, index, array) {
              $('#scores').append('<div class="score" id="scoreOpponent">' + element.score + '</div>');
              $('#scoreOpponent').prepend('<div class="pseudo" id="scoreOpponent">' + element.name + '</div>');
            });*/
  });

  //on ecoute l'arrivé d'un autre joueur.
  socket.on('userConnected', function (opponentDatas) {
    console.log(opponentDatas);
    $('#scores').append('<div class="score" id="' + opponentDatas.id + '">' + opponentDatas.score + '</div>');
    $('#' + opponentDatas.id + '').prepend('<div class="pseudo" id="scoreOpponent">' + opponentDatas.name + '</div>');
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
    socket.emit('getPoint', score);
    $('#score').html(score);
  }

  function checkStillDiv() {
    if (!$('#pinboard div.actif')[0]) {
      socket.emit('endGame');
    }
  }

  function endGame(datas) {
    console.log(datas);
    $("#pinboard").html($('#game-over-template').html());
    $("#finalScore").html(score);
    $(document).on('click', '#btnRestartGame', function () {
      $("#pinboard").html($('#multi-game-template').html());
    });
  }
});
