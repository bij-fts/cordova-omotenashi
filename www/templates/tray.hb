{{>header}}

<section class="custom-padding" id="table-select">
  <div class="container">
    <div class="row">
      {{#each tray.orders}}
      <div class="product-holder">
        <div class="col-md-12">
          <div class="row">
            <div class="col-xs-4">
              <div class="product-img">
                <img class="img-responsive" src="assets/images/prod1.jpg">
              </div>
            </div>
            <div class="col-xs-8 product-short-info">
            Table {{../table_id}}
              <h3>{{menu}}</h3>
              <h5><strong>QTY: </strong>{{qty}}</h5>
              <h5><strong>Price: </strong>Php {{forHumans price}}</h5>
              <p><strong>Note: </strong>{{notes}}<a class="remove-item-btn" onclick="removeItem({{../table_id}},{{@index}})">Remove</a> <a class="edit-item-btn" onclick="editItem({{../table_id}},{{@index}})">Edit</a></p>
            </div>
            <div class="col-xs-12 product-note"></div>
            <div class="clearfix"></div>
          </div>
        </div>
      </div>
      {{/each}}
    </div>
  </div>
</section>

<div class="quick-view-tray">
  <div class="container-fluid">
    <div class="row">
      <div class="quick-total pull-left text-center">
        <h4>Total: Php {{order_total}}</h4>
      </div>
      <div class="quick-order pull-right text-center">
        <h4>Place Order</h4>
      </div>
      <div class="clearfix"></div>
    </div>
  </div>
</div>