import React,{useState,useEffect} from 'react';
import { AttachAddon } from 'xterm-addon-attach';
import { FitAddon } from 'xterm-addon-fit';
//import {AGTerminal} from '../terminal/ag_terminal';
import { Terminal } from "xterm";
import './xterm.css';


var welcome_message = "Bine ai venit,aceasta este o sesiune interactiva de terminal, te rugam asteapta"+
" putin pana configuram lucrurile\r\nSe stabileste conexiunea...\r\n";


export default class XTerminal extends React.Component
{
    constructor(props) {
        super(props);
        //this.createWebSocket = this.createWebSocket.bind(this);
    }
    componentDidMount() {
        //console.log("Mounted")
        this.terminal.loadAddon(this.attachAddon);
        this.terminal.loadAddon(this.fitAddon);
        this.terminal.open(document.getElementById("terminal"))
        this.terminal.write(welcome_message)
        this.fitAddon.fit()

        let textarea = document.getElementsByClassName('xterm-helper-textarea')[0];
        textarea.focus();
    }



    createWebSocket(uri,port) {
        var socket = new WebSocket(`ws://${uri}:${port}`)
        // add handlers 
        var component = this;
        socket.onopen = function () {
           component.terminal.writeln("Conexiunea a fost stabilita cu sucess, apasa ENTER pentru a incepe")
            console.log("Socket connection created successfully");
            component.props.handleSocketOpen();
        }
        socket.onclose = function () {
            component.props.handleSocketClose();
            console.log("The socket connection has been closed by the server");
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
        <div id="terminal" ></div>
        );  
    }
}


