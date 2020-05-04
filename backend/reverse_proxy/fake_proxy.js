var WebSocket = require('ws');
var child_process = require('child_process');
console.log("Starting reverse proxy ")
const wsServer = new WebSocket.Server({ port: 8445 });
wsServer.on('connection', function connection(clientToProxySocket, request) {
 // Socket connection created
});

