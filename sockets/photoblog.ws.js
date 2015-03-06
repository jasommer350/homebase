var fs = require('fs'),
    db = require("../database/dboperations")

module.exports = function(io) {
    //get the socket connection info from the index.js file in this folder which
    //got its server information from the www file in the bin folder
    var album = io.of('/photoblog'),
        rooms = {},
        imgFolder = '/home/codio/workspace/public/img/';
    album.on('connection', function(socket) {
        //Sets up the different events to listen for when the socket is communicating
        //on the todo namespace
        socket.on('joinroom', function(room) {
           socket.join(room); 
            // On connection send all the todos, to save one round trip
            dispatchAll(socket);
        });
        
        socket.on('getAllData', function() {
            dispatchAll(socket);
        });
        socket.on('updateData', function(data) {
            db.updateData(data, function(err, data) {
                if(err) throw err; // You can emit the error to a socket 
                dispatchAll(socket);
            });
        });
        socket.on('deleteData', function(id) {
            db.removeData(id, function(err, data) {
                if(err) throw err; // You can emit the error to a socket 
                dispatchAll(socket);
            });
        });
        socket.on('findById', function(data) {
            dispatchOne(socket, data);
        });
        //Unique method since some special things are done when creating an album
        socket.on('addAlbum', function(data) {
            db.saveNewAlbum(data, function(err, dataReturned) {
                if(err) throw err; // You can emit the error to a socket
                fs.mkdir(imgFolder + data.albumnName,function(e){
                    if(e) throw e;
                    dispatchAll(socket);
                });
            });
        });  
    });

    function dispatchOne(socket, data) {
        db.findById(id, function(err, data) {
            if(err) throw err; // You can emit the error to a socket 
            io.of('/photoblog').emit('oneRecord', data);
        });
    };
    function dispatchAll(socket) {
        db.findAllDataJSON(function(err, data) {
            if(err) throw err; // You can emit the error to a socket 
            //console.log(socket.rooms);
            console.log(data);
            io.of('/photoblog').emit('allData', data);
        });
    }
    return album;
}