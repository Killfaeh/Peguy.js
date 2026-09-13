function KanbanCard($label, $sorted)
{
	///////////////
	// Attributs //
	///////////////
	
	this.isCard = true;
	
	var label = $label;
	var sorted = $sorted;
	var editMode = false;
	var editing = false;
	
	var html = '<li class="kanbanCard" card="card" >'
					+ '<p id="label" class="label" >' + label + '</p>'
					+ '<textarea id="labelField" class="labelField" placeholder="' + KEYWORDS.cardTitle + '" >' + label + '</textarea>'
					+ '<span id="editIcon" class="editIcon" ></span>'
				+ '</li>';

	var component = new DraggableComponent(html, true);
	component.ghostClass = 'ghost-kanbanCard';
	component.virtualClass = 'virtual-kanbanCard';
	
	var editIcon = Loader.getSVG('icons', 'edit-icon', 14, 14);
	component.getById('editIcon').appendChild(editIcon);

	var closeIcon = Loader.getSVG('icons', 'close-icon', 14, 14);
	component.getById('editIcon').appendChild(closeIcon);
	
	var parent = null;
	
	/*
{{INSERT CODE}}
	//*/

	//////////////
	// Méthodes //
	//////////////
	
	var onCloseEditForm = function()
	{
		var newLabel = component.getById('labelField').value;
		
		if (utils.isset(newLabel) && newLabel !== '')
		{
			label = newLabel;
			component.getById('label').innerHTML = newLabel;
		}
		
		//component.getById('editIcon').style.display = 'none';
		component.getById('label').style.visibility = 'visible';
		component.getById('labelField').style.visibility = 'hidden';
		component.getById('labelField').blur();
		editing = false;
	};
	
	var onHideEditIcon = function()
	{
		component.getById('editIcon').style.display = 'none';
	};
	
	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////
	
	this.onChange = function($data) {};
	var onChange = function($data) { $this.onChange($data); };

	closeIcon.onMouseDown = function() {};

	closeIcon.onClick = function($event)
	{
		var popupHTML = '<h3>' + KEYWORDS.removeTheCard + '</h3><p>' + KEYWORDS.confirmRemoveTheCard + '</p>';

		var confirmPopup = new ConfirmPopup(popupHTML);

		confirmPopup.onOk = async function()
		{
			if (parent && parent.removeCard)
				parent.removeCard($this);

			confirmPopup.hide();
			return true;
		};

		document.getElementById('main').appendChild(confirmPopup);
	};
	
	component.onMouseMove = function()
	{
		Events.emit('onHideKanbanEditIcon', []);
		
		if (editMode === true && editing === false)
			component.getById('editIcon').style.display = 'block';
	};
	
	component.getById('editIcon').onMouseDown = function() {};
	
	component.getById('editIcon').onClick = component.getById('editIcon').onMouseUp = function()
	{
		Events.emit('onCloseKanbanAddForm', [$this]);
		
		setTimeout(function()
		{
			component.getById('editIcon').style.display = 'none';
			component.getById('label').style.visibility = 'hidden';
			component.getById('labelField').style.visibility = 'visible';
			component.getById('labelField').focus();
			
			var valueLength = component.getById('labelField').value.length;
			
			component.getById('labelField').focus();
			component.getById('labelField').setSelectionRange(valueLength, valueLength);
		}, 100);
		
		editing = true;
	};
	
	//// Drag & drop ////

	component.isEditable = function() { return editMode; };
	component.onDraggableMouseDown = function() { Events.emit('onCloseKanbanAddForm', [$this]); };
	component.onCreateGhost = function() { Events.emit('onCloseKanbanAddForm', [$this]); };
	component.onStartDrag = function() { Events.emit('onCloseKanbanAddForm', [$this]); };
	component.onRemoveVirtualItem = function($virtualItem) { $virtualItem.parentNode.column = $virtualItem.parentNode.parentNode.parentNode.parentNode; };
	component.onDraggableMouseUp = function() { Events.emit('onCloseKanbanAddForm', [$this]); };

	component.updateVirtualItem = function($parentNode, $overLayer, $virtualItem, $mousePosition)
	{
		var parentNode = $parentNode;
		var deltaX = $mousePosition.x-$overLayer.x;
		var deltaY = $mousePosition.y-$overLayer.y;

		if ($overLayer.isCard === true)
		{
			parentNode = $overLayer.parentNode;
							
			if (sorted === true)
				parentNode.appendChild($virtualItem);
			else
				parentNode.insertAfter($virtualItem, $overLayer);
		}
		else if ($overLayer.isColumn === true)
		{
			parentNode = $overLayer.getById('list');
			parentNode.column = $overLayer;
			
			if (sorted !== true && deltaY < 0 && $overLayer.getById('list').firstChild)
				parentNode.insertBefore($virtualItem, $overLayer.getById('list').firstChild);
			else
				parentNode.appendChild($virtualItem);
		}

		return parentNode;
	};
	
	component.connect('onCloseKanbanAddForm', onCloseEditForm);
	
	////////////////
	// Accesseurs //
	////////////////

	// GET
	
	this.getLabel = function() { return label; };
	this.getParent = function() { return parent; };
	
	//// Détecter si l'élement est survolé ////
	
	this.getOverLayer = function($x, $y, $movingElement)
	{
		var overLayer = null;
		var isMouseOver = false;
		var position = component.position();		
		var margin = component.getMargin();
		
		//if ($y >= position.y-margin.top && $y <= position.y + component.offsetHeight + margin.bottom
		//	&& $x >= position.x-margin.left && $x <= position.x + component.offsetWidth + margin.right)
		if ($y >= position.y-margin.top && $y <= position.y + component.offsetHeight + margin.bottom)
		{
			isMouseOver = true;
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
			var card = previousSibling.getAttribute('card');
			
			if (card === 'card')
				i++;
			
			previousSibling = previousSibling.previousSibling;
		}
	
		return i;
	};
	
	this.isLast = function()
	{
		var isLast = false;
		
		if (utils.isset(parent))
		{
			if (parent.getCardsList()[parent.getCardsList().length-1] === $this)
				isLast = true;
			else if (parent.getCardsList()[parent.getCardsList().length-2] === $this && parent.getCardsList()[parent.getCardsList().length-1].isDragging() === true)
				isLast = true;
		}
		
		return isLast;
	}

	// SET
	
	this.setEditMode = function($editMode) { editMode = $editMode; };
	this.setSorted = function($sorted) { sorted = $sorted; };
	this.setParent = function($parent) { parent = $parent; };
	
	//////////////
	// Héritage //
	//////////////

	var $this = utils.extend(component, this);
	return $this; 
}