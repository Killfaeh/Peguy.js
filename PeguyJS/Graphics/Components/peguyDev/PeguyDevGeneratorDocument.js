function PeguyDevGeneratorDocument($types)
{
	////////////////
	// Attributes //
	////////////////

	var filePath = "";
	var saved = true;

	var paramsPanel = new ParamPanel("Project parameters");

	var types = $types;

    var component = new Component('<div class="document" ></div>');

    var grid = new DocGrid();
    component.appendChild(grid);

	//// Accordéon de structure du projet ////

	var accordion = new Accordion(false);

	for (var key in types)
	{
		var accordionPanel = new Component('<div><div id="list" ></div><div id="buttons" class="buttons" ></div></div>');

		var listBox = new ListBox();
		listBox.setEditMode(true);
		accordionPanel.getById('list').appendChild(listBox);

		var addIcon = Loader.getSVG('icons', 'plus-icon', 20, 20);
		accordionPanel.getById('buttons').appendChild(addIcon);
		addIcon.type = key;

		types[key]['listBox'] = listBox;
		types[key]['addIcon'] = addIcon;

		var accordionItem = new AccordionItem('<span>' + types[key]['label'] + '</span>', accordionPanel);
		accordion.addElement(accordionItem);
		accordionItem.open();
	};

	grid.getById('leftPanel').appendChild(accordion);

	/*
{{INSERT CODE}}
	//*/

	/////////////
	// Methods //
	/////////////

	//// Création d'élément ////

	var createElement = function($type, $data)
	{
		var type = types[$type];
		var formPanel = new type['constructor']($data['name']);
		formPanel.loadFromJSON($data['fields']);

		var listBoxItem = new ListItem('<div style="position: relative; " ><span>' + $data['name'] + '</span><span id="remove-icon" class="remove-icon" ></span></div>');

		// Icône de suppression

		var removeIcon = Loader.getSVG('icons', 'close-icon', 20, 20);
		removeIcon['name'] = $data['name'];
		removeIcon['type'] = $type;
		removeIcon['formPanel'] = formPanel;
		removeIcon['this'] = listBoxItem;

		removeIcon.onClick = function()
		{
			var type = types[this['type']];
			var formPanel = this['formPanel'];
			var listBoxItem = this['this'];

			var removePopup = new ConfirmPopup('<p>Are you sure you want to remove the ' + type['label'] + ' ' + this['name'] + '?</p>');

			removePopup.onOk = function()
			{
				var currentPanel = grid.getById('rightPanel').firstChild;

				if (utils.isset(currentPanel) && formPanel === currentPanel)
					grid.getById('rightPanel').empty();

				type['listBox'].removeElement(listBoxItem);
				return true;
			};

			document.getElementById('main').appendChild(removePopup);
		};

		// Item de la liste

		listBoxItem.getById('remove-icon').appendChild(removeIcon);
		listBoxItem['name'] = $data['name'];
		listBoxItem['formPanel'] = formPanel;

		listBoxItem.onClick = function()
		{
			viewManager.resetCodeEditor();
			grid.getById('rightPanel').empty();
			grid.getById('rightPanel').appendChild(this['formPanel']);
		};

		type['listBox'].addElement(listBoxItem);
	};

	//// Contrôle lors de la création d'un nouvel élément ////

	var elementNameIsOk = function($elementName)
	{
		var elementNameOk = false;

		if (/^[a-zA-Z0-9]+$/.test($elementName))
			elementNameOk = true;

		return elementNameOk;
	};

	var checkIfElementExists = function($type, $name)
	{
		var exists = false;

		if (utils.isset(types[$type]))
		{
			var list = types[$type]['listBox'].getElementsList();

			for (var i = 0; i < list.length; i++)
			{
				if ($name === list[i]['name'])
				{
					exists = true;
					i = list.length;
				}
			}
		}

		return exists;
	};

	//// Création d'un nouvel élément ////

	var createNewElement = function($type)
	{
		var popupHTML = '<h3>Add New ' + types[$type]['label'] + '</h3>'
						+ '<p>'
							+ '<input id="element-type" type="hidden" value="' + $type + '" />'
							+ '<input id="element-name" type="text" placeholder="' + types[$type]['label'] + ' name" />'
						+ '</p>';

		var addPopup = new ConfirmPopup(popupHTML);

		addPopup.onOk = function()
		{
			var ok = false;

			var elementType = this.getById('element-type').value;
			var elementName = this.getById('element-name').value;

			if (utils.isset(elementName) && elementName !== "" && elementNameIsOk(elementName) === true && checkIfElementExists(elementType, elementName) === false)
			{
				createElement(elementType, { "name": elementName });
				$this.setSaved(false);
				ok = true;
			}
			else if (elementNameIsOk(elementName) !== true)
			{
				ok = false;
				var infoPopup = new InfoPopup('<p>The name is incorrect (only ASCII characters).</p>');
				document.getElementById('main').appendChild(infoPopup);
			}
			else if (checkIfElementExists(elementType, elementName) === true)
			{
				ok = false;
				var infoPopup = new InfoPopup('<p>A ' + types[elementType]['label'] + ' with this name already exists.</p>');
				document.getElementById('main').appendChild(infoPopup);
			}
			else
			{
				ok = false;
				var infoPopup = new InfoPopup('<p>The name can\'t be empty.</p>');
				document.getElementById('main').appendChild(infoPopup);
			}

			return ok;
		};

		document.getElementById('main').appendChild(addPopup);
	};

	//// Autres ////

	this.openParams = function()
	{
		var infoPopup = new InfoPopup('<div id="paramPanelCanvas" class="paramPanelCanvas" ></div>');
		infoPopup.getById('paramPanelCanvas').appendChild(paramsPanel);
		infoPopup.getById('popupContent').style.width = "50%";
		infoPopup.getById('popupContent').style.height = "calc(100% - 80px)";
		infoPopup.getById('innerPopupContent').style.height = "calc(100% - 60px)";
		infoPopup.getById('infoBlock').style.width = "calc(100% - 60px)";
		infoPopup.getById('infoBlock').style.height = "calc(100% - 60px)";
		infoPopup.getById('infoBlock').style.textAlign = "center";
		infoPopup.getById('infoButtons').style.position = "absolute";
		infoPopup.getById('infoButtons').style.left = "0px";
		infoPopup.getById('infoButtons').style.right = "0px";
		infoPopup.getById('infoButtons').style.bottom = "10px";
		infoPopup.getById('infoContent').style.height = "100%";
		infoPopup.getById('infoContent').style.overflow = "auto";
		//document.getElementById('main').appendChild(infoPopup);
		component.appendChild(infoPopup);
	};

	this.insertCode = function($code)
	{
		/*
		var selectedTab = tabManager.getSelected();

		if (utils.isset(selectedTab))
		{
			var selectedScriptEditor = selectedTab.getContent();
			//selectedScriptEditor.insertCode('\n\r' + $code + '\n\r');
			selectedScriptEditor.insertCode('\n\r' + $code.replaceAll('&amp;', '&').replaceAll('&lt;', '<').replaceAll('&gt;', '>') + '\n\r');
			$this.setSaved(false);
		}
		//*/
	};

	this.resize = function resize() {};

	////////////
	// Events //
	////////////

	var onChange = function($data)
	{
		$this.setSaved(false);
	};

	for (var key in types)
		types[key]['addIcon'].onClick = function() { createNewElement(this['type']); };

	////////////////////////
	// Getter and setters //
	////////////////////////

	// GET
	
	this.getFilePath = function() { return filePath; };
	this.isSaved = function() { return saved; };

	this.getData = function()
	{
		var data = {};

		data['filePath'] = filePath;
		data['params'] = paramsPanel.getJSON();
		data['elements'] = {};
		
		for (var key in types)
		{
			data['elements'][key] = [];

			var list = types[key]['listBox'].getElementsList();

			for (var i = 0; i < list.length; i++)
				data['elements'][key].push({ "name": list[i]['name'], "fields": list[i]['formPanel'].getJSON() });
		}

		return data;
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

	this.setData = function($data)
	{
		console.log($data);

		if ($data)
		{
			if ($data['params'])
				paramsPanel.loadFromJSON($data['params']);

			if ($data['elements'])
			{
				for (var key in types)
				{
					if (utils.isset($data['elements'][key]))
					{
						for (var i = 0; i < $data['elements'][key].length; i++)
							createElement(key, $data['elements'][key][i]);
					}
				}
			}
		}
	};
	
	/////////////
	// Extends //
	/////////////
	
	var $this = utils.extend(component, this);
	return $this; 
}

//if (Loader !== null && Loader !== undefined)
//	Loader.hasLoaded("peguyDevGeneratorDocument");
