import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import styled from "styled-components";
import logo from "../assets/logo.svg";

const Styles = styled.div`
  .navbar {
    background-color: #102027;
  }

  .navbar-brand,
  .navbar-nav .nav-link,
  .nav-dropdown {
    color: white;

    &:hover {
      color: #9ea7aa;
    }
  }
`;

function NavBar() {
  return (
    <Styles>
      <Navbar /* fixed="top" */ expand="lg">
        <Navbar.Brand href="/">
          <img
            src={logo}
            alt="logo"
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{" "}
          Election Data Quality
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-4">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/history">History</Nav.Link>
            <Nav.Link href="/map">Map</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </Styles>
  );
}

export default NavBar;
