import React from 'react';

import NavBar from './NavBar';
import TrelloRequestHistory from './TrelloRequestHistory';

export default class History extends React.Component {
  render() {
    return (
      <div>
        <NavBar/>
        <div id="main" className="text-center">
            <h2>History</h2>
            <TrelloRequestHistory/>
        </div>
      </div>
    );
  };
};
