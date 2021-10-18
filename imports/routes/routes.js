import { Meteor } from "meteor/meteor";
import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import { createBrowserHistory } from "history";

import Current from "../ui/Current";
import Instructions from "../ui/Instructions";
import History from "../ui/History";
import Boards from "../ui/Boards";
import ReleasePlan from "../ui/ReleasePlan";
import ManualUpdates from "../ui/ManualUpdates";

const browserHistory = createBrowserHistory();

export const routes = (
  <Router history={browserHistory}>
    <Switch>
      <Route exact path="/" component={Current} />
      <Route exact path="/instructions" component={Instructions} />
      <Route exact path="/history" component={History} />
      <Route exact path="/boards" component={Boards} />
      <Route exact path="/release-plan" component={ReleasePlan} />
      <Route exact path="/manual-updates" component={ManualUpdates} />
    </Switch>
  </Router>
);
