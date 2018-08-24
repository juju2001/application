//
// Client side activity detection for the session timeout
// - depends on jquery
//
// Meteor settings:
// - staleSessionHeartbeatInterval: interval (in ms) at which activity heartbeats are sent up to the server
// - staleSessionActivityEvents: the jquery events which are considered indicator of activity e.g. in an on() call.
//
var heartbeatInterval = Meteor.settings && Meteor.settings.public && Meteor.settings.public.staleSessionHeartbeatInterval || (3*60*1000); // 3mins
var activityEvents = Meteor.settings && Meteor.settings.public && Meteor.settings.public.staleSessionActivityEvents || 'mousemove click keydown';

var activityDetected = false;


Meteor.startup(function() {

    //
    // periodically send a heartbeat if activity has been detected within the interval
    //
    Meteor.setInterval(function() {
      var inscription = Inscription.find().fetch();
      var ids = _.pluck(inscription, '_id');


      var sessionID = Session.get("userID");
        if (sessionID && activityDetected) {
            Meteor.call('heartbeat', sessionID);
            activityDetected = false;
        }
        if (ids && activityDetected) {
            Meteor.call('heartbeat', ids);
            activityDetected = false;
        }
    }, heartbeatInterval);

    //
    // detect activity and mark it as detected on any of the following events
    //
    $(document).on(activityEvents, function() {
       activityDetected = true;
    });
});
