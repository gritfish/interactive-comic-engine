const pages = require('../../data/pages.json');
const panels = require('../../data/panels.json');

class BookController {
	constructor($http, $scope) {
		this._$http = $http;
		this._$scope = $scope;
		$scope.pages = pages;
		$scope.panels = panels;
		$scope.currentPage = 0;
		$scope.currentPanel = 0;
		$scope.pageHistory = [0];

		$scope.bookWidth = function(){
			for(var i = 0; i < $scope.panels.length; i++){
				if(parseInt($scope.panels[i].Page) == parseInt($scope.currentPage)){
					return $scope.panels[i]['Page Width'];
				}
			}
			return 100;
		}
		$scope.bookHeight = function(){
			for(var i = 0; i < $scope.panels.length; i++){
				if(parseInt($scope.panels[i].Page) == parseInt($scope.currentPage)){
					return $scope.panels[i]['Page Height'];
				}
			}
			return 100;
		}
		$scope.pageBackground = function(){
			for(var i = 0; i < $scope.panels.length; i++){
				if(parseInt($scope.panels[i].Page) == parseInt($scope.currentPage)){
					return $scope.panels[i]['Background'];
				}
			}
			return '01';
		}
		$scope.loadPage = function(PAGE){
			$scope.currentPage = PAGE;
			$scope.pageHistory.push(PAGE);
			$scope.currentPanel = 0;
			if(PAGE == 0){
				setTimeout(function(){
					$scope.$apply();
				},20);
			}else{
				setTimeout(function(){
					$scope.advancePanel();
					$scope.$apply();
				},20);
			}
		}
		$scope.hasSeenPage = function(PAGE){
			for(var i = 0; i < $scope.pageHistory.length; i++){
				if(parseInt($scope.pageHistory[i]) == parseInt(PAGE)){
					return true;
				}
			}
			return false;
		}
		$scope.canRewind = function(){
			if($scope.getPage($scope.currentPage).isStart){
				return false;
			}
			if($scope.currentPage > 0){
				return true;
			}
			return false;
		}
		$scope.getPage = function(PAGE){
			for(var i = 0; i < $scope.pages.length; i++){
				if($scope.pages[i].Page == $scope.currentPage){
					return $scope.pages[i];
				}
			}
		}
		$scope.canAdvance = function(){
			if($scope.getPage($scope.currentPage).isEnd){
				return false;
			}
			for(var i = 0; i < $scope.panels.length; i++){
				if(parseInt($scope.panels[i].Page) == parseInt($scope.currentPage)){
					if($scope.panels[i].linksToPage != ''){
						return false;
					}
				}
			}
			return true;
		}
		$scope.advancePanel = function () {
			$scope.currentPanel ++;
			if($scope.canAdvance()){
				if($scope.currentPanel > $scope.panelsOnCurrentPage()){
					if($scope.getPage($scope.currentPage).Next){
						$scope.loadPage(parseInt($scope.getPage($scope.currentPage).Next));
					}else{
						$scope.loadPage($scope.currentPage + 1);
					}
				}
			}
		}
		$scope.panelsOnCurrentPage = function(){
			var currentPagePanels = 0;
			for(var i = 0; i < $scope.panels.length; i++){
				if(parseInt($scope.panels[i].Page) == parseInt($scope.currentPage)){
					currentPagePanels = Math.max(parseInt($scope.panels[i].Order), currentPagePanels);
				}
			}
			return currentPagePanels;
		}
		$scope.shouldShowPanel = function(PANEL){
			if(PANEL.ShowIfVisited == ''){
				return true;
			}else{
				if($scope.hasSeenPage(PANEL.ShowIfVisited)){
					return true;
				}else{
					return false;
				}
			}
			return true;
		}
		$scope.rewind = function(){
			$scope.pageHistory.pop();
			var lastPage = $scope.pageHistory.pop();
			$scope.loadPage(lastPage);
		}
		$scope.previousClick = function(){
			$scope.rewind();
		}
		$scope.nextClick = function(){
			$scope.loadPage(parseInt($scope.currentPage) + 1);
		}
		$scope.resetClick = function(){
			$scope.currentPage = 0;
			$scope.currentPanel = 0;
			$scope.pageHistory = [0];
		}
		$scope.panelClick = function(PAGE){
			if(PAGE){
				$scope.loadPage(parseInt(PAGE));
			}
		}
		$scope.quitClick = function(){
			//alert('CLOSE');
			if(window.quitGame){
				window.quitGame();
			}
		}
	}
	unique(a) {
		return a.sort().filter(function(item, pos, ary) {
			return !pos || item != ary[pos - 1];
		})
	}
}

BookController.$inject = ['$http', '$scope'];

export { BookController };