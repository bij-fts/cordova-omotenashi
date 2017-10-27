{{>header}}
<style type="text/css">
  .panel-body {
    padding-top: 0;
    padding-bottom: 0;
  }
  .panel-body table {
    margin-bottom: 0;
  }
  tbody {
    max-height: 400px;
    overflow-y: scroll;
  }
</style>
<section id="kitchen-select" class="custom-padding">
	<div class="container">
    <div class="row">
      <div class="col-xs-12 col-sm-12">

        <div class="panel panel-default">
          <div class="panel-heading" style="background-color: #fe0002; color: #fff">
            <div class="pull-left">
              <h4>Order#{{tableOrder.order_number}}</h4>
            </div>
            <div class="pull-right">
              <h4>By: {{tableOrder.user.name}}</h4>
            </div>
            <div class="clearfix"></div>
          </div>
        
          <div class="panel-body">
            <div class="clearfix"></div>
            <div class="pull-left">
              <h4>Status: {{tableOrder.order_status.label}}</h4>
            </div>
            <div class="pull-right">
              <h4>Paid: {{humanize tableOrder.has_paid}}</h4>
            </div>
          </div>
          <table class="table table-striped table-responsive"> 
            <thead>
              <tr>
                <th>Name</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {{#each tableOrder.details}}
              <tr class="{{statusRow order_status.label}}">
                <td>{{name}}</td>
                <td>{{qty}}</td>
                <td>Php {{forHumans regular_price}}</td>
                <td>{{order_status_id}}</td>
              </tr>
              {{/each}}
            </tbody>
          </table>

          <div class="panel-footer">
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
            <div class="clearfix"></div>
          </div>
        
        </div>
      </div>
    </div>
	</div>
</section>

