Template.connexion.rendered = function() {
  document.title = "Connexion";
};


Template.connexion.events({
  'click #envoyer': function(event) {
    event.preventDefault();
    event.stopPropagation();

    var pseudoConnexion = $('#pseudoConnexion').val();
    var passwordConnexion =$('#passwordConnexion').val();
    var controleUser = Inscription.findOne({
      pseudo: pseudoConnexion,
    });
    var userIdNow = controleUser._id;
    var now = new Date();
    if (controleUser) {
      if (controleUser.password != passwordConnexion) {
        alert("Le pseudo ou le mot de passe n'est pas juste !")
      } else {
        var pseudoInscription = Inscription.findOne({
          pseudo: pseudoConnexion,
        });
        if (pseudoInscription) {
          var alreadyConnexion = Connexion.findOne({
            userIdNow: pseudoInscription._id,
          });
          if (!alreadyConnexion) {
            Session.setPersistent("userID", userIdNow);
            var hash = {
              userIdNow: controleUser._id,
              hours: now.getTime(),
              etatSession : true,
              deconnexion: 0,
            };
            Meteor.call('connexion', hash);
            Meteor.call('etatCompte', userIdNow);
            Router.go('/accueil');
          } else {
            Session.setPersistent("userID", userIdNow);
            Meteor.call('dec0', userIdNow);
            Meteor.call('etatCompte', userIdNow);
            Meteor.call('etatSession', userIdNow);
            Router.go('/accueil');
          }
        }
      }
    }else{
      alert("Le psueudo ou le mot de passe n'est pas juste !");
    }
  },
});
