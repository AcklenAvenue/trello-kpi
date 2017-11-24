import { Meteor } from 'meteor/meteor';
import json2csv from 'json2csv';
import projects from '../../projects.json';
import { Trello } from './trello';

const moment = require('moment');
const google = require('googleapis');
const key = require('../../google.json');

const util = require('util')

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
  async getCurrentSpreadSheet(boardId, csv, code = 0){

    if(!csv){
      return;
    }

    const sheets = google.sheets('v4');
    let auth;

    if(code){
      const OAuth2 = google.auth.OAuth2;
      const oauth2Client = new OAuth2(
        "858762091889-9lpun3on1g2qi0qok697r21mseo55cje.apps.googleusercontent.com",
        "6JoxBGFYO3WHKgRZgIOxk2tE",
        process.env.ROOT_URL || "http://localhost:3000"
      );

      const tokens = await new Promise(resolve => {
        oauth2Client.getToken(code, function (err, tokens) {
          if (err) {
            return;
          }
          resolve(tokens);
        });
      })
      oauth2Client.setCredentials(tokens);
      auth = oauth2Client;
    }else{
      const jwtClient = new google.auth.JWT(
        key.client_email,
        null,
        key.private_key,
        ['https://www.googleapis.com/auth/drive'], // an array of auth scopes
        null
      );

      jwtClient.authorize(function (err, tokens) {
        if (err) {
          console.log(err);
          return;
        }
      });
      auth = jwtClient;
    }

    let project = projects.filter( (project) => {
      return project.boardId === boardId;
    });

    if(!project[0]){
      console.log('noproject');
      return;
    }

    if(!project[0].sheetId){
      console.log('nosheet');
      return;
    }

    sheets.spreadsheets.get({
      spreadsheetId: project[0].sheetId,
      auth
    }, function (err, document) {
      console.log(err);
      console.log('request 1 success');

      const documentSheets = document.sheets;
      const nowdate = moment().format('MM-DD-YYYY');
      let exist = false;

      let lastIndex = 0;
      let templateId;
      let lastId;

      let evoId;
      let evoColumnIndex;

      documentSheets.forEach( (sheet) => {
        let title = sheet.properties.title;
        if(title.includes('As of ')){
          lastIndex = documentSheets.indexOf(sheet); //Where create column
          lastId = sheet.properties.sheetId;
        }

        if(title.includes('Template')){
          templateId = sheet.properties.sheetId;
        }

        if(title.includes(nowdate)){
          exist = true;
        }

        if(title.includes('Evolution')){
          evoId = sheet.properties.sheetId;
        }
      });

      if(exist){
        // EXIT
        return;
      }

      sheets.spreadsheets.values.batchGetByDataFilter({
        spreadsheetId: project[0].sheetId,
        auth,
        resource: {
          "dataFilters": [
            {
              "gridRange": {
                "sheetId": evoId,
                "startColumnIndex": 0,
                "startRowIndex": 0,
                "endRowIndex": 1
              }
            }
          ]
        }
      }, function (err, res) {
        console.log(err);
        console.log('request 2 success');

        evoColumnIndex = res.valueRanges[0].valueRange.values[0].length;
        sheets.spreadsheets.batchUpdate({
          spreadsheetId: project[0].sheetId,
          auth,
          resource: {
            "requests": [
              {
                "duplicateSheet": {
                  "insertSheetIndex": lastIndex + 1,
                  "newSheetName": "As of " + nowdate,
                  "sourceSheetId": lastId ? lastId : templateId
                }
              },
              {
                "insertDimension": {
                  "range": {
                    "sheetId": evoId,
                    "dimension": "COLUMNS",
                    "startIndex": evoColumnIndex,
                    "endIndex": evoColumnIndex + 1
                  },
                  "inheritFromBefore": true
                }
              },
              {
                "copyPaste":
                {
                  "source": {
                    "sheetId": evoId,
                    "startRowIndex": 2,
                    "startColumnIndex": evoColumnIndex - 1,
                    "endRowIndex": 21,
                  },
                  "destination": {
                    "sheetId": evoId,
                    "startRowIndex": 2,
                    "startColumnIndex": evoColumnIndex,
                    "endRowIndex": 21,
                  },
                }
              }
            ]
          },
        }, function(err, success){
          console.log(err);
          console.log('request 3 success');

          const newSheetId = success.replies[0].duplicateSheet.properties.sheetId;

          sheets.spreadsheets.values.batchGetByDataFilter({
            spreadsheetId: project[0].sheetId,
            auth,
            resource: {
              "dataFilters": [
                {
                  "gridRange": {
                    "sheetId": newSheetId,
                    "startColumnIndex": 0,
                    "startRowIndex": 26,
                    "endColumnIndex": 1
                  }
                }
              ]
            }
          }, function (err, res) {
            console.log(err);
            console.log('request 4 success');

            // if there are filters in the spreadsheet, use those instead of the ones in the JSON file
            const colFilters = res.valueRanges[0].valueRange.values.map(elem => elem[0]);

            if (colFilters.length > 0) {
              project[0].lists = colFilters;
            }

            sheets.spreadsheets.values.batchClearByDataFilter({
            spreadsheetId: project[0].sheetId,
            auth,
            resource: {
              "dataFilters": [
                {
                  "gridRange": {
                    "sheetId": newSheetId,
                    "startColumnIndex": 11,
                    "startRowIndex": 3,
                    "endColumnIndex": 14
                  }
                }
              ]
            }
          }, function(err, success) {
            console.log(err);
            console.log('request 5 success');

            let csvLines = csv.split('\n');

            let data = [];
            for (var i=1; i<csvLines.length; i++)
            {
                const fields = csvLines[i].replace(/"/g,'').split(',');

                const listName = fields[1];
                const cardName = fields[3];
                const labels = fields[4];

                if(!project[0].lists.includes(listName.trim())){
                  continue;
                }

                data.push([listName, cardName, labels]);
            }

            sheets.spreadsheets.values.batchUpdateByDataFilter({
              spreadsheetId: project[0].sheetId,
              auth,
              resource: {
                "data": [
                  {
                    "majorDimension": "ROWS",
                    "dataFilter": {
                      "gridRange": {
                        "sheetId": evoId,
                        "startColumnIndex": evoColumnIndex,
                        "startRowIndex": 0
                      }
                    },
                    "values": [
                      [
                        "As of"
                      ],
                      [
                        nowdate
                      ]
                    ]
                  },
                  {
                    "majorDimension": "ROWS",
                    "dataFilter": {
                      "gridRange": {
                        "sheetId": newSheetId,
                        "startColumnIndex": 11,
                        "startRowIndex": 3
                      }
                    },
                    "values": data
                  }
                ],
                "valueInputOption": "RAW"
              }
            }, function(err, success){
              console.log(err);
              console.log('request 6 success');
            })
          })
          });                  
        })
      })
    });
  },
  googleAuth(){

    const OAuth2 = google.auth.OAuth2;
    const oauth2Client = new OAuth2(
      "858762091889-9lpun3on1g2qi0qok697r21mseo55cje.apps.googleusercontent.com",
      "6JoxBGFYO3WHKgRZgIOxk2tE",
      process.env.ROOT_URL || "http://localhost:3000"
    );

    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: 'https://www.googleapis.com/auth/drive',
    });

    return url
  },
  updateProjects(){

    projects.forEach( (project)=> {
      console.log(project.id);

      let credentials = {
        key: 'ac95fa0d46829f2504dce21cc8d1cf13',
        token: '09337dd09e2ad1b056874ba6c9e7ca0cdc11670e68c127f7fd1afda60acd8a3b',
        boardId: project.boardId
      };

      Meteor.call('getCards', credentials.key, credentials.token, credentials.boardId, (err, csv) => {
        Meteor.call('getBoardNameCurrent', credentials.key, credentials.token, credentials.boardId, (err, boardName) => {
          Meteor.call('getCurrentSpreadSheet', credentials.boardId, csv);
        });
      });
    });
  }
});
