var db = require("../database/dboperations")

function photoblogMain () {
    this.handleEditAlbumSave = function(req, res) {
        var dataString='';
        req.on('data', function(data) {
            dataString += data;
            //console.log(dataString);
        });
        
        req.on('end', function() {
           console.log("Done with Data");
        });
        
        res.send({status:'received save/edit'});
    };
    
    this.handleNewAlbum = function(req, res) {
        var dataString='';
        req.on('data', function(data) {
            dataString += data;
            //console.log(dataString);
        });
        
        req.on('end', function() {
           console.log("Done with Data");
        });
        
        res.send({status:'received save/edit'});
    };
    
    this.handleGetAllAlbums = function(req, res) {       
        db.findAllAlbums(req, res);
        //FTcY7jlkK2DenwJ6
    };

    this.handleGetAlbum = function(req, res) {
        var albumFolder = req.params.album || "defaults",
            albumId = req.params.albumId || "default";
        db.findAlbumJSON({ _id: albumId }, req, res);
    };
      
    
    this.handleAlbumDelete = function(req, res) {
        
    };
}

module.exports = photoblogMain;
