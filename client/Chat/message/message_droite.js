Template.messageDroite.rendered = function() {
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
}

Template.messageDroite.helpers({
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
  messageDateSend: function(index) {
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
      return '<div class="messageDateSend">' + jour + "/" + mois + "/" + day.getFullYear() + '</div>'
    }

    var dayBefore = new Date(messages[index - 1].hours);

    day.setHours(0, 0, 0, 0);
    dayBefore.setHours(0, 0, 0, 0);

    if (dayBefore < day) {
      return '<div class="messageDateSend">' + jour + "/" + mois + "/" + day.getFullYear() + '</div>';
    }
  },

  // Affiche les informations de la personne avec qui on discute
  messageFriendInformation: function() {
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
  messageFriendLastConnexion: function() {
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
        if (hours < 10) {
          hours = "0" + hours;
        }
        var minutes = date.getMinutes();
        if (minutes < 10) {
          minutes = "0" + minutes;
        }
        var today = new Date();
        if (day == today.getDate()) {
          if (month == today.getMonth() + 1) {
            if (year == today.getFullYear()) {
              var final = "Hors ligne depuis " + "  " + hours + ":" + minutes;
            } else {
              var final = "Hors ligne depuis " + day + "/" + month + "/" + year + "  " + hours + ":" + minutes;
            }
          } else {
            var final = "Hors ligne depuis " + day + "/" + month + "/" + year + "  " + hours + ":" + minutes;
          }
        } else {
          var final = "Hors ligne depuis " + day + "/" + month + "/" + year + "  " + hours + ":" + minutes;
        }
        return final;
      } else {
        return "En ligne";
      }
    }
  },

  // Affiche l'heure du message
  messageHeure: function() {
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

  // Détermine la couleur du message
  messageSide: function() {
    if (this.idClient1 === Session.get("userID")) {
      return 'textright';
    }
    return 'textleft';
  },

  // Détermine la couleur du vu dans le message
  messageThisDiscussionGlyphiconColor: function() {
    var sessionID = Session.get("userID");
    if (this.idClient1 == sessionID) {
      if (this.lu == false) {
        return "colorGray" + " " + "glyphicon glyphicon-ok" + " " + "ok";
      } else {
        return "colorBlue" + " " + "glyphicon glyphicon-ok" + " " + "ok";
      }
    }
  },

});

Template.messageDroite.events({
  // Envoie le message et l'enregistre dans la MongoDB
  'submit form': function(event) {
    event.preventDefault();
    event.stopPropagation();
    var sessionID = Session.get("userID");
    var contactID = Session.get("contactID");
    var find = Connexion.findOne({
      userIdNow: sessionID,
    });
    var message = $('#messages').val();
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

  // Envoie le message et l'enregistre dans la MongoDB
  'click #messageButton': function(event) {
    event.preventDefault();
    event.stopPropagation();
    var sessionID = Session.get("userID");
    var contactID = Session.get("contactID");
    var find = Connexion.findOne({
      userIdNow: sessionID,
    });
    var message = $('#messages').val();
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

  // Envoie le message et l'enregistre dans la MongoDB
  'click #messageSend': function(event) {
    event.preventDefault();
    event.stopPropagation();
    var sessionID = Session.get("userID");
    var contactID = Session.get("contactID");
    var find = Connexion.findOne({
      userIdNow: sessionID,
    });
    var message = $('#messages').val();
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
})
