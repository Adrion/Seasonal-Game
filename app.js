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
app.use("/www", express.static(__dirname + '/www'));

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
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
    return _.except(this.allPeoples, {
      id: id
    });
  },

  deletePeople: function (id) {

    toDelete = this.getPeopleByName(id);

    if (toDelete) {
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
var users = {}, user;

//// SOCKET.IO ////

var io = require('socket.io');

// Socket.IO écoute maintenant notre application !
io = io.listen(server);

// Quand une personne se connecte au serveur
io.sockets.on('connection', function (socket) {

  //Tant que le nombre de joueur n'est pas atteint on accepte les connexions.
  socket.on('disconnect', function () {
    console.log('Got disconnect!' + socket.id);
  });
  // On enregistre le nouveau joueur dans la partie.
  socket.on('register', function (pseudo) {

    console.log(peoples.allPeoples);

    //On envoit la liste des joueurs connectés
    //socket.emit('getUsers', users);
    console.log(_.toArray(peoples.allPeoples));
    socket.emit("getUsers", _.toArray(peoples.allPeoples));

    user = {
      id: socket.id,
      name: pseudo,
      score: 0
    };

    //On enregistre le nouveau joueur dans la liste.
    peoples.addPeople(user);

    // On previent sa connexion à l'adversaire.
    socket.broadcast.emit('userConnected', peoples.getPeopleByName(socket.id)[0]);

  });

  // Quand on reçoit une action d'un joueur
  socket.on('getPoint', function (score) {
    console.log('======>>' + score);

    // On modifie le score joueur (variable globale commune à tous les clients connectés au serveur)
    user = {
      id: socket.id,
      name: user.name,
      score: score
    };

    peoples.allPeoples[(socket.id)] = user;

    // On envoie à tout les clients connectés (sauf celui qui a appelé l'événement) les nouveaux scores
    socket.broadcast.emit('refreshScore', peoples.getPeopleByName(socket.id)[0]);
  });

  // Quand un joueur a terminé la partie est fermée.
  socket.on('endGame', function () {
    io.sockets.emit('stopGame', _.toArray(peoples.allPeoples));
    peoples = new Peoples();
  });
});

///////////////////

// Notre application écoute sur le port 8080
server.listen(8080);
console.log('Live Chat App running at http://localhost:8080/');
