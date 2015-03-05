$('#enter-todos').hide();

//Options for the Data Manager - See Data Manager for definition of options
var options, dm;
    

function connectCB() {
    console.log('Connected to Server');
}
//Callback to run when event for the todos collection is allTodos from the server

function renderAllTodos(data) {
    var html = '';
    if(!data) return;
    data.forEach(function(k) {
        html += '<li>' + k.name + ' [<a href="javascript:" data-name="' + k.name + '" data-id="' + k.id + '" class="edit-todo">Edit</a>] [<a href="javascript:" data-id="' + k.id + '" class="remove-todo">Remove</a>]</li>';
    });
    $('#showAll').html(html);
    $('.remove-todo').on('click', removeTodo);
    $('.edit-todo').on('click', editTodo);
}
$('#add').on('click', saveTodo);
$('#joinrm').on('click', function( event ) {
    options = {
        connection: 'https://today-command.codio.io:9500',
        connectCB: connectCB,
        nickname: $('#name').val(),
        collections: [{
            'name': 'todos',
            'room': $('#room').val(),
            'subscribers': {
                'allTodos': renderAllTodos
            },
        }]
    };
    dm = new DataManager(options);
    $('#login-screen').hide();
    $('#enter-todos').show();
});
function saveTodo() {
    dm.pubData('todos', 'saveTodo', {
        id: Math.ceil(Math.random() * 1000),
        name: $('#text').val()
    }, savedToLocal);
    $("#text").val("");
}

function editTodo() {
    var name = $(this).data('name'),
        id = $(this).data('id'),
        updatedName = prompt('Update ' + name);
    if(updatedName && updatedName !== name) {
        dm.pubData('todos', 'updateTodo', {
            id: id,
            name: updatedName
        }, savedToLocal);
    }
}

function removeTodo() {
    dm.pubData('todos', 'deleteTodo', {
        id: $(this).data('id')
    }, savedToLocal);
}

function savedToLocal(savedToLocal) {
    //***** todo Need to check if it was saved to localstorage then need to update DOM
    console.log('Saved To Local?', savedToLocal);
}