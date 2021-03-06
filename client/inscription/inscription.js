Template.inscription.rendered = function() {
  document.title = "Insciption";
};

Template.inscription.events({

  'click #showPassword1': function() {
    event.preventDefault();
    event.stopPropagation();
    var x = document.getElementById("mdp1");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  },

  'click #showPassword2': function() {
    event.preventDefault();
    event.stopPropagation();
    var x = document.getElementById("mdp2");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  },

  'submit form': function(event) {
    event.preventDefault();
    event.stopPropagation();
    var mdp1 = $('#mdp1').val();
    var mdp2 = $('#mdp2').val();
    var pseudo = $('#pseudo').val();
    if (pseudo.length > 5) {
      var pseudoDb = Inscription.findOne({
        pseudo: pseudo,
      });
      var age = $("#age").val();
      var nouveau = new Date(age);
      var auj = new Date();
      if (mdp1 == mdp2) {
        if (mdp1.length > 3) {
          if (!pseudoDb) {
            if (nouveau.getFullYear() < auj.getFullYear() && nouveau.getFullYear() < auj.getFullYear() - 14) {
              var hash = {
                nom: $('#name').val(),
                prenom: $('#prenom').val(),
                date: $('#age').val(),
                age: auj.getFullYear() - nouveau.getFullYear(),
                email: $('#email').val(),
                pseudo: $('#pseudo').val(),
                password: $('#mdp1').val(),
                etatCompte: false,
                statut: ""
              };
              Meteor.call('insertInscription', hash, function(error, result) {
                alert("Merci de l'inscription !");
                Router.go('/connexion');
              });
            } else {
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
    } else {
      alert("Le pseudo est trop court !")
    }
  },

});
