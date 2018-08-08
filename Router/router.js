Router.configure({
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
});

Router.route('/', {
  name : 'LayoutDefault'
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
