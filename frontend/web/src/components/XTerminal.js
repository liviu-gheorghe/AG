import React from 'react';
import { AttachAddon } from 'xterm-addon-attach';
import { FitAddon } from 'xterm-addon-fit';
import { Terminal } from "xterm";
import './xterm.css';
var welcome_message = "Bine ai venit,aceasta este o sesiune interactiva de terminal, te rugam asteapta"+
" putin pana configuram lucrurile\r\nSe stabileste conexiunea...\r\n";
class XTerminal extends React.Component
{
    componentDidMount() {
        this.terminal.loadAddon(this.attachAddon);
        //this.terminal.loadAddon(this.fitAddon);
        this.terminal.open(document.getElementById("terminal"));
        //this.fitAddon.fit()
    }
    createWebSocket(uri,port) {
        var socket = new WebSocket(`ws://${uri}:${port}`)
        var component = this;
        socket.onopen = function () {
            component.terminal.write(welcome_message);
            console.log("Socket connection created successfully");
            component.props.handleSocketOpen();
            // Focus the terminal
            //let textarea = document.getElementsByClassName('xterm-helper-textarea')[0];
            //textarea.focus();
        }
        socket.onclose = function () {
            component.props.handleSocketClose();
            component.terminal.clear();
            console.log("The socket connection has been closed by the server");
        }
        socket.onmessage = function () {
            component.props.handleSocketMessage();
        }
        socket.onerror = function () {
            component.props.handleSocketClose();
            console.log("An error occured while trying to connect to the web socket server");
        }
        return socket;
    }
    socket = this.createWebSocket(`${process.env.REACT_APP_WEBSOCKET_URL}`,"443")
    attachAddon = new AttachAddon(this.socket);
    fitAddon = new FitAddon();
    terminal = new Terminal({
        cursorBlink:true,
        cols: 120,
        rows: 30,
        rendererType: 'dom',
        theme: {
            foreground: '#fff'
        }
    });
    render () { 
        return (
        <div id="terminal"></div>
        );  
    }
}
export default XTerminal;