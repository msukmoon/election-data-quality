import React from "react";
import Container from "react-bootstrap/Container";
import Jumbotron from "react-bootstrap/Jumbotron";
import styled from "styled-components";

const Styles = styled.div`
  .jumbotron {
    background-color: #cfd8dc;
  },
`;

function NotFound() {
  return (
    <Styles>
      <Jumbotron fluid className="px-0">
        <Container>
          <h1>Error 404</h1>
        </Container>
      </Jumbotron>
      <Container>
        <p>Page not found :(</p>
      </Container>
    </Styles>
  );
}

export default NotFound;
