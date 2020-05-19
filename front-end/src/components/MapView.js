import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Modal from "react-bootstrap/Modal";
import {
  Map,
  ZoomControl,
  LayersControl,
  LayerGroup,
  TileLayer,
  FeatureGroup,
  Tooltip,
  Polygon
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import Control from "react-leaflet-control";
import { polygon, multiPolygon, union } from "@turf/turf";
import { CubeGrid } from "styled-spinkit";
import NumberFormat from "react-number-format";
import { push as Menu } from "react-burger-menu";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "leaflet-draw/dist/leaflet.draw.css";
import styled from "styled-components";

const { Overlay } = LayersControl;

const Styles = styled.div`
  /* Style of bootstrap buttons */
  .btn-light {
    background-color: white;
    border-color: black;
    font-size: 1em;
  }

  /* Style of bootstrap dropdowns */
  .dropdown-item {
    color: black;
    font-size: 1em;
  }

  /* Sizing of leaflet map */
  .leaflet-container {
    width: 100%;
    height: 91.35vh;
  }

  /* Position and sizing of clickable cross button */
  .bm-cross-button {
    height: 32px; !important
    width: 32px; !important
  }

  /* Color/shape of close button cross */
  .bm-cross {
    background: #37474f;
  }

  /* Sidebar wrapper styles */
  .bm-menu-wrap {
    position: fixed;
    height: 100%;
  }

  /* General sidebar styles */
  .bm-menu {
    background: #eceff1;
    padding: 0 1.5em;
    font-size: 1em;
  }

  /* Wrapper for item list */
  .bm-item-list {
    padding: 0;
  }

  /* Individual item */
  .bm-item {
    display: inline-block;
    outline: none;
  }
`;

class MapView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: 34,
      longitude: -85,
      zoom: 6,
      displayMode: 1,
      editMode: 1,
      isLoading: false,
      sidebarOpen: false,
      currPrecinct: {
        id: null,
        selected: false,
        precinctsIndex: null,
        canonicalName: null,
        ghost: null,
        multipleBorder: null,
        demoModified: null,
        adjPrecIds: [],
        enclPrecIds: [],
        interPrecIds: [],
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
            ethnicity: "Native American",
            population: null
          },
          {
            ethnicity: "Pacific Islander",
            population: null
          },
          {
            ethnicity: "Others",
            population: null
          },
          {
            ethnicity: "Total",
            population: null
          }
        ],
        logBag: [],
        coordinates: []
        // TODO: Add more properties
      },
      states: [],
      counties: [],
      precincts: [],
      // NOTE: The two features below are not supported yet
      nationalParks: [],
      congDistricts: [],
      // NOTE: The feature below is for testing boundary correction
      testPolygons: [
        {
          id: 1,
          fillColor: "#fff9c4",
          coordinates: [
            [
              [37, -85],
              [37.25, -84.75],
              [38, -85],
              [38, -84],
              [37, -84]
            ]
          ]
        },
        {
          id: 2,
          fillColor: "#fff9c4",
          coordinates: [
            [
              [37, -84],
              [38, -84],
              [38.5, -83.5],
              [38, -83],
              [37, -83]
            ]
          ]
        }
      ]
    };
  }

  handleStateChange(state) {
    this.setState({ sidebarOpen: state.isOpen });

    // TODO: Delete this if not needed
    // if (state.isOpen === false) {
    //   this.setState({
    //     sidebarOpen: state.isOpen,
    //     currPrecinct: { ...this.state.currPrecinct, selected: false }
    //   });
    // } else {
    //   this.setState({ sidebarOpen: state.isOpen });
    // }
  }

  handleMouseOver(e) {
    e.target.openTooltip();
  }

  handleMouseOut(e) {
    e.target.closeTooltip();
  }

  handleZoomEnd(e) {
    if (e.target._zoom < 7 && this.state.displayMode === 2) {
      this.setState({ zoom: e.target._zoom, displayMode: 1, counties: [] });
    } else if (e.target._zoom < 10 && this.state.displayMode === 3) {
      this.setState({ zoom: e.target._zoom, displayMode: 2, precincts: [] });
    } else {
      this.setState({ zoom: e.target._zoom });
    }
  }

  handleViewNeighbors() {
    if (this.state.editMode === 2) {
      this.setState({ editMode: 1 });
    } else {
      this.setState({ editMode: 2 });
    }
  }

  handleAddNeighbor() {
    if (this.state.editMode === 3) {
      this.setState({ editMode: 1 });
    } else {
      this.setState({ editMode: 3 });
    }
  }

  handleDeleteNeighbor() {
    if (this.state.editMode === 4) {
      this.setState({ editMode: 1 });
    } else {
      this.setState({ editMode: 4 });
    }
  }

  handleMergePrecincts() {
    if (this.state.editMode === 5) {
      this.setState({ editMode: 1 });
    } else {
      this.setState({ editMode: 5 });
    }
  }

  handlePrecinctClick(e, id) {
    // Display precinct data mode
    if (this.state.editMode === 1) {
      // Modify map view and change the fill color of a selected state
      const precinctsCopy = [...this.state.precincts];
      if (this.state.currPrecinct.precinctsIndex !== null) {
        precinctsCopy[this.state.currPrecinct.precinctsIndex] = {
          ...precinctsCopy[this.state.currPrecinct.precinctsIndex],
          fillColor: "#fff9c4"
        };
      }
      const newPrecinctsIndex = precinctsCopy.findIndex((el) => el.id === id);
      precinctsCopy[newPrecinctsIndex] = {
        ...precinctsCopy[newPrecinctsIndex],
        fillColor: "#c8b900"
      };
      this.setState({
        latitude: e.latlng.lat,
        longitude: e.latlng.lng - 0.1,
        zoom: 12,
        isLoading: true,
        sidebarOpen: false,
        currPrecinct: {
          ...this.state.currPrecinct,
          precinctsIndex: newPrecinctsIndex
        },
        precincts: precinctsCopy
      });

      // Fetch a detailed data about a selected precinct
      const electionDataCopy = [...this.state.currPrecinct.electionData];
      const ethnicityDataCopy = [...this.state.currPrecinct.ethnicityData];
      fetch("api/precinct/" + id)
        .then((res) => res.json())
        .then((data) => {
          console.log(data); // DEBUG: Remove this line later
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
          ethnicityDataCopy[6] = {
            ...ethnicityDataCopy[6],
            population:
              data.white +
              data.africanAmer +
              data.asian +
              data.nativeAmer +
              data.pasifika +
              data.others
          };
          this.setState({
            isLoading: false,
            sidebarOpen: true,
            currPrecinct: {
              ...this.state.currPrecinct,
              id: data.id,
              canonicalName: data.canonicalName,
              ghost: data.ghost,
              multipleBorder: data.multipleBorder,
              demoModified: data.demoModified,
              adjPrecIds: data.adjPrecIds,
              enclPrecIds: data.enclPrecIds,
              interPrecIds: data.interPrecIds,
              electionData: electionDataCopy,
              ethnicityData: ethnicityDataCopy,
              // TODO: add logBag
              logBag: data.logBag
              // TODO: Add more properties
            }
          });
        });
    }
    // View neighbors mode
    else if (this.state.editMode === 2) {
      // Fetch a data of a selected precinct and then highlight its neighbors
      const precinctsCopy = [...this.state.precincts];
      precinctsCopy.forEach((precinct) => {
        precinct.fillColor = "#fff9c4";
      });
      const precinctsIndex = precinctsCopy.findIndex((el) => el.id === id);
      precinctsCopy[precinctsIndex] = {
        ...precinctsCopy[precinctsIndex],
        fillColor: "#c8b900"
      };
      this.setState({ isLoading: true });
      fetch("api/precinct/" + id)
        .then((res) => res.json())
        .then((data) => {
          console.log(data); // DEBUG: Remove this line later
          data.adjPrecIds.forEach((adjPrecId) => {
            precinctsCopy.forEach((precinct) => {
              if (precinct.id === adjPrecId) {
                precinct.fillColor = "#ffeb3b";
              }
            });
          });
          this.setState({
            editMode: 1,
            isLoading: false,
            precincts: precinctsCopy
          });
        });
    }
    // Add neighbor mode
    else if (this.state.editMode === 3) {
      // Highlight a selected precinct
      const precinctsCopy = [...this.state.precincts];
      const precinctsIndex = precinctsCopy.findIndex((el) => el.id === id);
      precinctsCopy[precinctsIndex] = {
        ...precinctsCopy[precinctsIndex],
        fillColor: "#c8b900"
      };
      if (this.state.currPrecinct.selected === false) {
        this.setState({
          currPrecinct: { ...this.state.currPrecinct, id: id, selected: true },
          precincts: precinctsCopy
        });
      } else {
        this.setState({
          editMode: 1,
          isLoading: true,
          currPrecinct: {
            ...this.state.currPrecinct,
            // adjPrecIds: [...this.state.currPrecinct.adjPrecIds, id],
            selected: false
          },
          precincts: precinctsCopy
        });

        Promise.all([
          fetch("api/precinct/" + this.state.currPrecinct.id),
          fetch("api/precinct/" + id)
        ])
          .then(async ([res1, res2]) => {
            const currPrecinctData = await res1.json();
            const nextPrecinctData = await res2.json();
            return [currPrecinctData, nextPrecinctData];
          })
          .then((data) => {
            console.log(data); // DEBUG: Remove this line later

            data[0].adjPrecIds.push(data[1].id);
            data[1].adjPrecIds.push(data[0].id);

            console.log(data[0].adjPrecIds);
            console.log(data[1].adjPrecIds);

            // Make a PUT request to the server with "api/precinct"
            fetch("api/precinct", {
              method: "PUT",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                "id": data[0].id,
                "countyId": "21-075",
                "stateId": "21",
                "ghost": data[0].ghost,
                "multipleBorder": data[0].multipleBorder,
                "electionData": {
                  "CONGRESSIONAL_16_DEM": data[0].CONGRESSIONAL_16_DEM,
                  "PRESIDENTIAL_16_REP": data[0].PRESIDENTIAL_16_REP,
                  "CONGRESSIONAL_18_DEM": data[0].CONGRESSIONAL_18_DEM,
                  "CONGRESSIONAL_16_REP": data[0].CONGRESSIONAL_16_REP,
                  "CONGRESSIONAL_18_REP": data[0].CONGRESSIONAL_18_REP,
                  "PRESIDENTIAL_16_DEM": data[0].PRESIDENTIAL_16_DEM
                },
                "adjPrecIds": data[0].adjPrecIds,
                "enclPrecIds": data[0].enclPrecIds,
                "interPrecIds": data[0].interPrecIds,
                "logBag": data[0].logBag,
                "canonicalName": data[0].canonicalName,
                "demoModified": data[0].demoModified,
                "white": data[0].white,
                "africanAmer": data[0].africanAmer,
                "asian": data[0].asian,
                "nativeAmer": data[0].nativeAmer,
                "others": data[0].others,
                "pasifika": data[0].pasifika
              })
            })
              .then((res) => res.json())
              .then((data) => {
                console.log("Success:", data);
              })
              .catch((error) => {
                console.error("Error:", error);
              });
            // Make a PUT request to the server with "api/precinct"
            fetch("api/precinct", {
              method: "PUT",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                "id": data[1].id,
                "countyId": "21-075",
                "stateId": "21",
                "ghost": data[1].ghost,
                "multipleBorder": data[1].multipleBorder,
                "electionData": {
                  "CONGRESSIONAL_16_DEM": data[1].CONGRESSIONAL_16_DEM,
                  "PRESIDENTIAL_16_REP": data[1].PRESIDENTIAL_16_REP,
                  "CONGRESSIONAL_18_DEM": data[1].CONGRESSIONAL_18_DEM,
                  "CONGRESSIONAL_16_REP": data[1].CONGRESSIONAL_16_REP,
                  "CONGRESSIONAL_18_REP": data[1].CONGRESSIONAL_18_REP,
                  "PRESIDENTIAL_16_DEM": data[1].PRESIDENTIAL_16_DEM
                },
                "adjPrecIds": data[1].adjPrecIds,
                "enclPrecIds": data[1].enclPrecIds,
                "interPrecIds": data[1].interPrecIds,
                "logBag": data[1].logBag,
                "canonicalName": data[1].canonicalName,
                "demoModified": data[1].demoModified,
                "white": data[1].white,
                "africanAmer": data[1].africanAmer,
                "asian": data[1].asian,
                "nativeAmer": data[1].nativeAmer,
                "others": data[1].others,
                "pasifika": data[1].pasifika
              })
            })
              .then((res) => res.json())
              .then((data) => {
                console.log("Success:", data);
                this.setState({
                  editMode: 1,
                  displayMode: 3,
                  isLoading: false
                });
              })
              .catch((error) => {
                console.error("Error:", error);
              });
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
    // Delete neighbor mode
    else if (this.state.editMode === 4) {
      // Highlight a selected precinct
      const precinctsCopy = [...this.state.precincts];
      const precinctsIndex = precinctsCopy.findIndex((el) => el.id === id);
      precinctsCopy[precinctsIndex] = {
        ...precinctsCopy[precinctsIndex],
        fillColor: "#c8b900"
      };
      if (this.state.currPrecinct.selected === false) {
        this.setState({
          currPrecinct: { ...this.state.currPrecinct, id: id, selected: true },
          precincts: precinctsCopy
        });
      } else {
        this.setState({
          editMode: 1,
          currPrecinct: { ...this.state.currPrecinct, selected: false },
          precincts: precinctsCopy
        });
      }
    }
    // Merge precincts mode
    else if (this.state.editMode === 5) {
      // Highlight a selected precinct
      const precinctsCopy = [...this.state.precincts];
      const precinctsIndex = precinctsCopy.findIndex((el) => el.id === id);
      precinctsCopy[precinctsIndex] = {
        ...precinctsCopy[precinctsIndex],
        fillColor: "#c8b900"
      };
      if (this.state.currPrecinct.selected === false) {
        this.setState({
          currPrecinct: {
            ...this.state.currPrecinct,
            id: id,
            precinctsIndex: precinctsIndex,
            selected: true,
            coordinates: precinctsCopy[precinctsIndex].coordinates
          },
          precincts: precinctsCopy
        });
      } else {
        // Merge polygons and get its new coordinates
        let currPolygon;
        let nextPolygon;
        if (this.state.currPrecinct.coordinates[0][0][0][0] === undefined) {
          currPolygon = polygon(this.state.currPrecinct.coordinates);
        } else {
          currPolygon = multiPolygon(this.state.currPrecinct.coordinates);
        }
        if (
          precinctsCopy[precinctsIndex].coordinates[0][0][0][0] === undefined
        ) {
          nextPolygon = polygon(precinctsCopy[precinctsIndex].coordinates);
        } else {
          nextPolygon = multiPolygon(precinctsCopy[precinctsIndex].coordinates);
        }
        const newPolygon = union(currPolygon, nextPolygon);

        // Remove old polygons from the precincts array
        // DEBUG
        // const nextPrecinctId = precinctsCopy[precinctsIndex].id;
        let precinctsIndexs;
        if (this.state.currPrecinct.precinctsIndex > precinctsIndex) {
          precinctsIndexs = [
            precinctsIndex,
            this.state.currPrecinct.precinctsIndex
          ];
        } else {
          precinctsIndexs = [
            this.state.currPrecinct.precinctsIndex,
            precinctsIndex
          ];
        }
        while (precinctsIndexs.length) {
          precinctsCopy.splice(precinctsIndexs.pop(), 1);
        }

        this.setState({
          editMode: 1,
          currPrecinct: { ...this.state.currPrecinct, selected: false },
          precincts: [
            ...precinctsCopy,
            {
              id: this.state.currPrecinct.id,
              fillColor: "#c8b900",
              coordinates: newPolygon.geometry.coordinates
            }
          ]
        });

        this.setState({ isLoading: true });
        fetch("api/precinct/" + this.state.currPrecinct.id)
          .then((res) => res.json())
          .then((data) => {
            console.log(data); // DEBUG: Remove this line later
            // TODO: Make a DELETE request to the server with "api/precinct/merge"
            fetch("api/precinct/merge", {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                "id": data.id,
                "countyId": "21-075",
                "stateId": "21",
                "ghost": data.ghost,
                "multipleBorder": data.multipleBorder,
                "electionData": {
                  "CONGRESSIONAL_16_DEM": data.CONGRESSIONAL_16_DEM,
                  "PRESIDENTIAL_16_REP": data.PRESIDENTIAL_16_REP,
                  "CONGRESSIONAL_18_DEM": data.CONGRESSIONAL_18_DEM,
                  "CONGRESSIONAL_16_REP": data.CONGRESSIONAL_16_REP,
                  "CONGRESSIONAL_18_REP": data.CONGRESSIONAL_18_REP,
                  "PRESIDENTIAL_16_DEM": data.PRESIDENTIAL_16_DEM
                },
                "adjPrecIds": data.adjPrecIds,
                "enclPrecIds": data.enclPrecIds,
                "interPrecIds": data.interPrecIds,
                "logBag": data.logBag,
                "canonicalName": data.canonicalName,
                "demoModified": data.demoModified,
                "white": data.white,
                "africanAmer": data.africanAmer,
                "asian": data.asian,
                "nativeAmer": data.nativeAmer,
                "others": data.others,
                "pasifika": data.pasifika,
                "mergeHolder": id,
                "coordinates": JSON.stringify(newPolygon.geometry.coordinates)
              })
            })
              .then((res) => res.json())
              .then((data) => {
                console.log("Success:", data);
              })
              .catch((error) => {
                console.error("Error:", error);
              });
            this.setState({
              editMode: 1,
              isLoading: false
            });
          });
      }
    }
  }

  handleCountyClick(e, id) {
    this.setState({
      latitude: e.latlng.lat,
      longitude: e.latlng.lng,
      zoom: 10,
      isLoading: true
    });
    fetch("api/county/" + id)
      .then((res) => res.json())
      .then((data) => {
        console.log(data); // DEBUG: Remove this line later
        data.precincts.forEach((currData) => {
          this.setState({
            precincts: [
              ...this.state.precincts,
              {
                id: currData.id,
                fillColor: currData.hasError ? "#ff8a50" : "#fff9c4",
                coordinates: JSON.parse(currData.coordinates)
              }
            ]
          });
        });
        this.setState({ displayMode: 3, isLoading: false });
      });
  }

  handleStateClick(e, id) {
    // Get counties of a selected state
    this.setState({
      latitude: e.latlng.lat,
      longitude: e.latlng.lng,
      zoom: 7,
      isLoading: true
    });
    fetch("api/state/" + id)
      .then((res) => res.json())
      .then((data) => {
        console.log(data); // DEBUG: Remove this line later
        data.counties.forEach((currData) => {
          this.setState({
            counties: [
              ...this.state.counties,
              {
                id: currData.id,
                fillColor: currData.hasError ? "#ff8a50" : "#fff9c4",
                coordinates: JSON.parse(currData.coordinates)
              }
            ]
          });
        });
        this.setState({ displayMode: 2, isLoading: false });
      });
  }

  handleStateSelect(id) {
    // Selected Kentucky
    if (id === 21) {
      this.setState({ latitude: 37.84, longitude: -84.27, zoom: 7 });
    }
    // Selected Louisiana
    else if (id === 22) {
      this.setState({ latitude: 30.98, longitude: -91.96, zoom: 7 });
    }
    // Selected South Carolina
    else if (id === 45) {
      this.setState({ latitude: 33.84, longitude: -81.16, zoom: 7 });
    }
    // Get counties of a selected state
    this.setState({ isLoading: true });
    fetch("api/state/" + id)
      .then((res) => res.json())
      .then((data) => {
        console.log(data); // DEBUG: Remove this line later
        data.counties.forEach((currData) => {
          this.setState({
            counties: [
              ...this.state.counties,
              {
                id: currData.id,
                fillColor: "#fff9c4",
                coordinates: JSON.parse(currData.coordinates)
              }
            ]
          });
        });
        this.setState({ displayMode: 2, isLoading: false });
      });
  }

  handleTableChange() {
    // Get county and state ids
    const countyStateIds = this.state.currPrecinct.id.split("-", 2);
    // DEBUG
    console.log(countyStateIds[0]);
    console.log(countyStateIds[0] + "-" + countyStateIds[1]);

    // Make a PUT request to the server with "api/precinct"
    fetch("api/precinct", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "id": this.state.currPrecinct.id,
        "countyId": countyStateIds[0] + "-" + countyStateIds[1],
        "stateId": countyStateIds[0],
        "ghost": this.state.currPrecinct.ghost,
        "multipleBorder": this.state.currPrecinct.multipleBorder,
        "electionData": {
          "CONGRESSIONAL_16_DEM": this.state.currPrecinct.electionData[1]
            .demVotes,
          "PRESIDENTIAL_16_REP": this.state.currPrecinct.electionData[0]
            .repVotes,
          "CONGRESSIONAL_18_DEM": this.state.currPrecinct.electionData[2]
            .demVotes,
          "CONGRESSIONAL_16_REP": this.state.currPrecinct.electionData[1]
            .repVotes,
          "CONGRESSIONAL_18_REP": this.state.currPrecinct.electionData[2]
            .repVotes,
          "PRESIDENTIAL_16_DEM": this.state.currPrecinct.electionData[0]
            .demVotes
        },
        "adjPrecIds": this.state.currPrecinct.adjPrecIds,
        "enclPrecIds": this.state.currPrecinct.enclPrecIds,
        "interPrecIds": this.state.currPrecinct.interPrecIds,
        "logBag": this.state.currPrecinct.logBag,
        "canonicalName": this.state.currPrecinct.canonicalName,
        "demoModified": this.state.currPrecinct.demoModified,
        "white": this.state.currPrecinct.ethnicityData[0].population,
        "africanAmer": this.state.currPrecinct.ethnicityData[1].population,
        "asian": this.state.currPrecinct.ethnicityData[2].population,
        "nativeAmer": this.state.currPrecinct.ethnicityData[3].population,
        "others": this.state.currPrecinct.ethnicityData[5].population,
        "pasifika": this.state.currPrecinct.ethnicityData[4].population
      })
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
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
    this.setState({ isLoading: true });
    fetch("api/state/all")
      .then((res) => res.json())
      .then((data) => {
        console.log(data); // DEBUG: Remove this line later
        data.forEach((currData) => {
          this.setState({
            states: [
              ...this.state.states,
              {
                id: currData.id,
                fillColor: "#fff9c4",
                coordinates: JSON.parse(currData.coordinates)
              }
            ]
          });
        });
        this.setState({ isLoading: false });
      });
  }

  formatNumber(data) {
    return (
      <NumberFormat
        value={data}
        displayType={"text"}
        thousandSeparator={true}
      />
    );
  }

  validateNumber(data) {
    if (isNaN(data)) {
      return {
        valid: false,
        message: "Input should be numeric"
      };
    } else if (data < 0) {
      return {
        valid: false,
        message: "Input cannot be less than zero"
      };
    } else if (data > 0 && data !== data.replace(/^0+/, "")) {
      return {
        valid: false,
        message: "Input cannot have a leading zero"
      };
    } else {
      return true;
    }
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
        text: "Democratic Votes",
        formatter: this.formatNumber,
        validator: this.validateNumber
      },
      {
        dataField: "repVotes",
        text: "Republican Votes",
        formatter: this.formatNumber,
        validator: this.validateNumber
      }
    ];
    const ethnicityTableColumns = [
      {
        dataField: "ethnicity",
        text: "Ethnicity"
      },
      {
        dataField: "population",
        text: "Population",
        formatter: this.formatNumber,
        validator: this.validateNumber
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
        <div id="outer-container">
          <Modal size="sm" show={this.state.isLoading} onHide={() => {}}>
            <Container>
              <Row>
                <Col>
                  <CubeGrid size={24} color="#37474f" />
                </Col>
                <Col className="pt-4" xs={8}>
                  <h5>Loading Data...</h5>
                </Col>
              </Row>
            </Container>
          </Modal>
          <Menu
            right
            noOverlay
            disableOverlayClick
            pageWrapId={"page-wrap"}
            outerContainerId={"outer-container"}
            menuClassName={"menu-right"}
            width={"35%"}
            customBurgerIcon={false}
            isOpen={this.state.sidebarOpen}
            onStateChange={(state) => this.handleStateChange(state)}
          >
            <Container fluid className="px-0">
              <Row className="pt-4">
                <Col>
                  <h4>{this.state.currPrecinct.id}</h4>
                </Col>
              </Row>
              <Row className="py-1">
                <Col>
                  <h5>Election Data</h5>
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
                      afterSaveCell: () => this.handleTableChange()
                    })}
                  />
                </Col>
              </Row>
              <Row className="pb-1">
                <Col>
                  <h5>County Demographic Data</h5>
                </Col>
              </Row>
              <Row className="pb-2">
                <Col>
                  <BootstrapTable
                    striped
                    hover
                    condensed
                    keyField="ethnicity"
                    data={this.state.currPrecinct.ethnicityData}
                    columns={ethnicityTableColumns}
                    cellEdit={cellEditFactory({
                      mode: "click",
                      blurToSave: true,
                      afterSaveCell: () => this.handleTableChange()
                    })}
                  />
                </Col>
              </Row>
              <Row className="pb-1">
                <Col>
                  <h5>Corrections Log</h5>
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
                  <h5>Data Sources</h5>
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
          <main id="page-wrap">
            <Container fluid className="px-0">
              <Row>
                <Col>
                  <Map
                    center={position}
                    zoomControl={false}
                    zoom={this.state.zoom}
                    onZoomEnd={(e) => this.handleZoomEnd(e)}
                  >
                    <ZoomControl position="bottomleft" />
                    <LayersControl position="bottomleft">
                      <TileLayer
                        url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, 
                    &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> 
                    &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
                        preferCanvas={true}
                      />
                      <Control position="topleft">
                        <ButtonGroup vertical className="pb-2">
                          <DropdownButton
                            as={ButtonGroup}
                            id="select-state-dropdown"
                            drop="right"
                            variant="light"
                            size="sm"
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
                          <Button
                            variant="light"
                            size="sm"
                            active={this.state.editMode === 2 ? true : false}
                            onClick={() => this.handleViewNeighbors()}
                          >
                            View Neighbors
                          </Button>
                          <Button
                            variant="light"
                            size="sm"
                            active={this.state.editMode === 3 ? true : false}
                            onClick={() => this.handleAddNeighbor()}
                          >
                            Add Neighbor
                          </Button>
                          <Button
                            variant="light"
                            size="sm"
                            active={this.state.editMode === 4 ? true : false}
                            onClick={() => this.handleDeleteNeighbor()}
                          >
                            Delete Neighbor
                          </Button>
                          <Button
                            variant="light"
                            size="sm"
                            active={this.state.editMode === 5 ? true : false}
                            onClick={() => this.handleMergePrecincts()}
                          >
                            Merge Precincts
                          </Button>
                        </ButtonGroup>
                      </Control>
                      <Overlay name="State Boundaries" checked={true}>
                        <LayerGroup>
                          {this.state.states.map((state) => {
                            if (this.state.displayMode === 1) {
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
                                  onClick={(e) =>
                                    this.handleStateClick(e, state.id)
                                  }
                                  onMouseOver={this.handleMouseOver}
                                  onMouseOut={this.handleMouseOut}
                                >
                                  <Tooltip>
                                    <b>{state.id}</b>
                                  </Tooltip>
                                </Polygon>
                              );
                            } else if (this.state.zoom < 7) {
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
                                  onClick={(e) =>
                                    this.handleStateClick(e, state.id)
                                  }
                                  onMouseOver={this.handleMouseOver}
                                  onMouseOut={this.handleMouseOut}
                                >
                                  <Tooltip>
                                    <b>{state.id}</b>
                                  </Tooltip>
                                </Polygon>
                              );
                            } else {
                              return null;
                            }
                          })}
                        </LayerGroup>
                      </Overlay>
                      <Overlay name="County Boundaries" checked={true}>
                        <LayerGroup>
                          {this.state.counties.map((county) => {
                            if (this.state.displayMode === 2) {
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
                                  onClick={(e) =>
                                    this.handleCountyClick(e, county.id)
                                  }
                                  onMouseOver={this.handleMouseOver}
                                  onMouseOut={this.handleMouseOut}
                                >
                                  <Tooltip>
                                    <b>{county.id}</b>
                                  </Tooltip>
                                </Polygon>
                              );
                            } else if (this.state.zoom < 9) {
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
                                  onClick={(e) =>
                                    this.handleCountyClick(e, county.id)
                                  }
                                  onMouseOver={this.handleMouseOver}
                                  onMouseOut={this.handleMouseOut}
                                >
                                  <Tooltip>
                                    <b>{county.id}</b>
                                  </Tooltip>
                                </Polygon>
                              );
                            } else {
                              return null;
                            }
                          })}
                        </LayerGroup>
                      </Overlay>
                      <Overlay name="Precinct Boundaries" checked={true}>
                        <LayerGroup>
                          {this.state.precincts.map((precinct) => {
                            if (this.state.displayMode === 3) {
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
                            } else {
                              return null;
                            }
                          })}
                        </LayerGroup>
                      </Overlay>
                      <Overlay name="National Park Boundaries">
                        <LayerGroup>
                          {this.state.nationalParks.map((park) => {
                            return (
                              <Polygon
                                id={park.id}
                                key={park.id}
                                positions={park.coordinates}
                              />
                            );
                          })}
                        </LayerGroup>
                      </Overlay>
                      <Overlay name="Congressional District Boundaries">
                        <LayerGroup>
                          {this.state.congDistricts.map((district) => {
                            return (
                              <Polygon
                                id={district.id}
                                key={district.id}
                                positions={district.coordinates}
                              />
                            );
                          })}
                        </LayerGroup>
                      </Overlay>
                      <Overlay name="Sample Polygons" checked={false}>
                        <FeatureGroup>
                          <EditControl
                            position="bottomleft"
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
                          {this.state.testPolygons.map((polygon) => {
                            return (
                              <Polygon
                                id={polygon.id}
                                key={polygon.id}
                                positions={polygon.coordinates}
                                smoothFactor={1}
                                color={"#102027"}
                                weight={1}
                                fillOpacity={0.5}
                                fillColor={polygon.fillColor}
                              />
                            );
                          })}
                        </FeatureGroup>
                      </Overlay>
                    </LayersControl>
                  </Map>
                </Col>
              </Row>
            </Container>
          </main>
        </div>
      </Styles>
    );
  }
}

export default MapView;
