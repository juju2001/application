Template.modifier.rendered = function() {
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
      _id : LocalStore.get("contactID"),
    });
    if(newContact){
      return newContact.nom;
    }
  },

prenom : function(){
  var newContact = Inscription.findOne({
    _id : LocalStore.get("contactID"),
  });
  if(newContact){
    return newContact.prenom;
  }
},

age : function(){
  var newContact = Inscription.findOne({
    _id : LocalStore.get("contactID"),
  });
  if(newContact){
    return newContact.age;
  }
},

pseudo : function(){
  var newContact = Inscription.findOne({
    _id : LocalStore.get("contactID"),
  });
  if(newContact){
    return newContact.pseudo;
  }
},
email : function(){
  var newContact = Inscription.findOne({
    _id : LocalStore.get("contactID"),
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
      _id: LocalStore.get("contactID"),
    });
    if (trouver) {
        var newSurnom = event.target.surnom.value;
        var userIdNow = LocalStore.get("userID");
        var contact = LocalStore.get("contactID");


        if(newSurnom){
          Meteor.call('modifierSurnom', userIdNow, contact, newSurnom, function() {});
          Router.go('/contact');
          LocalStore.set("contactID", null);
      }
    }
  },

  'click #supprimer' : function() {
    var sessionID = LocalStore.get("userID");
    var contactID = LocalStore.get("contactID");
    if(confirm("Etes-vous sûr de vouloir supprimer ce contact")){
      Meteor.call('supprimerContact', sessionID, contactID, function() {
        Meteor.call('supprimerMessage1', sessionID, contactID, function() {
          Meteor.call('supprimerMessage2', sessionID, contactID, function() {
          alert("Contact supprimé !");
          Router.go('/contact');
        });
        });
      });
    }else{
      Router.go('/modifier');
    }
  },
});
