function PeguyViewManager($gridHTML, $config, $rerouteToDoc)
{
	///////////////
	// Attributs //
	///////////////

	this.notSavedMark = '<span style="color: rgb(242, 98, 33); " >•</span> ';

	var gridHTML = $gridHTML;
	var config = $config;

	var plugins = [];
	var lastCodeEditor = null;
	
	var component = new Component('<div class="viewManager" >' + gridHTML + '</div>');

	//// Menu Bar ////

	var menuBar = new MenuBar();

	//// Tab manager ////

	var tabManager = new TabManager();
	tabManager.setEditMode(true);

	if (config && config.mapping && config.mapping.tabManager 
		&& component.getById(config.mapping.tabManager))
	{
		component.getById(config.mapping.tabManager).appendChild(tabManager);
	}

	//// Help frame ////

	var frameInitWidth = Math.round(PEGUY.main.offsetWidth*0.6);
	var frameInitHeight = Math.round(PEGUY.main.offsetHeight*0.6);
	var frameInitX = Math.round(PEGUY.main.offsetWidth*0.2);
	var frameInitY = Math.round(PEGUY.main.offsetHeight*0.2);

	var localDocFrame = new PeguyHelpFrame();
	localDocFrame.setDimensions(frameInitWidth, frameInitHeight);
	localDocFrame.setPosition(frameInitX, frameInitY);

	var onlineDocFrame = new PeguyOnlineDocFrame();
	onlineDocFrame.setDimensions(frameInitWidth, frameInitHeight);
	onlineDocFrame.setPosition(frameInitX, frameInitY);

	//// Centre de notifications ////

	var notifCenter = new NotificationsManager();

	/*
{{INSERT CODE}}
	//*/

	//////////////
	// Méthodes //
	//////////////

	var initMenu = function()
	{
		var menu = [];
		document.getElementById('main').appendChild(menuBar);

		if (config && config.menu)
		{
			config.menu.every(function($item)
			{
				if ($item.name === 'file')
				{
					var fileItem =
					{
						label: $item.label,
						name: 'file',
						children:
						[
							{ label: 'New', name: 'new', shortcut: Events.metaKey + 'N', onAction: function() { createNewTab("New project", "", {}); } },
							{ separator: true },

							{ label: 'Open file...', name: 'open-file', shortcut: Events.metaKey + 'O', onAction: async function()
								{
									if (window.electronAPI && window.electronAPI.openFile)
									{
										var filesList = await window.electronAPI.openFile();
										var tabList = tabManager.getTabList();

										for (var i = 0; i < filesList.length; i++)
										{
											if (checkIfOpen(filesList[i].path) === false)
												createNewTab(filesList[i].name, filesList[i].path, filesList[i].content);
										}
									}
								}
							},

							{ label: 'Open recent', name: 'open-recent', children: [] },
							{ separator: true },

							{ label: 'Save', name: 'save', shortcut: Events.metaKey + 'S', disable: true, onAction: function() { saveSelected(); } },
							
							{ label: 'Save as...', name: 'save-as', shortcut: '⇧' + Events.metaKey + 'S', disable: true, onAction: async function()
								{
									if (window.electronAPI && window.electronAPI.saveFileAs)
									{
										var selectedTab = tabManager.getSelected();

										if (utils.isset(selectedTab))
										{
											var data = selectedTab.getContent().getData();

											var file = await window.electronAPI.saveFileAs(data);

											if (utils.isset(file))
											{
												selectedTab.setLabel(file.name);
												selectedTab.getContent().setFilePath(file.path);
												selectedTab.getContent().setSaved(true);
												$this.onSave(file);
												var message = '<p style="text-align: left;" >The file "' + file.name + '" has been saved.</p>';
												notifCenter.push(message, false);
												$this.checkSavedFiles();
											}
										}
									}
								}
							},
							{ separator: true },
						]
					};

					$item.children.forEach(function($subItem) { fileItem.children.push($subItem); });
					menu.push(fileItem);

					return false;
				}

				return true;
			});

			config.menu.forEach(function($item)
			{
				if ($item.name !== 'file')
					menu.push($item);
			});

			var helpItem =
			{
				label: 'Documentation',
				name: 'documentation',
				children:
				[
					{ label: 'Local doc', name: 'localDoc', shortcut: Events.metaKey + 'H', disable: false, onAction: function() { localDocFrame.display(); } },
					{ label: 'Online doc', name: 'onlineDoc', shortcut: '⇧' + Events.metaKey + 'H', disable: false, onAction: function() { onlineDocFrame.display(); } },
				]
			};

			menu.push(helpItem);
		}

		menuBar.loadFromJSON(menu);
	};

	this.init = function()
	{
		document.getElementById('main').appendChild(notifCenter);

		if (window.electronAPI && window.electronAPI.loadSettingsInGUI)
			window.electronAPI.loadSettingsInGUI();
	};

	this.resize = function() {};

	activateMenu = function() { menuBar.enableByNames(config.MenuToActivate); };
	unactivateMenu = function() { menuBar.disableByNames(config.MenuToActivate); };

	this.activateMenu = function() { activateMenu(); };
	this.unactivateMenu = function() { unactivateMenu(); };

	this.namePopup = function($label, $elementLabel, $element, $checkFunction, $confirmFunction)
	{
		var popupHTML = '<h3>' + $label + '</h3>'
						+ '<p><input id="elementName" type="text" value="' + ($element ? $element.name : '') + '" style="width: 250px; " /></p>';

		var confirmPopup = new ConfirmPopup(popupHTML);

		confirmPopup.onOk = async function()
		{
			var isOk = false;
			var elementName = this.getById('elementName').value;

			if (!utils.isset(elementName) || elementName === '')
			{
				var errorPopup = new InfoPopup('<p style="text-align: left;" >The ' + $elementLabel + ' name is missing.</p>');
				document.getElementById('main').appendChild(errorPopup);
			}
			else
			{
				var checkMessage = await $checkFunction(elementName);

				if (checkMessage && checkMessage !== '')
				{
					var errorPopup = new InfoPopup('<div style="text-align: left;" >' + checkMessage + '</div>');
					document.getElementById('main').appendChild(errorPopup);
				}
				else
				{
					if ($element)
						$element.name = elementName;

					isOk = await $confirmFunction(elementName);

					if (isOk)
						confirmPopup.hide();
				}
			}

			return isOk;
		};

		document.getElementById('main').appendChild(confirmPopup);
	};

	this.createElementPopup = function($elementLabel, $checkFunction, $createFunction)
	{
		this.namePopup('Add ' + $elementLabel, $elementLabel, null, $checkFunction, $createFunction);
	};

	this.renameElement = function($elementLabel, $element, $checkFunction, $onRename)
	{
		this.namePopup('Rename ' + $elementLabel, $elementLabel, $element, $checkFunction, $onRename);
	};

	this.deleteElement = function($elementLabel, $element, $onDelete)
	{
		var popupHTML = '<h3>Delete ' + $elementLabel + '</h3>'
						+ '<p>Are you sure you want delete the ' + $elementLabel + ' named "' + $element.name + '"?</p>';

		var confirmPopup = new ConfirmPopup(popupHTML);

		confirmPopup.onOk = async function()
		{
			await $onDelete($element);
			confirmPopup.hide();
			return true;
		};

		document.getElementById('main').appendChild(confirmPopup);
	};

	this.initContext = function($element, $elementLabel, $checkFunction, $onRename, $onDelete)
	{
		$element.onContextMenu = function($event)
		{
			Events.preventDefault($event);
			var mousePosition = document.getElementById('main').mousePosition($event);
			var contextMenu = new ContextMenu(mousePosition.x, mousePosition.y);

			var renameMenu = new MenuItem("Rename " + $element.name + "...");
			contextMenu.addElement(renameMenu);
			renameMenu.onAction = function() { $this.renameElement($elementLabel, $element, $checkFunction, async function($renameElementName) { return await $onRename($renameElementName); }); };

			var deleteMenu = new MenuItem("Delete " + $element.name + "...");
			contextMenu.addElement(deleteMenu);
			deleteMenu.onAction = function() { $this.deleteElement($elementLabel, $element, $onDelete); };
		};
	};

	this.createListItem = function($elementName, $elementLabel, $listBox, $checkFunction, $onSelect, $onDelete)
	{
		var itemHTML = '<div class="elementRow" ><div id="elementName" >' + $elementName + '</div></div>';
		var item = new ListItem(itemHTML);
		item.name = $elementName;

		$this.initContext(item, $elementLabel, $checkFunction, async function($renameElementName)
		{
			item.getById('elementName').innerHTML = $renameElementName;
			return true;
		}, $onDelete);

		item.onClick = function() { $onSelect(item); };
		
		$listBox.addElement(item);
		return item;
	};

	this.createDocument = function($filePath, $data) {}; // A surcharger

	this.createNewTab = function($tabName, $filePath, $data) { createNewTab($tabName, $filePath, $data); };

	var createNewTab = function($tabName, $filePath, $data)
	{
		var newDocument = $this.createDocument($filePath, $data);
		var tab = new Tab($tabName, newDocument);
		tabManager.addTab(tab);

		activateMenu();

		tab.onClose = function()
		{
			var close = false;
			var saved = tab.getContent().isSaved();

			if (saved === true)
			{
				$this.onCloseFile(tab.getContent().getFilePath());
				close = true;
			}
			else
			{
				var savePopup = new SavePopup('<p>The modifications of the project "' + tab.getContent().getFilePath() + '" have not been saved. Do you want save them before closing ? </p>');
				document.getElementById('main').appendChild(savePopup);

				savePopup.onDontSave = function()
				{
					$this.onCloseFile(tab.getContent().getFilePath());
					tabManager.removeTab(tab);
					return true;
				};

				savePopup.onSave = async function()
				{
					var saveSuccess = await save(tab);

					if (saveSuccess !== true)
					{
						var message = '<p style="text-align: left;" >An error occured when trying to save the file "' + tab.getLabel() + '".</p>';
						notifCenter.push(message, false);
					}
					else
					{
						$this.onCloseFile(tab.getContent().getFilePath());
						tabManager.removeTab(tab);
						this.hide();
					}

					return saveSuccess;
				};
			}

			return close;
		};

		tab.onSelect = function($tab)
		{
			var tabContent = $tab.getContent();

			if (tabContent.onSelect)
				tabContent.onSelect();

			//$tab.getContent().restoreScroll();
		};

		newDocument.resize();
	};

	this.openFile = async function($filePath)
	{
		if (window.electronAPI && window.electronAPI.openRecentFile)
		{
			const file = await window.electronAPI.openRecentFile($filePath);

			if (utils.isset(file))
			{
				if (checkIfOpen(file.path) === false)
				{
					/*
					if (typeof file.content === 'string')
						createNewTab(file.name, file.path, file.content);
					else
						
					console.log(file.content);

					try
					{
						createNewTab(file.name, file.path, JSON.parse(file.content));
					}
					catch ($error)
					{
						createNewTab(file.name, file.path, file.content);
					}
					//*/

					createNewTab(file.name, file.path, file.content);
				}
			}
			else
			{
				var message = '<p style="text-align: left;" >The file "' + $filePath + '" doesn\'t exist.</p>';
				notifCenter.push(message, false);
			}
		}
	};

	this.checkSavedFiles = function()
	{
		var isNotSavedFiles = false;
		var tabList = tabManager.getTabList();

		for (var i = 0; i < tabList.length; i++)
		{
			if (tabList[i].getContent().isSaved() === false)
			{
				isNotSavedFiles = true;
				i = tabList.length;
			}
		}

		if (window.electronAPI && window.electronAPI.setNotSavedFiles)
			window.electronAPI.setNotSavedFiles(isNotSavedFiles);
	};

	this.confirmCloseApp = function()
	{
		var savePopup = new SavePopup('<p>The modifications of some files have not been saved. Do you want save them before closing ? </p>');
		document.getElementById('main').appendChild(savePopup);

		savePopup.onDontSave = function()
		{
			if (window.electronAPI)
			{
				if (window.electronAPI.setNotSavedFiles)
					window.electronAPI.setNotSavedFiles(false);

				if (window.electronAPI.quit)
					window.electronAPI.quit();
			}

			return true;
		};

		savePopup.onSave = async function()
		{
			var tabList = tabManager.getTabList();

			for (var i = 0; i < tabList.length; i++)
			{
				if (tabList[i].getContent().isSaved() === false)
					await save(tabList[i]);
			}

			if (window.electronAPI && window.electronAPI.quit)
				window.electronAPI.quit();

			return true;
		};
	};

	this.onSave = function($file) {}; // A surcharger

	var save = async function($tab)
	{
		var success = false;

		if (window.electronAPI && window.electronAPI.saveFile)
		{
			var fileName = '';

			var filePath = $tab.getContent().getFilePath();
			var data = $tab.getContent().getData();
			
			// Enregistrer fichier existant
			if (utils.isset(filePath) && filePath !== '')
			{
				const file = await window.electronAPI.saveFile(filePath, data);

				if (utils.isset(file))
				{
					fileName = file.name;
					success = true;
				}
			}
			// Enregistrer un nouveau fichier
			else
			{
				const file = await window.electronAPI.saveFileAs(data);

				if (utils.isset(file))
				{
					fileName = file.name;
					$tab.setLabel(file.name);
					$tab.getContent().setFilePath(file.path);
					$this.onSave(file);
					success = true;
				}
			}

			if (success === true)
			{
				$tab.getContent().setSaved(true);
				var message = '<p style="text-align: left;" >The file "' + fileName + '" has been saved.</p>';
				notifCenter.push(message, false);
				$this.checkSavedFiles();
			}
		}

		return success;
	};

	var saveSelected = function()
	{
		var selectedTab = tabManager.getSelected();

		if (utils.isset(selectedTab))
			save(selectedTab);
	};

	this.save = function() { saveSelected(); };

	var checkIfOpen = function($filePath)
	{
		var open = false;

		var tabList = tabManager.getTabList();

		for (var j = 0; j < tabList.length; j++)
		{
			// S'il est ouvert, on met le focus sur son onglet
			if ($filePath === tabList[j].getContent().getFilePath())
			{
				tabList[j].select();
				open = true;
				j = tabList.length;
			}
		}

		return open;
	};

	this.updateRecentFiles = function($recentFiles)
	{
		var itemOpenRecent = menuBar.getByName('open-recent');

		if (itemOpenRecent)
		{
			itemOpenRecent.removeAllElements();

			for (var i = $recentFiles.recentFiles.length-1; i >= 0 ; i--)
			{
				var recentFileItem = new MenuItem($recentFiles.recentFiles[i]);
				itemOpenRecent.addElement(recentFileItem);
				recentFileItem.onAction = async function() { $this.openFile(this.getLabel()); };
			}
		}
	};

	this.updateHelp = function($localDocData) { localDocFrame.loadFromJSON($localDocData); };
	this.updateOnlineDoc = function($onlineDocData) { onlineDocFrame.loadFromJSON($onlineDocData); };

	this.updateScripts = function($scripts)
	{
		$scripts.plugins.forEach(function($plugin) { Loader.addScript($plugin, $plugin); });
		$scripts.jargon.sources.forEach(function($source) { Loader.addScript($source, $source); });
		$scripts.jargon.targets.forEach(function($target) { Loader.addScript($target, $target); });

		Loader.onload = function() {};
		Loader.load();
	};

	this.updateSavedStatus = function($saved)
	{
		var selectedTab = tabManager.getSelected();

		if (utils.isset(selectedTab))
		{
			var tabLabel = selectedTab.getLabel();

			if ($saved === true)
			{
				var newLabel = tabLabel.replace($this.notSavedMark, '');
				selectedTab.setLabel(newLabel);
			}
			else if (tabLabel.indexOf($this.notSavedMark) < 0)
			{
				var newLabel = $this.notSavedMark + tabLabel;
				selectedTab.setLabel(newLabel);
			}
		};
	};

	this.resetCodeEditor = function() { lastCodeEditor = null; };

	this.insertCode = function($codeToInsert)
	{
		const selectedTab = tabManager.getSelected();

		if (utils.isset(selectedTab) && utils.isset(lastCodeEditor))
		{
			var codeToInsert = $codeToInsert.replaceAll('&amp;', '&').replaceAll('&lt;', '<').replaceAll('&gt;', '>');

			if (codeToInsert.includes('\n'))
				codeToInsert = '\n' + codeToInsert + '\n';

			lastCodeEditor.insertCode(codeToInsert);
			selectedTab.getContent().setSaved(false);
		}
	};

	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////

	this.onCloseFile = function($path) {};

	//// Clavier ////

	Events.save = function($event) { saveSelected(); };
	Events.saveAs = function($event) { saveSelected(); };

	Events.close = function($event)
	{
		var selectedTab = tabManager.getSelected();

		if (utils.isset(selectedTab))
			selectedTab.close();
	};
	
	Events.quit = function($event) { window.electronAPI.quit(); };

	//// Code editor ////

	Events.connect('onCodeEditorClick', function($codeEditor, $code) { lastCodeEditor = $codeEditor; }, component);
	Events.connect('onCodeEditorChange', function($codeEditor, $code) { lastCodeEditor = $codeEditor; }, component);

	//*
	if ($rerouteToDoc !== true)
		Events.connect('onInsertCode', function($code) { $this.insertCode($code); }, component);
	//*/

	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	
	this.getPlugins = function() { return plugins; };
	this.getMenuBar = function() { return menuBar; };
	this.getTabManager = function() { return tabManager; };
	this.getSelected = function() { return tabManager.getSelected(); };
	this.getTabList = function() { return tabManager.getTabList(); };
	this.getNotifCenter = function() { return notifCenter; };
	this.getLocalDocFrame = function() { return localDocFrame; };
	this.getOnlineDocFrame = function() { return onlineDocFrame; };
	
	// SET

	var $this = utils.extend(component, this);
	initMenu();
	Components.focus.default = $this;
	return $this;
}