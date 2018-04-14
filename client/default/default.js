Template.default.helpers({
  notif: function() {
    var sessionID = Session.get("userID");
    var session = Message.findOne({
      idClient2: sessionID,
      notification: true,
    });
    if (session) {
      return session;
    }
  },
});
