{{>header}}

<section id="table-select" class="custom-padding">
  <div class="container">
    <div class="row">
      {{#each tables}}
      <div class="col-xs-6">
        <a href="#/tables/{{id}}">
          <div class="table-holder" style="height:75px; width:170px">
            <h3 class="table-number">#{{name}}</h3>
          </div>
        </a>
      </div>
      {{/each}}
    </div>
  </div>
</section>
