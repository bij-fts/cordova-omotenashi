{{>header}}

<section id="table-select" class="custom-padding" style="margin-bottom: 30px">
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
      {{#each menus}}
      <div class="product-holder" id="{{name}}">
        <div class="col-md-12">
          <div class="row">
            <div class="col-xs-4">
              <div class="product-img">
                <img class="img-responsive" src="{{../host}}/{{image_uri}}">
              </div>
            </div>
            <div class="col-xs-8 product-short-info">
              <h3>{{name}}</h3>
              <h4>Php {{forHumans price}}</h4>
              <button class="btn btn-default btn-order btn-block" type="button" data-toggle="modal" data-target="#orderModal"
                data-kitchenid="{{../kitchen_id}}" data-tableid="{{../table_id}}" data-menuprice="{{price}}"
                data-menuname="{{name}}" data-menuid="{{id}}" data-image="{{image_uri}}" data-kitchen="{{../kitchen}}"
              >Select</button>
            </div>
            <div class="clearfix"></div>
          </div>
        </div>
      </div>
      {{/each}}
    </div>
  </div>
</section>

<div class="quick-view-tray">
  <div class="container-fluid">
    <div class="row">
      <div class="quick-total pull-left text-center">
        <h4>Total: Php <span id="order_total">{{forHumans order_total}}</span></h4>
      </div>

      <div class="quick-order pull-right text-center">
        <form id="submit_order">
          <input type="hidden" name="table_id" id="table_id" value="{{table_id}}">
        </form>
        <h4><a class="text-success" onclick="quickOrder()">Place Order</a></h4>
      </div>

      <div class="clearfix">
      </div>
    </div>
  </div>
</div>

<div class="modal order-product-modal" id="orderModal" role="dialog" data-backdrop="static">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button class="close" data-dismiss="modal" type="button">&times;</button>
        <h4 class="modal-title">{Item Name}</h4>
      </div>

      <form id="order_form">
        <div class="modal-body">
          <div class="row">
            <div class="product-mid-details">
              <div class="col-xs-6 col-sm-6">
                <h5>Quantity:</h5>
                <div class="input-group">
                  <span class="input-group-btn">
                    <button onclick="qLess()" class="btn btn-default" type="button"><i class="fa fa-minus"></i></button>
                  </span>
                  <input id="quantity" name="quantity" type="number" placeholder="1" min="1" step="1" class="text-center form-control">
                  <span class="input-group-btn">
                    <button onclick="qMore()" class="btn btn-default" type="button"><i class="fa fa-plus"></i></button>
                  </span>
                </div>
              </div>
              <div class="col-xs-6 col-sm-6">
                <h5>Note Options:</h5>
                <div class="btn-group" style="min-width: 100%;">
                  <button onclick="editNotes()" style="width: 50%" class="btn btn-default" type="button" id="editBtn"><i class="fa fa-pencil"></i> Edit</button>
                  <button onclick="editNotes(false)" style="width: 50%" class="btn btn-default" type="button" id="clearBtn"><i class="fa fa-close"></i> Clear</button>
                </div>
              </div>
            </div>

            <div class="product-bottom-desc">
              <div class="form-group selection-wrapper">
                <input type="hidden" id="allowed-flavors">
                <div class="selected-flavor">
                  <div class="col-xs-12 col-sm-12">
                    <h5>Select Sauce (<span id="min">1</span>/<span id="max">1</span>)</h5>
                  </div>
                  <div class="col-xs-4 col-sm-4">
                    <div class="md-checkbox">
                      <input value="Garlic" type="checkbox" id="Garlic" name="flavor[]">
                      <label for="Garlic">Garlic</label>
                    </div>
                  </div>
                  <div class="col-xs-4 col-sm-4">
                    <div class="md-checkbox">
                      <input value="Chile" type="checkbox" id="Chile" name="flavor[]">
                      <label for="Chile">Chile</label>
                    </div>
                  </div>
                  <div class="col-xs-4 col-sm-4">
                    <div class="md-checkbox">
                      <input value="Negi" type="checkbox" id="Negi" name="flavor[]">
                      <label for="Negi">Negi</label>
                    </div>
                  </div>
                  <div class="col-xs-4 col-sm-4">
                    <div class="md-checkbox">
                      <input value="Teriyaki" type="checkbox" id="Teriyaki" name="flavor[]">
                      <label for="Teriyaki">Teriyaki</label>
                    </div>
                  </div>
                  <div class="col-xs-8 col-sm-8">
                    <div class="md-checkbox">
                      <input value="Sauce and Mayo" type="checkbox" id="SM" name="flavor[]">
                      <label for="SM">Sauce & Mayo</label>
                    </div>
                  </div>
                </div>
              </div>
              <div class="form-group">
                <div class="col-xs-12 col-sm-12"><h5>Notes:</h5>
                  <textarea readonly class="form-control" placeholder="Additional Info" id="notes" name="notes" rows="2" style="resize: none"></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <input type="hidden" id="menu_id" name="menu_id">
          <input type="hidden" id="table_id" name="table_id">
          <input type="hidden" id="menu_name" name="menu_name">
          <input type="hidden" id="menu_price" name="menu_price">
          <input type="hidden" id="image" name="image">
          <input type="hidden" id="kitchen" name="kitchen">
          <div class="row">
            <div class="col-xs-6 col-sm-6 pull-left">
              <button class="col-xs-6 col-sm-6 btn btn-md btn-block btn-default" onclick="clearForm()" type="reset">Cancel</button>
            </div>
            <div class="col-xs-6 col-sm-6 pull-right">
              <button class="col-xs-6 col-sm-6 btn btn-md btn-block btn-default btn-add-tray" onclick="addItem()" id="addBtn" type="button">Add</button>
            </div>
          </div>
        </div>
      </form>
  </div>
</div>

<script>
  $('input[type=checkbox]').on('change', function (e) {
    var limit = parseInt($('#allowed-flavors').val());
    var count = $('input[type=checkbox]:checked').length;

    $('#addBtn').prop('disabled', count != 0 ? false : true);

    if (count <= limit) {
      $('#min').html($('input[type=checkbox]:checked').length);

      if ($(this).is(':checked')) {
        selected.push($(this).val());
      }else{
        $('#min').html($('input[type=checkbox]:checked').length);
        selected.splice(selected.indexOf($(this).val()), 1);
      }
    }else{
      $(this).prop('checked', false);
    }

    $('textarea').html(selected.join(', '));
  });

  $('#orderModal').on('hide.bs.modal', function (event) {
    $('#table-select').removeClass('hidden');
  });

  $('#notes').on('change', function() {
    var notes = $(this).val();
    console.log(notes.length);
  });

  $('#orderModal').on('show.bs.modal', function (event) {
    clearForm();
    document.getElementById('order_form').reset();
    document.getElementById("quantity").defaultValue = 1;
    
    $('#table-select').addClass('hidden');
    
    var button = $(event.relatedTarget);
    var modal = $(this);

    modal.find('.modal-body #kitchen_name').empty();
    modal.find('.modal-title').html(button.data('menuname'));

    modal.find('#table_id').val(button.data('tableid'));
    modal.find('#menu_price').val(button.data('menuprice'));
    modal.find('#menu_id').val(button.data('menuid'));
    modal.find('#menu_name').val(button.data('menuname'));
    modal.find('#image').val(button.data('image'));
    modal.find('#kitchen').val(button.data('kitchenid'));

    var menu = button.data('menuname');

    if(menu != null)
    if(menu.includes('Takoyaki') && !menu.includes('Set')) {

      modal.find('#addBtn').prop('disabled', true);

      if($('.selection-wrapper').hasClass('hidden')) {
        $('.selection-wrapper').removeClass('hidden');
      }
      if(!$('.selection-wrapper').hasClass('show')) {
        $('.selection-wrapper').addClass('show');
      }

      // if(!$('.product-mid-details').hasClass('hidden')) {
      //   $('.product-mid-details').addClass('hidden');
      // }
      // if($('.product-mid-details').hasClass('show')) {
      //   $('.product-mid-details').removeClass('show');
      // }

      var regExp = /\(([^)]+)\)/;
      var matches = regExp.exec(menu);
      var pieces = parseInt(matches[1]);

      if(pieces == 4 || pieces == 8) {
        modal.find('#allowed-flavors').val(1);
        modal.find('#allowed-flavors').prop('min',1);
        modal.find('#allowed-flavors').prop('max',1);
      }else if(pieces == 12) {
        modal.find('#allowed-flavors').val(3);
        modal.find('#allowed-flavors').prop('min',3);
        modal.find('#allowed-flavors').prop('max',3);
      }else if(pieces == 16) {
        modal.find('#allowed-flavors').val(4);
        modal.find('#allowed-flavors').prop('min',4);
        modal.find('#allowed-flavors').prop('max',4);
      }else if(pieces == 20) {
        modal.find('#allowed-flavors').val(5);
        modal.find('#allowed-flavors').prop('min',5);
        modal.find('#allowed-flavors').prop('max',5);
      }

      $('#min').empty().html(0);
      $('#max').empty().html($('#allowed-flavors').prop('max'));
    }else {
      if(!$('.selection-wrapper').hasClass('hidden')) {
        $('.selection-wrapper').addClass('hidden');
      }
      if($('.selection-wrapper').hasClass('show')) {
        $('.selection-wrapper').removeClass('show');
      }
    }
  });

  function qMore() {
    document.getElementById("quantity").stepUp();
  }
  
  function qLess() {
    document.getElementById("quantity").stepDown();
  }

  function editNotes(x = true) {
    if(!x && !$('textarea').prop('readonly')) {
      $('textarea').val('');
    }else {
      if($('textarea').prop('readonly')) {
        $('#editBtn').addClass('active');
      }else {
        $('#editBtn').removeClass('active');
      }
      $('textarea').prop('readonly', function(i, v) { return !v; });
      $('textarea').focus();
    }
  }
</script>
