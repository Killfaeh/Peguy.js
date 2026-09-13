function MenuItem($label, $name, $shortcut)
{
	///////////////
	// Attributs //
	///////////////
	
	var label = $label;
	var name = $name;

	var shortcut = $shortcut;

	if (!utils.isset(shortcut))
		shortcut = '';

	var html = '<li class="menuItem" >'
					+ '<div id="menu-item-label" class="menu-item-label" >'
						+ '<span id="item-label" >' + label + '</span>'
						+ '<span id="arrow" class="arrow">►</span>'
						+ '<span id="shortcut" class="shortcut" >' + shortcut + '</span>'
					+ '</div>'
					+ '<ul id="children-list" class="children-list" ></ul>'
				+ '</li>';
				
	var component = new ListComponent(html);
	component.setNode(component.getById('children-list'));
	
	/*
{{INSERT CODE}}
	//*/

	var deploy = false;
	var updated = false;
	var disable = false;
	var parentMenu = null;
	
	//////////////
	// Méthodes //
	//////////////
	
	var initPosition = function()
	{
		if (parentMenu.isClass('menuBar'))
		{
			component.getById('children-list').setStyle("left", "0px");
			component.getById('children-list').setStyle("top", "100%");
		}
		else
		{
			component.getById('children-list').setStyle("left", "100%");
			component.getById('children-list').setStyle("top", "0px");
		}
		
		component.getById('children-list').setStyle("right", "unset");
		component.getById('children-list').setStyle("bottom", "unset");
		
		component.getById('children-list').setStyle("width", "unset");
		component.getById('children-list').setStyle("height", "unset");
		
		component.getById('children-list').setStyle("overflow", "unset");
	};

	this.update = function()
	{
		if (component.getList().length > 0)
		{
			if (utils.isset(parentMenu) && !parentMenu.isClass('menuBar'))
				component.getById('arrow').style.display = 'inline';
			else
				component.getById('arrow').style.display = 'none';
			
			if (deploy === true && updated === false)
			{
				initPosition();
				
				// Gérer le cas où la liste sort de l'écran
				var parentWidth = parentMenu.offsetWidth;
				var parentHeight = parentMenu.offsetHeight;
				var parentPosition = parentMenu.position();
				var panelWidth = component.getById('children-list').offsetWidth;
				var panelHeight = component.getById('children-list').offsetHeight;
				var panelPosition = component.getById('children-list').position();
				
				//console.log(panelPosition);
				//console.log("Panel height : " + panelHeight);
				//console.log("Screen height : " + Screen.getHeight());
				
				// Si la hauteur ou la largeur est plus grande que celle de l'écran
				
				if (panelHeight > Screen.getHeight() || panelWidth > Screen.getWidth())
				{
					if (panelHeight > Screen.getHeight())
					{
						component.getById('children-list').setStyle("height", (Screen.getHeight()-20) + "px");
						component.getById('children-list').setStyle("top", "10px");
					}
					
					if (panelWidth > Screen.getWidth())
					{
						component.getById('children-list').setStyle("width", (Screen.getWidth()-20) + "px");
						component.getById('children-list').setStyle("left", "10px");
					}
				}
				else
					component.getById('children-list').setStyle("overflow", "unset");
				
				// Cas de la barre de menu
				if (utils.isset(parentMenu) && parentMenu.isClass('menuBar'))
				{
					// Contrôle de la hauteur
					if (panelHeight <= Screen.getHeight())
					{
						// Si la hauteur dépasse de l'écran
						if (panelPosition.y + panelHeight > Screen.getHeight())
						{
							component.getById('children-list').setStyle("top", "unset");
							component.getById('children-list').setStyle("bottom", "100%");
						}
						else
						{
							component.getById('children-list').setStyle("height", "unset");
							component.getById('children-list').setStyle("top", "100%");
							component.getById('children-list').setStyle("bottom", "unset");
						}
						
						// Contrôle de la largeur
						if (panelWidth <= Screen.getWidth())
						{
							// Si la largeur dépasse de l'écran
							if (panelPosition.x + panelWidth > Screen.getWidth())
							{
								var rightCornerPosition = panelPosition.x + $this.offsetWidth;
								
								//console.log(Screen.getWidth() + ', ' + panelPosition.x + ', ' + $this.offsetWidth + ', ' + rightCornerPosition);
								
								component.getById('children-list').setStyle("left", "unset");
								
								if (rightCornerPosition <= Screen.getWidth())
									component.getById('children-list').setStyle("right", "0px");
								else
									component.getById('children-list').setStyle("right", (rightCornerPosition-Screen.getWidth()) + "px");
							}
							else
							{
								component.getById('children-list').setStyle("width", "unset");
								component.getById('children-list').setStyle("right", "unset");
								component.getById('children-list').setStyle("left", "0px");
							}
						}
					}
				}
				// Mode contextuel
				else
				{
					// Contrôle de la hauteur
					if (panelHeight <= Screen.getHeight())
					{
						// Si la hauteur dépasse de l'écran
						if (panelPosition.y + panelHeight > Screen.getHeight())
						{
							component.getById('children-list').setStyle("top", "unset");
							component.getById('children-list').setStyle("bottom", (panelPosition.y+$this.offsetHeight-Screen.getHeight()) + "px");
						}
						else
						{
							component.getById('children-list').setStyle("height", "unset");
							component.getById('children-list').setStyle("top", "0px");
							component.getById('children-list').setStyle("bottom", "unset");
						}
					}
					
					// Contrôle de la largeur
					if (panelWidth <= Screen.getWidth())
					{
						// Si la largeur dépasse de l'écran
						if (panelPosition.x + panelWidth > Screen.getWidth())
							component.getById('children-list').setStyle("left", (-panelWidth) + "px");
						else
						{
							component.getById('children-list').setStyle("width", "unset");
							component.getById('children-list').setStyle("left", "100%");
						}
					}
				}
				
				updated = true;
			}
		}
		else
			component.getById('arrow').style.display = 'none';
	};

	this.addElement = function($element, $noresize)
	{
		var list = $this.addToList($element);
		$this.update();
		return list;
	};
	
	this.insertElementInto = function($element, $index, $noresize)
	{
		var list = $this.insertIntoListAt($element, $index);
		$this.update();
		return list;
	};

	this.removeElement = function($element, $noresize)
	{
		var list = $this.removeFromList($element);
		$this.update();
		return list;
	};

	this.removeAllElements = function() { return $this.removeAllFromList(); };
	
	this.open = function()
	{
		if (component.getList().length > 0 && deploy === false)
		{
			deploy = true;
			updated = false;
			$this.addClass('enlighted');
			component.getById('children-list').style.display = 'block';
			$this.update();
		}
	};
	
	this.openAll = function()
	{
		if (component.getList().length > 0)
		{
			deploy = true;
			updated = false;
			$this.addClass('enlighted');
			component.getById('children-list').style.display = 'block';
			$this.update();
			
			component.execAll(['openAll']);
		}
	};
	
	this.close = function()
	{
		deploy = false;
		updated = false;
		$this.removeClass('enlighted');
		component.getById('children-list').style.display = 'none';
		$this.update();
	};
	
	this.closeAllChildren = function() { component.execAll(['closeAll']); };
	
	this.closeAll = function()
	{
		deploy = false;
		updated = false;
		$this.removeClass('enlighted');
		component.getById('children-list').style.display = 'none';
		$this.update();
		$this.closeAllChildren();
	};
	
	this.closeParent = function()
	{
		if (utils.isset(parentMenu))
			parentMenu.closeParent();
	};
	
	this.unlightAll = function()
	{
		if (deploy === false)
			$this.removeClass('enlighted');
		
		component.execAll(['unlightAll']);
	};

	this.enableByNames = function($names)
	{
		component.getList().forEach(function($element)
		{
			if ($element.getName && $names.includes($element.getName()))
				$element.setDisable(false);
			
			if ($element.enableByNames)
				$element.enableByNames($names);
		});
	};

	this.disableByNames = function($names)
	{
		component.getList().forEach(function($element)
		{
			if ($element.getName && $names.includes($element.getName()))
				$element.setDisable(true);
			
			if ($element.disableByNames)
				$element.disableByNames($names);
		});
	};

	////////////////////////////
	// Gestion des événements //
	////////////////////////////

	var doNothing = function() {};
	this.onAction = doNothing;
	
	component.getById('menu-item-label').onClick = function($event)
	{
		if (disable === false && utils.isset($this.onAction) && $this.onAction !== doNothing && $event.button === 0)
		{
			$this.onAction($event);
			$this.closeParent();
		}
		else if (utils.isset(parentMenu) && parentMenu.isClass('menuBar'))
		{
			if (deploy === true || component.getList().length <= 0)
			{
				parentMenu.setOpen(false);
				parentMenu.closeAllChildren();
			}
			else if (deploy === false)
			{
				parentMenu.closeAllChildren();
				parentMenu.setOpen(true);
				$this.open();
				$this.addClass('enlighted');
			}
		}
	};
	
	this.onClick = function($event)
	{
		if (utils.isset(parentMenu) && parentMenu.isClass('menuBar'))
		{
			if (deploy === true || component.getList().length <= 0)
			{
				parentMenu.setOpen(false);
				parentMenu.closeAllChildren();
			}
			else if (deploy === false)
			{
				parentMenu.setOpen(true);
				parentMenu.closeAllChildren();
				$this.open();
				$this.addClass('enlighted');
			}
		}
	};
	
	this.onContextMenu = function($event) { Events.preventDefault($event); };
	
	this.onMouseOver = function()
	{
		if (utils.isset(parentMenu) 
				&& ((!parentMenu.isClass('menuBar') && deploy === false) 
					|| (parentMenu.isClass('menuBar') && parentMenu.isOpen() && deploy === false)))
		{
			parentMenu.closeAllChildren();
			
			if (utils.isset(parentMenu.setOpen))
				parentMenu.setOpen(true);
			
			$this.open();
			$this.addClass('enlighted');
		}
	};
	
	this.onMouseOut = function() {};

	////////////////
	// Accesseurs //
	////////////////

	// GET
	
	this.getLabel = function() { return label; };
	this.getName = function() { return name; };
	this.getElementsList = function() { return component.getList(); };
	this.getListNode = function() { return component.getById('children-list'); };

	this.getByName = function($name)
	{
		for (var i = 0; i < component.getList().length; i++)
		{
			var element = component.getList()[i];

			if (element.getName)
			{
				if (element.getName() === $name)
					return element;
				else 
				{
					var item = element.getByName($name)

					if (item)
						return item;
				}
			}
		}

		return null;
	};
	
	// SET
	
	this.setLabel = function($label)
	{
		label = $label;
		component.getById('item-label').innerHTML = label;
	};
	
	this.setName = function($name) { name = $name; };

	this.setDisable = function($disable)
	{
		disable = $disable;

		if (disable === true)
			$this.addClass('disable');
		else
			$this.removeClass('disable');
	};

	this.setParent = function($parentMenu) { parentMenu = $parentMenu; };

	this.loadElementFromJSON = function($item)
	{
		if ($item.separator)
			return new MenuSeparator();
		else
		{
			var label = $item.label;
			var name = $item.name;
			var shortcut = $item.shortcut;
			var onAction = $item.onAction;
			var disable = $item.disable;
			var children = $item.children;

			var item = new MenuItem(label, name, shortcut);

			if (name)
				item.setName(name);

			if (onAction)
				item.onAction = onAction;

			if (disable === true)
				item.setDisable(true);

			if (children && children.length > 0)
				item.loadFromJSON(children);

			return item;
		}
	};
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	return $this; 
}