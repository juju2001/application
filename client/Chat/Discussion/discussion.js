Template.discussion.rendered = function() {
  document.title = "Actualité de vos discussions";
  var sessionID = LocalStore.get("userID");
  var find = Connexion.findOne({
    userIdNow: sessionID,
  });
  if (!sessionID || find && sessionID != find.userIdNow) {
    Router.go('/connexion');
  }
};

Template.discussion.helpers({
  discussion: function() {
    var sessionID = LocalStore.get("userID");
    return Contact.find({
      userIdNow: sessionID,
    }, {
      sort: {
        lastMessage: -1,
      },
    }).fetch();
  },

  notification: function() {
    var sessionID = LocalStore.get("userID");
    var contactID = LocalStore.get("contactID");
    var id = Contact.findOne({
      _id: this._id,
    });
    var notification = Message.findOne({
      idClient1: id.contact,
      idClient2: sessionID,
      lu: "false",
    });
    if (notification) {
      return notification;
    }
  },

  inscriptionFind: function() {
    return Session.get("inscriptionFind");
  },

  messageFind: function() {
    return Session.get("messageFind");
  },

});

Template.discussion.events({
  'click .goDiscu': function(event) {
    event.preventDefault();
    event.stopPropagation();
    var id = Contact.findOne({
      _id: this._id,
    });
    var contactId = id.contact;
    if (contactId) {
      LocalStore.set("contactID", contactId);
      Router.go('/message');
    };
  },

  'click #goRecherche': function(event) {
    event.preventDefault();
    event.stopPropagation();
    var infoRecherche = $("#recherche").val();
    var sessionID = LocalStore.get("userID");
    var hash = ({
      userIdNow: sessionID,
      recherche: infoRecherche,
    });
    var inscriptionFind = Inscription.find({
      $or: [{
        prenom: infoRecherche,
      }, {
        nom: infoRecherche,
      }, {
        age: infoRecherche,
      }, {
        email: {
          $regex: infoRecherche,
        },
      }, {
        pseudo: infoRecherche,
      }],
    }).fetch();

    var messageFind = Message.find({
      $or: [{
        idClient1: sessionID,
      }, {
        idClient2: sessionID,
      }],
      message: {
        $regex: infoRecherche,
      },
    }).fetch();

    Session.set('inscriptionFind', inscriptionFind);
    Session.set('messageFind', messageFind);
    $("#recherche").val('');
  },

});
