import React from 'react';

import NavBar from './NavBar';
import ManualUpdatesRunner from './ManualUpdatesRunner';

export default class ManualUpdates extends React.Component {
  render() {
      return (
        <div>
          <NavBar/>
          <div id="main" className="text-center">
              <h2>Manual Updates</h2>
              <ManualUpdatesRunner/>
          </div>
        </div>
      );
  };
};
