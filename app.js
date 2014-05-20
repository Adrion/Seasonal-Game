"use strict";
var http = require('http'),
  fs = require('fs'),
  express = require('express');

// Création du serveur
/*var app = http.createServer(function (req, res) {
  // On lit notre fichier index.html
  fs.readFile('./index.html', 'utf-8', function (error, content) {
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });
    res.end(content);
  });
});*/

var app = express(),
  server = http.createServer(app);

//configure APP
app.use("/", express.static(__dirname + '/www'));

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/www/index.html');
});

/// LODASH ///
var _ = require('lodash');

function Peoples() {
  this.allPeoples = {};
}

_.extend(Peoples.prototype, {

  addPeople: function (user) {
    this.allPeoples[user.id] = {
      id: user.id,
      name: user.name,
      score: user.score
    };
  },

  getPeopleByName: function (id) {
    return _.where(this.allPeoples, {
      id: id
    });
  },

  getAllPeopleExcept: function (id) {
    return _.reject(this.allPeoples, {
      id: id
    });
  },

  deletePeople: function (id) {
    console.log(id);
    var toDelete = this.getPeopleByName(id)[0] || false;
    console.log(toDelete);

    if (toDelete) {
      io.sockets.socket(toDelete.id).disconnect();
      delete this.allPeoples[toDelete.id];
      return true;
    }
    return false;
  }
});

// init game group
var peoples = new Peoples();

///////////////////

// Variables globales
// Ces variables resteront durant toute la vie du seveur et sont communes pour chaque client (node server.js)
var users = {},
  roomSlots = 3;

//// SOCKET.IO ////

var io = require('socket.io');

// Socket.IO écoute maintenant notre application !
io = io.listen(server);

// Quand une personne se connecte au serveur
io.sockets.on('connection', function (socket) {

  //On regarde si la salle est pleine.
  if (_.toArray(peoples.allPeoples).length === roomSlots) {
    socket.emit('roomFull');
  }

  //Tant que le nombre de joueur n'est pas atteint on accepte les connexions.
  socket.on('disconnect', function () {
    console.log('Got disconnect!' + socket.id);
  });

  // On enregistre le nouveau joueur dans la partie.
  socket.on('register', function (pseudo) {

    //On regarde si la salle est pleine.
    if (_.toArray(peoples.allPeoples).length === roomSlots) {
      socket.emit('roomFull');
    } else {
      //On envoit la liste des joueurs connectés
      console.log(_.toArray(peoples.allPeoples));
      socket.emit("getUsers", _.toArray(peoples.allPeoples));

      //On enregistre le nouveau joueur dans la liste.
      peoples.addPeople({
        id: socket.id,
        name: pseudo,
        score: 0
      });

      // On previent sa connexion à l'adversaire.
      socket.broadcast.emit('userConnected', peoples.getPeopleByName(socket.id)[0]);
      console.log(_.toArray(peoples.allPeoples).length);

      //Si le nombre de joueur requis est atteint on lance la partie.
      if (_.toArray(peoples.allPeoples).length === roomSlots) {
        io.sockets.emit('usersReady');
      }
    }
  });

  // Quand on reçoit une action d'un joueur
  socket.on('getPoint', function (score) {
    console.log('======>>' + score);

    // On modifie le score joueur (variable globale commune à tous les clients connectés au serveur)
    peoples.allPeoples[socket.id] = {
      id: socket.id,
      name: peoples.allPeoples[socket.id].name,
      score: score
    };
    console.log(peoples.allPeoples[socket.id]);

    // On envoie à tout les clients connectés (sauf celui qui a appelé l'événement) les nouveaux scores
    socket.broadcast.emit('refreshScore', peoples.getPeopleByName(socket.id)[0]);
  });

  // Quand un joueur a terminé la partie est fermée.
  socket.on('endGame', function () {
    io.sockets.emit('stopGame', _.sortBy(_.toArray(peoples.allPeoples), 'score').reverse());
  });

  //Quand un joueur se deconnecte.
  socket.on('disconnectPeople', function () {
    peoples.deletePeople(socket.id);
  });
});

///////////////////

// Notre application écoute sur le port 8080
server.listen(process.env.PORT || 8080);
console.log('Live Chat App running at http://localhost:8080/');
