var require = meteorInstall({"client":{"Chat":{"Discussion":{"template.discussion.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/Chat/Discussion/template.discussion.js                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //

Template.__checkName("discussion");
Template["discussion"] = new Template("Template.discussion", (function() {
  var view = this;
  return [ HTML.Raw('<meta name="viewport" content="width=device-width, initial-scale=1">\n  '), HTML.DIV({
    class: "container"
  }, "\n    ", HTML.DIV({
    class: "form-group"
  }, "\n       ", Spacebars.include(view.lookupTemplate("default")), "\n       ", HTML.DIV({
    class: "col-lg-12 col-md-12 col-sm-12"
  }, "\n          ", HTML.DIV({
    class: "panel panel-default"
  }, "\n            ", HTML.Raw('<div class="panel-heading">\n              <div class="panel-title">\n                <h3 id="discussionTitle">Discussion</h3>\n              </div>\n              </div>'), "\n              ", HTML.DIV({
    class: "discussion-max-height"
  }, "\n                ", HTML.TABLE("\n                  ", Blaze.Each(function() {
    return Spacebars.call(view.lookup("noFriend"));
  }, function() {
    return [ "\n                  ", HTML.Comment(" Affiche un message reçu de quelqu'un avec qui on est pas ami "), "\n                  ", HTML.TR({
      class: "discussionNoFriend"
    }, "\n                    ", HTML.TD(HTML.A({
      href: "message",
      class: "goNewDiscu discussionColor223966",
      id: function() {
        return Spacebars.mustache(view.lookup("_id"));
      }
    }, Blaze.View("lookup:nom", function() {
      return Spacebars.mustache(view.lookup("nom"));
    }), " ", Blaze.View("lookup:prenom", function() {
      return Spacebars.mustache(view.lookup("prenom"));
    }))), "\n                    ", HTML.TD("Nouvelle discussion"), "\n                    ", HTML.TD(), "\n                    ", HTML.TD({
      class: "discussionDevDelete"
    }, HTML.A({
      class: "discussionRed",
      id: "suppNoFriend",
      href: ""
    }, "Supprimer")), "\n                  "), "\n                  " ];
  }), "\n                  ", Blaze.Each(function() {
    return Spacebars.call(view.lookup("discussion"));
  }, function() {
    return [ "\n                  ", HTML.Comment(" Affiche les discussions "), "\n                  ", HTML.TR({
      class: "discussionEach"
    }, "\n                    ", HTML.TD(HTML.A({
      href: "message",
      class: "goDiscu discussionColor223966",
      id: function() {
        return Spacebars.mustache(view.lookup("contact"));
      }
    }, Blaze.View("lookup:nom", function() {
      return Spacebars.mustache(view.lookup("nom"));
    }), " ", Blaze.View("lookup:prenom", function() {
      return Spacebars.mustache(view.lookup("prenom"));
    }))), "\n                    ", HTML.TD(" ", Blaze.If(function() {
      return Spacebars.call(view.lookup("notification"));
    }, function() {
      return [ "\n                      ", HTML.DIV({
        class: "discussionNotificationRond"
      }), "\n                      " ];
    }), "\n                    "), "\n                    ", HTML.TD({
      id: "infos",
      class: function() {
        return [ Spacebars.mustache(view.lookup("couleur")), " text-center" ];
      }
    }, "\n                      ", Blaze.View("lookup:lastConnexion", function() {
      return Spacebars.mustache(view.lookup("lastConnexion"));
    }), "\n                    "), "\n                    ", HTML.TD({
      class: "text-center"
    }, HTML.A({
      class: "discussionRed",
      id: "supp",
      href: ""
    }, "Supprimer")), "\n                  "), "\n                  " ];
  }), "\n                "), "\n              "), "\n          "), "\n       "), "\n    "), "\n  ") ];
}));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"discussion.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/Chat/Discussion/discussion.js                                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Template.discussion.rendered = function () {
  document.title = "Actualité de vos discussions";
  Session.set("recherche", null);

  if (Session.get("userID") == null) {
    Router.go('/connexion');
  }

  var sessionID = Session.get("userID");
  var find = Connexion.findOne({
    userIdNow: sessionID
  });

  if (!sessionID && sessionID != find.userIdNow) {
    Router.go('/connexion');
  }

  var notification = Message.find({
    idClient2: sessionID,
    notification: true
  }).fetch();
  Meteor.call('discussionNotNoti', sessionID);
  Tracker.autorun(function () {
    var sessionID = Session.get("userID");
    var user = Inscription.findOne({
      _id: sessionID,
      etatCompte: false
    });

    if (user) {
      Router.go('/connexion');
    }
  });
};

Template.discussion.helpers({
  // Couleur vert/rouge pour si la personne est connectée ou pas
  couleur: function () {
    var sessionID = Session.get("userID");
    var id = Contact.findOne({
      _id: this._id
    });
    var ids = id.contact;
    var deco = Connexion.findOne({
      userIdNow: ids
    });

    if (deco) {
      if (deco.deconnexion == 0) {
        return 'text-success';
      } else {
        return 'text-danger';
      }
    }
  },
  // Affiche les discussions
  discussion: function () {
    var sessionID = Session.get("userID");
    var contact = Contact.find({
      userIdNow: sessionID
    }, {
      sort: {
        lastMessage: -1
      }
    });
    return contact;
  },
  // Affiche l'heure de la nouvelle discussion
  lastConnexion: function () {
    var sessionID = Session.get("userID");
    var id = Contact.findOne({
      _id: this._id
    });
    var ids = id.contact;
    var deco = Connexion.findOne({
      userIdNow: ids
    });

    if (deco) {
      if (deco.deconnexion != 0) {
        var deconnexion = deco.deconnexion;
        var date = new Date(deconnexion);
        var day = date.getDate();
        var month = date.getMonth() + 1;

        if (month < 10) {
          month = "0" + month;
        }

        var year = date.getFullYear();
        var hours = date.getHours();
        var minutes = date.getMinutes();

        if (minutes < 10) {
          minutes = minutes + "0";
        }

        if (hours == 0) {
          hours = "0" + hours;
        }

        var final = "Hors ligne depuis " + day + "/" + month + "/" + year + "  " + hours + ":" + minutes;
        return final;
      } else {
        return "En ligne";
      }
    }
  },
  // Affiche les discussions des personnes avec qui on est pas ami
  noFriend: function () {
    var sessionID = Session.get("userID");
    var messages = Message.find({
      idClient2: sessionID,
      lu: false,
      luClient2: true
    }).fetch();

    var ids = _.pluck(messages, 'idClient1');

    var alreadyFriend = Contact.findOne({
      userIdNow: sessionID,
      contact: {
        $in: ids
      }
    });

    if (!alreadyFriend) {
      return Inscription.find({
        _id: {
          $in: ids
        }
      });
    }
  },
  //Enlève la notifcation dans la navbar
  notif: function () {
    var sessionID = Session.get("userID");
    var session = Message.findOne({
      idClient2: sessionID,
      notification: true
    });

    if (session) {
      return session;
    }
  },
  //notification dans le tableau discussion
  notification: function () {
    var sessionID = Session.get("userID");
    var id = Contact.findOne({
      _id: this._id
    });
    var notification = Message.findOne({
      idClient1: id.contact,
      idClient2: sessionID,
      lu: false
    });

    if (notification) {
      return notification;
    }
  }
});
Template.discussion.events({
  // Rejoind la page message
  'click .goDiscu': function (event) {
    event.preventDefault();
    event.stopPropagation();
    var id = Contact.findOne({
      _id: this._id
    });
    var contactId = id.contact;

    if (contactId) {
      Session.set("contactID", contactId);
      Router.go('/message');
    }

    ;
    var noFriendId = Inscription.findOne({
      _id: this._id
    });

    if (noFriendId) {
      Session.set("contactID", noFriendId._id);
    }
  },
  // Ajoute le nouveau contact avant d'aller à la page message
  'click .goNewDiscu': function (event) {
    event.preventDefault();
    event.stopPropagation();
    var id = Inscription.findOne({
      _id: this._id
    });

    if (id) {
      var idContact = id._id;

      if (idContact) {
        Session.set("newContactID", idContact);
        Router.go('newContact');
      }

      ;
    }
  },
  // Supprime la discussion
  'click #supp': function (event) {
    event.preventDefault();
    event.stopPropagation();
    var sessionID = Session.get("userID");
    var id = Contact.findOne({
      _id: this._id
    });

    if (id && confirm("Etes-vous sûr de vouloir supprimer la discussion ?")) {
      var contactID = id.contact;
      Meteor.call('discussionSupprimerMessage1', sessionID, contactID, function () {
        Meteor.call('discussionSupprimerMessage2', sessionID, contactID, function () {
          alert("Discussio supprimée !");
        });
      });
    }
  },
  // Supprime la discussion de la personne avec qui on est pas ami
  'click #suppNoFriend': function (event) {
    event.preventDefault();
    event.stopPropagation();
    var sessionID = Session.get("userID");
    var id = Inscription.findOne({
      _id: this._id
    });

    if (id && confirm("Etes-vous sûr de vouloir supprimer la discussion ?")) {
      var contactID = id._id;
      Meteor.call('discussionSupprimerMessage1', sessionID, contactID, function () {
        Meteor.call('discussionSupprimerMessage2', sessionID, contactID, function () {
          alert("Discussio supprimée !");
        });
      });
    }
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"message":{"template.message.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/Chat/message/template.message.js                                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //

Template.__checkName("message");
Template["message"] = new Template("Template.message", (function() {
  var view = this;
  return HTML.DIV({
    style: "min-height: 100%"
  }, "\n    ", HTML.DIV({
    class: "wap"
  }, "\n      ", HTML.DIV({
    class: "container"
  }, "\n        ", Spacebars.include(view.lookupTemplate("default")), "\n          ", HTML.DIV({
    class: "tableauMessage",
    style: "max-width:1250px;"
  }, "\n            ", HTML.Raw('<div style="max-width: 2000px">\n              <p>salut</p>\n            </div>'), "\n            ", Spacebars.include(view.lookupTemplate("messageGauche")), "\n            ", Spacebars.include(view.lookupTemplate("messageDroite")), "\n        "), "\n      "), "\n    "), "\n  ");
}));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"template.message_droite.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/Chat/message/template.message_droite.js                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //

Template.__checkName("messageDroite");
Template["messageDroite"] = new Template("Template.messageDroite", (function() {
  var view = this;
  return [ HTML.Raw("<!-- colone de droite -->\n  "), HTML.DIV({
    class: "col-sm-10 col-md-10 col-lg-10 droite",
    style: "padding: 0px"
  }, "\n    ", HTML.Raw("<!-- colone de droite / information du contact-->"), "\n      ", HTML.DIV({
    class: "perso"
  }, "\n          ", HTML.DIV({
    class: "text-center",
    style: "vertical-align: middle; height: 100%;"
  }, "\n            ", Blaze.Each(function() {
    return Spacebars.call(view.lookup("messageFriendInformation"));
  }, function() {
    return [ " ", Blaze.View("lookup:nom", function() {
      return Spacebars.mustache(view.lookup("nom"));
    }), " ", Blaze.View("lookup:prenom", function() {
      return Spacebars.mustache(view.lookup("prenom"));
    }), "\n            ", HTML.SPAN({
      class: "pull-right infoPerso"
    }, Blaze.View("lookup:messageFriendLastConnexion", function() {
      return Spacebars.mustache(view.lookup("messageFriendLastConnexion"));
    })), "\n            " ];
  }), "\n          "), "\n\n      "), "\n      ", HTML.Raw("<!-- colone de droite / messages -->"), "\n      ", HTML.DIV({
    class: "dis",
    id: "enbas"
  }, "\n        ", Blaze.Each(function() {
    return Spacebars.call(view.lookup("messages"));
  }, function() {
    return [ "\n        ", Blaze.View("lookup:messageDateSend", function() {
      return Spacebars.makeRaw(Spacebars.mustache(view.lookup("messageDateSend"), view.lookup("@index")));
    }), "\n          ", HTML.DIV({
      class: function() {
        return [ "messageChatDiv ", Spacebars.mustache(view.lookup("messageSide")) ];
      }
    }, "\n            ", HTML.DIV({
      class: "message"
    }, "\n              ", Blaze.View("lookup:message", function() {
      return Spacebars.mustache(view.lookup("message"));
    }), "\n            "), "\n            ", HTML.DIV({
      class: function() {
        return Spacebars.mustache(view.lookup("messageThisDiscussionGlyphiconColor"));
      }
    }), "\n            ", HTML.DIV({
      class: "messageHeure"
    }, Blaze.View("lookup:messageHeure", function() {
      return Spacebars.mustache(view.lookup("messageHeure"));
    })), "\n          "), "\n        " ];
  }), "\n        ", HTML.Raw("<br>"), "\n      "), "\n      ", HTML.Raw("<!-- colone de droite / envoyer et écrire message-->"), "\n      ", HTML.Raw('<div class="form-groupe col-sm-12">\n        <div style="width : 100%; height:65px;">\n          <div>\n            <input type="text" class="messageBoutonSend col-sm-10 col-md-9 col-lg-8" placeholder="Ecrire un message" name="message" id="messages">\n            <span class="col-sm-2 col-md-3 col-lg-4">\n              <button id="messageButton" type="submit">\n                <div type="submit" id="messageSend" class="glyphicon glyphicon-send"></div>\n              </button>\n            </span>\n          </div>\n        </div>\n      </div>'), "\n    ", HTML.Raw("<!-- fin colone de droite -->"), "\n  ") ];
}));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"template.message_gauche.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/Chat/message/template.message_gauche.js                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //

Template.__checkName("messageGauche");
Template["messageGauche"] = new Template("Template.messageGauche", (function() {
  var view = this;
  return [ HTML.Raw("<!-- colone de gauche -->\n  "), HTML.DIV({
    class: "col-sm-2 col-md-2 col-lg-2 gauche",
    style: "padding: 0px"
  }, "\n", HTML.Raw("<!-- barre de recherche -->"), "\n   ", HTML.Raw('<div>\n        <div class="messageBarRecherche input-group">\n          <input style="border : 1px solid #cecece ; background-color:white" type="text" name="recherche" id="rechercheContact" class="form-control" placeholder="Search">\n          <div class="input-group-btn">\n            <button class="btn btn-default" id="goRecherche" type="submit">\n                          <i class="glyphicon glyphicon-search"></i>\n            </button>\n          </div>\n        </div>\n      </div>'), "\n    ", HTML.Raw("<!-- affichage recherche ou amis -->"), "\n    ", Blaze.If(function() {
    return Spacebars.call(view.lookup("recherche"));
  }, function() {
    return [ "\n    ", HTML.Comment(" recherche "), "\n    ", HTML.DIV({
      class: "messageAmi"
    }, "\n      ", Blaze.Each(function() {
      return Spacebars.call(view.lookup("recherche"));
    }, function() {
      return [ "\n        ", HTML.DIV({
        class: "rechercheContact"
      }, HTML.A({
        href: "message",
        style: "color : #223966; ",
        id: function() {
          return Spacebars.mustache(view.lookup("_id"));
        },
        class: "goDiscutionRecherche"
      }, Blaze.View("lookup:nom", function() {
        return Spacebars.mustache(view.lookup("nom"));
      }), " ", Blaze.View("lookup:prenom", function() {
        return Spacebars.mustache(view.lookup("prenom"));
      })), "\n        "), "\n      " ];
    }), "\n    "), "\n    " ];
  }, function() {
    return [ "\n    ", HTML.Comment(" autres discussions "), "\n    ", HTML.DIV({
      class: "messageAmi "
    }, "\n      ", Blaze.Each(function() {
      return Spacebars.call(view.lookup("discussion"));
    }, function() {
      return [ "\n      ", HTML.DIV({
        class: function() {
          return Spacebars.mustache(view.lookup("messageAnotherDiscussionActiveClass"), view.lookup("@index"));
        },
        style: "border-bottom : solid 1px #acacac"
      }, "\n        ", HTML.DIV({
        class: function() {
          return Spacebars.mustache(view.lookup("messageAnotherDiscussionActiveClass"), view.lookup("@index"));
        }
      }, "\n          ", HTML.DIV({
        class: function() {
          return [ "messageContacAnthoner ", Spacebars.mustache(view.lookup("messageAnotherDiscussionActiveClass"), view.lookup("@index")) ];
        }
      }, HTML.A({
        href: "message",
        id: function() {
          return Spacebars.mustache(view.lookup("contact"));
        },
        class: "goDiscussionSecondaire"
      }, Blaze.View("lookup:nom", function() {
        return Spacebars.mustache(view.lookup("nom"));
      }), " ", Blaze.View("lookup:prenom", function() {
        return Spacebars.mustache(view.lookup("prenom"));
      }))), "\n          ", HTML.DIV({
        style: "width: 30px;",
        class: function() {
          return Spacebars.mustache(view.lookup("messageAnotherDiscussionActiveClass"), view.lookup("@index"));
        }
      }, "\n            ", Blaze.If(function() {
        return Spacebars.call(view.lookup("notificationAnthonerDiscussion"));
      }, function() {
        return [ "\n            ", HTML.DIV({
          class: "rond"
        }), "\n            " ];
      }), "\n          "), "\n        "), "\n        ", HTML.DIV({
        class: function() {
          return Spacebars.mustache(view.lookup("messageAnotherDiscussionActiveClass"), view.lookup("@index"));
        }
      }, "\n          ", Blaze.If(function() {
        return Spacebars.call(view.lookup("lastMessageAnthonerDiscussion"));
      }, function() {
        return [ "\n          ", HTML.DIV({
          class: function() {
            return Spacebars.mustache(view.lookup("messageAnothersDiscussionGlyphiconColor"));
          }
        }), "\n          " ];
      }), "\n          ", HTML.DIV({
        class: function() {
          return [ "lastMessage ", Spacebars.mustache(view.lookup("messageAnotherDiscussionActiveClass"), view.lookup("@index")) ];
        }
      }, Blaze.View("lookup:lastMessageAnthonerDiscussion", function() {
        return Spacebars.mustache(view.lookup("lastMessageAnthonerDiscussion"));
      })), "\n        "), "\n      "), "\n      " ];
    }), "\n    "), "\n    " ];
  }), "\n  ") ];
}));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"message.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/Chat/message/message.js                                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Template.message.rendered = function () {
  document.title = "Message";

  if (Session.get("userID") == null) {
    Router.go('/connexion');
  }

  var sessionID = Session.get("userID");
  var find = Connexion.findOne({
    userIdNow: sessionID
  });
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"message_droite.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/Chat/message/message_droite.js                                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Template.messageDroite.rendered = function () {
  // Déscent l'overflow toujours en bas lorsqu'on rejoind une discussion ou qu'il y ait un nouveau message
  Message.find().observeChanges({
    changed: function () {
      setTimeout(function () {
        var x = document.getElementById("enbas");
        x.scrollTop = x.scrollHeight;
      }, 300);
    },
    added: function () {
      setTimeout(function () {
        var x = document.getElementById("enbas");
        x.scrollTop = x.scrollHeight;
      }, 300);
    }
  }); // Controle si on change de recherche, ne nous laisse pas accéder à la page si il n'y a pas ID valabe (sécurité)

  Tracker.autorun(function () {
    setTimeout(function () {
      var x = document.getElementById("enbas");
      x.scrollTop = x.scrollHeight;
      var recherche = document.getElementById("rechercheContact");
      recherche.addEventListener("change", function () {
        var recherche2 = $('#defaultRechercheContact').val();
        Session.set("recherche", recherche2);
      });
    }, 300);
    var sessionID = Session.get("userID");
    var user = Inscription.findOne({
      _id: sessionID,
      etatCompte: false
    });

    if (user) {
      Router.go('/connexion');
    }
  });
};

Template.messageDroite.helpers({
  // Retourne les messages
  messages: function () {
    var sessionID = Session.get("userID");
    var contactID = Session.get("contactID");
    Meteor.call('notification', sessionID, contactID);
    return Message.find({
      $or: [{
        idClient1: sessionID,
        idClient2: contactID,
        luClient1: true
      }, {
        idClient1: contactID,
        idClient2: sessionID,
        luClient2: true
      }]
    }, {
      sort: {
        hours: 1
      }
    }).fetch();
  },
  // Retourne la date du jour de la discussion avec l'Index
  messageDateSend: function (index) {
    var sessionID = Session.get("userID");
    var contactID = Session.get("contactID");
    var messages = Message.find({
      $or: [{
        idClient1: sessionID,
        idClient2: contactID,
        luClient1: true
      }, {
        idClient1: contactID,
        idClient2: sessionID,
        luClient2: true
      }]
    }, {
      sort: {
        hours: 1
      }
    }).fetch();
    var day = new Date(this.hours);
    var jour = day.getDate();

    if (jour < 10) {
      jour = "0" + jour;
    }

    var mois = day.getMonth() + 1;

    if (mois < 10) {
      mois = "0" + mois;
    }

    if (index === 0) {
      return '<div class="messageDateSend">' + jour + "/" + mois + "/" + day.getFullYear() + '</div>';
    }

    var dayBefore = new Date(messages[index - 1].hours);
    day.setHours(0, 0, 0, 0);
    dayBefore.setHours(0, 0, 0, 0);

    if (dayBefore < day) {
      return '<div class="messageDateSend">' + jour + "/" + mois + "/" + day.getFullYear() + '</div>';
    }
  },
  // Affiche les informations de la personne avec qui on discute
  messageFriendInformation: function () {
    var sessionID = Session.get("userID");
    var contactID = Session.get("contactID");
    var infoPersonne = Contact.find({
      userIdNow: sessionID,
      contact: contactID
    });

    if (infoPersonne) {
      return infoPersonne;
    }
  },
  // Affiche si le contact de la discussion est en ligne ou l'heure de sa dernière connexion
  messageFriendLastConnexion: function () {
    var contactID = Session.get("contactID");
    var sessionID = Session.get("sessionID");
    var deco = Connexion.findOne({
      userIdNow: contactID
    });

    if (deco) {
      if (deco.deconnexion != 0) {
        var deconnexion = deco.deconnexion;
        var date = new Date(deconnexion);
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        var hours = date.getHours();

        if (hours < 10) {
          hours = "0" + hours;
        }

        var minutes = date.getMinutes();

        if (minutes < 10) {
          minutes = "0" + minutes;
        }

        var today = new Date();

        if (day == today.getDate()) {
          if (month == today.getMonth() + 1) {
            if (year == today.getFullYear()) {
              var final = "Hors ligne depuis " + "  " + hours + ":" + minutes;
            } else {
              var final = "Hors ligne depuis " + day + "/" + month + "/" + year + "  " + hours + ":" + minutes;
            }
          } else {
            var final = "Hors ligne depuis " + day + "/" + month + "/" + year + "  " + hours + ":" + minutes;
          }
        } else {
          var final = "Hors ligne depuis " + day + "/" + month + "/" + year + "  " + hours + ":" + minutes;
        }

        return final;
      } else {
        return "En ligne";
      }
    }
  },
  // Affiche l'heure du message
  messageHeure: function () {
    var sessionID = Session.get("userID");
    var contactID = Session.get("contactID");
    var message = Message.findOne({
      _id: this._id
    });
    var hour = message.hours;
    var hours = new Date(hour);
    var heure = hours.getHours();
    var minute = hours.getMinutes();

    if (heure < 10) {
      heure = "0" + heure;
    }

    if (minute < 10) {
      minute = "0" + minute;
    }

    var time = heure + ":" + minute;
    return time;
  },
  // Détermine la couleur du message
  messageSide: function () {
    if (this.idClient1 === Session.get("userID")) {
      return 'textright';
    }

    return 'textleft';
  },
  // Détermine la couleur du vu dans le message
  messageThisDiscussionGlyphiconColor: function () {
    var sessionID = Session.get("userID");

    if (this.idClient1 == sessionID) {
      if (this.lu == false) {
        return "colorGray" + " " + "glyphicon glyphicon-ok" + " " + "ok";
      } else {
        return "colorBlue" + " " + "glyphicon glyphicon-ok" + " " + "ok";
      }
    }
  }
});
Template.messageDroite.events({
  // Envoie le message et l'enregistre dans la MongoDB
  'submit form': function (event) {
    event.preventDefault();
    event.stopPropagation();
    var sessionID = Session.get("userID");
    var contactID = Session.get("contactID");
    var find = Connexion.findOne({
      userIdNow: sessionID
    });
    var message = $('#messages').val();

    if (message && contactID != null) {
      var now = new Date();
      var hash3 = {
        idClient1: sessionID,
        idClient2: contactID,
        message: message,
        lu: false,
        notification: true,
        hours: now.getTime(),
        luClient1: true,
        luClient2: true
      };
      var time = now.getTime();
      Meteor.call('message', hash3, function (data3) {});
      Meteor.call('lastMessage', time, sessionID, contactID);
      Meteor.call('lastMessage2', time, sessionID, contactID);
      $('#messages').val('');
    }
  },
  // Envoie le message et l'enregistre dans la MongoDB
  'click #messageButton': function (event) {
    event.preventDefault();
    event.stopPropagation();
    var sessionID = Session.get("userID");
    var contactID = Session.get("contactID");
    var find = Connexion.findOne({
      userIdNow: sessionID
    });
    var message = $('#messages').val();

    if (message && contactID != null) {
      var now = new Date();
      var hash3 = {
        idClient1: sessionID,
        idClient2: contactID,
        message: message,
        lu: false,
        notification: true,
        hours: now.getTime(),
        luClient1: true,
        luClient2: true
      };
      var time = now.getTime();
      Meteor.call('message', hash3, function (data3) {});
      Meteor.call('lastMessage', time, sessionID, contactID);
      Meteor.call('lastMessage2', time, sessionID, contactID);
      $('#messages').val('');
    }
  },
  // Envoie le message et l'enregistre dans la MongoDB
  'click #messageSend': function (event) {
    event.preventDefault();
    event.stopPropagation();
    var sessionID = Session.get("userID");
    var contactID = Session.get("contactID");
    var find = Connexion.findOne({
      userIdNow: sessionID
    });
    var message = $('#messages').val();

    if (message && contactID != null) {
      var now = new Date();
      var hash3 = {
        idClient1: sessionID,
        idClient2: contactID,
        message: message,
        lu: false,
        notification: true,
        hours: now.getTime(),
        luClient1: true,
        luClient2: true
      };
      var time = now.getTime();
      Meteor.call('message', hash3, function (data3) {});
      Meteor.call('lastMessage', time, sessionID, contactID);
      Meteor.call('lastMessage2', time, sessionID, contactID);
      $('#messages').val('');
    }
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"message_gauche.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/Chat/message/message_gauche.js                                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Template.messageGauche.helpers({
  // Retourne les discussions
  discussion: function () {
    var sessionID = Session.get("userID");
    var contact = Contact.find({
      userIdNow: sessionID
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
  lastMessageAnthonerDiscussion: function () {
    var sessionID = Session.get("userID");
    var contact = Contact.findOne({
      _id: this._id
    });
    var contactID = contact.contact;
    var lastMessage = Message.findOne({
      $or: [{
        idClient1: sessionID,
        idClient2: contactID,
        luClient1: true
      }, {
        idClient1: contactID,
        idClient2: sessionID,
        luClient2: true
      }]
    }, {
      sort: {
        hours: -1
      }
    });

    if (lastMessage) {
      return lastMessage.message;
    }
  },
  // Index active class autreDiscussion
  messageAnotherDiscussionActiveClass: function (index) {
    var sessionID = Session.get("userID");
    var contactID = Session.get("contactID");
    var contacts = Contact.find({
      userIdNow: sessionID
    }).fetch();
    var contact = this.contact;

    if (contactID === contact) {
      return 'bg-discussion'; // 'bg-secondary';
    }
  },
  // Vu dans les autres discussions
  messageAnothersDiscussionGlyphiconColor: function () {
    var sessionID = Session.get("userID");
    var contactID = this.contact;
    var lastMessage = Message.findOne({
      $or: [{
        idClient1: sessionID,
        idClient2: contactID
      }, {
        idClient1: contactID,
        idClient2: sessionID
      }]
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
  notificationAnthonerDiscussion: function () {
    var sessionID = Session.get("userID");
    var id = Contact.findOne({
      _id: this._id
    });
    var notification = Message.findOne({
      idClient1: id.contact,
      idClient2: sessionID,
      lu: false
    });

    if (notification) {
      return notification;
    }
  },
  // Affiche les recherches dans la liste des discussion
  recherche: function () {
    var recherche = Session.get("recherche");

    if (recherche != null && recherche != '') {
      var mongo = Contact.find({
        userIdNow: Session.get("userID")
      }).fetch();

      var ids = _.pluck(mongo, 'contact');

      var connecter = Inscription.find({
        $or: [{
          prenom: {
            $regex: recherche
          },
          _id: {
            $in: ids
          }
        }, {
          nom: {
            $regex: recherche
          },
          _id: {
            $in: ids
          }
        }]
      }).fetch();

      if (connecter) {
        return connecter;
      }
    }
  }
});
Template.messageGauche.events({
  // Rejoind la discussion depuis une recherche dans la liste de contact
  'click .goDiscutionRecherche': function (event) {
    Session.set("recherche", null);
    event.preventDefault();
    event.stopPropagation();
    var contactId = this._id;

    if (contactId) {
      Session.set("contactID", contactId);
      Router.go('/message');
    }

    ;
    $('#messages').val('');
    setTimeout(function () {
      var x = document.getElementById("enbas");
      x.scrollTop = x.scrollHeight;
    }, 300);
  },
  'click ul': function () {
    Session.set("recherche", null);
    $('#messages').val('');
  },
  // Rejoind une discussion depuis la liste des contacts
  'click .goDiscussionSecondaire': function (event) {
    Session.set("recherche", null);
    event.preventDefault();
    event.stopPropagation();
    var id = Contact.findOne({
      _id: this._id
    });
    var contactId = id.contact;

    if (contactId) {
      Session.set("contactID", contactId);
      Router.go('/message');
    }

    ;
    var noFriendId = Inscription.findOne({
      _id: this._id
    });

    if (noFriendId) {
      Session.set("contactID", noFriendId._id);
    }

    $('#messages').val('');
    setTimeout(function () {
      var x = document.getElementById("enbas");
      x.scrollTop = x.scrollHeight;
    }, 300);
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"Contact":{"contact":{"template.contact.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/Contact/contact/template.contact.js                                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //

Template.__checkName("contact");
Template["contact"] = new Template("Template.contact", (function() {
  var view = this;
  return HTML.DIV({
    class: "container"
  }, "\n  ", HTML.FORM("\n    ", HTML.DIV({
    class: "form-group"
  }, "\n      ", Spacebars.include(view.lookupTemplate("default")), "\n    "), "\n  "), "\n    ", HTML.DIV({
    class: "col-lg-12 col-md-12 col-sm-12"
  }, "\n      ", Blaze.Each(function() {
    return Spacebars.call(view.lookup("contactList"));
  }, function() {
    return [ "\n      ", HTML.DIV({
      class: "col-lg-3 col-md-6 col-sm-12"
    }, "\n          ", HTML.DIV({
      class: "panel",
      id: "taille"
    }, "\n            ", HTML.DIV({
      id: "noBackground"
    }, "\n              Nom : ", Blaze.View("lookup:nom", function() {
      return Spacebars.mustache(view.lookup("nom"));
    }), "\n              ", HTML.BR(), " Prénom : ", Blaze.View("lookup:prenom", function() {
      return Spacebars.mustache(view.lookup("prenom"));
    }), "\n              ", HTML.BR(), " Age : ", Blaze.View("lookup:contactAge", function() {
      return Spacebars.mustache(view.lookup("contactAge"));
    }), "\n              ", HTML.BR(), " Date naissance : ", Blaze.View("lookup:date", function() {
      return Spacebars.mustache(view.lookup("date"));
    }), "\n              ", HTML.BR(), " E-mail : ", Blaze.View("lookup:email", function() {
      return Spacebars.mustache(view.lookup("email"));
    }), "\n              ", HTML.BR(), " Pseudo : ", Blaze.View("lookup:pseudo", function() {
      return Spacebars.mustache(view.lookup("pseudo"));
    }), "\n              ", HTML.BR(), "\n              ", HTML.A({
      href: "",
      class: "supprimer contactDelete",
      id: function() {
        return Spacebars.mustache(view.lookup("contact"));
      }
    }, "Supprimer"), "\n            "), "\n          "), "\n      "), "\n      " ];
  }), "\n    "), "\n  ");
}));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"contact.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/Contact/contact/contact.js                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Template.contact.rendered = function () {
  document.title = "Contact";

  if (Session.get("userID") == null) {
    Router.go('/connexion');
  }

  var sessionID = Session.get("userID");
  var find = Connexion.findOne({
    userIdNow: sessionID
  });

  if (!sessionID && sessionID != find.userIdNow) {
    Router.go('/connexion');
  }

  Tracker.autorun(function () {
    var sessionID = Session.get("userID");
    var user = Inscription.findOne({
      _id: sessionID,
      etatCompte: false
    });

    if (user) {
      Router.go('/connexion');
    }
  });
};

Template.contact.helpers({
  //  Retourne l'âge exacte d'un contact
  contactAge: function () {
    var sessionID = Session.get("userID");
    var id = Contact.findOne({
      _id: this._id
    });

    if (id) {
      var contactID = id.contact;
      var last = Inscription.findOne({
        _id: contactID
      });

      if (last) {
        var date = last.date;
        var birthday = new Date(date);
        var nouveau = new Date();
        var age = new Number(nouveau.getTime() - birthday.getTime()) / 31557600000;
        return Math.floor(age);
      }

      ;
    }
  },
  // Retourne la liste de nos contacts
  contactList: function () {
    var sessionID = Session.get("userID");
    var last = Contact.find({
      userIdNow: sessionID
    }).fetch();

    if (last) {
      return last;
    }

    ;
  }
});
Template.contact.events({
  // Supprimer un contact
  'click .supprimer': function (event) {
    event.preventDefault();
    event.stopPropagation();
    var id = Contact.findOne({
      _id: this._id
    });
    var contactID = id.contact;
    var sessionID = Session.get("userID");

    if (confirm("Etes-vous sûr de vouloir supprimer ce contact")) {
      Meteor.call('supprimerContact', sessionID, contactID, function () {
        Meteor.call('supprimerMessage1', sessionID, contactID, function () {
          Meteor.call('supprimerMessage2', sessionID, contactID, function () {
            Router.go('/contact');
          });
        });
      });
    }
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"newContact":{"template.newContact.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/Contact/newContact/template.newContact.js                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //

Template.__checkName("newContact");
Template["newContact"] = new Template("Template.newContact", (function() {
  var view = this;
  return HTML.DIV({
    class: "container"
  }, "\n    ", HTML.FORM("\n      ", HTML.DIV({
    class: "form-group"
  }, "\n          ", Spacebars.include(view.lookupTemplate("default")), "\n          ", HTML.DIV({
    class: "newContactDivSize"
  }, "\n            ", HTML.LABEL({
    class: "newContactAttributs"
  }, "Nom : ", Blaze.View("lookup:nom", function() {
    return Spacebars.mustache(view.lookup("nom"));
  })), "\n            ", HTML.Raw("<br>"), "\n            ", HTML.LABEL({
    class: "newContactAttributs"
  }, "Prénom : ", Blaze.View("lookup:prenom", function() {
    return Spacebars.mustache(view.lookup("prenom"));
  })), "\n            ", HTML.Raw("<br>"), "\n            ", HTML.LABEL({
    class: "newContactAttributs"
  }, "Pseudo : ", Blaze.View("lookup:pseudo", function() {
    return Spacebars.mustache(view.lookup("pseudo"));
  })), "\n            ", HTML.Raw("<br>"), "\n            ", HTML.LABEL({
    class: "newContactAttributs"
  }, "Age :  ", Blaze.View("lookup:age", function() {
    return Spacebars.mustache(view.lookup("age"));
  })), "\n            ", HTML.Raw("<br>"), "\n            ", HTML.LABEL({
    class: "newContactAttributs"
  }, "E-mail : ", Blaze.View("lookup:email", function() {
    return Spacebars.mustache(view.lookup("email"));
  })), "\n            ", HTML.Raw('<img src="http://persiantuts.ir/wp-content/uploads/2017/12/WEB_ICO_Technical-Support.png" class="newContactImage">'), "\n          "), "\n        ", HTML.Raw("<br>"), "\n        ", HTML.Raw('<input class="newContactButton" type="submit" id="enregister" value="Enregistrer">'), "\n        ", HTML.Raw("<br>"), "\n        ", HTML.Raw("<br>"), "\n        ", HTML.Raw('<a class="newContactLinkContact" id="retour" href="/contact">Retourner à la page contact</a>'), "\n        ", HTML.Raw("<br>"), "\n      "), "\n    "), "\n  ");
}));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"newContact.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/Contact/newContact/newContact.js                                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Template.newContact.rendered = function () {
  document.title = "Nouveau contact";

  if (Session.get("userID") == null) {
    Router.go('/connexion');
  }

  var sessionID = Session.get("userID");
  var find = Connexion.findOne({
    userIdNow: sessionID
  });

  if (!sessionID && sessionID != find.userIdNow) {
    Router.go('/connexion');
  }

  Tracker.autorun(function () {
    var sessionID = Session.get("userID");
    var user = Inscription.findOne({
      _id: sessionID,
      etatCompte: false
    });

    if (user) {
      Router.go('/connexion');
    }
  });
};

Template.newContact.helpers({
  age: function () {
    var newContact = Inscription.findOne({
      _id: Session.get("newContactID")
    });

    if (newContact) {
      var date = newContact.date;
      var birthday = new Date(date);
      var nouveau = new Date();
      var age = new Number(nouveau.getTime() - birthday.getTime()) / 31557600000;
      return Math.floor(age);
    }
  },
  email: function () {
    var newContact = Inscription.findOne({
      _id: Session.get("newContactID")
    });

    if (newContact) {
      return newContact.email;
    }
  },
  nom: function () {
    var newContact = Inscription.findOne({
      _id: Session.get("newContactID")
    });

    if (newContact) {
      return newContact.nom;
    }
  },
  prenom: function () {
    var newContact = Inscription.findOne({
      _id: Session.get("newContactID")
    });

    if (newContact) {
      return newContact.prenom;
    }
  },
  pseudo: function () {
    var newContact = Inscription.findOne({
      _id: Session.get("newContactID")
    });

    if (newContact) {
      return newContact.pseudo;
    }
  }
});
Template.newContact.events({
  'submit form': function (event) {
    event.preventDefault();
    event.stopPropagation();
    var trouver = Inscription.findOne({
      _id: Session.get("newContactID")
    });

    if (trouver) {
      var nom = trouver.nom;
      var prenom = trouver.prenom;
      var pseudo = trouver.pseudo;
      var age = trouver.age;
      var date = trouver.date;
      var email = trouver.email;
      var now = new Date();
      var hash5 = {
        userIdNow: Session.get("userID"),
        nom: nom,
        prenom: prenom,
        age: age,
        date: date,
        email: email,
        pseudo: pseudo,
        contact: Session.get("newContactID"),
        hours: now.getTime(),
        lastMessage: 0
      };
      Meteor.call('newContact', hash5);
      Router.go('/contact');
      Session.set("newContactID", null);
    }
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"accueil":{"template.accueil.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/accueil/template.accueil.js                                                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //

Template.__checkName("accueil");
Template["accueil"] = new Template("Template.accueil", (function() {
  var view = this;
  return HTML.DIV({
    class: "container"
  }, "\n  ", HTML.FORM("\n    ", HTML.DIV({
    class: "form-group"
  }, "\n      ", Spacebars.include(view.lookupTemplate("default")), "\n    "), "\n\n  "), HTML.Raw("\n\n<!-- conetnu de la page -->\n\n\n  "), Blaze.If(function() {
    return Spacebars.call(view.lookup("Motrecherche"));
  }, function() {
    return [ "\n\n  ", HTML.Comment(" Recherche "), "\n      ", HTML.DIV({
      class: "rechercheaccueilDiv"
    }, "\n        ", HTML.H2({
      class: "accueilRechercheMot accueilTextWhite"
    }, Blaze.View("lookup:Motrecherche", function() {
      return Spacebars.mustache(view.lookup("Motrecherche"));
    })), "\n        ", Blaze.Each(function() {
      return Spacebars.call(view.lookup("recherche"));
    }, function() {
      return [ "\n          ", HTML.DIV("\n            ", Blaze.View("lookup:prenom", function() {
        return Spacebars.mustache(view.lookup("prenom"));
      }), " ", Blaze.View("lookup:nom", function() {
        return Spacebars.mustache(view.lookup("nom"));
      }), " ", Blaze.View("lookup:age", function() {
        return Spacebars.mustache(view.lookup("age"));
      }), " ", Blaze.View("lookup:email", function() {
        return Spacebars.mustache(view.lookup("email"));
      }), "\n          "), "\n        " ];
    }), "\n        ", Blaze.Each(function() {
      return Spacebars.call(view.lookup("findInscription"));
    }, function() {
      return [ "\n          ", HTML.DIV({
        class: "accueilRecherche"
      }, "\n            ", HTML.A({
        class: "goInscription accueilRechercheMessage",
        id: function() {
          return Spacebars.mustache(view.lookup("_id"));
        }
      }, Blaze.View("lookup:prenom", function() {
        return Spacebars.mustache(view.lookup("prenom"));
      }), " ", Blaze.View("lookup:nom", function() {
        return Spacebars.mustache(view.lookup("nom"));
      }), " ", Blaze.View("lookup:email", function() {
        return Spacebars.mustache(view.lookup("email"));
      })), "\n          "), "\n          ", HTML.BR(), "\n        " ];
    }), "\n        ", Blaze.Each(function() {
      return Spacebars.call(view.lookup("findMessage"));
    }, function() {
      return [ "\n          ", HTML.DIV({
        class: "accueilRecherche"
      }, "\n            ", HTML.A({
        class: "goMessage accueilRechercheMessage",
        id: function() {
          return Spacebars.mustache(view.lookup("contact"));
        }
      }, Blaze.View("lookup:message", function() {
        return Spacebars.mustache(view.lookup("message"));
      })), "\n            ", HTML.P({
        class: "accueilRechercheMessageBy"
      }, "De : ", Blaze.View("lookup:rechercheMessageAuthor", function() {
        return Spacebars.mustache(view.lookup("rechercheMessageAuthor"));
      }), " ", Blaze.View("lookup:rechercheMessageHours", function() {
        return Spacebars.mustache(view.lookup("rechercheMessageHours"));
      })), "\n          "), "\n          ", HTML.BR(), "\n       " ];
    }), "\n      "), "\n\n   " ];
  }, function() {
    return [ "\n  ", HTML.H1({
      class: "accueilTextWhite"
    }, "Bonjour ", Blaze.View("lookup:prenomAccueil", function() {
      return Spacebars.mustache(view.lookup("prenomAccueil"));
    }), ", "), "\n  ", HTML.Comment(" amis connectés / nouveaux contacts "), "\n      ", Blaze.If(function() {
      return Spacebars.call(view.lookup("friendsOnline"));
    }, function() {
      return [ "\n          ", HTML.DIV({
        class: "col-lg-12 col-md-12 col-sm-12"
      }, "\n            ", Blaze.Each(function() {
        return Spacebars.call(view.lookup("friendsOnline"));
      }, function() {
        return [ "\n            ", HTML.DIV({
          class: "col-lg-3 col-md-6 col-sm-12 "
        }, "\n            ", HTML.DIV({
          class: "panel panel-heading",
          id: "friendsOnline"
        }, "\n              Nom : ", Blaze.View("lookup:nom", function() {
          return Spacebars.mustache(view.lookup("nom"));
        }), "\n        ", HTML.BR(), " Prénom : ", Blaze.View("lookup:prenom", function() {
          return Spacebars.mustache(view.lookup("prenom"));
        }), "\n            "), "\n          "), "\n            " ];
      }), "\n          "), "\n          ", Blaze.If(function() {
        return Spacebars.call(view.lookup("anotherUsers"));
      }, function() {
        return [ "\n          ", HTML.DIV({
          class: "col-lg-12 col-md-12 col-sm-12"
        }, "\n            ", Blaze.Each(function() {
          return Spacebars.call(view.lookup("anotherUsers"));
        }, function() {
          return [ "\n            ", HTML.DIV({
            class: "col-lg-3 col-md-6 col-sm-12"
          }, "\n                ", HTML.DIV({
            class: "panel panel-heading"
          }, "\n                  ", HTML.A({
            id: function() {
              return Spacebars.mustache(view.lookup("_id"));
            },
            class: "goAjouter glyphicon glyphicon-plus accueilanotherUsersText"
          }), "\n                  Nom : ", Blaze.View("lookup:nom", function() {
            return Spacebars.mustache(view.lookup("nom"));
          }), "\n                  ", HTML.BR(), " Prénom : ", Blaze.View("lookup:prenom", function() {
            return Spacebars.mustache(view.lookup("prenom"));
          }), "\n                "), "\n            "), "\n            " ];
        }), "\n          "), "\n          " ];
      }), "\n      " ];
    }, function() {
      return [ "\n          ", HTML.DIV({
        class: "accueilAnotherUsers"
      }, "\n            ", Blaze.Each(function() {
        return Spacebars.call(view.lookup("anotherUsers"));
      }, function() {
        return [ "\n            ", HTML.DIV({
          class: "col-lg-3 col-md-6 col-sm-12"
        }, "\n                ", HTML.DIV({
          class: "panel panel-heading"
        }, "\n                  ", HTML.A({
          id: function() {
            return Spacebars.mustache(view.lookup("_id"));
          },
          class: "goAjouter glyphicon glyphicon-plus accueilanotherUsersText"
        }), "\n                  Nom : ", Blaze.View("lookup:nom", function() {
          return Spacebars.mustache(view.lookup("nom"));
        }), "\n                  ", HTML.BR(), " Prénom : ", Blaze.View("lookup:prenom", function() {
          return Spacebars.mustache(view.lookup("prenom"));
        }), "\n                "), "\n            "), "\n            " ];
      }), "\n          "), "\n      " ];
    }), "\n  " ];
  }), "\n\n  ");
}));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"accueil.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/accueil/accueil.js                                                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Template.accueil.rendered = function () {
  document.title = "Accueil";

  if (Session.get("userID") == null) {
    Router.go('/connexion');
  }

  var sessionID = Session.get("userID");
  var find = Connexion.findOne({
    userIdNow: sessionID
  });

  if (!sessionID && sessionID != find.userIdNow) {
    Router.go('/connexion');
  }
};

Template.accueil.helpers({
  // D'autres utilisateurs que l'on pourrait ajouter
  anotherUsers: function () {
    var sessionID = Session.get("userID");
    var contacts = Contact.find({
      userIdNow: sessionID
    }).fetch();

    var ids = _.pluck(contacts, 'contact');

    ids.push(sessionID);
    return Inscription.find({
      _id: {
        $nin: ids
      }
    }).fetch();
  },
  // return les inscriptions trouvés avec le mot de recherche
  findInscription: function () {
    var infoRecherche = Session.get("infoRecherche");
    var sessionID = Session.get("userID");
    var findInscription = Inscription.find({
      $or: [{
        prenom: infoRecherche
      }, {
        nom: infoRecherche
      }, {
        age: infoRecherche
      }, {
        email: {
          $regex: infoRecherche
        }
      }, {
        pseudo: infoRecherche
      }]
    }).fetch();

    if (findInscription) {
      return findInscription;
    }

    return Session.get("findInscription");
  },
  // return les messsage trouvés avec le mot de recherche
  findMessage: function () {
    var infoRecherche = Session.get("infoRecherche");
    var sessionID = Session.get("userID");
    var findMessage = Message.find({
      $or: [{
        idClient1: sessionID
      }, {
        idClient2: sessionID
      }],
      message: {
        $regex: infoRecherche
      }
    }).fetch();

    if (findMessage) {
      return findMessage;
    } else {
      return Session.get("findMessage");
    }
  },
  // Les amis qui sont en ligne
  friendsOnline: function () {
    var sessionID = Session.get("userID");
    var contacts = Connexion.find({
      etatSession: true
    }).fetch();

    var ids = _.pluck(contacts, 'userIdNow');

    ids.push(sessionID);
    return Contact.find({
      contact: {
        $in: ids
      },
      userIdNow: sessionID
    }).fetch();
  },
  // Affiche le mot Recherche dans la page
  Motrecherche: function () {
    var rech = Session.get("rech");

    if (rech == "rech") {
      return "Recherche";
    }
  },
  // Prénom de la presnne connecté
  prenomAccueil: function () {
    var sessionID = Session.get("userID");
    var find = Inscription.findOne({
      _id: sessionID
    });

    if (find) {
      return find.prenom;
    }
  },
  // Affiche l'auteur du message lors de la recherche
  rechercheMessageAuthor: function () {
    var sessionID = Session.get("userID");
    var id = Message.findOne({
      _id: this._id
    });

    if (id) {
      var idClient2 = id.idClient2;
      var inscription = Inscription.findOne({
        _id: idClient2
      });
    }

    var id = Message.findOne({
      _id: this._id
    });

    if (id) {
      var info = Inscription.findOne({
        _id: id.idClient1
      });

      if (sessionID != id.idClient1) {
        return info.nom + " " + info.prenom + " à Moi";
      } else {
        info = Inscription.findOne({
          _id: id.idClient2
        });
        return "Moi à " + inscription.nom + " " + inscription.prenom;
      }
    }
  },
  // Affiche l'heure du message trouvé dans la recherche
  rechercheMessageHours: function () {
    var sessionID = Session.get("userID");
    var id = Message.findOne({
      _id: this._id
    });

    if (id) {
      var time = id.hours;
      var date = new Date(time);
      var minutes = date.getMinutes();
      var hours = date.getHours();

      if (minutes < 10) {
        minutes = "0" + minutes;
      }

      if (hours < 10) {
        hours = "0" + hours;
      }

      return hours + ":" + minutes + " " + date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
    }
  }
});
Template.accueil.events({
  // Clique pour ajouter un nouveau contact
  'click .goAjouter': function (event) {
    event.preventDefault();
    event.stopPropagation();
    var identifiant = Inscription.findOne({
      _id: this._id
    });
    var id = identifiant._id;

    if (id) {
      Session.set("newContactID", id);
      Router.go('/newContact');
    }
  },
  // clique pour ajouter un nouveau contact depuis la recherche
  'click .goInscription': function () {
    var sessionID = Session.get("userID");
    var inscription = Inscription.findOne({
      _id: this._id
    });

    if (inscription) {
      var id = inscription._id;
      var contact = Contact.findOne({
        userIdNow: sessionID,
        contact: id
      });

      if (id != sessionID) {
        if (contact) {
          Session.set("contactID", id);
          Router.go('/message');
        } else {
          Session.set("newContactID", id);
          Router.go('/newContact');
        }
      }
    }
  },
  'click .goMessage': function () {
    var sessionID = Session.get("userID");
    var id = Message.findOne({
      _id: this._id
    });

    if (id) {
      if (sessionID == id.idClient1) {
        Session.set("contactID", id.idClient2);
        Router.go('/message');
      } else {
        Session.set("contactID", id.idClient1);
        Router.go('/message');
      }
    }
  },
  // Allez à la discussion depuis un message lors d'une recherche
  'click #goRecherche': function (event) {
    event.preventDefault();
    event.stopPropagation();
    var infoRecherche = $("#defaultRecherche").val();
    var sessionID = Session.get("userID");
    var findInscription = Inscription.find({
      $or: [{
        prenom: infoRecherche
      }, {
        nom: infoRecherche
      }, {
        age: infoRecherche
      }, {
        email: {
          $regex: infoRecherche
        }
      }, {
        pseudo: infoRecherche
      }]
    }).fetch();
    var findMessage = Message.find({
      $or: [{
        idClient1: sessionID
      }, {
        idClient2: sessionID
      }],
      message: {
        $regex: infoRecherche
      }
    }).fetch();

    if (findMessage || findInscription) {
      Session.set('rech', "rech");
    }

    Session.setPersistent('findInscription', findInscription);
    Session.setPersistent('findMessage', findMessage);
    $("#defaultRecherche").val('');
  },
  // Remet à 0 les variable de recherche quand on change de page depuis la navbar
  'click ul': function () {
    Session.set("findInscription", null);
    Session.set("findMessage", null);
    Session.set("rech", null);
    Session.set("infoRecherche", null);
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"connexion":{"template.connexion.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/connexion/template.connexion.js                                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //

Template.__checkName("connexion");
Template["connexion"] = new Template("Template.connexion", (function() {
  var view = this;
  return HTML.HTML({
    class: "html"
  }, "\n   ", HTML.DIV({
    class: "container col-sm-12 col-md-12 col-lg-12 connexionDivSize",
    id: function() {
      return Spacebars.mustache(view.lookup("background"));
    }
  }, "\n    ", HTML.FORM("\n      ", HTML.DIV({
    class: "form-group connexionDivlittle"
  }, "\n        ", Spacebars.include(view.lookupTemplate("default")), "\n        ", HTML.Raw('<label for="name">Pseudo :</label>'), "\n        ", HTML.Raw('<input class="form-control connexionInput" type="text" id="pseudoConnexion" name="pseudoConnexion">'), "\n        ", HTML.Raw('<label for="password">password : </label>'), "\n        ", HTML.Raw('<input class="form-control connexionInput" type="password" id="passwordConnexion" name="passwordConnexion">'), "\n        ", HTML.Raw("<br>"), "\n        ", HTML.Raw('<a href="" id="showPassword">Show Password</a>'), "\n        ", HTML.Raw("<br>"), "\n        ", HTML.Raw("<br>"), "\n        ", HTML.Raw('<input class="connexionButton" id="envoyer" value="Connexion" type="submit">'), "\n        ", HTML.Raw('<a class="connexionLinkInscription pull-right" href="/inscription">S\'inscrire</a>'), "\n      "), "\n    "), "\n  "), "\n  ");
}));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"connexion.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/connexion/connexion.js                                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Template.connexion.rendered = function () {
  document.title = "Connexion";
};

Template.connexion.events({
  'click #showPassword': function () {
    var x = document.getElementById("passwordConnexion");

    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  },
  'submit form': function (event) {
    event.preventDefault();
    event.stopPropagation();
    var pseudoConnexion = $('#pseudoConnexion').val();
    var passwordConnexion = $('#passwordConnexion').val();
    var controleUser = Inscription.findOne({
      pseudo: pseudoConnexion
    });

    if (controleUser) {
      var userIdNow = controleUser._id;
      var now = new Date();

      if (controleUser) {
        if (controleUser.password != passwordConnexion) {
          alert("Le pseudo ou le mot de passe n'est pas juste !");
        } else {
          var pseudoInscription = Inscription.findOne({
            pseudo: pseudoConnexion
          });

          if (pseudoInscription) {
            var alreadyConnexion = Connexion.findOne({
              userIdNow: pseudoInscription._id
            });
            var hours = new Date();

            if (!alreadyConnexion) {
              Meteor.call('deco', Session.get("userID"));
              Meteor.call('etatSession1', Session.get("userID"));
              var hash = {
                userIdNow: userIdNow,
                hours: now.getTime(),
                etatSession: true,
                deconnexion: 0
              };
              Session.setPersistent('userID', userIdNow);
              Meteor.call('connexion', hash);
              Meteor.call('etatCompte', userIdNow);
              Router.go('/accueil');
            } else {
              Meteor.call('etatSession1', Session.get("userID"));
              Meteor.call('deco', Session.get("userID"));
              Session.setPersistent('userID', userIdNow);
              Meteor.call('dec0', userIdNow);
              Meteor.call('etatCompte', userIdNow);
              Router.go('/accueil');
            }
          }
        }
      } else {
        alert("Le psueudo ou le mot de passe n'est pas juste !");
      }
    }
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"deconnexion":{"template.deconnexion.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/deconnexion/template.deconnexion.js                                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //

Template.__checkName("deconnexion");
Template["deconnexion"] = new Template("Template.deconnexion", (function() {
  var view = this;
  return HTML.DIV({
    class: "container"
  }, "\n  ", HTML.FORM("\n    ", HTML.DIV({
    class: "form-group"
  }, "\n        ", Spacebars.include(view.lookupTemplate("default")), "\n    "), "\n  "), "\n");
}));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"deconnexion.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/deconnexion/deconnexion.js                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Template.deconnexion.rendered = function () {
  document.title = "Déconnexion";

  if (Session.get("userID") == null) {
    Router.go('/connexion');
  }

  var sessionID = Session.get("userID");
  var find = Connexion.findOne({
    userIdNow: sessionID
  });

  if (!sessionID && sessionID != find.userIdNow) {
    Router.go('/connexion');
  } else {
    if (confirm("Tu veux te déconnecter")) {
      var sessionID = Session.get("userID");
      var heure = new Date();
      var heureDeco = heure.getTime();
      Meteor.call('deco', sessionID);
      Meteor.call('heureDeco', sessionID, heureDeco);
      Session.set("userID", null);

      if (Session.get("userID") == null) {
        Router.go('/connexion');
      }

      ;
    } else {
      Router.go('/accueil');
    }
  }
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"default":{"template.default.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/default/template.default.js                                                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //

Template.__checkName("default");
Template["default"] = new Template("Template.default", (function() {
  var view = this;
  return [ HTML.Raw('<head>\n    <meta name="viewport" content="width=device-width, initial-scale=1">\n  </head>\n\n\n  '), HTML.NAV({
    class: "navbar navbar-default navbar-fixed-top defaultNav"
  }, "\n    ", HTML.DIV({
    class: "container-fluid"
  }, "\n      ", HTML.Raw("<!-- Brand and toggle get grouped for better mobile display -->"), "\n      ", HTML.Raw('<div class="navbar-header">\n        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">\n          <span class="sr-only">Toggle navigation</span>\n          <span class="icon-bar"></span>\n          <span class="icon-bar"></span>\n          <span class="icon-bar"></span>\n        </button>\n        <a class="navbar-brand" href="#">Menu</a>\n      </div>'), "\n\n      ", HTML.Raw("<!-- Collect the nav links, forms, and other content for toggling -->"), "\n      ", HTML.DIV({
    class: "collapse navbar-collapse",
    id: "bs-example-navbar-collapse-1"
  }, "\n        ", HTML.UL({
    class: "nav navbar-nav"
  }, "\n          ", Blaze.If(function() {
    return Spacebars.call(view.lookup("sessionId"));
  }, function() {
    return [ "\n          ", HTML.LI({
      class: function() {
        return Spacebars.mustache(view.lookup("isActiveRoute"), "connexion");
      }
    }, HTML.A({
      href: "/connexion"
    }, "Connexion")), "\n          ", HTML.LI({
      class: function() {
        return Spacebars.mustache(view.lookup("isActiveRoute"), "inscription");
      }
    }, HTML.A({
      href: "/inscription"
    }, "Insciption")), "\n          " ];
  }, function() {
    return [ "\n          ", HTML.LI({
      class: function() {
        return Spacebars.mustache(view.lookup("isActiveRoute"), "accueil");
      }
    }, HTML.A({
      href: "/accueil"
    }, "Accueil")), "\n          ", HTML.LI({
      class: function() {
        return [ Spacebars.mustache(view.lookup("isActiveRoute"), "discussion"), "  ", Spacebars.mustache(view.lookup("isActiveRoute"), "message") ];
      }
    }, "\n            ", Blaze.If(function() {
      return Spacebars.call(view.lookup("notif"));
    }, function() {
      return [ "\n            ", HTML.DIV({
        class: "rondInscr"
      }), "\n            ", HTML.A({
        href: "/discussion"
      }, "Discussion"), "\n             " ];
    }, function() {
      return [ "\n            ", HTML.A({
        href: "/discussion"
      }, "Discussion"), "\n            " ];
    }), "\n          "), "\n          ", HTML.LI({
      class: function() {
        return Spacebars.mustache(view.lookup("isActiveRoute"), "contact");
      }
    }, HTML.A({
      href: "/contact"
    }, "Contact")), "\n          ", HTML.LI({
      class: function() {
        return Spacebars.mustache(view.lookup("isActiveRoute"), "deconnexion");
      }
    }, HTML.A({
      href: "/deconnexion"
    }, "Déconnexion")), "\n          ", HTML.LI("\n            ", HTML.FORM({
      class: "navbar-form navbar-left defaultForm"
    }, "\n            ", HTML.DIV({
      class: "input-group"
    }, "\n              ", HTML.INPUT({
      type: "text",
      name: "recherche",
      id: "defaultRecherche",
      class: "form-control",
      placeholder: "Search"
    }), "\n              ", HTML.DIV({
      class: "input-group-btn"
    }, "\n                ", HTML.BUTTON({
      class: "btn btn-default",
      id: "goRecherche",
      type: "submit"
    }, "\n             ", HTML.I({
      class: "glyphicon glyphicon-search"
    }), "\n           "), "\n              "), "\n            "), "\n          "), "\n        "), "\n        " ];
  }), "\n        "), "\n      "), HTML.Raw("<!-- /.navbar-collapse -->"), "\n    "), HTML.Raw("<!-- /.container-fluid -->"), "\n  ") ];
}));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"default.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/default/default.js                                                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Template.default.rendered = function () {
  Session.set("recherche", '');
  var sessionID = Session.get("userID");
  $("html").on("mouseleave", function () {
    var heure = new Date();
    var heureDeco = heure.getTime();
    Meteor.call('heureDeco', sessionID, heureDeco);
    Meteor.call('etatSession1', sessionID);
  });
  $("html").on("mouseenter", function () {
    Meteor.call('dec0', sessionID);
    Meteor.call('etatSession2', sessionID);
  });
};

Template.default.helpers({
  // Notification dans la navbar
  notif: function () {
    var sessionID = Session.get("userID");

    if (sessionID != null) {
      var session = Message.findOne({
        idClient2: sessionID,
        notification: true
      });

      if (session) {
        return session;
      }
    }
  },
  sessionId: function () {
    if (Session.get('userID') == null || Session.get('userID') == undefined) {
      return true;
    }
  }
});
Template.default.events({
  'click #goRecherche': function (event) {
    event.preventDefault();
    event.stopPropagation();
    var infoRecherche = $("#defaultRecherche").val();
    Session.set('infoRecherche', infoRecherche);
    $("#defaultRecherche").val('');
    Session.set('rech', "rech");
    Router.go('/accueil');
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"inscription":{"template.inscription.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/inscription/template.inscription.js                                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //

Template.__checkName("inscription");
Template["inscription"] = new Template("Template.inscription", (function() {
  var view = this;
  return HTML.HTML({
    class: "html"
  }, "\n  ", HTML.DIV({
    class: "container"
  }, "\n    ", HTML.FORM({
    class: "col-sm-12 col-md-12 col-lg-12"
  }, "\n      ", HTML.DIV({
    class: "form-group",
    id: "inscriptionDiv"
  }, "\n          ", HTML.DIV({
    class: "form-group"
  }, "\n              ", Spacebars.include(view.lookupTemplate("default")), "\n        "), "\n        ", HTML.Raw('<label for="name">Nom :</label>'), "\n        ", HTML.Raw('<input class="form-control" type="text" id="name" name="name">'), "\n        ", HTML.Raw('<label for="prenom">Prénom </label>'), "\n        ", HTML.Raw('<input class="form-control" type="text" id="prenom" name="prenom">'), "\n        ", HTML.Raw('<label for="age">Date de naissance :</label>'), "\n        ", HTML.Raw('<input class="form-control" type="date" id="age" name="age">'), "\n        ", HTML.Raw('<label for="email">E-mail :</label>'), "\n        ", HTML.Raw('<input class="form-control" type="email" id="email" name="email">'), "\n        ", HTML.Raw('<label for="prenom">Pseudo </label>'), "\n        ", HTML.Raw('<input class="form-control" type="text" id="pseudo" name="pseudo">'), "\n        ", HTML.Raw('<label for="password">password : </label>'), "\n        ", HTML.Raw('<input class="form-control" type="password" id="mdp1" name="mdp1">'), "\n        ", HTML.Raw('<a id="showPassword1">Show Password</a>'), "\n        ", HTML.Raw("<br>"), "\n        ", HTML.Raw('<label for="password">password :</label>'), "\n        ", HTML.Raw('<input class="form-control" type="password" id="mdp2" name="mdp2">'), "\n        ", HTML.Raw('<a id="showPassword2">Show Password</a>'), "\n        ", HTML.Raw("<br>"), "\n        ", HTML.Raw("<br>"), "\n        ", HTML.Raw('<input class="inscriptionButton" id="inscription" value="S\'inscrire" type="submit">'), "\n        ", HTML.Raw('<a class="inscriptionLinkConnexion" href="/connexion">Connexion</a>'), "\n      "), "\n    "), "\n  "), "\n");
}));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"inscription.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/inscription/inscription.js                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Template.inscription.rendered = function () {
  document.title = "Insciption";
};

Template.inscription.events({
  'click #showPassword1': function () {
    event.preventDefault();
    event.stopPropagation();
    var x = document.getElementById("mdp1");

    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  },
  'click #showPassword2': function () {
    event.preventDefault();
    event.stopPropagation();
    var x = document.getElementById("mdp2");

    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  },
  'submit form': function (event) {
    event.preventDefault();
    event.stopPropagation();
    var mdp1 = $('#mdp1').val();
    var mdp2 = $('#mdp2').val();
    var pseudo = $('#pseudo').val();
    var pseudoDb = Inscription.findOne({
      pseudo: pseudo
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
            Meteor.call('insertInscription', hash, function (error, result) {
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
      }

      ;
    } else {
      alert("Vos mots de passe ne sont pas identiques ! ");
    }
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"layoutDefault":{"template.LayoutDefault.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/layoutDefault/template.LayoutDefault.js                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //

Template.__checkName("layoutDefault");
Template["layoutDefault"] = new Template("Template.layoutDefault", (function() {
  var view = this;
  return HTML.HTML({
    class: "html"
  }, "\n   ", HTML.DIV({
    class: "container connexionDivSize",
    id: function() {
      return Spacebars.mustache(view.lookup("background"));
    }
  }, "\n    ", HTML.FORM({
    class: "connexionForm"
  }, "\n      ", HTML.DIV({
    class: "form-group connexionDivlittle"
  }, "\n        ", Spacebars.include(view.lookupTemplate("default")), "\n        ", HTML.Raw('<label for="name">Pseudo :</label>'), "\n        ", HTML.Raw('<input class="form-control connexionInput" type="text" id="pseudoConnexion" name="pseudoConnexion">'), "\n        ", HTML.Raw('<label for="password">password : </label>'), "\n        ", HTML.Raw('<input class="form-control connexionInput" type="password" id="passwordConnexion" name="passwordConnexion">'), "\n        ", HTML.Raw("<br>"), "\n        ", HTML.Raw('<button id="showPassword">Show Password</button>'), "\n        ", HTML.Raw("<br>"), "\n        ", HTML.Raw("<br>"), "\n        ", HTML.Raw('<input class="connexionButton" id="envoyer" value="Connexion" type="submit">'), "\n        ", HTML.Raw('<a class="connexionLinkInscription" href="/inscription">S\'inscrire</a>'), "\n      "), "\n    "), "\n  "), "\n  ");
}));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"LayoutDefault.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/layoutDefault/LayoutDefault.js                                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Template.layoutDefault.rendered = function () {
  document.title = "Connexion";
};

Template.layoutDefault.events({
  'click #showPassword': function () {
    var x = document.getElementById("passwordConnexion");

    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  },
  'submit form': function (event) {
    event.preventDefault();
    event.stopPropagation();
    var pseudoConnexion = $('#pseudoConnexion').val();
    var passwordConnexion = $('#passwordConnexion').val();
    var controleUser = Inscription.findOne({
      pseudo: pseudoConnexion
    });

    if (controleUser) {
      var userIdNow = controleUser._id;
      var now = new Date();

      if (controleUser) {
        if (controleUser.password != passwordConnexion) {
          alert("Le pseudo ou le mot de passe n'est pas juste !");
        } else {
          var pseudoInscription = Inscription.findOne({
            pseudo: pseudoConnexion
          });

          if (pseudoInscription) {
            var alreadyConnexion = Connexion.findOne({
              userIdNow: pseudoInscription._id
            });
            var hours = new Date();

            if (!alreadyConnexion) {
              Meteor.call('deco', Session.get("userID"));
              Meteor.call('etatSession1', Session.get("userID"));
              var hash = {
                userIdNow: userIdNow,
                hours: now.getTime(),
                etatSession: true,
                deconnexion: 0
              };
              Session.setPersistent('userID', userIdNow);
              Meteor.call('connexion', hash);
              Meteor.call('etatCompte', userIdNow);
              Router.go('/accueil');
            } else {
              Meteor.call('etatSession1', Session.get("userID"));
              Meteor.call('deco', Session.get("userID"));
              Session.setPersistent('userID', userIdNow);
              Meteor.call('dec0', userIdNow);
              Meteor.call('etatCompte', userIdNow);
              Router.go('/accueil');
            }
          }
        }
      } else {
        alert("Le psueudo ou le mot de passe n'est pas juste !");
      }
    }
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"template.not_found.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/template.not_found.js                                                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //

Template.__checkName("notFound");
Template["notFound"] = new Template("Template.notFound", (function() {
  var view = this;
  return HTML.Raw('<h1>Test not found</h1>\n  <a href="/inscription">S\'inscrire</a>\n  <br>\n  <a href="/connexion">Se connecter</a>');
}));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"lib.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// client/lib/lib.js                                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
//
// Client side activity detection for the session timeout
// - depends on jquery
//
// Meteor settings:
// - staleSessionHeartbeatInterval: interval (in ms) at which activity heartbeats are sent up to the server
// - staleSessionActivityEvents: the jquery events which are considered indicator of activity e.g. in an on() call.
//
var heartbeatInterval = Meteor.settings && Meteor.settings.public && Meteor.settings.public.staleSessionHeartbeatInterval || 3 * 60 * 1000; // 3mins

var activityEvents = Meteor.settings && Meteor.settings.public && Meteor.settings.public.staleSessionActivityEvents || 'mousemove click keydown';
var activityDetected = false;
Meteor.startup(function () {
  //
  // periodically send a heartbeat if activity has been detected within the interval
  //
  Meteor.setInterval(function () {
    var inscription = Inscription.find().fetch();

    var ids = _.pluck(inscription, '_id');

    var sessionID = Session.get("userID");

    if (sessionID && activityDetected) {
      Meteor.call('heartbeat', sessionID);
      activityDetected = false;
    }

    if (ids && activityDetected) {
      Meteor.call('heartbeat', ids);
      activityDetected = false;
    }
  }, heartbeatInterval); //
  // detect activity and mark it as detected on any of the following events
  //

  $(document).on(activityEvents, function () {
    activityDetected = true;
  });
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"Router":{"router.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// Router/router.js                                                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Router.configure({
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound'
});
Router.route('/', {
  name: 'LayoutDefault'
});
Router.route('/accueil', {
  name: 'accueil'
});
Router.route('/connexion', {
  name: 'connexion'
});
Router.route('/contact', {
  name: 'contact'
});
Router.route('/deconnexion', {
  name: 'deconnexion'
});
Router.route('/discussion', {
  name: 'discussion'
});
Router.route('/inscription', {
  name: 'inscription'
});
Router.route('/newContact', {
  name: 'newContact'
});
Router.route('/message', {
  name: 'message'
});
Router.route('/modifier', {
  name: 'modifier'
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"collection":{"collection.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// collection/collection.js                                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Connexion = new Mongo.Collection("connexion");
Contact = new Mongo.Collection("contact");
Inscription = new Mongo.Collection("inscription");
Message = new Mongo.Collection("message");
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},{
  "extensions": [
    ".js",
    ".json",
    ".html",
    ".css"
  ]
});
require("/client/Chat/Discussion/template.discussion.js");
require("/client/Chat/message/template.message.js");
require("/client/Chat/message/template.message_droite.js");
require("/client/Chat/message/template.message_gauche.js");
require("/client/Contact/contact/template.contact.js");
require("/client/Contact/newContact/template.newContact.js");
require("/client/accueil/template.accueil.js");
require("/client/connexion/template.connexion.js");
require("/client/deconnexion/template.deconnexion.js");
require("/client/default/template.default.js");
require("/client/inscription/template.inscription.js");
require("/client/layoutDefault/template.LayoutDefault.js");
require("/client/template.not_found.js");
require("/client/lib/lib.js");
require("/client/Chat/Discussion/discussion.js");
require("/client/Chat/message/message.js");
require("/client/Chat/message/message_droite.js");
require("/client/Chat/message/message_gauche.js");
require("/client/Contact/contact/contact.js");
require("/client/Contact/newContact/newContact.js");
require("/client/accueil/accueil.js");
require("/client/connexion/connexion.js");
require("/client/deconnexion/deconnexion.js");
require("/client/default/default.js");
require("/client/inscription/inscription.js");
require("/client/layoutDefault/LayoutDefault.js");
require("/Router/router.js");
require("/collection/collection.js");