import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./components/Home";
import History from "./components/History";
import MapView from "./components/MapView";
import NotFound from "./components/NotFound";
import Layout from "./components/Layout";
import NavBar from "./components/NavBar";

function App() {
  return (
    <React.Fragment>
      <NavBar />
      <Layout>
        <Router>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/history" component={History} />
            <Route path="/map" component={MapView} />
            <Route component={NotFound} />
          </Switch>
        </Router>
      </Layout>
    </React.Fragment>
  );
}

export default App;
