import React from 'react';

import NavBar from '../NavBar';
import TrelloRequestLanes from './TrelloRequestLanes';

export default class Lanes extends React.Component {
  render() {
    return (
      <div>
        <NavBar/>
        <div id="lanes-main" className="text-center">
            <h2>Lanes</h2>
            <TrelloRequestLanes/>
        </div>
      </div>
    );
  };
};
