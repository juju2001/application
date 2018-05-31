Template.LayoutDefault.rendered = function() {
  document.title = "LayoutDefault";
};

Template.LayoutDefault.events({
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
            var hours = new Date();
            if (!alreadyConnexion) {
              Meteor.call('deco', Session.get("userID"));
              Meteor.call('etatSession1', Session.get("userID"));
              if (Session.get("userID")) {
                Session.get('userID', controleUser._id);
                console.log("hello1");
              } else {
                Session.setPersistent('userID',controleUser._id);
                console.log("hello2");
              }
              var hash = {
                userIdNow: controleUser._id,
                hours: now.getTime(),
                etatSession: true,
                deconnexion: 0,
              };
              Meteor.call('connexion', hash);
              Meteor.call('etatCompte', Session.get("userID"));
              Meteor.call('etatSession2', Session.get("userID"));
              Router.go('/accueil');
            } else {
              Meteor.call('etatSession1', Session.get("userID"));
              Meteor.call('deco', Session.get("userID"));
              Meteor.call('etatSession1', Session.get("userID"));
              if (Session.get("userID")) {
                Session.get('userID', controleUser._id);
                console.log("Salut1");
              } else {
                Session.setPersistent("userID", controleUser._id);
                console.log("Salut2");
              }
              Meteor.call('dec0', Session.get("userID"));
              Meteor.call('etatCompte', Session.get("userID"));
              Meteor.call('etatSession2', Session.get("userID"));
              Router.go('/accueil');
            }
          }
        }
      } else {
        alert("Le psueudo ou le mot de passe n'est pas juste !");
      }
    }
  },
});
