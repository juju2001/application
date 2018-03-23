//
// Server side activity detection for the session timeout
//
// Meteor settings:
// - staleSessionInactivityTimeout: the amount of time (in ms) after which, if no activity is noticed, a session will be considered stale
// - staleSessionPurgeInterval: interval (in ms) at which stale sessions are purged i.e. found and forcibly logged out
// - staleSessionForceLogout: whether or not we want to force log out and purge stale sessions
//
var staleSessionPurgeInterval = Meteor.settings && Meteor.settings.public && Meteor.settings.public.staleSessionPurgeInterval || (1*60*1000); // 1min
var inactivityTimeout = Meteor.settings && Meteor.settings.public && Meteor.settings.public.staleSessionInactivityTimeout || (30*60*1000); // 30mins
var forceLogout = Meteor.settings && Meteor.settings.public && Meteor.settings.public.staleSessionForceLogout;

//
// provide a user activity heartbeat method which stamps the user record with a timestamp of the last
// received activity heartbeat.
//
Meteor.methods({
    heartbeat: function(sessionID) {
        if (!sessionID) { return; }
        var user = Inscription.findOne({_id : sessionID});
        if (user) {
            Inscription.update({_id : sessionID}, {$set: {heartbeat: new Date()}});
        }
    }
});


//
// periodically purge any stale sessions, removing their login tokens and clearing out the stale heartbeat.
//
if (forceLogout !== false) {
    Meteor.setInterval(function() {
        var now = new Date(), overdueTimestamp = new Date(now-inactivityTimeout);
        Inscription.update({heartbeat: {$lt: overdueTimestamp}},
                            {$set: {etat : false},
                             $unset: {heartbeat:1}},
                            {multi: true});
    }, staleSessionPurgeInterval);
}
