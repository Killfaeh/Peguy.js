function TreeBranch($html, $ordered)
{
	///////////////
	// Attributs //
	///////////////
	
	this.isBranch = true;
	
	var ordered = $ordered;
	// ▼
	// ►
	var deploy = true;
	var editMode = false;
	
	var html = '<li id="tree-branch" class="tree-branch" branch="branch" >'
					+ '<div id="element-label" class="element-label" >'
						+ '<span id="arrow" class="arrow">▼</span>'
						+ '<span id="label" >' + $html + '</span>'
					+ '</div>'
					+ '<ul id="leafs" class="leafs" ></ul>'
				+ '</li>';
				
	if (ordered === true)
	{
		html = '<li id="tree-branch" class="tree-branch" branch="branch" >'
					+ '<div id="element-label" class="element-label" >'
						+ '<span id="arrow" class="arrow">▼</span>'
						+ '<span id="label" >' + $html + '</span>'
					+ '</div>'
					+ '<ol id="leafs" class="leafs" ></ol>'
				+ '</li>';
	}

	var component = new ListComponent(html);
	component = new DraggableComponent(component, true);
	component.ghostClass = 'ghost-item';
	component.virtualClass = 'virtual-item';
	component.virtualTagName = 'li';
	component.setNode(component.getById('leafs'));
	
	/*
{{INSERT CODE}}
	//*/

	// Contenu
	
	var parentBranch = null;

	//////////////
	// Méthodes //
	//////////////
	
	//// Tout désélectionner ////

	this.deselectAll = function()
	{
		component.removeAttribute('class');
		component.execAll([ 'deselectAll', 'deselect' ]);
	};
	
	//// Sélectionner l'élément ////
	
	this.select = function()
	{
		//$this.deselectAll();
		var selected = $this.onSelect($this);
		
		if (selected === true)
			component.setAttribute('class', 'selected');
	};
	
	//// Supprimer le style de survole à tout les enfants ////
	
	this.dragOutAll = function()
	{
		component.removeClass('drag-over');
		component.execAll([ 'dragOutAll', 'dragOut' ]);
	};
	
	//// Ajouter le style de survole ////
	
	this.dragOver = function()
	{
		component.addClass('drag-over');
	};
	
	//// Supprimer le style de survole ////
	
	this.dragOut = function()
	{
		component.removeClass('drag-over');
	};
	
	//// Afficher ou masquer la flêche de dépliage selon qu'il y a des enfants ou non ////
	
	this.updateArrow = function()
	{
		if (component.getList().length > 0)
			component.getById('arrow').style.display = 'inline';
		else
			component.getById('arrow').style.display = 'none';
	};
	
	//// Gestion de la liste d'éléments ////
	
	this.addElement = function($element, $noOnChange)
	{
		var list = $this.addToList($element, $noOnChange);
		$this.updateArrow();
		return list;
	};
	
	this.insertElementInto = function($element, $index, $noOnChange)
	{
		var list = $this.insertIntoListAt($element, $index, $noOnChange);
		$this.updateArrow();
		return list;
	};
	
	//// Supprimer un élément enfant ////
	
	this.removeElement = function($element)
	{
		var index = component.getList().indexOf($element);
		
		if (index < 0)
			component.execAll([ 'removeElement' ], [$element]);

		while (index >= 0)
		{
			component.getList().splice(index, 1);
			index = component.getList().indexOf($element);
		}
		
		var parent = $element.parentNode;
		
		if (parent === component.getById('leafs'))
			component.getById('leafs').removeChild($element);
		
		$this.updateArrow();
		
		return $element;
	};
	
	this.empty = function() { return $this.removeAllFromList(); };
	
	//// Déplier l'élément s'il a des enfants ////
	
	this.open = function()
	{
		deploy = true;
		component.getById('arrow').innerHTML = "▼";
		component.getById('leafs').removeAttribute('style');
		$this.onOpen($this);
	};
	
	//// Déplier l'élément et tous ses enfants ////
	
	this.openAll = function()
	{
		deploy = true;
		component.getById('arrow').innerHTML = "▼";
		component.getById('leafs').removeAttribute('style');
		component.execAll([ 'openAll' ]);
	};
	
	//// Replier l'élément et tous ses enfants ////
	
	this.closeAll = function()
	{
		deploy = false;
		component.getById('arrow').innerHTML = "►";
		component.getById('leafs').style.display = "none";
		component.execAll([ 'closeAll' ]);
	};

	//// Refresh ////

	this.refresh = function()
	{
		if (deploy === true)
		{
			$this.onRefresh($this);
			component.execAll([ 'refresh' ]);
		}
	};
	
	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////

	this.initElementEvents = function($element)
	{
		$element.setEditMode(editMode);
		$element.setParentBranch($this);
	};
	
	this.onSelect = function($selectedElement) { return true; };
	this.onOpen = function($element) {};
	this.onChange = function() {};
	this.onRefresh = function($element) {};

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
	
	component.onClick = function() { $this.select(); };
	component.getById('element-label').onClick = function() { $this.select(); };
	
	//// En cliquant sur la flèche on plie ou déplie l'élément ////

	var onOpen = function()
	{
		if (deploy === true)
		{
			deploy = false;
			component.getById('arrow').innerHTML = "►";
			component.getById('leafs').style.display = "none";
		}
		else
		{
			deploy = true;
			component.getById('arrow').innerHTML = "▼";
			component.getById('leafs').removeAttribute('style');
			$this.onOpen($this);
		}
	};

	component.onClick = function() { onOpen(); };
	
	//// Drag & drop ////

	component.updateVirtualItem = function($parentNode, $overLayer, $virtualItem, $mousePosition)
	{
		var parentNode = $parentNode;

		// Si on survole un élément
		
		if ($overLayer && $overLayer.getById('element-label') && $overLayer !== $this)
		{
			//overLayerPosition = overLayer.position();
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
	
	////////////////
	// Accesseurs //
	////////////////

	// GET
	
	this.isDeployed = function() { return deploy; };
	this.isOpen = function() { return deploy; };
	this.hasChildrenOpen = function() { return $this.testAll('isOpen', [], function($isOpen) { return $isOpen; }); };
	this.isEditMode = function() { return editMode; };
	this.getParentBranch = function() { return parentBranch; };
	this.getElementsList = function() { return component.getList(); };
	this.getBranches = function() { return component.getList(); };
	
	//// Détecter si l'élement ou un de ses enfants est survolé ////
	
	this.getOverLayer = function($x, $y, $movingElement)
	{
		$this.dragOutAll();
		
		var overLayer = null;
		var isMouseOver = false;
		
		var position = component.getById('element-label').position();
		
		if ($y >= position.y && $y <= position.y+component.getById('element-label').offsetHeight)
			isMouseOver = true;
		
		if (isMouseOver === false && deploy === true)
			overLayer = $this.testAll('getOverLayer', [$x, $y], function($overLayer) { return $overLayer; });
		else if (isMouseOver === true && deploy === false)
			overLayer = $this;
		
		return overLayer;
	};
	
	this.getListNode = function() { return component.getById('leafs'); };
	
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
		var jsonData = { "type": "branch", "ordered": ordered, "deploy": deploy, "label": $html, "elementsList": [] };
		jsonData.elementsList = component.getList().map(function($element) { return $element.getJSON(); });
		return jsonData;
	};

	// SET

	this.setLabel = function($label) { component.getById('label').innerHTML = $label; };
	
	this.setEditMode = function($editMode)
	{
		editMode = $editMode;
		component.execAll(['setEditMode'], [editMode]);
	};
	
	this.setParentBranch = function($parentBranch) { parentBranch = $parentBranch; };

	this.loadFromJSON = function($json, $callback)
	{
		ordered = $json.ordered;
		deploy = $json.deploy;

		$this.addElement($json.elementsList.map(function($element)
		{
			var item = new TreeLeaf($element.label);

			if ($callback)
				item = $callback($element);
			else if ($element.type === "branch")
				item = new TreeBranch($element.label, ordered);

			item.loadFromJSON($element, $callback);
			$this.select();
			return item;
		}), false);
	};

	//////////////
	// Héritage //
	//////////////

	var $this = utils.extend(component, this);
	$this.updateArrow();
	return $this; 
}