Template.profil.rendered = function() {
  document.title = "Profil";
  var sessionID = Session.get("userID");
  var find = Connexion.findOne({
    userIdNow: sessionID,
  });
  if (!sessionID && sessionID != find.userIdNow) {
    Router.go('/connexion');
  }

  Tracker.autorun(function () {
    var sessionID = Session.get("userID");

    var user = Inscription.findOne({
      _id: sessionID,
      etat: false,
    });
    if (user) {
      Router.go('/connexion');
    }
  });
};


Template.profil.helpers({
  prenom: function() {
    var sessionID = Session.get("userID");
    var find = Inscription.findOne({
      _id: sessionID,
    });

    if (find) {
      return find.prenom;
    }
  },

  nom: function() {
    var sessionID = Session.get("userID");
    var find = Inscription.findOne({
      _id: sessionID,
    });

    if (find) {
      return find.nom;
    }
  },

  email: function() {
    var sessionID = Session.get("userID");
    var find = Inscription.findOne({
      _id: sessionID,
    });

    if (find) {
      return find.email;
    }
  },

  age: function() {
    var sessionID = Session.get("userID");
    var find = Inscription.findOne({
      _id: sessionID,
    });

    if (find) {
      return find.age;
    }
  },

});

Template.profil.events({
  'click #modifier' : function(){
    var sessionID = Session.get("userID");
    var statut = $("#statut").val();
    Meteor.call('statut', statut, sessionID);
    $("#statut").val('');
  }
});
