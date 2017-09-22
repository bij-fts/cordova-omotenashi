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
        <div class="tray-div pull-right">
          {{#unless tables}}
          <span class="badge pull-right">{{badge}}</span>
          {{/unless}}
          <a href="#/tray/{{table_id}}">Tray</a>
        </div>
        <div class="clearfix"></div>
      </div>
    </div>
  </div>
</nav>
