import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import styled, { keyframes } from "styled-components";
import { Map, TileLayer, GeoJSON, Popup, FeatureGroup } from "react-leaflet";
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

class Edit extends React.Component {
  state = {
    lat: 34,
    lng: -85,
    zoom: 6
  };

  // constructor(props) {
  //   super(props);
  //   this.state = { isClicked: false };

  //   this.handleClick = this.handleClick.bind(this);
  // }

  // handleClick() {
  //   this.setState(state => ({
  //     isClicked: !state.isClicked
  //   }));
  // }

  handleMouseOver(e) {
    e.target.openPopup();
  }

  handleMouseOut(e) {
    e.target.closePopup();
  }

  render() {
    const position = [this.state.lat, this.state.lng];
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
              <Map center={position} zoom={this.state.zoom}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                <FeatureGroup>
                  {ky.features.map(f => {
                    return (
                      <GeoJSON
                        data={f}
                        // onMouseOver={e => {
                        //   e.target.openPopup();
                        // }}
                        // onMouseOut={e => {
                        //   e.target.closePopup();
                        // }}
                        // onClick={e => {
                        //   e.target.openPopup();
                        // }}
                        onMouseOver={this.handleMouseOver}
                        onMouseOut={this.handleMouseOut}
                        // onClick={this.handleClick}
                      >
                        <Popup>{f.properties.name}</Popup>
                      </GeoJSON>
                    );
                  })}
                </FeatureGroup>
              </Map>
            </Col>
          </Row>
        </Container>
      </Styles>
    );
  }
}

export default Edit;
