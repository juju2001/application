(function(){Template.deconnexion.rendered = function(){
      document.title = "Déconnexion";
      if(confirm("Tu veux te déconnecter")){
        LocalStore.set("userID", null);
        if (LocalStore.get("userID") == null) {
          Router.go('/connexion');
        };
      }else{
        Router.go('/accueil');
      }
    };

}).call(this);
