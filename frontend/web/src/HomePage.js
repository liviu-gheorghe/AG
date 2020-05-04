import React, {useState,useEffect} from 'react';
import FontAwesome from 'react-fontawesome';
import { withCookies } from 'react-cookie';
// eslint-disable-next-line
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import Header from './components/Header';
import "./HomePage.css";
import { getLocalIpAdress } from './utils/get_lan_addr';
// eslint-disable-next-line
//import  ProblemList  from './components/ProblemList'
//import { parseUrl } from './utils/urlparser';

class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            homepage_data: {},
            language: 'ro',
        }
    }
    componentWillMount() {
        this.setState({
            homepage_data: require('./assets/strings/home_page.json'),
        })
    }
    componentDidMount() {
       
    }
    render() {
        return (
            <>
                <div className="background_wrapper">
                    <Header language={this.state.language} bgVariant=" " logged_user={this.props.cookies.get('username')} />
                    <Container fluid>
                        <Row style={{height: "100vh"}} className="align-items-center">
                            <Col className="wallpaper_content justify-content-center align-items-center" xs={12} md={12} lg={12} xl={5} >
                                <h2>{this.state.homepage_data['wallpaper_description']['text'][this.state.language]}</h2>
                                <div className="icon_wrapper"><FontAwesome name="code" className="code_icon"> </FontAwesome></div>
                            </Col>
                        </Row>
                    </Container>
                </div>
                <Container>
                    <Row className="justify-content-center homepage_info">
                        <Col xs={12}>
                            <p className="subtitle">{this.state.homepage_data['platform_description_subtitle']['text'][this.state.language]}</p>
                        </Col>
                        <Col xs={12} sm={12} md={6} lg={4} >
                            <Card
                                onClick={
                                    () => {
                                        window.location.href = "/probleme/";
                                    }
                                }    
                                bg="primary"
                                style={
                                    {
                                         width: '18rem',
                                         color: '#fff', 
                                    }
                                }
                            >
                                <Card.Header>{this.state.homepage_data['topics'][0]['title'][this.state.language]}</Card.Header>
                                <Card.Body>
                                    <div>
                                        <p>
                                            {this.state.homepage_data['topics'][0]['description'][this.state.language]}
                                        </p>
                                        <FontAwesome 
                                        name="square-root-alt" 
                                        className="card_icon"> 
                                        </FontAwesome>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xs={12} sm={12} md={6} lg={4}>
                            <Card
                                onClick={
                                    () => {
                                        window.location.href = "/laboratoare/";
                                    }
                                }
                                bg="success"
                                style={
                                    {
                                        width: '18rem',
                                        color: '#fff',
                                    }
                                }
                            >
                                <Card.Header>{this.state.homepage_data['topics'][1]['title'][this.state.language]}</Card.Header>
                                <Card.Body>
                                    <div>
                                    <p>
                                        {this.state.homepage_data['topics'][1]['description'][this.state.language]}
                                    </p>
                                        <FontAwesome name="book-open" className="card_icon"> </FontAwesome>    
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xs={12} sm={12} md={6} lg={4}>
                            <Card
                                onClick={
                                    () => {
                                        window.location.href = "/tutoriale/";
                                    }
                                }
                                bg="danger"
                                style={
                                    {
                                        width: '18rem',
                                        color: '#fff',
                                    }
                                }
                            >
                                <Card.Header>{this.state.homepage_data['topics'][2]['title'][this.state.language]}</Card.Header>
                                <Card.Body>
                                    <div>
                                        <p>
                                        {this.state.homepage_data['topics'][2]['description'][this.state.language]}
                                    </p>
                                    <FontAwesome name="flask" className="card_icon"> </FontAwesome>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xs={12} sm={12} md={6} lg={4}>
                            <Card
                                onClick={
                                    () => {
                                        window.location.href = "/comunitate/";
                                    }
                                }
                                bg="dark"
                                style={
                                    {
                                        width: '18rem',
                                        color: '#fff',
                                    }
                                }
                            >
                                <Card.Header>{this.state.homepage_data['topics'][3]['title'][this.state.language]}</Card.Header>
                                <Card.Body>
                                    <div>
                                    <p>
                                        {this.state.homepage_data['topics'][3]['description'][this.state.language]}
                                    </p>
                                        <FontAwesome name="users" className="card_icon"> </FontAwesome>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <Row className="join_community_info_wrapper">
                        <Col xs={12}>
                            <p className="subtitle">{this.state.homepage_data['testimonials_title']['text'][this.state.language]}</p>
                        </Col>
                            <Row>
                                <Col xs={12} md={8}>
                                <p>{this.state.homepage_data['testimonials'][0]['user'][this.state.language]}</p>
                                <p>{this.state.homepage_data['testimonials'][0]['occupation'][this.state.language]}</p>
                                <p>{this.state.homepage_data['testimonials'][0]['date_joined'][this.state.language]}</p>
                                    <span>
                                    {this.state.homepage_data['testimonials'][0]['testimonial_text'][this.state.language]} 
                                    </span>
                                </Col>
                                <Col xs={12} md={4}>
                                    <img src={require('./assets/img/avatar_001.png')} alt=""></img>
                                </Col>
                            </Row>
                        <Row>
                            <Col xs={12} md={4}>
                                <img src={require('./assets/img/avatar_002.png')} alt=""></img>
                            </Col>                            
                            <Col xs={12} md={8}>
                                <p>{this.state.homepage_data['testimonials'][1]['user'][this.state.language]}</p>
                                <p>{this.state.homepage_data['testimonials'][1]['occupation'][this.state.language]}</p>
                                <p>{this.state.homepage_data['testimonials'][1]['date_joined'][this.state.language]}</p>
                                <span>
                                    {this.state.homepage_data['testimonials'][1]['testimonial_text'][this.state.language]}
                                </span>
                            </Col>
                        </Row>
                        <Col xs={12}>
                            <p className="subtitle">{this.state.homepage_data['join_community_information']['title'][this.state.language]}</p>
                            <p className="text-center"><i className="fas fa-user-plus" style={{ fontSize: "50px", color:"#28a745"}}></i></p>
                            <p className="text-left border-succes p-4 rounded">
                                {this.state.homepage_data['join_community_information']['description'][this.state.language]}
                            </p>
                            <p className="text-center"><a className="bg-success join_community_link" href="/inregistrare" >{this.state.homepage_data['join_community_information']['join_button_text'][this.state.language]}</a></p>
                        </Col>
                    </Row>
                </Container>                

            </>
        );
    }
}

export default withCookies(HomePage)