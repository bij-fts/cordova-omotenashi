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

/* Generic Object */
function Tray() {
  this.ordered_by = null;
  this.table_id = null;
  this.order_total = 0;
  this.notes = null;
  this.orders = [];
}
function getUser() { return getLocal('user_data'); }
function getUserData(key) { var user = getLocal('user_data'); return user[key]; }
function addItem() {
  var x = $('#order_form');
  var price = parseFloat(x.find('#menu_price').val());
  var table_id = parseInt(x.find('#table_id').val());
  var menu_id = parseInt(x.find('#menu_id').val());
  var qty = parseInt(x.find('#quantity').val());
  var menu = x.find('#menu_name').val();
  var notes = x.find('#notes').val();

  var trays = getJSON('trays');
  var tray = trays[getObjectIndex(getJSON('trays'), 'table_id', table_id)];

  var item = {
    "cancelled":false,
    "menu_id":menu_id,
    "notes":notes,
    "price":price,
    "menu":menu,
    "qty":qty
  };

  tray.orders.push(item);

  document.getElementById('order_form').reset();
  $('#orderModal').modal('hide');
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

function getOrder(table_id) { var trays = getLocal('trays'); return getObject(trays, 'table_id', parseInt(table_id)); }

function getTray(table_id) { var trays = getJSON('trays'); return getObject(trays, 'table_id', parseInt(table_id)); }
function setTray(tray) {
  var trays = getJSON('trays');
  var index = getObjectIndex(trays, 'table_id', tray.table_id);

  trays[index] = null;
  trays[index] = tray;

  setLocal('trays', JSON.stringify(trays));
}

function getJSON(name) { return JSON.parse(getLocal(name)); }

function getLocal(name) { return local.getItem(name); }
function setLocal(name, value) { local.setItem(name, value); }

function getObject(obj_arr, obj_key, obj_val) {
  var object = getObjectIndex(obj_arr, obj_key, obj_val);
  object = obj_arr[object];
  return object != null ? object : null;
}

function getObjectIndex(obj_arr, obj_key, obj_val) {
  for(var index = 0; index < obj_arr.length; index++) {
    if(obj_arr[index][obj_key] == obj_val) return index;
  }
  return null;
}

function pushObject(obj_arr, obj_key, obj) { var stored_object = findObject(object_array, obj_key, object[obj_key]); }

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

  for(var index = 0; index < tray.orders.length; index++) {
    console.log(tray.orders[index]); 
    if(!tray.orders[index].cancelled) {

      total += parseFloat(tray.orders[index].price * tray.orders[index].qty);
    }
  }

  tray.order_total = total;
  $('.quick-total #order_total').html(forHumans(tray.order_total));
  setTray(tray);
}

function forHumans(price) { return numeral(parseFloat(price)).format('0,0.00'); }

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
        // SpinnerPlugin.activityStart("Loading...", options);
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
          }).then(function(data) {
            setLocal('data', data);
            context.load(apiURL + '/tables', {
              method: 'GET',
              headers: {
                'Authorization':'Bearer ' + getLocal('api_token')
              }
            }).then(function(tables) {
              // Create local trays
              setLocal('tables', tables);
              var trays = [];
              var t = getJSON('tables');

              for(var i = 0; i < t.length; i++) {
                var tray = new Tray();

                tray.table_id = t[i].id;
                trays.push(tray);
              }
              // fetchTrays(); // live
              console.log(trays.length);
              setLocal('trays', JSON.stringify(trays));
              // SpinnerPlugin.activityStop();
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
          context.tables = JSON.parse(getLocal('tables'));
          
          context.partial('templates/tables.hb');
        }
      );
    }else context.redirect('#/');
  });

  this.get('#/tables/:table', function(context) {
    if(auth()) {
      context.app.swap('');
      var data = getJSON('data');
      var kitchens = data.kitchens;

      this.load('templates/header.hb').then(
        function(partial) {
          context.partials = {header: partial};

          context.table_id = parseInt(context.params.table);
          context.headerText = "Select Store";
          context.kitchens = kitchens;

          context.partial('templates/kitchens.hb');
        }
      );
    }else context.redirect('#/');

  });

  this.get('#/tables/:table/:kitchen', function(context) {
    if(auth()) {
      context.app.swap('');
      var data = getJSON('data');
      data = getObject(data.kitchens, 'id', parseInt(context.params.kitchen));
      var categories = data.categories;

      this.load('templates/header.hb').then(
        function(partial) {
          context.partials = {header: partial};

          context.table_id = parseInt(context.params.table);
          context.kitchen_id = parseInt(context.params.kitchen);
          context.headerText = "Select Menu";
          context.categories = categories;
          
          context.partial('templates/categories.hb');
        }
      );
    }else context.redirect('#/');

  });

  this.get('#/tables/:table/:kitchen/:category', function(context) {
    if(auth()) {
      context.app.swap('');
      var data = getJSON('data');
      data = getObject(data.kitchens, 'id', parseInt(context.params.kitchen));
      data = getObject(data.categories, 'id', parseInt(context.params.category));
      var menus = data.menus;

      this.load('templates/header.hb').then(
        function(partial) {
          context.partials = {header: partial};

          context.table_id = parseInt(context.params.table);
          context.kitchen_id = parseInt(context.params.kitchen);
          context.category_id = parseInt(context.params.category);
          context.headerText = "Select Item";
          context.order_total = getTray(context.table_id);
          context.menus = menus;
          
          context.partial('templates/menus.hb');
        }
      );
    }else context.redirect('#/');

  });

  this.get('#/tray/:table', function(context) {
    if(auth()) {
      this.load('templates/header.hb').then(
        function(partial) {
          context.partials = {header: partial};

          context.table_id = context.params.table;
          context.headerText = "Table "+context.table_id+"Tray";
          context.tray = getTray(context.table_id);

          context.partial('templates/tray.hb');
        }
      );
    }else context.redirect('#/');
  });

  this.get('#/logout', function(context) {
    if(auth()) {
      closeNav();
      local.clear();
      setLocal('logged_in', 0);
      context.redirect('#/');
    }
  });

});

/* Handlebars Helper Functions */
Handlebars.registerHelper('forHumans', function(object) {
  return numeral(parseFloat(object)).format('0,0.00');
});