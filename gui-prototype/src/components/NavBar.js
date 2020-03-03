import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import styled from "styled-components";
import logo from "../assets/logo.svg";

const Styles = styled.div`
  .navbar {
    background-color: #102027;
  },
  .navbar-brand, .navbar-nav .nav-link, .nav-dropdown {
    color: white;

    &:hover {
      color: #9ea7aa;
    }
  },
`;

function NavBar() {
  return (
    <Styles>
      <Navbar /* fixed="top" */ expand="lg">
        <Navbar.Brand href="/">
          <img
            src={logo}
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{" "}
          Election Data Quality
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/about">About</Nav.Link>
            <Nav.Link href="/edit">Edit</Nav.Link>
            <NavDropdown title="State" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/ky">Kentucky</NavDropdown.Item>
              <NavDropdown.Item href="#action/la">Louisiana</NavDropdown.Item>
              <NavDropdown.Item href="#action/sc">
                South Carolina
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </Styles>
  );
}

export default NavBar;
