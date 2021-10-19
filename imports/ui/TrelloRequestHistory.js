import React, { useRef } from "react";
import FileSaver from "file-saver";
import { Meteor } from "meteor/meteor";

const TrelloRequestHistory = () => {
  const keyRef = useRef(null);
  const tokenRef = useRef(null);
  const boardIdRef = useRef(null);

  const onSubmit = (e) => {
    const key = keyRef.current.value.trim();
    const token = tokenRef.current.value.trim();
    const boardId = boardIdRef.current.value.trim();
    e.preventDefault();

    if (key && token && boardId) {
      Meteor.call("getCardIdsAndNames", key, token, boardId, (err, ids) => {
        console.log(ids);
      });
      keyRef.current.value = "";
      tokenRef.current.value = "";
      boardIdRef.current.value = "";
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
          <button className="btn btn-success btn-lg btn-block">Download</button>
        </div>
      </form>
    </div>
  );
};

export default TrelloRequestHistory;
