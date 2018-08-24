Template.accueil.rendered = function() {
  document.title = "Accueil";

  var sessionID = Session.get("userID");
  var find = Connexion.findOne({
    userIdNow: sessionID,
  });
  if (!sessionID && sessionID != find.userIdNow || sessionID == null) {
    Router.go('/connexion');
  }
};


Template.accueil.helpers({

  // D'autres utilisateurs que l'on pourrait ajouter
  anotherUsers: function() {
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

  // return les inscriptions trouvés avec le mot de recherche
  findInscription: function() {
    var infoRecherche = Session.get("infoRecherche");
    var sessionID = Session.get("userID");
    var findInscription = Inscription.find({
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

    if (findInscription) {
      return findInscription;
    }
    return Session.get("findInscription");
  },

  // return les messsage trouvés avec le mot de recherche
  findMessage: function() {
    var infoRecherche = Session.get("infoRecherche");
    var sessionID = Session.get("userID");
    var findMessage = Message.find({
      $or: [{
        idClient1: sessionID,
      }, {
        idClient2: sessionID,
      }],
      message: {
        $regex: infoRecherche,
      },
    }).fetch();

    if (findMessage) {
      return findMessage;
    } else {
      return Session.get("findMessage");
    }
  },

  // Les amis qui sont en ligne
  friendsOnline: function() {
    var sessionID = Session.get("userID");
    var contacts = Connexion.find({
      etatSession: true,
    }).fetch();
    var ids = _.pluck(contacts, 'userIdNow');
    ids.push(sessionID);
    return Contact.find({
      contact: {
        $in: ids,
      },
      userIdNow: sessionID,
    }).fetch();
  },

  // Affiche le mot Recherche dans la page
  Motrecherche: function() {
    var rech = Session.get("rech");
    if (rech == "rech") {
      return "Recherche";
    }
  },

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

  // Affiche l'auteur du message lors de la recherche
  rechercheMessageAuthor: function() {
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
        return info.nom + " " + info.prenom + " à Moi";
      } else {
        info = Inscription.findOne({
          _id: id.idClient2,
        });
        return "Moi à " + inscription.nom + " " + inscription.prenom;
      }
    }
  },

  // Affiche l'heure du message trouvé dans la recherche
  rechercheMessageHours: function() {
    var sessionID = Session.get("userID");
    var id = Message.findOne({
      _id: this._id,
    });
    if (id) {
      var time = id.hours;
      var date = new Date(time);
      var minutes = date.getMinutes();
      var hours = date.getHours();
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      if (hours < 10) {
        hours = "0" + hours;
      }
      return hours + ":" + minutes + " " + date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
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
      $('#modalNewContact').modal('show');
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
      } else {
        Session.set("contactID", id.idClient1);
        Router.go('/message');
      }
    }
  },

  // Allez à la discussion depuis un message lors d'une recherche
  'click #goRecherche': function() {
    event.preventDefault();
    event.stopPropagation();
    var infoRecherche = $("#defaultRecherche").val();
    console.log(infoRecherche);
    var sessionID = Session.get("userID");
    var findInscription = Inscription.find({
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

    var findMessage = Message.find({
      $or: [{
        idClient1: sessionID,
      }, {
        idClient2: sessionID,
      }],
      message: {
        $regex: infoRecherche,
      },
    }).fetch();

    if (findMessage || findInscription) {
      Session.set('rech', "rech");
    }

    Session.setPersistent('findInscription', findInscription);
    Session.setPersistent('findMessage', findMessage);
    $("#defaultRecherche").val('');
  },

  // Remet à 0 les variable de recherche quand on change de page depuis la navbar
  'click ul': function() {
    Session.set("findInscription", null);
    Session.set("findMessage", null);
    Session.set("rech", null);
    Session.set("infoRecherche", null);
  },

});
