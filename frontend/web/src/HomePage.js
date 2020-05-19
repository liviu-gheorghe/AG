import React, {useState,useEffect} from 'react';
import FontAwesome from 'react-fontawesome';
import { withCookies } from 'react-cookie';
// eslint-disable-next-line
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import Header from './components/Header';
import "./HomePage.css";
import ServicesDescriptionWrapper from './ServicesDescriptionWrapper';
import PageScroller from './components/PageScroller';
// eslint-disable-next-line
//import  ProblemList  from './components/ProblemList'
//import { parseUrl } from './utils/urlparser';

class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            homepage_data: {},
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
        var page_language = this.props.cookies.get('language') || 'ro';
        return (
            <>
                <div className="background_wrapper">
                    <Header bgVariant=" " logged_user={this.props.cookies.get('username')} />
                    <Container fluid>
                        <Row style={{ height: "100vh" }} className="align-items-center">
                            <Col className="wallpaper_content justify-content-center align-items-center" xs={12} md={12} lg={12} xl={5} >
                                <h2>{this.state.homepage_data['wallpaper_description']['text'][page_language]}</h2>
                                <div className="icon_wrapper"><FontAwesome name="code" className="code_icon"> </FontAwesome></div>
                            </Col>
                        </Row>
                    </Container>
                </div>
                <Container>
                    <Row className="justify-content-center homepage_info my-4">
                        <Col xs={12}>
                            <p className="subtitle">{this.state.homepage_data['platform_description_subtitle']['text'][page_language]}</p>
                        </Col>
                        {
                            this.state.homepage_data.topics.map(
                                (topic, index) => {
                                    return (
                                        <Col key={index} xs={12} sm={12} md={6} lg={4} >
                                            <Card
                                                onClick={
                                                    () => {
                                                        window.location.href = `${topic.page_link[page_language]}`;
                                                    }
                                                }
                                                bg={`${topic.bg_scheme}`}
                                                style={
                                                    {
                                                        width: '18rem',
                                                        color: '#fff',
                                                    }
                                                }
                                            >
                                                <Card.Header>{topic.title[page_language]}</Card.Header>
                                                <Card.Body>
                                                    <div>
                                                        <p>
                                                            {topic.description[page_language]}
                                                        </p>
                                                        <FontAwesome
                                                            name={`${topic.icon}`}
                                                            className="card_icon">
                                                        </FontAwesome>
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    );
                                }
                            )
                        }



                    </Row>
                    <ServicesDescriptionWrapper lang={page_language} services={this.state.homepage_data.services} />
                    <Row className="join_community_info_wrapper">
                        <Col xs={12}>
                            <p className="subtitle">{this.state.homepage_data['testimonials_title']['text'][page_language]}</p>
                        </Col>
                        <Row>
                            <Col xs={12} md={8}>
                                <p>{this.state.homepage_data['testimonials'][0]['user'][page_language]}</p>
                                <p>{this.state.homepage_data['testimonials'][0]['occupation'][page_language]}</p>
                                <p>{this.state.homepage_data['testimonials'][0]['date_joined'][page_language]}</p>
                                <span>
                                    {this.state.homepage_data['testimonials'][0]['testimonial_text'][page_language]}
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
                                <p>{this.state.homepage_data['testimonials'][1]['user'][page_language]}</p>
                                <p>{this.state.homepage_data['testimonials'][1]['occupation'][page_language]}</p>
                                <p>{this.state.homepage_data['testimonials'][1]['date_joined'][page_language]}</p>
                                <span>
                                    {this.state.homepage_data['testimonials'][1]['testimonial_text'][page_language]}
                                </span>
                            </Col>
                        </Row>
                        <Col xs={12}>
                            <p className="subtitle">{this.state.homepage_data['join_community_information']['title'][page_language]}</p>
                            <p className="text-center"><i className="fas fa-user-plus" style={{ fontSize: "50px", color: "#28a745" }}></i></p>
                            <p className="text-left border-succes p-4 rounded">
                                {this.state.homepage_data['join_community_information']['description'][page_language]}
                            </p>
                            <p className="text-center">
                                <a
                                    className="bg-success join_community_link"
                                    href="/inregistrare" >
                                    {this.state.homepage_data['join_community_information']['join_button_text'][page_language]}
                                </a>
                            </p>
                        </Col>
                    </Row>
                </Container>
                <PageScroller />
            </>
        );
    }
}
export default withCookies(HomePage);