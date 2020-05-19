import React from 'react';
import { withCookies } from 'react-cookie';
// eslint-disable-next-line
import { Nav,Navbar, NavDropdown} from 'react-bootstrap';
import './Header.css';
class Header extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            links : {}
        }
    }
    logOut = () =>
    {
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
        //console.log(this.props.cookies.cookies);

    }
    render () {
        var page_language = this.props.cookies.get('language') || 'ro';
        return (
            <Navbar
                className="navbar"
                variant="dark"
                bg={
                    this.props.bgVariant ? this.props.bgVariant : "success"
                }
                expand="lg">
                <Navbar.Brand href="/">AlgoGeek</Navbar.Brand>
                <Navbar.Toggle aria-controls="header-nav" />
                <Navbar.Collapse id="header-nav">
                    <Nav className="mr-auto">
                        {
                            this.state.header_data.section_links.map(
                                (link, index) => {
                                    return <Nav.Link key={index} href={link.href[page_language]}>{link.text[page_language]}</Nav.Link>
                                }
                            )
                        }
                    </Nav>
                    <Nav>
                        <Nav.Link
                            onClick={() => {
                                let new_language = page_language == 'ro' ? 'en':'ro';
                                this.props.cookies.set('language', new_language, { path: '/' });
                               
                            }}
                        >
                            {page_language.toUpperCase()}
                            <img
                                src={require(`../assets/img/${this.state.header_data.lang_icon_image[page_language]}`)}
                                style={{
                                    width: '20px',
                                    height: '20px',
                                    margin: '0px 5px',
                                }}
                                alt="" />
                        </Nav.Link>
                    </Nav>
                    <Nav>
                        {
                            this.props.cookies.get("auth_token") ? (

                                <NavDropdown title={this.props.logged_user} id="nav-dropdown" alignRight>
                                    {

                                        this.state.header_data.user_options['links'].map(
                                            (link, index) => {
                                                return <NavDropdown.Item key={index} href="#action/3.1">{link.text[page_language]}</NavDropdown.Item>
                                            }
                                        )
                                    }
                                    <NavDropdown.Divider />
                                    {
                                        this.state.header_data.user_options['actions'].map(
                                            (action, index) => {
                                                return (
                                                    <NavDropdown.Item
                                                        key={index}
                                                        onClick={
                                                            this.logOut
                                                        }>
                                                        {action.text[page_language]}
                                                    </NavDropdown.Item>
                                                );
                                            }
                                        )
                                    }
                                </NavDropdown>

                            ) : (
                                    <Nav.Link href="/logare">{this.state.header_data.login_link.text[page_language]}</Nav.Link>
                                )
                        }
                    </Nav>

                </Navbar.Collapse>
            </Navbar>
        );
    }
}


export default withCookies(Header);