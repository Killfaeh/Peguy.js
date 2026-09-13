function HorizontalSlide($leftPanel, $rightPanel, $minSize, $fixedSide)
{
	///////////////
	// Attributs //
	///////////////
	
	this.LEFT = 'left';
	this.RIGHT = 'right';
	
	var leftPanel = $leftPanel;
	var rightPanel = $rightPanel;
	var minSize = $minSize;
	var fixedSide = $fixedSide;
	
	if (!utils.isset(minSize) || minSize < 100)
		minSize = 100;
	
	if (!utils.isset(fixedSide))
		fixedSide = this.LEFT;
	
	var html = '<div id="horizontalSlide" class="horizontalSlide" ><div id="slideButton" class="slideButton" ></div><div class="wall" ></div></div>';
				
	var component = new DraggableComponent(html, false, false, true);

	/*
// Style

component.addConfigStyle("horizontalSlide", function ()
{
	return {
		common:
		{
	"multi-tag": {},
	"slideButton": {
		"border": (function() { return STYLE.horizontalSlideBorder; })(),
		"boxShadow": (function() { return STYLE.horizontalSlideBoxShadow; })()
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

	var deltaLeft = 0;
	var deltaRight = 0;
	
	//////////////
	// Méthodes //
	//////////////
	
	var autoUpdate = function()
	{
		var currentWidth = $this.offsetWidth;
		
		if (currentWidth <= 0)
			setTimeout(function() { autoUpdate(); }, 20);
		else
		{
			var leftPosition = leftPanel.offsetLeft + leftPanel.offsetWidth;
			var rightPosition = rightPanel.offsetLeft;
			var slidePosition = (leftPosition + rightPosition)/2.0;
			var left = slidePosition - currentWidth/2.0;
			$this.style.left = left + 'px';
			
			deltaLeft = leftPosition - left;
			deltaRight = rightPosition - left;
		}
	};
	
	///////////////////////////////////
	// Initialisation des événements //
	///////////////////////////////////

	component.onDragElement = function($x, $y)
	{
		var x = $x;

		var parentWidth = component.offsetParent.offsetWidth;

		if (component.offsetParent)
		{
			if (x < minSize)
				x = minSize;
			else if (x > parentWidth - minSize)
				x = parentWidth - minSize;
		}
		else
			x = 0;

		var leftMargin = leftPanel.getMargin();
		var leftPadding = leftPanel.getPadding();
		var leftBorder = leftPanel.getBorder();

		var rightMargin = rightPanel.getMargin();
		var rightPadding = rightPanel.getPadding();
		var rightBorder = rightPanel.getBorder();

		var leftPanelOffsetWidth = leftPadding.left + leftPadding.right + leftBorder.left + leftBorder.right;
		var rightPanelOffsetWidth = rightPadding.left + rightPadding.right + rightBorder.left + rightBorder.right;

		component.getById('horizontalSlide').style.left = x + 'px';

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

		if (leftPanel.onResize)
			leftPanel.onResize();
		
		if (rightPanel.onResize)
			rightPanel.onResize();
	};
	
	this.onResize = function() { autoUpdate(); };
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	autoUpdate();
	return $this;
}