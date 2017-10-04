document.addEventListener("DOMContentLoaded", function(){
  var searchApp = angular.module('testApp', []);

  searchApp.controller('SearchCtrl', function($scope, $http) {
    $scope.haha = "hahahahahaha";
    $scope.host = '192.168.2.144';
    $scope.port = '8000';
    $scope.term = '';

    var api = 'http://' + host + ':' + port + '/api';
    console.log(api);

    $http({
      method: 'data',
      url: api + '/menus',
      headers: { 'Authorization':'Bearer ' + getLocal('api_token') }
    })
    .then(
      function(response) {
        console.log(response.data);
        // if(response.status == 200) {
        //   $scope.menus = response.data;        
        // }
      }
    )
    ;
  });



});