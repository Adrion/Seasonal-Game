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
console.log(app);

//configure APP
app.use(express.static(__dirname + '/'));

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.get('/whatever/url/path/you/want', function (req, res) {
  // this will match GET requests to /whatever/url/path/you/want
});

app.get('*', function (req, res) {
  // this will match GET requests to any path
  // take care if you use middlewares after app.router as here
});

app.post('/whatever/url/path/you/want', function (req, res) {
  // this will match POST requests to /whatever/url/path/you/want
});

app.post('*', function (req, res) {
  // this will match POST requests to any path
});

// Variables globales
// Ces variables resteront durant toute la vie du seveur et sont communes pour chaque client (node server.js)
// Liste des messages de la forme { pseudo : 'Mon pseudo', message : 'Mon message' }
var messages = [],
  users = [],
  scores = {};

//// SOCKET.IO ////

var io = require('socket.io');

// Socket.IO écoute maintenant notre application !
io = io.listen(server);

io.set('authorization', function (handshakeData, accept) {});

// Quand une personne se connecte au serveur
io.sockets.on('connection', function (socket) {
  console.log(socket);
  // On enregistre le nouveau joueur dans la partie.
  socket.on('register', function (pseudo) {

    //On envoit la liste des joueurs connectés
    socket.emit('getUsers', users);

    //On enregistre le nouveau joueur dans la liste.
    users[pseudo] = 0;

    // On previent sa connexion à l'adversaire.
    socket.broadcast.emit('userConnected', pseudo);
  });

  // Quand on reçoit une action d'un joueur
  socket.on('getPoint', function (dataPlayer) {

    // On modifie le score joueur (variable globale commune à tous les clients connectés au serveur)
    users[dataPlayer.user] = dataPlayer.score;

    // On envoie à tout les clients connectés (sauf celui qui a appelé l'événement) les nouveaux scores
    socket.broadcast.emit('refreshScore', users);
  });
});

///////////////////

// Notre application écoute sur le port 8080
app.listen(8080);
console.log('Live Chat App running at http://localhost:8080/');
