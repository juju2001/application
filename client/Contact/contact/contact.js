Template.contact.rendered = function() {
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
  },

  anni: function() {
    var sessionID = LocalStore.get("userID");
    var id = Contact.findOne({
      _id : this._id,
    });
    if(id) {
      var contactID = id.contact;
      var last = Inscription.findOne({
        _id: contactID,
      });
      if (last) {
        var date = last.date;
        var birthday = new Date(date);
        var nouveau = new Date();
        var age =new Number(nouveau.getTime() - birthday.getTime()) / 31557600000;
        return Math.floor(age);
      };
    }
  },
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
      LocalStore.set("contactID", contactId);
      Router.go('/modifier');
    }
  }
})
