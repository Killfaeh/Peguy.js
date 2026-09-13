function TreeLeaf($html)
{
	///////////////
	// Attributs //
	///////////////
	
	this.isLeaf = true;
	
	var editMode = false;
	
	var html = '<li id="tree-leaf" class="tree-leaf" >'
					+ '<div id="element-label" class="element-label" branch="branch" >'
						+ $html
					+ '</div>'
				+ '</li>';

	var component = new DraggableComponent(html, true);
	component.ghostClass = 'ghost-item';
	component.virtualClass = 'virtual-item';
	component.virtualTagName = 'li';
	
	/*
{{INSERT CODE}}
	//*/

	var parentBranch = null;

	//////////////
	// Méthodes //
	//////////////

	//// Gestion de la sélection ////

	this.deselect = function() { component.removeAttribute('class'); };
	
	this.select = function()
	{
		//$this.deselectAll();
		var selected = $this.onSelect($this);
		
		if (selected === true)
			component.setAttribute('class', 'selected');
	};
	
	//// Survole ////
	
	this.dragOver = function() { component.addClass('drag-over'); };
	this.dragOut = function() { component.removeClass('drag-over'); };

	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////

	this.onSelect = function($selectedElement) { return true; };
	//this.onChange = function() {};

	component.onclick = function($event)
	{
		Events.preventDefault($event);
		Events.stopPropagation($event);
	};

	component.ondblclick = function($event)
	{
		Events.preventDefault($event);
		Events.stopPropagation($event);
	};
	
	component.onClick = function()
	{
		$this.select();
	};
	
	//// Drag & drop ////

	component.isEditable = function() { return editMode; };

	component.updateVirtualItem = function($parentNode, $overLayer, $virtualItem, $mousePosition)
	{
		var parentNode = $parentNode;

		// Si on survole un élément
		
		if ($overLayer && $overLayer.getById('element-label') && $overLayer !== $this)
		{
			var deltaX = $mousePosition.x - $overLayer.x;
			var deltaY = $mousePosition.y - $overLayer.y;
			var halfHeight = $overLayer.getById('element-label').offsetHeight/2.0;
			var threeQuartersHeight = $overLayer.getById('element-label').offsetHeight*3.0/4.0;
			
			if ($overLayer.isClass('tree'))
			{
				parentNode = $overLayer;
							
				if ($virtualItem.parentNode !== parentNode)
				{
					if (deltaY < 0)
						parentNode.insertAt($virtualItem, 0);
					else
						parentNode.appendChild($virtualItem);
				}
			}
			else
			{
				if ($overLayer.isBranch === true)
				{
					if ($overLayer.isDeployed() === true)
					{
						parentNode = $overLayer.getById('leafs');
						parentNode.insertAt($virtualItem, 0);
					}
					else
					{
						if (deltaY <= halfHeight)
						{
							$overLayer.addClass('drag-over');
							parentNode = $overLayer.getById('leafs');
							parentNode.appendChild($virtualItem);
						}
						else if ($overLayer.isLast() !== true || deltaY <= threeQuartersHeight)
						{
							parentNode = $overLayer.parentNode;
							parentNode.insertAfter($virtualItem, $overLayer);
						}
						else
						{
							var overLayerParentBranch = $overLayer.getParentBranch();
							parentNode = overLayerParentBranch.parentNode;
							parentNode.insertAfter($virtualItem, overLayerParentBranch);
						}
					}
				}
				else
				{
					parentNode = $overLayer.parentNode;
					parentNode.insertAfter($virtualItem, $overLayer);
				}
			}
		}
		
		// Si on ne survole aucun élément 
		
		else if ($overLayer && $overLayer.isTree === true)
		{
			var y = $mousePosition.y - $this.getOffsetY();
			parentNode = $overLayer;
			
			if (y <= parentNode.position().y)
				parentNode.insertAt($virtualItem, 0);
			else
				parentNode.appendChild($virtualItem);
		}

		return parentNode;
	};
	
	//// Relâcher l'élément avec la touche échappe au cas où ça coincerait ////
	
	this.onKeyUp = function($event)
	{
		if (utils.isset(ghost) && utils.isset(ghost.parentNode))
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
	this.getParentBranch = function() { return parentBranch; };
	
	//// Détecter si l'élement ou un de ses enfants est survolé ////
	
	this.getOverLayer = function($x, $y, $movingElement)
	{
		var overLayer = null;
		var isMouseOver = false;
		
		var position = component.getById('element-label').position();
		
		if ($y >= position.y && $y <= position.y+component.getById('element-label').offsetHeight)
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
			var branch = previousSibling.getAttribute('branch');
			
			if (branch === 'branch')
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
			if (parentBranch.getElementsList()[parentBranch.getElementsList().length-1] === $this)
				isLast = true;
			else if (parentBranch.getElementsList()[parentBranch.getElementsList().length-2] === $this && parentBranch.getElementsList()[parentBranch.getElementsList().length-1].isDragging() === true)
				isLast = true;
		}
		
		return isLast;
	}

	this.getJSON = function()
	{
		var jsonData = { "type": "leaf", "label": $html };
		return jsonData;
	};

	// SET
	
	this.setLabel = function($label) { component.getById('element-label').innerHTML = $label; };
	this.setEditMode = function($editMode) { editMode = $editMode; };
	this.setParentBranch = function($parentBranch) { parentBranch = $parentBranch; };

	//////////////
	// Héritage //
	//////////////

	var $this = utils.extend(component, this);
	return $this; 
}