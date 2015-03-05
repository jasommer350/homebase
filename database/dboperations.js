/**
 * Created with Home Web.
 * User: jasommer350
 * Date: 2015-01-18
 * Time: 04:57 PM
 * To change this template use Tools | Templates.
 */
var fs = require('fs'),
    Datastore = require('nedb'),
    imgFolder = '/home/codio/workspace/public',
    dbOps = {
        db: null,
        opendb: function(filename) {
            // Of course you can create multiple datastores if you need several
            // collections. In this case it's usually a good idea to use autoload for all collections.
            //db = {};
            //db.users = new Datastore('path/to/users.db');
            //db.robots = new Datastore('path/to/robots.db');
            this.db = new Datastore({
                filename: filename,
                autoload: true
            });
            return this.db;
        },
        findAllDataJSON: function(callback) {
            // The same rules apply when you want to only find one document
            this.db.find({}, callback);
        },
        findByIdJSON: function(_id, callback) {
          this.db.find({_id:_id}, callback);  
        },
        updateData: function(data, callback) {
            this.db.update({
            id: data._id
        }, data, {}, callback);
        },
        removeData: function(_id, callback) {
          this.db.remove({
                id: _id
            }, {}, callback);  
        },
        saveNewAlbum: function(data, callback) {
            //db.todos.insert(todo, callback);
            var doc = {
                albumnName: data.albumnName,
                template: "default",
                jumbo: data.jumbo,
                subhOne: data.subhOne,
                subhTwo: data.subhTwo,
                subhThree: data.subhThree,
                picLocations: {
                    "gallery": [],
                    "subheading-one": null,
                    "subheading-two": null,
                    "subheading-three": null,
                    "jumbopic": null
                },
                today: new Date()
            };
            this.db.insert(doc, callback);
        },
        updateAlbum: function(_id, picLocation, filename) {
            /// If we insert a new document { _id: 'id6', fruits: ['apple', 'orange', 'pear'] } in the collection,
            // $push inserts new elements at the end of the array
            //db.update({ _id: 'id6' }, { $push: { fruits: 'banana' } }, {}, function () {
            // Now the fruits array is ['apple', 'orange', 'pear', 'banana']
            //});

            var picLocationSetString;
            
            if (picLocation === 'gallery') {
                picLocationSetString = {
                    $push: {}
                };
                picLocationSetString.$push["picLocations." + picLocation] = filename;
            } else {
                picLocationSetString = {
                    $set: {}
                };
                picLocationSetString.$set["picLocations." + picLocation] = filename;    
            }
            
            // Set an existing field's value
            this.db.update({
                _id: _id
            }, picLocationSetString, {
                multi: false
            }, function(err, numReplaced) {
                if(err) {
                    return err;
                } else {
                    return _id + " :" + numReplaced;
                }
            });
        },
        removePicGallery: function(_id, albumName, fileName, res, req) {
            var galleryPullString = {
                    $pull: {}
                };
            // $pull removes all values matching a value or even any NeDB query from the array
            fileName = "/img/" + albumName + "/" + fileName;
            galleryPullString.$pull["picLocations.gallery"] = fileName;
            
            this.db.update({ _id: _id }, galleryPullString, {}, function (err, numReplaced) {
                if(!err && numReplaced > 0) {
                    fs.unlink(imgFolder + fileName, function (err) {
                      if (err) {
                        res.send({status:'Removed from db but could not delete image: ' + fileName + " from the server", error: err});    
                      } ;
                      res.send({status:'successfully deleted image'});      
                    });    
                } else {
                    res.send({status:'could not delete image: '+ fileName + ' from db', error: err});
                }          
            });  
        },
        findAlbum: function(query, req, res) {
            // The same rules apply when you want to only find one document
            this.db.findOne(query, function (err, doc) {
                if(doc) {
                    res.render('index', {doc:doc});
                } else {
                    res.render('404', {});
                }
            });

        },
        findAllAlbums: function(req, res) {
            // The same rules apply when you want to only find one document
            this.db.find({}, function (err, doc) {
                if(doc) {
                    //console.log(doc);
                    res.render('photoalbums', {doc:doc});
                } else {
                    res.render('404', {});
                }
            });

        },
        findAlbumTest: function(query, req, res) {
            // The same rules apply when you want to only find one document
            this.db.findOne(query, function (err, doc) {
                if(doc) {
                    
                    res.render('test', {doc:doc});
                } else {
                    res.render('404', {});
                }
            });

        }
    };
module.exports = dbOps;