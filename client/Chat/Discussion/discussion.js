Template.discussion.rendered = function() {
  document.title = "Actualité de vos discussions";

  Session.set("recherche", null);

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

  var notification = Message.find({
    idClient2: sessionID,
    notification: true,
  }).fetch();

  Meteor.call('discussionNotNoti', sessionID);


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

Template.discussion.helpers({

  // Couleur vert/rouge pour si la personne est connectée ou pas
  couleur: function() {
    var sessionID = Session.get("userID");
    var id = Contact.findOne({
      _id: this._id,
    });
    var ids = id.contact;
    var deco = Connexion.findOne({
      userIdNow: ids,
    });
    if (deco) {
      if (deco.deconnexion == 0) {
        return 'text-success'
      } else {
        return 'text-danger'
      }
    }
  },

  // Affiche les discussions
  discussion: function() {
    var sessionID = Session.get("userID");
    var contact = Contact.find({
      userIdNow: sessionID,
    }, {
      sort: {
        lastMessage: -1,
      },
    });
    return contact;
  },

  // Affiche l'heure de la nouvelle discussion
  lastConnexion: function() {
    var sessionID = Session.get("userID");
    var id = Contact.findOne({
      _id: this._id,
    });
    var ids = id.contact;
    var deco = Connexion.findOne({
      userIdNow: ids,
    });
    if (deco) {
      if (deco.deconnexion != 0) {
        var deconnexion = deco.deconnexion;
        var date = new Date(deconnexion);
        var day = date.getDate();
        var month = date.getMonth() + 1;
        if (month < 10) {
          month = "0" + month;
        }
        var year = date.getFullYear();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        if (minutes < 10) {
          minutes = minutes + "0";
        }
        if (hours == 0) {
          hours = "0" + hours;
        }
        var final = "Hors ligne depuis " + day + "/" + month + "/" + year + "  " + hours + ":" + minutes;
        return final;
      } else {
        return "En ligne";
      }
    }
  },

  // Affiche les discussions des personnes avec qui on est pas ami
  noFriend: function() {
    var sessionID = Session.get("userID");
    var messages = Message.find({
      idClient2: sessionID,
      lu: false,
      luClient2: true,
    }).fetch();
    var ids = _.pluck(messages, 'idClient1');
    var alreadyFriend = Contact.findOne({
      userIdNow: sessionID,
      contact: {
        $in: ids,
      },
    });
    if (!alreadyFriend) {
      return Inscription.find({
        _id: {
          $in: ids,
        },
      });
    }
  },

  //Enlève la notifcation dans la navbar
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

  //notification dans le tableau discussion
  notification: function() {
    var sessionID = Session.get("userID");
    var id = Contact.findOne({
      _id: this._id,
    });
    var notification = Message.findOne({
      idClient1: id.contact,
      idClient2: sessionID,
      lu: false,
    });
    if (notification) {
      return notification;
    }
  },

});

Template.discussion.events({

  // Rejoind la page message
  'click .goDiscu': function(event) {
    event.preventDefault();
    event.stopPropagation();
    var id = Contact.findOne({
      _id: this._id,
    });
    var contactId = id.contact;
    if (contactId) {
      Session.set("contactID", contactId);
      Router.go('/message');
    };
    var noFriendId = Inscription.findOne({
      _id: this._id,
    });
    if (noFriendId) {
      Session.set("contactID", noFriendId._id)
    }
  },

  // Ajoute le nouveau contact avant d'aller à la page message
  'click .goNewDiscu': function(event) {
    event.preventDefault();
    event.stopPropagation();
    var id = Inscription.findOne({
      _id: this._id,
    });
    if (id) {
      var idContact = id._id;
      if (idContact) {
        Session.set("newContactID", idContact);
        Router.go('newContact');
      };

    }
  },

  // Supprime la discussion
  'click #supp': function(event) {
    event.preventDefault();
    event.stopPropagation();
    var sessionID = Session.get("userID");
    var id = Contact.findOne({
      _id: this._id,
    });
    if (id && confirm("Etes-vous sûr de vouloir supprimer la discussion ?")) {
      var contactID = id.contact;
      Meteor.call('discussionSupprimerMessage1', sessionID, contactID, function() {
        Meteor.call('discussionSupprimerMessage2', sessionID, contactID, function() {
          alert("Discussio supprimée !");
        });
      });
    }
  },

  // Supprime la discussion de la personne avec qui on est pas ami
  'click #suppNoFriend': function(event) {
    event.preventDefault();
    event.stopPropagation();
    var sessionID = Session.get("userID");
    var id = Inscription.findOne({
      _id: this._id,
    });
    if (id && confirm("Etes-vous sûr de vouloir supprimer la discussion ?")) {
      var contactID = id._id;
      Meteor.call('discussionSupprimerMessage1', sessionID, contactID, function() {
        Meteor.call('discussionSupprimerMessage2', sessionID, contactID, function() {
          alert("Discussio supprimée !");
        });
      });
    }
  }

});
