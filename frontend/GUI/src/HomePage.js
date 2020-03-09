import React from 'react';
import { withCookies } from 'react-cookie';
import { Container, Row, Col } from 'react-bootstrap';
import Header from './components/Header';
import "./HomePage.css";
import  ProblemList  from './components/ProblemList'



class HomePage extends React.Component {
    render() {
        return (
            <>
            <Header logged_user={this.props.cookies.get('username')}/>
            <Container fluid>
                <Row className="justify-content-center"> 
                    <Col xs={12} sm={12} md={10} lg={8} className="main_section ">
                         <p className="subtitle text-center">
                             Probleme recent adaugate
                        </p>
                        <ProblemList className="text-center"/>
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    <Col xs={12} sm={12} md={10} lg={8} className="main_section ">
                        <p className="subtitle text-center">
                            Articole recent adaugate
                    </p>
                        <ProblemList className="text-center" />
                    </Col>
                </Row>                
            </Container>
            </>
        );
    }
}

export default withCookies(HomePage);