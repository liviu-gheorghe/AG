import  React from 'react';
import {Container,Row,Col} from 'react-bootstrap';
import './Login.css';
import {withCookies} from 'react-cookie';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            login_view : true,
            credentials : {},
            error_msg : null,
        }
    }

    toggleForm = () => {
        this.setState({
            login_view: !this.state.login_view,
        });
    }

    updateFormData = event => {
        let cred = this.state.credentials;
        cred[event.target.name] = event.target.value;
        this.setState({
            credentials: cred,
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
                    this.props.cookies.set('auth_token', resp.token);
                    this.props.cookies.set('username', this.state.credentials["username"]);
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

    sendSignUpData = () => {
        console.log("Data will be sent");
        console.log(JSON.stringify(this.state.credentials));
    }

    render () {
        return (
            <Container fluid>
                <Row className="login-modal justify-content-center align-items-center">
                    <Col xs={12} sm={10} lg={6}>
                        {this.state.login_view ? (
                            <LoginPanel toggle={this.toggleForm} updateData={this.updateFormData} sendLoginData={this.sendLoginData} error_msg={this.state.error_msg}/>           
                        ) : (
                                <RegisterPanel toggle={this.toggleForm} updateData={this.updateFormData} sendSignUpData={this.sendSignUpData}/> 
                        )}
                    </Col>


                </Row>
            </Container>            
        );
    }
    /**
    <Col xs={12} sm={12} lg={8}>
         <div className="login-image text-center">
            <img src="/login_page_image.jpg" alt="" />
                <p className="welcome-message">
                    Bine ai (re)venit !
                </p>
        </div>
    </Col>
    **/
}

class LoginPanel extends React.Component {
    render() {
        return (
            <div className="login-form">
                <p className="form-title">Login</p>
                <div>
                    <input type="username" name="username" placeholder="Username" required={true} onChange={this.props.updateData}/>
                </div>
                <div>
                    <input type="password" name="password" placeholder="Password" required={true} onChange={this.props.updateData}  />
                </div>
                <div>
                    <button className="login-button" onClick={this.props.sendLoginData}>Login</button>
                </div>
                {
                    this.props.error_msg ? (
                    <p className="text-danger">{this.props.error_msg}</p>
                    ) : (
                        <p className = "toggle-form" onClick = {this.props.toggle}>Don't have an account?</p>
                    )
                }
            </div>
        );
    }
}

class RegisterPanel extends React.Component {
    render() {
        return (
            <div className="login-form">
                <p className="form-title">Sign up</p>
                <div>
                    <input type="username" name="username" placeholder="Username" onChange={this.props.updateData}/>
                </div>
                <div>
                    <input type="text" name="email_adress" placeholder="Email adress" />
                </div>                
                <div>
                    <input type="password" name="password" placeholder="Password" onChange={this.props.updateData}/>
                </div>
                <div>
                    <input type="password" name="password_confirm" placeholder="Confirm password" />
                </div>
                <div>
                    <button className="login-button" onClick={this.props.sendSignUpData}>Sign Up</button>
                </div>
                <p className="toggle-form" onClick={this.props.toggle}>Already have an account?</p>
            </div>
        );
    }
}

export default withCookies(Login);