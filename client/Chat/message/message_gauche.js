Template.messageGauche.helpers({
  // Retourne les discussions
  discussion: function() {
    var sessionID = Session.get("userID");
    var contact = Contact.find({
      userIdNow: sessionID,
    }, {
      sort: {
        lastMessage: -1
      }
    });
    if (contact) {
      return contact;
    }
  },

  // Retourne le dernier message avec le contact dans la liste des discussions
  lastMessageAnthonerDiscussion: function() {
    var sessionID = Session.get("userID");
    var contact = Contact.findOne({
      _id: this._id,
    });
    var contactID = contact.contact;
    var lastMessage = Message.findOne({
      $or: [{
        idClient1: sessionID,
        idClient2: contactID,
        luClient1: true,
      }, {
        idClient1: contactID,
        idClient2: sessionID,
        luClient2: true,
      }],
    }, {
      sort: {
        hours: -1,
      },
    });
    if (lastMessage) {
      return lastMessage.message;
    }
  },

  // Index active class autreDiscussion
  messageAnotherDiscussionActiveClass: function(index) {
    var sessionID = Session.get("userID");
    var contactID = Session.get("contactID");
    var contacts = Contact.find({
      userIdNow: sessionID,
    }).fetch();

    var contact = this.contact;

    if (contactID === contact) {
      return 'bg-discussion'; // 'bg-secondary';
    }
  },

  // Vu dans les autres discussions
  messageAnothersDiscussionGlyphiconColor: function() {
    var sessionID = Session.get("userID");
    var contactID = this.contact;
    var lastMessage = Message.findOne({
      $or: [{
        idClient1: sessionID,
        idClient2: contactID,
      }, {
        idClient1: contactID,
        idClient2: sessionID,
      }],
    }, {
      sort: {
        hours: -1
      }
    });
    if (lastMessage) {
      if (lastMessage.idClient1 == sessionID) {
        if (lastMessage.lu == false) {
          return "colorGray" + " " + "glyphicon glyphicon-ok" + " " + "discussionOK";
        } else {
          return "colorBlue" + " " + "glyphicon glyphicon-ok" + " " + "discussionOK";
        }
      }
    }
  },

  // Affiche la notification dans la liste des discussions
  notificationAnthonerDiscussion: function() {
    var sessionID = Session.get("userID");
    var id = Contact.findOne({
      _id: this._id,
    });
    var notification = Message.findOne({
      idClient1: id.contact,
      idClient2: sessionID,
      lu: false,
    });
    if (notification) {
      return notification;
    }
  },

  // Affiche les recherches dans la liste des discussion
  recherche: function() {
    var recherche = Session.get("recherche");
    if (recherche != null && recherche != '') {
      var mongo = Contact.find({
        userIdNow: Session.get("userID"),
      }).fetch();
      var ids = _.pluck(mongo, 'contact');
      var connecter = Inscription.find({
        $or: [{
          prenom: {
            $regex: recherche,
          },
          _id: {
            $in: ids,
          },
        }, {
          nom: {
            $regex: recherche,
          },
          _id: {
            $in: ids,
          },
        }],
      }).fetch();
      if (connecter) {
        return connecter;
      }
    }
  },

})

Template.messageGauche.events({

  // Rejoind la discussion depuis une recherche dans la liste de contact
  'click .goDiscutionRecherche': function(event) {
    Session.set("recherche", null);
    event.preventDefault();
    event.stopPropagation();
    var contactId = this._id;
    if (contactId) {
      Session.set("contactID", contactId);
      Router.go('/message');
    };
    $('#messages').val('');
    setTimeout(function() {
      var x = document.getElementById("enbas");
      x.scrollTop = x.scrollHeight;
    }, 300);
  },

  'click ul': function() {
    Session.set("recherche", null);
    $('#messages').val('');
  },

  // Rejoind une discussion depuis la liste des contacts
  'click .goDiscussionSecondaire': function(event) {
    Session.set("recherche", null);
    event.preventDefault();
    event.stopPropagation();
    var id = Contact.findOne({
      _id: this._id,
    });
    var contactId = id.contact;
    if (contactId) {
      Session.set("contactID", contactId);
      Router.go('/message');
    };
    var noFriendId = Inscription.findOne({
      _id: this._id,
    });
    if (noFriendId) {
      Session.set("contactID", noFriendId._id)
    }
    $('#messages').val('');
    setTimeout(function() {
      var x = document.getElementById("enbas");
      x.scrollTop = x.scrollHeight;
    }, 300);
  },

});
