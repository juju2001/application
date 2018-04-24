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

  Meteor.call('notNoti', sessionID);


  Tracker.autorun(function() {
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

Template.discussion.helpers({
  discussion: function() {
    var sessionID = Session.get("userID");
    var contact = Contact.find({
      userIdNow: sessionID,
    });
    return contact;
  },

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


  'click #supp': function(event) {
    event.preventDefault();
    event.stopPropagation();
    var sessionID = Session.get("userID");
    var id = Contact.findOne({
      _id: this._id,
    });
    if (id && confirm("Etes-vous sûr de vouloir supprimer la discussion ?")) {
      var contactID = id.contact;
      Meteor.call('supprimerMessage1', sessionID, contactID, function() {
        Meteor.call('supprimerMessage2', sessionID, contactID, function() {
          alert("Discussio supprimée !");
        });
      });
    }
  },

  'click #suppNoFriend': function(event) {
    event.preventDefault();
    event.stopPropagation();
    var sessionID = Session.get("userID");
    var id = Inscription.findOne({
      _id: this._id,
    });
    if (id && confirm("Etes-vous sûr de vouloir supprimer la discussion ?")) {
      var contactID = id._id;
      Meteor.call('supprimerMessage1', sessionID, contactID, function() {
        Meteor.call('supprimerMessage2', sessionID, contactID, function() {
          alert("Discussio supprimée !");
        });
      });
    }
  }

});
