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
                <img class="img-responsive" src="{{../host}}/storage/{{image_uri}}">
              </div>
            </div>
            <div class="col-xs-8 product-short-info">
              <h3>{{menu}}</h3>
              <h5><strong>QTY: </strong>{{qty}}</h5>
              <h5><strong>Price: </strong>Php {{forHumans price}}</h5>
              <p><strong>Note: </strong>{{arrayToString notes}}</p>
              <a class="remove-item-btn" data-tableId="{{../table_id}}" data-itemId="{{menu_id}}">Remove</a>
              <a class="edit-item-btn" data-tableId="{{../table_id}}" data-itemId="{{menu_id}}" data-toggle="modal" data-target="#editModal">Edit</a>
            </div>
            <div class="col-xs-12 product-note"></div>
            <div class="clearfix"></div>
          </div>
        </div>
      </div>
      {{else}}
      <div style="height: 100">
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
        <h4><a class="text-sucess" disabled="true" onclick="quickOrder()">Place Order</a></h4>
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
        <h4 class="modal-title">Edit Order</h4>
      </div>
      <div class="modal-body">
        <div class="product-mid-details">
          <div class="pull-left">
            <h4>QTY:</h4>
          </div>

          <div class="pull-left">
            <div class="input-group spinner">
              <input class="form-control" type="text" id="quantity" name="quantity" min="1" step="1" value="1">

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
        <button class="btn btn-block btn-default btn-add-tray" id="saveSettings" onclick="editItem()" type="button">Save</button>
      </div>
    </div>
  </div>
</div>

<script type="text/javascript">
  $('.remove-item-btn').on('click', function(event) {
    var table_id = parseInt($(this).data('tableid'));
    var item_id = parseInt($(this).data('itemidx'));

    navigator.notification.confirm(
      'This action cannot be undone',
      function(selection) {
        if(parseInt(selection) === 2) {
          var tray = getTray(table_id);
          tray.orders.splice(getObjectIndex(tray.orders, 'menu_id', item_id), 1);

          updateTotal(tray);
          setTray(tray);

          cordova.plugins.snackbar('Removed item from tray', 'SHORT', '', function() {});
          $(event.target).closest("div .product-holder").remove();
        }
      },
      'Remove item',
      ['Cancel','Remove']
    );
  });

  function editItem() {

  }

</script>