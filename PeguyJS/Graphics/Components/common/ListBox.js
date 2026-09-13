function ListBox()
{
	///////////////
	// Attributs //
	///////////////
	
	var html = '<ul class="listBox" ></ul>';
				
	var component = new ListComponent(html);
	
	/*
// Style

component.addConfigStyle("listBox", function ()
{
	return {
		common:
		{
	"multi-tag": {
		".listBox .virtual-list div": [
			"background-Color: (function() { return STYLE.listBoxBackgroundColor; })(),
			"border: (function() { return STYLE.listBoxBorder; })()
		]
	},
	"listItem": {
		"borderBottom": (function() { return STYLE.listBoxBorderBottom; })()
	},
	"virtual-list": {
		"color": (function() { return STYLE.listBoxColor; })(),
		"border": (function() { return STYLE.listBoxBorder; })()
	},
	"ghost-list": {
		"border": (function() { return STYLE.listBoxBorder; })(),
		"backgroundColor": (function() { return STYLE.listBoxBackgroundColor; })(),
		"color": (function() { return STYLE.listBoxColor; })()
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

	var template = '';
	var editMode = false;
	
	//////////////
	// Méthodes //
	//////////////
	
	this.addElement = function($element) { return $this.addToList($element); };
	this.insertElementInto = function($element, $index) { return $this.insertIntoListAt($element, $index); };
	this.removeElement = function($element) { return $this.removeFromList($element); };
	this.removeAllElement = function() { return $this.removeAllFromList(); };

	this.removeAllElements = this.removeAllElement;
	this.empty = this.removeAllElement;
	
	var onDrag = function($x, $y, $element)
	{
		var overLayer = component.testAll('getOverLayer', [$x, $y, $element], function($overLayer) { return $overLayer; });
		return overLayer ? overLayer : $this;
	};
	
	var onRelease = function($item, $index) { $this.insertElementInto($item, $index); };

	////////////////////////////
	// Gestion des événements //
	////////////////////////////
	
	this.initElementEvents = function($element)
	{
		$element.onDrag = function($x, $y) { return onDrag($x, $y, $element); };
		$element.onRelease = function($el, $index) { return onRelease($el, $index); };
	};

	this.removeElementEvents = function($element)
	{
		$element.onDrag = function() {};
		$element.onRelease = function() {};
	};
	
	this.onKeyUp = function($event)
	{
		if (editMode === true)
		{
			component.execAllEvents([ 'onKeyUp' ], $event);
			$this.onChange();
		}
	};
	
	////////////////
	// Accesseurs //
	////////////////

	// GET
	
	this.getElementsList = function() { return component.getList(); };
	this.isEditMode = function() { return editMode; };

	this.getCode = function()
	{
		var code = component.getList().reduce(function($code, $el)
		{
			$el.setTemplate(template);
			return $code + $el.getCode();
		}, '');

		return code;
	};
	
	// SET
	
	this.setTemplate = function($template) { template = $template; };
	this.setEditMode = function($editMode) { editMode = $editMode; };

	this.loadElementFromJSON = function($element)
	{
		var item = new ListItem($element.label);
		item.setTemplate(template);
		item.loadFromJSON($element);

		return item;
	};
	
	//////////////
	// Héritage //
	//////////////
	
	var $this = utils.extend(component, this);
	return $this; 
}