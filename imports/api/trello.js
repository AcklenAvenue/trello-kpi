const axios = require('axios');

let baseUrl = 'https://api.trello.com/1/';



export const Trello = {
  baseUrl,
  getBoards(key, token) {
    return axios.get(`${baseUrl}members/my/boards?key=${key}&token=${token}`);
  },
  getBoardName(key, token) {
    return axios.get(`${baseUrl}members/my/boards?key=${key}&token=${token}`);
  },
  getListsInBoard(key, token, boardId) {
    return axios.get(`${baseUrl}boards/${boardId}/lists?cards=open&card_fields=name&filter=open&fields=name&card_fields=labels&card_fields=due&card_fields=dueComplete&key=${key}&token=${token}`);
  },
  getActionsInCard(key, token, cardId) {
    return axios.get(`${baseUrl}cards/${cardId}/actions?key=${key}&token=${token}&filter=updateCard:idList`);
  },
  generateReleasePlan(boardName) {
    return axios.get(`http://localhost:8000/activities/${boardName}`);
  }
};
