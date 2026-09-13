function PeguyProceduralDocument($gridHTML, $config)
{
	///////////////
	// Attributs //
	///////////////

	var filePath = "";
	var saved = true;

	var gridHTML = $gridHTML;
	var config = $config;

    var component = new Component('<div class="document" >' + gridHTML + '</div>');

	//// Tools bar ////

	var iconsMenu = new IconsMenu(config.toolBar, 20);

	//// Tab manager ////

	var tabManager = new TabManager();
	tabManager.setEditMode(true);

	//// Panneaux de code ////

	var mainScriptEditor = new CodeEditor('javascript');

	var mainTab = new Tab('<span>' + "main.js" + '</span>', mainScriptEditor);
	tabManager.addTab(mainTab);

	var script = new Component('<script type="text/javascript" ></script>');
	var errorConsoleHTML = '<pre><code id="errorConsole" ></code></pre>';
	var errorConsole = new Component(errorConsoleHTML);
	
	// Assemblage ////

	if (config)
	{
		if (config.mapping && config.mapping.toolsPanel && component.getById(config.mapping.toolsPanel))
			component.getById(config.mapping.toolsPanel).appendChild(iconsMenu);

		if (config.mapping && config.mapping.tabManager && component.getById(config.mapping.tabManager))
			component.getById(config.mapping.tabManager).appendChild(tabManager);

		if (config.mapping && config.mapping.errorConsole && component.getById(config.mapping.errorConsole))
			component.getById(config.mapping.errorConsole).appendChild(errorConsole);
	}
	
	/*
{{INSERT CODE}}
	//*/

	//////////////
	// Méthodes //
	//////////////

	var scriptNameIsOk = function($scriptName)
	{
		var scriptNameOk = false;
		var scriptName = $scriptName.replace(/\.js$/, "");

		if (/^[a-zA-Z0-9]+$/.test(scriptName))
			scriptNameOk = true;

		return scriptNameOk;
	};

	var scriptNameDoesntExist = function($scriptName)
	{
		var scriptNameOk = true;
		var scriptName = $scriptName.replace(/\.js$/, "");

		var tabList = tabManager.getTabList();

		for (var i = 0; i < tabList.length; i++)
		{
			var label = tabList[i].getLabel();
			label = label.replace(/<span>/ig, "").replace(/<\/span>$/ig, "").replace(/\.js$/, "");

			if (label === scriptName)
				scriptNameOk = false;
		}

		return scriptNameOk;
	};

	var createScript = function($scriptName, $code)
	{
		var newCodeEditor = new CodeEditor('javascript');
		var scriptName = $scriptName.replace(/\.js$/, "");
		var newTab = new Tab('<span>' + scriptName + '.js</span>', newCodeEditor);
		tabManager.addTab(newTab);

		newTab.onClose = function()
		{
			var close = false;
			var label = this.getLabel();
			label = label.replace(/<span>/ig, "").replace(/<\/span>$/ig, "").replace(/\.js$/, "");
			var removePopup = new ConfirmPopup('<p>Are you sure you want to remove the script "' + label + '" ? </p>');
			document.getElementById('main').appendChild(removePopup);
			removePopup.tabToRemove = this;

			removePopup.onOk = function()
			{
				var removeOk = true;
				this.tabToRemove.onClose = function() { return true; };
				tabManager.removeTab(this.tabToRemove);
				return removeOk;
			};

			return close;
		};

		newTab.onSelect = function($tab) { $tab.getContent().restoreScroll(); };

		if ($code)
			newCodeEditor.setCode($code);

		newCodeEditor.onPaste = function($code) { return $this.pasteCode($code); };
		newCodeEditor.onChange = function($code) { onChange($code); };
	};

	this.addScript = function()
	{
		var addScriptPopup = new ConfirmPopup('<h3>Add script</h3><p><input id="script-name" type="text" placeholder="Script name" /></p>');

		addScriptPopup.onOk = function()
		{
			var ok = false;

			var scriptName = this.getById('script-name').value;

			if (utils.isset(scriptName) && scriptName !== "" && scriptNameIsOk(scriptName) === true && scriptNameDoesntExist(scriptName) === true)
			{
				createScript(scriptName);
				$this.setSaved(false);
				ok = true;
			}
			else if (scriptNameIsOk(scriptName) !== true)
			{
				ok = false;
				var infoPopup = new InfoPopup('<p>The script name is incorrect (only ASCII characters).</p>');
				document.getElementById('main').appendChild(infoPopup);
			}
			else if (scriptNameDoesntExist(scriptName) !== true)
			{
				ok = false;
				var infoPopup = new InfoPopup('<p>A script with this name already exists.</p>');
				document.getElementById('main').appendChild(infoPopup);
			}
			else
			{
				ok = false;
				var infoPopup = new InfoPopup('<p>The script name can\'t be empty.</p>');
				document.getElementById('main').appendChild(infoPopup);
			}

			return ok;
		};

		document.getElementById('main').appendChild(addScriptPopup);
	};

	this.focusCodeEditor = function()
	{

	};

	var execCode = function($code)
	{
		console.log($code);

		var code = $code.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

		var scriptParent = script.parentNode;

		if (utils.isset(scriptParent))
			scriptParent.removeChild(script);
		
		workspace.empty();
		Doc.empty();
		viewManager.refresh();

		script = new Component('<script type="text/javascript" >var scriptToExec = function() { ' + code + '\n};\n try { scriptToExec();\nviewManager.emptyError();\nviewManager.render(); }\ncatch($error) { viewManager.displayError($error); } </script>');
		document.getElementById('main').appendChild(script);
	};

	this.refresh = function() {}; // A surcharger

	var onChange = function($code)
	{
		$this.setSaved(false);
	};

	this.onStartProgram = function() {};
	this.onEndProgram = function() {};

	this.execProgram = async function()
	{
		console.log('POUET ! ');

		if (typeof waitScreen !== 'undefined')
		{
			waitScreen.setContent("<h2>Computing... Please wait.</h2>");
			document.getElementById('main').appendChild(waitScreen);
		}

		$this.onStartProgram();

		viewManager.emptyError();
		Doc.empty();
		viewManager.refresh();

		if (utils.isset(execConfig))
		{
			for (var i = 0; i < execConfig.scripts.length; i++)
				Loader.removeScript(execConfig.scripts[i].tmpFile);
		}

		var plugins = viewManager.getPlugins();

		for (var i = 0; i < plugins.length; i++)
			Loader.removeScript(plugins[i]);

		plugins = await window.electronAPI.refreshPlugIns();

		for (var i = 0; i < plugins.length; i++)
			Loader.addScript(plugins[i], plugins[i]);

		var tmpCode = $this.getData();

		execConfig = await window.electronAPI.execProgram(filePath, tmpCode);

		if (utils.isset(execConfig))
		{
			var tmpFilePath = filePath; // A priori ça sert à rien

			for (var i = 0; i < execConfig.scripts.length; i++)
			{
				if (execConfig.scripts[i].name !== 'main' && execConfig.scripts[i].name !== 'main.js')
					Loader.addScript('file://' + execConfig.scripts[i].tmpFile, execConfig.scripts[i].tmpFile);
			}

			Loader.onload = function()
			{
				for (var i = 0; i < execConfig.scripts.length; i++)
				{
					if (execConfig.scripts[i].name === 'main' || execConfig.scripts[i].name === 'main.js')
						Loader.addScript('file://' + execConfig.scripts[i].tmpFile, execConfig.scripts[i].tmpFile);
				}

				Loader.onload = function()
				{
					var startTime = (new Date()).getTime();

					viewManager.refresh();

					$this.onEndProgram();

					if (typeof waitScreen !== 'undefined')
						document.getElementById('main').removeChild(waitScreen);

					var endTime = (new Date()).getTime();
					var execTime = endTime - startTime;
					var sec = execTime/1000.0;
					console.log("Execution time : " + sec);

					errorConsole.getById('errorConsole').innerHTML = errorConsole.getById('errorConsole').innerHTML 
																	+ '<span style="color: rgb(0, 255, 0);" >Execution time : ' + sec + 's</span><br /><br />';
				};
				
				Loader.load();
			};

			Loader.load();
		}
	};

	//*
	this.insertCode = function($code)
	{
		var selectedTab = tabManager.getSelected();

		if (utils.isset(selectedTab))
		{
			var selectedScriptEditor = selectedTab.getContent();

			var codeToInsert = $code.replaceAll('&amp;', '&').replaceAll('&lt;', '<').replaceAll('&gt;', '>');

			if (codeToInsert.includes('\n'))
				codeToInsert = '\n' + codeToInsert + '\n';

			//selectedScriptEditor.insertCode('\n\r' + $code + '\n\r');
			selectedScriptEditor.insertCode(codeToInsert);
			$this.setSaved(false);
		}
	};
	//*/

	this.pasteCode = function($code) {}; // A surcharger

	this.restoreScroll = function()
	{
		var selectedTab = tabManager.getSelected();

		if (utils.isset(selectedTab))
		{
			var selectedScriptEditor = selectedTab.getContent();
			selectedScriptEditor.restoreScroll();
		}
	};

	this.displayError = function($message, $source, $lineno, $colno, $error)
	{
		var source = $source;

		if (utils.isset(execConfig))
		{
			for (var i = 0; i < execConfig.scripts.length; i++)
			{
				if ($source.indexOf(execConfig.scripts[i].tmpFile) >= 0)
					source = execConfig.scripts[i].name;
			}
		}

		var stack = (new Error()).stack;
		errorConsole.getById('errorConsole').innerHTML = errorConsole.getById('errorConsole').innerHTML
														+ '<span style="color: rgb(242, 98, 33);" >' + $message + ' (at ' + source + '.js:' + $lineno + ':' + $colno + ')</span><br /><br />';
	};

	this.emptyError = function()
	{
		errorConsole.getById('errorConsole').innerHTML = "";

		var scriptParent = script.parentNode;

		if (utils.isset(scriptParent))
			scriptParent.removeChild(script);
	};

	this.execCurrentEditorMethod = function($method, $arg)
	{
		var selectedTab = tabManager.getSelected();

		if (selectedTab)
		{
			var selectedScriptEditor = selectedTab.getContent();

			if (selectedScriptEditor[$method])
				selectedScriptEditor[$method].apply(null, $arg);
		}
	};

	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////

	mainTab.onClose = function()
	{
		var close = false;
		var infoPopup = new InfoPopup('<p>Main script can\'t be removed.</p>');
		document.getElementById('main').appendChild(infoPopup);
		return close;
	};

	mainScriptEditor.onPaste = function($code) { return $this.pasteCode($code); };
	mainScriptEditor.onChange = function($code) { onChange($code); };

	Events.connect('onInsertCode', function($code) { $this.insertCode($code); }, component);

	////////////////
	// Accesseurs //
	////////////////
	
	// GET

	this.getFilePath = function() { return filePath; };
	this.isSaved = function() { return saved; };
	this.getIconsMenu = function() { return iconsMenu; };
	this.getTabManager = function() { return tabManager; };
	this.getSelected = function() { return tabManager.getSelected(); };

	this.getData = function()
	{
		var code = {};

		var tabList = tabManager.getTabList();

		for (var i = 0; i < tabList.length; i++)
		{
			var label = tabList[i].getLabel();
			label = label.replace(/<span>/ig, "").replace(/<\/span>$/ig, "").replace(/\.js$/, "");
			var scriptCode = tabList[i].getContent().getCode();
			code[label] = scriptCode;
		}

		return code;
	};

	// SET

	this.setFilePath = function($filePath) { filePath = $filePath; };

	this.setSaved = function($saved)
	{
		saved = $saved;
		viewManager.updateSavedStatus(saved);

		if (saved === false)
			window.electronAPI.setNotSavedFiles(true);
	};

	this.setData = function($code)
	{
		Object.keys($code).forEach(function($key)
		{
			if ($key === 'main')
				mainScriptEditor.setCode($code['main']);
			else
				createScript($key, $code[$key]);
		});

		tabManager.getTabList()[0].select();
	};

	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	return $this;
}