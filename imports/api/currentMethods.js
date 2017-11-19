import { Meteor } from 'meteor/meteor';
import json2csv from 'json2csv';
import projects from '../../projects.json';
import { Trello } from './trello';

const moment = require('moment');
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
  getCurrentSpreadSheet(boardId, code, csv){

    if(!csv){
      return;
    }

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
        return;
      }

      oauth2Client.setCredentials(tokens);

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
        auth: oauth2Client
      }, function (err, document) {
        console.log(err);
        console.log('request 1 success');
        // Retrieve data about current Sheet
        const documentSheets = document.sheets;
        const nowdate = moment().format('MM-DD-YYYY');
        let exist = false;

        let lastIndex = 0;
        let lastId;

        let evoId;
        let evoColumnIndex;

        documentSheets.forEach( (sheet) => {
          let title = sheet.properties.title;
          if(title.includes('As of ')){
            lastIndex = documentSheets.indexOf(sheet); //Where create column
            lastId = sheet.properties.sheetId;
          }

          if(title.includes(nowdate)){
            exist = true;
          }

          if(title.includes('Evolution')){
            evoId = sheet.properties.sheetId;
            // evoColumnIndex = sheet.data[0].rowData[0].values.length;
          }
        });

        // Sheet already exist today, stop here
        if(exist){
          // EXIT
          return;
        }

        sheets.spreadsheets.values.batchGetByDataFilter({
          spreadsheetId: project[0].sheetId,
          auth: oauth2Client,
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
          // Update current document
          sheets.spreadsheets.batchUpdate({
            spreadsheetId: project[0].sheetId,
            auth: oauth2Client,
            resource: {
              "requests": [
                {
                  "duplicateSheet": {
                    "insertSheetIndex": lastIndex + 1,
                    "newSheetName": "As of " + nowdate,
                    "sourceSheetId": lastId
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
                }
              ]
            },
          }, function(err, success){
            console.log(err);
            console.log('request 3 success');

            const newSheetId = success.replies[0].duplicateSheet.properties.sheetId;

            sheets.spreadsheets.values.batchUpdateByDataFilter({
              spreadsheetId: project[0].sheetId,
              auth: oauth2Client,
              resource: {
                "data": [
                  {
                    "dataFilter": {
                      "gridRange": {
                        "sheetId": evoId,
                        "startColumnIndex": evoColumnIndex,
                        "startRowIndex": 0
                      }
                    },
                    "values": [
                      [
                        "As of", "dos", "tres"
                      ],
                      [
                        nowdate
                      ]
                    ]
                  }
                ],
                "valueInputOption": "RAW"
              }
            }, function(err, success){
              console.log(err);
              console.log('request 4 success');

              console.log('BBBBBBBBBBBBBBBBBBBBBBBBB', typeof csv);
              let csvLines = csv.split('\n');

              let data = [];
              
              for (var i=1; i<csvLines.length; i++)
              {
                  const fields = csvLines[i].replace(/"/g,'').split(',');

                  const listName = fields[1];
                  const cardName = fields[3];
                  const labels = fields[4];

                  data.push([listName, cardName, labels]);
              }

              console.log(data);              

              sheets.spreadsheets.values.batchUpdateByDataFilter({
              spreadsheetId: project[0].sheetId,
              auth: oauth2Client,
              resource: {
                "data": [
                  {
                    "dataFilter": {
                      "gridRange": {
                        "sheetId": newSheetId,
                        "startColumnIndex": 11,
                        "startRowIndex": 3
                      }
                    },
                    "values":  [
                      
                        ["1","dos", "tres"],
                        ["2","dos", "tres"],
                        ["3","dos", "tres"],
                        ["4","dos", "tres"],
                        ["5","dos", "tres"],
                        ["6","dos", "tres"],
                        ["7","dos", "tres"],
                        ["8","dos", "tres"],
                        ["9","dos", "tres"],
                        ["10","dos", "tres"],
                        ["11","dos", "tres"],
                        ["12","dos", "tres"],
                        ["13","dos", "tres"],
                        ["14","dos", "tres"],
                        ["15","dos", "tres"],
                        //["16","dos", "tres"],

                      
                      
                      
                      
                       ]
                  }
                ],
                "valueInputOption": "RAW"
              }
            }, function(err, success){
                console.log(err);
                console.log('request 5 success');
            });


              //console.log(csv);
            })
            // const newSheetId = success.replies[0].duplicateSheet.properties.sheetId;
            // Add new request to CLEAN and write CSV in this new sheet
            // Write CSV data in column L4
          })
        })
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

    // Retrict request to acklenavenue domain
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
