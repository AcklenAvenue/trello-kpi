import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Router, Route, browserHistory } from 'react-router';

import Current from '../ui/Current';
import Instructions from '../ui/Instructions';
import History from '../ui/History';
import Boards from '../ui/Boards';
import ReleasePlan from '../ui/ReleasePlan';
import ManualUpdates from '../ui/ManualUpdates';

export const routes = (
  <Router history={browserHistory}>
    <Route path="/" component={Current}/>
    <Route path="/instructions" component={Instructions}/>
    <Route path="/history" component={History}/>
    <Route path="/boards" component={Boards}/>
    <Route path="/release-plan" component={ReleasePlan}/>
    <Route path="/manual-updates" component={ManualUpdates}/>
  </Router>
);
