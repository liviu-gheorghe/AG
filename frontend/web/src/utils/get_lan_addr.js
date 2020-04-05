var os = require('os');


//Get local IP adress in developement 
export function getLocalIpAdress()
{
    var network_interfaces = os.networkInterfaces()
    console.log(network_interfaces);
    //var lan_interface = network_interfaces.wlp2s0[0].address
    //return (lan_interface ? lan_interface : '127.0.0.1')
}


