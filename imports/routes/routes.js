import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import { createBrowserHistory } from "history";
import ReleasePlan from "../ui/ReleasePlan";

const browserHistory = createBrowserHistory();

export const routes = (
  <Router history={browserHistory}>
    <Switch>
      <Route exact path="/" component={ReleasePlan} />
      <Route exact path="/release-plan" component={ReleasePlan} />
    </Switch>
  </Router>
);
