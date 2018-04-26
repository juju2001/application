Template.default.rendered = function() {
  Session.set("recherche", '');
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
