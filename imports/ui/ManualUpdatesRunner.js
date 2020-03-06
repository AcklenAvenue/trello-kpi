import React from 'react';
import { Meteor } from 'meteor/meteor';

export default class ManualUpdatesRunner extends React.Component {
  
    calculateCycleTimes = () => {
        Meteor.call('cycleTimes', (err, res) => {
            if(err) throw err;
        });
    }

    calculateTimeInStates = () => {
        Meteor.call('timeInStates', (err, res) => {
            if(err) throw err;
        })
    }

    updateTrelloActivities = async () => {
        let boards = await new Promise((resolve, reject) => {
            Meteor.call('getAllBoards', (err, res) => {
                if (err) reject(err);
                resolve(res);
            }); 
        });
        boards = boards.map((board) => board.id);
        Meteor.call('trelloActivities', boards, (err, res) => {
            if(err) throw err;
        })
    }

    render() {
        return (
        <div className="col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 text-center" id="input">
                <button className="btn btn-primary manual-update btn-lg" onClick={this.updateTrelloActivities}>Trello Activity</button>
                <br></br>
                <button className="btn btn-primary manual-update btn-lg" onClick={this.calculateCycleTimes}>Calculate Cycle Times</button>
                <br></br>
                <button className="btn btn-primary manual-update btn-lg" onClick={this.calculateTimeInStates}>Cards Time In States</button>
        </div>
        );
    };
};