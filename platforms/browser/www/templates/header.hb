<nav class="navbar navbar-expand-lg navbar-dark fixed-top" id="mainNav">
  <div class="container">
    <div class="header-holder">
      <div class="text-center nav-title">
        <h4>{{headerText}}</h4>
      </div>
      <div class="options-holder">
        {{#unless tables}}
        <div class="menu-div pull-left">
          <a onclick="openNav()">Menu</a>
        </div>
        {{/unless}}
        {{#if showTrayButton}}
          <a href="#/tray/{{table_id}}">
        <div class="tray-div pull-right">
            <span class="badge">123</span>
        </div>
          </a>
        {{/if}}
        <div class="clearfix"></div>
      </div>
    </div>
  </div>
</nav>
