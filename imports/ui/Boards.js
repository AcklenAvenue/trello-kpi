import React from 'react';

import NavBar from './NavBar';
import TrelloRequestBoards from './TrelloRequestBoards';

export default class Boards extends React.Component {
  render() {
    return (
      <div>
        <NavBar/>
        <div id="main" className="text-center">
            <h2>Boards</h2>
            <TrelloRequestBoards/>
        </div>
      </div>
    );
  };
};
