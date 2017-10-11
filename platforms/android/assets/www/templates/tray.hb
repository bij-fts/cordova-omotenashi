{{>header}}

<section class="custom-padding" id="table-select" style="margin-bottom: 30px">
  <div class="container">
    <div class="row">

      {{#each tray.orders}}
      <div class="product-holder">
        <div class="col-md-12">
          <div class="row">
            <div class="col-xs-4">
              <div class="product-img">
                <img class="img-responsive" src="{{../host}}/{{image_uri}}">
              </div>
            </div>
            <div class="col-xs-8 product-short-info">
              <h3>{{menu}}</h3>
              <h5><strong>QTY: </strong><span id="trayQty">{{qty}}</span></h5>
              <h5><strong>Price: </strong>Php {{forHumans price}}</h5>
              <h5 class="product-note"><strong>Notes:</strong> {{arrayToString notes}}</h5>
              <a class="remove-item-btn" data-menu="{{menu}}" data-tableId="{{../table_id}}" data-itemId="{{menu_id}}">Remove</a>
              <a class="edit-item-btn" data-menu="{{menu}}" data-qty="{{qty}}" data-tableId="{{../table_id}}" data-itemId="{{menu_id}}" data-toggle="modal" data-target="#editModal">Edit</a>
            </div>
            <div class="clearfix"></div>
          </div>
        </div>
      </div>
      {{else}}
      <div style="height: 100%">
        <h3 class="text-center">No items in tray</h3>
      </div>
      {{/each}}
    </div>
  </div>
</section>

<div class="quick-view-tray">
  <div class="container-fluid">
    <div class="row">
      <div class="quick-total pull-left text-center">
        <h4>Total: Php <span id="order_total">{{forHumans order_total}}</span></h4>
      </div>

      <div class="quick-order pull-right text-center">
        <form id="submit_order">
          <input type="hidden" name="table_id" id="table_id" value="{{table_id}}">
        </form>
        <h4><a class="text-success" onclick="quickOrder()">Place Order</a></h4>
      </div>

      <div class="clearfix">
      </div>
    </div>
  </div>
</div>

<div class="modal order-product-modal" id="editModal" role="dialog">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button class="close" data-dismiss="modal" type="button">&times;</button>
        <h4 class="modal-title">Edit Order: </h4>
      </div>
      <div class="modal-body">
        <div class="product-top-desc">
          <div class="pull-left">
            <h5 id="kitchen_name"></h5>
          </div>

          <div class="clearfix">
          </div>
        </div>
        <div class="product-mid-details">
          <div class="pull-left col-sm-12">
            <h4>QTY:</h4>
          </div>
          <div class="pull-left">
            <input type="hidden" id="menu_id">
            <input type="hidden" id="menu">
            <input type="hidden" id="table_id">
            <div class="input-group spinner">
              <input class="form-control" type="number" id="quantity" name="quantity" min="1" step="1" value="1">
              <div class="input-group-btn-vertical">
                <button class="btn btn-default" type="button"><i class="fa fa-caret-up"></i></button> <button class="btn btn-default" type="button"><i class="fa fa-caret-down"></i></button>
              </div>
            </div>
          </div>
          <div class="clearfix">
          </div>
        </div>
        <div class="product-bottom-desc">
          <div class="form-group">
            <label>Add Note:</label>

            <textarea class="form-control" placeholder="Note" id="notes" name="notes" rows="3" style="resize: none"></textarea>
          </div>
        </div>
        <button class="btn btn-block btn-lg btn-default btn-add-tray" onclick="editItem()" type="button">Update</button>
      </div>
    </div>
  </div>
</div>

<script type="text/javascript">
$('#editModal').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget);
  var modal = $(this);

  modal.find('#quantity').val(button.data('qty'));
  modal.find('#menu').val(button.data('menu'));
  modal.find('#menu_id').val(button.data('itemid'));
  modal.find('#table_id').val(button.data('tableid'));
});

  $('.remove-item-btn').on('click', function(event) {
    var table_id = parseInt($(this).data('tableid'));
    var item_id = parseInt($(this).data('itemid'));
    var menu = $(this).data('menu');

    navigator.notification.confirm(
      'Are you sure?',
      function(selection) {
        if(parseInt(selection) === 1) {
          var tray = getTray(table_id);
          tray.orders.splice(getObjectIndex(tray.orders, 'menu_id', item_id), 1);

          updateTotal(tray);
          setTray(tray);

          cordova.plugins.snackbar('Removed "' + menu + '"', 'LONG', '', function() {});
          $(event.target).closest("div .product-holder").remove();
          // if(tray.orders.length < 1) {
          //   window.history.back();
          // }
        }
      },
      'Remove item',
      ['Yes','No']
    );
  });

  function editItem() {
    var menu_id = parseInt($('#menu_id').val());
    var table_id = parseInt($('#table_id').val());
    var qty = parseInt($('#quantity').val());
    var menu = $('#menu').val();

    var tray = getTray(table_id);
    var item = tray.orders[getObjectIndex(tray.orders, 'menu_id', menu_id)];
    item.qty = qty;
    $('#trayQty').html(qty);
    $('#editModal').modal('hide');
    cordova.plugins.snackbar('Updated "' + menu + '"', 'LONG', '', function() {});

    updateTotal(tray);
    setTray(tray);
  }

  (function ($) {
    $('.spinner .btn:first-of-type').on('click', function() {
      $('.spinner #quantity').val( parseInt($('.spinner #quantity').val(), 10) + 1);
    });
    $('.spinner .btn:last-of-type').on('click', function() {
      if(parseInt($('.spinner #quantity').val()) >= 2) $('.spinner #quantity').val( parseInt($('.spinner #quantity').val(), 10) - 1);
    });
  })(jQuery);
</script>
