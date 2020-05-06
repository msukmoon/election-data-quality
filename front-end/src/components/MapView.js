import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import { Map, TileLayer, FeatureGroup, Tooltip, Polygon } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import Control from "react-leaflet-control";
import { slide as Menu } from "react-burger-menu";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "leaflet-draw/dist/leaflet.draw.css";
import styled from "styled-components";

const Styles = styled.div`
  .btn-light {
    border-color: black;
    font-size: 12px;
  }

  .dropdown-item {
    color: black;
    font-size: 12px;
  }

  .form-check {
    font-size: 12px;
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

  /* Sidebar wrapper styles  */
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

class MapView extends React.Component {
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
        logBag: [],
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
              ethnicity: "Pacific Islander",
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
      precincts: [
        // DEBUG
        {
          precinctId: 1,
          fillColor: "#fff9c4",
          coordinates: [
            [
              [38.8, -84.5],
              [38.9, -84.5],
              [38.9, -84.4],
              [38.8, -84.4]
            ],
            [
              [38.825, -84.475],
              [38.875, -84.475],
              [38.875, -84.425],
              [38.825, -84.425]
            ]
          ]
        },
        {
          precinctId: 2,
          fillColor: "#fff9c4",
          coordinates: [
            [
              [38.8, -84.4],
              [38.9, -84.4],
              [39.0, -84.3],
              [38.9, -84.2],
              [38.8, -84.2]
            ]
          ]
        }
      ]
    };
  }

  handleMouseOver(e) {
    e.target.openTooltip();
  }

  handleMouseOut(e) {
    e.target.closeTooltip();
  }

  handleClick(e, id) {
    // TODO: Change fill color of the selected state
    const precinctsCopy = [...this.state.precincts];
    const precinctsIndex = precinctsCopy.findIndex(
      (el) => el.precinctId === id
    );
    precinctsCopy[precinctsIndex] = {
      ...precinctsCopy[precinctsIndex],
      fillColor: "#102027"
    };
    this.setState({ precincts: precinctsCopy });
    // this.setState(prevState => ({
    //   precincts: {
    //     ...prevState.precincts,
    //     fillColor: "#102027"
    //   }
    // }));
    // e.target.setStyle({ fillColor: "#102027" });

    // Modify map state
    this.setState({ latitude: e.latlng.lat, longitude: e.latlng.lng }); // TODO: Update zoom

    const demographicDataCopy = [...this.state.currPrecinct.demographicData];
    const electionDataCopy = [...this.state.currPrecinct.electionData];
    const ethnicityDataCopy = [...this.state.currPrecinct.county.ethnicityData];
    fetch("api/precinct/" + id)
      .then((res) => res.json())
      .then((data) => {
        console.log(data); // DEBUG: Remove this line later
        demographicDataCopy[0] = { population: data.population };
        electionDataCopy[0] = {
          ...electionDataCopy[0],
          demVotes: data.electionData.PRESIDENTIAL_16_DEM,
          repVotes: data.electionData.PRESIDENTIAL_16_REP
        };
        electionDataCopy[1] = {
          ...electionDataCopy[1],
          demVotes: data.electionData.CONGRESSIONAL_16_DEM,
          repVotes: data.electionData.CONGRESSIONAL_16_REP
        };
        electionDataCopy[2] = {
          ...electionDataCopy[2],
          demVotes: data.electionData.CONGRESSIONAL_18_DEM,
          repVotes: data.electionData.CONGRESSIONAL_18_REP
        };
        ethnicityDataCopy[0] = {
          ...ethnicityDataCopy[0],
          population: data.county.white
        };
        ethnicityDataCopy[1] = {
          ...ethnicityDataCopy[1],
          population: data.county.africanAmer
        };
        ethnicityDataCopy[2] = {
          ...ethnicityDataCopy[2],
          population: data.county.asian
        };
        ethnicityDataCopy[3] = {
          ...ethnicityDataCopy[3],
          population: data.county.nativeAmer
        };
        ethnicityDataCopy[4] = {
          ...ethnicityDataCopy[4],
          population: data.county.pasifika
        };
        ethnicityDataCopy[5] = {
          ...ethnicityDataCopy[5],
          population: data.county.others
        };
        this.setState({
          currPrecinct: {
            ...this.state.currPrecinct, // TODO: Remove this line later
            precinctId: data.precinctId,
            countyId: data.countyId,
            stateId: data.stateId,
            canonicalName: data.canonicalName,
            ghost: data.ghost,
            multipleBorder: data.multipleBorder,
            demographicData: demographicDataCopy,
            electionData: electionDataCopy,
            // TODO: add logBag
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

  handleStateChange(state) {
    this.setState({ sidebarOpen: state.isOpen });
  }

  handleStateSelect(id) {
    // Selected Kentucky
    if (id === 1) {
      this.setState({ latitude: 37.84, longitude: -84.27, zoom: 8 });
    }
    // Selected Louisiana
    else if (id === 2) {
      this.setState({ latitude: 30.98, longitude: -91.96, zoom: 8 });
    }
    // Selected South Carolina
    else if (id === 3) {
      this.setState({ latitude: 33.84, longitude: -81.16, zoom: 8 });
    }
  }

  handleTableChange(oldValue, newValue, row) {
    // DEBUG: Remove these lines below later
    console.log(oldValue);
    console.log(newValue);
    console.log(row);

    // TODO: Make a POST request to the server with "api/precinct"
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
    // DEBUG
    // fetch("api/precinct/all")
    //   .then((res) => res.json())
    //   .then((data) => {
    //     console.log(data); // DEBUG: Remove this line later
    //     data.map((currData) =>
    //       this.setState({
    //         precincts: [
    //           ...this.state.precincts,
    //           {
    //             precinctId: currData.precinctId,
    //             fillColor: "#fff9c4",
    //             coordinates: JSON.parse(currData.coordinates)
    //           }
    //         ]
    //       })
    //     );
    //   });
  }

  render() {
    console.log(this.state.precincts);
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
                  data={[]}
                  columns={demographicTableColumns}
                  noDataIndication="Data Not Available for Now"
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
              <Map center={position} zoom={this.state.zoom}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                <Control position="bottomleft">
                  <ButtonGroup vertical className="pb-2">
                    <DropdownButton
                      as={ButtonGroup}
                      id="bg-vertical-dropdown-1"
                      drop="right"
                      variant="light"
                      title="Select State"
                    >
                      <Dropdown.Item
                        eventKey="1"
                        onClick={() => this.handleStateSelect(1)}
                      >
                        Kentucky
                      </Dropdown.Item>
                      <Dropdown.Item
                        eventKey="2"
                        onClick={() => this.handleStateSelect(2)}
                      >
                        Louisiana
                      </Dropdown.Item>
                      <Dropdown.Item
                        eventKey="3"
                        onClick={() => this.handleStateSelect(3)}
                      >
                        South Carolina
                      </Dropdown.Item>
                    </DropdownButton>
                    <DropdownButton
                      as={ButtonGroup}
                      id="bg-vertical-dropdown-2"
                      drop="right"
                      variant="light"
                      title="Select Election"
                    >
                      <Dropdown.Item eventKey="1" /* onClick={} */>
                        2016 Presidential
                      </Dropdown.Item>
                      <Dropdown.Item eventKey="2" /* onClick={} */>
                        2016 Congressional
                      </Dropdown.Item>
                      <Dropdown.Item eventKey="3" /* onClick={} */>
                        2018 Congressional
                      </Dropdown.Item>
                    </DropdownButton>
                    <Button variant="light">Add Neighbor</Button>
                    <Button variant="light">Delete Neighbor</Button>
                    <Button variant="light">Merge Precincts</Button>
                  </ButtonGroup>
                  <Card>
                    <Card.Body>
                      <Form>
                        <Form.Check
                          type="switch"
                          id="1"
                          label="View National Park Boundaries"
                          bsCustomPrefix="form-check"
                        />
                      </Form>
                      <Form.Check
                        className="pb-1"
                        type="switch"
                        id="2"
                        label="View Congressional District Boundaries"
                        bsCustomPrefix="form-check"
                      />
                    </Card.Body>
                  </Card>
                </Control>
                <FeatureGroup>
                  <EditControl
                    position="topleft"
                    // TODO: Update new coordinates in the state object
                    // onEdited={this._onEditPath}
                    // TODO: Push new precinct object to the precincts array
                    // onCreated={this._onCreate}
                    // TODO: Delete precinct object from the precincts array
                    // TODO: Do not open side bar when clicking a precinct to delete
                    // onDeleted={this._onDeleted}
                    draw={{
                      polyline: false,
                      circle: false,
                      marker: false,
                      circlemarker: false
                    }}
                  />
                  {this.state.precincts.map((precinct) => {
                    return (
                      <Polygon
                        positions={precinct.coordinates}
                        smoothFactor={5}
                        color={"#102027"}
                        weight={1}
                        fillOpacity={0.5}
                        fillColor={precinct.fillColor}
                        onClick={(e) =>
                          this.handleClick(e, precinct.precinctId)
                        }
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

export default MapView;
