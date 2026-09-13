function Frame($content, $title)
{
	///////////////
	// Attributs //
	///////////////

	var focus = false;
	var content = $content;
	var title = $title;
	var minWidth = 350;
	var minHeight = 250;
	var width = 350;
	var height = 250;
	var x = 0;
	var y = 35;
	
	if (!utils.isset(title))
		title = '';

	this.frame = true;

	var html = '<div class="frame" >'
					+ '<div class="innerFrame" >'
						+ '<div id="backgroundTitleBlock" class="backgroundTitleBlock" >'
							+ '<div id="backgroundTitle" class="backgroundTitle" >' + title + '</div>'
							+ '<div class="wall" ></div>'
						+ '</div>'
						+ '<div id="titleBlock" class="titleBlock" >'
							+ '<div id="title" class="title" >' + title + '</div>'
							+ '<div class="wall" ></div>'
						+ '</div>'
						+ '<div id="buttonsBlock" class="buttonsBlock" >'
							+ '<Icon id="closeIcon" fileName="icons" name="close-icon" width="20" height="20" ></Icon>'
							+ '<Icon id="hideFrameIcon" fileName="icons" name="hide-frame-icon" width="20" height="20" ></Icon>'
							+ '<Icon id="fullscreenModeIcon" fileName="icons" name="fullscreen-mode-icon" width="20" height="20" ></Icon>'
							+ '<Icon id="frameModeIcon" fileName="icons" name="frame-mode-icon" width="20" height="20" ></Icon>'
						+ '</div>'
						+ '<div id="content" class="content" >'
							+ content
						+ '</div>'
						+ '<div id="resizeLeft" class="resizeLeft" ></div>'
						+ '<div id="resizeRight" class="resizeRight" ></div>'
						+ '<div id="resizeTop" class="resizeTop" ></div>'
						+ '<div id="resizeBottom" class="resizeBottom" ></div>'
						+ '<div id="resizeTL" class="resizeTL" ></div>'
						+ '<div id="resizeTR" class="resizeTR" ></div>'
						+ '<div id="resizeBL" class="resizeBL" ></div>'
						+ '<div id="resizeBR" class="resizeBR" ></div>'
					+ '</div>'
				+ '</div>';

	var component = new Component(html);
	
	var closeIcon = component.getById('closeIcon');
	var hideIcon = component.getById('hideFrameIcon');
	var fullscreenModeIcon = component.getById('fullscreenModeIcon');
	var frameModeIcon = component.getById('frameModeIcon');

	// Style

	component.addConfigStyle("popup", function ()
	{
		return {
			common:
			{
				'this':
				{
					border: (function() { return STYLE.frameBorder; })(),
					borderRadius: (function() { return STYLE.frameBorderRadius; })(),
					backgroundColor: (function() { return STYLE.frameBackGroundColor; })(),
					boxShadow: (function() { return STYLE.frameBoxShadow; })(),
				},
				
				'backgroundTitle':
				{
					display: (function() { return STYLE.frameBgTitleDisplay; })(),
				},

				'content': { border: (function() { return STYLE.innerFrameBorder; })(), },

				'multi-tag':
				{
					'.frame': [ 'background-color: ' + (function() { return STYLE.frameBackGroundColor; })(), ],
					'.blurFrame':
					[
						'border: ' + (function() { return STYLE.blurFrameBorder; })(),
						'background-color: ' + (function() { return STYLE.blurFrameBackgroundColor; })(),
						'box-shadow: ' + (function() { return STYLE.blurFrameBoxShadow; })(),
					],

					'.blurFrame .title': [ 'color: ' + (function() { return STYLE.blurFrameTitleColor; })() ],
					'.blurFrame .content': [ 'border: ' + (function() { return STYLE.blurFrameContentBorder; })() ],
				}
			},
		};
	});

	component.applyConfigStyle();
	
	hideIcon.style.display = 'none';
	frameModeIcon.style.display = 'none';

	component.style.minWidth = width + 'px';
	component.style.minHeight = height + 'px';
	component.style.width = width + 'px';
	component.style.height = height + 'px';

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
	
	// Drag & drop
	var clicked = false;
	var moved = false;
	
	var draggingAll = false;
	var draggingLeft = false;
	var draggingRight = false;
	var draggingTop = false;
	var draggingBottom = false;
	var draggingTL = false;
	var draggingTR = false;
	var draggingBL = false;
	var draggingBR = false;
	var startX = 0;
	var startY = 0;
	var offsetX = 0;
	var offsetY = 0;
	var previousX = 0;
	var previousY = 0;
	
	var displayed = false;
	var fullscreen = false;
	
	//////////////
	// Méthodes //
	//////////////

	this.display = function()
	{
		displayed = true;
		document.getElementById('main').appendChild($this);
		
		requestAnimationFrame(function()
		{
			Components.addFrame($this);
			Components.focusFrame($this);
		});
	};

	this.onHide = function() { return true; };

	this.hide = function()
	{
		requestAnimationFrame(function()
		{
			var confirmHide = $this.onHide();
		
			if (confirmHide !== false)
			{
				if (utils.isset(component) && utils.isset(component.parentNode))
					component.parentNode.removeChild(component);
				
				if (utils.isset($this.blur) && $this instanceof Window)
					$this.blur();
				
				$this.unconnectAll();
				
				Components.removeFrame($this);
				Components.focusLastFrame();
				
				var index = document.getElementById('main').onClick.indexOf(onMouseMove);
		
				if (index >= 0)
					document.getElementById('main').onClick.splice(index, 1);
				
				index = document.getElementById('main').onClick.indexOf(onMouseUp);
		
				if (index >= 0)
					document.getElementById('main').onClick.splice(index, 1);

				displayed = false;
				$this.onBlurFrame();
			}
			
		});
	};
	
	this.close = this.hide;
	
	this.onFocusFrame = function()
	{
		focus = true;
		$this.setAttribute('class', 'frame');
	};

	this.onBlurFrame = function()
	{
		focus = false;
		$this.setAttribute('class', 'frame blurFrame');
	};
	
	this.appendContent = function($content)
	{
		content = $content;
		component.getById('content').removeAllChildren();
		component.getById('content').appendChild($content);
	};

	////////////////////////////
	// Gestion des événements //
	////////////////////////////

	closeIcon.onClick = function() { $this.hide(); };
	
	fullscreenModeIcon.onClick = function()
	{
		fullscreen = true;

		component.style.left = '0px';
		component.style.right = '0px';
		component.style.top = '35px';
		component.style.bottom = '0px';
		component.style.width = 'unset';
		component.style.height = 'unset';
		
		fullscreenModeIcon.style.display = 'none';
		frameModeIcon.style.display = 'inline-block';
		
		$this.onResize();
	};
	
	frameModeIcon.onClick = function()
	{
		fullscreen = false;
		
		component.style.left = x + 'px';
		component.style.right = 'unset';
		component.style.top = y + 'px';
		component.style.bottom = 'unset';
		component.style.width = width + 'px';
		component.style.height = height + 'px';
		
		fullscreenModeIcon.style.display = 'inline-block';
		frameModeIcon.style.display = 'none';
		
		$this.onResize();
	};
	
	component.getById('content').onClick = function() { Components.focusFrame($this); };
	component.getById('content').onMouseDown = function() { Components.focusFrame($this); };
	closeIcon.onMouseDown = function() { Components.focusFrame($this); };
	hideIcon.onMouseDown = function() { Components.focusFrame($this); };
	fullscreenModeIcon.onMouseDown = function() { Components.focusFrame($this); };
	frameModeIcon.onMouseDown = function() { Components.focusFrame($this); };
	
	var onMouseDown = function($event, $component)
	{
		document.getElementById('main').appendChild(dragScreen);
		Components.addIceRink(dragScreen);
		var titleWidth = component.getById('title').offsetWidth;
		var buttonsBlockWidth = component.getById('buttonsBlock').offsetWidth;
		var marginLeft = parseInt(component.getById('content').getStyle('margin-left').replace('px', ''));
		var margin = 2*(buttonsBlockWidth-marginLeft);
		var newMinWidth = titleWidth+margin;
		
		if (newMinWidth > minWidth)
			minWidth = newMinWidth;
		
		var mouseX = $event.clientX + component.parentNode.scrollLeft;
		var mouseY = $event.clientY + component.parentNode.scrollTop;
		var componentInitPosition = $component.position();
		console.log("Mouse position : " + x + ", " + y);
		console.log(componentInitPosition);
		var componentInitX = componentInitPosition.x;
		var componentInitY = componentInitPosition.y;
		startX = mouseX;
		startY = mouseY;
		previousX = mouseX;
		previousY = mouseY;
		offsetX = startX-componentInitX;
		offsetY = startY-componentInitY;
	};
	
	component.onMouseDown = function($event)
	{
		Events.preventDefault($event);
		Components.focusFrame($this);
		
		if (fullscreen !== true && $event.button === 0)
		{
			draggingAll = true;
			onMouseDown($event, component);
		}

		return false;
	};
	
	component.getById('resizeLeft').onMouseDown = function($event)
	{
		Events.preventDefault($event);
		Components.focusFrame($this);
		
		if (fullscreen !== true && $event.button === 0)
		{
			draggingLeft = true;
			onMouseDown($event, component.getById('resizeLeft'));
		}

		return false;
	};
	
	component.getById('resizeRight').onMouseDown = function($event)
	{
		Events.preventDefault($event);
		Components.focusFrame($this);
		
		if (fullscreen !== true && $event.button === 0)
		{
			draggingRight = true;
			onMouseDown($event, component.getById('resizeRight'));
		}

		return false;
	};
	
	component.getById('resizeTop').onMouseDown = function($event)
	{
		Events.preventDefault($event);
		Components.focusFrame($this);
		
		if (fullscreen !== true && $event.button === 0)
		{
			draggingTop = true;
			onMouseDown($event, component.getById('resizeTop'));
		}

		return false;
	};
	
	component.getById('resizeBottom').onMouseDown = function($event)
	{
		Events.preventDefault($event);
		Components.focusFrame($this);
		
		if (fullscreen !== true && $event.button === 0)
		{
			draggingBottom = true;
			onMouseDown($event, component.getById('resizeBottom'));
		}

		return false;
	};
	
	component.getById('resizeTL').onMouseDown = function($event)
	{
		Events.preventDefault($event);
		Components.focusFrame($this);
		
		if (fullscreen !== true && $event.button === 0)
		{
			draggingTL = true;
			onMouseDown($event, component.getById('resizeTL'));
		}

		return false;
	};
	
	component.getById('resizeTR').onMouseDown = function($event)
	{
		Events.preventDefault($event);
		Components.focusFrame($this);
		
		if (fullscreen !== true && $event.button === 0)
		{
			draggingTR = true;
			onMouseDown($event, component.getById('resizeTR'));
		}

		return false;
	};
	
	component.getById('resizeBL').onMouseDown = function($event)
	{
		Events.preventDefault($event);
		Components.focusFrame($this);
		
		if (fullscreen !== true && $event.button === 0)
		{
			draggingBL = true;
			onMouseDown($event, component.getById('resizeBL'));
		}

		return false;
	};
	
	component.getById('resizeBR').onMouseDown = function($event)
	{
		Events.preventDefault($event);
		Components.focusFrame($this);
		
		if (fullscreen !== true && $event.button === 0)
		{
			draggingBR = true;
			onMouseDown($event, component.getById('resizeBR'));
		}

		return false;
	};
	
	this.onDrag = function($x, $y) { return null; };
	this.onRelease = function($element, $index) {};
	
	var onMouseMove = function($event)
	{
		if (fullscreen !== true)
		{
			Events.preventDefault($event);
	
			var mouseX = $event.clientX + (utils.isset(component.parentNode) ? component.parentNode.scrollLeft : 0);
			var mouseY = $event.clientY + (utils.isset(component.parentNode) ? component.parentNode.scrollTop : 0);
			
			var deltaX = mouseX - previousX;
			var deltaY = mouseY - previousY;
			
			if (draggingAll === true)
			{
				x = mouseX - offsetX;
				y = mouseY - offsetY;
		
				component.style.left = x + 'px';
				component.style.top = y + 'px';
			}
			else
			{
				if (draggingLeft === true || draggingTL === true || draggingBL === true)
				{
					width = width - deltaX;
					
					if (width > minWidth)
					{
						x = mouseX - offsetX;
						component.style.left = x + 'px';
						component.style.width = width + 'px';
						$this.onResize();
					}
				}
				
				if (draggingTop === true || draggingTL === true || draggingTR === true)
				{
					height = height - deltaY;
					
					if (height > minHeight)
					{
						y = mouseY - offsetY;
						component.style.top = y + 'px';
						component.style.height = height + 'px';
						$this.onResize();
					}
				}
				
				if (draggingRight === true || draggingTR === true || draggingBR === true)
				{
					width = width + deltaX;
					
					if (width > minWidth)
					{
						component.style.width = width + 'px';
						$this.onResize();
					}
				}
				
				if (draggingBottom === true || draggingBL === true || draggingBR === true)
				{
					height = height + deltaY;
					
					if (height > minHeight)
					{
						component.style.height = height + 'px';
						$this.onResize();
					}
				}
			}
			
			previousX = mouseX;
			previousY = mouseY;
		}
	};
	
	var onMouseUp = function($event)
	{
		document.getElementById('main').removeChild(dragScreen);
		Components.removeIceRink(dragScreen);
		draggingAll = false;
		draggingLeft = false;
		draggingRight = false;
		draggingTop = false;
		draggingBottom = false;
		draggingTL = false;
		draggingTR = false;
		draggingBL = false;
		draggingBR = false;
	};
	
	this.onKeyDown = null;
	this.onKeyUp = null;

	// Pour empêcher de déclencher les événements de la fenêtre quand on clique dans son contenu
	component.getById('content').onMouseDown = function($event) {};
	component.getById('content').onMouseMove = function($event) {};

	dragScreen.onMouseMove = onMouseMove;
	dragScreen.onMouseUp = onMouseUp;
	
	this.onResize = function()
	{
		var contentElement = component.getById('content').firstChild;
		
		if (utils.isset(contentElement) && utils.isset(contentElement.onResize))
			contentElement.onResize();
	};

	////////////////
	// Accesseurs //
	////////////////

	// GET

	this.isDisplayed = function() { return displayed; };
	this.hasFocus = function() { return focus; };
	
	// SET
	
	this.setTitle = function($title)
	{
		title = $title;
		
		if (!utils.isset(title))
			title = '';
		
		component.getById('title').innerHTML = title;
		component.getById('backgroundTitle').innerHTML = title;
	};
	
	this.setPosition = function($x, $y)
	{
		x = $x;
		y = $y;
		
		$this.style.left = x + 'px';
		$this.style.top = y + 'px';
	};
	
	this.setMinDimensions = function($width, $height)
	{
		minWidth = $width;
		minHeight = $height;
		
		if (minWidth < 10)
			minWidth = 10;
		
		if (minHeight < 10)
			minHeight = 10;
		
		component.style.minWidth = minWidth + 'px';
		component.style.minHeight = minHeight + 'px';
	};
	
	this.setMinWidth = function($width)
	{
		minWidth = $width;
		
		if (minWidth < 10)
			minWidth = 10;
		
		component.style.minWidth = minWidth + 'px';
	};
	
	this.setMinHeight = function($height)
	{
		minHeight = $height;
		
		if (minHeight < 10)
			minHeight = 10;
		
		component.style.minHeight = minHeight + 'px';
	};
	
	this.setDimensions = function($width, $height)
	{
		width = $width;
		height = $height;
		
		if (width < minWidth)
			width = minWidth;
		
		if (height < minHeight)
			height = minHeight;

		component.style.width = width + 'px';
		component.style.height = height + 'px';
	};
	
	this.setWidth = function($width)
	{
		width = $width;
		
		if (width < minWidth)
			width = minWidth;
		
		component.style.width = width + 'px';
	};
	
	this.setHeight = function($height)
	{
		height = $height;
		
		if (height < minHeight)
			height = minHeight;
		
		component.style.height = height + 'px';
	};
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	return $this; 
}