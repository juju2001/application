Template.message.rendered = function() {
  document.title = "Message";
  if (Session.get("userID") == null ) {
    Router.go('/connexion');
  }

  var sessionID = Session.get("userID");
  var find = Connexion.findOne({
    userIdNow: sessionID,
  });

  // Déscent l'overflow toujours en bas lorsqu'on rejoind une discussion ou qu'il y ait un nouveau message
  Message.find().observeChanges({
    changed: function() {
      setTimeout(function() {
        var x = document.getElementById("enbas");
        x.scrollTop = x.scrollHeight;
      }, 300);
    },
    added: function() {
      setTimeout(function() {
        var x = document.getElementById("enbas");
        x.scrollTop = x.scrollHeight;
      }, 300);
    }
  });

  // Controle si on change de recherche, ne nous laisse pas accéder à la page si il n'y a pas ID valabe (sécurité)
  Tracker.autorun(function() {
    setTimeout(function() {
      var x = document.getElementById("enbas");
      x.scrollTop = x.scrollHeight;
      var recherche = document.getElementById("rechercheContact");
      recherche.addEventListener("change", function() {
        var recherche2 = $('#rechercheContact').val();
        Session.set("recherche", recherche2);
      });
    }, 300);


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


Template.message.helpers({

  // Retourne les discussions
  discussion: function() {
    var sessionID = Session.get("userID");
    var contact = Contact.find({
      userIdNow: sessionID,
    }, {
      sort: {
        lastMessage: -1
      }
    });
    if (contact) {
      return contact;
    }
  },

  // Si il n'y a pas de contactID , il n'affiche pas de message, ni information personnelle du contact
  noId: function() {
    var contactID = Session.get("contactID");
    if (contactID == undefined) {
      return "rien";
    }
  },

  // Affiche les recherches dans la liste des discussion
  recherche: function() {
    var recherche = Session.get("recherche");
    if (recherche != null && recherche != '') {
      var mongo = Contact.find({
        userIdNow: Session.get("userID"),
      }).fetch();
      var ids = _.pluck(mongo, 'contact');
      var connecter = Inscription.find({
        $or: [{
          prenom: {
            $regex: recherche,
          },
          _id: {
            $in: ids,
          },
        }, {
          nom: {
            $regex: recherche,
          },
          _id: {
            $in: ids,
          },
        }],
      }).fetch();
      if (connecter) {
        return connecter;
      }
    }
  },

  // Affiche la notification dans la liste des discussions
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

  // Retourne le dernier message avec le contact dans la liste des discussions
  lastMessage: function() {
    var sessionID = Session.get("userID");
    var contact = Contact.findOne({
      _id: this._id,
    });
    var contactID = contact.contact;
    var lastMessage = Message.findOne({
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
        hours: -1,
      },
    });
    if (lastMessage) {
      return lastMessage.message;
    }
  },

  // Affiche les informations de la personne avec qui on discute
  infoPerso: function() {
    var sessionID = Session.get("userID");
    var contactID = Session.get("contactID");
    var infoPersonne = Contact.find({
      userIdNow: sessionID,
      contact: contactID,
    });
    if (infoPersonne) {
      return infoPersonne;
    }
  },

  // Affiche si le contact de la discussion est en ligne ou l'heure de sa dernière connexion
  lastConnexion: function() {
    var contactID = Session.get("contactID");
    var sessionID = Session.get("sessionID");
    var deco = Connexion.findOne({
      userIdNow: contactID,
    });
    if (deco) {
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
    }
  },

  // Retourne les messages
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

  // Retourne la date du jour de la discussion avec l'Index
  date: function(index) {
    var sessionID = Session.get("userID");
    var contactID = Session.get("contactID");
    var messages = Message.find({
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

    var day = new Date(this.hours);
    var jour = day.getDate();

    if (jour < 10) {
      jour = "0" + jour;
    }

    var mois = day.getMonth() + 1;

    if (mois < 10) {
      mois = "0" + mois;
    }

    if (index === 0) {
      return '<div class="date">' + jour + "/" + mois + "/" + day.getFullYear() + '</div>'
    }

    var dayBefore = new Date(messages[index - 1].hours);

    day.setHours(0, 0, 0, 0);
    dayBefore.setHours(0, 0, 0, 0);

    if (dayBefore < day) {
      return '<div class="date">' + jour + "/" + mois + "/" + day.getFullYear() + '</div>';
    }
  },

  // Index active class autreDiscussion
  autreDiscussionActiveClass: function(index) {
    var sessionID = Session.get("userID");
    var contactID = Session.get("contactID");
    var contacts = Contact.find({
      userIdNow: sessionID,
    }).fetch();

    var contact = this.contact;

    if (contactID === contact) {
      return 'bg-discussion'; // 'bg-secondary';
    }
  },

  // Vu dans les autres discussions
  vuColorAutreDiscussion: function() {
    var sessionID = Session.get("userID");
    var contactID = this.contact;
    var lastMessage = Message.findOne({
      $or: [{
        idClient1: sessionID,
        idClient2: contactID,
      }, {
        idClient1: contactID,
        idClient2: sessionID,
      }],
    }, {
      sort: {
        hours: -1
      }
    });
    if (lastMessage) {
      if (lastMessage.idClient1 == sessionID) {
        if (lastMessage.lu == false) {
          return "colorGray" + " " + "glyphicon glyphicon-ok" + " " + "discussionOK";
        } else {
          return "colorBlue" + " " + "glyphicon glyphicon-ok" + " " + "discussionOK";
        }
      }
    }
  },



  // Détermine la couleur du message
  position: function() {
    if (this.idClient1 === Session.get("userID")) {
      return 'textright';
    }
    return 'textleft';
  },

  // Détermine la couleur du vu dans le message
  color: function() {
    var sessionID = Session.get("userID");
    if (this.idClient1 == sessionID) {
      if (this.lu == false) {
        return "colorGray" + " " + "glyphicon glyphicon-ok" + " " + "ok";
      } else {
        return "colorBlue" + " " + "glyphicon glyphicon-ok" + " " + "ok";
      }
    }
  },

  // Affiche l'heure du message
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

});


Template.message.events({
  // Envoie le message et l'enregistre dans la MongoDB
  'submit form': function(event) {
    event.preventDefault();
    event.stopPropagation();
    var sessionID = Session.get("userID");
    var contactID = Session.get("contactID");
    var find = Connexion.findOne({
      userIdNow: sessionID,
    });
    var message = event.target.message.value;
    if (message && contactID != null) {
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
      Meteor.call('lastMessage2', time, sessionID, contactID);
      $('#messages').val('');
    }
  },

  // Rejoind une discussion depuis la liste des contacts
  'click .goDiscu': function(event) {
    Session.set("recherche", null);
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
    $('#messages').val('');
    setTimeout(function() {
      var x = document.getElementById("enbas");
      x.scrollTop = x.scrollHeight;
    }, 300);
  },

  // Rejoind la discussion depuis une recherche dans la liste de contact
  'click .goDiscution': function(event) {
    Session.set("recherche", null);
    event.preventDefault();
    event.stopPropagation();
    var contactId = this._id;
    if (contactId) {
      Session.set("contactID", contactId);
      Router.go('/message');
    };
    $('#messages').val('');
    setTimeout(function() {
      var x = document.getElementById("enbas");
      x.scrollTop = x.scrollHeight;
    }, 300);
  },

  'click ul': function() {
    Session.set("recherche", null);
    $('#messages').val('');
  }
});
