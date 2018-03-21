(function(){Template.newContact.rendered = function() {
  document.title = "Nouveau contact";
  var sessionID = LocalStore.get("userID");
  var find = Connexion.findOne({
    userIdNow: sessionID,
  });
  if (!sessionID || sessionID != find.userIdNow) {
    Router.go('/connexion');
  }
};


Template.newContact.helpers({
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

Template.newContact.events({
  'submit form': function(event) {
    event.preventDefault();
    event.stopPropagation();
    var trouver = Inscription.findOne({
      _id: LocalStore.get("newContactID"),
    });
    if (trouver) {
        var nom = trouver.nom;
        var prenom = trouver.prenom;
        var pseudo = trouver.pseudo;
        var age = trouver.age;
        var email = trouver.email;
        var surnom = event.target.surnom.value;
        var now = new Date();
        var hash5 = {
          userIdNow: LocalStore.get("userID"),
          nom: nom,
          prenom: prenom,
          age: age,
          email: email,
          pseudo: pseudo,
          surnom: surnom,
          contact: LocalStore.get("newContactID"),
          hours: now.getTime(),
        };
        Meteor.call('newContact', hash5)
        Router.go('/contact');
                LocalStore.set("newContactID", null);
      }
  },
});

}).call(this);
