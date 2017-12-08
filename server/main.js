import { Meteor } from 'meteor/meteor';
import '../imports/api/currentMethods';
import '../imports/api/historyMethods';
import '../imports/api/boardsMethods';

Meteor.startup(() => {
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
