Template.message.rendered = function() {
  document.title = "Message";
  var sessionID = LocalStore.get("userID");
  var find = Connexion.findOne({
    userIdNow: sessionID,
  });
  if (!sessionID || sessionID != find.userIdNow) {
    Router.go('/connexion');
  }
};

Template.message.helpers({
  messages: function() {
    var sessionID = LocalStore.get("userID");
    var contactID = LocalStore.get("contactID");

    return Message.find({
      $or: [{
        idClient1: sessionID,
        idClient2: contactID,
      },{
        idClient1: contactID,
        idClient2: sessionID,
      }],
    }, {
      $sort: {
        hours: 1,
      },
    });
  },
  color: function() {
    // String solution
    if (this.idClient1 === LocalStore.get("userID")) {
      return 'text-success text-right';
    }
    return 'text-danger text-left ';
  },
});


Template.message.events({
  'submit form': function(event) {
    event.preventDefault();
    event.stopPropagation();
    var sessionID = LocalStore.get("userID");
    var contactID = LocalStore.get("contactID");
    var find = Connexion.findOne({
      userIdNow: sessionID,
    });
    var message = event.target.message.value;
    if (message) {
      var now = new Date();
      var hash3 = {
        idClient1: sessionID,
        idClient2: contactID,
        message: message,
        lu: "false",
        hours: now.getTime(),
      };
      var lu = "true";
      var contactID = LocalStore.get("contactID");
      Meteor.call('message', hash3, function(data3) {});
      $('#messages').val('');
      if(LocalStore.get("userID")){
        Meteor.call('notification', lu, sessionID, contactID, function(data3) {});
      }
    }
  },
});
