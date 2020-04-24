import React from 'react';
import {Container,Row,Col} from 'react-bootstrap';
import XTerminal from './XTerminal';

function TerminalPlayground() {

    function handlePtySocketOpen() {
        //TODO
    }

    function handlePtySocketClose() {
        //TODO
    }


    return (
        <Container>
        <Row className="h-100 justify-content-center align-items-center">
        <Col xs={12}>
        <XTerminal 
        handleSocketClose = {handlePtySocketClose}
        handleSocketOpen = {handlePtySocketOpen}
        />
        </Col>
        </Row>
        </Container>
    );
}


export default TerminalPlayground