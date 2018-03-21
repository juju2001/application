(function(){Template.contact.rendered = function() {
  document.title = "Contact";
  var sessionID = LocalStore.get("userID");
  var find = Connexion.findOne({
    userIdNow: sessionID,
  });
  if (!sessionID || find && sessionID != find.userIdNow) {
    Router.go('/connexion');
  }
};


Template.contact.helpers({
  contacter: function() {
    var sessionID = LocalStore.get("userID");
    var last = Contact.find({
      userIdNow: sessionID,
    }).fetch();
    if (last) {
      return last;
    };
  }
});

Template.contact.events({
  'click .modifier': function(event) {
    event.preventDefault();
    event.stopPropagation();

    var id = Contact.findOne({
      _id: this._id,
    });
    var contactId = id.contact;
    if (contactId) {
      LocalStore.set("newContactID", contactId);
      Router.go('/modifier');
    }
    }
})

}).call(this);
