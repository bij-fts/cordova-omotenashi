{{>header}}

<section id="table-select" class="custom-padding" style="margin-bottom: 30px">
  <div class="container">
    <div class="row">
      <div class="col-sm-12">
        <div id="search-field">
          <form class="form-group" method="post" action="#/search">
            <input class="form-control input-search">
            <button class="btn btn-default btn-search" type="button"><i class="fa fa-search"></i>
            </button>
          </form>
        </div>
      </div>
    </div>
    <div class="row">
      {{#each menus}}
      <div class="product-holder" id="{{name}}">
        <div class="col-md-12">
          <div class="row">
            <div class="col-xs-4">
              <div class="product-img">
                <img src="{{../host}}/storage/{{image_uri}}">
              </div>
            </div>
            <div class="col-xs-8 product-short-info">
              <h3>{{name}}</h3>
              <h4>Php {{forHumans price}}</h4>
              <button class="btn btn-default btn-order btn-block" type="button" data-toggle="modal" data-target="#orderModal"
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
        <h4>Total: Php <span id="order_total">{{forHumans order_total}}</span></h4>
      </div>

      <div class="quick-order pull-right text-center">
        <form id="submit_order">
          <input type="hidden" name="table_id" id="table_id" value="{{table_id}}">
        </form>
        <h4><a class="text-sucess" disabled="true" onclick="quickOrder()">Add to Tray</a></h4>
      </div>

      <div class="clearfix">
      </div>
    </div>
  </div>
</div>

<script type="text/javascript">
  $('#search-field').on('submit', function(event) {
    event.preventDefault();
  });

  $('#search-field input').on('keyup', function(event) {
    var keyword = $(this).val();

  });
</script>