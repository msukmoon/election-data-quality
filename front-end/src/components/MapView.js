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
      latitude: 34,
      longitude: -85,
      zoom: 6,
      sidebarOpen: false,
      currPrecinct: {
        id: null,
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
      states: [],
      counties: [],
      precincts: [
        // DEBUG
        // {
        //   id: 1,
        //   fillColor: "#fff9c4",
        //   coordinates: [
        //     [
        //       [38.8, -84.5],
        //       [38.9, -84.5],
        //       [38.9, -84.4],
        //       [38.8, -84.4]
        //     ],
        //     [
        //       [38.825, -84.475],
        //       [38.875, -84.475],
        //       [38.875, -84.425],
        //       [38.825, -84.425]
        //     ]
        //   ]
        // },
        // {
        //   id: 2,
        //   fillColor: "#fff9c4",
        //   coordinates: [
        //     [
        //       [38.8, -84.4],
        //       [38.9, -84.4],
        //       [39.0, -84.3],
        //       [38.9, -84.2],
        //       [38.8, -84.2]
        //     ]
        //   ]
        // }
      ]
    };
  }

  handleStateChange(state) {
    this.setState({ sidebarOpen: state.isOpen });
  }

  handleMouseOver(e) {
    e.target.openTooltip();
  }

  handleMouseOut(e) {
    e.target.closeTooltip();
  }

  handlePrecinctClick(e, id) {
    // TODO: Change fill color of the selected state
    const precinctsCopy = [...this.state.precincts];
    const precinctsIndex = precinctsCopy.findIndex((el) => el.id === id);
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
        // demographicDataCopy[0] = { population: data.population };
        // electionDataCopy[0] = {
        //   ...electionDataCopy[0],
        //   demVotes: data.electionData.PRESIDENTIAL_16_DEM,
        //   repVotes: data.electionData.PRESIDENTIAL_16_REP
        // };
        // electionDataCopy[1] = {
        //   ...electionDataCopy[1],
        //   demVotes: data.electionData.CONGRESSIONAL_16_DEM,
        //   repVotes: data.electionData.CONGRESSIONAL_16_REP
        // };
        // electionDataCopy[2] = {
        //   ...electionDataCopy[2],
        //   demVotes: data.electionData.CONGRESSIONAL_18_DEM,
        //   repVotes: data.electionData.CONGRESSIONAL_18_REP
        // };
        ethnicityDataCopy[0] = {
          ...ethnicityDataCopy[0],
          population: data.white
        };
        ethnicityDataCopy[1] = {
          ...ethnicityDataCopy[1],
          population: data.africanAmer
        };
        ethnicityDataCopy[2] = {
          ...ethnicityDataCopy[2],
          population: data.asian
        };
        ethnicityDataCopy[3] = {
          ...ethnicityDataCopy[3],
          population: data.nativeAmer
        };
        ethnicityDataCopy[4] = {
          ...ethnicityDataCopy[4],
          population: data.pasifika
        };
        ethnicityDataCopy[5] = {
          ...ethnicityDataCopy[5],
          population: data.others
        };
        this.setState({
          currPrecinct: {
            ...this.state.currPrecinct, // TODO: Remove this line later
            id: data.id,
            canonicalName: data.canonicalName,
            ghost: data.ghost,
            multipleBorder: data.multipleBorder,
            // demographicData: demographicDataCopy,
            // electionData: electionDataCopy,
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

  handleCountyClick(e, id) {
    fetch("api/county/" + id)
      .then((res) => res.json())
      .then((data) => {
        console.log(data); // DEBUG: Remove this line later
        data.precincts.map((currData) =>
          this.setState({
            precincts: [
              ...this.state.precincts,
              {
                id: currData.id,
                fillColor: "#fff9c4",
                coordinates: JSON.parse(currData.coordinates)
              }
            ]
          })
        );
      });
  }

  handleStateClick(e, id) {
    // Get counties of a selected state
    fetch("api/state/" + id)
      .then((res) => res.json())
      .then((data) => {
        console.log(data); // DEBUG: Remove this line later
        data.counties.map((currData) =>
          this.setState({
            counties: [
              ...this.state.counties,
              {
                id: currData.id,
                fillColor: "#fff9c4",
                coordinates: JSON.parse(currData.coordinates)
              }
            ]
          })
        );
      });
    // Selected Kentucky
    if (id === "21") {
      this.setState({ latitude: 37.84, longitude: -84.27, zoom: 8 });
    }
    // Selected Louisiana
    else if (id === "22") {
      console.log(id);
      this.setState({ latitude: 30.98, longitude: -91.96, zoom: 8 });
    }
    // Selected South Carolina
    else if (id === "45") {
      console.log(id);
      this.setState({ latitude: 33.84, longitude: -81.16, zoom: 8 });
    }
  }

  handleStateSelect(id) {
    // Get counties of a selected state
    fetch("api/state/" + id)
      .then((res) => res.json())
      .then((data) => {
        console.log(data); // DEBUG: Remove this line later
        data.counties.map((currData) =>
          this.setState({
            counties: [
              ...this.state.counties,
              {
                id: currData.id,
                fillColor: "#fff9c4",
                coordinates: JSON.parse(currData.coordinates)
              }
            ]
          })
        );
      });
    // Selected Kentucky
    if (id === 21) {
      this.setState({ latitude: 37.84, longitude: -84.27, zoom: 8 });
    }
    // Selected Louisiana
    else if (id === 22) {
      this.setState({ latitude: 30.98, longitude: -91.96, zoom: 8 });
    }
    // Selected South Carolina
    else if (id === 45) {
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

  handlePolygonCreated(e) {
    // TODO: Push new precinct object to the precincts array
    // TODO: Make a POST request to the server to add new precinct
    console.log(e);
  }

  handlePolygonEdited(e) {
    // TODO: Update new coordinates in the state object
    // TODO: Make a POST request to the server to update precinct coordinates
    e.layers.eachLayer((layer) => {
      console.log(layer.options.id);
      console.log(layer.getLatLngs());
      console.log(layer.toGeoJSON().geometry.coordinates);
    });
  }

  handlePolygonDeleted(e) {
    // TODO: Delete precinct object from the precincts array
    // TODO: Do not open side bar when clicking a precinct to delete
  }

  componentDidMount() {
    fetch("api/state/all")
      .then((res) => res.json())
      .then((data) => {
        console.log(data); // DEBUG: Remove this line later
        data.map((currData) =>
          this.setState({
            states: [
              ...this.state.states,
              {
                id: currData.id,
                fillColor: "#fff9c4",
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
                <h2>Canonical Name</h2>
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
                  url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, 
                    &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> 
                    &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
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
                        onSelect={() => this.handleStateSelect(21)}
                      >
                        Kentucky
                      </Dropdown.Item>
                      <Dropdown.Item
                        onSelect={() => this.handleStateSelect(22)}
                      >
                        Louisiana
                      </Dropdown.Item>
                      <Dropdown.Item
                        onSelect={() => this.handleStateSelect(45)}
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
                      <Dropdown.Item /* onSelect={} */>
                        2016 Presidential
                      </Dropdown.Item>
                      <Dropdown.Item /* onSelect={} */>
                        2016 Congressional
                      </Dropdown.Item>
                      <Dropdown.Item /* onSelect={} */>
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
                    onCreated={this.handlePolygonCreated}
                    onEdited={this.handlePolygonEdited}
                    onDeleted={this.handlePolygonDeleted}
                    draw={{
                      polyline: false,
                      circle: false,
                      marker: false,
                      circlemarker: false
                    }}
                  />
                  {this.state.states.map((state) => {
                    return (
                      <Polygon
                        id={state.id}
                        key={state.id}
                        positions={state.coordinates}
                        smoothFactor={1}
                        color={"#102027"}
                        weight={1}
                        fillOpacity={0.5}
                        fillColor={state.fillColor}
                        onClick={(e) => this.handleStateClick(e, state.id)}
                        onMouseOver={this.handleMouseOver}
                        onMouseOut={this.handleMouseOut}
                      >
                        <Tooltip>
                          <b>{state.id}</b>
                        </Tooltip>
                      </Polygon>
                    );
                  })}
                  {this.state.counties.map((county) => {
                    return (
                      <Polygon
                        id={county.id}
                        key={county.id}
                        positions={county.coordinates}
                        smoothFactor={1}
                        color={"#102027"}
                        weight={1}
                        fillOpacity={0.5}
                        fillColor={county.fillColor}
                        onClick={(e) => this.handleCountyClick(e, county.id)}
                        onMouseOver={this.handleMouseOver}
                        onMouseOut={this.handleMouseOut}
                      >
                        <Tooltip>
                          <b>{county.id}</b>
                        </Tooltip>
                      </Polygon>
                    );
                  })}
                  {this.state.precincts.map((precinct) => {
                    return (
                      <Polygon
                        id={precinct.id}
                        key={precinct.id}
                        positions={precinct.coordinates}
                        smoothFactor={1}
                        color={"#102027"}
                        weight={1}
                        fillOpacity={0.5}
                        fillColor={precinct.fillColor}
                        onClick={(e) =>
                          this.handlePrecinctClick(e, precinct.id)
                        }
                        onMouseOver={this.handleMouseOver}
                        onMouseOut={this.handleMouseOut}
                      >
                        <Tooltip>
                          <b>{precinct.id}</b>
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
