import React from 'react';
import { withCookies } from 'react-cookie';
// eslint-disable-next-line
import { Nav,Navbar, NavDropdown, Button , FormControl,Form } from 'react-bootstrap';
import './Header.css';
class Header extends React.Component {


    logOut = () =>
    {
        this.props.cookies.remove("auth_token");
        this.props.cookies.remove("username");
        window.location.href="/";
    }

    render () {
        return (
            <Navbar className="navbar" bg="dark" variant="dark" expand="lg">
                <Navbar.Brand href="/home">AlgoGeek</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href="#link">Articole</Nav.Link>
                        <Nav.Link href="#link">Resurse</Nav.Link>
                        <NavDropdown title="Probleme" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">Clasa a IX-a</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">Clasa a X-a</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">Clasa a XI-a</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.4">Probleme concurs</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Nav>
                    {
                        this.props.cookies.get("auth_token") ? (

                                <NavDropdown title={this.props.logged_user} id="nav-dropdown" alignRight>
                                    <NavDropdown.Item href="#action/3.1">Editare profil</NavDropdown.Item>
                                    <NavDropdown.Item href="#action/3.2">Solutiile mele</NavDropdown.Item>
                                    <NavDropdown.Item href="#action/3.3">Articolele mele</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item onClick={this.logOut}>Delogare</NavDropdown.Item>
                                </NavDropdown>
                            
                        ) : (
                                    <Nav.Link href="/login">Login</Nav.Link>
                        )
                    }
                    </Nav>

                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default withCookies(Header);