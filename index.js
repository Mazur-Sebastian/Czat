const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const UsersService = require('./UsersService');

const userService = new UsersService();

app.use(express.static(path.resolve(__dirname, 'public')));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/client/index.html');
});

io.on('connection', function(socket) {
    //nasłuchuje wejścia do czatu
    socket.on('join', function(name) {
        // użytkownika, który pojawił się w aplikacji zapisujemy do serwisu trzymającego listę osób w czacie
        userService.addUser({
            id: socket.id,
            name
        });
        // aplikacja emituje zdarzenie update, które aktualizuje informację na temat listy użytkowników każdemu nasłuchującemu na wydarzenie 'update'
        io.emit('update', {
            users: userService.getAllUsers()
        });
    });
});

io.on('connection', function(socket) {
    socket.on('disconnect', () => {
        userService.removeUSer(socket.id);
        socket.broadcast.emit('update', {
            users: userService.getAllUsers()
        });
    });
});

io.on('connection', function(socket) {
    socket.on('message', function(message) {
        const {name} = userService.getUserById(socket.id);
        socket.broadcast.emit('message', {
            text: message.text,
            from: name
        });
    });
});

server.listen(8000, function () {
    console.log('listening on *:8000');
});