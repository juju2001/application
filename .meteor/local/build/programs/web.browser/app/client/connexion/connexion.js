(function(){Template.connexion.rendered = function() {
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
        LocalStore.set("userID", userIdNow);
        var prenom = controle_user.prenom;
        var hash2 = {
          userIdNow: controle_user._id,
          hours: now.getTime(),
        };
        Meteor.call('connexion', hash2, function(data) {
          if (LocalStore.get("userID")) {
            event.preventDefault();
          }
        });
        Router.go('/accueil');
      }
    } else {
      alert("Le pseudo n'est pas juste !");
    }
  },
});

}).call(this);
