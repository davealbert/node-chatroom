var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

app.listen(3000);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }
    res.writeHead(200);
    res.end(data);
  });
}

// Listen for a Connection Event
io.sockets.on('connection', function (socket) {

  // Upon connection send a message to the socket
  socket.emit('news', 'Welcome to chat!');
  io.sockets.in('lobby').emit('send room', 'welcome user: ' + socket.id);

  // room only
  socket.on('send room', function (data) {
     console.log(data);
     io.sockets.in(data.room).emit('new message', data.msg);
  });

  socket.on('subscribe', function (data) {
    socket.join(data.room);
    console.log("Join: These are the rooms: ", io.sockets.manager.rooms, data);
  });

  socket.on('unsubscribe', function (data) {
    socket.leave(data.room);
    console.log("Leave: These are the rooms: ", io.sockets.manager.rooms, data);
  });


});
