import React from "react";
import { Meteor } from "meteor/meteor";

const ManualUpdatesRunner = () => {
  const calculateCycleTimes = () => {
    alert(
      "Cycle times are being calculated, it might take a couple of minutes to see the result!"
    );
    Meteor.call("cycleTimes", (err, res) => {
      if (err) throw err;
    });
  };

  const calculateTimeInStates = () => {
    alert(
      "Times in states are being estimated, it might take a couple of minutes to see the result!"
    );
    Meteor.call("timeInStates", (err, res) => {
      if (err) throw err;
    });
  };

  const updateTrelloActivities = async () => {
    alert(
      "Webhooks are being verified, it might take a couple of minutes to see the result!"
    );
    let boards = await new Promise((resolve, reject) => {
      Meteor.call("getAllBoards", (err, res) => {
        if (err) reject(err);
        resolve(res);
      });
    });
    boards = boards.map((board) => board.id);
    Meteor.call("trelloActivities", boards, (err, res) => {
      if (err) throw err;
    });
  };

  return (
    <div
      className="col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 text-center"
      id="input"
    >
      <button
        className="btn btn-primary manual-update btn-lg"
        onClick={updateTrelloActivities}
      >
        Trello Activity
      </button>
      <br></br>
      <button
        className="btn btn-primary manual-update btn-lg"
        onClick={calculateCycleTimes}
      >
        Calculate Cycle Times
      </button>
      <br></br>
      <button
        className="btn btn-primary manual-update btn-lg"
        onClick={calculateTimeInStates}
      >
        Cards Time In States
      </button>
    </div>
  );
};

export default ManualUpdatesRunner;
