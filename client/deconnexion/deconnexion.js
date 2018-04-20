Template.deconnexion.rendered = function() {
  document.title = "Déconnexion";
  if (Session.get("userID") == null) {
    Router.go('/connexion');
  }
  var sessionID = Session.get("userID");
  var find = Connexion.findOne({
    userIdNow: sessionID,
  });
  if (!sessionID && sessionID != find.userIdNow) {
    Router.go('/connexion');
  }else{
  if (confirm("Tu veux te déconnecter")) {
    var sessionID = Session.get("userID");
    var heure = new Date();
    var heureDeco = heure.getTime();
    Meteor.call('deco', sessionID);
    Meteor.call('heureDeco', sessionID, heureDeco);
    Session.set("userID", null);
    if (Session.get("userID") == null) {
      Router.go('/connexion');
    };
  } else {
    Router.go('/accueil');
  }
}
};
