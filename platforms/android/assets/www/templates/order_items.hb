{{>header}}

<section id="kitchen-select" class="custom-padding">
	<div class="container">
		<div class="row">
      <div class="col-xs-12">
  			<table class="table "> 
  				<thead>
  					<tr>
  						<th>#</th>
  						<th>Name</th>
  						<th>Qty</th>
  						<th>Price</th>
  					</tr>
  				</thead>
  				<tbody>
  					{{#each tableOrder.orders}}
  					<tr>
  						<th scope="row">{{id}}</th>
  						<td>{{name}}</td>
  						<td>{{qty}}</td>
  						<td>P {{forHumans price}}</td>
  					</tr>
  					{{/each}}
  				</tbody>
  			</table>
      </div>
		</div>
	</div>
</section>