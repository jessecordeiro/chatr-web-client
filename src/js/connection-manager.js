var connections = []

function addConnection(name, socket){
  connections.push({
    nickname: name,
    _id: socket.id,
    lastActive: (new Date()).toLocaleTimeString()
  });
};

function removeConnection(socket){
  for (var i = 0; i < connections.length; i++){
    if (connections[i]._id == socket.id){
      connections.splice(i, 1);
    }
  }
};

function getConnection(socket){
  for (var i = 0; i < connections.length; i++){
    if (connections[i]._id == socket.id){
      return connections[i];
    }
  }
};

function getConnectionByNickname(nickname){
  for (var i = 0; i < connections.length; i++){
    if (connections[i].nickname == nickname){
      return connections[i];
    }
  }
}

function getConnections(){
  return connections;
};

function setAvatar(socket, src){
  var connection = getConnection(socket);
  connection['avatar'] = src;
}

module.exports = {
  addConnection: addConnection,
  removeConnection: removeConnection,
  getConnection: getConnection,
  getConnectionByNickname, getConnectionByNickname,
  getConnections: getConnections,
  setAvatar: setAvatar,
  connections: connections
};
