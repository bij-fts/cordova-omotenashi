{{>header}}

<section id="kitchen-select" class="custom-padding">
  <div class="container">
    <div class="row">
      <button class="btn btn-success" data-toggle="modal" data-target="#viewOrderTableModal">Show Orders</button>
    </div>
  </div>
</section>

<div class="modal view-order-table-modal" id="viewOrderTableModal" role="dialog" data-backdrop="static">
	<div class="modal-dialog">

		<!-- Modal content-->
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">&times;</button>
				<h4 class="modal-title">Order #{{tableOrder.order_number}}</h4>
			</div>
			<div class="modal-body">
				<div class="product-top-desc">

					<div class="pull-left">
						<h5>Table #{{table_id}}</h5>
						<h5>Order Time: {{timeForHumans tableOrder.created_at}}</h5>
					</div>

					<div class="pull-right">
						<a href="#" class="orders-edit-item-btn" data-toggle="modal" data-target="#editOrderTableModal">Edit</a>
					</div>

					<div class="clearfix"></div>

				</div>

				<div class="product-mid-details">

					<table class="table">
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
			<div class="modal-footer">
				<div class="pull-left">
					<button type="button" class="btn btn-default btn-add-tray">Add Order</button>
				</div>
				<div class="pull-right"><strong>Total: Php {{forHumans tableOrder.order_total}}</strong></div>
				<div class="clearfix"></div>
			</div>
		</div>
	</div>
</div>
</div> 