//Is called from www in Bin folder to create a socket for the todo namespace
//using the server information when I created the Express App Server
module.exports = function(server) {
    var io = require('socket.io')(server);
 
    io.on('connection', function(socket) {
    	// the primary socket at '/' 
    	console.log("Socket Connected to Main");
    });
    
    //Passes socket connection for the namespace to a handler
    var todos = require('./todos.ws.js')(io),
        photoblog = require('./photoblog.ws.js')(io);
    return io;
}