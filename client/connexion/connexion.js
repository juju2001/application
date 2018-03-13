Template.connexion.rendered = function() {
  document.title = "Connexion";
};


Template.connexion.events({
  'submit form': function(event) {
    event.preventDefault();
    event.stopPropagation();

    var pseudo_connexion = event.target.pseudo_connexion.value;
    var password_connexion = event.target.password_connexion.value;
    var controle_user = Inscription.findOne({
      pseudo: pseudo_connexion,
    });
    var userIdNow = controle_user._id;
    var now = new Date();
    if (controle_user) {
      if (controle_user.password != password_connexion) {
        alert("Le mot de passe n'est pas juste !")
      } else {
        var pseudoInscription = Inscription.findOne({
          pseudo: pseudo_connexion,
        });
        if (pseudoInscription) {
          var alreadyConnexion = Connexion.findOne({
            userIdNow: pseudoInscription._id,
          });
          if (!alreadyConnexion) {
            LocalStore.set("userID", userIdNow);
            var hash = {
              userIdNow: controle_user._id,
              hours: now.getTime(),
              deconnexion: 0,
            };
            Meteor.call('connexion', hash, function(data) {
              if (LocalStore.get("userID")) {
                event.preventDefault();
              }
            });
          } else {
            LocalStore.set("userID", userIdNow);
            Meteor.call('dec0', userIdNow);
            Meteor.call('etat', userIdNow,function(data) {
              if (LocalStore.get("userID")) {
                event.preventDefault();
              }
            });
          }
        }
        Router.go('/accueil');
      }
    } else {
      alert("Le pseudo n'est pas juste !");
    }
  },
});
