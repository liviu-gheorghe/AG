import React from 'react';
import { withCookies } from 'react-cookie';
import { Container, Row, Col } from 'react-bootstrap';
import Header from './components/Header';
class HomePage extends React.Component {
    render() {
        return (
            <>
            <Header logged_user={this.props.cookies.get('username')}/>
            <Container fluid>
                <Row>
                    <Col xs={4}>
                             
                    </Col>
                    <Col xs={8}>

                    </Col>                    
                </Row>
            </Container>
            </>
        );
    }
}

export default withCookies(HomePage);