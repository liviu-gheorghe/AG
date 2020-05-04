var WebSocket = require('ws');
var child_process = require('child_process');

console.log("reverse proxy started")
var close_reason = ""
const wsServer = new WebSocket.Server({port:443});
wsServer.on('connection',function connection(clientToProxySocket,request) {
	connection_alive = true;
	if(isValidConnection(request)  == false)
	{
		console.log("Closing clientToProxy socket, credentials not provided");
		clientToProxySocket.close();
		return;
	}
	var proxyToServerSocketSubProtocol = '';
	if(request.headers['sec-websocket-protocol'])
		proxyToServerSocketSubProtocol = request.headers['sec-websocket-protocol'];
	var serverHost = '127.0.0.1';
	if (process.env.LAB_HOST) serverHost = process.env.LAB_HOST;
	var proxyToServerSocket = undefined;
	if (proxyToServerSocketSubProtocol != "TASK_MANAGEMENT_PROTOCOL") {
		serverHost = `lab_${Math.round(Math.random() * 1000)}`;
		var spawned_process = child_process.spawnSync("docker", ["run", "-d", "--rm","--network","ag_backend", "--name", `${serverHost}`,"ag_lab"]);

		console.log("Spawned process status: ",spawned_process.status);
		console.log(spawned_process.stdout.toString());
		console.log(spawned_process.stderr.toString());



		if(spawned_process.stderr.toString()) 
		{
			console.log(spawned_process.stderr.toString());
			clientToProxySocket.close();
			return;
		}


		proxyToServerSocket = new WebSocket(`ws://${serverHost}:443`);
		console.log("Created websocket :");
		console.log(proxyToServerSocket);
		if(proxyToServerSocket == undefined) {
			console.log("proxyToServerSocket is undefined");
			return;
		}
	}
	proxyToServerSocket.onopen = function () {
		console.log("proxyToServerSocket opened");
		clientToProxySocket.send("Conexiunea a fost stabilita cu succes, apasa ENTER pentru a incepe");
	};

	//when data from the server is recieved, write 
	// the data back to the clientToProxySocket
	proxyToServerSocket.on('message',function (message) {
		clientToProxySocket.send(message);
	});

	// If an error occurs, then close the 
	// client <---> proxy connection
	proxyToServerSocket.onerror = function(e) {
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
	if(connection_alive == false)
	return;
	// If the proxy <---> server connection closes, also close the client <---> proxy 
	// connection

	proxyToServerSocket.onclose = function() {
		console.log(
			"The connection between the proxy and the server has been closed , " +
			"closing the serverToProxySocket"
		)

		// close the clientToProxySocket
		clientToProxySocket.close();
	};
	// add event listener for the incoming messages on the client to proxy socket
	clientToProxySocket.on('message',function incoming(message) {
		//console.log("Recieved message : ", message)
		// write message on the proxyToServerSocket
		proxyToServerSocket.send(message);
	});
});


function removeAllocatedContainer(serverHost) {
	console.log("Removing allocated container");
	child_process.exec(`docker stop ${serverHost} &`);
}

function handleProxyToServerSocketClose()
{
	console.log("Proxy to Server socket closed");
}
function isValidConnection(request)
{
	//console.log("------------REQUEST HEADERS------------");
	//console.log(request.headers);
	//console.log("------------REQUEST HEADERS------------");
	// check whether the connection between the client and the proxy
	//should be allowed or not
	// get the cookies and check if the
	// username and the auth token 
	// are valid

	isValid = false;
	if(request.headers.cookie == undefined) return false;
	var cookie_list = request.headers.cookie.split("; ");
	cookie_list.forEach(cookie => {
		let [name,value] = cookie.split("=");
		if(name=="username" && value) 
		{
			isValid = true;
			return;
		}
	});
	return isValid;
}