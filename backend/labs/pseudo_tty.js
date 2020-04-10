var pty = require('node-pty');
var WebSocket = require('ws');
var child_process = require('child_process');





const websocketServer = new WebSocket.Server({ port: 8445 });


websocketServer.on('connection', function connection(ws,request) {

    console.log(request.headers);


    if (request.headers['sec-websocket-protocol'] != "TASK_MANAGEMENT_PROTOCOL")
    ws.on('message', function incoming(message) {
        // if the connection was established with 
        // the TASK_MANAGEMENT_POTOCOL then it means
        // that certain action should be perfomed in 
        // the container
        // The actions will be performed by spawning a 
        //child process
        ptyProcess.write(message);
    });
    else if (request.headers['sec-websocket-protocol'] == "TASK_MANAGEMENT_PROTOCOL")
    {
        ws.on('message', function incoming(message) {
            // if the connection was established with 
            // the TASK_MANAGEMENT_POTOCOL then it means
            // that certain action should be perfomed in 
            // the container
            // The actions will be performed by spawning a 
            //child process
            child_process.exec(message,shell='/bin/bash');
        });
    }


    // if the provieded protocol is not TASK_MANAGEMENT_PROTOCOL, it means 
    // that the data should be wrote to the pty
    if (request.headers['sec-websocket-protocol'] != "TASK_MANAGEMENT_PROTOCOL")
    ptyProcess.on('data', (data) => {
        ws.send(data);
    })
});

// Default shell, this pty will be used in an Ubuntu container

//If the pty needs to be moved on an Alipe container modify 
// the shell to sh(or ash) --> alipe doesn't have bash by default
var shell = 'bash'

var ptyProcess = pty.spawn(shell, [], {
    name: 'xterm-color',
    cols: 120,
    rows: 30,
    cwd: process.env.HOME,
    env: process.env
});