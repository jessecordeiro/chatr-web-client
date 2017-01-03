var nickname;
var socket = io();
socket.on('login response', function(res){
  if (res){
    $('#modal1').modal('close');
    $('#nickname-navbar').text(nickname);
    openSocket(nickname);
  }else{
    Materialize.toast('That nickname is already taken', 3000, 'rounded');
  }
});

function openSocket(nickname){
  socket.emit('new user', nickname);

  $('#input').submit(function() {
    var input = $('#m').val();
    if (input.length != 0){
      socket.emit('chat message', $('#m').val());
      $('#m').val('');
    }
    return false;
  });
  socket.on('welcome', function(info){
    $('#messages').append($('<li><b>' + info.msg + '</b></li>'));
    // Pick random avatar for user
    $("#avatar-" + Math.floor((Math.random() * 12) + 1)).addClass('selected-avatar');
    socket.emit('update avatar', $('.selected-avatar').attr('src'), true);
  });
  socket.on('chat message', function(connectionObject){
    var avatar = $('<img class="circle avatar-chat tooltipped" src="'+ connectionObject.avatar +'" data-position="right" data-delay="50" data-tooltip="' + (new Date()).toLocaleTimeString() + '">').tooltip();
    var messageContent = $('<span><b>' + connectionObject.nickname + '</b>: ' + connectionObject.msg + '</span>');
    var message = $('<li class="valign-wrapper"></li>').append(avatar).append(messageContent);
    $('#messages').append(message);
  });
  socket.on('connected', function(info){
    notifyDOM(info);
  });
  socket.on('disconnected', function(info){
    notifyDOM(info);
  });
  socket.on('update avatar', function(connectionObject, connections){
    $('#profile-avatar').attr('src', connectionObject.avatar);
    updateUserList(connections);
  });
  socket.on('refresh navbar', function(connections){
    updateUserList(connections);
  });
};
function notifyDOM(info){
  $('#messages').append($('<li><b>' + info.msg + '</b></li>'));
  updateUserList(info.connections);
};

function updateUserList(connections){
  var usersOnline = connections.length;
  $('#users-online').nextAll().remove();
  $('#users-online-status').text('Users online: ' + usersOnline);
  for (var i = 0; i < usersOnline; i++){
    $('#slide-out').append($('<li class="valign-wrapper"><a class="waves-effect user" href="#!"><img class="circle avatar-sidenav-list" src="' + connections[i].avatar + '">' + connections[i].nickname + '</a></li>'));
  }
};

function selectAvatar(){
  $(document).on( 'click', '.avatar-image', function(){
    $('.selected-avatar')
        .removeClass('selected-avatar')
    $(this)
        .addClass('selected-avatar')
    var avatarSrc = $(this).attr('src');
    socket.emit('update avatar', avatarSrc);
    $('#image-select').modal('close');
  });
};

function attemptToJoin() {
  nickname = $('#nickname').val();
  if (nickname.length == 0){
    Materialize.toast('Your nickname cannot be the empty string', 3000, 'rounded');
  }else{
    socket.emit('attempt login', nickname);
  }
};
