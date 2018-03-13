Template.accueil.rendered = function() {
  document.title = "Accueil";
};


Template.accueil.helpers({
  prenomAccueil: function() {
    var sessionID = LocalStore.get("userID");
    var find = Inscription.findOne({
      _id: sessionID,
    });

    if (find) {
      return find.prenom;
    }
  },

  contacter: function() {
    var sessionID = LocalStore.get("userID");

    var contacts = Contact.find({
      userIdNow: sessionID,
    }).fetch();
    var ids = _.pluck(contacts, 'contact');
    ids.push(sessionID);
    return Inscription.find({
      _id: {
        $nin: ids,
      },
    }).fetch();
  },

  connecté: function() {
    var sessionID = LocalStore.get("userID");
    var contacts = Inscription.find({
      etat:  "true",
    }).fetch();
    var ids = _.pluck(contacts, '_id');
    ids.push(sessionID);
    return Contact.find({
      contact: {
        $in: ids,
      },
      userIdNow: sessionID,
    }).fetch();
  },
});

Template.accueil.events({
  'click .goAjouter': function(event) {
    event.preventDefault();
    event.stopPropagation();
    var identifiant = Inscription.findOne({
      _id: this._id,
    });
    var id = identifiant._id;
    if (id) {
      LocalStore.set("newContactID", id);
      Router.go('/newContact');
    }
  },
})
