import React from 'react';
import FileSaver from 'file-saver';
import { Meteor } from 'meteor/meteor';

export default class TrelloRequestBoards extends React.Component {
  onSubmit(e) {
    const key = this.refs.key.value.trim();
    const token = this.refs.token.value.trim();
    e.preventDefault();

    if (key && token) {
      Meteor.call('getBoards', key, token, (err, csv) => {
        let file = new File([csv], `boards.csv`, {type: "text/plain;charset=utf-8"});
        FileSaver.saveAs(file);
      });
      this.refs.key.value = '';
      this.refs.token.value = '';
    }
  };
  render() {
    return (
      <div className="col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 text-center" id="input">
        <form onSubmit={this.onSubmit.bind(this)}>
          <div className="input-group">
            <span className="input-group-addon" id="basic-addon1"></span>
            <input type="text" ref="key" className="form-control" placeholder="Key" aria-describedby="basic-addon1"/>
          </div>
          <br></br>
          <div className="input-group">
            <span className="input-group-addon" id="basic-addon1"></span>
            <input type="text" ref="token" className="form-control" placeholder="Token" aria-describedby="basic-addon1"/>
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
};
