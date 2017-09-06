import { Meteor } from 'meteor/meteor';
import json2csv from 'json2csv';

import { Trello } from './trello';

Meteor.methods({
  async getBoards(key, token){
    const response = await Trello.getBoards(key, token);
    const boards = response.data;
    let data = [];
    boards.forEach((board) =>{
      data.push({
        "boardId": board.id,
        "boardName": board.name
      });
    });
    const fields = ['boardId', 'boardName'];
    const csv = json2csv({ data, fields });
    return csv;
  }
});
