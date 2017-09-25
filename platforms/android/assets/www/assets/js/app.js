var host = 'https://ddaef8be.ngrok.io';
var apiURL = host + '/api';

/* "Namespace" */
var local = window.localStorage;

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

jQuery(function() {
  local.clear();
  setLocal('logged_in', 0);
  sammyApp.run('#/');

  $('#loginForm').submit(function(event) {
    event.preventDefault();
  });
});

/* Object Prototype */
function tray() {
  this.ordered_by = null;
  this.table_id = null;
  this.order_total = 0;
  this.notes = null;
  this.orders = [];
}

function getUser() { return getLocal('user_data'); }
function getUserData(key) { var user = getLocal('user_data'); return user[key]; }

function addItem() {
  // grab modal data


  var tray = getTray(table_id);

  // do stuff

  var item = {
    "cancelled":false,
    "menu_id":menu_id,
    "notes":notes,
    "price":price,
    "menu":menu,
    "qty":qty
  };

  tray.orders.push(item);

  console.log(JSON.stringify(tray));

  updateTotal(tray);
  console.log(JSON.stringify(getLocal('trays')));
  setTray(tray);
  console.log(JSON.stringify(getLocal('trays')));
}

function auth() { return parseInt(getLocal('logged_in')) ? true : false; }

function placeOrder() {
  confirm(1);
  /*
  insert cordova confirm dialog, callback -> confirm
  */
}

function confirm(selection) {
  if(selection) {
    // get tray

    var data = JSON.parse(JSON.stringify(tray));

    $.ajax({
      url: apiUrl + 'orders',
      method: 'POST',
      data: data,
      headers: {
        'Authorization':'Bearer ' + getLocal('api_token')
      },
      success: function(response) {
        window.location.href = "#/tables";
      },
      error: function(response) {
        alert("Failed to place Order");
      }
    });
  }
}

function removeItem(table_id, item_id) {
  var tray = getTray(table_id);
  var item = getItem(tray, item_id);

  item.cancelled = true;
  updateTotal(tray);
}

function editItem(table_id, data) {
  var tray = getTray(table_id);
  var item = getItem(tray, data.menu_id);

  // replace item's data
  // item.price = data.price;
  item.notes = data.notes;
  item.qty = data.qty;
}

// Shorthand functions
function getItems(table_id) { var tray = getTray(parseInt(table_id)); return tray.orders; }
function getItem(tray, item_id) { return getObject(tray.orders, 'menu_id', parseInt(item_id)); }

function getOrder(table_id) { var trays = getLocal('trays'); return getobject(trays, 'table_id', parseInt(table_id)); }

function getTray(table_id) { var trays = getLocal('trays'); return getObject(trays, 'table_id', parseInt(table_id)); }
function setTray(tray) {
  var trays = getLocal('trays');
  var index = getObjectIndex(tray.table_id);

  trays[index] = null;
  trays[index] = tray;

  setLocal('trays', tray);
}

function getLocal(name) { return local.getItem(name); }
function setLocal(name, value) { local.setItem(name, value); }

function getObject(object_array, obj_key, obj_val) {
  var object = getObjectIndex(object_array, obj_key, obj_val);
  object = object_array[object];
  return object != null ? object : null;
}

function getObjectIndex(object_array, obj_key, obj_val) {
  for(var index = 0; index < object_array.length; index++)
  if(object_array[index]['object_key'] == obj_val)
  return index;

  return null;
}

function pushObject(object_array, obj_key, object) { var stored_object = findObject(object_array, obj_key, object[obj_key]); }

function fetchTrays() {
  $.ajax({
    url: apiUrl + 'orders/fetch',
    method: 'GET',
    headers: {
      'Authorization' : 'Bearer ' + getLocal('api_token')
    },
    success: function(response) {
      // var trays = JSON.stringify(response);
      // setLocal('trays', trays);
    },
    error: function(response) {
      alert('Failed to fetch trays!');
    }
  });
}

/* UI Helper Functions */
function updateTotal(tray) {
  var total = 0;

  for(var index = 0; index < tray.orders.length; index++)
  if(!tray.orders[index].cancelled)
  total += parseInt(tray.orders[index].price);

  return total;
}

function makePrice(price) { return numeral(parseFloat(price)).format('0,0.00'); }

var sammyApp = Sammy('#app_main', function() {
  this.use('Handlebars', 'hb');

  this.get('#/', function(context) {
    context.app.swap('');
    context.render('templates/login.hb').appendTo(context.$element());
  });

  this.post('#/', function(context) {    
    $('#loginBtn').prop('disabled', true);
    var data = $("#loginForm").serialize();

    $.ajax({
      url: apiURL+'/authenticate/login',
      type: 'POST',
      data: data,
      beforeSend: function(request) {
        var options = { dimBackground: true };
        SpinnerPlugin.activityStart("Loading...", options);
      },
      statusCode: {
        401:function(response){
          // TODO: Add a dialog for Invalid Credentials

          $('#loginBtn').prop('disabled', false);
        },
        200:function(response){

          setLocal('api_token', response.token);
          setLocal('user_data', JSON.stringify(response.user));
          setLocal('logged_in', 1);

          context.load(apiURL + '/fetch', {
            method: 'GET',
            headers: {
              'Authorization':'Bearer ' + getLocal('api_token')
            }
          }).then(function(all) {
            setLocal('data', JSON.stringify(all));
            context.load(apiURL + '/tables', {
              method: 'GET',
              headers: {
                'Authorization':'Bearer ' + getLocal('api_token')
              }
            }).then(function(tables) {
              var trays = [];
              for(var i = 0; i < tables.length; i++) {
                trays[i] = new tray();
              }
              setLocal('tables', JSON.stringify(tables));
              SpinnerPlugin.activityStop();
            }).then(function() {
              context.redirect('#/tables');
            })
          })

        }
      }
    });
  });

  this.get('#/tables', function(context) {
    if(auth()) {
      context.app.swap('');

      this.load('templates/header.hb').then(
        function(partial) {
          context.partials = {header: partial};

          context.headerText = "Select Table";
          context.tables = getLocal('tables');
          
          context.partial('templates/tables.hb');
        }
      );
    }else context.redirect('#/');
  });

  this.get('#/tables/:table', function(context) {
    var table_id = context.params.table;
    context.app.swap('');


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

