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
                <img class="img-responsive" src="assets/images/prod1.jpg">
              </div>
            </div>
            <div class="col-xs-8 product-short-info">
              Table {{../table_id}}
              <h3>{{menu}}</h3>
              <h5><strong>QTY: </strong>{{qty}}</h5>
              <h5><strong>Price: </strong>Php {{forHumans price}}</h5>
              <p><strong>Note: </strong>{{arrayToString notes}}</p>
              <a class="remove-item-btn" onclick="removeItem({{../table_id}},{{@index}})">Remove</a>
              <a class="edit-item-btn" onclick="editItem({{../table_id}},{{@index}})">Edit</a>
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