(function(){Template.profil.rendered = function() {
  document.title = "Profil";
};


Template.profil.helpers({
  prenom: function() {
    var sessionID = LocalStore.get("userID");
    var find = Inscription.findOne({
      _id: sessionID,
    });

    if (find) {
      return find.prenom;
    }
  },
});

}).call(this);
