Template.default.rendered = function() {
  Session.set("recherche", '');
    var sessionID = Session.get("userID");
  $("html").on("mouseleave", function () {
    var heure = new Date();
    var heureDeco = heure.getTime();
    Meteor.call('heureDeco', sessionID, heureDeco);
    Meteor.call('etatSession1', sessionID);
  });

  $("html").on("mouseenter", function () {
    Meteor.call('dec0', sessionID);
    Meteor.call('etatSession2', sessionID);
  });
};

Template.default.helpers({

// Notification dans la navbar
  notif: function() {
    var sessionID = Session.get("userID");
    if (sessionID != null) {
      var session = Message.findOne({
        idClient2: sessionID,
        notification: true,
      });
      if (session) {
        return session;
      }
    }
  },

  sessionId: function() {
    if(Session.get('userID') == null || Session.get('userID') == undefined) {
      return true;
    }
  }
});


Template.default.events({
  'click #goRecherche': function(event) {
    event.preventDefault();
    event.stopPropagation();
    var infoRecherche = $("#recherche").val();
    Session.set('infoRecherche', infoRecherche);
    $("#recherche").val('');
    Session.set('rech', "rech");
    Router.go('/accueil');
  },
});
