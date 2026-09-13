function Slider($min, $max, $currentValue)
{
	///////////////
	// Attributs //
	///////////////
	
	var min = $min;
	var max = $max;
	var currentValue = $currentValue;

	var html = '<div class="slider" >'
					+ '<div id="bar" class="sliderBar" ></div>'
					+ '<div id="handler" class="sliderHandler" ></div>'
				+ '</div>';
	
	var component = new Component(html);

	var handler = component.getById('handler');
	handler = new DraggableComponent(handler, false, false, true);
	
	var icon = Loader.getSVG('icons', 'slider-cursor-icon', 18, 18);
	handler.appendChild(icon);

	var barWidth = component.getById('bar').offsetWidth;
	
	/*
// Style

component.addConfigStyle("slider", function ()
{
	return {
		common:
		{
	"multi-tag": {},
	"sliderBar": {
		"backgroundColor": (function() { return STYLE.sliderBackgroundColor; })()
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

	//////////////
	// Méthodes //
	//////////////
	
	var updateCursor = function()
	{
		var cursorPosition = (currentValue-min)/(max-min);
		barWidth = component.getById('bar').offsetWidth;
		handler.style.left = (barWidth*cursorPosition) + 'px';
	};
	
	this.autoResize = function()
	{
		barWidth = component.getById('bar').offsetWidth;
		
		if (barWidth > 0)
			updateCursor();
		else
			setTimeout(function() { $this.autoResize(); }, 20);
	};

	////////////////////////////
	// Gestion des événements //
	////////////////////////////
	
	this.onChange = function($value) {};

	var onChange = function($x)
	{
		barWidth = component.getById('bar').offsetWidth;
		var componentPosition = $this.position();
		var x = $x - componentPosition.x;
		handler.style.left = x + 'px';
		x = x + 9;
		var positionRatio = x/barWidth;
		currentValue = min + (max-min)*positionRatio;
		$this.onChange(currentValue);
	};

	handler.onStartDrag = function($event)
	{
		var componentPosition = $this.position();

		handler.setLimits(componentPosition.x - 9, 
							componentPosition.x + component.getById('bar').offsetWidth - 9, 
							null, null);
	};

	handler.onDragElement = function($x, $y) { onChange($x); };
	handler.onDraggableMouseUp = function($x, $y) { onChange($x); };
	
	////////////////
	// Accesseurs //
	////////////////

	// GET
	
	this.getMin = function() { return min; };
	this.getMax = function() { return max; };
	this.getCurrentValue = function() { return currentValue; };
	
	// SET
	
	this.setCurrentValue = function($value)
	{
		currentValue = $value;
		
		if (currentValue < min)
			currentValue = min;
		else if (currentValue > max)
			currentValue = max;
		
		updateCursor();
	};
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	$this.autoResize();
	return $this; 
}