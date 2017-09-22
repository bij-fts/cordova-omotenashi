// var host = 'http://localhost:8080';
var host = 'http://8880d8e6.ngrok.io';
var apiURL = host + '/api';

var storage = window.localStorage;

var userObj = null;
var tables = null;
var tablesFetched = false;

var app = {
  initialize: function() {
    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
  },
  onDeviceReady: function() {
    this.receivedEvent('deviceready');
  },
  receivedEvent: function(id) {

  }
}.initialize();

var sammyApp = Sammy('#app_main', function() {
  this.use('Handlebars', 'hb');

  this.get('#/', function(context) {
    context.log('login page');
    context.app.swap('');
    context.render('templates/login.hb')
      .appendTo(context.$element());
  });

  this.post('#/', function(context) {
    $('#loginBtn').prop('disabled', true);
    var data = $("#loginForm").serialize();

    $.ajax({
      url: apiURL+'/authenticate/login',
      type: 'POST',
      data: data,
      statusCode: {
        401:function(response){
          alert("invalid username or password.");
          $('#loginBtn').prop('disabled', false);
        },
        200:function(response){
          storage.setItem('api_token', response.token);
          storage.setItem('user_data', JSON.stringify(response.user));
          if(storage.getItem('api_token')) {
            storage.setItem('logged_in', 1);
            context.redirect('#/tables');
          }
        }
      }
    });
  });

  this.get('#/tables', function(context) {
    if(parseInt(storage.getItem('logged_in')) === 1) {
      context.log('tables');
      context.app.swap('');

      this.load(apiURL + '/tables', {
        headers: {
          'Authorization':'Bearer ' + storage.getItem('api_token')
        },
        type: 'GET',
        dataType: 'json'
      })
      .then(function(tables) {

        this.load('templates/header.hb')
          .then(function(partial) {
            context.partials = {header: partial};
            context.tables = tables;
            context.partial('templates/tables.hb');
          });

      });
    }else {
      context.redirect('#/');
    }
  });

  this.get('#/tables/:table', function(context) {
    var table_id = context.params.table;
    context.log('select kitchen');
    context.app.swap('');

    this.load(apiURL + '/kitchens', {
      headers: {
        'Authorization':'Bearer ' + storage.getItem('api_token')
      },
      type: 'GET',
      dataType: 'json'
    })
    .then(function(kitchens) {
      context.table_id = table_id;

      this.load('templates/header.hb')
        .then(function(partial) {
          context.partials = {header: partial};
          context.kitchens = kitchens;
          context.partial('templates/kitchens.hb');
        });

    });

  });

  this.get('#/kitchens/:id/categories', function(context) {
    var kitchen_id = context.params.id;
    context.log('select category');
    context.app.swap('');

    this.load(apiURL + '/menus/all', {
      headers: {
        'Authorization':'Bearer ' + storage.getItem('api_token')
      },
      type: 'GET',
      dataType: 'json'
    })
    .then(function(response) {
      var categories = response.kitchens[kitchen_id - 1].categories;

      this.load('templates/header.hb')
        .then(function(partial) {
          context.partials = {header: partial};
          context.categories = categories;
          context.partial('templates/categories.hb');
        });
    });

  });

  this.get('#/categories/:id/menu', function(context) {
    var category_id = context.params.id;
    context.log('select menu');
    context.app.swap('');

    this.load(apiURL + '/menus/category/' + category_id, {
      headers: {
        'Authorization':'Bearer ' + storage.getItem('api_token')
      },
      type: 'GET',
      dataType: 'json'
    })
    .then(function(menus) {
      this.load('templates/header.hb')
        .then(function(partial) {
          context.partials = {header: partial};
          context.menus = menus;
          context.partial('templates/menus.hb');
        });
    });

  });

  this.get('#/logout', function(context) {
    closeNav();
    storage.clear();
    storage.setItem('logged_in', 0);
    context.redirect('#/');
  });

});

jQuery(function() {
  storage.removeItem('logged_in');
  storage.setItem('logged_in', 0);
  sammyApp.run('#/');

  $('#loginForm').submit(function(event) {
    event.preventDefault();
  });



});
