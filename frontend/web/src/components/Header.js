import React from 'react';
import { withCookies } from 'react-cookie';
// eslint-disable-next-line
import { Nav,Navbar, NavDropdown, Button , FormControl,Form } from 'react-bootstrap';
import './Header.css';
class Header extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            links : {},
            language: props.language ? props.language : 'ro',
        }
    }
    logOut = () =>
    {
        //console.log("Logging out,bye");
        //https://github.com/reactivestack/cookies/issues/16
        this.props.cookies.remove("auth_token", { path: '/' });
        this.props.cookies.remove("username", { path: '/' });
        window.location.href="/";
    }
    componentWillMount () {
        this.setState({
            header_data : require('../assets/strings/header.json'),
        })
    }
    componentDidMount () {
    }
    render () {
        return (
            <Navbar 
            className="navbar"
            variant="dark"
            bg = {
                this.props.bgVariant ? this.props.bgVariant : "dark"
            } 
            expand="lg">
                <Navbar.Brand href="/">AlgoGeek</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        {
                            this.state.header_data.section_links.map(
                                (link,index) => {
                                    return <Nav.Link key={index} href={link.href}>{link.text[this.state.language]}</Nav.Link>
                                }
                            )
                        }
                    </Nav>
                    <Nav>
                    {
                        this.props.cookies.get("auth_token") ? (

                                <NavDropdown title={this.props.logged_user} id="nav-dropdown" alignRight>
                                    {

                                        this.state.header_data.user_options['links'].map(
                                            (link, index) => {
                                                return <NavDropdown.Item key={index} href="#action/3.1">{link.text[this.state.language]}</NavDropdown.Item>
                                            }
                                        )
                                    }
                                    <NavDropdown.Divider />
                                    {
                                        this.state.header_data.user_options['actions'].map(
                                            (action,index) => {
                                                return (
                                                <NavDropdown.Item 
                                                    key={index} 
                                                    onClick={ 
                                                        this.logOut
                                                }>
                                                        {action.text[this.state.language]}
                                                </NavDropdown.Item>
                                                );
                                            }
                                        )
                                    }
                                </NavDropdown>
                            
                        ) : (
                                <Nav.Link href="/logare">Logare</Nav.Link>
                        )
                    }
                    </Nav>

                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default withCookies(Header);