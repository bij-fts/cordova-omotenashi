{{>header}}

<section id="kitchen-select" class="custom-padding">
  <div class="container">
    <div class="row">
      <div class="col-sm-12">
        <div id="search-field">
          <form role="form" id="menu_search" class="form-group" method="post" action="#/search">
            <input name="term" class="form-control input-search" onclick="search({{table_id}})" placeholder="Search All Menu">
            <button class="btn btn-default btn-search" type="submit"><i class="fa fa-search"></i>
            </button>
          </form>
        </div>
      </div>
    </div>
    <div class="row">
      {{#each categories}}
      <div class="col-xs-6">
        <a href="#/tables/{{../table_id}}/{{../kitchen_id}}/{{id}}">
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
