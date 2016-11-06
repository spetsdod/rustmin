var chokidar = require('chokidar');
var watcher = chokidar.watch('file');
var exec = require('child_process').exec;

const appToKill = 'notepad';
const appToStart = 'notepad.exe';
const fileToWatch = 'filename.txt';
const secondsToWait = 0;
const maxAge = 15 // seconds (60 = 1 minute, 300 = 5 minutes)

var lastFileChange = 0;

var log = console.log.bind(console);

watcher
.on('change', function(path) {
	log('File '+path+' has changed.');
	lastFileChange = 0;
});

watcher.add(fileToWatch);
log('Rustmin ready to work.  Watching for file changes.');

function resetApp() {
	exec('powershell.exe Stop-Process -processname '+appToKill);
	setTimeout(function(){
		exec('powershell.exe Start-Process '+appToStart, function(err) {
			if (err) {
				throw new Error('Something\'s fucky: '+err);
			}
		});
		lastFileChange = 0;
	}, secondsToWait*1000);
};

setInterval(function() {
	if (lastFileChange >= maxAge) {
		resetApp();
		console.log('Last File Change: '+lastFileChange+' seconds ago.');
	} else {
		lastFileChange+= 1;
		console.log('Last File Change: '+lastFileChange+' seconds ago.');
	}
},1000);