var Identicon = require('identicon.js');
var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var connectionManager = require('./js/connection-manager.js');

// Allow folders in /public to be accessible client-side
app.use(express.static(__dirname + '/../dist'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){

  socket.on('attempt login', function(nickname){
    var connections = connectionManager.getConnections();
    var isUnique = true;
    for (var i = 0; i < connections.length; i++){
      if (connections[i].nickname == nickname){
        isUnique = false;
        break;
      }
    }
    if (isUnique){
      if (nickname.match(/^[a-zA-Z0-9_][a-zA-Z0-9_]*[a-zA-Z0-9_]$/)){
        socket.emit('login response', true);
      }else{
        socket.emit('login response', false, {"error": "Nickname contains invalid characters"});
      }
    }else{
      socket.emit('login response', false, {"error": "Nickname already taken"});
    }
  });

  socket.on('new user', function(nickname){
    connectionManager.addConnection(nickname, socket);
    var welcomeMsg = "Welcome " + nickname + ", you are now connected";
    var connections = connectionManager.getConnections();
    var appInfo =
      {"connections": connections,
      "msg": welcomeMsg};
    socket.emit('welcome', appInfo);
  });

  socket.on('disconnect', function(){
    var connection = connectionManager.getConnection(socket);
    if (connection){
      connectionManager.removeConnection(socket);
      var disconnectMsg = connection.nickname + " has disconnected";
      var connections = connectionManager.getConnections();
      var appInfo = {
        "connections": connections,
        "msg": disconnectMsg
      };
      io.emit('disconnected', appInfo);
    }
  });

  socket.on('chat message', function(message) {
    // the entire connection object is emitted as it stores additional info (i.e. avatar for the chat message)
    var connection = connectionManager.getConnection(socket);
    connection['msg'] = message;
    io.emit('chat message', connection);
  });

  socket.on('update avatar', function(newUser) {
    var avatarSrc = "data:image/png;base64," + (new Identicon("", {size:150}).toString());
    connectionManager.setAvatar(socket, avatarSrc);
    var connection = connectionManager.getConnection(socket);
    var connections = connectionManager.getConnections();
    socket.emit('update avatar', connection, connections);
    if (newUser){
      var connectMsg = connection.nickname + " has connected";
      var appInfo = {
        "connections": connections,
        "msg": connectMsg};
      socket.broadcast.emit('connected', appInfo);
    }
  });

  socket.on('refresh navbar', function() {
    socket.emit('refresh navbar', connectionManager.getConnections());
  });

  socket.on('typing', function(){
    var connection = connectionManager.getConnection(socket);
    connection['lastActive'] = (new Date()).toLocaleTimeString();
  });

  socket.on('view profile', function(nickname){
    socket.emit('populate profile', connectionManager.getConnectionByNickname(nickname));
  })
});

var port = process.env.PORT || 3000;
http.listen(port, function(){
  console.log('listening on port: ' + port)
});
