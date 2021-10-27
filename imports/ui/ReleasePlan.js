import React from "react";

import NavBar from "./NavBar";
import TrelloReleasePlan from "./TrelloReleasePlan";

const Boards = () => {
  return (
    <>
      <NavBar />
      <div id="main" className="text-center">
        <h2>Release Plan</h2>
        <TrelloReleasePlan />
      </div>
    </>
  );
};
export default Boards;
