{{>header}}

<section id="kitchen-select" class="custom-padding">
  <div class="container">
    <div class="row">
      {{#each tables}}
       {{#if vacant_or_occupied}}
        <div class="col-xs-6">
      		<a href="#/orders/{{id}}">
      		<div class="table-holder">
      			<h3 class="table-number">#{{name}}</h3>
      		</div>
      		</a>
    	  </div>
        {{/if}}
      {{/each}}
    </div>
  </div>
</section>

