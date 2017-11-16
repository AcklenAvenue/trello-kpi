import { Meteor } from 'meteor/meteor';
import json2csv from 'json2csv';
import projects from '../../projects.json';

import { Trello } from './trello';

const google = require('googleapis');

Meteor.methods({
  async getBoardNameCurrent(key, token, boardId) {
    const response = await Trello.getBoardName(key, token, boardId);
    const boards = response.data;
    let boardName = '';
    boards.forEach((board) => {
      if (boardId == board.id) {
        boardName += board.name;
      }
    });
    return boardName;
  },
  async getCards(key, token, boardId) {
    const response = await Trello.getListsInBoard(key, token, boardId);
    const lists = response.data;
    let data = [];
    lists.forEach((list) => {
      let cards = list.cards;
      cards.forEach((card) => {
        let labels = card.labels;
        let labelsString = '';
        labels.forEach((label) => {
            if (labelsString.length === 0) {
              labelsString+=label.name;
            }else {
              labelsString+=(' || ' + label.name);
            }
          });
        data.push({
          "listId": list.id,
          "listName": list.name,
          "cardId": card.id,
          "cardName": card.name,
          "labels": labelsString,
          "due": card.due,
          "dueComplete": card.dueComplete
        });
      })
    });
    const fields = ['listId', 'listName', 'cardId', 'cardName', 'labels', 'due', 'dueComplete'];
    const csv = json2csv({ data, fields });
    return csv;
  },
  getCurrentSpreadSheet(boardId, code){

    const sheets = google.sheets('v4');
    const OAuth2 = google.auth.OAuth2;
    const oauth2Client = new OAuth2(
      "858762091889-9lpun3on1g2qi0qok697r21mseo55cje.apps.googleusercontent.com",
      "6JoxBGFYO3WHKgRZgIOxk2tE",
      "http://localhost:3000"
    );

    oauth2Client.getToken(code, function (err, tokens) {
      // Now tokens contains an access_token and an optional refresh_token. Save them.
      if (err) {
        return err;
      }
      oauth2Client.setCredentials(tokens);


      let project = projects.filter( (project) => {
        return project.boardId === boardId;
      });

      if(!project[0]){
        console.log('noproject');
        return false;
      }

      if(!project[0].sheetId){
        console.log('nosheet');
        return false
      }

      sheets.spreadsheets.get({
        spreadsheetId: project[0].sheetId,
        auth: oauth2Client
      }, function (err, response) {
        console.log(response);
      });
    });
  },
  googleAuth(){

    const OAuth2 = google.auth.OAuth2;
    const oauth2Client = new OAuth2(
      "858762091889-9lpun3on1g2qi0qok697r21mseo55cje.apps.googleusercontent.com",
      "6JoxBGFYO3WHKgRZgIOxk2tE",
      "http://localhost:3000"
    );

    // google.options({
    //   // auth: oauth2Client,
    //   hosted_domain: 'amazylia.com'
    // });

    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: 'https://www.googleapis.com/auth/drive',
    });

    return url
  }
});
