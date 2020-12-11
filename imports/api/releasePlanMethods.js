import { Meteor } from 'meteor/meteor';

import { Trello } from './trello';
import sequelize from 'sequelize';

Meteor.methods({
  async generateReleasePlan(boardName){
    const response = await Trello.generateReleasePlan(boardName);
    return response.data;
  },

  async getAllBoards(){
    const db = new sequelize.Sequelize(process.env.PG_DATABASE, process.env.PG_USER, process.env.PG_PASSWORD, {
      host: process.env.PG_HOST,
      dialect: 'postgres'
    });
    const response = await db.query(`select * from "Boards" where "webhookStatus" = 'true'`);
    db.close();
    return response[0];
  },
  
  async cycleTimes(){
    const response = await Trello.cycleTimes();
    return response;
  },

  async timeInStates(){
    const response = await Trello.timeInStates();
    return response;
  },

  async trelloActivities(boards){
    const response = await Trello.trelloActivities(boards);
    return response;
  }
});
