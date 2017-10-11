{{>header}}

<section id="kitchen-select" class="custom-padding">
	<div class="container">
    <div class="row">
      <div class="col-xs-12">
        <div class="pull-left">
          <h4>Order#{{tableOrder.order_number}}</h4>
        </div>
        <div class="pull-right">
          <h4>By: {{tableOrder.user.name}}</h4>
        </div><br>
        <div class="clearfix"></div>
        <div class="pull-left">
          <h4>Status: {{tableOrder.order_status.label}}</h4>
        </div>
        <div class="pull-right">
          <h4>Paid: {{humanize tableOrder.has_paid}}</h4>
        </div>
      </div>
    </div>
		<div class="row">
      <div class="col-xs-12">
  			<table class="table"> 
  				<thead>
  					<tr>
  						<th>Name</th>
  						<th>Qty</th>
  						<th>Price</th>
  					</tr>
  				</thead>
  				<tbody>
  					{{#each tableOrder.details}}
  					<tr>
  						<td>{{name}}</td>
  						<td>{{qty}}</td>
  						<td>Php {{forHumans regular_price}}</td>
  					</tr>
  					{{/each}}
  				</tbody>
  			</table>

        <div class="row">
          <div class="col-xs-12">
            <div class="pull-left">
              <a class="btn btn-default btn-order" href="#/tables/{{table_id}}">Add Order</a>
            </div>
            <div class="pull-right">
              <h4>
              <strong>
              Php {{forHumans tableOrder.order_total}}
              </strong>
              </h4>
            </div>
          </div>
        </div>

      </div>
		</div>
	</div>
</section>

<script type=""></script>