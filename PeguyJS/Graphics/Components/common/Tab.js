function Tab($label, $content)
{
	///////////////
	// Attributs //
	///////////////

	var editMode = false;
	var label = $label;
	var content = $content;

	//console.log(label);
	
	var parent = null;

	var html = '<li class="tab" >'
					+ '<div id="unselectMargin" class="unselectMargin" ></div>'
					+ '<label id="tab-label" >'
						+ label
					+ '</label>'
					+ '<span id="closeIcon" class="closeIcon" >'
						+ '<div class="wall" ></div>'
					+ '</span>'
				+ '</li>';

	var component = new DraggableComponent(html, true, false, true);
	component.ghostClass = 'ghost-tab';
	component.virtualClass = 'virtual-tab';
	component.virtualTagName = 'li';
	
	var closeIcon = Loader.getSVG('icons', 'grey-close-icon', 10, 10);
	component.getById('closeIcon').appendChild(closeIcon);
	
	/*
{{INSERT CODE}}
	//*/

	//////////////
	// Méthodes //
	//////////////
	
	this.select = function()
	{
		if (parent)
			parent.unselectAll();
		
		if (parent)
		{
			parent.addToHistory($this);
			
			if ($this.parentNode && $this.parentNode.isClass('hiddenTabs'))
				parent.updateTabs();
			
			parent.setSelected($this);
			parent.appendContent(content);
			parent.hideHiddenTabs();
		}
		
		$this.addClass('selected');
		$this.onSelect($this);
	};
	
	this.unselect = function()
	{
		$this.removeClass('selected');
		
		if (parent && parent.getContent() === content)
			parent.getById('content').removeAllChildren();
	};
	
	//// Survole ////
	
	this.dragOver = function() { component.addClass('drag-over'); };
	this.dragOut = function() { component.removeClass('drag-over'); };
	
	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////

	this.onSelect = function($tab) {};
	this.onClick = function() { $this.select(); };
	this.onClose = function() { return true; };
	
	this.close = function()
	{
		if ($this.onClose() === true && parent)
			parent.removeTab($this);
	};

	var onClose = function() { $this.close(); };
	closeIcon.onClick = function() { onClose(); };
	closeIcon.onMouseDown = function() {};
	
	//// Drag & drop ////

	component.isEditable = function() { return editMode && parent && parent.getHiddenTabs().childNodes.length <= 0; };

	component.updateVirtualItem = function($parentNode, $overLayer, $virtualItem, $mousePosition)
	{
		var parentNode = $parentNode;

		// Si on survole un élément
		
		if ($overLayer && $overLayer.getById && $overLayer.getById('tab-label') && $overLayer !== $this)
		{
			var x = $mousePosition.x - component.getOffsetX();
			var deltaX = x - $overLayer.x;
			var deltaY = $mousePosition.y - $overLayer.y;
			
			if (parent)
				parent.getById('tabs').insertAfter($virtualItem, $overLayer);
		}
		
		// Si on ne survole aucun élément 
		
		else if (parent && (($overLayer && $overLayer.isClass('tabs')) || !$overLayer))
		{
			if (x <= parent.getById('tabs').position().x+5)
			{
				if (parent.getById('tabs').firstChild)
					parent.getById('tabs').insertBefore($virtualItem, parent.getById('tabs').firstChild);
				else
					parent.getById('tabs').appendChild($virtualItem);
			}
			else
				parent.getById('tabs').appendChild($virtualItem);
		}

		//parentNode = parent;

		return parentNode;
	};
	
	//// Relâcher l'élément avec la touche échappe au cas où ça coincerait ////
	
	this.onKeyUp = function($event)
	{
		if (dragging === true)
		{
			if ($event.keyCode === 27)
			{
				onMouseUp($event);
				console.log("Echappe ! ");
			}
		}
	};
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	
	this.isEditMode = function() { return editMode; };
	this.getLabel = function() { return label; };
	this.getContent = function() { return content; };
	this.getParent = function() { return parent; };
	
	//// Détecter si l'élement est survolé ////
	
	this.getOverLayer = function($x, $y, $movingElement)
	{
		var overLayer = null;
		var isMouseOver = false;
		
		var position = component.position();
		
		if ($x >= position.x && $x <= position.x+component.offsetWidth)
			isMouseOver = true;
		
		if (isMouseOver === true)
			overLayer = $this;
		
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
	
	// SET
	
	this.setEditMode = function($editMode) { editMode = $editMode; };

	this.setLabel = function($label)
	{
		label = $label;
		component.getById('tab-label').innerHTML = label;
	};

	this.setContent = function($content) { content = $content; };
	this.setParent = function($parent) { parent = $parent; };
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	return $this; 
}