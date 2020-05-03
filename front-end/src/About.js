import React from "react";
import Container from "react-bootstrap/Container";
import Jumbotron from "react-bootstrap/Jumbotron";
import styled from "styled-components";

const Styles = styled.div`
  .jumbotron {
    background-color: #cfd8dc;
  },
`;

function About() {
  return (
    <Styles>
      <Jumbotron fluid className="px-0">
        <Container>
          <h1>About us</h1>
        </Container>
      </Jumbotron>
      <Container>
        <p>
          We are Team Cyclones from Stony Brook University's Spring 2020 CSE
          416-01 Class.
        </p>
      </Container>
    </Styles>
  );
}

export default About;
