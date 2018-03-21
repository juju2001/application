(function(){Router.configure({
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
});


Router.route('/inscription', {
  name: 'inscription'
});


Router.route('/connexion', {
  name: 'connexion'
});

Router.route('/accueil', {
  name: 'accueil'
});

Router.route('/message', {
  name: 'message'
});

Router.route('/contact', {
  name: 'contact'
});

Router.route('/newContact', {
  name: 'newContact'
});

Router.route('/discussion', {
  name: 'discussion'
});

Router.route('/deconnexion', {
  name: 'deconnexion'
});

Router.route('/profil', {
  name: 'profil'
});

Router.route('/modifier', {
  name: 'modifier'
});

}).call(this);
