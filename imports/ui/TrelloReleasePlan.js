import React, { useEffect, useState } from "react";
import { Meteor } from "meteor/meteor";
import ReleasePlanForm from './ReleasePlanForm';

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

  return (<ReleasePlanForm { ...{onSubmit, boardInfo, boards, setBoardInfo }}/>);
};

export default TrelloReleasePlan;