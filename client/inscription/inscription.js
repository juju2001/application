Template.inscription.rendered = function() {
  document.title = "Insciption";
};

Template.inscription.events({
  'click #inscription': function(event) {
    event.preventDefault();
    event.stopPropagation();
    var mdp1 = event.target.mdp1.value;
    var mdp2 = event.target.mdp2.value;
    var pseudo = event.target.pseudo.value;
    var pseudoDb = Inscription.findOne({
      pseudo: pseudo,
    });
    var age= $("#age").val();
    var nouveau = new Date(age);
    var auj = new Date();
    if (mdp1 == mdp2) {
      if (mdp1.length > 3) {
        if (!pseudoDb) {
          if (nouveau.getFullYear() < auj.getFullYear()  && nouveau.getFullYear() < auj.getFullYear()-14 ) {
            alert("Merci de l'inscription !");
            var hash = {
              nom: event.target.name.value,
              prenom: event.target.prenom.value,
              date: event.target.age.value,
              age : auj.getFullYear() - nouveau.getFullYear(),
              email: event.target.email.value,
              pseudo: event.target.pseudo.value,
              password: event.target.mdp1.value,
              etat: false,
              statut: ""
            };
            Meteor.call('insertInscription', hash, function(error, result) {
              if (result) {
                Router.go('/connexion');
              }
              if (error) {
                console.log(error);
              }
            });
          }else{
            alert("Date invalide !");
          }
        } else {
          alert("Le pseudo que vous avez choisi est déjà utilisé !");
        }
      } else {
        alert("Votre mot de passe est trop court !");
      };

    } else {
      alert("Vos mots de passe ne sont pas identiques ! ");
    }
  }
});
