
var options = {
        connection: window.location.origin,
        connectCB: connectCB,
        nickname: $('#name').val(),
        collections: [{
            'name': 'photoblog',
            'room': 'None',
            'subscribers': {
                'allData': renderAllAlbums
            },
        }]
    },
    dm = new DataManager(options),
    col = [],
    albumnNameEl = $("#albumnName"),
    jumboEl = $("#jumbo"),
    subhOneEl = $("#subhOne"),
    subhTwoEl = $("#subhTwo"),
    subhThreeEl = $("#subhThree"),
    formDataIdEl = $("#data_id");

//Sets handler for the form submission to sever for a new album request
$("#form-btn-submit").click(sendFormData);
//Sets handler for edits and removal of data list items
//$("#data-list").on('click', dataItemChg, true);
document.getElementById("data-list").addEventListener("click",dataItemChg );

//functions for getting current form values and sending the data
function sendFormData (evt) {
    evt.preventDefault();
    var addOrUpdate = formDataIdEl.val(),
        formData = {
            albumnName: albumnNameEl.val(),
            jumbo: jumboEl.val(),
            subhOne: subhOneEl.val(),
            subhTwo: subhTwoEl.val(),
            subhThree: subhThreeEl.val()
        };
    if (addOrUpdate === 'new') {
        dm.pubData('photoblog', 'addAlbum', formData, savedToLocal)
    } else {
        formData._id = formDataIdEl.val();
        dm.pubData('photoblog', 'updateData', formData, savedToLocal)
        formDataIdEl.val('new') //Resets to new default
    }
}


//Listens for if an edit or remove button was clicked on the data list
function dataItemChg(evt) {
    var action = evt.target.dataset.action || null, chgId, getDataItem, itemData;
    if(action) {
        chgId = evt.path[4].id;  //Since this is a template I know that place 4 in the path will be the LI element that I need
        getDataItem = col.every(function(element, index, array) {
          if (element._id === chgId) {
              itemData = element
            return false;
          }
          return true;
        });   
        if(action === 'remove') {
            //Need to send remove to data manager to send to server
            dm.pubData('photoblog', 'deleteAlbum', itemData, savedToLocal);
        } else {
            populateForm(itemData);
        }
    }
}

function connectCB() {
    //console.log('Connected to Server');
    //console.log('Getting Data refresh');
    
    dm.getData('photoblog', 'getAllData', function(result) {
        console.log("Able to get data on connection?", result);
    });
}

function savedToLocal(savedToLocal) {
    //***** todo Need to check if it was saved to localstorage then need to update DOM
    console.log('Saved To Local?', savedToLocal);
}

function populateForm(data) {
    if(data) {
        albumnNameEl.val(data.albumnName),
        jumboEl.val(data.jumbo),
        subhOneEl.val(data.subhOne),
        subhTwoEl.val(data.subhTwo),
        subhThreeEl.val(data.subhThree)
        formDataIdEl.val(data._id);
        $("#backCreate").click(); //Triggers the event setup in the Nav for changing the view to the form
    }
}


function renderAllAlbums(data) {
    var html = '';
    if(!data) return;
    col = data; //Resets the data stored locally to match what is coming in from server - supports just one collection right now
    data.forEach(function(k) {
        html += listTemplate(k);
    });
    $('#data-list').html(html);
    //$('.remove-todo').on('click', removeTodo);
    //$('.edit-todo').on('click', editTodo);
}


function listTemplate (val) {
    //************** Add link
    var template = ['<li id="' + val._id + '" data-albumname="' + val.albumnName + '" class="list-group-item">',
                    '<div class="btn-grp-float-right">',
                    '<button type="button" class="btn btn-danger" id="destroyIng">',
                    '<span><i data-action="remove" class="fa fa-times fa-2x"></i></span></button>',
                    '<button type="button" class="btn btn-success" id="destroyIng">',
                    '<span><i data-action="edit" class="fa fa-pencil-square fa-2x"></i></span></button>',
                    '</div>',
                    '<div class="album-li-title">',
                    //<a href="/view/{{val.albumnName}}/{{val._id}}">{{val.albumnName|capitalize}}: </a>
                    '<h4><a href="/view/' + val.albumnName + '/' + val._id + '">' + val.albumnName + ': </a><span class="label label-primary">' + val.template + '</span></h4>',
                    '</div>',
                    '<hr>',
                    '<div class="album-li-detail">',
                    '<p>' + val.jumbo + '</p><i><p>' + val.today + '</p></i>',
                    '</div> </li>'
                   ].join('');
    return template;
}