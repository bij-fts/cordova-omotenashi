var host = window.localStorage.getItem('host');
var local = window.localStorage;
var socket = io(host + ':3000');
var DEBUG = true;

function appLog(t) {
  var c = window.localStorage.getItem('log');
  if(c.length < 1) c='['+moment().format('llll')+'] '+t+'\n';
  else c+='['+moment().format('llll')+'] '+t+'\n';
  window.localStorage.setItem('log', c);
}

var app = {
  initialize: function() { document.addEventListener('deviceready', this.onDeviceReady.bind(this), false); },
  onDeviceReady: function() { this.receivedEvent('deviceready');
    DEBUG = false;
    document.addEventListener("backbutton", onBackKeyDown, false);
    document.addEventListener("offline", onOffline, false);
    document.addEventListener("online", onOnline, false);
    /* START */
    cordova.plugins.notification.local.on('trigger', function (notification) {
      // Tell Node Server specified device received notification
      navigator.vibrate([1000,1000,1000]);
      socket.emit('notification/received', device.uuid);
    }, this);

    cordova.plugins.notification.local.on('click', function (notification) {
      // Redirect to page in waiter app that displays all "completed" orders
      // console.log(notification);
      var data = JSON.parse(notification.data);
      var table_id = parseInt(data.table_id);

      window.location.assign('#/orders/' + table_id);
    }, this);
    /* END */
    jQuery(function() {
      sammyApp.run('#/tables');
      $('#loginForm').submit(function(event) {
        event.preventDefault();
      });
    });
  },
  receivedEvent: function(id) {}
}.initialize();

jQuery(function() {
  sammyApp.run('#/tables');
  $('#loginForm').submit(function(event) {
    event.preventDefault();
  });
});

function onBackKeyDown(event) {
  event.preventDefault();

  if(window.location.hash == "#/login" || window.location.hash == "#/") {

  }

  if( $('div.modal').hasClass('show') ) {
    // console.log('modal currently shown');
    $('.moda')
  }else {
    // console.log('no modal currently shown');
    window.history.back();
  }
}

function onOffline(argument) {
  navigator.notification.alert(
    'You are offline',
    function() {
    },
    '',
    []
  );
}

function onOnline(argument) {}

var port = '8000';
var apiUrl = host + ':' + port + '/api';

var sammyApp = Sammy('#app_main', function() {
  this.use('Handlebars', 'hb');

  this.get('#/', function(context) {
    context.app.swap('');
    if(auth()) {
      context.redirect('#/tables');
    }else {
      context.redirect('#/login');
    }
  });
  this.get('#/login', function(context) {
    context.app.swap('');
    context.render('templates/login.hb').appendTo(context.$element());
  });
  this.post('#/', function(context) {
    $('#loginBtn').html('Logging in...').prop('disabled', true);
    var data = $("#loginForm").serialize();
    $.ajax({
      url: apiUrl + '/authenticate/login',
      type: 'POST',
      data: data,
      beforeSend: function(request) {
        var options = { dimBackground: true };
        if(!DEBUG) SpinnerPlugin.activityStart("Connecting...", options);
      },
      complete: function(response) {
        if(!DEBUG) SpinnerPlugin.activityStop();
      },
      statusCode: {
        401: function(response) {
          $('#loginBtn').prop('disabled', false);

          navigator.notification.alert(
            'Wrong username or password',
            function() {
              context.redirect('#/');
            },
            '',
            []
          );
        },
        200: function(response) {
          if(parseInt(response.user.user_type.id) != 3) {
            navigator.notification.alert(
              'Only waiter accounts allowed',
              function() {
                context.redirect('#/');
              },
              '',
              []
            );
          }else {
            setLocal('api_token', response.token);
            setLocal('user_data', JSON.stringify(response.user));
            setLocal('logged_in', 1);

            context.load(apiUrl + '/fetch', {
              method: 'GET',
              headers: {
                'Authorization': 'Bearer ' + getLocal('api_token')
              }
            }).then(function(data) {
              setLocal('data', data);

              context.load(apiUrl + '/tables', {
                method: 'GET',
                headers: {
                  'Authorization': 'Bearer ' + getLocal('api_token')
                }
              }).then(function(tables) {
                // Create local trays
                setLocal('tables', tables);
                var trays = [];
                var t = getJSON('tables');
                for (var i = 0; i < t.length; i++) {
                  var tray = new Tray();
                  tray.table_id = t[i].id;
                  trays.push(tray);
                }
                setLocal('trays', JSON.stringify(trays));
              }).then(function() {
                context.redirect('#/tables');
              });
            });
          }
        },
        500: function(response) {
          appLog(response)
        },
        0: function(response) {
          appLog(response)
        }
      }
    });
  });
  this.get('#/tables', function(context) {
    if (auth()) {
      context.app.swap('');

      $.ajax({
        url: apiUrl + '/fetch',
        headers: {
          'Authorization': 'Bearer ' + getLocal('api_token')
        },
        beforeSend: function(request) {
          var options = { dimBackground: true };
          if(!DEBUG) SpinnerPlugin.activityStart("Loading...", options);
        },
        statusCode: {
          0: function() {
            alert("No Connection");
          }
        },
        success: function(response) {
          setLocal('data', JSON.stringify(response));
        },
        error: function(response) {
          alert("Cannot get menu data");
          console.log(response);
          navigator.app.exitApp();
        }
      });

      $.ajax({
        url: apiUrl + '/tables',
        method: 'GET',
        headers: {
          'Authorization' : 'Bearer ' + getLocal('api_token')
        },
        complete:function(response) {
          if(!DEBUG) SpinnerPlugin.activityStop();
        },
        statusCode: {
          0: function() {
            alert("No Connection");
          },
          400: function(response) {

          }
        },
        success: function(response) {
          context.load('templates/header.hb')
          .then(function(partial) {
            context.tables = response;
            context.partials = { header: partial };
            context.headerText = "Select Table";
            context.showTrayButton = false;
            context.partial('templates/tables.hb');
          });
        }
      });
    } else context.redirect('#/');
  });
  this.get('#/tables/:table', function(context) {
    if (auth()) {
      context.app.swap('');
      var data = getJSON('data');
      var kitchens = data.kitchens;
      this.load('templates/header.hb').then(function(partial) {
        context.partials = { header: partial };
        context.table_id = parseInt(context.params.table);
        context.headerText = "Select Store";
        context.kitchens = kitchens;
        context.showTrayButton = true;
        var tray = getTray(context.table_id);
        // context.badge = tray.orders.length;
        context.partial('templates/kitchens.hb');
      });
    } else context.redirect('#/');
  });
  this.get('#/tables/:table/:kitchen', function(context) {
    if (auth()) {
      context.app.swap('');
      var data = getJSON('data');
      data = getObject(data.kitchens, 'id', parseInt(context.params.kitchen));
      var categories = data.categories;
      this.load('templates/header.hb').then(function(partial) {
        context.partials = { header: partial };
        context.table_id = parseInt(context.params.table);
        context.kitchen_id = parseInt(context.params.kitchen);
        context.headerText = "Select Menu";
        context.showTrayButton = true;
        var tray = getTray(context.table_id);
        // context.badge = tray.orders.length;
        context.categories = categories;
        context.partial('templates/categories.hb');
      });
    } else context.redirect('#/');
  });
  this.get('#/tables/:table/:kitchen/:category', function(context) {
    if (auth()) {
      context.app.swap('');
      var data = getJSON('data');
      data = getObject(data.kitchens, 'id', parseInt(context.params.kitchen));
      var kitchen = data.name;
      data = getObject(data.categories, 'id', parseInt(context.params.category));
      var menus = data.menus;
      this.load('templates/header.hb').then(function(partial) {
        context.partials = { header: partial };
        context.table_id = parseInt(context.params.table);
        context.kitchen_id = parseInt(context.params.kitchen);
        context.kitchen = kitchen;
        context.category_id = parseInt(context.params.category);
        context.headerText = "Select Item";
        context.showTrayButton = true;
        var tray = getTray(context.table_id);
        // context.badge = tray.orders.length;
        context.order_total = updateTotal(getTray(context.table_id));
        context.menus = menus;
        context.host = host + ':' + port;
        context.partial('templates/menus.hb');
      });
    } else context.redirect('#/');
  });
  // searchview -- 1st run -- show all
  this.get('#/table/:table/search', function(context) {
    context.app.swap('');
    this.load('templates/header.hb').then(function(partial) {
      if (getJSON('menus') == null) {
        $.ajax({
          url: apiUrl + '/menus',
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + getLocal('api_token')
          },
          beforeSend: function(request) {
            var options = { dimBackground: true };
            if(!DEBUG) SpinnerPlugin.activityStart("Loading...", options);
          },
          success: function(response) {
            context.menus = response;
          },
          error: function(response) {
            alert(response);
          },
          complete: function(response) {
            if(!DEBUG) SpinnerPlugin.activityStop();
            context.partials = { header: partial };
            context.table_id = context.params.table;
            context.headerText = "Search Menus";
            context.showTrayButton = true;
            context.host = host + ':' + port;
            context.partial('templates/search.hb');
          }
        });
      } else {
        context.partials = { header: partial };
        context.table_id = context.params.table;
        context.headerText = "Search Menus";
        context.showTrayButton = true;
        context.host = host + ':' + port;
        context.menus = getJSON('menus');
        context.partial('templates/search.hb');
      }
    });
  });
  // searchaction
  this.post('#/table/:table/search', function(context) {
    $('#search').prop('disabled', true);
    var data = $("#search").serialize();
    $.ajax({
      url: apiUrl + '/menus/search',
      data: data,
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + getLocal('api_token')
      },
      beforeSend: function(request) {},
      success: function(response) {
        setLocal('menus', '');
        setLocal('menus', JSON.stringify(response));
      },
      error: function(response) {
        alert(response);
      },
      complete: function(response) {
        context.redirect('#/table/' + context.params.table + '/search');
      }
    });
  });
  this.get('#/tray/:table', function(context) {
    if (auth()) {
      this.load('templates/header.hb').then(function(partial) {
        context.partials = { header: partial };
        context.table_id = context.params.table;
        context.headerText = "Tray: Table " + context.table_id;
        context.showTrayButton = false;
        // context.showPromoButton = parseInt(tray.orders.length) > 0 ? true : false;
        context.showPromoButton = true;
        var tray = getTray(context.table_id);
        context.tray = tray;
        context.host = host + ':' + port;
        context.order_total = updateTotal(getTray(context.table_id));
        context.partial('templates/tray.hb');
      });
    } else context.redirect('#/');
  });
  this.get('#/orders', function(context) {
    if (auth()) {
      context.app.swap('');
      $.ajax({
        url: apiUrl + '/tables',
        method: 'GET',
        headers: {
          'Authorization' : 'Bearer ' + getLocal('api_token')
        },
        success: function(response) {
          context.load('templates/header.hb').then(function(partial) {
            context.partials = { header: partial };
            context.headerText = "Select Table";
            context.tables = response;
            context.showTrayButton = false;
            context.partial('templates/orders.hb');
          });
        },
        error: function(response) {
          alert(response);
        }
      });

    } else context.redirect('#/');
  });
  this.get('#/orders/:table', function(context) {
    if (auth()) {
      context.app.swap('');
      $.ajax({
        url: apiUrl + '/orders/waiter/' + context.params.table,
        headers: {
          'Authorization': 'Bearer ' + getLocal('api_token')
        },
        success: function(response) {
          context.load('templates/header.hb')
          .then(function(partial) {
            context.partials = { header: partial };
            context.table_id = context.params.table;
            context.headerText = "View Orders: Table " + context.table_id;
            context.showTrayButton = false;
            context.tableOrder = response;
            context.table_id = context.params.table;
            context.partial('templates/order_items.hb');
          });
        },
        error: function(error) {
          alert(error.responseJSON);
        }
      });
    } else context.redirect('#/');
  });
  this.get('#/transfer', function(context) {
    if (auth()) {
      context.app.swap('');
      this.load('templates/header.hb').then(function(partial) {
        context.partials = { header: partial };
        context.headerText = "Transfer Table";
        context.showTrayButton = false;

        context.partial('templates/tables.hb');
      });
    } else context.redirect('#/');
  });
  this.get('#/complete', function(context) {
    if (auth()) {
      console.log('Showing completed orders');
    } else context.redirect('#/');
  });
  this.get('#/logout', function(context) {
    if (auth()) {
      closeNav();
      var host = getLocal('host');
      var log = getLocal('log');

      local.clear();

      setLocal('log', log);
      setLocal('host', host);
      setLocal('logged_in', 0);
      context.redirect('#/');
    } else context.redirect('#/');
  });
});

/* Handlebars Helper Functions */
Handlebars.registerHelper('forHumans', function(object) {
  return numeral(parseFloat(object)).format('0,0.00');
});
Handlebars.registerHelper('humanize', function(object) {
  return object ? 'Yes' : 'No';
});
Handlebars.registerHelper('arrayToString', function(object) {
  if (object[0] === '[') {
    var notes_array = JSON.parse(object);
    var output = notes_array.join('\n');
    return output;
  } else return object;
});
Handlebars.registerHelper('stringToObj', function(string) {
  if (string[0] === '[') {
    return JSON.parse(string);
  } else return string;
});
Handlebars.registerHelper('timeForHumans', function(object) {
  return moment(Date.parse(object)).format('hh:mm A');
});
Handlebars.registerHelper('ng-handlebars', function(options) {
  return options.fn();
});
Handlebars.registerHelper('statusRow', function(object) {
  switch(object) {
    case 'Open': return 'info';
    case 'Closed': return 'success';
    case 'Cancelled': return 'danger';
    case 'Processing': return 'warning';
  }
});

/* Handlebars Helper Functions */

function search(id) {window.location.href = "#/table/" + id + "/search";}

function Tray() {
this.ordered_by = null;
this.table_id = null;
this.order_total = 0;
this.notes = null;
this.orders = [];
}

function getUser() { return getJSON('user_data'); }

function getUserData(key) { var user = getJSON('user_data'); return user[key]; }

function addItem() {
  var x = $('#order_form');
  var price = parseFloat(x.find('#menu_price').val());
  var table_id = parseInt(x.find('#table_id').val());
  var menu_id = parseInt(x.find('#menu_id').val());
  var qty = parseInt(x.find('#quantity').val());
  var menu = x.find('#menu_name').val();
  var raw_notes = x.find('#notes').val();
  var notes = null;
  var image = x.find('#image').val();
  var kitchen_id = parseInt(x.find('#kitchen').val());

  // console.log(qty);

  if (qty > 1 && raw_notes.length) {
    // Convert to array if textarea is not empty

    var match = /\r|\n/.exec(raw_notes);

    if (match) {
      console.log('has newline ... splitting');
      notes = JSON.stringify(raw_notes.split('\n'));
    }else {
      console.log('no newline ... toArray');
      var temp_array = [];
      for (var i = 0; i < qty; i++) {
        temp_array[i] = raw_notes;
      }
      notes = JSON.stringify(temp_array);
    }

  } else notes = raw_notes;

  var trays = getJSON('trays');
  var tray = trays[getObjectIndex(getJSON('trays'), 'table_id', table_id)];

  // check if this item exists in this tray
  var menuIdx = getObjectIndex(tray.orders, 'menu_id', menu_id);

  // Item exists
  if (menuIdx != null) {
    console.log('item in tray ... updating');

    // console.log(JSON.stringify(tray.orders[menuIdx]));
    tray.orders[menuIdx].qty += qty;
    // console.log(tray.orders[menuIdx].notes);

    var current_notes = tray.orders[menuIdx].notes;
    if(current_notes.length >= 1 && current_notes[0] == '[') {
      console.log('array notes ... pushing new notes');

      var existing = JSON.parse(current_notes);
      // console.log(existing);

      console.log(notes);

      // Added item notes is an array
      if(notes[0] == '[') {
        notes = JSON.parse(notes);
        // console.log(notes);

        var new_notes = existing.concat(notes);

        tray.orders[menuIdx].notes = JSON.stringify(new_notes);
      }else {
        existing.push(notes);
        tray.orders[menuIdx].notes = JSON.stringify(existing);
      }

    }else {
      console.log('string notes ... converting to array');
      var temp_notes = [];

      if(current_notes != '' && current_notes.length > 1) temp_notes.push(current_notes);
      temp_notes.push(notes);

      tray.orders[menuIdx].notes = JSON.stringify(temp_notes);
    }
  } else {
    var item = {
      "kitchen_id": kitchen_id,
      "menu_id": menu_id,
      "notes": notes,
      "price": price,
      "menu": menu,
      "image_uri": image,
      "qty": qty,
    };
    tray.orders.push(item);
  }

  tray.ordered_by = getUserData('id');
  // console.log(JSON.stringify(tray));

  setTray(tray);
  updateTotal(tray);

  document.getElementById('order_form').reset();
  $('#orderModal').modal('hide');
}

function auth() {
  return parseInt(getLocal('logged_in')) && getLocal('user_data') != null ? true : false;
}

function quickOrder() {
  var tray = getTray(table_id);
  var trays = getJSON('trays');
  var summary = '';

  // Create Order Summary String
  // for(var i = 0; i < tray.orders.length; i++) {
  //   summary += tray.orders[i].qty + ' x\t' + tray.orders[i].menu + '\n';
  // }
  //
  // navigator.notification.confirm(
  //   summary,
  //   'Submit this order?',
  //   confirm,
  //   '',
  //   ['Yes','No']
  // );
  //, 'Take Out'
}

function confirm(selection) {
  if(parseInt(selection) === 1) {
    var x = $('#order_form');
    var table_id = parseInt(x.find('#table_id').val());
    var tray = getTray(table_id);

    var trays = getJSON('trays');

    // if (parseInt(selection) === 3) tray.notes = "For Take-out";
    var data = JSON.parse(JSON.stringify(tray));

    $.ajax({
      url: apiUrl + '/orders/test',
      method: 'POST',
      data: data,
      headers: {
        'Authorization': 'Bearer ' + getLocal('api_token')
      },
      statusCode: {
        0: function(response) {
          alert('No Connection');
        },
        200: function(response) {
          console.log(response);
          clearTray(parseInt(response.table));
          socket.emit('order/new', data);

          /*
            Visual Feedback for successful order
          */

          // navigator.notification.confirm(
          //   'Order Summary:\n'+ summary,
          //   function(selection) {
          //       window.location.assign("#/tables");
          //   },
          //   'Successfully Placed Order',
          //   ['Return to Table Selection']
          // );
        },
        400: function(response) {
          setLocal('log', getLocal('log') + moment().format('llll') + ' confirm() orders/test AJAX Failed [ERROR 400: ' + response.responseJSON.error + ']\n');
        },
        500: function(response) {
          setLocal('log', getLocal('log') + moment().format('llll') + ' confirm() orders/test AJAX Failed [ERROR 500: Check api logs]\n');
        }
      }
    });
  } else {}
}
// Shorthand functions
function clearTray(table_id) {
  console.log(table_id);
  var trays = getJSON('trays');
  var index = getObjectIndex(trays, 'table_id', parseInt(table_id));
  console.log(JSON.stringify(trays[index]));

  trays[index] = null;
  trays[index] = new Tray();
  trays[index].table_id = table_id;

  console.log(JSON.stringify(trays[index]));
  setLocal('trays', JSON.stringify(trays));
}

function getItems(table_id) { var tray = getTray(parseInt(table_id)); return tray.orders; }

function getItem(tray, item_id) { return getObjectIndex(tray.orders, 'menu_id', parseInt(item_id)); }

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
function remLocal(name) { local.removeItem(name); }
function getObject(obj_arr, obj_key, obj_val) {
  var object = getObjectIndex(obj_arr, obj_key, obj_val);
  object = obj_arr[object];
  return object != null ? object : null;
}
function getObjectIndex(obj_arr, obj_key, obj_val) {
  for (var index = 0; index < obj_arr.length; index++) {
    if (obj_arr[index][obj_key] == obj_val) return index;
  }
  return null;
}
function fetchTrays() {
  $.ajax({
    url: apiUrl + 'orders/fetch',
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + getLocal('api_token')
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
  var total_orders = 0;
  var total_items = 0;

  for (var index = 0; index < tray.orders.length; index++) {
    total_items += tray.orders[index].qty;
    total += parseFloat(tray.orders[index].price * tray.orders[index].qty);
  }
  tray.order_total = total;

  $('.quick-total #order_total').html(forHumans(tray.order_total));
  $('.badge').html(total_items);

  setTray(tray);
  return parseFloat(total);
}
function forHumans(price) {
  return numeral(parseFloat(price)).format('0,0.00');
}

socket.on('order/complete', function(data) {
  cordova.plugins.notification.local.schedule(data);
});
