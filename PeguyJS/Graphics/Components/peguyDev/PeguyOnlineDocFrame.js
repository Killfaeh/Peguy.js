function PeguyOnlineDocFrame()
{
	///////////////
	// Attributs //
	///////////////

	var chromeUserAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

	// Structure du composant

	var frame = new Frame('<TabManager id="tabManager" />', 'Online doc');

	var tabManager = frame.getById('tabManager');
	tabManager.setEditMode(false);
	
	//////////////
	// Méthodes //
	//////////////

	var createDocTab = function($tab)
	{
		var html = '<div>'
						+ '<table id="table" >'
							+ '<tr>'
								+ '<td id="adress-bar-cell" ><input id="adress-bar" type="text" value="' + $tab.url + '" /></td>'
								+ '<td id="load-button-cell" ><input id="load-button" type="button" value="Load page" /></td>'
							+ '</tr>'
						+ '</table>'
						+ '<webview id="webview" src="' + $tab.url + '" partition="persist:' + $tab.name + '" useragent="' + chromeUserAgent + '" ></webview>'
					+ '</div>';

		var contentComponent = new Component(html);

		contentComponent.style.position = 'absolute';
		contentComponent.style.left = '0px';
		contentComponent.style.right = '0px';
		contentComponent.style.top = '0px';
		contentComponent.style.bottom = '0px';
		contentComponent.style.overflow = 'hidden';

		contentComponent.getById('table').style.width = '100%';

		contentComponent.getById('webview').style.position = 'absolute';
		contentComponent.getById('webview').style.left = '0px';
		contentComponent.getById('webview').style.right = '0px';
		contentComponent.getById('webview').style.top = '45px';
		contentComponent.getById('webview').style.bottom = '0px';

		contentComponent.getById('adress-bar-cell').style.width = '90%';
		contentComponent.getById('adress-bar-cell').style.textalign = 'center';
		
		contentComponent.getById('adress-bar').style.width = 'calc(100% - 30px)';

		contentComponent.getById('load-button-cell').style.textalign = 'center';

		contentComponent.getById('load-button').onClick = function()
		{
			var url = contentComponent.getById('adress-bar').value;
			contentComponent.getById('webview').setAttribute('src', url);
		};

		return new Tab($tab.label, contentComponent);
	};

	this.loadFromJSON = function($json)
	{
		if ($json && $json.urlList && $json.urlList.forEach)
		{
			$json.urlList.forEach(function($tab)
			{
				if ($tab.children)
				{
					var subTabManager = new TabManager();
					subTabManager.setEditMode(false);

					$tab.children.forEach(function($subTab)
					{
						var subTab = createDocTab($subTab);
						subTabManager.addTab(subTab);
					});

					if (subTabManager.getTabList()[0])
						subTabManager.getTabList()[0].select();

					var tab = new Tab($tab.label, subTabManager);
					tabManager.addTab(tab);
				}
				else
				{
					var tab = createDocTab($tab);
					tabManager.addTab(tab);
				}
			});

			if (tabManager.getTabList()[0])
				tabManager.getTabList()[0].select();
		}
	};
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	
	// SET
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(frame, this);
	return $this; 
}