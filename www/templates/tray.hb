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
              <h3>{{menu}}</h3>
              <h5><strong>QTY: {{../.table_id}} - </strong>{{qty}}</h5>
              <h5><strong>Price: {{../table_id}} + </strong>Php {{#makePrice}}{{price}}{{/makePrice}}</h5>
              <p><strong>Note: </strong>{{notes}}<a class="remove-item-btn" onclick="removeItem({{@index}})">Remove</a> <a class="edit-item-btn" onclick="editItem({{@index}})">Edit</a></p>
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