Template.deconnexion.rendered = function(){
      document.title = "Déconnexion";
      if(confirm("Tu veux te déconnecter")){
        var sessionID = LocalStore.get("userID");
        var heure = new Date();
        var heureDeco = heure.getTime();
        Meteor.call('deco', sessionID);
        Meteor.call('heureDeco', sessionID, heureDeco);
        LocalStore.set("userID", null);
        if (LocalStore.get("userID") == null) {
          Router.go('/connexion');
        };
      }else{
        Router.go('/accueil');
      }
    };
