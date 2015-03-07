/**
 * Created with Home Web.
 * User: jasommer350
 * Date: 2015-01-14
 * Time: 02:40 AM
 * To change this template use Tools | Templates.
 */
window.URL = window.URL || window.webkitURL;

(function(namespace, undefined) {
    var fileElem = document.getElementById("fileElem"),
    fileList = document.getElementById("fileList"),
    _progress = document.getElementById('_progress'),
    gallery = document.getElementById('gallery'),
    modalEl = $('#myModal'),
    modalImgEl = $('#modalImg'),
    modalAddEl = $('#myModalAdd'),
    albumName = document.getElementById('album-name'),
    originUrl = window.location.origin;
    
    //Sends a delete request to the server for a picture
    //apiPath is in the following format: /remove/:album/:fileName
    namespace.delete = function(apiPath) {
        var deleteRequest = new XMLHttpRequest();
        
        deleteRequest.onreadystatechange = function() {
            if(deleteRequest.readyState == 4) {
                var resp = JSON.parse(deleteRequest.response);
                
                console.log(resp);
            }
        };
        
        deleteRequest.open('DELETE', apiPath);
        deleteRequest.send();
    };
    
    //Adds a picture source from the server to the gallery section
    //on the DOM
    namespace.addGalleryImg = function(src) {
        var newGalleryFigEl = namespace.galleryTemplate(src);
        $(newGalleryFigEl).appendTo( "#gallery" );
    };
    
    //Template to create the gallery HTML to put into the DOM
    namespace.galleryTemplate = function(src) {
        var template = [
               '<figure class="col-md-3 col-sm-6 all" data-src="'+ src +'">',
                '<img src="'+ src +'" alt="This is a gallery thumbnail.">',
                '<figcaption>',
                    '<h4>What Do You Want To Do?</h4>',
                    '<p> Select an Option Below </p>',
                    '<button data-btn="view" class="btn btn-default">',
                        'View',
                    '</button>',
                    '<button data-btn="remove" class="btn btn-danger" >',
                        'Remove',
                    '</button>',
                '</figcaption>',
            '</figure>'
            ].join('');
        return template;
    }
    
    //Changes the img src to new upload pic src from server response or
    //if a gallery item will kick off process to create new HTML to insert into DOM
    namespace.updatePicSrc = function(picLoc, newSrc, albumName) {
        var img, originalFileName;
        if( picLoc === 'gallery') {
            namespace.addGalleryImg(newSrc);
        } else {
            img = document.getElementById(picLoc)
            originalFileName = img.src
            img.src = newSrc;
            namespace.checkPicDeletion(originalFileName, albumName);
        }
        
    };
    
    //If a pic is replacing another picture on the page this will send request to delete
    //the old pic from the server, only used with non-gallery changes
    namespace.checkPicDeletion = function (originalFileName, albumName) {
        //albumName is assumed to be the album html elemenet with a data-album attr.
        if( window.location.origin + window.location.pathname === originalFileName) {
            console.log("No Pic to delete")
        } else {
            console.log('Deleting Pic')
            originalFileName = originalFileName.split("/").pop();
            namespace.delete(originUrl + '/remove/' + albumName.dataset.album + "/" + originalFileName);
        }  
    };
    
    //Main function for uploading the picture to the server then kicking off the process to 
    //change the image source and delete the old picture if this one is replacing an old pic
    namespace.upload = function(event) {
        if(fileElem.files.length === 0) {
            return;
        }
        var data = new FormData(),
            request = new XMLHttpRequest(),
            picloc = document.getElementById("picLocation").value,
            files = event.target.files,
            updatePicSrc = namespace.updatePicSrc;

        //Setup data to send in FormData object
        data.append('SelectedFile', files[0]);
        data.append('albumName', albumName.dataset.album);
        data.append('picLocation', picloc);
        data.append('_id', albumName.dataset.id);
        
        request.onreadystatechange = function() {
            if(request.readyState == 4) {
                var resp = JSON.parse(request.response);
                //Update the src if other changes need to be made before a new page request is made 
                //and the src is updated.
                updatePicSrc(picloc, resp.picFileLoc, albumName);
            }
        };
        request.open('POST', originUrl + '/upload/' + albumName.dataset.album);
        request.send(data);
        modalAddEl.modal('hide');
        
    };
    
    //Setup Event Handlers for Photoblog
    //This event handler will process a new photo upload
    fileElem.onchange = namespace.upload;
    
    //myModalAdd
    $("#addPics").click(function() {
        modalAddEl.modal('show');
    })
    
    //This handler will listen for the delete and view events on the gallery images
    gallery.addEventListener('click', function(event) {
        
        var myNodelist = event.path, i=0, nodeListLen = myNodelist.length, nodeElSrc, nodeParentEl, originalFileName;
        event.preventDefault();
        
        for (i; i <	nodeListLen; i++) {
            var nodeEl = myNodelist[i];
            //Looking for the figure element the withen the figure element I want to find the img.src value (childNodes[1])
            if( nodeEl.nodeName === 'FIGURE' )
                nodeElSrc = nodeEl.dataset.src;
        }
        
        if (event.target.dataset.btn === 'remove') {
            originalFileName = nodeElSrc.split("/").pop()
            console.log("Remove from this album: ", albumName.dataset.album);
            console.log("File Name: ", originalFileName);
            $('figure[data-src="/img/' + albumName.dataset.album + '/' + originalFileName + '"]').remove();
            namespace.delete(originUrl + '/remove/gallerypic/' + albumName.dataset.album + '/' + albumName.dataset.id + "/" + originalFileName);
        } else {
            modalImgEl.attr("src", nodeElSrc);
            modalEl.modal('show');
        }
    });
    
})(window.photoblog = window.photoblog || {});
