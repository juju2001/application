import {
  Meteor
} from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
});

Meteor.methods({
  insertInscription: function(data) {
    console.log(data);
    //retourne l'ID
    return Inscription.insert(data);
  },
});


Meteor.methods({
  connexion: function(data) {
    return Connexion.insert(data);
  },
});


Meteor.methods({
  message: function(data3) {
    return Message.insert(data3);
  },
});

Meteor.methods({
  newContact: function(data5) {
    return Contact.insert(data5);
  },
});

Meteor.methods({
  recherche: function(data) {
    return Recherche.insert(data);
  },
});

Meteor.methods({
  modifierSurnom: function(userIdNow, contact, newSurnom) {
    return Contact.update({
      userIdNow: userIdNow,
      contact: contact
    }, {
      $set: {
        surnom: newSurnom
      }
    });
  },
});

Meteor.methods({
  notification: function(sessionID, contactID) {
    return Message.update({
      idClient1: contactID,
      idClient2: sessionID,
      lu: "false",
    }, {
      $set: {
        lu: "true"
      }
    }, {
      multi: true
    });
  },
});

Meteor.methods({
  lastMessage: function(time, sessionID, contactID) {
    return Contact.update({
      contact: sessionID,
      userIdNow: contactID,
    }, {
      $set: {
        lastMessage: time,
      }
    });
  },
});

Meteor.methods({
  deco: function(sessionID) {
    return Inscription.update({
      _id: sessionID,
    }, {
      $set: {
        etat: "false",
      }
    }, {
      multi: true
    });
  },
});

Meteor.methods({
  heureDeco: function(sessionID, heureDeco) {
    return Connexion.update({
      userIdNow: sessionID,
    }, {
      $set: {
        deconnexion: heureDeco,
      }
    }, {
      multi: true
    });
  },
});

Meteor.methods({
  etat: function(userIdNow) {
    return Inscription.update({
      _id: userIdNow,
    }, {
      $set: {
        etat: "true",
      }
    }, {
      multi: true
    });
  },
});


Meteor.methods({
  dec0: function(userIdNow) {
    return Connexion.update({
      userIdNow: userIdNow,
    }, {
      $set: {
        deconnexion: 0,
      }
    }, {
      multi: true,
    });
  },
});

Meteor.methods({
  statut: function(statut, sessionID) {
    return Inscription.update({
      _id: sessionID,
    }, {
      $set: {
        statut: statut,
      }
    });
  },
});

Meteor.methods({
  supprimerContact: function(sessionID, contactID) {
    return Contact.remove({
      userIdNow: sessionID,
      contact: contactID,
    });
  },
});

Meteor.methods({
  supprimerMessage1: function(sessionID, contactID) {
    return Message.update({
        idClient1: sessionID,
        idClient2: contactID,
}, {
  $set : {
    luClient1 : "false",
  }
},{
        multi : true,
      });
  },
});

Meteor.methods({
  supprimerMessage2: function(sessionID, contactID) {
    return Message.update({
        idClient1: contactID,
        idClient2: sessionID,
}, {
  $set : {
    luClient2 : "false",
  }
},{
        multi : true,
      });
  },
});
