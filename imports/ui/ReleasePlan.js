import React from 'react';

import NavBar from './NavBar';
import TrelloReleasePlan from './TrelloReleasePlan';

export default class Boards extends React.Component {
  render() {
    return (
      <div>
        <NavBar/>
        <div id="main" className="text-center">
            <h2>Release Plan</h2>
            <TrelloReleasePlan/>
        </div>
      </div>
    );
  };
};
