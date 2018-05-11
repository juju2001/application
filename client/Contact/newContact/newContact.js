Template.newContact.rendered = function() {
  document.title = "Nouveau contact";
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

  Tracker.autorun(function () {
    var sessionID = Session.get("userID");

    var user = Inscription.findOne({
      _id: sessionID,
      etatCompte: false,
    });
    if (user) {
      Router.go('/connexion');
    }
  });
};


Template.newContact.helpers({
  nom : function(){
    var newContact = Inscription.findOne({
      _id : Session.get("newContactID"),
    });
    if(newContact){
      return newContact.nom;
    }
  },

prenom : function(){
  var newContact = Inscription.findOne({
    _id : Session.get("newContactID"),
  });
  if(newContact){
    return newContact.prenom;
  }
},

age : function(){
  var newContact = Inscription.findOne({
    _id : Session.get("newContactID"),
  });
  if(newContact){
    var date = newContact.date;
    var birthday = new Date(date);
    var nouveau = new Date();
    var age =new Number(nouveau.getTime() - birthday.getTime()) / 31557600000;
    return Math.floor(age);
  }
},

pseudo : function(){
  var newContact = Inscription.findOne({
    _id : Session.get("newContactID"),
  });
  if(newContact){
    return newContact.pseudo;
  }
},
email : function(){
  var newContact = Inscription.findOne({
    _id : Session.get("newContactID"),
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
      _id: Session.get("newContactID"),
    });
    if (trouver) {
        var nom = trouver.nom;
        var prenom = trouver.prenom;
        var pseudo = trouver.pseudo;
        var age = trouver.age;
        var date = trouver.date;
        var email = trouver.email;
        var now = new Date();
        var hash5 = {
          userIdNow: Session.get("userID"),
          nom: nom,
          prenom: prenom,
          age: age,
          date : date,
          email: email,
          pseudo: pseudo,
          contact: Session.get("newContactID"),
          hours: now.getTime(),
          lastMessage : 0,
        };
        Meteor.call('newContact', hash5)
        Router.go('/contact');
                Session.set("newContactID", null);
      }
  },
});
