import React from 'react';

import NavBar from './NavBar';

export default class Instructions extends React.Component {
  render() {
    return (
      <div>
        <NavBar/>
        <div id="instructions-main" className="text-center">
          <h2>Instructions</h2>
          <div id="instructions" className="col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 text-center">
            <div className="panel panel-default panel-success ">
              <div className="panel-heading">Get your KEY</div>
              <div className="panel-body">You can get your key <a href="https://trello.com/app-key" target="_blank">here</a>.</div>
            </div>
            <div className="panel panel-default panel-success ">
              <div className="panel-heading">Get your TOKEN</div>
              <div className="panel-body">You can get your token <a href="https://trello.com/1/authorize?expiration=never&scope=read,write,account&response_type=token&name=Server%20Token&key=ac95fa0d46829f2504dce21cc8d1cf13" target="_blank">here</a>.</div>
            </div>
            <div className="panel panel-default panel-success ">
              <div className="panel-heading">Current</div>
              <div className="panel-body">Once the correct data is input, it will generate a file with the current cards with the following fields: 'listId', 'listName', 'cardId', 'cardName', and 'labels'.</div>
            </div>
            <div className="panel panel-default panel-success ">
              <div className="panel-heading">History</div>
              <div className="panel-body">***Still working on it, researching how to request throttle***</div>
            </div>
            <div className="panel panel-default panel-success ">
              <div className="panel-heading">Boards</div>
              <div className="panel-body">Once the correct data is input, it will generate a file with the boards you own or are in, with the following fields: 'boardId' and 'boardName'.</div>
            </div>
          </div>
        </div>
      </div>
    );
  };
};
