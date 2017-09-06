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
  getCardsInBoard(key, token, boardId) {
    return axios.get(`${baseUrl}boards/${boardId}/cards?key=${key}&token=${token}`)
      .then((response) => {
        return response.data;
      })
      .catch((e) => {
        console.log('Error: ', e.message);
      });
  },
  getListsInBoard(key, token, boardId) {
    return axios.get(`${baseUrl}boards/${boardId}/lists?cards=open&card_fields=name&filter=open&fields=name&card_fields=labels&key=${key}&token=${token}`);
  }
};
