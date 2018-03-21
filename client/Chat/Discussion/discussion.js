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

  lastConnexion: function() {
    var sessionID = LocalStore.get("sessionID");
    var id = Contact.findOne({
      _id: this._id,
    });
    var ids = id.contact;
    var deco = Connexion.findOne({
      userIdNow: ids,
    });
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
      var final = "Hors ligne depuis " + day + "/" + month + "/" + year + "  " + hours + ":" + minutes;
      return final;
    } else {
      return "En ligne";
    }
  },

  couleur: function() {
    var sessionID = LocalStore.get("sessionID");
    var id = Contact.findOne({
      _id: this._id,
    });
    var ids = id.contact;
    var deco = Connexion.findOne({
      userIdNow: ids,
    });
    if (deco.deconnexion == 0) {
      return 'text-success'
    } else {
      return 'text-danger'
    }
  },

  infoNom: function() {
    var sessionID = LocalStore.get("userID");
    var id = Message.findOne({
      _id: this._id,
    });
    if (id) {
      var info = Inscription.findOne({
        _id: id.idClient1,
      });
      if (sessionID == id.idClient2) {
        return info.nom;
      }
    }
  },

  infoPrenom: function() {
    var sessionID = LocalStore.get("userID");
    var id = Message.findOne({
      _id: this._id,
    });
    if (id) {
      var info = Inscription.findOne({
        _id: id.idClient1,
      });
      if (sessionID != id.idClient1) {
        return info.prenom;
      } else {
        info = Inscription.findOne({
          _id: id.idClient2,
        });
        return "Moi"
      }
    }
  },

  infoHeure: function() {
    var sessionID = LocalStore.get("userID");
    var id = Message.findOne({
      _id: this._id,
    });
    if (id) {
      var time = id.hours;
      var date = new Date(time);
      return +date.getHours() + ":" + date.getMinutes() + " " + date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
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
    Session.set();
    $("#recherche").val('');
  },

  'click #supp': function(event) {
    event.preventDefault();
    event.stopPropagation();
    var sessionID = LocalStore.get("userID");
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
  }

});
