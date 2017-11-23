import { Meteor } from 'meteor/meteor';
import '../imports/api/currentMethods';
import '../imports/api/historyMethods';
import '../imports/api/boardsMethods';

Meteor.startup(() => {
  SyncedCron.add({
    name: 'Interate every project to update google SpreadSheet',
    schedule: function(parser) {
      // 'at 5:00 pm on Mon'
      return parser.text('every 15 mins');
    },
    job: function() {
      console.log('I am the cronjob!!')
      Meteor.call('updateProjects');
    }
  });

  SyncedCron.start();
  // code to run on server at startup
});
