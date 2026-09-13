function VerticalSlide($topPanel, $bottomPanel, $minSize, $fixedSide)
{
	///////////////
	// Attributs //
	///////////////
	
	this.TOP = 'top';
	this.BOTTOM = 'bottom';
	
	var topPanel = $topPanel;
	var bottomPanel = $bottomPanel;
	var minSize = $minSize;
	var fixedSide = $fixedSide;
	
	if (!utils.isset(minSize) || minSize < 100)
		minSize = 100;
	
	if (!utils.isset(fixedSide))
		fixedSide = this.TOP;
	
	var html = '<div id="verticalSlide" class="verticalSlide" ><div id="slideButton" class="slideButton" ></div><div class="wall" ></div></div>';
				
	var component = new DraggableComponent(html, false, true);

	/*
// Style

component.addConfigStyle("verticalSlide", function ()
{
	return {
		common:
		{
	"multi-tag": {},
	"slideButton": {
		"border": (function() { return STYLE.verticalSlideBorder; })(),
		"boxShadow": (function() { return STYLE.verticalSlideBoxShadow; })()
	}
},
		
		classic:
		{},
		
		mobile:
		{},
	};
});

component.applyConfigStyle();
	//*/

	var deltaTop = 0;
	var deltaBottom = 0;
	
	//////////////
	// Méthodes //
	//////////////
	
	var autoUpdate = function()
	{
		var currentHeight = $this.offsetHeight;
		
		if (currentHeight <= 0)
			setTimeout(function() { autoUpdate(); }, 20);
		else
		{
			var topPosition = topPanel.offsetTop + topPanel.offsetHeight;
			var bottomPosition = bottomPanel.offsetTop;
			var slidePosition = (topPosition + bottomPosition)/2.0;
			var top = slidePosition - currentHeight/2.0;
			$this.style.top = top + 'px';
			
			deltaTop = topPosition - top;
			deltaBottom = bottomPosition - top;
		}
	};
	
	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////

	component.onDragElement = function($x, $y)
	{
		var y = $y;

		var parentHeight = component.offsetParent.offsetHeight;

		if (component.offsetParent)
		{
			if (y < minSize)
				y = minSize;
			else if (y > parentHeight - minSize)
				y = parentHeight - minSize;
		}
		else
			y = 0;

		var topMargin = topPanel.getMargin();
		var topPadding = topPanel.getPadding();
		var topBorder = topPanel.getBorder();

		var bottomMargin = bottomPanel.getMargin();
		var bottomPadding = bottomPanel.getPadding();
		var bottomBorder = bottomPanel.getBorder();

		var topPanelOffsetHeight = topPadding.top + topPadding.bottom + topBorder.top + topBorder.bottom;
		var bottomPanelOffsetHeight = bottomPadding.top + bottomPadding.bottom + bottomBorder.top + bottomBorder.bottom;

		component.getById('verticalSlide').style.top = y + 'px';

		if (fixedSide === $this.RIGHT)
		{
			var right = parentWidth - x - leftMargin.right;
			var offsetRight = parentWidth - rightPanel.offsetLeft - rightPanel.offsetWidth;
			var width = parentWidth - x - deltaRight - rightPanelOffsetWidth - offsetRight;
			leftPanel.style.right = right + 'px';
			rightPanel.style.left = 'unset';
			rightPanel.style.width = width + 'px';
		}
		else
		{
			var left = x + deltaRight - rightMargin.left;
			var width = x + deltaLeft - leftPanel.offsetLeft - leftPanelOffsetWidth;
			leftPanel.style.right = 'unset';
			leftPanel.style.width = width + 'px';
			rightPanel.style.left = left + 'px';
		}

		if (fixedSide === $this.BOTTOM)
		{
			var bottom = parentHeight - y - topMargin.bottom;
			var offsetBottom = parentHeight - bottomPanel.offsetTop - bottomPanel.offsetHeight;
			var height = parentHeight - y - deltaBottom - bottomPanelOffsetHeight - offsetBottom;
			topPanel.style.bottom = bottom + 'px';
			bottomPanel.style.top = 'unset';
			bottomPanel.style.height = height + 'px';
		}
		else
		{
			var top = y + deltaBottom - bottomMargin.top;
			var height = y + deltaTop - topPanel.offsetTop - topPanelOffsetHeight;
			topPanel.style.bottom = 'unset';
			topPanel.style.height = height + 'px';
			bottomPanel.style.top = top + 'px';
		}

		if (topPanel.onResize)
			topPanel.onResize();
		
		if (bottomPanel.onResize)
			bottomPanel.onResize();
	};
	
	this.onResize = function() { autoUpdate(); };
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	autoUpdate();
	return $this;
}