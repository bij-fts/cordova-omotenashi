<nav class="navbar navbar-expand-lg navbar-dark fixed-top" id="mainNav">
  <div class="container">
    <div class="header-holder">
      <div class="text-center nav-title">
        <h4>{{headerText}}</h4>
      </div>
      <div class="options-holder">
        <div class="menu-div pull-left">
          <a onclick="openNav()">Menu</a>
        </div>
        {{#if showTrayButton}}
          <a href="#/tray/{{table_id}}">
            <button class="tray-div pull-right btn">
              <span class="badge">
                0            
              </span>
            </button>
          </a>
        {{/if}}
        {{#if showPromoButton}}
          <div class="pull-right">
            <a href="#" data-toggle="modal" data-target="#promoModal">
              <i class="fa fa-tag fa-lg" style="color: #fff"></i>&nbsp;
              <span class="badge">0</span>
            </a>
          </div>
        {{/if}}
        <div class="clearfix"></div>
      </div>
    </div>
  </div>
</nav>

<div class="modal order-product-modal fade" data-backdrop="static" id="promoModal" role="dialog">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button class="close" data-dismiss="modal" type="button">&times;</button>
        <h4 class="modal-title">Connection Settings</h4>
      </div>
      <div class="modal-body">
        <form id="host_settings">
          <div class="form-group">
            <h4 class="text-center">Enter Host IP:</h4>
            <input class="form-control" placeholder="192.168.1.1" id="host" type="tel" minlength="11" maxlength="15">
          </div>
          <button class="btn btn-block btn-default btn-add-tray" id="saveSettings" type="submit">Save</button>
        </form>
      </div>
    </div>
  </div>
</div>