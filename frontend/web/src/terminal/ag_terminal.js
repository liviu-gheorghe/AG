import { Terminal } from "xterm";


export class AGTerminal extends Terminal {
    constructor(properties) {
        super(properties);
        //manageTerminal(this);
        //this.websocket = createWebSocket("127.0.0.1", "8445");
        //this.sendData = this.sendData.bind(this);
        //bind this to send data to access websocket as a class member

        // add listener to handle websocket 
        // response
        //this.websocket.onopen = () => {
         //   this.websocket.send('cd Desktop');
        //}
        //this.websocket.onmessage = (event) => {
         //   this.write(event.data);
       // }
    }

    //sendData(data) {
        //this.websocket.send(data);
    //};
}


const manageTerminal = (terminalInstance) => {
    manageInput(terminalInstance);
};

const manageInput = (terminalInstance) => {
    let textBuffer = "";
    terminalInstance.onData((e) => {
      console.log(e);
      if (e.charCodeAt(0) == 127)
        //backspace
        return;
        textBuffer += e;
        terminalInstance.write(e);

    });

    terminalInstance.onKey((e) => {
      switch (e.key) {
        case "\u007f": // backspace
          if (textBuffer.length) {
            textBuffer = textBuffer.slice(0, -1);
            terminalInstance.write("\b \b");
          }
          break;

        case "\r":
          //terminalInstance.writeln(""); //write a new line
          //send the data through the websocket
          console.log(textBuffer);
          terminalInstance.sendData(textBuffer);
          textBuffer = ""; //clear the buffer
          //terminalInstance.writeln('');
          break;
        default:
          break;
      }
    });       
};

const charCode = (c) => c.charCodeAt(0);

//const connectToWebSocket = (websocket)


const createWebSocket = (host,port) =>
{
    //const uri = host + ' ' + port;
    console.log("Creating websocket")
    let websocket = new WebSocket(`ws://${host}:${port}`);
    return websocket;
}