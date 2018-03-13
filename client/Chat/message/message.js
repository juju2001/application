Template.message.rendered = function() {
  document.title = "Message";
  var sessionID = LocalStore.get("userID");
  var find = Connexion.findOne({
    userIdNow: sessionID,
  });
  if (!sessionID || find && sessionID != find.userIdNow) {
    Router.go('/connexion');
  }
};


Template.message.helpers({
  messages: function() {
    var sessionID = LocalStore.get("userID");
    var contactID = LocalStore.get("contactID");
    Meteor.call('notification', sessionID, contactID);
    return Message.find({
      $or: [{
        idClient1: sessionID,
        idClient2: contactID,
      }, {
        idClient1: contactID,
        idClient2: sessionID,
      }],
    }, {
      sort: {
        hours: 1,
      },
    }).fetch();
  },

  color: function() {
    if (this.idClient1 === LocalStore.get("userID")) {
      return 'text-success text-right';
    }
    return 'text-danger text-left ';
  },

  infoPerso: function() {
    var sessionID = LocalStore.get("userID");
    var contactID = LocalStore.get("contactID");
    var infoPersonne = Contact.find({
      userIdNow: sessionID,
      contact: contactID,
    });
    return infoPersonne;
  },

  lastConnexion: function() {
    var contactID = LocalStore.get("contactID");
    var sessionID = LocalStore.get("sessionID");
    var deco = Connexion.findOne({
      userIdNow: contactID,
    });
    if(deco.deconnexion != 0){
      var deconnexion = deco.deconnexion;
      var date = new Date(deconnexion);
      var day = date.getDate();
      var month = date.getMonth()+1;
      var year = date.getFullYear();
      var hours = date.getHours();
      var minutes =  date.getMinutes();
      var final = "Hors ligne depuis "+day+"/"+month+"/"+year+"  "+hours +":"+minutes;
      return final ;
    }else{
      return "En ligne";
    }
  },

  couleur: function(){
    var contactID = LocalStore.get("contactID");
    var sessionID = LocalStore.get("sessionID");
    var deco = Connexion.findOne({
      userIdNow: contactID,
    });
    if(deco.deconnexion == 0){
      return 'text-success'
    }else{
      return 'text-danger'
    }
  },

  statut : function(){
    var contactID = LocalStore.get("contactID");
    var statut = Inscription.findOne({
      _id : contactID,
    });
    if(statut){
      return statut.statut;
    }
  }

});


Template.message.events({
  'submit form': function(event) {
    event.preventDefault();
    event.stopPropagation();
    var sessionID = LocalStore.get("userID");
    var contactID = LocalStore.get("contactID");
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
        lu: "false",
        hours: now.getTime(),
      };
      var time = now.getTime();
      Meteor.call('message', hash3, function(data3) {});
      Meteor.call('lastMessage', time, sessionID, contactID);
      $('#messages').val('');
    }
  },
});
