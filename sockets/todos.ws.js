var todosDB = require('./todos.db');
module.exports = function(io) {
    //get the socket connection info from the index.js file in this folder which
    //got its server information from the www file in the bin folder
    var todos = io.of('/todos'),
        rooms = {};
    todos.on('connection', function(socket) {
        //Sets up the different events to listen for when the socket is communicating
        //on the todo namespace
        
        socket.on('joinroom', function(room) {
           socket.join(room); 
            // On connection send all the todos, to save one round trip
            dispatchAll(socket);
        });
        
        socket.on('getAllTodos', function() {
            dispatchAll(socket);
        });
        socket.on('saveTodo', function(todo) {
            todosDB.saveTodo(todo, function(err, data) {
                if(err) throw err; // You can emit the error to a socket	
                dispatchAll(socket);
            });
        });
        socket.on('updateTodo', function(data) {
            todosDB.updateTodo(data, function(err, data) {
                if(err) throw err; // You can emit the error to a socket 
                dispatchAll(socket);
            });
        });
        socket.on('deleteTodo', function(data) {
            todosDB.deleteTodo(data.id, function(err, data) {
                if(err) throw err; // You can emit the error to a socket 
                dispatchAll(socket);
            });
        });
        
    });

    function dispatchAll(socket) {
        todosDB.getAllTodos(function(err, data) {
            if(err) throw err; // You can emit the error to a socket 
            console.log(socket.rooms);
            io.of('/todos').emit('allTodos', data);
        });
    }
    return todos;
}