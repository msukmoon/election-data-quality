import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
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
      <Jumbotron fluid className="px-0">
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
      <Container>
        <Row>
          <Col>
            <Row>
              <h5>Title of a description</h5>
            </Row>
            <Row>
              <p>
                Brief introduction or description about the project will be
                located here.
              </p>
            </Row>
          </Col>
          <Col>
            <Row>
              <h5>Title of some description</h5>
            </Row>
            <Row>
              <p>
                Brief introduction or description about the project will be
                located here.
              </p>
            </Row>
          </Col>
          <Col>
            <Row>
              <h5>Title of some other description</h5>
            </Row>
            <Row>
              <p>
                Brief introduction or description about the project will be
                located here.
              </p>
            </Row>
          </Col>
        </Row>
      </Container>
    </Styles>
  );
}

export default Home;
