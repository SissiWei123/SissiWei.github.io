var app = require('express')();  //function handler to supply to a http server
var http = require('http').createServer(app);
var io = require('socket.io')(http);
//var port = process.env.PORT || 3000;
var path = require('path');
var express = require('express');
app.use(express.static(path.join(__dirname, 'public')));


var Names = [ 'Alice', 'Bob', 'Clark', 'David', 'Eva', 'Frank', 'Gabby' ];
var Colors = [ 'red', 'green', 'blue', 'magenta', 'purple', 'plum', 'orange' ];
var userIndex = 0;
var userList = [];
var history = [];

app.get('/', function(req,res) {     // '/' route handler
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
  // console.log('a user connected');
  // socket.on('connect', function(){
  //   socket.emit('display history', history);
  // });

  socket.on('disconnect', function(){
    io.emit('inactive user', socket.username);
  });

  var timestamp = new Date().toLocaleTimeString();

  socket.on('chat message', function(msg){
    var input = msg.toString();

    if (input.includes("/nick")){
      var oldName = socket.username;
      var arr = msg.split(" ");
      if (arr.length === 2){
        var newName = arr[1];
      }
      io.emit('change name', {
          oldName : socket.username,
          newName : newName
      });
      socket.username = newName;
    }
    if (input.includes("/nickcolor")){

    }
    else {
      //var colorIndex = userList.indexOf(socket.username);
      //var setColor = Colors[colorIndex];
      var text = timestamp +"   " + socket.username + "  : " + msg;
      //text.fontcolor(setColor);
      history.push(text);

      io.emit('chat message',{
        info: text,
        id: socket.username,
      });
    }
  });


  socket.on('add user', function(){
    io.emit('add user', {
      index: userIndex,
      nickName: Names[userIndex],
      userColor: Colors[userIndex]
    });

    socket.username = Names[userIndex];
    userList.push(socket.username);

    io.emit('active user', userList);
    ++userIndex;

    socket.emit('display history', history);
  });

});

http.listen(3000, function() {       // http hander listen on port 3000
  console.log('listening on *:3000');
});
