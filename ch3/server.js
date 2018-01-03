var WebSocket = require('ws');
var WebSocketServer = WebSocket.Server,
wss = new WebSocketServer({ port: 8181 });
var uuid = require('node-uuid');
var clients = [];
var group =[];

// var oSetting = new ActiveXObject("rcbdyctl.Setting"); 
// var ip = oSetting.GetIPAddress; 
// console(ip); 

// function wsSend(type, client_uuid, nickname, message) {
//     for (var i = 0; i < clients.length; i++) {
//         var clientSocket = clients[i].ws;
//         if (clientSocket.readyState === WebSocket.OPEN) {
//             clientSocket.send(JSON.stringify({
//                 "type": type,
//                 "id": client_uuid,
//                 "nickname": nickname,
//                 "message": message
//             }));
//         }
//     }
// }

//helper
function findOpId(id){
    if(id%2 == 0){
        return id+1;
    }
    else{
        return id-1;
    }
}

function packetSend(id,type,info,target,attribute,value){
    var packet = JSON.stringify({
        "type": type,
        "info": info,
        "target": target,
        "attribute": attribute,
        "value":value
    })
    if(clients[id] != undefined && clients[id] != -1){
        var clientSocket = clients[id].ws;
        if (clientSocket.readyState === WebSocket.OPEN) {
            clientSocket.send(packet);
        }
    }
}

function packSend(id, data){
    if(clients[id] != undefined && clients[id] != -1){
        var clientSocket = clients[id].ws;
        if (clientSocket.readyState === WebSocket.OPEN) {
            clientSocket.send(data);
        }
    }
}


// var clientIndex = 1;
// wss.on('connection', function(ws) {
//     var client_uuid = uuid.v4();
//     var nickname = "AnonymousUser" + clientIndex;
//     clientIndex += 1;
//     clients.push({ "id": client_uuid, "ws": ws, "nickname": nickname });
//     console.log('client [%s] connected', client_uuid);
//     var connect_message = nickname + " has connected";
//     wsSend("notification", client_uuid, nickname, connect_message);
//     console.log('client [%s] connected', client_uuid);
//     ws.on('message', function(message) {
//         if (message.indexOf('/nick') === 0) {
//             var nickname_array = message.split(' ');
//             if (nickname_array.length >= 2) {
//                 var old_nickname = nickname;
//                 nickname = nickname_array[1];
//                 var nickname_message = "Client " + old_nickname + " changed to " + nickname;
//                 wsSend("nick_update", client_uuid, nickname, nickname_message);
//             }
//         } else {
//             wsSend("message", client_uuid, nickname, message);
//         }
//     });
//    var closeSocket = function(customMessage) {
//         for (var i = 0; i < clients.length; i++) {
//             if (clients[i].id == client_uuid) {
//                 var disconnect_message;
//                 if (customMessage) {
//                     disconnect_message = customMessage;
//                 } else {
//                     disconnect_message = nickname + " has disconnected";
//                 }
//                 wsSend("notification", client_uuid, nickname, disconnect_message);
//                 clients.splice(i, 1);
//             }
//         }
//     };
//     ws.on('close', function () {
//         closeSocket();
//     });
//     process.on('SIGINT', function () {
//         console.log("Closing things");
//         closeSocket('Server has disconnected');
//         process.exit();
//     });
// });


// on connection assgin id for each ws
var clientIndex = 0;
wss.on('connection', function(ws) {
    var client_id = clientIndex;
    for(var i = 0; i < clientIndex; i++){
        if (clients[i] === -1){
            client_id = i;
        }
    }
    //var nickname = "AnonymousUser" + clientIndex;
    clientIndex += 1;
    //clients.push({ "id": client_id, "ws": ws});
    clients[client_id] = {"id": client_id, "ws": ws};
    console.log('client [%s] connected', client_id);
    var connect_message = client_id + " has connected";
    packetSend(client_id,"msg",connect_message,null,null,null);
    packetSend(client_id,"assignID",client_id,null,null,null);
    console.log('client [%s] sent', client_id);




    // ws.on('message', function(message) {
    //     if (message.indexOf('/nick') === 0) {
    //         var nickname_array = message.split(' ');
    //         if (nickname_array.length >= 2) {
    //             var old_nickname = nickname;
    //             nickname = nickname_array[1];
    //             var nickname_message = "Client " + old_nickname + " changed to " + nickname;
    //             wsSend("nick_update", client_id, nickname, nickname_message);
    //         }
    //     } else {
    //         wsSend("message", client_id, nickname, message);
    //     }
    // });

    ws.onmessage = function (e) {
        var data = JSON.parse(e.data);
        console.log("clid:%s, id:%s, type:%s,  info:%s",client_id,data.id, data.type, data.info);
        if(data.type === "msg"){
            console.log("clid:%s, id:%s, type:%s,  info:%s",client_id,data.id, data.type, data.info);
            group[client_id] = "ready";
            var op = findOpId(client_id);
            if(clients[op] != -1 && clients[op] != undefined && group[op] === "ready"){
                console.log("sending draw info");
                packetSend(client_id,"draw",null,0,null, 5);
                packetSend(op,"draw",null,0,null, 5);
                var rand = Math.random();
                console.log(rand);
                if(rand < 0.5){
                    packetSend(client_id, "start",null,null,null,null);
                }
                else{
                    packetSend(op, "start",null,null,null,null);
                }
            }
        }
    else{
        var op = findOpId(client_id);
        packSend(op, e.data);
        console.log("pack from " + client_id + " transfer to "+op);
    }
}

var closeSocket = function(customMessage) {
    var disconnect_message;
    if (customMessage) {
        disconnect_message = customMessage;
    } else {
        disconnect_message = client_id + " has disconnected";
    }
    console.log(disconnect_message);
        //clients.splice(client_id, 1);
        clients[client_id] = -1;
        clientIndex -= 1;
        //TODO  friends or random
        
    };
    ws.on('close', function () {
        closeSocket();
    });
    process.on('SIGINT', function () {
        console.log("Closing things");
        closeSocket('Server has disconnected');
        process.exit();
    });
});