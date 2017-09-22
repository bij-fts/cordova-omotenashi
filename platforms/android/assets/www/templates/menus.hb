{{>header}}

<section id="table-select" class="custom-padding" style="margin-bottom: 30px">
  <div class="container">
    <div class="row">
      <div class="col-sm-12">
        <form role="form">
          <div class="form-group">
            <input class="form-control input-search">
            <button class="btn btn-default btn-search" type="button"><i class="fa fa-search"></i>
            </button>
          </div>
        </form>
      </div>
    </div>
    <div class="row">
      {{#each menus}}
      <div class="product-holder">
        <div class="col-md-12">
          <div class="row">
            <div class="col-xs-4">
              <div class="product-img">
                <img src="assets/images/prod1.jpg">
              </div>
            </div>
            <div class="col-xs-8 product-short-info">
              <h3>{{name}}</h3>
              <h4>Php {{#makePrice}}{{price}}{{/makePrice}}</h4>
              <button class="btn btn-default btn-view" type="button" data-toggle="modal" data-target="#viewModal">View</button>
              <button class="btn btn-default btn-order" type="button" data-toggle="modal" data-target="#orderModal"
                data-kitchenid="{{../kitchen_id}}" data-tableid="{{../table_id}}" data-menuprice="{{price}}"
                data-menuname="{{name}}" data-menuid="{{id}}"
              >Order</button>
            </div>
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
        <h4>Total: Php <span id="order_total">{{#makePrice}}{{order_total}}{{/makePrice}}</span></h4>
      </div>

      <div class="quick-order pull-right text-center">
        <form id="submit_order">
          <input type="hidden" name="table_id" id="table_id" value="{{table_id}}">
        </form>
        <h4><a class="text-sucess" disabled="true" onclick="submitOrder()">Place Order</a></h4>
      </div>


      <div class="clearfix">
      </div>
    </div>
  </div>
</div>