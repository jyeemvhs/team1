
let express = require('express');
let bodyParser = require('body-parser');
let routes = require("./routes");
let app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(routes);
let http = require('http');
/**
* Create HTTP server.
*/
let server = http.createServer(app);
////////////////////////////////
// Socket.io server listens to our app
let io = require('socket.io').listen(server);
let name = "";
let comment = "";
let x = 0;
let y = 0;
let offX;
let offY;
let color;
let size;
let numLobbies = 0;
let lobbies = [];
let numAccs = 0;
let account = [];
// Emit welcome message on connection
io.on('connection', function(socket) {
    // Use socket to communicate with this particular client only, sending it it's own id
    socket.emit('welcome', { message: 'Welcome!', id: socket.id});
    socket.on('getLobbyNum' , function(data) {
        socket.join("lobby" + data.lobbyNumber);
    });
    socket.on('signUp', function(data) {
        //signUp page to send to the server usernames and passwords to be stored in a database;
    })
    socket.on('update', function (data) {
        // Broadcast to everyone (including self)\
        io.emit('update',{Name:data.Name,Comment:data.Comment});
        name = data.Name;
        comment = data.Comment;
    });
/*
    io.on("connection", (socket) => {
        socket.on("say to someone", (id, msg) => {
            // send a private message to the socket with the given id
            socket.to(id).emit("my message", msg);
        });
    });
    */
    socket.on('updateCanvas', function (data) {
        // Broadcast to everyone (including self)\
        if (lobbies[data.lobbyNumber]){
            console.log("wow")
            io.to("lobby" + data.lobbyNumber + "").emit('updateCanvas',{x:data.x, y:data.y, offX:data.offX, offY:data.offY, color:data.color, size:data.size});

        }
        else
            return;
        x = data.x;
        y = data.y;
        offX = data.offX;
        offY = data.offY;
        color = data.color;
        size = data.size;
    });
    socket.on('clearListen', function (data) {
        if (lobbies[data.lobbyNumber]){
            io.to("lobby" + data.lobbyNumber + "").emit('clearListen', null);

        }
        else
            return;
    });
    socket.on('fillListen', function (data) {
        if (lobbies[data.lobbyNumber]){
            io.to("lobby" + data.lobbyNumber + "").emit('fillListen', {serverColor:data.serverCol});

        }
        else
            return;
    });
    socket.on('createLobby', function (data) {
        for (let i = 0;i<= numLobbies;i++){
            if (lobbies[i]){
                if (lobbies[i].password == data.pass){
                    return
                }
            }
        }
        lobbies[numLobbies] = {'password':data.pass, 'id1':data.id, 'numPlayers':1};
        console.log("lobby created with password " + lobbies[numLobbies].password + " by user of id " + lobbies[numLobbies].id1)
        io.to(data.id).emit('createLobby', {"lobbyNumber":numLobbies});
        numLobbies++;
    });
    socket.on('joinLobby', function (data) {
        for (let i = 0;i<= numLobbies;i++){
            if (lobbies[i]){
                if (lobbies[i].password === data.pass){
                    for (let k = 1;k <= lobbies[i].numPlayers;k++){
                        if (lobbies[i]["id" + k + ""] == data.id){
                            return;
                        }
                    }
                    lobbies[i].numPlayers++;
                    lobbies[i]["id" + lobbies[i].numPlayers + ""] = data.id;
                    console.log("Player with id " + lobbies[i]["id" + lobbies[i].numPlayers + ""] + " joined lobby")
                    io.to(data.id).emit('joinLobby', {"lobbyNumber":i});
                    for (let j = 1;j <= lobbies[i].numPlayers;j++){
                        console.log("player of id " + lobbies[i]["id" + j + ""] + " is present")
                    }
                }
            }
        }
    })

    socket.on('createAccount', function (data) {
        for (let i = 0;i <= numAccounts;i++){
            if (account[i]){
                if (account[i].username === data.username){
                    /*
                    for (let k = 1;k <= lobbies[i].numPlayers;k++){
                        if (lobbies[i]["id" + k + ""] == data.id){
                            return;
                        }
                    }
                    lobbies[i].numPlayers++;
                    lobbies[i]["id" + lobbies[i].numPlayers + ""] = data.id;
                    console.log("Player with id " + lobbies[i]["id" + lobbies[i].numPlayers + ""] + " joined lobby")
                    for (let j = 1;j <= lobbies[i].numPlayers;j++){
                        console.log("player of id " + lobbies[i]["id" + j + ""] + " is present")
                    }*/
                    return false;
                }
                else
                {
                    account[i].numAccs++;
                    account[i].password = data.password;
                    account[i].username = data.username;
                    account[i].userID = numAccs;
                }
            }
        }
    })
});
/**
* Listen on provided port, on all network interfaces.
*/
let port = process.env.PORT || 3000;
server.listen(port);

