import { Meteor } from 'meteor/meteor';

import { Trello } from './trello';

Meteor.methods({
  async generateReleasePlan(boardName){
    const response = await Trello.generateReleasePlan(boardName);
    return response.data;
  }
});
