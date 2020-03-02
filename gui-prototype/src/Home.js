import React from "react";
import Container from "react-bootstrap/Container";
import Jumbotron from "react-bootstrap/Jumbotron";
import Button from "react-bootstrap/Button";
import styled from "styled-components";

const Styles = styled.div`
  .jumbotron {
    background-color: #cfd8dc;
  },
`;

function Home() {
  return (
    <Styles>
      <Jumbotron fluid>
        <Container>
          <h1>Welcome!</h1>
          <p>
            Election Data Quality lets you analyze, correct and display various
            data sources that are related to political analysis of the US
            congressional districts.
          </p>
          <p>
            <Button href="/edit">Get Started</Button>
          </p>
        </Container>
      </Jumbotron>
    </Styles>
  );
}

export default Home;
