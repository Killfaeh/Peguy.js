function MenuItem($label, $name)
{
	///////////////
	// Attributs //
	///////////////
	
	var label = $label;
	var name = $name;

	var html = '<li class="menuItem" >'
					+ '<div id="menu-item-label" class="menu-item-label" >'
						+ label
						+ '<span id="arrow" class="arrow">►</span>'
					+ '</div>'
					+ '<ul id="children-list" class="children-list" >'
						+ '<li id="backItem" class="menuItem backItem" >'
							+ '<div id="menu-item-label" class="menu-item-label" >'
								+ '<span id="backArrow" class="backArrow">◄</span>'
								+ "Back"
							+ '</div>'
						+ '</li>'
					+ '</ul>'
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
	//var elementsList = [];
	
	var backItem = component.getById('backItem');
	backItem.style.display = 'none';
	
	//////////////
	// Méthodes //
	//////////////
	
	var initPosition = function()
	{
		component.getById('children-list').style.height = "unset";
	};

	this.update = function()
	{
		//if (elementsList.length > 0)
		if (component.getList().length > 0)
		{
			if (utils.isset(parentMenu) && !parentMenu.isClass('menuBar'))
				component.getById('arrow').style.display = 'inline';
			else
				component.getById('arrow').style.display = 'none';
			
			backItem.style.display = 'block';
			
			if (deploy === true)
			{
				initPosition();
				var panelPosition = component.getById('children-list').position();
				
				var top = parseInt(component.getById('children-list').getStyle('top').replace('px', ''));
				
				if (top !== -1)
				{
					var borderTopWidth = parseInt(component.getById('children-list').getStyle('border-top-width').replace('px', ''));
					var borderBottomWidth = parseInt(component.getById('children-list').getStyle('border-bottom-width').replace('px', ''));
					var marginTop = parseInt(component.getById('children-list').getStyle('margin-top').replace('px', ''));
					var marginBottom = parseInt(component.getById('children-list').getStyle('margin-bottom').replace('px', ''));
					var paddingTop = parseInt(component.getById('children-list').getStyle('padding-top').replace('px', ''));
					var paddingBottom = parseInt(component.getById('children-list').getStyle('padding-bottom').replace('px', ''));
					
					console.log("Screen height : " + Screen.getHeight());
					console.log("Panel position Y : " + panelPosition.y);
					
					component.getById('children-list').style.height = (Screen.getHeight() - panelPosition.y + top
																		- borderTopWidth - borderBottomWidth - marginTop - marginBottom - paddingTop - paddingBottom) 
																		+ 'px';
				}
				
				updated = true;
			}
		}
		else
		{
			component.getById('arrow').style.display = 'none';
			backItem.style.display = 'none';
		}
	};

	/*
	this.addElement = function($element)
	{
		elementsList.push($element);
		
		if (utils.isset($element.setParent))
			$element.setParent($this);
		
		component.getById('children-list').appendChild($element);
		$this.update();
	};
	//*/

	this.addElement = function($element, $noresize)
	{
		var list = $this.addToList($element);
		$this.update();
		return list;
	};
	
	/*
	this.insertElementInto = function($element, $index)
	{
		elementsList.splice($index, 0, $element);
		
		if (utils.isset($element.setParent))
			$element.setParent($this);
		
		component.getById('children-list').insertAt($element, $index);
		$this.update();
	};
	//*/

	this.insertElementInto = function($element, $index, $noresize)
	{
		var list = $this.insertIntoListAt($element, $index);
		$this.update();
		return list;
	};
	
	/*
	this.removeElement = function($element)
	{
		var index = elementsList.indexOf($element);
		
		while (index >= 0)
		{
			if (index > -1)
				elementsList.splice(index, 1);
			
			index = elementsList.indexOf($element);
		}
		
		var parent = $element.parentNode;
		
		if (parent === component.getById('children-list'))
			component.getById('children-list').removeChild($element);
		
		$this.update();
		
		if (utils.isset($element.setParent))
			$element.setParent(null);
		
		return $element;
	};
	//*/

	this.removeElement = function($element, $noresize)
	{
		var list = $this.removeFromList($element);
		$this.update();
		return list;
	};

	/*
	this.removeAllElements = function()
	{
		while (elementsList.length > 0)
			$this.removeElement(elementsList[0]);
	};
	//*/

	this.removeAllElements = function() { return $this.removeAllFromList(); };
	
	this.open = function()
	{
		//if (elementsList.length > 0 && deploy === false)
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
		//if (elementsList.length > 0)
		if (component.getList().length > 0)
		{
			deploy = true;
			updated = false;
			$this.addClass('enlighted');
			component.getById('children-list').style.display = 'block';
			$this.update();
			
			component.execAll(['openAll']);

			/*
			for (var i = 0; i < elementsList.length; i++)
			{
				if (utils.isset(elementsList[i].openAll))
					elementsList[i].openAll();
			}
			//*/
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
	
	/*
	this.closeAllChildren = function()
	{
		for (var i = 0; i < elementsList.length; i++)
		{
			if (utils.isset(elementsList[i].closeAll))
				elementsList[i].closeAll();
		}
	};
	//*/

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

		/*
		for (var i = 0; i < elementsList.length; i++)
		{
			if (utils.isset(elementsList[i].closeAll))
				elementsList[i].unlightAll();
		}
		//*/
	};

	this.enableByNames = function($names)
	{
		//elementsList.forEach(function($element)
		component.getList().forEach(function($element)
		{
			if ($names.includes($element.getName()))
				$element.setDisable(false);
			
			$element.enableByNames($names);
		});
	};

	this.disableByNames = function($names)
	{
		//elementsList.forEach(function($element)
		component.getList().forEach(function($element)
		{
			if ($names.includes($element.getName()))
				$element.setDisable(true);
			
			$element.disableByNames($names);
		});
	};
	
	this.display = function()
	{
		if (deploy === true)
		{
			component.getById('children-list').style.display = 'block';
			$this.update();
		}
	};
	
	this.hide = function()
	{
		component.getById('children-list').style.display = 'none';
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
		else if (utils.isset(parentMenu) && !parentMenu.isClass('menuBar') && deploy === false)
		{
			parentMenu.closeAllChildren();
			$this.open();
		}
		else if (utils.isset(parentMenu) && parentMenu.isClass('menuBar'))
		{
			//if (deploy === true || elementsList.length <= 0)
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
			}
		}
	};
	
	this.onClick = function($event)
	{
		if (utils.isset(parentMenu) && parentMenu.isClass('menuBar'))
		{
			//if (deploy === true || elementsList.length <= 0)
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
			}
		}
	};
	
	this.onContextMenu = function($event) { Events.preventDefault($event); };
	
	this.onMouseOut = function() {};
	backItem.onClick = function() { $this.close(); };
	
	component.getById('children-list').onClick = component.getById('children-list').onContextMenu = function($event)
	{
		$this.closeParent();
	};
	
	this.onResize = function() { $this.update(); };

	////////////////
	// Accesseurs //
	////////////////

	// GET
	
	this.getLabel = function() { return label; };
	this.getName = function() { return name; };
	//this.getElementsList = function() { return elementsList; };
	this.getElementsList = function() { return component.getList(); };
	this.getListNode = function() { return component.getById('children-list'); };

	/*
	this.getByName = function($name)
	{
		var item = null;

		elementsList.every(function($element)
		{
			if ($element.getName() === $name)
			{
				item = $element;
				return false;
			}
			else if ($element.getByName($name))
			{
				item = $element.getByName($name);
				return false;
			}

			return true;
		});

		return item;
	};
	//*/

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

	/*
	this.loadFromJSON = function($json)
	{
		$json.forEach(function($item)
		{
			var label = $item.label;
			var name = $item.name;
			var onAction = $item.onAction;
			var disable = $item.disable;
			var children = $item.children;

			var item = new MenuItem(label);

			if (name)
				item.setName(name);

			if (onAction)
				item.onAction = onAction;

			if (disable === true)
				item.setDisable(true);

			$this.addElement(item);

			if (children && children.length > 0)
				item.loadFromJSON(children);
		});
	};
	//*/

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