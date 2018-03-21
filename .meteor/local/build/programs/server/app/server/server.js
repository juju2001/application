(function(){import {
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
  notification: function(lu, sessionID, contactID) {
    return Contact.update({
      userIdNow: sessionID,
      contact: conatctID,
    }, {
      $set: {
        lu: lu
      }
    });
  },
});

}).call(this);
