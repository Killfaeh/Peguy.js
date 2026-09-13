var Components =
{
	/////////////////////////////////////
	// Gestion générale des composents //
	/////////////////////////////////////
	
	//tags: {},
	tags: new Map(),
	tagConflicts: [],
	nbComponents: 0,
	componentsList: [],
	
	initTag: function($name)
	{
		var className = $name.firstCharToUpperCase();
		var tagName = $name.toLowerCase();

		if (!SVGTAGS.includes(tagName))
		{
			try
			{
				var el = document.createElement(tagName);

				if (el instanceof HTMLUnknownElement)
				{
					if (typeof window[className] === "function")
					{
						var classString = window[className].toString();
						classString = classString.replaceAll('\n', '').replaceAll('\t', '');
						
						var matchParams = classString.match(/^function +[a-zA-Z0-9_]+\(([a-zA-Z0-9_, $=]*)\)/);
						
						if (matchParams && utils.isset(matchParams[1]))
						{
							var classParamStr = matchParams[1].replaceAll(' ', '').replaceAll('$', '');
							var paramNames = [];
							
							if (classParamStr !== '')
							{
								var tmp = classParamStr.split(',');
								
								tmp.forEach(function($param)
								{
									paramNames.push($param.replace(/=.+/g, ''));
								});
							}
							
							//Components.tags[className.toUpperCase()] = { className: className, paramNames: paramNames };
							Components.tags.set(className.toUpperCase(), { className: className, paramNames: paramNames });
						}
					}
					/*
					else
						console.log(className + " IS NOT A FUNCTION");
					//*/
				}
				else if (window[className])
					Components.tagConflicts.push($name);
			}
			catch ($error)
			{
				//console.log($error);
			}
		}
	},
	
	initTags: function($loaderScripts, $loaderComponents)
	{
		Object.keys($loaderScripts).forEach(function($key) { Components.initTag($key); });
		Object.keys($loaderComponents).forEach(function($key) { Components.initTag($key); });
		//console.log(Components.tags);
		//console.log(Components.tagConflicts);
	},
	
	createTag: function($node)
	{
		var outputNode = null;
		
		var tagName = $node.tagName.toUpperCase();
		
		//if (Components.tags[tagName])
		if (Components.tags.has(tagName))
		{
			//var tagInfo = Components.tags[tagName].paramNames;
			//var className = Components.tags[tagName].className;
			var tag = Components.tags.get(tagName);
			var tagInfo = tag.paramNames;
			var className = tag.className;
			var attributes = $node.attributes;
			var children = [];
			var childrenUsed = false;

			if ($node.childNodes)
				children = Array.from($node.childNodes).filter(function($node) { return $node.nodeType !== Node.TEXT_NODE; });
			
			var args = [null];
			
			tagInfo.forEach(function($attribute)
			{
				var attrValue = $node.getAttribute($attribute);

				if (attrValue)
					args.push($node.getAttribute($attribute));
				else if (children && children.length > 0 && children[0].tagName === $attribute)
				{
					args.push($node.innerHTML);
					childrenUsed = true;
				}
				else
					args.push(null);
			});
			
			var Factory = window[className].bind.apply(window[className], args);
  			outputNode =  new Factory();

			if (!childrenUsed && children && children.length > 0 && children[0].tagName === $attribute)
				outputNode.setChildren($node.innerHTML);
		}
		// Eventuellement traiter les cas des classes qui portent les mêmes noms que des balises HTML
		
		return outputNode;
	},
	
	getById: function($id)
	{
		var output = null;
		
		for (var i = 0; i < Components.componentsList.length; i++)
		{
			output = Components.componentsList[i].getById($id);
			
			if (utils.isset(output))
				i = Components.componentsList.length;
		}
		
		return output;
	},
	
	getComponentById: function($id)
	{
		var output = null;
		
		for (var i = 0; i < Components.componentsList.length; i++)
		{
			if (Components.componentsList[i].getId() === $id)
			{
				output = Components.componentsList[i];
				i = Components.componentsList.length;
			}
		}
		
		return output;
	},
	
	//////////////////////////
	// Gestion des fenêtres //
	//////////////////////////
	
	nbFrames: 0,
	framesList: [],

	getFrontFrame: function()
	{
		var frontFrame = null;

		if (Components.framesList.length > 0)
			frontFrame = Components.framesList[Components.framesList.length-1];

		return frontFrame;
	},
	
	addFrame: function($frame)
	{
		for (var i = 0; i < Components.framesList.length; i++)
			Components.framesList[i].onBlurFrame();
		
		Components.nbFrames++;
		Components.framesList.push($frame);
		Components.focusFrame($frame);
	},
	
	removeFrame: function($frame)
	{
		var index = Components.framesList.indexOf($frame);
		
		if (index >= 0)
		{
			Components.nbFrames--;
			Components.framesList.splice(index, 1);
		}
	}, 
	
	removeAllFrames: function()
	{
		var tmpList = [];
		
		for (var i = 0; i < Components.framesList.length; i++)
			tmpList.push(Components.framesList[i]);
		
		for (var i = 0; i < tmpList.length; i++)
			tmpList[i].hide();
		
		Components.framesList = [];
		Components.nbFrames = 0;
	},

	blurAllFrames: function()
	{
		for (var i = 0; i < Components.framesList.length; i++)
			Components.framesList[i].onBlurFrame();
	},
	
	focusFrame: function($frame)
	{
		var index = Components.framesList.indexOf($frame);
		
		if (index >= 0)
			Components.framesList.splice(index, 1);
		else
			Components.nbFrames++;
		
		Components.framesList.push($frame);
		
		var parentNode = $frame.parentNode;
		
		/*
		if (utils.isset(parentNode))
			parentNode.appendChild($frame);
		else
			document.getElementById('main').appendChild($frame);
		//*/
		
		if (Components.framesList.length > 0)
		{
			var zIndexMin = parseInt(Components.framesList[0].getStyle('z-index'));
			
			for (var i = 0; i < Components.framesList.length; i++)
				Components.framesList[i].style.zIndex = zIndexMin + i;
		}
		
		Components.blurAllFrames();
		$frame.onFocusFrame();
		//$frame.focus();
	},
	
	focusLastFrame: function()
	{
		if (Components.framesList.length > 0)
			Components.focusFrame(Components.framesList[Components.framesList.length-1]);
	},
	
	////////////////////////
	// Gestion des popups //
	////////////////////////
	
	nbPopups: 0,
	popupsList: [],

	getFrontPopup: function()
	{
		var frontPopup = null;

		if (Components.popupsList.length > 0)
			frontPopup = Components.popupsList[Components.popupsList.length-1];

		return frontPopup;
	},
	
	addPopup: function($popup)
	{
		Components.nbPopups++;
		Components.popupsList.push($popup);
	},
	
	removePopup: function($popup)
	{
		var index = Components.popupsList.indexOf($popup);
		
		if (index >= 0)
		{
			Components.nbPopups--;
			Components.popupsList.splice(index, 1);
		}
	},
	
	removeAllPopups: function()
	{
		var tmpList = [];
		
		for (var i = 0; i < Components.popupsList.length; i++)
			tmpList.push(Components.popupsList[i]);
		
		for (var i = 0; i < tmpList.length; i++)
			tmpList[i].hide();
		
		Components.popupsList = [];
		Components.nbPopups = 0;
	},
	
	////////////////////////////
	// Gestion des input text //
	////////////////////////////
	
	nbInputText: 0,
	inputTextList: [],
	
	addInputText: function($inputText)
	{
		Components.nbInputText++;
		Components.inputTextList.push($inputText);
	},
	
	removeInputText: function($inputText)
	{
		var index = Components.inputTextList.indexOf($inputText);
		
		if (index >= 0)
		{
			Components.nbInputText--;
			Components.inputTextList.splice(index, 1);
		}
	},
	
	focusAllInputText: function()
	{
		for (var i = 0; i < Components.inputTextList.length; i++)
			Components.inputTextList[i].focus();
	},
	
	blurAllInputText: function()
	{
		for (var i = 0; i < Components.inputTextList.length; i++)
			Components.inputTextList[i].blur();
	},
	
	//////////////////////////
	// Gestion des tooltips //
	//////////////////////////
	
	toolTipsList: [],
	
	addToolTip: function($tooltip)
	{
		for (var i = 0; i < Components.toolTipsList.length; i++)
		{
			//document.getElementById('main').removeChild(Components.toolTipsList[i]);
			Components.toolTipsList[i].endFadeOut();
		}
		
		Components.toolTipsList = [];
		Components.toolTipsList.push($tooltip);
	},
	
	removeToolTip: function($toolTip)
	{
		if (utils.isset($toolTip.parentNode))
			$toolTip.parentNode.removeChild($toolTip);
		
		var index = Components.toolTipsList.indexOf($toolTip);
		
		if (index >= 0)
			Components.toolTipsList.splice(index, 1);
	},
	
	/////////////////////////////////////////////////////
	// Gestion de l'envoie de fichiers par des iframes //
	/////////////////////////////////////////////////////
	
	iframeOnload: {},
	
	iframeOnLoadExec: function($id)
	{
		if (utils.isset(Components.iframeOnload[$id]))
			Components.iframeOnload[$id]();
	},
	
	//////////////////////
	// Gestion du focus //
	//////////////////////

	focus:
	{
		floatPanel: null,
		openMenu: null,
		default: document.getElementById('main')
	},

	getPriorityComponent: function()
	{
		//console.log(Components.focus.default);
		// Ajouter le cas  des menus déroulants

		if (Components.focus.floatPanel)
			return Components.focus.floatPanel;
		else if (Components.focus.openMenu)
			return Components.focus.openMenu;
		else
		{
			var frontPopup = Components.getFrontPopup();

			if (frontPopup)
				return frontPopup;
			else
			{
				var frontFrame = Components.getFrontFrame();

				if (frontFrame && frontFrame.hasFocus())
					return frontFrame;
				else
				{
					if (Components.focus.default)
						return Components.focus.default;
				}
			}
		}

		return null;
	},
	
	focusList: [],
	
	addFocus: function($component)
	{
		Components.removeFocus($component);
		Components.focusList.push($component);
	},
	
	removeFocus: function($component)
	{
		var index = Components.focusList.indexOf($component);
		
		if (index >= 0)
			Components.focusList.splice(index, 1);
	},

	/////////////////////////////////////////////////////////////////////
	// Gestion des composants qui écoutent les mouvements de la souris //
	/////////////////////////////////////////////////////////////////////

	iceRinks: [],

	addIceRink: function($iceRink)
	{
		if (!Components.iceRinks.includes($iceRink))
			Components.iceRinks.push($iceRink);
	},

	removeIceRink: function($iceRink)
	{
		var index = Components.iceRinks.indexOf($iceRink);
		
		if (index >= 0)
			Components.iceRinks.splice(index, 1);
	},
	
	////////////////////////////////////////////////////////////
	// Diffuser certains événements au travers des composents //
	////////////////////////////////////////////////////////////
	
	onResize: function()
	{
		for (var i = 0; i < Components.componentsList.length; i++)
			Components.componentsList[i].onResize();
	},
	
	onEndResize: function()
	{
		for (var i = 0; i < Components.componentsList.length; i++)
			Components.componentsList[i].onEndResize();
	},
	
	dispatchEvent: function($eventName, $event)
	{
		var processed = false;
		var component = Components.getPriorityComponent();

		if (component && component[$eventName])
		{
			if (Array.isArray(component[$eventName]))
			{
				for (var i = 0; i < component[$eventName].length; i++)
				{
					var tmpProcessed = component[$eventName][i]($event);

					if (tmpProcessed)
						processed = true;
				}
			}
			else
				processed = component[$eventName]($event);
		}

		if (!processed && Components.focus.default && component !== Components.focus.default && Components.focus.default[$eventName])
		{
			if (Array.isArray(Components.focus.default[$eventName]))
			{
				for (var i = 0; i < Components.focus.default[$eventName].length; i++)
					Components.focus.default[$eventName][i]($event);
			}
			else
				Components.focus.default[$eventName]($event);
		}
	},

	onKeyDown: function($event) { Components.dispatchEvent('onKeyDown', $event); },
	onKeyUp: function($event) { Components.dispatchEvent('onKeyUp', $event); },
	onGamepadConnected: function($event) { Components.dispatchEvent('onGamepadConnected', $event); },
	onGamepadDisconnected: function($event) { Components.dispatchEvent('onGamepadDisconnected', $event); },
	onGamepadButtonDown: function($event) { Components.dispatchEvent('onGamepadButtonDown', $event); },
	onGamepadButtonUp: function($event) { Components.dispatchEvent('onGamepadButtonUp', $event); },
	onGamepadAxisChange: function($event) { Components.dispatchEvent('onGamepadAxisChange', $event); },
};