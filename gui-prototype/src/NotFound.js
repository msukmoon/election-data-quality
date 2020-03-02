import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import styled from "styled-components";

const Styles = styled.div``;

function NotFound() {
  return (
    <Styles>
      <Container className="pt-5">
        <Row>
          <Col>
            <h2>Error 404</h2>
          </Col>
        </Row>
        <Row>
          <Col>Page not found :(</Col>
        </Row>
      </Container>
    </Styles>
  );
}

export default NotFound;
