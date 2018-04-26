Template.accueil.rendered = function() {
  document.title = "Accueil";

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
};


Template.accueil.helpers({

// Prénom de la presnne connecté
  prenomAccueil: function() {
    var sessionID = Session.get("userID");
    var find = Inscription.findOne({
      _id: sessionID,
    });

    if (find) {
      return find.prenom;
    }
  },

// Affiche la phrase qui dit quels amis sont en ligne
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

// Affiche la phrase pour ajouter des amis
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

// D'autres utilisateurs que l'on pourrait ajouter
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

// Les amis qui sont en ligne
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

// Retourn les inscriptions trouvés avec le mot de recherche
  inscriptionFind: function() {
    var infoRecherche = Session.get("infoRecherche");
    var sessionID = Session.get("userID");
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

    if (inscriptionFind) {
      return inscriptionFind;
    }
    return Session.get("inscriptionFind");
  },

// Retourn les messsage trouvés avec le mot de recherche
  messageFind: function() {
    var infoRecherche = Session.get("infoRecherche");
    var sessionID = Session.get("userID");
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

    if (messageFind) {
      return messageFind;
    } else {
      return Session.get("messageFind");
    }
  },

// Affiche le mot Recherche dans la page
  Motrecherche: function() {
    var rech = Session.get("rech");
    if (rech == "rech") {
      return "Recherche";
    }
  },

// Affiche le nom de l'auteur du message lors de la  recherche
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

// Affiche l'auteur du message lors de la recherche
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
        return "Moi à " + inscription.nom + " " + inscription.prenom;
      }
    }
  },

// Affiche l'heure du message trouvé dans la recherche
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

// Clique pour ajouter un nouveau contact
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

// clique pour ajouter un nouveau contact depuis la recherche
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
    var id = Message.findOne({
      _id: this._id,
    });
    if (id) {
      if (sessionID == id.idClient1) {
        Session.set("contactID", id.idClient2);
        Router.go('/message');
      }else{
        Session.set("contactID", id.idClient1);
        Router.go('/message');
      }
    }
  },

// Allez à la discussion depuis un message lors d'une recherche
  'click #goRecherche': function(event) {
    event.preventDefault();
    event.stopPropagation();
    var infoRecherche = $("#recherche").val();
    var sessionID = Session.get("userID");
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

    Session.setPersistent('inscriptionFind', inscriptionFind);
    Session.setPersistent('messageFind', messageFind);
    $("#recherche").val('');
  },

// Remet à 0 les variable de recherche quand on change de page depuis la navbar
  'click ul': function() {
    Session.set("inscriptionFind", null);
    Session.set("messageFind", null);
    Session.set("rech", null);
    Session.set("infoRecherche", null);
  },

});
