Template.inscription.rendered = function() {
  document.title = "Insciption";
};

Template.inscription.events({
  'submit form': function(event) {
    event.preventDefault();
    event.stopPropagation();
    var mdp1 = event.target.mdp1.value;
    var mdp2 = event.target.mdp2.value;
    var pseudo = event.target.pseudo.value;
    var pseudoDb = Inscription.findOne({
      pseudo: pseudo,
    });
    if (mdp1 == mdp2) {
      if (mdp1.length > 3) {
        if (!pseudoDb) {
          alert("Merci de l'inscription !");
          var hash = {
            nom       :  event.target.name.value,
            prenom    :  event.target.prenom.value,
            age       :  event.target.age.value,
            email     :  event.target.email.value,
            pseudo    :  event.target.pseudo.value,
            password  :  event.target.mdp1.value,
            etat      :  "false",
            statut    :  ""
          };
          Meteor.call('insertInscription', hash, function(error, result) {
            if (result) {
              Router.go('/connexion');
            }
            if (error) {
              console.log(error);
            }
          });
           }
         else {
          alert("Le pseudo que vous avez choisi est déjà utilisé !");
         }
        }
       else {
        alert("Votre mot de passe est trop court !");
      };

    }
     else {
      alert("Vos mots de passe ne sont pas identiques ! ");
    }
  }
});
