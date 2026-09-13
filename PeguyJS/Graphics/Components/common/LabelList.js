function LabelList()
{
	////////////////
	// Attributes //
	////////////////
	
	var html = '<div class="labelList" ></div>';

	var component = new ListComponent(html);

	var template = '';

	/*
// Style

component.addConfigStyle("labelList", function ()
{
	return {
		common:
		{
	"multi-tag": {},
	"label": {
		"border": (function() { return STYLE.labelListBorder; })(),
		"backgroundColor": (function() { return STYLE.labelListBackgroundColor; })()
	},
	"closeLabel": {
		"color": (function() { return STYLE.labelListColor; })()
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

	/////////////
	// Methods //
	/////////////

	this.addLabel = function($label) { return $this.addToList($label); };
	this.insertLabelInto = function($label, $index) { return $this.insertIntoListAt($label, $index); };
	this.removeLabel = function($label) { return $this.removeFromList($label); };
	this.removeAllLabel = function() { return $this.removeAllFromList(); };

	///////////////////////
	// Getters & Setters //
	///////////////////////

	// GET

	this.getLabelList = function() { return component.getList(); };
	this.getElementJSON = function($label) { return $label.getLabel(); };

	this.getCode = function() { return $this.getList().reduce(function($code, $label) { return $code + template.replaceAll('{{LABEL}}', $label.getLabel()); }, ''); };

	// SET

	this.setLabelList = function($labelList) { $this.setList($labelList); };
	this.loadElementFromJSON = function($label) { return new Label($label); };

	this.setTemplate = function($template) { template = $template; };

	////////////
	// Extend //
	////////////

	var $this = utils.extend(component, this);
	return $this;
}