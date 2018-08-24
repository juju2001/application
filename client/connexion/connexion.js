Template.connexion.rendered = function() {
  document.title = "Connexion";
};

Template.connexion.events({

  'click #showPassword': function() {
    var x = document.getElementById("passwordConnexion");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  },

  'submit form': function(event) {
    event.preventDefault();
    event.stopPropagation();
    var pseudoConnexion = $('#pseudoConnexion').val();
    var passwordConnexion = $('#passwordConnexion').val();
    var controleUser = Inscription.findOne({
      pseudo: pseudoConnexion,
    });
    if (controleUser) {
      var userIdNow = controleUser._id;
      var now = new Date();
      if (controleUser.password != passwordConnexion) {
        alert("Le pseudo ou le mot de passe n'est pas juste !")
      } else {
        if (controleUser) {
          var alreadyConnexion = Connexion.findOne({
            userIdNow: controleUser._id,
          });
          var hours = new Date();
          if (!alreadyConnexion) {
            Meteor.call('deco', Session.get("userID"));
            Meteor.call('etatSession1', Session.get("userID"));
            var hash = {
              userIdNow: userIdNow,
              hours: now.getTime(),
              etatSession: true,
              deconnexion: 0,
            };
            Session.setPersistent('userID', userIdNow);
            Meteor.call('connexion', hash);
            Meteor.call('etatCompte', userIdNow);
            Router.go('/accueil');
          } else {
            Meteor.call('etatSession1', Session.get("userID"));
            Meteor.call('deco', Session.get("userID"));
            Session.setPersistent('userID', userIdNow);
            Meteor.call('dec0', userIdNow);
            Meteor.call('etatCompte', userIdNow);
            Router.go('/accueil');
          }
        }
      }
    } else {
      alert("Le psueudo ou le mot de passe n'est pas juste !");
    }
  },

});
