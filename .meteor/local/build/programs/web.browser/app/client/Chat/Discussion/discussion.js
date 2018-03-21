(function(){Template.discussion.rendered = function() {
  document.title = "Actualité de vos discussions";
  var sessionID = LocalStore.get("userID");
  var find = Connexion.findOne({
    userIdNow: sessionID,
  });
  if (!sessionID || sessionID != find.userIdNow) {
    Router.go('/connexion');
  }
};

Template.discussion.helpers({
  discussion: function() {
    var sessionID = LocalStore.get("userID");
    var last = Contact.find({
      userIdNow: sessionID,
    }).fetch();
    if (last) {
      return last;
    };
  },
});

Template.discussion.events({
  'click .goDiscu': function(event) {
    event.preventDefault();
    event.stopPropagation();
    var id = Contact.findOne({
      _id: this._id,
    });
    var contactId = id.contact;
    if (contactId) {
      LocalStore.set("contactID", contactId);
      Router.go('/message');
    };
  },
});

}).call(this);
