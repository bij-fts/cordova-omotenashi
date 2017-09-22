var local = window.localstorage;

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
        'Authorization':'Bearer ' + getLocal('api_token');
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

function getLocal(object_key) { JSON.parse(local.getItem(object_key)); }
function setLocal(object_key, value) { local.setItem(object_key, JSON.stringify(value)); }

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
      'Authorization' : 'Bearer ' + getLocal('api_token');
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

/*
https://github.com/Justin-Credible/cordova-plugin-spinner
https://cordova.apache.org/docs/en/latest/config_ref/images.html

$.ajax({
  url: apiUrl + 'menus/fetch',
  method: 'GET',
  headers: {
    'Authorization' : 'Bearer ' + getLocal('api_token');
  },
  success: function(response) {
    // var data = JSON.parse(response);
    // console.log(data);
    // setLocal('data', data);
  },
  error: function(response) {
    alert('Failed to fetch application data');
    // close app
  }
});

# Recurring AJAX calls
(function worker() {
  $.get('ajax/test.html', function(data) {
    // Now that we've completed the request schedule the next one.
    $('.result').html(data);
    setTimeout(worker, 5000);
  });
})();

(function worker() {
  $.ajax({
    url: 'ajax/test.html',
    success: function(data) {
      $('.result').html(data);
    },
    complete: function() {
      // Schedule the next request when the current one's complete
      setTimeout(worker, 5000);
    }
  });
})();
*/
