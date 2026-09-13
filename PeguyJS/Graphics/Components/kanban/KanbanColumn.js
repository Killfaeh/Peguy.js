function KanbanColumn($label, $sorted)
{
	///////////////
	// Attributs //
	///////////////
	
	this.isColumn = true;
	
	var label = $label;
	var sorted = $sorted;
	var editMode = false;
	
	var html = '<div class="kanbanColumn" column="column" >'
					+ '<div id="innerColumn" class="innerColumn" >'
						+ '<div id="removeIcon" class="removeIcon" ></div>'
						+ '<h3 id="label" class="label" >' + label + '</h3>'
						+ '<div id="editLabelBlock" class="editLabelBlock" >'
							+ '<input type="text" id="editLabelInput" value="' + label + '" />'
							+ '<span id="closeLabelIcon" class="closeLabelIcon" ></span>'
						+ '</div>'
						+ '<div id="list-canvas" class="list" >'
							+ '<ul id="list" ></ul>'
						+ '</div>'
						+ '<div id="addBlock" class="addBlock" >'
							+ '<div id="buttons" class="buttons" >'
								+ '<a id="addCardButton" >'
									+ '<span id="addIcon" ></span>'
									+ KEYWORDS.addCard
								+ '</a>'
							+ '</div>'
							+ '<div id="addForm" class="addForm" >'
								+ '<div class="labelRow" ><textarea id="labelField" class="labelField" placeholder="' + KEYWORDS.cardTitle + '" ></textarea></div>'
								+ '<div class="buttonRow" >'
									+ '<input type="button" id="confirmAddButton" class="confirmAddButton" value="' + KEYWORDS.addTheCard + '" />'
									+ '<span id="closeButton" class="closeButton" ></span>'
								+ '</div>'
							+ '</div>'
						+ '</div>'
					+ '</div>'
				+ '</div>';

	var component = new ListComponent(html);
	component = new DraggableComponent(component, true);
	component.ghostClass = 'ghost-kanbanColumn';
	component.virtualClass = 'virtual-kanbanColumn';
	component.setNode(component.getById('list'));
	
	var closeLabelIcon = Loader.getSVG('icons', 'black-close-icon', 16, 16);
	component.getById('closeLabelIcon').appendChild(closeLabelIcon);
	
	var addIcon = Loader.getSVG('icons', 'plus-icon', 20, 20);
	component.getById('addIcon').appendChild(addIcon);
	
	var closeIcon = Loader.getSVG('icons', 'close-icon', 24, 24);
	component.getById('closeButton').appendChild(closeIcon);

	var removeIcon = Loader.getSVG('icons', 'close-icon', 17, 17);
	component.getById('removeIcon').appendChild(removeIcon);
	
	var parent = null;
	
	/*
{{INSERT CODE}}
	//*/

	//////////////
	// Méthodes //
	//////////////
	
	this.addCard = function($card) 
	{
		var list = $this.addToList($card);
		$this.autoResize();
		onChange($card);
		return list;
	};

	this.insertCardInto = function($card, $index) 
	{
		var list = $this.insertIntoListAt($card, $index);
		$this.autoResize();
		onChange($card);
		return list;
	};

	this.removeCard = function($card)
	{
		var list = $this.removeFromList($card);
		$this.autoResize();
		return list;
	};

	this.empty = function()
	{
		var list = $this.removeAllFromList();
		$this.autoResize();
		return list;
	};
	
	var resize = function()
	{
		//console.log(component.getById('list-canvas').scrollHeight + ', ' + component.getById('list-canvas').offsetHeight);
		
		if (component.getById('list-canvas').scrollHeight > component.getById('list-canvas').offsetHeight)
		{
			//component.getById('list-canvas').style.paddingRight = '6px';
			component.getById('list-canvas').style.overflowY = 'scroll';
		}
		else
			component.getById('list-canvas').removeAttribute('style');
	};
	
	this.autoResize = function()
	{
		var width = component.offsetWidth;
		
		if (width > 0)
			resize();
		else
			setTimeout(function() { $this.autoResize(); }, 20);
	};
	
	var onCloseAddForm = function($emitter)
	{
		//if (parent.containsInChildren($emitter))
		{
			component.getById('innerColumn').removeClass("adding-card");
			label = component.getById('editLabelInput').value;
			component.getById('label').innerHTML = label;
			component.getById('editLabelBlock').style.display = 'none';
			component.getById('label').style.display = 'block';
		}
	};

	var onHideRemoveIcon = function()
	{
		component.getById('removeIcon').style.display = 'none';
	};
	
	// A surcharger
	this.createCard = function($label)
	{
		var newCard = new KanbanCard($label, sorted);
		return newCard;
	};
	
	// A surcharger
	this.testSort = function($elementI, $elementJ) { return $elementI.getLabel() > $elementJ.getLabel(); };
	this.sortCards = function() { $this.sortList(); };
	
	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////

	this.initElementEvents = function($card)
	{
		$card.setSorted(sorted);
		$card.onDrag = function($x, $y, $card2) { return (editMode === true) ? $this.onDrag($x, $y, $card2) : null; };
		$card.onRelease = function($card2, $index) { return (editMode === true) ? $this.onRelease($card2, $index) : null; };
		$card.onChange = function($data) { onChange($data); };
		$card.setEditMode(editMode);
	};

	this.removeElementEvents = function($card)
	{
		$card.onDrag = function() {};
		$card.onRelease = function() {};
		$card.onChange = function() {};
	};
	
	this.onChange = function($data) {};
	var onChange = function($data) { $this.onChange($data); };

	removeIcon.onMouseDown = function() {};

	removeIcon.onClick = function($event)
	{
		var popupHTML = '<h3>' + KEYWORDS.removeTheList + '</h3><p>' + KEYWORDS.confirmRemoveTheList + '</p>';

			var confirmPopup = new ConfirmPopup(popupHTML);

			confirmPopup.onOk = async function()
			{
				if (parent && parent.removeColumn)
					parent.removeColumn($this);

				confirmPopup.hide();
				return true;
			};

			document.getElementById('main').appendChild(confirmPopup);
	};

	component.getById('label').onMouseDown = function() {};
	
	component.getById('label').onClick = function()
	{
		Events.emit('onCloseKanbanAddForm', [$this]);
		
		if (editMode === true)
		{
			component.getById('label').style.display = 'none';
			component.getById('editLabelBlock').style.display = 'block';
			component.getById('editLabelInput').focus();
			
			if (utils.isset(component.getById('editLabelInput').select))
				component.getById('editLabelInput').select();
			else
				component.getById('editLabelInput').setSelectionRange(0, component.getById('editLabelInput').length);
		}
	};

	component.getById('closeLabelIcon').onMouseDown = function() {};
	
	component.getById('closeLabelIcon').onClick = component.getById('closeLabelIcon').onMouseDown = function()
	{
		label = component.getById('editLabelInput').value;
		component.getById('label').innerHTML = label;
		component.getById('label').style.display = 'block';
		component.getById('editLabelBlock').style.display = 'none';
	};
	
	component.getById('addForm').onMouseDown = function() {};
	component.getById('addForm').onMouseUp = function() {};
	component.getById('addForm').onClick = function() {};
	
	component.getById('addCardButton').onMouseDown = function() {};

	component.getById('addCardButton').onClick = function()
	{
		Events.emit('onCloseKanbanAddForm', [$this]);
		component.getById('innerColumn').addClass("adding-card");
		
		if (utils.isset(component.getById('list-canvas').scrollTo))
			component.getById('list-canvas').scrollTo(0, component.getById('list-canvas').scrollHeight);
		else
			component.getById('list-canvas').scrollTop = component.getById('list-canvas').scrollHeight;
		
		component.getById('labelField').value = '';
		component.getById('labelField').focus();
	};

	component.getById('closeButton').onMouseDown = function() {};
	
	component.getById('closeButton').onClick = function()
	{
		component.getById('innerColumn').removeClass("adding-card");
		Events.emit('onCloseKanbanAddForm', [$this]);
	};

	component.getById('confirmAddButton').onMouseDown = function() {};
	
	component.getById('confirmAddButton').onClick = function()
	{
		var newLabel = component.getById('labelField').value;
		
		if (utils.isset(newLabel) && newLabel !== '')
		{
			var newCard = $this.createCard(newLabel);
			$this.addCard(newCard);
			component.getById('innerColumn').removeClass("adding-card");
			
			if (utils.isset(component.getById('list-canvas').scrollTo))
				component.getById('list-canvas').scrollTo(0, component.getById('list-canvas').scrollHeight);
			else
				component.getById('list-canvas').scrollTop = component.getById('list-canvas').scrollHeight;
		}
	};
	
	//// Déclenchement du drag & drop ////

	component.isEditable = function() { return editMode; };
	component.onDraggableMouseDown = function() { Events.emit('onCloseKanbanAddForm', [$this]); };
	component.onCreateGhost = function() { Events.emit('onCloseKanbanAddForm', [$this]); };
	component.onStartDrag = function() { Events.emit('onCloseKanbanAddForm', [$this]); };
	component.onDraggableMouseUp = function() { Events.emit('onCloseKanbanAddForm', [$this]); };

	component.updateVirtualItem = function($parentNode, $overLayer, $virtualItem, $mousePosition)
	{
		var parentNode = $parentNode;

		if ($overLayer.isClass('kanban'))
		{
			parentNode = $overLayer.getById('columnsList');
			parentNode.appendChild($virtualItem);
		}
		else
		{
			if ($overLayer.isColumn === true)
			{
				parentNode = $overLayer.parentNode;
				parentNode.insertBefore($virtualItem, $overLayer);
			}
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
		else
			component.execAllEvents([ 'onKeyUp' ], $event);
	};
	
	this.onResize = function() { resize(); };
	
	component.connect('onCloseKanbanAddForm', onCloseAddForm);
	
	////////////////
	// Accesseurs //
	////////////////

	// GET

	this.getCardsList = function() { return component.getList(); };

	this.getJSON = function()
	{
		var jsonData  = { "label": label, "sorted": sorted, "editMode": editMode, "cardsList": [] };
		jsonData.cardsList = component.getList().map(function($card) { return $card.getLabel(); });
		return jsonData;
	};
	
	//// Détecter si l'élement est survolé ////
	
	this.getOverLayer = function($x, $y, $movingElement)
	{
		var overLayer = null;
		var isMouseOver = false;
		
		var nodeToCheck = component;
		var virtualItem = component.getVirtualItem();
		
		if ($movingElement === $this && virtualItem)
			nodeToCheck = virtualItem;
		
		var position = nodeToCheck.position();
		var margin = component.getMargin();
		
		//if ($x >= position.x-marginLeft && $x <= position.x + nodeToCheck.offsetWidth+marginRight)
		if ($x >= position.x && $x <= position.x + nodeToCheck.offsetWidth)
		{
			isMouseOver = true;
			overLayer = $this;
		}
		
		if (isMouseOver === true && $movingElement.isCard === true)
		{
			overLayer = component.testAll('getOverLayer', [$x, $y, $movingElement], function($overLayer) { return $overLayer; });
			isMouseOver = overLayer ? true : false;
		}
		
		//if (isMouseOver !== true && $x >= position.x-marginLeft && $x <= position.x + nodeToCheck.offsetWidth+marginRight)
		if (isMouseOver !== true && $x >= position.x && $x <= position.x + nodeToCheck.offsetWidth)
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
			var column = previousSibling.getAttribute('column');
			
			if (column === 'column')
				i++;
			
			previousSibling = previousSibling.previousSibling;
		}
	
		return i;
	};
	
	this.isSorted = function() { return sorted; };
	
	this.isLast = function()
	{
		var isLast = false;
		
		if (utils.isset(parent))
		{
			if (parent.getColumnsList()[parent.getColumnsList().length-1] === $this)
				isLast = true;
			else if (parent.getColumnsList()[parent.getColumnsList().length-2] === $this && parent.getColumnsList()[parent.getColumnsList().length-1].isDragging() === true)
				isLast = true;
		}
		
		return isLast;
	}
	
	this.isDragging = function() { return dragging; };

	// SET
	
	this.setLabel = function($label)
	{
		label = $label;
		component.getById('label').innerHTML = label;
		component.getById('editLabelInput').value = label;
	};
	
	this.setSorted = function($sorted) { sorted = $sorted; };
	this.setParent = function($parent) { parent = $parent; };
	
	this.setEditMode = function($editMode)
	{
		editMode = $editMode;
		
		if (editMode === true)
			component.getById('innerColumn').addClass('edit-mode');
		else
			component.getById('innerColumn').addClass('edit-mode');
		
		component.execAll([ 'setEditMode' ], [ editMode ]);
	};

	this.loadFromJSON = function($json)
	{
		label = $json.label;
		sorted = $json.sorted;
		editMode = $json.editMode;

		$this.addCard($json.cardsList.map(function($card) { return new KanbanCard($card, sorted); }));
	};
	
	//////////////
	// Héritage //
	//////////////

	var $this = utils.extend(component, this);
	this.autoResize();
	return $this; 
}