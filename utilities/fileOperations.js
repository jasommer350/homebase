/**
 * Created with Home Web.
 * User: jasommer350
 * Date: 2015-01-18
 * Time: 04:57 PM
 * To change this template use Tools | Templates.
 */
var fs = require('fs'),
    fileOps = {
        rmDir: function(dir, callback) {
            //Simple directory delete, not recursive
            var fileRmCount = 0;
            fs.readdir(dir, function (err, list) {
                // Return the error if something went wrong
                if (err) {
                    callback(err)
                } else {
                    // For every file in the list
                    list.forEach(function (file) {
                        // Full path of that file
                        var path = dir + "/" + file;
                        // Remove the file
                        fs.unlink(path) //removes the file
                        fileRmCount += 1;
                    });
                    console.log(dir);
                    fs.rmdir(dir, function(err) {
                        if(err) throw err;
                        callback(null, fileRmCount);    
                    });
                }
            });
        }
    };
module.exports = fileOps;