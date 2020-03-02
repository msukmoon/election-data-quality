import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Home from "./Home";
import About from "./About";
import Edit from "./Edit";
import NotFound from "./NotFound";
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
            <Route path="/about" component={About} />
            <Route path="/edit" component={Edit} />
            <Route component={NotFound} />
          </Switch>
        </Router>
      </Layout>
    </React.Fragment>
  );
}

export default App;
