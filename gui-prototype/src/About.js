import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import styled from "styled-components";

const Styles = styled.div``;

function About() {
  return (
    <Styles>
      <Container className="pt-5">
        <Row>
          <Col>
            <h2>About us</h2>
          </Col>
        </Row>
        <Row>
          <Col>
            We are Team Cyclones from Stony Brook University's Spring 2020 CSE
            416-01 Class.
          </Col>
        </Row>
      </Container>
    </Styles>
  );
}

export default About;
