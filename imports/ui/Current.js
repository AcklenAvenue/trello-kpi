import React from "react";
import NavBar from "./NavBar";
import TrelloRequestCurrent from "./TrelloRequestCurrent";

export default class Current extends React.Component {
  render() {
    return (
      <div>
        <NavBar />
        <div id="main" className="text-center">
          <h2>Current</h2>
          <TrelloRequestCurrent />
        </div>
      </div>
    );
  }
}
