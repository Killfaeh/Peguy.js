function PeguyHelpFrame()
{
	///////////////
	// Attributs //
	///////////////

	// Structure du composant

	var frame = new Frame('<TabManager id="tabManager" />', 'Help');

	var tabManager = frame.getById('tabManager');
	tabManager.setEditMode(false);
	
	//////////////
	// Méthodes //
	//////////////

	var createDocTab = function($tab)
	{
		var content = $tab.content;
		
		if ($tab.language === 'plaintext')
		{
			var tmpContent = content.replaceAll('\n', '{[br]}').replaceAll('\t', '{[tab]}');
			var blockArray = tmpContent.split('</pre>');
			
			content = blockArray.reduce(function($str, $block)
			{
				var matchCodeBlocks = $block.match(/<pre +[^>]*class="([a-zA-Z0-9]+)"[^>]*>(.*)/);

				if (matchCodeBlocks && matchCodeBlocks[2])
				{
					var originalCode = matchCodeBlocks[2];
					var formatCode = originalCode.replaceAll('<', '&lt;').replaceAll('>', '&gt;');
					$block = $block.replace(originalCode, formatCode) + '</pre>';
				}
				
				return $str + $block.replaceAll('{[br]}', '\n').replaceAll('{[tab]}', '\t');
				
			}, '');
		}
		else if ($tab.language !== 'pdf')
		{
			content = content.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
			
			if (typeof hljs !== 'undefined' && $tab.language !== 'plaintext')
				content = hljs.highlight(content, { language: $tab.language, ignoreIllegals: true }).value;
				//hljs.highlightElement(tab.getContent().getById('help-content'));
		}
		
		var tabHTML = '<div id="help-block" class="help-block" >'
							+ '<pre id="help-content" >' 
								+ '<code class="' + $tab.language + '" >'
									+ content 
								+ '</code>'
							+ '</pre>'
						+ '</div>';
		
		if ($tab.language === 'plaintext')
			tabHTML = '<div id="help-block" class="help-block" >' + content + '</div>';
		else if ($tab.language === 'pdf')
		{
			console.log($tab.content);

			tabHTML = '<div id="help-block" class="help-block" style="margin: 0px; padding: 0px;" >'
							+ '<webview src="' + $tab.content + '" partition="persist:pdf" style="position: absolute; left: 0px; right: 0px; top: 0px; bottom: 0px;" ></webview>'
						+ '</div>';
		}
			
		var contentComponent = new Component(tabHTML);
		//contentComponent.getById('help-block').innerHTML = content;
		
		if ($tab.language === 'plaintext')
		{
			var preBlocks = contentComponent.getElementsByTagName('pre');
			
			for (var i = 0; i < preBlocks.length; i++)
			{
				var blockClass = preBlocks[i].getAttribute('class');
				
				if (blockClass !== '' && blockClass !== 'plaintext' && typeof hljs !== 'undefined' && hljs !== null)
					hljs.highlightElement(preBlocks[i]);
				
				var copyIcon = new Icon("icons", "copy-paste-icon", 20, 20);
				copyIcon.style.cursor = 'pointer';
				copyIcon.code = preBlocks[i].innerText;
				
				copyIcon.onClick = function()
				{
					dataManager.toClipboard(this.code,
						function()
						{
							var message = '<p style="text-align: left; color: rgb(0, 255, 0); " >The code has been copied.</p>';
							viewManager.getNotifCenter().push(message, false);
						},
						function()
						{
							var message = '<p style="text-align: left; color: rgb(255, 0, 0); " >Failed to copy the code.</p>';
							viewManager.getNotifCenter().push(message, false);
						});
				};
				
				contentComponent.insertAfter(copyIcon, preBlocks[i]);
			}
		}
		
		return new Tab($tab.label, contentComponent);
	};

	this.loadFromJSON = function($json)
	{
		if ($json && $json.forEach)
		{
			$json.forEach(function($tab)
			{
				if ($tab.children)
				{
					var subTabManager = new TabManager();
					subTabManager.setEditMode(false);

					$tab.children.forEach(function($subTab)
					{
						var subTab = createDocTab($subTab);
						subTabManager.addTab(subTab);

						//if (typeof hljs !== 'undefined' && $subTab.language !== 'plaintext' && subTab.getContent().getById('help-content'))
						//	hljs.highlightElement(subTab.getContent().getById('help-content'));
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

					//if (typeof hljs !== 'undefined' && $tab.language !== 'plaintext' && tab.getContent().getById('help-content'))
					//	hljs.highlightElement(tab.getContent().getById('help-content'));
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