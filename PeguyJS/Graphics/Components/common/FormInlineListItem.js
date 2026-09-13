function FormInlineListItem($config)
{
	////////////////
	// Attributes //
	////////////////

	var item = new ListItem('');
	var formInline = new FormInline($config, true);
	item.getById('list-label').appendChild(formInline);

	/*
{{INSERT CODE}}
	//*/

	/////////////
	// Methods //
	/////////////

	this.loadFromJSON = function($json) { return formInline.loadFromJSON($json); };
	this.generateComponentCode = function($json) { return formInline.generateComponentCode($json); };

	/////////////////
	// Init events //
	/////////////////

	///////////////////////
	// Getters & Setters //
	///////////////////////

	// GET

	this.getJSON = function() { return formInline.getJSON(); };
	this.getCode = function() { return formInline.getCode(); };
	this.get = function($name) { return formInline.get($name); };

	// SET

	this.setTemplate = function($template) { formInline.setTemplate($template); };
	this.set = function($name, $value) { return formInline.set($name, $value); };

	////////////
	// Extend //
	////////////

	var $this = utils.extend(item, this);
	$this.getParent = formInline.getParent;
	$this.setParent = formInline.setParent;
	return $this;
}