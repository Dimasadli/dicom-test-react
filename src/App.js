import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
// Routes
import Viewer from "./Component/Viewer.js";
import "bootstrap/dist/css/bootstrap.min.css";
import CommonLayout from "./Component/CommonLayout.js";

function AppRouter() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Viewer} />
      </Switch>
    </Router>
  );
}

export default class App extends Component {
  render() {
    return (
      <CommonLayout>
        <AppRouter />
      </CommonLayout>
    );
  }
}
