var formidable = require('formidable'),
    util = require('util'),
    fs = require('fs'),
    db = require("../database/dboperations"),
    imgFolder = '/home/codio/workspace/public/img/',
    updatePhotoAlbum = function(albumNameId, picLocations, fileName) {
        return db.updateAlbum(albumNameId, picLocations, fileName);
    };

// function to encode file data to base64 encoded string
function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}

// function to create file from base64 encoded string
function base64_decode(base64str, file) {
    // create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
    var bitmap = new Buffer(base64str, 'base64');
    // write buffer to file
    fs.writeFileSync(file, bitmap);
    console.log('******** File created from base64 encoded string ********');
}

// convert image to base64 encoded string
//var base64str = base64_encode('kitten.jpg');
//console.log(base64str);
// convert base64 string back to image 
//base64_decode(base64str, 'copy.jpg');
function writeImgFile (dataUrl) {
    var
        dataString = dataUrl.split( "," )[ 1 ],
        buffer = new Buffer( dataString, 'base64'),
        extension = dataUrl.match(/\/(.*)\;/)[ 1 ],
        fullFileName = imgFolder + "test." + extension;
        fs.writeFileSync( fullFileName, buffer, "binary" );
}


function handleUploads () {
    this.handleEditImgSave = function(req, res) {
        var albumFolder = "defaults", dataString='';
        req.on('data', function(data) {
            
            dataString += data;
            //console.log(dataString);
        });
        
        req.on('end', function() {
           console.log("Done with Data");
            writeImgFile(dataString);
        });
        
        res.send({status:'received upload'});
        //.replace(/^data:image\/(png|gif|jpeg);base64,/,'')
        
    };
    
    this.handleImageUploads = function(req, res) {
        var form = new formidable.IncomingForm(),
            albumFolder = req.params.album || "defaults";
        form.uploadDir = imgFolder + albumFolder;
        form.keepExtensions = true;
        form.parse(req, function(err, fields, files) {
            var picFileLoc = files.SelectedFile.path;
            picFileLoc = picFileLoc.replace(imgFolder,'/img/');
            //console.log("Logs from Formidable: ");
            //console.log(fields);
            //console.log(files);
          var dbUpdateResults = updatePhotoAlbum(fields._id, fields.picLocation, picFileLoc);
          
          //res.writeHead(200, {'content-type': 'text/plain'});
          //res.write('received upload:\n\n');
          //res.end(util.inspect({fields: fields, files: files}));
          res.send({status:'received upload', picFileLoc: picFileLoc});
        });
        return;
    };
    
    this.handleAlbumPage = function(req, res) {
        var albumFolder = req.params.album || "defaults",
            albumId = req.params.albumId || "default";
        
        db.findAlbum({ _id: albumId }, req, res);
        //FTcY7jlkK2DenwJ6
    };
      
    this.handleAlbumPageTest = function(req, res) {
        var albumFolder = req.params.album || "defaults",
            albumId = req.params.albumId || "default";
        
        db.findAlbumTest({ _id: albumId }, req, res);
        //FTcY7jlkK2DenwJ6
    };
    this.handleImageDelete = function(req, res) {
        var albumFolder = req.params.album || "defaults",
            fileName = req.params.fileName || "default";
        fs.unlink(imgFolder + albumFolder + "/" + fileName, function (err) {
          if (err) {
            res.send({status:'could not delete image', error: err});    
          } ;
          console.log('successfully deleted image');
            res.send({status:'successfully deleted image'});
        });
    }
    
    this.handleImageDeleteGallery = function(req, res) {
        var albumFolder = req.params.album,
            fileName = req.params.fileName,
            albumid = req.params.albumid;
        db.removePicGallery(albumid, albumFolder, fileName, res, req);
    }
}

module.exports = handleUploads;
