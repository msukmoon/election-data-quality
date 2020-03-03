import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Table from "react-bootstrap/Table";
import { Map, TileLayer, GeoJSON, FeatureGroup, Tooltip } from "react-leaflet";
import { slide as Menu } from "react-burger-menu";
import styled, { keyframes } from "styled-components";
import ky from "./data/Kentucky.json";
import la from "./data/Louisiana.json";
import sc from "./data/SouthCarolina.json";

const Styles = styled.div`
  .nav {
    background-color: #37474f;
  }

  .nav-item .nav-link {
    color: white;

    &:hover {
      color: #9ea7aa;
    }
  }

  .leaflet-container {
    width: 100%;
    height: 100vh;
  }

  // NOTE: helper classes below are from react-burger-menu library
  /* Position and sizing of burger button */
  .bm-burger-button {
    position: fixed;
    width: 20px;
    height: 20px;
    right: 20px;
    top: 16px;
  }

  /* Color/shape of burger icon bars */
  .bm-burger-bars {
    background: white;
  }

  /* Color/shape of burger icon bars on hover*/
  .bm-burger-bars-hover {
    background: #9ea7aa;
  }

  /* Position and sizing of clickable cross button */
  .bm-cross-button {
    height: 24px;
    width: 24px;
  }

  /* Color/shape of close button cross */
  .bm-cross {
    background: black;
  }

  /*
  Sidebar wrapper styles
  Note: Beware of modifying this element as it can break the animations - you should not need to touch it in most cases
  */
  .bm-menu-wrap {
    position: fixed;
    height: 100%;
  }

  /* General sidebar styles */
  .bm-menu {
    background: #cfd8dc;
    padding: 2.5em 1.5em 0;
    font-size: 1.15em;
  }

  /* Wrapper for item list */
  .bm-item-list {
    color: white;
    padding: 0.8em;
  }

  /* Individual item */
  .bm-item {
    display: inline-block;
  }

  /* Styling of overlay */
  .bm-overlay {
    background: rgba(0, 0, 0, 0.3);
  }
`;

class Edit extends React.Component {
  state = {
    lat: 34,
    lng: -85,
    zoom: 6
  };

  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     // isClicked: false,
  //     isSidebarOpen: false
  //   };
  //   // this.handleClick = this.handleClick.bind(this);
  // }

  getStyle() {
    return {
      color: "#102027",
      weight: 1,
      fillOpacity: 0.5,
      fillColor: "#fff9c4"
    };
  }

  handleMouseOver(e) {
    e.target.openTooltip();
  }

  handleMouseOut(e) {
    e.target.closeTooltip();
  }

  // handleClick() {
  //   this.setState(state => ({
  //     isClicked: state.isClicked
  //   }));
  // }

  handleClick() {
    this.setState(state => ({
      isSidebarOpen: state.isOpen
    }));
  }

  render() {
    const position = [this.state.lat, this.state.lng];
    return (
      <Styles>
        <Menu
          right
          width={"40%"}
          menuClassName={"menu-right"}
          burgerButtonClassName={"burger-right"}
          // isOpen={this.state.isSidebarOpen}
          // onStateChange={this.handleStateChange}
        >
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>Population</th>
                <th>Registered</th>
                <th>Democrats</th>
                <th>Republicans</th>
                <th>Difference</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>10000</td>
                <td>5000</td>
                <td>2600</td>
                <td>2400</td>
                <td>200</td>
              </tr>
            </tbody>
          </Table>
        </Menu>
        <Container fluid className="px-0">
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
                        key={f.properties.id}
                        data={f}
                        style={this.getStyle}
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
                        <Tooltip>
                          {"Precinct Name: " + f.properties.name}
                        </Tooltip>
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
