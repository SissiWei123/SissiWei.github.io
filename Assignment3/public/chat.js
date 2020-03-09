$(function () {
  var socket = io();
  var myName = "";
  var myColor = "";
  var userIndex = -1;
  var userList = [];
  var userHistory = [];

  $('form').submit(function(e){
    e.preventDefault(); // prevents page reloading
    var message = $('#m').val();
    if(message !== '') {
      socket.emit('chat message', message);
    }
    $('#m').val('').focus();
    return false;
  });

  socket.on('chat message', function(msg){
    if (msg.id === myName) {
      console.log("msg.id: " + msg.id);
      console.log("myName: " + myName);
      var myMsg = msg.info;
      console.log("myColor: " + myColor);
      $('#messages').append('<li><b style="color:' + myColor + '">'+ myMsg +'</b></li>');
    }
    else {
      $('#messages').append($('<li>').text(msg.info));
    }

    $('#messages').scrollTop($('#messages')[0].scrollHeight);
  });

  socket.emit('add user');

  socket.on('add user', function(msg){
    if (userIndex === -1){
      userIndex = msg.index;
      //$('#userName').append($('<li>').text("You are " + msg.nickName + " "));
      $('#userName').append("You are " + msg.nickName + " ");
      console.log("user name now is: " + msg.nickName);
      myName = msg.nickName;
      myColor = msg.userColor;
    }
  });

  socket.on('display history', function(msg){
    let text = "";
    for (let piece of msg){
      text = piece + "<br>";
      $('#messages').append(text);
    }
    $('#messages').scrollTop($('#messages')[0].scrollHeight);
  });

  socket.on('active user', function(msg){
    userList = msg;
    let text = "";
    for (let name of msg){
      text += name + "<br>";
    }
    document.getElementById("list").innerHTML = text;
  });

  socket.on('inactive user', function(msg){
    var userId = userList.indexOf(msg);
    userList.splice(userId, 1);

    let text = "";
    for (let name of userList){
      text += name + "<br>";
    }
    document.getElementById("list").innerHTML = text;
  });

  socket.on('change name', function(msg){
    var index = userList.indexOf(msg.oldName);
    userList[index] = msg.newName;

    if (msg.oldName === myName){
      document.getElementById("userName").innerHTML = "You are " + msg.newName;
      myName = msg.newName;
    }

    let text = "";
    for (let name of userList){
      text += name + "<br>";
    }
    document.getElementById("list").innerHTML = text;
  });


});
