import React, { useEffect, useState } from "react";
import { Meteor } from "meteor/meteor";

const TrelloReleasePlan = () => {
  const [boardInfo, setBoardInfo] = useState({
    name: "",
    downloadUrl: "",
  });
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    Meteor.call("getAllBoards", (err, boards) => {
      if (err) {
        throw err;
      }

      setBoards(boards);
    });
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    if (boardInfo.name) {
      Meteor.call("generateReleasePlan", boardInfo.name, (err, res) => {
        if (err) {
          throw err;
        }
        const buffer = new Uint8Array(Object.values(res));
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const downButton = document.createElement("a");
        downButton.setAttribute("href", url);
        downButton.setAttribute("download", boardInfo.name);
        downButton.click();
        setBoardInfo({
          downloadUrl: url,
        });
      });
    }
  };

  return (
    <div
      className="col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 text-center"
      id="input"
    >
      <form onSubmit={onSubmit}>
        <div className="input-group col-lg-4 col-lg-offset-4 col-md-4 col-md-offset-4 col-sm-4 col-sm-offset-4 col-xs-12">
          <div className="dropdown">
            <button
              className="btn btn-primary dropdown-toggle btn-lg"
              type="button"
              id="dropdownMenu1"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="true"
            >
              {boardInfo.name ? boardInfo.name : "Select Board "}
              &nbsp; <span className="caret"></span>
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              {boards &&
                boards.map((board, key) => (
                  <li key={key}>
                    <a
                      className="dropdown-item"
                      href="#"
                      onClick={() => {
                        setBoardInfo({
                          name: board.name,
                          downloadUrl: "",
                        });
                      }}
                    >
                      {board.name}
                    </a>
                  </li>
                ))}
            </ul>
          </div>
        </div>
        <br />
        <br />
        <div
          className="text-center col-lg-4 col-lg-offset-4 col-md-4 col-md-offset-4 col-sm-4 col-sm-offset-4 col-xs-12"
          id="generate-rp"
        >
          <button className="btn btn-success btn-lg btn-block">
            Generate Release Plan
          </button>
        </div>
      </form>
    </div>
  );
};

export default TrelloReleasePlan;
