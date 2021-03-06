import {
  Meteor
} from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
});


Meteor.methods({

  connexion: function(data) {
    return Connexion.insert(data);
  },

  // Met à jour ton état à False quand tu te déconnecte
  deco: function(sessionID) {
    return Inscription.update({
      _id: sessionID,
    }, {
      $set: {
        etatCompte: false,
      }
    }, {
      multi: true
    });
  },

  // Met à jour ton heure de déconnexion à "0" lorsque tu te connectes
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

  // Met à jour pour j'ai vu la notification navbar
  discussionNotNoti: function(sessionID) {
    return Message.update({
      idClient2: sessionID,
      notification: true,
    }, {
      $set: {
        notification: false,
      }
    }, {
      multi: true,
    });
  },

  // Met à jour ton état à True quand tu te connectes
  etatCompte: function(userIdNow) {
    return Inscription.update({
      _id: userIdNow,
    }, {
      $set: {
        etatCompte: true,
      }
    }, {
      multi: true
    });
  },

  // Met à jour ton état à false quand tu quittes la page
  etatSession1: function(userIdNow) {
    return Connexion.update({
      userIdNow: userIdNow,
    }, {
      $set: {
        etatSession: false,
      }
    }, {
      multi: true,
    });
  },

  // Met à jour ton état à True quand tu te connectes
  etatSession2: function(userIdNow) {
    return Connexion.update({
      userIdNow: userIdNow,
    }, {
      $set: {
        etatSession: true,
      }
    }, {
      multi: true
    });
  },

  // Affiche l'heure à laquelle tu te déconnectes
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

  // Ajouter l'inscription dans la MongoDB
  insertInscription: function(data) {
    //retourne l'ID
    return Inscription.insert(data);
  },

  // Retourne les discussion par ordre du message le plus récent au plus vieux (page discussion)
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

  // Retourne les discussion par ordre du message le plus récent au plus vieux (page discussion)
  lastMessage2: function(time, sessionID, contactID) {
    return Contact.update({
      contact: contactID,
      userIdNow: sessionID,
    }, {
      $set: {
        lastMessage: time,
      }
    });
  },

  // Enregistre le message dans la MongoDB
  message: function(data3) {
    return Message.insert(data3);
  },

  // Ajoute le nouveau contact dans la MongoDB
  newContact: function(data5) {
    return Contact.insert(data5);
  },

  // Met à jour pour dire que j'ai lu le message et qu'il n'ait plus le signe de la notification
  notification: function(sessionID, contactID) {
    return Message.update({
      idClient1: contactID,
      idClient2: sessionID,
      lu: false,
    }, {
      $set: {
        lu: true
      }
    }, {
      multi: true
    });
  },

  // Supprime ton ami quand tu le veux
  supprimerContact: function(sessionID, contactID) {
    return Contact.remove({
      userIdNow: sessionID,
      contact: contactID,
    });
  },

  // Supprime ta discussion mais l'autre utilisateur peut toujours la lire
  discussionSupprimerMessage1: function(sessionID, contactID) {
    return Message.update({
      idClient1: sessionID,
      idClient2: contactID,
    }, {
      $set: {
        luClient1: false,
      }
    }, {
      multi: true,
    });
  },

  // Supprime ta discussion mais l'autre utilisateur peut toujours la lire
  discussionSupprimerMessage2: function(sessionID, contactID) {
    return Message.update({
      idClient1: contactID,
      idClient2: sessionID,
    }, {
      $set: {
        luClient2: false,
      }
    }, {
      multi: true,
    });
  },

});
