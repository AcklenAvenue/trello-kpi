import React, { useLayoutEffect, useRef } from "react";
import FileSaver from "file-saver";
import { Meteor } from "meteor/meteor";

import { browserHistory } from "react-router";
import * as qs from "query-string";
import Cookies from "universal-cookie";

const TrelloRequestCurrent = () => {
  const keyRef = useRef(null);
  const tokenRef = useRef(null);
  const boardIdRef = useRef(null);

  useLayoutEffect(() => {
    const parsed = qs.parse(location.search);

    if (parsed.code) {
      const cookies = new Cookies();
      credentials = cookies.get("trello");
      browserHistory.push("/");

      Meteor.call(
        "getCards",
        credentials.key,
        credentials.token,
        credentials.boardId,
        (err, csv) => {
          Meteor.call(
            "getBoardNameCurrent",
            credentials.key,
            credentials.token,
            credentials.boardId,
            (err, boardName) => {
              Meteor.call(
                "getCurrentSpreadSheet",
                credentials.boardId,
                csv,
                parsed.code
              );
              // let file = new File([csv], `${boardName}.csv`, {type: "text/plain;charset=utf-8"});
              // FileSaver.saveAs(file);
            }
          );
        }
      );
    }
  }, []);

  const onSubmit = (e) => {
    const cookies = new Cookies();

    const key = keyRef.current.value.trim();
    const token = tokenRef.current.value.trim();
    const boardId = boardIdRef.current.value.trim();

    e.preventDefault();

    cookies.set("trello", {
      key,
      token,
      boardId,
    });

    if (key && token && boardId) {
      Meteor.call("googleAuth", (err, url) => {
        location.assign(url);
      });
      // this.refs.key.value = '';
      // this.refs.token.value = '';
      // this.refs.boardId.value = '';
    }
  };

  return (
    <div
      className="col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 text-center"
      id="input"
    >
      <form onSubmit={onSubmit}>
        <div className="input-group">
          <span className="input-group-addon" id="basic-addon1"></span>
          <input
            type="text"
            ref={keyRef}
            className="form-control"
            placeholder="Key"
            aria-describedby="basic-addon1"
          />
        </div>
        <br></br>
        <div className="input-group">
          <span className="input-group-addon" id="basic-addon1"></span>
          <input
            type="text"
            ref={tokenRef}
            className="form-control"
            placeholder="Token"
            aria-describedby="basic-addon1"
          />
        </div>
        <br></br>
        <div className="input-group">
          <span className="input-group-addon" id="basic-addon1"></span>
          <input
            type="text"
            ref={boardIdRef}
            className="form-control"
            placeholder="Board Id"
            aria-describedby="basic-addon1"
          />
        </div>
        <br></br>
        <br></br>
        <div className="text-center col-lg-4 col-lg-offset-4 col-md-4 col-md-offset-4 col-sm-4 col-sm-offset-4 col-xs-12">
          <button className="btn btn-success btn-lg btn-block">Execute</button>
        </div>
      </form>
    </div>
  );
};

export default TrelloRequestCurrent;
