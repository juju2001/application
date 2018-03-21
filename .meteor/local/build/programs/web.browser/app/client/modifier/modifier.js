(function(){Template.modifier.rendered = function() {
  document.title = "Modifier";
  var sessionID = LocalStore.get("userID");
  var find = Connexion.findOne({
    userIdNow: sessionID,
  });
  if (!sessionID && find != find.userIdNow) {
    Router.go('/connexion');
  }
};


Template.modifier.helpers({
  nom : function(){
    var newContact = Inscription.findOne({
      _id : LocalStore.get("newContactID"),
    });
    if(newContact){
      return newContact.nom;
    }
  },

prenom : function(){
  var newContact = Inscription.findOne({
    _id : LocalStore.get("newContactID"),
  });
  if(newContact){
    return newContact.prenom;
  }
},

age : function(){
  var newContact = Inscription.findOne({
    _id : LocalStore.get("newContactID"),
  });
  if(newContact){
    return newContact.age;
  }
},

pseudo : function(){
  var newContact = Inscription.findOne({
    _id : LocalStore.get("newContactID"),
  });
  if(newContact){
    return newContact.pseudo;
  }
},
email : function(){
  var newContact = Inscription.findOne({
    _id : LocalStore.get("newContactID"),
  });
  if(newContact){
    return newContact.email;
  }
},
});

Template.modifier.events({
  'submit form': function(event) {
    event.preventDefault();
    event.stopPropagation();
    var trouver = Inscription.findOne({
      _id: LocalStore.get("newContactID"),
    });
    if (trouver) {
        var newSurnom = event.target.surnom.value;
        var userIdNow = LocalStore.get("userID");
        var contact = LocalStore.get("newContactID");


        if(newSurnom){
          Meteor.call('modifierSurnom', userIdNow, contact, newSurnom, function() {})
          Router.go('/contact');
    //    LocalStore.set("newContactID", null);
      }
    }
  },
});

}).call(this);
