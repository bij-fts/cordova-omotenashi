// var host = 'http://192.168.43.128/omotenashi-api/public';
var host = 'http://localhost/omotenashi-api/public';
var apiURL = host + '/api';

var storage = window.localStorage;

var userObj = null;
var tables = null;
var tablesFetched = false;

var app = {
  // Application Constructor
  initialize: function() {
    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
  },

  // Bind any cordova events here. Common events are:
  // 'pause', 'resume', etc.
  onDeviceReady: function() {
    this.receivedEvent('deviceready');
  },

  // Update DOM on a Received Event
  receivedEvent: function(id) {

  }
}.initialize();

var sammyApp = Sammy('#app_main', function() {
  this.use('Handlebars', 'hb');
  this.use('Session');

  this.get('#/', function(context) {
    context.app.swap('');
    context.render('templates/login.hb')
      .appendTo(context.$element());
  });

  this.post('#/', function(context) {
    $('#loginBtn').prop('disabled', true);
    var data = $("#loginForm").serialize();

    $.ajax({
      url: apiURL+'/authenticate/login', // may differ in you machine
      type: 'POST',
      data: data,
      statusCode: {
        401:function(response){
          alert("invalid username or password.");
          $('#loginBtn').prop('disabled', false);
        },
        200:function(response){
          // context.log(response);
          storage.setItem('api_token', response.token);
          storage.setItem('user_data', JSON.stringify(response.user));
          if(storage.getItem('api_token')) {
            storage.setItem('logged_in', 1);

            context.load(apiURL + '/menus/all', {
              headers: {
                'Authorization':'Bearer ' + storage.getItem('api_token')
              },
              type: 'GET',
              dataType: 'json'
            })
            .then(function(response) {
              console.log(JSON.stringify(response));
              // storage.setItem('kitchens', JSON.stringify(kitchens));
            })
            .then(function() {
              context.redirect('#/tables');
            });
          }
        }
      }
    });
  });

  this.get('#/tables', function(context) {
    if(parseInt(storage.getItem('logged_in')) === 1) {
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
            context.headerText = 'Select Table';
            context.partial('templates/tables.hb');
          });

      });
    }else {
      context.redirect('#/');
    }
  });

  this.get('#/tables/:id', function(context) {
    var table_id = context.params.id;

    context.app.swap('');

    if(storage.getItem('kitchens') === null) {
      this.load(apiURL + '/kitchens', {
        headers: {
          'Authorization':'Bearer ' + storage.getItem('api_token')
        },
        type: 'GET',
        dataType: 'json'
      })
      .then(function(kitchens) {
        storage.setItem('kitchens', JSON.stringify(kitchens));
      });
    }

    this
    .load('templates/header.hb')
    .then(function(partial) {
      context.partials = {header: partial};
      context.headerText = 'Select Store';
      context.kitchens = JSON.parse(storage.getItem('kitchens'));
      context.partial('templates/kitchens.hb');
    });

  });

  this.get('#/kitchens/:id/categories', function(context) {
    var kitchen_id = context.params.id;
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

  this.bind('update-order', function() {
    var total = 0;
    // $.each()

  });

  this.get('#/tray', function(context){


    this.load('', {

    })
    .then(function() {

    });

  });

  this.post('#/tray', function(context) {


    // this.trigger('update-order');
  });

  this.get('#/logout', function(context) {
    storage.removeItem('api_token');
    storage.removeItem('user_data');
    storage.removeItem('logged_in');
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

function addOrder(id) {
  console.log('Ordered menu id: '+id);
}

function json_decode(json_string) {
  return JSON.parse(json_string);
}
