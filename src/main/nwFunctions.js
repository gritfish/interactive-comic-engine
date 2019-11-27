var message = '';
var os = require('os');
var gui = require('nw.gui');

function quitGame(){
	gui.App.closeAllWindows();
	gui.App.quit();
}