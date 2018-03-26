Template.accueil.rendered = function() {
  document.title = "Accueil";

  var sessionID = Session.get("userID");
  var find = Connexion.findOne({
    userIdNow: sessionID,
  });
  if (!sessionID && sessionID != find.userIdNow) {
    Router.go('/connexion');
  }
  Session.set("inscriptionFind", null);
  Session.set("messageFind", null);
  Session.set("rech", null);
};


Template.accueil.helpers({
  prenomAccueil: function() {
    var sessionID = Session.get("userID");
    var find = Inscription.findOne({
      _id: sessionID,
    });

    if (find) {
      return find.prenom;
    }
  },

  amiConnecté: function() {
    var sessionID = Session.get("userID");
    var amis = Contact.find({
      userIdNow: sessionID,
    }).fetch();
    var ids = _.pluck(amis, 'contact');
    var connecter = Inscription.findOne({
      _id: {
        $in: ids,
      },
      etat: true,
    });
    if (connecter) {
      return "Ami(s) actuellement connecté(s) !"
    }
  },


  ajouterAmi: function() {
    sessionID = Session.get("userID");
    var contact = Contact.find({
      userIdNow: sessionID,
    }).fetch();
    var ids = _.pluck(contact, 'contact');
    ids.push(sessionID);
    var inscription = Inscription.findOne({
      _id: {
        $nin: ids,
      },
    });
    if (inscription) {
      return "Ajouter de nouveau(x) ami(s) !";
    }
  },

  contacter: function() {
    var sessionID = Session.get("userID");

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
    var sessionID = Session.get("userID");
    var contacts = Inscription.find({
      etat: true,
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

  inscriptionFind: function() {
    return Session.get("inscriptionFind");
  },

  messageFind: function() {
    return Session.get("messageFind");
  },

  Motrecherche: function() {
    var rech = Session.get("rech");
    if (rech == "rech") {
      return "Recherche";
    }
  },

  infoNom: function() {
    var sessionID = Session.get("userID");
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
    var sessionID = Session.get("userID");
    var id = Message.findOne({
      _id: this._id,
    });
    if (id) {
      var idClient2 = id.idClient2;
      var inscription = Inscription.findOne({
        _id: idClient2,
      });
    }
    var id = Message.findOne({
      _id: this._id,
    });
    if (id) {
      var info = Inscription.findOne({
        _id: id.idClient1,
      });
      if (sessionID != id.idClient1) {
        return info.prenom + " à Moi";
      } else {
        info = Inscription.findOne({
          _id: id.idClient2,
        });
        return "Moi à " + inscription.nom + inscription.prenom;
      }
    }
  },

  infoHeure: function() {
    var sessionID = Session.get("userID");
    var id = Message.findOne({
      _id: this._id,
    });
    if (id) {
      var time = id.hours;
      var date = new Date(time);
      if (date.getMinutes() <= 9) {
        var date0 = "0" + date.getMinutes();
        return +date.getHours() + ":" + date0 + " " + date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
      } else {
        return +date.getHours() + ":" + date.getMinutes() + " " + date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
      }
    }
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
      Session.set("newContactID", id);
      Router.go('/newContact');
    }
  },

  'click #goRecherche': function(event) {
    event.preventDefault();
    event.stopPropagation();
    var infoRecherche = $("#recherche").val();
    var sessionID = Session.get("userID");
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

    if (messageFind || inscriptionFind) {
      Session.set('rech', "rech");
    }

    Session.set('inscriptionFind', inscriptionFind);
    Session.set('messageFind', messageFind);
    $("#recherche").val('');
  },

  'click .goInscription': function() {
    var sessionID = Session.get("userID");
    var inscription = Inscription.findOne({
      _id: this._id,
    });
    if (inscription) {
      var id = inscription._id;
      var contact = Contact.findOne({
        userIdNow: sessionID,
        contact: id,
      });
      if (id != sessionID) {
        if (contact) {
          Session.set("contactID", id);
          Router.go('/message');
        } else {
          Session.set("newContactID", id);
          Router.go('/newContact');
        }
      }
    }
  },


  'click .goMessage': function() {
    var sessionID = Session.get("userID");
    var id = Contact.findOne({
      _id: this._id,
    });
    if (id) {
      Session.set("contactID", id.contact);
    };
  },

});
