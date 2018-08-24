Template.contact.rendered = function() {
  document.title = "Contact";
  if (Session.get("userID") == null) {
    Router.go('/connexion');
  }

  var sessionID = Session.get("userID");
  var find = Connexion.findOne({
    userIdNow: sessionID,
  });
  if (!sessionID && sessionID != find.userIdNow) {
    Router.go('/connexion');
  }

  Tracker.autorun(function() {
    var sessionID = Session.get("userID");

    var user = Inscription.findOne({
      _id: sessionID,
      etatCompte: false,
    });
    if (user) {
      Router.go('/connexion');
    }
  });
};


Template.contact.helpers({

  //  Retourne l'âge exacte d'un contact
  contactAge: function() {
    var sessionID = Session.get("userID");
    var id = Contact.findOne({
      _id: this._id,
    });
    if (id) {
      var contactID = id.contact;
      var last = Inscription.findOne({
        _id: contactID,
      });
      if (last) {
        var date = last.date;
        var birthday = new Date(date);
        var nouveau = new Date();
        var age = new Number(nouveau.getTime() - birthday.getTime()) / 31557600000;
        return Math.floor(age);
      };
    }
  },

  // Retourne la liste de nos contacts
  contactList: function() {
    var sessionID = Session.get("userID");
    var last = Contact.find({
      userIdNow: sessionID,
    }).fetch();
    if (last) {
      return last;
    };
  },

});

Template.contact.events({

  // Supprimer un contact
  'click .supprimer': function(event) {
    event.preventDefault();
    event.stopPropagation();
    var id = Contact.findOne({
      _id: this._id,
    });
    var contactID = id.contact;
    var sessionID = Session.get("userID");
    if (confirm("Etes-vous sûr de vouloir supprimer ce contact")) {
      Meteor.call('supprimerContact', sessionID, contactID, function() {
        Meteor.call('supprimerMessage1', sessionID, contactID, function() {
          Meteor.call('supprimerMessage2', sessionID, contactID, function() {
            Router.go('/contact');
          });
        });
      });
    }
  },
})
