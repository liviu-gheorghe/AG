import  React from 'react';
import {Container,Row,Col} from 'react-bootstrap';
import './Login.css';
import {withCookies} from 'react-cookie';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            credentials : {},
            error_msg : null,
        }
    }


    updateFormData = event => {
        let credentials = this.state.credentials;
        credentials[event.target.name] = event.target.value;
        this.setState({
            credentials: credentials,
        });
    }

    sendLoginData = () => {
        fetch(
            `${process.env.REACT_APP_API_URL}/auth/`,
            {
                method: 'POST',
                body: JSON.stringify(this.state.credentials),
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
            .then(resp => resp.json())
            .then(resp => {
                if (resp.token) {
                    this.props.cookies.set('auth_token',resp.token,{});
                    this.props.cookies.set('username', this.state.credentials["username"],{});
                    this.setState({
                        error_msg: null,
                    });              
                    window.location.href = "/";
                }
                else 
                this.setState({
                    error_msg : "Username or password wrong",
                });
            })
            .catch(err => {
                    this.setState({
                        error_msg: err.message,
                    });
                }
                )
    }


    render () {
        return (
            <Container fluid>
                <Row className="login-modal justify-content-center align-items-center">
                    <Col xs={12} sm={10} lg={6}>
                        <LoginPanel toggle={this.toggleForm} updateData={this.updateFormData} sendLoginData={this.sendLoginData} error_msg={this.state.error_msg} />
                    </Col>


                </Row>
            </Container>            
        );
    }
}

class LoginPanel extends React.Component {
    render() {
        return (
            <div className="login-form">
                <p className="form-title">Intra in cont</p>
                <div>
                    <input type="username" name="username" placeholder="Nume de utilizator" required={true} onChange={this.props.updateData}/>
                </div>
                <div>
                    <input type="password" name="password" placeholder="Parola" required={true} onChange={this.props.updateData}  />
                </div>
                <div>
                    <button className="login-button" onClick={this.props.sendLoginData}>Logare</button>
                </div>
                {
                    this.props.error_msg ? (
                    <p className="text-danger">{this.props.error_msg}</p>
                    ) : (
                        <p className = "toggle-form" onClick = {() => window.location.href="/inregistrare" }>Inregistrare</p>
                    )
                }
            </div>
        );
    }
}

export default withCookies(Login);