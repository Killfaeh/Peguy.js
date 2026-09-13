// Electron : window.electronAPI

// PyQT : pythonObject
// <script type="text/javascript" src="qrc:///qtwebchannel/qwebchannel.js"></script>

/*
try
{
	new QWebChannel(qt.webChannelTransport, function(channel)
	{
		pythonObject = channel.objects.pythonObject;
	});
}
catch ($exception) { console.log("No PyQt"); }
//*/

var Bridge = 
{
	object: null,
	
	exec: async function($methodName, $args)
	{
		// Electron : await window.electronAPI.search($criteria.toLowerCase());
		// PyQT : pythonObject.saveTags(JSON.stringify(FILES_LIST));
		
		if (Bridge.object)
			return await Bridge.object[$methodName].apply(Bridge, $args);
		else
			alert("Bridge.object is not defined.");
		
		return null;
	}
};