function PeguyMappingDocument($globalEventPanelClassName)
{
	////////////////
	// Attributes //
	////////////////

	let filePath = "";
	let saved = true;

	let docWidth = 1000;
	let docHeight = 1000;
	let imageData = null;

	let copyEvent = null;
	let tiles = [];

	//// Composants graphiques ////

	const paramsPanel = new ParamPanel();

    const component = new Component('<div class="document" ></div>');

    const grid = new DocGrid();
    component.appendChild(grid);

	var globalEventsListBox = new ListBox();
	globalEventsListBox.setEditMode(true);
	grid.getById('listPanel').appendChild(globalEventsListBox);

	const addIcon = Loader.getSVG('icons', 'plus-icon', 30, 30);
	grid.getById('buttonPanel').appendChild(addIcon);

	const workspace = new Workspace(this, 800, 600, docWidth, docHeight, parseInt(paramsPanel.getTileSize()));
	grid.getById('rightPanel').appendChild(workspace);

	/*
{{INSERT CODE}}
	//*/

	/////////////
	// Methods //
	/////////////

	const elementNameIsOk = function($elementName)
	{
		let elementNameOk = false;

		if (/^[a-zA-Z0-9]+$/.test($elementName))
			elementNameOk = true;

		return elementNameOk;
	};

	const checkIfElementExists = function($name)
	{
		let exists = false;

		const list = globalEventsListBox.getElementsList();

		for (var i = 0; i < list.length; i++)
		{
			if ($name === list[i]['name'])
			{
				exists = true;
				i = list.length;
			}
		}

		return exists;
	};

	const createGlobalEvent = function($name, $data)
	{
		console.log($name, $data);

		var itemPanel = new $globalEventPanelClassName('Global event "' + $name + '"');
		itemPanel.loadFromJSON($data);
		var itemHtml = '<div>' + $name + '</div>';
		var globalEventItem = new ListItem(itemHtml);
		globalEventItem.name = $name;
		globalEventItem.panel = itemPanel;

		globalEventItem.onDblClick = function()
		{
			console.log("Open edit popup for global event " + this.name);

			const infoPopup = new InfoPopup('<div id="paramPanelCanvas" class="paramPanelCanvas" ></div>');
			infoPopup.getById('paramPanelCanvas').appendChild(this.panel);
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
			component.appendChild(infoPopup);
		};
		
		globalEventItem.onContextMenu = function($event)
		{
			const item = this;

			Events.preventDefault($event);
			const mousePosition = document.getElementById('main').mousePosition($event);
			const contextMenu = new ContextMenu(mousePosition.x, mousePosition.y);

			const renameEventItem = new MenuItem("Rename global event");

			renameEventItem.onAction = function()
			{
				const popupHTML = '<h3>Rename global event</h3>'
						+ '<p>'
							+ '<input id="element-name" type="text" placeholder="Global event name" value="' + item.name + '" />'
						+ '</p>';

				const renamePopup = new ConfirmPopup(popupHTML);

				renamePopup.onOk = function()
				{
					let ok = false;

					const elementName = this.getById('element-name').value;

					if (utils.isset(elementName) && elementName !== "" && elementNameIsOk(elementName) === true && checkIfElementExists(elementName) === false)
					{
						item.name = elementName;
						item.panel.setName('Global event "' + elementName + '"');
						item.setLabel('<div>' + elementName + '</div>');
						$this.setSaved(false);
						ok = true;
					}
					else if (elementNameIsOk(elementName) !== true)
					{
						ok = false;
						const infoPopup = new InfoPopup('<p>The name is incorrect (only ASCII characters).</p>');
						document.getElementById('main').appendChild(infoPopup);
					}
					else if (checkIfElementExists(elementName) === true)
					{
						ok = false;
						const infoPopup = new InfoPopup('<p>A global event with this name already exists.</p>');
						document.getElementById('main').appendChild(infoPopup);
					}
					else
					{
						ok = false;
						const infoPopup = new InfoPopup('<p>The name can\'t be empty.</p>');
						document.getElementById('main').appendChild(infoPopup);
					}

					return ok;
				};

				document.getElementById('main').appendChild(renamePopup);
			};

			contextMenu.addElement(renameEventItem);
			
			const removeEventItem = new MenuItem("Remove global event");

			removeEventItem.onAction = function()
			{
				var removePopup = new ConfirmPopup('<p>Are you sure you want to remove this global event? </p>');
				document.getElementById('main').appendChild(removePopup);

				removePopup.onOk = function()
				{
					globalEventsListBox.removeElement(item);
					$this.setSaved(false);
					return true;
				};
			};

			contextMenu.addElement(removeEventItem);
		};

		globalEventsListBox.addElement(globalEventItem);
	};

	const createNewGlobalEvent = function()
	{
		const popupHTML = '<h3>Add new global event</h3>'
						+ '<p>'
							+ '<input id="element-name" type="text" placeholder="Global event name" />'
						+ '</p>';

		const addPopup = new ConfirmPopup(popupHTML);

		addPopup.onOk = function()
		{
			let ok = false;

			const elementName = this.getById('element-name').value;

			if (utils.isset(elementName) && elementName !== "" && elementNameIsOk(elementName) === true && checkIfElementExists(elementName) === false)
			{
				createGlobalEvent(elementName, { "name": elementName });
				$this.setSaved(false);
				ok = true;
			}
			else if (elementNameIsOk(elementName) !== true)
			{
				ok = false;
				const infoPopup = new InfoPopup('<p>The name is incorrect (only ASCII characters).</p>');
				document.getElementById('main').appendChild(infoPopup);
			}
			else if (checkIfElementExists(elementName) === true)
			{
				ok = false;
				const infoPopup = new InfoPopup('<p>A global event with this name already exists.</p>');
				document.getElementById('main').appendChild(infoPopup);
			}
			else
			{
				ok = false;
				const infoPopup = new InfoPopup('<p>The name can\'t be empty.</p>');
				document.getElementById('main').appendChild(infoPopup);
			}

			return ok;
		};

		document.getElementById('main').appendChild(addPopup);
	};

	const unselectAllTiles = function()
	{
		for (let i = 0; i < tiles.length; i++)
		{
			for (let j = 0; j < tiles[i].length; j++)
				tiles[i][j].unselect();
		}
	};

	const createNewTile = function($x, $y, $tileSize)
	{
		const tile = new Tile($x, $y, $tileSize);

		tile.onClick = function()
		{
			unselectAllTiles();
			this.select();
			grid.getById('bottomPanel').empty();
			const tileEvent = this.getEvent();

			if (utils.isset(tileEvent))
				grid.getById('bottomPanel').appendChild(tileEvent);
		};

		tile.onDblClick = function()
		{
			this.createEvent();
			unselectAllTiles();
			this.select();
			console.log("Click on " + $x + ', ' + $y);
			console.log(this);
			grid.getById('bottomPanel').empty();
			grid.getById('bottomPanel').appendChild(this.getEvent());
		};

		tile.onContextMenu = function($event)
		{
			const tile = this;
			const tileEvent = tile.getEvent();

			Events.preventDefault($event);
			const mousePosition = document.getElementById('main').mousePosition($event);
			const contextMenu = new ContextMenu(mousePosition.x, mousePosition.y);
			
			if (utils.isset(tileEvent))
			{
				const removeEventItem = new MenuItem("Remove event");

				removeEventItem.onAction = function()
				{
					if (tileEvent === grid.getById('bottomPanel').firstChild)
						grid.getById('bottomPanel').empty();

					tile.emptyEvent();
				};

				contextMenu.addElement(removeEventItem);

				const copyEventItem = new MenuItem("Copy event");
				copyEventItem.onAction = function() { copyEvent = tileEvent; };
				contextMenu.addElement(copyEventItem);
			}
			else if (utils.isset(copyEvent))
			{
				const pastEventItem = new MenuItem("Past event");
				pastEventItem.onAction = function() { tile.setEvent(copyEvent); };
				contextMenu.addElement(pastEventItem);
			}
		};

		return tile;
	};

	const createTiles = function($startRow, $startCol, $nbRows, $nbCol, $tileSize)
	{
		for (let i = $startRow; i < $nbRows; i++)
		{
			let row = [];
			const y = i*$tileSize;

			for (let j = $startCol; j < $nbCol; j++)
			{
				const x = j*$tileSize;
				const tile = createNewTile(x, y, $tileSize);
				row.push(tile);
			}

			tiles.push(row);
		}
	};

	const updateTiles = function()
	{
		const tileSize = parseInt(paramsPanel.getTileSize());
		const nbRows = Math.floor(docHeight/tileSize) + 1;
		const nbCol = Math.floor(docWidth/tileSize) + 1;

		// Mise à jour du workspace
		workspace.setTileSize(tileSize);
		workspace.setDocDimensions(docWidth, docHeight);

		// Création des tiles s'il en manque

		if (tiles.length <= 0)
			createTiles(0, 0, nbRows, nbCol, tileSize);
		else
		{
			if (tiles.length < nbRows)
				createTiles(tiles.length, 0, nbRows, nbCol, tileSize);
			else if (tiles.length > nbRows)
				tiles = tiles.slice(0, nbRows);

			for (let i = 0; i < tiles.length; i++)
			{
				const y = i*tileSize;

				if (tiles[i].length < nbCol)
				{
					for (let j = tiles[i].length; j < nbCol; j++)
					{
						const x = j*tileSize;
						const tile = createNewTile(x, y, tileSize);
						tiles[i].push(tile);
					}
				}
				else if (tiles[i].length > nbCol)
					tiles[i] = tiles[i].slice(0, nbCol);
			}
		}

		// Mettre à jour le workspace

		workspace.emptyTiles();

		for (let i = 0; i < tiles.length; i++)
		{
			const y = i*tileSize;

			for (let j = 0; j < tiles[i].length; j++)
			{
				const x = j*tileSize;
				tiles[i][j].setPositionAndSize(x, y, tileSize);
				workspace.addTile(tiles[i][j]);
			}
		}

		unselectAllTiles();
	};

	//// Afficher la popup de réglages de projet ////

	this.openParams = function()
	{
		const infoPopup = new InfoPopup('<div id="paramPanelCanvas" class="paramPanelCanvas" ></div>');
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

		infoPopup.onClose = function() { updateTiles(); };
	};

	const displayBitmap = function($callback)
	{
		var tmpImg = new Image();

		tmpImg.onload = function()
		{
			docWidth = tmpImg.width;
			docHeight = tmpImg.height;

			workspace.getSVG().getById('imageGroup').empty();

			var layer = new SVGhtml(docWidth, docHeight, '');
			var canvas = new Canvas2D(docWidth, docHeight);
			layer.appendChild(canvas);
			var img = Image2D(tmpImg, 0, 0, docWidth, docHeight, 0, 0, docWidth, docHeight);
			canvas.addObject(img);
			canvas.render();

			workspace.getSVG().getById('imageGroup').appendChild(layer);

			updateTiles();

			if (utils.isset($callback))
				$callback();
		};

		tmpImg.src = imageData;
	};

	const displaySVG = function($callback)
	{
		var base64Data = imageData.replace('data:image/svg+xml;base64,', '');
		var decodedData = atob(base64Data);

		var svgData = decodedData.replace(/<\?xml [^<]*>/, '').replace(/<!DOCTYPE [^<]*>/, '');
		var svgNode = new Component(svgData);

		var viewBox = svgNode.getAttribute('viewBox');
		docWidth = parseInt(viewBox.replace(/^[0-9]+ [0-9]+/, '').replace(/ [0-9]+$/, ''));
		docHeight = parseInt(viewBox.replace(/^[0-9]+ [0-9]+ [0-9]+ /, ''));

		svgData = svgData.replace(/<\/svg [^<]*>/, '').replace(/<svg [^<]*>/, '');
		svgNode = new Component('<g>' + svgData + '</g>');

		workspace.getSVG().getById('imageGroup').empty();
		workspace.getSVG().getById('imageGroup').appendChild(svgNode);

		if (utils.isset($callback))
			$callback();
	};

	this.insertCode = function($code) {};
	this.resize = function resize() {};

	////////////
	// Events //
	////////////

	addIcon.onClick = function() { createNewGlobalEvent(); };

	const onChange = function($data)
	{
		$this.setSaved(false);
	};

	this.onResize = function()
	{
		var width = grid.getById('leftPanel').offsetWidth;
		var height = grid.getById('leftPanel').offsetHeight;
		workspace.setDimensions(width, height);
	};

	////////////////////////
	// Getter and setters //
	////////////////////////

	// GET
	
	this.getFilePath = function() { return filePath; };
	this.isSaved = function() { return saved; };

	this.getData = function()
	{
		let data = {};

		data['filePath'] = filePath;
		data['docWidth'] = docWidth;
		data['docHeight'] = docHeight;
		data['imageData'] = imageData;
		data['params'] = paramsPanel.getJSON();
		data['globalEvents'] = [];
		data['mapEvents'] = {};

		const globalEventList = globalEventsListBox.getElementsList();

		for (var i = 0; i < globalEventList.length; i++)
		{
			let eventData = globalEventList[i].panel.getJSON();
			eventData['name'] = globalEventList[i].name;
			data['globalEvents'].push(eventData);
		}

		for (var i = 0; i < tiles.length; i++)
		{
			for (let j = 0; j < tiles[i].length; j++)
			{
				const tileEvent = tiles[i][j].getEvent();

				if (utils.isset(tileEvent))
				{
					let eventData = tileEvent.getJSON();
					eventData['x'] = tiles[i][j].getX();
					eventData['y'] = tiles[i][j].getY();
					eventData['size'] = tiles[i][j].getSize();
					data['mapEvents'][i + ',' + j] = eventData;
				}
			}
		}

		return data;
	};

	this.getImageData = function() { return imageData; };
	
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
		//console.log($data);

		if (utils.isset($data['docWidth']))
			docWidth = $data['docWidth'];

		if (utils.isset($data['docHeight']))
			docHeight = $data['docHeight'];
		
		if (utils.isset($data['imageData']))
			imageData = $data['imageData'];

		if (utils.isset($data['params']))
			paramsPanel.loadFromJSON($data['params']);

		if (utils.isset($data['globalEvents']))
		{
			for (let i = 0; i < $data['globalEvents'].length; i++)
				createGlobalEvent($data['globalEvents'][i]['name'], $data['globalEvents'][i]);
		}

		const callback = function()
		{
			console.log($data['mapEvents']);

			if (utils.isset($data['mapEvents']))
			{
				for (let key in $data['mapEvents'])
				{
					const eventData = $data['mapEvents'][key];
					console.log(eventData);
					const indexies = key.split(',');
					const i  = parseInt(indexies[0]);
					const j  = parseInt(indexies[1]);
					const tile = tiles[i][j];
					console.log(tile);
					tile.setPositionAndSize(eventData['x'], eventData['y'], parseInt(paramsPanel.getTileSize()));
					tile.createEvent();
					const tileEvent = tile.getEvent();
					tileEvent.loadFromJSON(eventData);
				}
			}
		};

		if (/^data:image\/(png|PNG|jpg|JPG|jpeg|JPEG)/.test(imageData))
				displayBitmap(callback);
		else if (/^data:image\/svg\+xml/.test(imageData))
		{
			displaySVG();
			updateTiles();
			callback();
		}
	};

	this.setImageData = function($file)
	{
		//console.log($file);

		if (/^image\/(png|PNG|jpg|JPG|jpeg|JPEG)/.test($file.type) || /^image\/svg\+xml/.test($file.type))
		{
			imageData = $file.data;
			//console.log(imageData);

			if (/^image\/(png|PNG|jpg|JPG|jpeg|JPEG)/.test($file.type))
				displayBitmap();
			else if (/^image\/svg\+xml/.test($file.type))
			{
				displaySVG();
				updateTiles();
			}
		}
	};
	
	/////////////
	// Extends //
	/////////////
	
	const $this = utils.extend(component, this);
	updateTiles();
	return $this; 
}