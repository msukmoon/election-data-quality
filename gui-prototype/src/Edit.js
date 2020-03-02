import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import styled from "styled-components";
import { Map, Marker, Popup, TileLayer, GeoJSON } from "react-leaflet";
import ky from "./data/Kentucky.json";
import la from "./data/Louisiana.json";
import sc from "./data/SouthCarolina.json";

const Styles = styled.div`
  .nav {
    background-color: #9ea7aa;
  },
  .nav-item .nav-link {
    color: black;

    &:hover {
      color: white;
    }
  },
  .leaflet-container {
    width: 100%;
    height: 80vh;
  },
`;

function Edit() {
  return (
    <Styles>
      <Container className="pt-5">
        <Row>
          <Col>
            <Nav variant="pills">
              <Nav.Item>
                <Nav.Link eventKey="b1">Create Ghost</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="b2">Connect Precincts</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="b3">Highlight Neighbors</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="b4">Screenshot</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
        </Row>
        <Row>
          <Col>
            <Map center={[34, -85]} zoom={6}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              <GeoJSON data={ky} />
              <GeoJSON data={la} />
              <GeoJSON data={sc} />
            </Map>
          </Col>
        </Row>
      </Container>
    </Styles>
  );
}

export default Edit;
