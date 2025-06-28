var host = document.location.hostname;
if(host == "localhost" || host == "192.168.1.110") {
	BackendUrl = 'http://' + document.location.hostname + ':29188/';
	// BackendUrl = 'https://oeutrystdsnd.rollgame.io/';
} else {
	BackendUrl = 'https://oeutrystdsnd.rollgame.io/';
}
ApiUrl = 'http://'+document.location.hostname+':2083/';
export var BackendUrl;
export var ApiUrl;