import React from 'react';
import FontAwesome from 'react-fontawesome';
import {Container,Row,Col,Button,Badge} from 'react-bootstrap';
import { withCookies } from 'react-cookie';
import  Header  from './components/Header';
import './UserPage.css'
//import { Chart } from "react-google-charts";
//import {parseUrl} from './utils/urlparser';


class UserPage extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            user : {
                userprofile : {
                    description : '',
                    interests : '',
                },
            },
            user_found:false,
        }
    }
    componentWillMount() {
    }
    componentDidMount() {
        let location = this.props.location.pathname;
        let username = location.split('/').slice(-1)[0]
        console.log(username);
        fetch(
            `${process.env.REACT_APP_API_URL}/api/users/${username}/?identifier=username`,
            {
                method: 'get',
            }
        )
            .then(resp => {
                if(resp.status === 200)
                {
                    this.setState({user_found:true});
                    console.log("User found");
                return resp.json();
                }
            })
            .then(
                (resp) => {
                    if(this.state.user_found)
                    this.setState({
                        user: resp,
                    })
                }
            )
            .catch(
                (err) => {
                    console.log(err);
                }
            )
    }
    render() {
        if(this.state.user_found)
        return (
            <>
            <Header logged_user={this.props.cookies.get("username")}></Header>
            <Container className="user_page_wrapper">
                <Row className="my-2 align-items-center justify-content-center">
                    <Col xs={12} md={6} className="user_profile_image_wrapper my-2">
                                <img src={``} alt=''></img>
                    </Col>
                    <Col xs={12} md={6} className="user_information_wrapper my-2">
                       
                        <p className=""></p>
                        <p className="">Membru din ianuarie 2015</p>
                        <p>
                        <Button>
                            <span 
                                className="m-3"
                                onClick = { 
                                    () => {
                                        //console.log(this.state.user.userprofile.profile_image)
                                    }
                                } 
                            >
                                Urmareste
                            </span>
                                <FontAwesome name="user-plus" />
                        </Button>
                        </p>
                        <div className="social_media_links_wrapper" style={{ padding: "20px 0px" }}>
                                <a href="https://github.com/liviu-gheorghe" target="_blank" rel="noopener noreferrer"><i className="fab fa-github" style={{ padding: "10px", fontSize: "35px", color: "black" }}></i></a>
                            <i className="fab fa-facebook" style={{ padding:"10px", fontSize: "35px", color: "blue" }}></i>
                            <i className="fab fa-google-plus" style={{ padding:"10px", fontSize: "35px", color: "red" }}></i>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} md={6} className="my-4 user_description">

                    </Col>
                    <Col xs={12}>
                            <h2 className="text-center">Activitate <FontAwesome name="edit" /></h2>
                    </Col>
                    <Col xs={12}>
                     
                    </Col>
                </Row>
            </Container>
            </>
        );
        else 
        return (
            <p>Utilizator inexistent</p>
        );
    }
}


export default withCookies(UserPage);

//`http://localhost/${this.state.user.userprofile.profile_image}

/**
  <h2 className="full_name">{this.state.user.first_name} {this.state.user.last_name}</h2>

                              <p>{this.state.user.userprofile.description}</p>
                            {
                                this.state.user.userprofile.interests.split(',').map(
                                    (interest,index) => {
                                    return <Badge className="p-2 m-2" key={index} variant="danger">{interest}</Badge>
                                    }
                                )
                            }
 */