var canvasEl = $("#example"),
    imgSrc = canvasEl.data("imgsrc"),
    imageEditor = $("#imageEditor"),
    processingModal = $('#myModal'),
    fileSelect = $("#fileSelect"),
    fileElem = $("#fileElem"),
    caman = Caman('#example', imgSrc, function () {
        //var e = this.toBase64(type = "png");
        //$("#downloadImg").attr('href', e);
    }),
    filters = {}; 

//Setup initial filter values
getInitialFilterValues();

//Change image when new image is selected from file
function handleFiles(files) {
  if (!files.length) {
    return;
  } else {
    
    for (var i = 0; i < files.length; i++) {
      var source = window.URL.createObjectURL(files[i]);
        caman.image.src = source;
        caman.render();
    }
  }
}

function getInitialFilterValues() {
    //Need to get all the current filter values to apply them latter on
    $('#imageEditor input[type=range]').each(function() {
         var filter;
        filter = $(this).data('filter');
        return filters[filter] = $(this).val();
    }); 
    console.log(filters);
}

function editImage(evt) {
    caman.revert(false);
    var filterChged = 'reset',
        filterChgedVal = 0;
    
    if (evt.target) {
        filterChged = evt.target.dataset.filter;
        filterChgedVal = evt.target.value; 
        evt.preventDefault();
    }
    
     for (filter in filters) {
         if(filter === filterChged) {
             filters[filter] = filterChgedVal;
             value = parseFloat(filterChgedVal, 10);
         } else {
            value = filters[filter];
            value = parseFloat(value, 10);     
         }
        if (evt !== 'reset' && value === 0) {
            continue;
        }
        caman[filter](value);
    }
    caman.render()
    
}

function editImagePreset(evt) {
    var preset;
    $('#myModal').modal('show');
    preset = evt.target.dataset.preset;    
    caman.revert(false);
    
    caman[preset]();
    caman.render(function() {
        $('#myModal').modal('hide');
    });
    evt.preventDefault();
}

function saveCanvasTwo(evt) {
  evt.preventDefault();
    var canvas = document.getElementById("example");
  var imageData = canvas.toDataURL('image/jpeg', 1),
      formData = {};
    formData.default = "Default";
    formData.image = imageData;
      //formData = new FormData();
    console.log(JSON.stringify(formData));
    //formData.append('albumName', 'default');
    //formData.append('fileData', imageData);
    
  var xhr = new XMLHttpRequest();
  xhr.addEventListener('load', function () { alert('uploaded!'); });
  xhr.open('POST', "/test/upload", true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.send(JSON.stringify(formData));
  
}

function saveCanvas() {
    var canvas = document.getElementById("example"),
     //imgURL = canvas.toDataURL(),
        dataString = JSON.stringify({data: canvas.toDataURL('image/jpeg')})
        $.ajax({
            url: '/test/upload',
            type: 'PUT',
            contentType: 'application/json',
            dataType: 'json',
            data: dataString,
            success: function () { alert('Done') }
        });
}

$("#saveImage").click(saveCanvas);

//When sliders change image will be updated via editImage() function
$("input[type=range]").change(editImage);
$("#PresetFilters").click(editImagePreset);

// Reset sliders back to their original values on press of 'reset'
$('#imageEditor').on('reset', function () {
	setTimeout(function() {
		editImage('reset');
	},0);
});

//Events for updating image src
$("#fileSelect").click(function (e) {
    //Event for clicking the file selection input box hides the ugle ui from user
  if (fileElem) {
      
    fileElem.click();
  }
  e.preventDefault(); // prevent navigation to "#"
});
    
