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
  Polygon
} from "react-leaflet";
import { slide as Menu } from "react-burger-menu";
import styled, { keyframes } from "styled-components";
// import ky from "./data/Kentucky.json";
// import la from "./data/Louisiana.json";
// import sc from "./data/SouthCarolina.json";

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
  constructor(props) {
    super(props);
    this.state = {
      latitude: 34,
      longitude: -85,
      zoom: 6,
      sidebarOpen: false,
      currPrecinct: 0,
      precincts: [
        // {
        //   id: 1,
        //   coordinates: [
        //     [
        //       [37, -109.05],
        //       [41, -109.03],
        //       [41, -102.05],
        //       [37, -102.04]
        //     ],
        //     [
        //       [37.29, -108.58],
        //       [40.71, -108.58],
        //       [40.71, -102.5],
        //       [37.29, -102.5]
        //     ]
        //   ]
        // }
      ]
    };
  }

  // getStyle() {
  //   return {
  //     color: "#102027",
  //     weight: 1,
  //     fillOpacity: 0.5,
  //     fillColor: "#fff9c4",
  //   };
  // }

  displayPrecinctData() {
    return this.state.currPrecinct;
  }

  handleMouseOver(e) {
    e.target.openTooltip();
  }

  handleMouseOut(e) {
    e.target.closeTooltip();
  }

  handleClick(id) {
    this.setState({ currPrecinct: id, sidebarOpen: true });
  }

  handleDblClick() {}

  handleStateChange(state) {
    this.setState({ sidebarOpen: state.isOpen });
  }

  handleStateSelect(id) {
    // Kentucky is selected
    if (id === 1) {
      this.setState({ latitude: 37.84, longitude: -84.27, zoom: 8 });
    }
    // Louisiana is selected
    else if (id === 2) {
      this.setState({ latitude: 30.98, longitude: -91.96, zoom: 8 });
    }
    // South Carolina is selected
    else if (id === 3) {
      this.setState({ latitude: 33.84, longitude: -81.16, zoom: 8 });
    }
  }

  componentDidMount() {
    // fetch("api/precinct", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json"
    //   },
    //   body: JSON.stringify({
    //     "districtId": "1",
    //     "countyId": "1",
    //     "stateId": "1",
    //     "canonicalName": "foo-bar",
    //     "population": 22,

    //     "ethnicityMap": {
    //       "WHITE": 199,
    //       "AFRICAN_AMERICAN": 100,
    //       "ASIAN_PACIFIC": 200,
    //       "HISPANIC": 300,
    //       "NATIVE": 400,
    //       "OTHER": 200
    //     },
    //     "electionMap": {
    //       "CONGRESSIONAL_16_REP": 10,
    //       "CONGRESSIONAL_18_REP": 200,
    //       "PRESIDENTIAL_16_REP": 300,
    //       "CONGRESSIONAL_16_DEM": 100,
    //       "CONGRESSIONAL_18_DEM": 200,
    //       "PRESIDENTIAL_16_DEM": 300
    //     },
    //     "adjacentPrecinctIds": [],
    //     "logBag": {
    //       "1": "i dunno what i'm doing",
    //       "2": "the integer key is the id for each comment"
    //     },
    //     "ghost": false,
    //     "coordinates": [
    //       [
    //         [37.1, -109.05],
    //         [41.1, -109.03],
    //         [41.1, -102.05],
    //         [37.11, -102.04]
    //       ],
    //       [
    //         [37.29, -108.58],
    //         [40.71, -108.58],
    //         [40.71, -102.5],
    //         [37.29, -102.5]
    //       ]
    //     ]
    //   })
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log("Success:", data);
    //   })
    //   .catch((error) => {
    //     console.error("Error:", error);
    //   });

    // fetch("api/precinct", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json"
    //   },
    //   body: JSON.stringify({
    //     "districtId": "1",
    //     "countyId": "1",
    //     "stateId": "1",
    //     "canonicalName": "baz-foo",
    //     "population": 22,
    //     "ethnicityMap": {
    //       "WHITE": 199,
    //       "AFRICAN_AMERICAN": 100,
    //       "ASIAN_PACIFIC": 200,
    //       "HISPANIC": 300,
    //       "NATIVE": 400,
    //       "OTHER": 200
    //     },
    //     "electionMap": {
    //       "CONGRESSIONAL_16_REP": 10,
    //       "CONGRESSIONAL_18_REP": 200,
    //       "PRESIDENTIAL_16_REP": 300,
    //       "CONGRESSIONAL_16_DEM": 100,
    //       "CONGRESSIONAL_18_DEM": 200,
    //       "PRESIDENTIAL_16_DEM": 300
    //     },
    //     "adjacentPrecinctIds": [],
    //     "logBag": {
    //       "1": "something went wrong",
    //       "2": "the integer key is the id for each comment"
    //     },
    //     "ghost": false,
    //     "coordinates": [
    //       [
    //         [41, -111.03],
    //         [45, -111.04],
    //         [46, -107.05],
    //         [45, -104.05],
    //         [41, -104.05]
    //       ]
    //     ]
    //   })
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log("Success:", data);
    //   })
    //   .catch((error) => {
    //     console.error("Error:", error);
    //   });

    fetch("api/precinct/all")
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        data.map((currData) =>
          this.setState({
            precincts: [
              ...this.state.precincts,
              { id: currData.id, coordinates: currData.coordinates }
            ]
          })
        );
      });
  }

  render() {
    const position = [this.state.latitude, this.state.longitude];
    // this.state.precincts.push({
    //   id: 2,
    //   coordinates: [
    //     [
    //       [41, -111.03],
    //       [45, -111.04],
    //       [46, -107.05],
    //       [45, -104.05],
    //       [41, -104.05]
    //     ]
    //   ]
    // });
    return (
      <Styles>
        <Menu
          right
          width={"50%"}
          menuClassName={"menu-right"}
          customBurgerIcon={false}
          isOpen={this.state.sidebarOpen}
          onStateChange={(state) => this.handleStateChange(state)}
        >
          <h3>{this.displayPrecinctData()}</h3>
          <h5>Test County, Test</h5>
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
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
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
                  <NavDropdown.Item onClick={() => this.handleStateSelect(1)}>
                    Kentucky
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={() => this.handleStateSelect(2)}>
                    Louisiana
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={() => this.handleStateSelect(3)}>
                    South Carolina
                  </NavDropdown.Item>
                </NavDropdown>
                <NavDropdown title="Data" id="basic-nav-dropdown">
                  <NavDropdown.Item /* onClick={} */>
                    2016 Presidential
                  </NavDropdown.Item>
                  <NavDropdown.Item /* onClick={} */>
                    2016 Congressional
                  </NavDropdown.Item>
                  <NavDropdown.Item /* onClick={} */>
                    2018 Congressional
                  </NavDropdown.Item>
                </NavDropdown>
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
                  {this.state.precincts.map((precinct) => {
                    return (
                      <Polygon
                        positions={precinct.coordinates}
                        smoothFactor={5}
                        color={"#102027"}
                        weight={1}
                        fillOpacity={0.5}
                        fillColor={"#fff9c4"}
                        onClick={() => this.handleClick(precinct.id)}
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
                  {ky.features.map((f) => {
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
                  {la.features.map((f) => {
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
                  {sc.features.map((f) => {
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
