/* global Assets */
"use strict"
import { Meteor } from 'meteor/meteor';
import dotenv from 'dotenv';
import '../imports/api/currentMethods';
import '../imports/api/historyMethods';
import '../imports/api/boardsMethods';
import '../imports/api/releasePlanMethods';

dotenv.config({
  path: Assets.absoluteFilePath('.env'),
});

const axios = require('axios');

Meteor.startup(() => {
  setInterval(function() {
      console.log('ping get');
      axios.get("https://compass-trello-kpi.herokuapp.com");
  }, 300000); // every 5 minutes (300000)

  SyncedCron.add({
    name: 'Interate every project to update google SpreadSheet',
    schedule: function(parser) {
      return parser.text('at 7:00 am on Mon');
    },
    job: function() {
      console.log('I am the cronjob!!')
      Meteor.call('updateProjects');
    }
  });

  SyncedCron.start();
  // code to run on server at startup
});
