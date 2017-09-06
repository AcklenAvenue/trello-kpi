import { Meteor } from 'meteor/meteor';
import json2csv from 'json2csv';

import { Trello } from './trello';

Meteor.methods({
  async getBoardName(key, token, boardId) {
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
          "labels": labelsString
        });
      })
    });
    const fields = ['listId', 'listName', 'cardId', 'cardName', 'labels'];
    const csv = json2csv({ data, fields });
    return csv;
  }
});
