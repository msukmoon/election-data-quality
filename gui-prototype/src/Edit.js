import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Map, TileLayer, FeatureGroup, Tooltip, Polygon } from "react-leaflet";
import { slide as Menu } from "react-burger-menu";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import styled, { keyframes } from "styled-components";

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
      latitude: 38.85,
      longitude: -84.35,
      zoom: 10,
      sidebarOpen: false,
      currPrecinct: {
        precinctId: null,
        countyId: null,
        stateId: null,
        canonicalName: null,
        ghost: null,
        multipleBorder: null,
        adjacentPrecinctIds: [],
        enclosingPrecinctIds: [],
        demographicData: [{ population: null }],
        electionData: [
          {
            election: "2016 Presidential",
            demVotes: null,
            repVotes: null
          },
          {
            election: "2016 Congressional",
            demVotes: null,
            repVotes: null
          },
          {
            election: "2018 Congressional",
            demVotes: null,
            repVotes: null
          }
        ],
        logBag: [
          {
            id: null,
            category: null,
            comment: null
          }
        ],
        county: {
          id: null,
          canonicalName: null,
          ethnicityData: [
            {
              ethnicity: "White",
              population: null
            },
            {
              ethnicity: "Black or African American",
              population: null
            },
            {
              ethnicity: "Asian or Asian American",
              population: null
            },
            {
              ethnicity: "American Indian",
              population: null
            },
            {
              ethnicity: "Hispanic or Latino",
              population: null
            },
            {
              ethnicity: "Others",
              population: null
            }
          ],
          state: {
            id: null,
            canonicalName: null
          }
        },
        coordinates: []
        // TODO: Add more properties
      },
      precincts: []
    };
  }

  handleMouseOver(e) {
    e.target.openTooltip();
  }

  handleMouseOut(e) {
    e.target.closeTooltip();
  }

  handleClick(id) {
    const demographicDataCopy = [...this.state.currPrecinct.demographicData];
    const electionDataCopy = [...this.state.currPrecinct.electionData];
    const ethnicityDataCopy = [...this.state.currPrecinct.county.ethnicityData];
    fetch("api/precinct/" + id)
      .then((res) => res.json())
      .then((data) => {
        console.log(data); // TODO: Remove this line later
        demographicDataCopy[0] = { population: data.population };
        electionDataCopy[0] = {
          election: "2016 Presidential",
          demVotes: data.electionData.PRESIDENTIAL_16_DEM,
          repVotes: data.electionData.PRESIDENTIAL_16_REP
        };
        electionDataCopy[1] = {
          election: "2016 Congressional",
          demVotes: data.electionData.CONGRESSIONAL_16_DEM,
          repVotes: data.electionData.CONGRESSIONAL_16_REP
        };
        electionDataCopy[2] = {
          election: "2018 Congressional",
          demVotes: data.electionData.CONGRESSIONAL_18_DEM,
          repVotes: data.electionData.CONGRESSIONAL_18_REP
        };
        ethnicityDataCopy[0] = {
          ethnicity: "White",
          population: data.county.ethnicityData.WHITE
        };
        ethnicityDataCopy[1] = {
          ethnicity: "Black or African American",
          population: data.county.ethnicityData.AFRICAN_AMERICAN
        };
        ethnicityDataCopy[2] = {
          ethnicity: "Asian or Asian American",
          population: data.county.ethnicityData.ASIAN_PACIFIC
        };
        ethnicityDataCopy[3] = {
          ethnicity: "American Indian",
          population: data.county.ethnicityData.NATIVE
        };
        ethnicityDataCopy[4] = {
          ethnicity: "Hispanic or Latino",
          population: data.county.ethnicityData.HISPANIC
        };
        ethnicityDataCopy[5] = {
          ethnicity: "Others",
          population: data.county.ethnicityData.OTHER
        };
        this.setState({
          currPrecinct: {
            precinctId: data.precinctId,
            countyId: data.countyId,
            stateId: data.stateId,
            canonicalName: data.canonicalName,
            ghost: data.ghost,
            multipleBorder: data.multipleBorder,
            demographicData: demographicDataCopy,
            electionData: electionDataCopy,
            // logBag: [
            //   ...this.state.currPrecinct.logBag,
            //   {
            //     id: null,
            //     category: null,
            //     comment: null
            //   }
            // ],
            county: {
              ethnicityData: ethnicityDataCopy
            }
            // TODO: Add more properties
          }
        });
      });
    this.setState(() => ({ sidebarOpen: true }));
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

  handleTableChange(oldValue, newValue, row) {
    // TODO: Remove these lines below later
    console.log(oldValue);
    console.log(newValue);
    console.log(row);

    // fetch("api/precinct", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json"
    //   },
    //   body: JSON.stringify()
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log("Success:", data);
    //   })
    //   .catch((error) => {
    //     console.error("Error:", error);
    //   });
  }

  componentDidMount() {
    fetch("api/precinct/all")
      .then((res) => res.json())
      .then((data) => {
        console.log(data); // TODO: Remove this line later
        data.map((currData) =>
          this.setState({
            precincts: [
              ...this.state.precincts,
              {
                precinctId: currData.precinctId,
                coordinates: JSON.parse(currData.coordinates)
              }
            ]
          })
        );
      });
  }

  render() {
    const position = [this.state.latitude, this.state.longitude];
    const electionTableColumns = [
      {
        dataField: "election",
        text: "Election"
      },
      {
        dataField: "demVotes",
        text: "Democratic Votes"
      },
      {
        dataField: "repVotes",
        text: "Republican Votes"
      }
    ];
    const demographicTableColumns = [
      {
        dataField: "population",
        text: "Population (Precinct Level)"
      }
    ];
    const ethnicityTableColumns = [
      {
        dataField: "ethnicity",
        text: "Ethnicity"
      },
      {
        dataField: "population",
        text: "Population (County Level)"
      }
    ];
    const logTableColumns = [
      {
        dataField: "id",
        text: "Log ID"
      },
      {
        dataField: "category",
        text: "Error Category"
      },
      {
        dataField: "comment",
        text: "User Comment"
      }
    ];
    const dataSourceTableColumns = [
      {
        dataField: "name",
        text: "Source Name"
      },
      {
        dataField: "category",
        text: "Data Category"
      },
      {
        dataField: "url",
        text: "Source URL"
      }
    ];
    return (
      <Styles>
        <Menu
          right
          width={"60%"}
          menuClassName={"menu-right"}
          customBurgerIcon={false}
          isOpen={this.state.sidebarOpen}
          onStateChange={(state) => this.handleStateChange(state)}
        >
          <Container fluid className="px-0">
            <Row className="pb-2">
              <Col>
                <h2>21-117-B121</h2>
              </Col>
            </Row>
            <Row className="pb-1">
              <Col>
                <h4>Election Data</h4>
              </Col>
            </Row>
            <Row className="pb-2">
              <Col>
                <BootstrapTable
                  striped
                  hover
                  condensed
                  keyField="election"
                  data={this.state.currPrecinct.electionData}
                  columns={electionTableColumns}
                  cellEdit={cellEditFactory({
                    mode: "click",
                    blurToSave: true,
                    afterSaveCell: this.handleTableChange
                  })}
                />
              </Col>
            </Row>
            <Row className="pb-1">
              <Col>
                <h4>Demographic Data</h4>
              </Col>
            </Row>
            <Row className="pb-1">
              <Col>
                <BootstrapTable
                  striped
                  hover
                  condensed
                  keyField="population"
                  data={this.state.currPrecinct.demographicData}
                  columns={demographicTableColumns}
                  cellEdit={cellEditFactory({
                    mode: "click",
                    blurToSave: true
                  })}
                />
              </Col>
            </Row>
            <Row className="pb-2">
              <Col>
                <BootstrapTable
                  striped
                  hover
                  condensed
                  keyField="ethnicity"
                  data={this.state.currPrecinct.county.ethnicityData}
                  columns={ethnicityTableColumns}
                  cellEdit={cellEditFactory({
                    mode: "click",
                    blurToSave: true
                  })}
                />
              </Col>
            </Row>
            <Row className="pb-1">
              <Col>
                <h4>Corrections Log</h4>
              </Col>
            </Row>
            <Row className="pb-2">
              <Col>
                <BootstrapTable
                  striped
                  hover
                  condensed
                  keyField="id"
                  data={[]}
                  columns={logTableColumns}
                  noDataIndication="Data Not Available for Now"
                  cellEdit={cellEditFactory({
                    mode: "click",
                    blurToSave: true
                  })}
                />
              </Col>
            </Row>
            <Row className="pb-1">
              <Col>
                <h4>Data Sources</h4>
              </Col>
            </Row>
            <Row className="pb-5">
              <Col>
                <BootstrapTable
                  striped
                  hover
                  condensed
                  keyField="name"
                  data={[]}
                  columns={dataSourceTableColumns}
                  noDataIndication="Data Not Available for Now"
                  cellEdit={cellEditFactory({
                    mode: "click",
                    blurToSave: true
                  })}
                />
              </Col>
            </Row>
          </Container>
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
                        onClick={() => this.handleClick(precinct.precinctId)}
                        onDblClick={this.handleDblClick}
                        onMouseOver={this.handleMouseOver}
                        onMouseOut={this.handleMouseOut}
                      >
                        <Tooltip>
                          <b>{precinct.precinctId}</b>
                        </Tooltip>
                      </Polygon>
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
