function Desktop()
{
	///////////////
	// Attributs //
	///////////////
	
	var html = '<div class="desktop" >'
					+ '<div id="standard" class="standard" ><div id="standardIcon" class="standardIcon" ></div></div>'
					+ '<div id="listIcons" ></div>'
					+ '<div id="selectRect" class="selectRect" ></div>'
				+ '</div>';

	var component = new ListComponent(html);
	component.setNode(component.getById('listIcons'));
	
	/*
// Style

component.addConfigStyle("desktop", function ()
{
	return {
		common:
		{},
		
		classic:
		{
	"multi-tag": {},
	"desktopItemIcon": {
		"border": (function() { return STYLE.desktopBorder; })(),
		"backgroundColor": (function() { return STYLE.desktopBackgroundColor; })()
	},
	"desktopItemLabel": {
		"backgroundColor": (function() { return STYLE.desktopBackgroundColor; })(),
		"color": (function() { return STYLE.desktopColor; })()
	},
	"selectRect": {
		"border": (function() { return STYLE.desktopBorder; })(),
		"backgroundColor": (function() { return STYLE.desktopBackgroundColor; })()
	}
},
		
		mobile:
		{},
	};
});

component.applyConfigStyle();
	//*/

	//var elementsList = [];
	
	var editMode = false;
	
	// Drag & drop
	var clicked = false;
	var moved = false;
	var select = false;
	
	var dragging = false;
	var startX = 0;
	var startY = 0;
	var offsetX = 0;
	var offsetY = 0;
	
	//////////////
	// Méthodes //
	//////////////
	
	this.unselectAll = function() { component.getList().forEach(function($element) { $element.unselect(); }); };

	this.addElement = function($element)
	{
		var list = $this.addToList($element);
		updateIcons();
		return list;
	};

	this.insertElementInto = function($element, $index)
	{
		var list = $this.insertIntoListAt($element, $index);
		updateIcons();
		return list;
	};

	this.removeElement = function($element)
	{
		var list = $this.removeFromList($element);
		updateIcons();
		return list;
	};

	this.removeAllElement = function()
	{
		component.getList().forEach(function($element)
		{
			if ($element.onRemoveFromDock)
				$element.onRemoveFromDock();
		});

		return $this.removeAllFromList();
	};
	
	var updateIcons = function()
	{
		component.getById('listIcons').removeAllChildren();
		
		var width = component.offsetWidth;
		var height = component.offsetHeight;
		var nbLines = Math.floor(height/component.getById('standard').offsetHeight);
		var nbColumns = Math.ceil(component.getList().length/nbLines);
		var nbColumnsOnScreen = Math.floor(component.offsetWidth/component.getById('standard').offsetWidth);
		var iconSpaceRatio = component.getById('standardIcon').offsetWidth/component.getById('standardIcon').offsetHeight;
		
		component.getList().forEach(function($element)
		{
			var icon = $element.getIcon();
			
			if (utils.isset(icon))
			{
				var iconWidth = icon.offsetWidth;
				var iconHeight = icon.offsetHeight;
				
				if (!utils.isset(iconWidth))
				{
					iconWidth = icon.getAttribute('width');
					iconHeight = icon.getAttribute('height');
				}
				
				var iconRatio = iconWidth/iconHeight;
				
				if (iconRatio > iconSpaceRatio)
				{
					iconWidth = component.getById('standardIcon').offsetWidth;
					iconHeight = component.getById('standardIcon').offsetWidth/iconRatio;
				}
				else
				{
					iconWidth = component.getById('standardIcon').offsetHeight*iconRatio;
					iconHeight = component.getById('standardIcon').offsetHeight;
				}
				
				icon.width = iconWidth;
				icon.height = iconHeight;
				icon.setAttribute('width', iconWidth);
				icon.setAttribute('height', iconHeight);
			}
		});
		
		for (var i = 0; i < nbColumns; i++)
		{
			var column = new Component('<ul class="desktopColumn" ></ul>');
			column.style.right = (component.getById('standard').offsetWidth*(i%nbColumnsOnScreen)) + 'px';
			
			for (var j = 0; j < nbLines; j++)
			{
				if (utils.isset(component.getList()[i*nbLines + j]))
					column.appendChild(component.getList()[i*nbLines + j]);
			}
			
			column.onClick = function($event)
			{
				if (moved !== true)
					$this.unselectAll();
			};
			
			component.getById('listIcons').appendChild(column);
		}
	};
	
	this.autoResize = function()
	{
		var width = component.getById('standard').offsetWidth;
		
		if (width > 0)
		{
			// Redimensionnement ou restructuration du DOM
			updateIcons();
		}
		else
			setTimeout(function() { $this.autoResize(); }, 20);
	};
	
	var onDrag = function($x, $y, $element)
	{
		var overLayer = component.testAll('getOverLayer', [$x, $y, $element], function($overLayer) { return $overLayer; });
		return overLayer ? overLayer : $this;
	};
	
	var onRelease = function($element, $index) { $this.insertElementInto($element, $index); };
	
	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////
	
	component.onClick = function($event)
	{
		/*
		if (moved !== true)
			$this.unselectAll();
			//*/
	};
	
	component.onMouseDown = function($event)
	{
		Events.preventDefault($event);
		
		dragging = true;
		
		var mousePosition = document.getElementById('main').mousePosition($event);
		var desktopPosition = component.position();
		
		startX = mousePosition.x - desktopPosition.x;
		startY = mousePosition.y - desktopPosition.y;
		
		if ($event.button === 0)
		{
			select = true;
			component.getById('selectRect').style.left = startX + 'px';
			component.getById('selectRect').style.top = startY + 'px';
			component.getById('selectRect').style.width = '0px';
			component.getById('selectRect').style.height = '0px';
			component.getById('selectRect').style.display = "block";
		}
		
		if (Events.keyPressTable['shift'] !== true)
			$this.unselectAll();
		
		return false;
	};
	
	var onMouseMove = function($event)
	{
		if (dragging === true && select === true)
		{
			var mousePosition = document.getElementById('main').mousePosition($event);
			var desktopPosition = component.position();
			var mousePositionRelative = { x: mousePosition.x - desktopPosition.x, y: mousePosition.y - desktopPosition.y };
			
			var rectX = startX;
			var rectY = startY;
			var rectWidth = Math.abs(mousePositionRelative.x - startX);
			var rectHeight = Math.abs(mousePositionRelative.y - startY);
			
			if (startX > mousePosition.x)
				rectX = mousePosition.x;
			
			if (startY > mousePosition.y)
				rectY = mousePosition.y;
			
			component.getById('selectRect').style.left = rectX + 'px';
			component.getById('selectRect').style.top = rectY + 'px';
			component.getById('selectRect').style.width = rectWidth + 'px';
			component.getById('selectRect').style.height = rectHeight + 'px';
			
			moved = true;
		}
		else
		{
			if (editMode === true)
				component.execAllEvents([ 'mouseMove' ], $event);
		}
	};
	
	document.getElementById('main').onMouseMove.push(onMouseMove);
	
	var onMouseUp = function($event)
	{
		if (dragging !== true)
		{
			if (editMode === true)
			{
				component.execAllEvents([ 'mouseUp' ], $event);
				
				// Déclencher les interactions avec les autres composents
			
				var mousePosition = $this.mousePosition($event);
				
				var flyingElement = document.elementFromPoint(mousePosition.x, mousePosition.y);
				var flyingElements = document.elementsFromPoint(mousePosition.x, mousePosition.y);
				
				for (var i = 0; i < flyingElements.length; i++)
				{
					if (utils.isset(flyingElements[i].onDropItems))
					{
						if (Array.isArray(flyingElements[i].onDropItems))
						{
							for (var j = 0; j < flyingElements[i].onDropItems.length; j++)
								flyingElements[i].onDropItems[j]($event);
						}
						else
							flyingElements[i].onDropItems($event);
						
						i = flyingElements.length;
					}
				}

				component.execAll([ 'setDragging' ], [ false ]);
			}
		}
		else
		{
			if (select === true)
			{
				if (Events.keyPressTable['shift'] !== true)
					$this.unselectAll();
				
				// Sélectionner les icones dans le rectangle
				component.execAll([ 'isInSelectRect' ], [ component.getById('selectRect') ], function($isInSelectRect, $element)
				{
					if ($isInSelectRect === true)
						$element.addClass('selected');
				});
			}
			
			setTimeout(function() { moved = false; }, 50);
		}
		
		dragging = false;
		select = false;
		component.getById('selectRect').style.display = "none";
	};
	
	document.getElementById('main').onMouseUp.push(onMouseUp);
	
	this.onKeyUp = function($event)
	{
		if (editMode === true)
			component.execAllEvents([ 'onKeyUp' ], $event);
	};
	
	this.onEndResize = function() { updateIcons(); };
	
	//// Mécanisme pour glisser déposer des items dans d'autres composants ////
	
	var onDropItems = function($event)
	{
		var draggingItem = component.testAll('isDragging', [], function($isDragging) { return $isDragging; });
		
		if (draggingItem === true)
		{
			var selectedItems = [];
			
			component.getList().forEach(function($element)
			{
				if ($element.isClass('selected') === true)
					selectedItems.push($element);
			});
			
			Events.emit('onGetSelectedDesktopItems', [selectedItems]);
		}
	};
	
	//component.connect('onSelectNode', onSelect);
	component.connect('onDropDesktopItems', onDropItems);
	
	////////////////
	// Accesseurs //
	////////////////
	
	// GET
	
	this.isEditMode = function() { return editMode; };

	// SET
	
	this.setEditMode = function($editMode) { editMode = $editMode; };
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	this.autoResize();
	return $this;
}