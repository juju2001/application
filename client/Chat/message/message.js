Template.message.rendered = function() {
  document.title = "Message";
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
      etat: false,
    });
    if (user) {
      Router.go('/connexion');
    }
  });
};


Template.message.helpers({
  messages: function() {
    var sessionID = Session.get("userID");
    var contactID = Session.get("contactID");
    Meteor.call('notification', sessionID, contactID);
    return Message.find({
      $or: [{
        idClient1: sessionID,
        idClient2: contactID,
        luClient1: true,
      }, {
        idClient1: contactID,
        idClient2: sessionID,
        luClient2: true,
      }],
    }, {
      sort: {
        hours: 1,
      },
    }).fetch();
  },

  color: function() {
    if (this.idClient1 === Session.get("userID")) {
      return 'text-success';
    }
    return 'text-danger';
  },

  infoPerso: function() {
    var sessionID = Session.get("userID");
    var contactID = Session.get("contactID");
    var infoPersonne = Contact.find({
      userIdNow: sessionID,
      contact: contactID,
    });
    return infoPersonne;
  },

  heure: function() {
    var sessionID = Session.get("userID");
    var contactID = Session.get("contactID");
    var message = Message.findOne({
      _id: this._id
    });
    var hour = message.hours;
    var hours = new Date(hour);
    var heure = hours.getHours();
    var minute = hours.getMinutes();
    if (heure < 10) {
      heure = "0" + heure;
    }
    if (minute < 10) {
      minute = "0" + minute;
    }
    var time = heure + ":" + minute;
    return time;
  },

/*  jour: function() {
    var message = Message.findOne({
      _id: this._id
    });
    var hour = message.hours;
    var date = new Date(hour);
    var heure = hours.getHours();
    var minute = hours.getMinutes();
    if(heure <)
  }*/

  lastConnexion: function() {
    var contactID = Session.get("contactID");
    var sessionID = Session.get("sessionID");
    var deco = Connexion.findOne({
      userIdNow: contactID,
    });
    if (deco.deconnexion != 0) {
      var deconnexion = deco.deconnexion;
      var date = new Date(deconnexion);
      var day = date.getDate();
      var month = date.getMonth() + 1;
      var year = date.getFullYear();
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var final = "Hors ligne depuis " + day + "/" + month + "/" + year + "  " + hours + ":" + minutes;
      return final;
    } else {
      return "En ligne";
    }
  },

  couleur: function() {
    var contactID = Session.get("contactID");
    var sessionID = Session.get("sessionID");
    var deco = Connexion.findOne({
      userIdNow: contactID,
    });
    if (deco.deconnexion == 0) {
      return 'text-success'
    } else {
      return 'text-danger'
    }
  },

  statut: function() {
    var contactID = Session.get("contactID");
    var statut = Inscription.findOne({
      _id: contactID,
    });
    if (statut) {
      return statut.statut;
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

  discussion: function() {
    var sessionID = Session.get("userID");
    var contact = Contact.find({
      userIdNow: sessionID,
    });
    return contact;
  },

});


Template.message.events({
  'submit form': function(event) {
    event.preventDefault();
    event.stopPropagation();
    var sessionID = Session.get("userID");
    var contactID = Session.get("contactID");
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
        lu: false,
        notification: true,
        hours: now.getTime(),
        luClient1: true,
        luClient2: true,
      };
      var time = now.getTime();
      Meteor.call('message', hash3, function(data3) {});
      Meteor.call('lastMessage', time, sessionID, contactID);
      $('#messages').val('');
    }
  },

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
});
