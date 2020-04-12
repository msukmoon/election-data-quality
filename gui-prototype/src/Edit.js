import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Table from "react-bootstrap/Table";
import {
  Map,
  TileLayer,
  GeoJSON,
  FeatureGroup,
  Tooltip,
  Polygon,
} from "react-leaflet";
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
    height: 90vh;
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
    color: black;
    padding: 0;
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
    zoom: 6,
    precincts: [
      {
        id: 1,
        coordinates: [
          [
            [37, -109.05],
            [41, -109.03],
            [41, -102.05],
            [37, -102.04],
          ],
          [
            [37.29, -108.58],
            [40.71, -108.58],
            [40.71, -102.5],
            [37.29, -102.5],
          ],
        ],
      },
    ],
  };

  constructor(props) {
    super(props);
    // this.state = {
    //   isSidebarOpen: false
    // };
    // this.isSidebarOpen = this.handleClick.bind(this);
    // this.mapRef = React.createRef();
  }

  // getStyle() {
  //   return {
  //     color: "#102027",
  //     weight: 1,
  //     fillOpacity: 0.5,
  //     fillColor: "#fff9c4",
  //   };
  // }

  handleMouseOver(e) {
    e.target.openTooltip();
  }

  handleMouseOut(e) {
    e.target.closeTooltip();
  }

  handleClick() {
    // this.setState(state => ({
    //   isSidebarOpen: state.isOpen
    // }));
  }

  handleDblClick() {}

  // handleStateSelect(mapRef) {
  //   this.mapRef.setZoom(5);
  // }

  render() {
    const position = [this.state.lat, this.state.lng];
    this.state.precincts.push({
      id: 2,
      coordinates: [
        [
          [41, -111.03],
          [45, -111.04],
          [46, -107.05],
          [45, -104.05],
          [41, -104.05],
        ],
      ],
    });
    return (
      <Styles>
        <Menu
          right
          width={"50%"}
          menuClassName={"menu-right"}
          burgerButtonClassName={"burger-right"}
          // isOpen={this.state.isSidebarOpen}
          // onStateChange={this.handleStateChange}
        >
          <h3>Precinct Bradfordsville</h3>
          <h5>Marion County, Kentucky</h5>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>Population</th>
                <th>Registered</th>
                <th>Democrats</th>
                <th>Republicans</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>10000</td>
                <td>5000</td>
                <td>2600</td>
                <td>2400</td>
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
                <NavDropdown title="State" id="basic-nav-dropdown">
                  <NavDropdown.Item /* onClick={this.handleStateSelect} */>
                    Kentucky
                  </NavDropdown.Item>
                  <NavDropdown.Item /* onClick={this.handleStateSelect} */>
                    Louisiana
                  </NavDropdown.Item>
                  <NavDropdown.Item /* onClick={this.handleStateSelect} */>
                    South Carolina
                  </NavDropdown.Item>
                </NavDropdown>
                <NavDropdown title="Data" id="basic-nav-dropdown">
                  <NavDropdown.Item /* onClick={this.handleStateSelect} */>
                    2016 Presidential
                  </NavDropdown.Item>
                  <NavDropdown.Item /* onClick={this.handleStateSelect} */>
                    2016 Congressional
                  </NavDropdown.Item>
                  <NavDropdown.Item /* onClick={this.handleStateSelect} */>
                    2018 Congressional
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Col>
          </Row>
          <Row>
            <Col>
              <Map
                // ref={ref => {
                //   this.mapRef = ref;
                // }}
                center={position}
                zoom={this.state.zoom}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                <FeatureGroup>
                  {this.state.precincts.map((precinct) => {
                    return (
                      <Polygon
                        positions={precinct.coordinates}
                        smoothFactor={5}
                        color={"#102027"}
                        weight={1}
                        fillOpacity={0.5}
                        fillColor={"#fff9c4"}
                        onClick={this.handleClick}
                        onDblClick={this.handleDblClick}
                        onMouseOver={this.handleMouseOver}
                        onMouseOut={this.handleMouseOut}
                      >
                        <Tooltip>
                          <b>{"Precinct ID: " + precinct.id}</b>
                        </Tooltip>
                      </Polygon>
                    );
                  })}
                </FeatureGroup>
                {/* <FeatureGroup>
                  {ky.features.map(f => {
                    return (
                      <GeoJSON
                        key={f.properties.id}
                        data={f}
                        style={this.getStyle}
                        onMouseOver={this.handleMouseOver}
                        onMouseOut={this.handleMouseOut}
                        // onClick={this.handleClick}
                      >
                        <Tooltip>
                          <b>{"Precinct " + f.properties.name}</b>
                        </Tooltip>
                      </GeoJSON>
                    );
                  })}
                  {la.features.map(f => {
                    return (
                      <GeoJSON
                        key={f.properties.id}
                        data={f}
                        style={this.getStyle}
                        onMouseOver={this.handleMouseOver}
                        onMouseOut={this.handleMouseOut}
                        // onClick={this.handleClick}
                      >
                        <Tooltip>
                          <b>{"Precinct " + f.properties.name}</b>
                        </Tooltip>
                      </GeoJSON>
                    );
                  })}
                  {sc.features.map(f => {
                    return (
                      <GeoJSON
                        key={f.properties.id}
                        data={f}
                        style={this.getStyle}
                        onMouseOver={this.handleMouseOver}
                        onMouseOut={this.handleMouseOut}
                        // onClick={this.handleClick}
                      >
                        <Tooltip>
                          <b>{"Precinct " + f.properties.name}</b>
                        </Tooltip>
                      </GeoJSON>
                    );
                  })}
                </FeatureGroup> */}
              </Map>
            </Col>
          </Row>
        </Container>
      </Styles>
    );
  }
}

export default Edit;
