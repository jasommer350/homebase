var options = {
        connection: 'https://today-command.codio.io:9500',
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
    albumnNameEl = $("#albumnName"),
    jumboEl = $("#jumbo"),
    subhOneEl = $("#subhOne"),
    subhTwoEl = $("#subhTwo"),
    subhThreeEl = $("#subhThree");

//Sets handler for the form submission to sever for a new album request
$("#form-btn-submit").click(sendFormData);
console.log($("#form-btn-submit"));

//functions for getting current form values and sending the data
function sendFormData (evt) {
    evt.preventDefault();
    var formData = {
        albumnName: albumnNameEl.val(),
        jumbo: jumboEl.val(),
        subhOne: subhOneEl.val(),
        subhTwo: subhTwoEl.val(),
        subhThree: subhThreeEl.val()
    }
    console.log(formData);
    dm.pubData('photoblog', 'addAlbum', formData, savedToLocal);
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
                    '<h4>' + val.albumnName + ': <span class="label label-primary">' + val.template + '</span></h4>',
                    '</div>',
                    '<hr>',
                    '<div class="album-li-detail">',
                    '<p>' + val.jumbo + '</p><i><p>' + val.today + '</p></i>',
                    '</div> </li>'
                   ].join('');
    return template;
}

function connectCB() {
    console.log('Connected to Server');
}

function savedToLocal(savedToLocal) {
    //***** todo Need to check if it was saved to localstorage then need to update DOM
    console.log('Saved To Local?', savedToLocal);
}

function renderAllAlbums(data) {
    var html = '';
    if(!data) return;
    data.forEach(function(k) {
        html += listTemplate(k);
    });
    $('#data-list').html(html);
    //$('.remove-todo').on('click', removeTodo);
    //$('.edit-todo').on('click', editTodo);
}