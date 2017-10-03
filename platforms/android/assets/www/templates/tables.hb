{{>header}}

<section id="table-select" class="custom-padding">
  <div class="container">
    <div class="row">
      {{#each tables}}
      <div class="col-xs-6">
        <a href="#/tables/{{id}}">
          <div class="table-holder {{vacant_or_occupied}}">
            <h3 class="table-number">#{{name}}</h3>
          </div>
        </a>
      </div>
      {{/each}}
    </div>
  </div>
</section>

<script>
$('.table-holder').on('click', function() {
  if($(this).hasClass('occupied')) {
    navigator.notification.confirm(
      'Add orders for this table?',
      checkTable,
      '',
      ['Yes', 'No']
    );
  }
});

function checkTable(selection) {
  if(parseInt(selection) === 2)
    window.location.href="#/tables";
}
</script>