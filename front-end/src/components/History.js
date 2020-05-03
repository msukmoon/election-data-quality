import React from "react";
import Container from "react-bootstrap/Container";
import Jumbotron from "react-bootstrap/Jumbotron";
import styled from "styled-components";

const Styles = styled.div`
  .jumbotron {
    background-color: #cfd8dc;
  },
`;

function History() {
  return (
    <Styles>
      <Jumbotron fluid className="px-0">
        <Container>
          <h1>Corrections History</h1>
        </Container>
      </Jumbotron>
      <Container>
        <p>Corrections log will go here.</p>
      </Container>
    </Styles>
  );
}

export default History;
