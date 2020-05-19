var WebSocket = require('ws');
var child_process = require('child_process');

console.log("reverse proxy started")
var close_reason = ""
const wsServer = new WebSocket.Server(
	{
		port:443,
		maxPayload:1024
	}
);
wsServer.on('connection',function connection(clientToProxySocket,request) {
	connection_alive = true;
	username = getUsername(request.headers.cookie);
	console.log(username);
	if(username == undefined)
	{
		console.log("Closing clientToProxy socket, credentials not provided");
		clientToProxySocket.close();
		return;
	}
	var proxyToServerSocketSubProtocol = '';
	if(request.headers['sec-websocket-protocol'])
		proxyToServerSocketSubProtocol = request.headers['sec-websocket-protocol'];
	var proxyToServerSocket = undefined;
	if (proxyToServerSocketSubProtocol != "TASK_MANAGEMENT_PROTOCOL") {
		var serverHost = `lab_${username}`;
		child_process.exec(
			`docker run -d --rm --network=ag_backend --name ${serverHost} ag_lab` , 
			(error,stdout,stderr) => {
				if(error) 
				{
					console.log("RRROR");
					console.log(error);
					clientToProxySocket.close();
					connection_alive = false;
				}
				else 
				{
					console.log(stdout);
					console.log(stderr);
					proxyToServerSocket = new WebSocket(`ws://${serverHost}:443`);
					console.log("Created websocket :");
					if (proxyToServerSocket == undefined) {
						console.log("proxyToServerSocket is undefined");
						return;
					}


					proxyToServerSocket.onopen = function () {
							console.log("proxyToServerSocket opened");
							clientToProxySocket.send("Conexiunea a fost stabilita cu succes, apasa ENTER pentru a incepe");
					};


					//when data from the server is recieved, write 
					// the data back to the clientToProxySocket
					proxyToServerSocket.on('message', function (message) {
						clientToProxySocket.send(message);
					});

					// If the proxy <---> server connection closes, also close the client <---> proxy 
					// connection
					proxyToServerSocket.onclose = function () {
						console.log(
							"The connection between the proxy and the server has been closed , " +
							"closing the serverToProxySocket"
						)
						// close the clientToProxySocket
						clientToProxySocket.close();
					};


					// If an error occurs, then close the 
					// client <---> proxy connection
					proxyToServerSocket.onerror = function (e) {
						console.log(
							"Line 102 in reverse_proxy.js --> ",
							"The connection between the proxy and the server didn't succed , " +
							"closing the serverToProxySocket"
						)
						console.log(e);
						close_reason = "Proxy <---> Server connection failed "
						// close the server to proxy socket
						clientToProxySocket.close();
						// remove the allocated container
						//removeAllocatedContainer(serverHost);
					};


					// add close handler when the connection 
					// between the client and the proxy server 
					// terminates
					clientToProxySocket.onclose = function () {
						console.log("Line 120 : ", "clientToProxySocket closed ");
						console.log("Server host is:")
						console.log(serverHost);
						removeAllocatedContainer(serverHost);
						connection_alive = false;
					}
					if (connection_alive == false)
						return;


					// add event listener for the incoming messages on the client to proxy socket
					clientToProxySocket.on('message', function incoming(message) {
						//console.log("Recieved message : ", message)
						// write message on the proxyToServerSocket
						try {
							// write to the proxyToServerSocket only if
							// the connection is ready 
							if (proxyToServerSocket.readyState == 1)
								proxyToServerSocket.send(message);
						}
						catch (error) {
							console.log(error.message);
						}
					});
				}
			}
		)
		if(connection_alive == false)  return;
	}
	else if (proxyToServerSocketSubProtocol == "TASK_MANAGEMENT_PROTOCOL") {
		var proxyToServerSocket = new WebSocket(`ws://lab_${username}:443`,"TASK_MANAGEMENT_PROTOCOL");
		proxyToServerSocket.onopen = function () {
			console.log("TMW open");
		}
		proxyToServerSocket.onerror = function (e) {
			console.log("TMW error : ",e);
		}
		proxyToServerSocket.onclose = function () {
			//TODO
		}

		clientToProxySocket.on('message', function (message) {
			console.log("TMW message received: ", message);
			console.log("Received message will be sent to the proxyServerToSocket");
			if(proxyToServerSocket.readyState == 1)
			proxyToServerSocket.send(message);
			else 
			{
				console.log("proxyToServerSocket is not ready");
				
			}
		});
	}
});


function removeAllocatedContainer(serverHost) {
	console.log("Removing allocated container");
	child_process.exec(`docker stop ${serverHost} &`);
}


function getUsername(cookie) {
	var username = undefined;
	if(cookie == undefined) return undefined;
	cookie.split("; ").forEach(cookie => {
		let [name, value] = cookie.split("=");
		if (name == "username" && value) {
			username = value
		}
	});
	return username;
}


function prettyPrint(header,content)
{
	console.log("-----------", header.toUpperCase(), "-----------");
	console.log(content);
	console.log("-----------", header.toUpperCase(), "-----------");
}