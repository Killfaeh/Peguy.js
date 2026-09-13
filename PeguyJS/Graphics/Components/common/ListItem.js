function ListItem($label)
{
	///////////////
	// Attributs //
	///////////////
	
	var template = '';
	var label = $label;
	var parent = null;

	var html = '<li class="listItem" >'
					+ '<div id="list-label" class="list-label" >'
						+ label
					+ '</div>'
				+ '</li>';
				
	var component = new DraggableComponent(html, true, true);
	component.ghostClass = 'ghost-list';
	component.virtualClass = 'virtual-list';
	component.virtualTagName = 'li';
	
	/*
{{INSERT CODE}}
	//*/

	//////////////
	// Méthodes //
	//////////////

	this.select = function()
	{
		// Système de sélection
		$this.onSelect($this);
	};

	////////////////////////////
	// Gestion des événements //
	////////////////////////////
	
	this.onSelect = function($element) {};

	component.onClick = function()
	{
		console.log("Select list item ! ");
		//Système de sélection
		$this.onSelect($this);
	};

	//// Drag & drop ////

	component.isEditable = function() { return parent && parent.isEditMode() === true && parent.getElementsList().length > 1; };

	component.updateVirtualItem = function($parentNode, $overLayer, $virtualItem, $mousePosition)
	{
		var parentNode = $parentNode;

		// Si on survole un élément
		
		if (parent && $overLayer && $overLayer.getById && $overLayer.getById('list-label') && $overLayer !== $this)
			parent.insertAfter($virtualItem, $overLayer);
		
		// Si on ne survole aucun élément 
		
		else if (parent && (($overLayer && $overLayer.isClass('listBox')) || !$overLayer))
		{
			var y = $mousePosition.y-component.getOffsetY();

			if (y <= parent.position().y+5)
			{
				if (parent.firstChild)
					parent.insertBefore($virtualItem, parent.firstChild);
				else
					parent.appendChild($virtualItem);
			}
			else
				parent.appendChild($virtualItem);
		}

		parentNode = parent;

		return parentNode;
	};
	
	//// Relâcher l'élément avec la touche échappe au cas où ça coincerait ////
	
	this.onKeyUp = function($event)
	{
		var hasChanged = false;

		if (dragging === true)
		{
			if ($event.keyCode === 27)
			{
				hasChanged = onMouseUp($event);
				console.log("Echappe ! ");
			}
		}

		return hasChanged;
	};
	
	////////////////
	// Accesseurs //
	////////////////

	// GET
	
	this.getParent = function() { return parent; };
	
	//// Détecter si l'élement est survolé ////
	
	this.getOverLayer = function($x, $y, $movingElement)
	{
		var overLayer = null;

		if ($movingElement !== $this)
		{
			var isMouseOver = false;
			
			var position = component.position();
			
			if ($y >= position.y && $y <= position.y+component.offsetHeight)
				isMouseOver = true;
			
			if (isMouseOver === true)
				overLayer = $this;
		}
		
		return overLayer;
	};
	
	//// Récupérer la position courante de l'élément ////
	
	this.index = function()
	{
		var i = 0;
		var previousSibling = $this.previousSibling;
		
		while (utils.isset(previousSibling))
		{
			i++;
			previousSibling = previousSibling.previousSibling;
		}
	
		return i;
	};
	
	this.isLast = function()
	{
		var isLast = false;
		
		if (utils.isset(parentBranch))
		{
			if (parent.getTabList()[parent.getTabList().length-1] === $this)
				isLast = true;
			else if (parent.getTabList()[parent.getTabList().length-2] === $this && parent.getTabList()[parent.getTabList().length-1].isDragging() === true)
				isLast = true;
		}
		
		return isLast;
	}

	this.getLabel = function() { return label; };

	this.getJSON = function()
	{
		var jsonData = { "label": label };
		return jsonData;
	};

	this.getTemplate = function() { return template; };
	this.getCode = function() { return label; };
	
	// SET

	this.setLabel = function($label)
	{
		label = $label;
		component.getById('list-label').innerHTML = label;
	};

	this.setParent = function($parent) { parent = $parent; };

	this.loadFromJSON = function($json)
	{
		label = $json.label;
		component.getById('list-label').innerHTML = label;
	};

	this.setTemplate = function($template) { template = $template; };
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	return $this; 
}