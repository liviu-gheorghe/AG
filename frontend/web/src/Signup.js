import React from 'react';
import './Signup.css';
import './Main.css';
import FontAwesome from 'react-fontawesome';
import {Container,Row,Col, Button} from 'react-bootstrap';
import ReCAPTCHA from "react-google-recaptcha";
import { isValidInput} from './utils/signup_data_validator';
//import { isValidPassword } from './utils/signup_data_validator';
import {areStringsEqual} from './utils/core';


/** 
function InputWarning(props) 
{
    return (
        <span className="input_warning">
            {props.input_warning[props.input_type]}
        </span>
    );
}
**/

class Signup extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            credentials : {},
            captcha_verified : false,
            input_warning : {
                'first_name': '',
                'last_name': '',
                'username': '',
                'email': '',
                'password': '',
                'password_check': ''
            },
            input_ok: false,
        }
    }


    checkCredentials = event => {
        let input_warning = this.state.input_warning;
        if (areStringsEqual(event.target.name, "password_check") || areStringsEqual(event.target.name, "password")) {
            if (areStringsEqual(this.state.credentials['password'], this.state.credentials['password_check'])) {
                input_warning['password'] = '';
                input_warning['password_check'] = '';
            }
            else {
                input_warning['password_check'] = 'Parolele nu corespund';
                input_warning['password'] = 'Parolele nu corespund';
            }
            this.setState({
                input_warning: input_warning,
            });
        }

            if (isValidInput(event.target.name, event.target.value))
                input_warning[event.target.name] = '';
            else
                input_warning[event.target.name] = `${event.target.attributes[4].value} invalid/a`;
            this.setState({
                input_warning: input_warning,
            });
            
            var areInputsValid = true;
            for(var input_type in ["first_name","last_name","username","email","password","password_check"])
            {
                if(!(this.state.input_warning[input_type]===''))
                {
                    areInputsValid = false;
                    break;
                }
            }
            this.setState({
                input_ok:areInputsValid,
            });
    }


    updateCredentials = event =>
    {
        let credentials = this.state.credentials;
        credentials[event.target.name]=event.target.value;
        this.setState({
            credentials : credentials,
        });
        this.checkCredentials(event);
    }

    focusSection = (event) => {
        this.setState({
            section_focused : event.target.name,
        })
    }

    render ()
    {
        return (
            <Container>
                <Row className="align-items-center justify-content-center signup_modal">
                    <Col xs={12} md={12} lg={6} >
                        <Row>

                            <Col xs={12} >
                                <p className="subtitle text-left">
                                    <span style={{ color: "#28a745"}}>Inregistrare</span> 
                                    <FontAwesome name="user-plus" style={{ padding: "0px 10px", color: "#28a745",fontSize:"30px"}}></FontAwesome>
                                    </p>
                            </Col>
                            <Col xs={12} md={12} lg={9}>
                                <div>
                                    <p className="font-weight-bold">Nume</p>
                                     <p className="input_warning">{this.state.input_warning['last_name']}</p>
                                </div>
                                <input autoComplete="off" onChange={this.updateCredentials} onFocus={this.focusSection} maxLength={28} type="text" name="last_name" label="Nume" />
                            </Col>


                            <Col xs={12} md={12} lg={9}>
                                <div>
                                    <p className="font-weight-bold">Prenume</p>
                                    <p className="input_warning">{this.state.input_warning['first_name']}</p>
                                </div>
                                <input autoComplete="off" onChange={this.updateCredentials} maxLength={32} type="text" name="first_name" label="Prenume"/>
                            </Col>


                            <Col xs={12} md={12} lg={9}>
                                <div>
                                    <p className="font-weight-bold">Nume de utilizator</p>
                                    <p className="input_warning">{this.state.input_warning['username']}</p>
                                </div>
                                <input autoComplete="off" onChange={this.updateCredentials} maxLength={32} type="text" name="username" label="Nume de utilizator"/>
                            </Col>


                            <Col xs={12} md={12} lg={9}>
                                <div>
                                    <p className="font-weight-bold">Email</p>
                                    <p className="input_warning">{this.state.input_warning['email']}</p>
                                </div>
                                <input autoComplete="off" onChange={this.updateCredentials} maxLength={32} type="text" name="email" label="Email"/>
                            </Col>


                            <Col xs={12} md={12} lg={9}>
                                <div>
                                    <p className="font-weight-bold">Parola</p>
                                    <p className="input_warning">{this.state.input_warning['password']}</p>
                                </div>
                                <input autoComplete="off" onChange={this.updateCredentials} maxLength={32} type="password" name="password" label="Parola"/>
                            </Col>


                            <Col xs={12} md={12} lg={9}>
                                <div>
                                    <p className="font-weight-bold">Introdu din nou parola</p>
                                    <p className="input_warning">{this.state.input_warning['password_check']}</p>
                                </div>
                                <input autoComplete="off" onChange={this.updateCredentials} maxLength={32} type="password" name="password_check" label="Parola"/>
                            </Col>


                            <Col xs={12} md={12} lg={9}>
                                <ReCAPTCHA
                                    sitekey="6LeMYeEUAAAAAOCHBCdG7SsNhxEdGJ7iZxp2Osoq"
                                    onChange= {
                                        () => {
                                            fetch(
                                                `${process.env.REACT_APP_API_URL}/siteverify`,
                                                {
                                                    method: 'POST',
                                                    body:
                                                        JSON.stringify({
                                                            'response': window.grecaptcha.getResponse(),
                                                        }),
                                                }
                                            )
                                                .then(
                                                    resp => resp.json()
                                                )
                                                .then(resp => {
                                                    if(resp['success'] === true)
                                                    this.setState({
                                                        captcha_verified: true,    
                                                    });
                                                })
                                        }
                                    }
                                 />
                            </Col>
                            <Col xs={12}>
                                <p >
                                    <Button
                                        onClick = {
                                            () => {
                                                fetch(
                                                    `${process.env.REACT_APP_API_URL}/add_user`,
                                                    {
                                                        method: 'POST',
                                                        body:
                                                            JSON.stringify(this.state.credentials),
                                                    }
                                                )
                                                .then(resp => { 
                                                        console.log(resp);
                                                    }
                                                )
                                            }
                                        }
                                    >Inregistrare</Button>
                                </p>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={12} md={12} lg={6} className="signup_image">
                            <img src={require("./assets/img/signup_img.jpg")} alt="" />
                            <p className="subtitle">Inregistrare cu </p>
                            <div className="text-center" style={{ padding: "20px 0px"}}>
                                <i className="fab fa-github" style={{ padding: "0px 20px", fontSize: "50px"}}></i>
                                <i className="fab fa-facebook" style={{ padding: "0px 20px", fontSize: "50px", color: "blue" }}></i>
                                <i className="fab fa-google-plus" style={{ padding: "0px 20px", fontSize: "50px", color: "red" }}></i>
                            </div>
                    </Col>
                </Row>
            </Container>
        );
    }
}


export default Signup;