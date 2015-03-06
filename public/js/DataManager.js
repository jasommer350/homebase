//Setups a socket connection to the server and then communicates information from collections back and forth
(function(global) {
    var _global = {};
    
    function DataManager(options) {
        //connection – The base socket endpoint
        //connectCB – The callback to be fired when the connection/reconnection is made
        //collections – A list of collections/end points/namespaces and their subscriber methods with callback.
        this.connection = options.connection;
        _global.collections = this.collections = options.collections;
        _global.isConnectionAlive = false;
        _global.connectCB = this.connectCB = options.connectCB;
        this.init();
    }
    
    DataManager.prototype.init = function() {
        //Over all this will make connections events on the main socket and setup sub sockets
        //for each collection you are listening for events on
        var self = _global = this,
            cs = self.collSockets = {}, //collection of sub sockets objects based on collections passed in
            c = self.collections,  //Used to loop over collections passed into options
            s = self.Socket = io(self.connection); //init new Socket connection
        
        //Listening for connection events on socket
        s.on('connect', self._connect);
        s.on('disconnect', self._disconnect);
        s.on('reconnect_attempt', self._reconnectAttempt);
        s.on('reconnect', self._reconnect);
        s.on('reconnect_error', self._reconnectError);
        s.on('reconnect_failed', self.reconnectFailed);
        
        //"Sub-Socket" for each collection
        c.forEach(function(coll) {
            var name = coll.name,
                _s = io(self.connection + '/' + name); //A socket connection for just the collection
            _s.on('connect', function() {
                console.log('Connected to' + name + ' Namespace Joining a room *Optional');
                //_s.emit('joinroom', coll.room);
            })
            Object.keys(coll.subscribers).forEach(function(mthd) {
                _s.on(mthd, coll.subscribers[mthd]); //Listens for the events defined in the options passed in for the collection and calls the callback
            });
            
            cs[name] = _s; //Loads the socket and the attached events and methods to a collection of sub-sockets            
        });
        
        return self;
    };
    
    DataManager.prototype.pubData = function(collection, endpoint, data, callback) {
        var self = this;
        
        if(_global.isConnectionAlive) {
            //Pulls up the socket that was stored in the init of the Data Manager for the particular collection and
            //emits the type of event that needs to be sent to the server and the json data object to send
            self.collSockets[collection].emit(endpoint, data);
        } else {
            saveToLocalStorage(collection, {
                "endpoint": endpoint,
                "data": data
            });
        }
        //Returns to callback wheter or not the data was saved to localstorage or not
        callback(!_global.isConnectionAlive);
    };
    
    DataManager.prototype.getData = function(collection, endpoint, callback) {
        var self = this;
          if(_global.isConnectionAlive) {
              self.collSockets[collection].emit(endpoint);
          } else {
              console.log("no data connection");
          }
          callback(_global.isConnectionAlive);
    };
    
    DataManager.prototype._connect = function() {
        _global.isConnectionAlive = true; //We have connection!
        //sync localstorage first since before we would have been disconnected
        var c = _global.collections;
        c.forEach(function(coll) {
            //For each collection to connect to loop
            //then get the data from that collection
            //and for each data point that needs to be synced sync it and emit the appropriate event to the server and its data
            var localData = getFromLocalStorage(coll.name);
            if (localData) {
                localData.forEach(function(data) {
                    _global.collSockets[coll.name].emit(data.endpoint, data.data);
                });
            }
            //Clear the localstorage
            clearCollection(coll.name);
        });
        //This is call back for after a connection is made
        _global.connectCB();
    }
    
    //Changes the is connection alive variable based on what is happening to the connection with the server
    DataManager.prototype._disconnect = function() {
        _global.isConnectionAlive = false;
    };
    DataManager.prototype._reconnectAttempt = function() {
        _global.isConnectionAlive = false;
    };
    DataManager.prototype._reconnect = function() {
        _global.isConnectionAlive = false;
    };
    DataManager.prototype._reconnectError = function() {
        _global.isConnectionAlive = false;
    };
    DataManager.prototype._reconnectFailed = function() {
        _global.isConnectionAlive = false;
    };
    
    function saveToLocalStorage(collection, data) {
        var savedData = getFromLocalStorage(collection),
            ls = savedData || [];
        ls.push(data);
        localStorage.setItem(collection, JSON.stringify(ls));
    }
    
    function clearCollection(collection) {
        localStorage.setItem(collection, null);
    }
    
    function getFromLocalStorage(collection) {
        return JSON.parse(localStorage.getItem(collection));
    }
    
    global.DataManager = DataManager;
})(this)