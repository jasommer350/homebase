var UploadHandler = require('./uploads'),
    PhotoblogMain = require('./photoblogMain');


module.exports = exports = function(app) { 
    
    var uploadHandler = new UploadHandler(),
        photoblogMain = new PhotoblogMain();
    
    /* GET home page. */
    app.get('/', checkUser, function(req, res) {
      res.render('test',{});
    });
    
    app.get('/view/photoblog/main', photoblogMain.handleGetAllAlbums);
    
    app.get('/view/:album/:albumId', uploadHandler.handleAlbumPage);
    app.post('/upload/:album', uploadHandler.handleImageUploads);
    app.delete('/remove/:album/:fileName', uploadHandler.handleImageDelete);
    app.delete('/remove/gallerypic/:album/:albumid/:fileName', uploadHandler.handleImageDeleteGallery);
    
    app.get('/testview/:album/:albumId', uploadHandler.handleAlbumPageTest);
    
    app.get('/edit/:picurl?', function(req, res) {
        res.render('photoedit', {});
    });
    app.post('/test/upload', uploadHandler.handleEditImgSave);
    app.put('/test/upload', uploadHandler.handleEditImgSave);
    
    // ***** Todo Route ***
    app.get('/todo', function(req, res) {
        res.render('todo',{});
    });
    
    /* GET Signin page. */
    app.get('/signin', function(req, res) {
      res.render('signin',{});
    });

    app.post('/signin', function (req, res) {
        var dataObj = '', saveResults;
        req.signinJSON = {};
        req.on('data', function (data) {
            dataObj += data;
            //Some suggest added a check to make sure request is not to big
        });
        req.on('end', function () {
            try {
                req.signinJSON = JSON.parse(dataObj);
                //Check username
                res.cookie("Username", req.signinJSON.username);
                res.redirect(302, "/");

            } catch (e) {
                console.log(e);
                res.status(400).send({
                    msg: "Error - data sent was not in proper JSON format or JSON type"
                })
            }
        });
    });
    
    
    
    
}

function checkUser (req, res, next) {
    next();
}
