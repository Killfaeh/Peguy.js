function Kanban($sorted)
{
	///////////////
	// Attributs //
	///////////////
	
	this.isKanban = true;
	
	var sorted = $sorted;
	var editMode = false;
	
	var html = '<div class="kanban" >'
					+ '<div id="columnsList" class="columnsList" ></div>'
					+ '<div id="addBlock" class="addBlock" >'
						+ '<div id="addButton" class="addButton" >'
							+ '<span id="addIcon" ></span>'
							+ KEYWORDS.addList
						+ '</div>'
						+ '<div id="addForm" class="addForm" >'
							+ '<div class="labelRow" ><input id="labelField" class="labelField" type="text" placeholder="' + KEYWORDS.listTitle  + '" /></div>'
							+ '<div class="buttonRow" >'
								+ '<input type="button" id="confirmAddButton" class="confirmAddButton" value="' + KEYWORDS.addTheList + '" />'
								+ '<span id="closeButton" class="closeButton" ></span>'
							+ '</div>'
						+ '</div>'
					+ '</div>'
				+ '</div>';

	var component = new ListComponent(html);
	component.setNode(component.getById('columnsList'));
	
	var addIcon = Loader.getSVG('icons', 'plus-icon', 20, 20);
	component.getById('addIcon').appendChild(addIcon);
	
	var closeIcon = Loader.getSVG('icons', 'close-icon', 24, 24);
	component.getById('closeButton').appendChild(closeIcon);
	
	/*
{{INSERT CODE}}
	//*/

	//////////////
	// Méthodes //
	//////////////

	this.addColumn = function($column) 
	{
		var list = $this.addToList($column);
		onChange($column);
		return list;
	};

	this.insertColumnInto = function($column, $index) 
	{
		var list = $this.insertIntoListAt($column, $index);
		onChange($column);
		return list;
	};

	this.removeColumn = function($column) { return $this.removeFromList($column); };
	this.empty = function() { return $this.removeAllFromList(); };
	
	var onCloseAddForm = function($emitter)
	{
		if ($this.containsInChildren($emitter))
		{
			component.getById('addButton').style.display = 'block';
			component.getById('addForm').style.display = 'none';
		}
	};
	
	// A surcharger
	this.createColumn = function($label)
	{
		var newColumn = new KanbanColumn($label, sorted);
		return newColumn;
	};
	
	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////

	this.initElementEvents = function($column)
	{
		$column.setSorted(sorted);

		$column.onDrag = function($x, $y, $element)
		{
			var overLayer = null;
			
			if (editMode === true)
			{
				overLayer = component.testAll('getOverLayer', [$x, $y, $element], function($overLayer) { return $overLayer; });
				overLayer = overLayer ? overLayer : $this;
			}
		
			return overLayer;
		};
		
		$column.onRelease = function($element, $index)
		{
			if (editMode === true)
			{
				if ($element.isColumn === true)
				{
					$this.removeColumn($element);
					$this.insertColumnInto($element, $index);
					onChange($element);
				}
				else if ($element.isCard === true)
				{
					var oldParent = $element.getParent();
					var newParent = $element.getParentNode().column;
					
					// Retirer l'élément déplacé de l'ancien parent
					if (oldParent.removeCard)
						oldParent.removeCard($element);
					else
						console.log('POUET ! 2', oldParent, oldParent.removeCard);
					
					// Ajouter l'élément déplacé au nouveau parent
					if (newParent.insertCardInto)
					{
						newParent.insertCardInto($element, $index);
						
						if (newParent.isSorted() === true)
							newParent.sortCards();
					}
					else
						console.log('POUET ! 3', newParent, newParent.insertCardInto);
				}
				else
				{
					console.log('POUET ! 1', $element);
				}
			}
		};
		
		$column.onChange = function($data) { onChange($data); };
		$column.setEditMode(editMode);
	};

	this.removeElementEvents = function($card)
	{
		$card.onDrag = function() {};
		$card.onRelease = function() {};
		$card.onChange = function() {};
	};
	
	this.onChange = function($data) {};
	var onChange = function($data) { $this.onChange($data); };
	
	component.getById('addButton').onClick = function()
	{
		component.getById('addButton').style.display = 'none';
		component.getById('addForm').style.display = 'block';
		component.getById('labelField').value = '';
		component.getById('labelField').focus();
	};
	
	component.getById('closeButton').onClick = function()
	{
		component.getById('addButton').style.display = 'block';
		component.getById('addForm').style.display = 'none';
	};
	
	component.onClick = component.onMouseDown = function()
	{
		Events.emit('onCloseKanbanAddForm', [$this]);
		component.getById('addButton').style.display = 'block';
		component.getById('addForm').style.display = 'none';
	};
	
	component.getById('confirmAddButton').onClick = function()
	{
		var newLabel = component.getById('labelField').value;
		
		if (utils.isset(newLabel) && newLabel !== '')
		{
			var newColumn = $this.createColumn(newLabel);
			$this.addColumn(newColumn);
			component.getById('addButton').style.display = 'block';
			component.getById('addForm').style.display = 'none';
		}
	};
	
	this.onKeyUp = function($event) { component.execAllEvents([ 'onKeyUp' ], $event); };
	
	component.connect('onCloseKanbanAddForm', onCloseAddForm);
	
	////////////////
	// Accesseurs //
	////////////////

	// GET

	this.getColumnsList = function() { return component.getList(); };

	this.getJSON = function()
	{
		var jsonData = { "sorted": sorted, "editMode": editMode, "columnsList": [] };
		jsonData.columnsList = component.getList().map(function($column) { return $column.getJSON(); });
		return jsonData;
	};

	// SET
	
	this.setEditMode = function($editMode)
	{
		editMode = $editMode;
		
		if (editMode === true)
		{
			component.getById('columnsList').addClass('edit-mode');
			component.getById('addBlock').style.display = 'inline-block';
		}
		else
		{
			component.getById('columnsList').removeClass('edit-mode');
			component.getById('addBlock').style.display = 'none';
		}
		
		component.execAll([ 'setEditMode' ], [ editMode ]);
	};

	this.loadFromJSON = function($json)
	{
		label = $json.label;
		sorted = $json.sorted;

		$this.addColumn($json.columnsList.map(function($column)
		{
			var column = new KanbanColumn($column.label, sorted);
			column.loadFromJSON($column);
			return column;
		}));
	};
	
	//////////////
	// Héritage //
	//////////////

	var $this = utils.extend(component, this);
	return $this; 
}