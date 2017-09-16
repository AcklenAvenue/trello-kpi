import { Meteor } from 'meteor/meteor';
import json2csv from 'json2csv';

import { Trello } from './trello';

Meteor.methods({
  async getBoardNameHistory(key, token, boardId) {
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
  async getCardIdsAndNames(key, token, boardId){
    const response = await Trello.getListsInBoard(key, token, boardId);
    const lists = response.data;
    let listOfCards = [];
    lists.forEach((list) => {
      let cards = list.cards;
      cards.forEach((card) => {
        listOfCards.push({
          "cardId": card.id,
          "cardName": card.name
        });
      });
    });
    return listOfCards;
  },
  async getCardActions(key, token, cards) {
    await cards.forEach((card) => {
      const response = throttle(key, token, card);

    });
  },
  async throttle (key, token, cardId) {
    const response = await setTimeout((key, token, cardId) => {
      const response = Trello.getCardActions(key, token, cardId);
      return response.data;
    },100);
    let actions = {
      "date": response.date,
      cardId,

    };
    return response;
  }
});
