var WebSocket = require('ws');

//Current websocket connections
var websockets = []
close_reason = ""

// create the websocket server and listen to port 443
const wsServer = new WebSocket.Server({port:443});

// add event listener for incoming connections


wsServer.on('connection',function connection(clientToProxySocket,request){
	//Add the websocket to the list
	//websockets.append(ws);
	//Create a websocket that connects to the 
	//real server and pipe the message coming from the real socket 
	// to the socket that connects to the real websocket server
	
	// add close handler when the connection 
	// between the client and the proxy server 
	// terminates
	clientToProxySocket.onclose = handleClientToProxySocketClose;



	// if the connection is not allowed, then close it immediately 
	// before recieving any message 
	/**
	if(isValidConnection(request)  == false)
	{
		console.log("Closing connection");
		close_reason = "Credentials not provided"
		clientToProxySocket.close();
	}
	**/

	// create a proxyToServerSocket for sending data to 
	// the actual websocket server

	// the websocket server adress depends on the client request;
	//for the moment , use only one server
	var proxyToServerSocketSubProtocol = "";
	if(request.headers['sec-websocket-protocol'])
		proxyToServerSocketSubProtocol = request.headers['sec-websocket-protocol'];

	var serverHost = '127.0.0.1';
	if (process.env.LAB_HOST) serverHost = process.env.LAB_HOST;
	const proxyToServerSocket = new WebSocket(`ws://${serverHost}:443`,proxyToServerSocketSubProtocol);

	// add event listeners for the proxyToServerSocket

	// do stuff when the connection with the server opens
	proxyToServerSocket.onopen = function () {};

	//when data from the server is recieved, write 
	// the data back to the clientToProxySocket
	proxyToServerSocket.on('message',function (message) {
		clientToProxySocket.send(message);
	});

	// Add handler for any incoming error
	// If an error occurs, then close the 
	// client <---> proxy connection
	proxyToServerSocket.onerror = function() {
		console.log(
			"The connection between the proxy and the server didn't succed , " +
			"closing the serverToProxySocket"
		)
		close_reason = "Proxy <---> Server connection failed "
		// close the server to proxy socket
		clientToProxySocket.close();
	};


	// If the proxy <---> server connection closes, also close the client <---> proxy 
	// connection

	proxyToServerSocket.onclose = function() {
		console.log(
			"The connection between the proxy and the server closed , " +
			"closing the serverToProxySocket"
		)

		// close the server to proxy socket
		clientToProxySocket.close();
	};	


	// add event listener for the incoming messages on the client to proxy socket
	clientToProxySocket.on('message',function incoming(message) {
		//console.log("Recieved message : ", message)
		// write message on the proxyToServerSocket
		proxyToServerSocket.send(message);
		// and then do stuff with the message(send it to the real server)
	});
});


function handleClientToProxySocketClose()
{
	console.log("Socket closed , Reason : ",close_reason);
}


function handleProxyToServerSocketClose()
{
	console.log("Proxy to Server socket closed");
}

function isValidConnection(request)
{
	// check whether the connection between the client and the proxy
	//should be allowed or not
	// get the cookies and check if the
	// username and the auth token 
	// are valid

	isValid = false;
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