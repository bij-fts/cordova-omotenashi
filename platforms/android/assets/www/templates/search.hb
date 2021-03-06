{{>header}}

<section id="table-select" class="custom-padding" style="margin-bottom: 30px">
  <div class="container">
    <div class="row">
      <div class="col-sm-12">
        <div id="search-field">
          <form class="form-group" id="search" method="post" action="#/table/{{table_id}}/search">
            <input name="term" class="form-control input-search" placeholder="Search All Menu">
            <a class="btn btn-default btn-search"><i class="fa fa-search"></i>
            </a>
          </form>
        </div>
      </div>
    </div>    
    <div class="row">
      {{#each menus}}
      <div class="product-holder">
        <div class="col-md-12">
          <div class="row">
            <div class="col-xs-4">
              <div class="product-img">
                <img src="{{../host}}/{{image_uri}}">
              </div>
            </div>
            <div class="col-xs-8 product-short-info">
              <h3>{{name}}</h3>
              <h4><strong>{{kitchen.name}}</h4></strong>
              <h4>Php {{forHumans price}}</h4>
              <button class="btn btn-default btn-order btn-block" type="button" data-toggle="modal" data-target="#orderModal"
                data-kitchenid="{{kitchen_id}}" data-tableid="{{../table_id}}" data-menuprice="{{price}}"
                data-menuname="{{name}}" data-menuid="{{id}}" data-image="{{image_uri}}"
              >Order</button>
            </div>
            <div class="clearfix"></div>
          </div>
        </div>
      </div>
    {{else}}
      <div style="height: 100%">
        <h3 class="text-center">No results</h3>
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

<script type="text/javascript">
  // $('#search').on('submit', function(event) {
  //   event.preventDefault();
  //   console.log($(this).find('input').val());
  //   window.location.href = "#/menus/";
  // });
</script>