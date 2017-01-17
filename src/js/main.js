var nickname;
var socket = io();
socket.on('login response', function(res, err){
  if (res){
    $('#modal1').modal('close');
    $('#nickname-navbar').text(nickname);
    openSocket(nickname);
  }else{
    Materialize.toast(err.error, 3000, 'rounded');
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
    socket.emit('update avatar', true);
  });
  socket.on('chat message', function(connectionObject){
    var avatar = $('<div class="chat-avatar" style="background-image: url(' + connectionObject.avatar + ')">');
    var nickname = $('<div class="chat-nickname">' + connectionObject.nickname + '</div>');
    var message = $('<div class="message-content"></div>').text(connectionObject.msg);
    var messageContent = $('<div flex></div>').append(nickname).append(message);
    var date = $('<div class="timestamp">' + (new Date()).toLocaleTimeString() + '</div>');
    emojify.run(message[0]);
    var message = $('<li class="valign-wrapper message-wrapper" layout horizontal></li>').append(avatar).append(messageContent).append(date);
    $('#messages').append(message);
  });
  socket.on('connected', function(info){
    notifyDOM(info);
  });
  socket.on('disconnected', function(info){
    notifyDOM(info);
  });
  socket.on('update avatar', function(connectionObject, connections){
    Materialize.toast("Your avatar has been updated", 3000, 'rounded');
    $('#avatar').attr('src', connectionObject.avatar);
    updateUserList(connections);
  });
  socket.on('refresh navbar', function(connections){
    updateUserList(connections);
  });
  socket.on('populate profile', function(connectionObject){
    $('#profile-avatar').attr('src', connectionObject.avatar);
    $('#profile-nickname').text(connectionObject.nickname);
    $('#profile-activity').text(connectionObject.lastActive);
    $('#modal2').modal('open');
  })
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
    $('#slide-out').append($('<li class="valign-wrapper" onClick="socket.emit(\'view profile\', this.id)" id="' + connections[i].nickname + '"><a class="waves-effect user" href="#!"><img class="circle avatar-sidenav-list" src="' + connections[i].avatar + '">' + connections[i].nickname + '</a></li>'));
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

var typing = false;
var timeout;
function finishedTyping(){
  typing = false;
  socket.emit('typing');
};
$("#m").keypress(function(event){
  // Only monitor activity when user is pressing any key other than enter key
  if (event.keyCode != 13){
    if (!typing){
      typing = true;
      socket.emit('typing');
    }else{
      clearTimeout(timeout);
      timeout = setTimeout(finishedTyping, 3000);
    }
  }
});
