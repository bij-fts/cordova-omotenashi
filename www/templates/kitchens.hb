{{>header}}

<section id="kitchen-select" class="custom-padding">
  <div class="container">
    <div class="row">
      <div class="col-sm-12">
        <form role="form">
          <div class="form-group">
            <input class="form-control input-search" placeholder="Search">
            <button class="btn btn-default btn-search" type="button"><i class="fa fa-search"></i>
            </button>
          </div>
        </form>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6">
        <h2>Order is for: <strong>Table <span id="selected-table">{{table_id}}</span></strong> </h2>
      </div>
      {{#each kitchens}}
      <div class="col-xs-6">
        <a href="#/tables/{{../table_id}}/{{id}}">
          <div class="store-holder">
            <img src="assets/images/kitchen-placeholder.jpg">
            <h4>{{name}}</h4>
          </div>
        </a>
      </div>
      {{/each}}
    </div>
  </div>
</section>
