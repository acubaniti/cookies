// // var app = require('express')();
// // var http = require('http').Server(app);
// // // app.get('/', function(req, res){
// // //   res.send('<h1>Hello world</h1>');
// // // });
// // app.get('/', function(req, res){
// // res.sendFile(__dirname + '/index.html');
// // });
// // 
// // http.listen(3000, function(){
// //   console.log('listening on *:3000');
// // });
// var app = require('express')();
// var http = require('http').Server(app);
// var io = require('socket.io')(http);
// users = [];
// connections  = [];
// app.get('/', function(req, res) {
//     res.sendFile(__dirname + '/index.html');
// });
// io.on('connection', function(socket) {
//     console.log(socket.id + ' connected');
//     socket.on('disconnect', function() {
//         console.log(socket.id + ' disconnected');
//         // io.emit('user disconnected');
//     });
//     socket.on('chat message', function(msg) {
//         console.log(socket.id + ': ' + msg);
//         io.emit('chat message', socket.id + ': ' + msg);
//     });
// });
// http.listen(3000, function() {
//     console.log('listening on *:3000');
// });
// // io.on('connection', function (socket) {
// //   io.emit('this', { will: 'be received by everyone'});
// //   socket.on('private message', function (from, msg) {
// //     console.log('I received a private message by ', from, ' saying ', msg);
// //   });
// //   socket.on('disconnect', function () {
// //     io.emit('user disconnected');
// //   });
// // });
var express = require( 'express' );
var app = express();
var server = require( 'http' )
    .createServer( app );
var io = require( 'socket.io' )
    .listen( server );
users = [];
connections = [];
var socketCount = 0;
// Server start
server.listen( process.env.PORT || 3000 );
console.log( "Server started!" );
app.get( '/', function( req, res )
{
    res.sendFile( __dirname + '/index.html' );
    // res.sendFile(__dirname + '/css/main.css');
} );
io.sockets.on( 'connection', function( socket )
{
    // On Connect
    connections.push( socket );
    socketCount++;
    console.log( 'Connected: %s sockets connected', connections.length );
    // On Disconnect
    socket.on( 'disconnect', function( data )
    {
        // if(!socket.username) return;
        users.splice( users.indexOf( socket.username ), 1 );
        updateUsernames();
        socketCount--
        connections.splice( connections.indexOf( socket ), 1 );
        console.log( 'Disconnected: %s sockets connected', connections.length );
    } );
    // Send message
    socket.on( 'send message', function( data )
    {
        if ( data )
        {
            io.sockets.emit( 'new message'
            , {
                msg: data
                , user: socket.username
            } );
        }
        else
        {
            console.log( 'Nici un mesaj in text-field fmm' );
        }
    } );
    // New users
    socket.on( 'new user', function( data, callback )
    {
        if ( data )
        {
            callback( true );
            socket.username = data;
            users.push( socket.username );
            updateUsernames();
            // console.log( "new user" );
        }
        else
        {
            console.log( 'username gol' );
        }
    } );

    function updateUsernames()
    {
        io.sockets.emit( 'get users', users );
        // console.log( "new user Function" );
 
    };
} );