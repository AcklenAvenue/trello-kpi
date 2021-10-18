import React from "react";
import { Link } from "react-router-dom";

const NavBar = (props) => (
  <nav className="navbar navbar-default">
    <div className="container-fluid">
      <div className="navbar-header">
        <button
          type="button"
          className="navbar-toggle collapsed"
          data-toggle="collapse"
          data-target="#bs-example-navbar-collapse-1"
          aria-expanded="false"
        >
          <span className="sr-only">Toggle navigation</span>
          <span className="icon-bar"></span>
          <span className="icon-bar"></span>
          <span className="icon-bar"></span>
        </button>
        <a className="navbar-brand">Trello KPI</a>
      </div>
      <div
        className="collapse navbar-collapse"
        id="bs-example-navbar-collapse-1"
      >
        <ul className="nav navbar-nav navbar-right">
          <li>
            <Link to="/">Current</Link>
          </li>
          <li>
            <Link to="/history">History</Link>
          </li>
          <li>
            <Link to="/boards">Boards</Link>
          </li>
          <li>
            <Link to="/release-plan">Release Plan</Link>
          </li>
          <li>
            <Link to="/manual-updates">Manual Updates</Link>
          </li>
          <li>
            <Link to="/instructions">Instructions</Link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
);

export default NavBar;