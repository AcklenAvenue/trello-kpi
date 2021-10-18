import React from 'react';

import NavBar from './NavBar';
import TrelloRequestHistory from './TrelloRequestHistory';

const History = () => {
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

export default History;