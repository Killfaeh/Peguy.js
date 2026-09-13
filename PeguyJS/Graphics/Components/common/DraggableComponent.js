function DraggableComponent($html, $ghostMode, $lockedX, $lockedY)
{
	///////////////
	// Attributs //
	///////////////

	var debug = false;

	this.ghostClass = 'ghost';
	this.virtualClass = 'virtual';
	this.virtualTagName = 'div';

	var ghostMode = $ghostMode;
	var lockedX = $lockedX;
	var lockedY = $lockedY;

	var minX = null;
	var maxX = null;
	var minY = null;
	var maxY = null;

	// Eléments graphiques

	var component = new Component($html);

	var dragScreen = new Component('<div></div>');

	dragScreen.applyStyle({
		zIndex: 1000000000000000,
		position: 'absolute',
		left: '-1000px',
		right: '-1000px',
		top: '-1000px',
		bottom: '-1000px',
		cursor: 'grabbing',
	});

	var trackerIcon = new Icon('icons', 'close-icon', 20, 20);
	trackerIcon.style.zIndex = 1000000000000000;
	trackerIcon.style.position = 'absolute';

	// Drag & drop

	var clicked = false;
	var moved = false;
	
	var dragging = false;
	var startX = 0;
	var startY = 0;
	var offsetX = 0;
	var offsetY = 0;
	var previousX = 0;
	var previousY = 0;
	var lastMoveDate = new Date();
	
	var ghost = null;
	var virtualItem = null;
	var parentNode = null;
	var oldIndex = 0;
	var offsetIndex = 0;
	var currentIndex = 0;

	//////////////
	// Méthodes //
	//////////////

	var createGhost = function($mouseX, $mouseY)
	{
		trackerIcon.style.left = (startX-10) + 'px';
		trackerIcon.style.top = (startY-10) + 'px';

		var margin = component.getMargin();
		var padding = component.getPadding();
		var border = component.getBorder();

		var width = component.offsetWidth - margin.left - margin.right 
											- padding.left - padding.right
											- border.left - border.right;

		var height = component.offsetHeight - margin.top - margin.bottom 
											- padding.top - padding.bottom
											- border.top - border.bottom;

		ghost = document.createElement('div');
		ghost.setAttribute('class', $this.ghostClass);
		ghost.style.width = width + "px";
		ghost.style.height = height + "px";
		ghost.innerHTML = component.innerHTML;

		document.getElementById('main').appendChild(ghost);

		var x = startX - offsetX;
		var y = startY - offsetY;
		ghost.style.left = x + 'px';
		ghost.style.top = y + 'px';

		width = component.offsetWidth - margin.left - margin.right 
											//- padding.left - padding.right
											- border.left - border.right;

		height = component.offsetHeight - margin.top - margin.bottom 
											//- padding.top - padding.bottom
											- border.top - border.bottom;

		parentNode = component.parentNode;
		offsetIndex = component.index();
		currentIndex = offsetIndex;
		parentNode.removeChild(component);
		
		virtualItem = document.createElement($this.virtualTagName);
		virtualItem.style.width = width + "px";
		virtualItem.style.height = height + "px";
		virtualItem.setAttribute('class', $this.virtualClass);
		virtualItem.innerHTML = '<div></div>';
		parentNode.insertAt(virtualItem, offsetIndex);
	};

	var moveElement = function($element, $mouseX, $mouseY)
	{
		var border = component.getBorder();

		if (ghostMode)
			border = ghost.getBorder();

		trackerIcon.style.left = ($mouseX-10) + 'px';
		trackerIcon.style.top = ($mouseY-10) + 'px';

		var x = $mouseX - offsetX - border.left;
		var y = $mouseY - offsetY - border.top;

		if (utils.isset(minX) && x < minX)
			x = minX;
		else if (utils.isset(maxX) && x > maxX)
			x = maxX;

		if (utils.isset(minY) && y < minY)
			y = minY;
		else if (utils.isset(maxX) && y > maxY)
			y = maxY;

		if (lockedX !== true)
			$element.style.left = x + 'px';

		if (lockedY !== true)
			$element.style.top = y + 'px';

		if (ghostMode)
		{
			var overLayer = $this.onDrag(x, y, $this);

			if (overLayer && overLayer !== $this)
			{
				overLayerPosition = overLayer.position();
				overLayer.x = overLayerPosition.x;
				overLayer.y = overLayerPosition.y;
				//deltaX = $mouseX-overLayerPosition.x;
				//deltaY = $mouseY-overLayerPosition.y;
				parentNode = $this.updateVirtualItem(parentNode, overLayer, virtualItem, { x: $mouseX, y: $mouseY });
			}

			currentIndex = virtualItem.index();
		}
		else
		{
			$this.onDragElement(x, y);
			$this.onDrag(x, y, $this);
		}

		return { x: x, y: y };
	};

	this.isEditable = function() { return true; };
	this.updateVirtualItem = function($overLayer, $virtualItem) { return parentNode; };

	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////

	this.onDrag = function($x, $y) { return null; };
	this.onRelease = function($element, $index, $oldIndex) {};

	this.onDraggableMouseDown = function() {};
	this.onCreateGhost = function($event) {};
	this.onStartDrag = function($event) {};
	this.onDragElement = function() {};
	this.onRemoveVirtualItem = function() {};
	this.onDraggableMouseUp = function($x, $y) {};

	var onMouseDown = function($event)
	{
		if (!lockedX || !lockedY)
			dragging = true;

		if (dragging)
		{
			if ($this.index)
				oldIndex = $this.index();

			if (debug)
				document.getElementById('main').appendChild(trackerIcon);

			document.getElementById('main').appendChild(dragScreen);
			Components.addIceRink(dragScreen);

			var mousePosition = component.mousePosition($event);
			var componentInitPosition = component.position();
			console.log("Mouse position : ", mousePosition);
			console.log(componentInitPosition);

			//var mouseX = $event.clientX + component.parentNode.scrollLeft;
			//var mouseY = $event.clientY + component.parentNode.scrollTop;
			var mouseX = mousePosition.x;
			var mouseY = mousePosition.y;
			var componentInitX = componentInitPosition.x;
			var componentInitY = componentInitPosition.y;
			startX = mouseX;
			startY = mouseY;
			previousX = mouseX;
			previousY = mouseY;
			offsetX = startX-componentInitX;
			offsetY = startY-componentInitY;

			trackerIcon.style.left = (mouseX-10) + 'px';
			trackerIcon.style.top = (mouseY-10) + 'px';
		
			$this.onStartDrag($event);
		}
	};

	component.onMouseDown = function($event)
	{
		if ($this.isEditable())
		{
			Events.preventDefault($event);
			
			if ($event.button === 0)
				onMouseDown($event);
		}
		
		$this.onDraggableMouseDown();

		return false;
	};

	var onMouseMove = function($event)
	{
		if ($this.isEditable() && dragging === true)
		{
			Events.preventDefault($event);
	
			var mousePosition = component.mousePosition($event);
			var mouseX = mousePosition.x;
			var mouseY = mousePosition.y;
			var totalDeltaX = mouseX-startX;
			var totalDeltaY = mouseY-startY;
			var moveDistance = Math.sqrt(totalDeltaX*totalDeltaX + totalDeltaY*totalDeltaY);

			if (moveDistance > 10)
				moved = true;

			if (ghostMode)
			{
				if (!ghost)
				{
					if (moveDistance > 10)
					{
						$this.onCreateGhost();
						createGhost(mouseX, mouseY);
					}
				}

				if (ghost)
					moveElement(ghost, mouseX, mouseY);
			}
			else
				moveElement(component, mouseX, mouseY);
		}
	};

	var onMouseUp = function($event)
	{
		var hasChanged = false;

		if ($this.isEditable() && dragging === true && moved === true)
		{
			if (ghostMode && ghost && ghost.parentNode)
				document.getElementById('main').removeChild(ghost);

			if (parentNode)
			{
				if (virtualItem)
				{
					if (virtualItem.parentNode)
						parentNode = virtualItem.parentNode;

					$this.onRemoveVirtualItem(virtualItem);
					virtualItem.remove();
				}

				$this.onRelease($this, currentIndex, oldIndex);
			}

			var mousePosition = component.mousePosition($event);
			var mouseX = mousePosition.x;
			var mouseY = mousePosition.y;
			var componentPosition = moveElement(component, mouseX, mouseY);

			if (virtualItem)
				virtualItem.remove();
			
			$this.onDraggableMouseUp(componentPosition.x, componentPosition.y);

			hasChanged = true;
		}

		if (debug)
			document.getElementById('main').removeChild(trackerIcon);

		document.getElementById('main').removeChild(dragScreen);
		Components.removeIceRink(dragScreen);

		if (!moved && component.onClick)
		{
			if (clicked && component.onDblClick)
				component.onDblClick($event);

			if (!clicked && component.onClick)
				component.onClick($event);

			clicked = !clicked;

			setTimeout(function() { clicked = false; }, 250);
		}

		dragging = false;
		moved = false;
		parentNode = null;
		ghost = null;
		virtualItem = null;

		return hasChanged;
	};

	dragScreen.onMouseMove = onMouseMove;
	dragScreen.onMouseUp = onMouseUp;

	dragScreen.onClick = function() { console.log('CLICK on dragScreen'); };
	dragScreen.onDblClick = function() { console.log('DOUBLE CLICK on dragScreen'); };

	////////////////
	// Accesseurs //
	////////////////

	// GET

	this.isDragging = function() { return dragging; };
	this.hasMoved = function() { return moved; };
	this.getOffsetX = function() { return offsetX; };
	this.getOffsetY = function() { return offsetY; };
	this.getParentNode = function() { return parentNode; };
	this.getVirtualItem = function() { return virtualItem; };

	// SET

	this.setLimits = function($minX, $maxX, $minY, $maxY)
	{
		minX = $minX;
		maxX = $maxX;
		minY = $minY;
		maxY = $maxY;
	};

	//////////////
	// Héritage //
	//////////////

	var $this = utils.extend(component, this);
	return $this; 
}